<?php

namespace App\Http\Controllers;

use App\Models\GoogleCalendarConnection;
use Google\Client as GoogleClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleCalendarController extends Controller
{
    /**
     * GET /api/google/connect?hotel_id=xxx
     * Redirige l'hôtelier vers Google pour autoriser l'accès.
     */
    public function connect(Request $request)
    {
        $request->validate(['hotel_id' => 'required|uuid']);

        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));
        $client->addScope('https://www.googleapis.com/auth/calendar.events.freebusy');
        $client->addScope('https://www.googleapis.com/auth/calendar.events');
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        // On passe le hotel_id dans le state (anti-CSRF + transport)
        $state = base64_encode(json_encode([
            'hotel_id' => $request->hotel_id,
            'nonce' => Str::random(16),
        ]));
        $client->setState($state);

        return response()->json([
            'auth_url' => $client->createAuthUrl(),
        ]);
    }

    /**
     * GET /api/google/callback?code=xxx&state=xxx
     * Google renvoie l'hôtelier ici après consentement.
     */
    public function callback(Request $request)
    {
        $code = $request->query('code');
        $state = $request->query('state');

        if (!$code || !$state) {
            return response('Paramètres manquants.', 400);
        }

        $decoded = json_decode(base64_decode($state), true);
        $hotelId = $decoded['hotel_id'] ?? null;

        if (!$hotelId) {
            return response('State invalide.', 400);
        }

        // Échange du code contre les tokens
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => config('services.google.redirect_uri'),
            'grant_type' => 'authorization_code',
        ]);

        if ($response->failed()) {
            return response('Échec de l\'échange de tokens : ' . $response->body(), 500);
        }

        $data = $response->json();

        // Récupérer l'email Google de l'utilisateur
        $userInfo = Http::withToken($data['access_token'])
            ->get('https://www.googleapis.com/oauth2/v2/userinfo')
            ->json();

        // Sauvegarder / mettre à jour la connexion
        GoogleCalendarConnection::updateOrCreate(
            ['hotel_id' => $hotelId],
            [
                'google_email' => $userInfo['email'] ?? 'unknown',
                'access_token' => $data['access_token'],
                'refresh_token' => $data['refresh_token'] ?? '',
                'expires_at' => now()->addSeconds($data['expires_in'] ?? 3600),
            ]
        );

        // Rediriger vers le dashboard partenaire
        $dashboardUrl = env('FRONTEND_URL', 'https://hotel-booking-platform-git-main-soukaina-salimis-projects.vercel.app')
            . '/espace-partner/dashboard?google=connected';

        return redirect($dashboardUrl);
    }

    /**
     * GET /api/google/status?hotel_id=xxx
     * Vérifie si l'hôtel a une connexion Google active.
     */
    public function status(Request $request)
    {
        $request->validate(['hotel_id' => 'required|uuid']);

        $connection = GoogleCalendarConnection::where('hotel_id', $request->hotel_id)->first();

        return response()->json([
            'connected' => $connection !== null,
            'google_email' => $connection?->google_email,
        ]);
    }

    /**
     * POST /api/chat/select-slot
     * Le client a cliqué sur un créneau proposé par Moha.
     * Traitement 100% déterministe (pas de Groq).
     */
    public function selectSlot(Request $request)
    {
        $data = $request->validate([
            'conversation_id' => 'required|uuid',
            'slot_index' => 'required|integer|min:0|max:2',
        ]);

        $conversation = \App\Models\Conversation::findOrFail($data['conversation_id']);

        if ($conversation->status !== 'slots_proposed') {
            return response()->json(['error' => 'Aucun créneau en attente pour cette conversation.'], 400);
        }

        $slots = $conversation->proposed_slots ?? [];
        $selectedSlot = $slots[$data['slot_index']] ?? null;

        if (!$selectedSlot) {
            return response()->json(['error' => 'Créneau invalide.'], 400);
        }

        // Vérifier que les créneaux n'ont pas expiré (30 min max)
        if ($conversation->slots_proposed_at && $conversation->slots_proposed_at->diffInMinutes(now()) > 30) {
            return response()->json(['error' => 'Les créneaux proposés ont expiré, veuillez redemander.'], 400);
        }

        $connection = GoogleCalendarConnection::where('hotel_id', $conversation->hotel_id)->first();
        if (!$connection) {
            return response()->json(['error' => 'Aucune connexion Google active.'], 400);
        }

        // Créer l'événement dans Google Calendar
        $service = app(\App\Services\GoogleCalendarService::class);
        $summary = 'RDV avec ' . ($conversation->lead_name ?? 'Client');
        $description = $conversation->summary ?? '';

        $eventId = $service->createEvent(
            $connection,
            $selectedSlot['start'],
            $selectedSlot['end'],
            $summary,
            $description
        );

        // Mettre à jour la conversation
        $conversation->update([
            'status' => 'appointment_booked',
            'google_event_id' => $eventId,
            'appointment_at' => $selectedSlot['start'],
        ]);

        return response()->json([
            'success' => true,
            'appointment_at' => $selectedSlot['start'],
            'label' => $selectedSlot['label'],
        ]);
    }

    /**
     * GET /api/chat/appointments?hotel_id=xxx&month=2026-09
     * Retourne les RDV (Moha + Google) pour le mois demandé.
     */
    public function appointments(Request $request)
    {
        $request->validate([
            'hotel_id' => 'required|uuid',
            'month'    => 'nullable|regex:/^\d{4}-\d{2}$/',
        ]);

        $month = $request->input('month', now()->format('Y-m'));
        $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth();
        $end   = (clone $start)->endOfMonth();

        $appointments = [];

        // 1) RDV pris via Moha (DB locale)
        $conversations = \App\Models\Conversation::where('hotel_id', $request->hotel_id)
            ->whereNotNull('appointment_at')
            ->whereBetween('appointment_at', [$start, $end])
            ->orderBy('appointment_at')
            ->get();

        foreach ($conversations as $c) {
            $appointments[] = [
                'id'         => 'moha-' . $c->id,
                'title'      => 'RDV ' . ($c->lead_name ?? 'Client'),
                'start'      => $c->appointment_at->toIso8601String(),
                'end'        => (clone $c->appointment_at)->addMinutes(30)->toIso8601String(),
                'source'     => 'moha',
                'lead_phone' => $c->lead_phone,
                'lead_email' => $c->lead_email,
                'summary'    => $c->summary,
                'status'     => $c->status,
            ];
        }

        // 2) Événements Google Calendar (optionnel mais recommandé)
        $connection = \App\Models\GoogleCalendarConnection::where('hotel_id', $request->hotel_id)->first();
        if ($connection) {
            try {
                $service = app(\App\Services\GoogleCalendarService::class);
                $googleEvents = $service->listEvents($connection, $start, $end);
                foreach ($googleEvents as $ev) {
                    $appointments[] = [
                        'id'     => 'google-' . $ev['id'],
                        'title'  => $ev['title'],
                        'start'  => $ev['start'],
                        'end'    => $ev['end'],
                        'source' => 'google',
                        'status' => 'external',
                    ];
                }
            } catch (\Throwable $e) {
                \Log::warning('[appointments] Google fetch failed: ' . $e->getMessage());
            }
        }

        // Trie par date
        usort($appointments, fn($a, $b) => strcmp($a['start'], $b['start']));

        return response()->json([
            'month'        => $month,
            'appointments' => $appointments,
        ]);
    }
}
