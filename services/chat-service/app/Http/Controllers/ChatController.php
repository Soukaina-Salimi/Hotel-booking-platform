<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\GoogleCalendarConnection;
use App\Services\GoogleCalendarService;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function __construct(
        private GroqService $groq,
        private GoogleCalendarService $googleCalendar,
    ) {}

    public function sendMessage(Request $request)
    {
        $data = $request->validate([
            'hotel_id' => 'nullable|uuid',
            'conversation_id' => 'nullable|uuid',
            'message' => 'required|string|max:1000',
            'user_id' => 'nullable|uuid',
        ]);

        // LOG 1 : Début de la requête
        Log::info('[ChatController] sendMessage called', [
            'hotel_id' => $data['hotel_id'] ?? null,
            'conversation_id' => $data['conversation_id'] ?? null,
            'user_id' => $data['user_id'] ?? null,
            'message_length' => strlen($data['message']),
            'hotel_service_url_config' => config('services.hotel_service.url'),
            'booking_service_url_config' => config('services.booking_service.url'),
        ]);

        $conversation = $data['conversation_id']
            ? Conversation::findOrFail($data['conversation_id'])
            : Conversation::create([
                'hotel_id' => $data['hotel_id'] ?? null,
                'messages' => [],
                'status' => 'in_progress',
            ]);

        $history = $conversation->messages;
        $history[] = ['role' => 'user', 'content' => $data['message']];

        if (!empty($data['hotel_id'])) {
            $hotelUrl = config('services.hotel_service.url') . "/api/hotels/{$data['hotel_id']}";

            Log::info('[ChatController] Calling hotel service', [
                'url' => $hotelUrl,
                'hotel_id' => $data['hotel_id'],
            ]);

            try {
                $hotelResponse = Http::timeout(30)->get($hotelUrl);

                Log::info('[ChatController] Hotel service response', [
                    'status' => $hotelResponse->status(),
                    'successful' => $hotelResponse->successful(),
                    'body_preview' => substr($hotelResponse->body(), 0, 500),
                ]);

                $hotel = $hotelResponse->json('data') ?? [];
            } catch (\Throwable $e) {
                Log::error('[ChatController] Hotel service call failed', [
                    'url' => $hotelUrl,
                    'error_message' => $e->getMessage(),
                    'error_class' => get_class($e),
                ]);
                $hotel = [];
            }

            $result = $this->groq->chatHotel($hotel, $history);
        } else {
            $isLoggedIn = !empty($data['user_id']);
            $bookings = null;

            if ($isLoggedIn) {
                $bookingUrl = config('services.booking_service.url') . '/api/bookings';

                Log::info('[ChatController] Calling booking service', [
                    'url' => $bookingUrl,
                    'user_id' => $data['user_id'],
                ]);

                try {
                    $bookingsResponse = Http::timeout(30)->get($bookingUrl, [
                        'user_id' => $data['user_id'],
                    ]);

                    Log::info('[ChatController] Booking service response', [
                        'status' => $bookingsResponse->status(),
                        'successful' => $bookingsResponse->successful(),
                        'body_preview' => substr($bookingsResponse->body(), 0, 500),
                    ]);

                    $bookings = $bookingsResponse->successful() ? $bookingsResponse->json('data') : [];
                } catch (\Throwable $e) {
                    Log::error('[ChatController] Booking service call failed', [
                        'url' => $bookingUrl,
                        'error_message' => $e->getMessage(),
                        'error_class' => get_class($e),
                    ]);
                    $bookings = [];
                }
            }

            $result = $this->groq->chatPlatform($bookings, $isLoggedIn, $history);
        }

        // LOG 8 : Résultat de Groq
        Log::info('[ChatController] Groq result', [
            'reply_preview' => substr($result['reply'] ?? '', 0, 200),
            'has_lead_name' => !empty($result['lead_name']),
            'has_lead_phone' => !empty($result['lead_phone']),
            'has_lead_email' => !empty($result['lead_email']),
            'ready_to_notify' => !empty($result['ready_to_notify']),
        ]);

        // Validation des coordonnées AVANT d'envoyer quoi que ce soit au client.
        $phoneProvided = !empty($result['lead_phone']);
        $emailProvided = !empty($result['lead_email']);
        $phoneValid = !$phoneProvided || $this->isValidPhoneNumber($result['lead_phone']);
        $emailValid = !$emailProvided || $this->isValidEmail($result['lead_email']);
        $hasValidContact = ($phoneProvided && $phoneValid) || ($emailProvided && $emailValid);

        if (!empty($result['ready_to_notify']) && ($phoneProvided || $emailProvided) && !$hasValidContact) {
            Log::warning('[ChatController] Invalid lead contact info, asking for correction', [
                'conversation_id' => $conversation->id ?? null,
                'lead_phone' => $result['lead_phone'] ?? null,
                'lead_email' => $result['lead_email'] ?? null,
                'phone_valid' => $phoneValid,
                'email_valid' => $emailValid,
            ]);

            $result['ready_to_notify'] = false;

            if ($phoneProvided && !$phoneValid) {
                $result['reply'] = "Le numéro que vous m'avez donné ne semble pas valide (il doit contenir 10 chiffres, par exemple 0612345678). Pouvez-vous me le redonner ?";
                $result['lead_phone'] = null;
            } elseif ($emailProvided && !$emailValid) {
                $result['reply'] = "L'adresse email que vous m'avez donnée ne semble pas valide. Pouvez-vous me la redonner ?";
                $result['lead_email'] = null;
            }
        }

        // ✅ NOUVEAU : Variable pour transporter les slots dans la réponse JSON
        $extraData = [];

        // Sauvegarder le message assistant (provisoire, il sera peut-être remplacé)
        $history[] = ['role' => 'assistant', 'content' => $result['reply']];

        $conversation->messages = $history;
        if (!empty($result['lead_name'])) {
            $conversation->lead_name = $result['lead_name'];
        }

        if (!empty($result['ready_to_notify']) && $hasValidContact) {
            if (!empty($result['lead_phone'])) {
                $conversation->lead_phone = $result['lead_phone'];
            }
            if (!empty($result['lead_email'])) {
                $conversation->lead_email = $result['lead_email'];
            }
            $conversation->summary = $result['summary'];

            // ✅ NOUVEAU : Vérifier si l'hôtel a connecté Google Calendar
            $connection = !empty($data['hotel_id'])
                ? GoogleCalendarConnection::where('hotel_id', $data['hotel_id'])->first()
                : null;

            $slotsProposed = false;

            if ($connection) {
                try {
                    Log::info('[ChatController] Google Calendar detected, fetching free slots', [
                        'hotel_id' => $data['hotel_id'],
                        'google_email' => $connection->google_email,
                    ]);

                    $slots = $this->googleCalendar->getFreeSlots($connection, 3);

                    if (count($slots) > 0) {
                        $conversation->status = 'slots_proposed';
                        $conversation->proposed_slots = $slots;
                        $conversation->slots_proposed_at = now();

                        // Remplacer la réponse par les créneaux
                        $slotsText = "Parfait ! Voici les créneaux disponibles pour un rendez-vous :";
                        $result['reply'] = $slotsText;

                        // Remplacer aussi le dernier message dans l'historique
                        $history[count($history) - 1] = ['role' => 'assistant', 'content' => $slotsText];
                        $conversation->messages = $history;

                        $extraData['slots'] = $slots;
                        $slotsProposed = true;

                        Log::info('[ChatController] Slots proposed', [
                            'conversation_id' => $conversation->id,
                            'slots_count' => count($slots),
                        ]);
                    } else {
                        // Aucun créneau dispo → fallback notification classique
                        $conversation->status = 'notified';

                        Log::info('[ChatController] No free slots found, falling back to notified');
                    }
                } catch (\Throwable $e) {
                    Log::error('[ChatController] Google Calendar error', [
                        'hotel_id' => $data['hotel_id'],
                        'error_message' => $e->getMessage(),
                        'error_class' => get_class($e),
                    ]);
                    $conversation->status = 'notified';
                }
            } else {
                // Pas de Google Calendar connecté → comportement habituel
                $conversation->status = 'notified';

                Log::info('[ChatController] No Google Calendar connection for this hotel');
            }
        }

        $conversation->save();

        $bookingLink = null;
        if (!empty($data['hotel_id']) && !empty($result['booking_draft']['room_id'])) {
            $draft = $result['booking_draft'];
            $query = http_build_query(array_filter([
                'room_id' => $draft['room_id'],
                'check_in' => $draft['check_in'] ?? null,
                'check_out' => $draft['check_out'] ?? null,
            ]));
            $bookingLink = [
                'label' => 'Continuer la réservation',
                'href' => "/hotels/{$data['hotel_id']}/booking?{$query}",
            ];
        }

        Log::info('[ChatController] sendMessage completed', [
            'conversation_id' => $conversation->id,
            'has_booking_link' => !empty($bookingLink),
            'has_slots' => !empty($extraData['slots']),
        ]);

        return response()->json(array_merge([
            'conversation_id' => $conversation->id,
            'reply' => $result['reply'],
            'link' => $bookingLink ?? ($result['link'] ?? null),
        ], $extraData));
    }

    public function todos(Request $request)
    {
        $request->validate(['hotel_id' => 'required|uuid']);

        Log::info('[ChatController] todos called', ['hotel_id' => $request->query('hotel_id')]);

        $todos = Conversation::query()
            ->where('hotel_id', $request->query('hotel_id'))
            ->orderByDesc('created_at')
            ->get(['id', 'lead_name', 'lead_phone', 'lead_email', 'summary', 'status', 'messages', 'created_at']);

        return response()->json(['data' => $todos]);
    }

    public function adminTodos()
    {
        Log::info('[ChatController] adminTodos called');

        $todos = Conversation::query()
            ->whereNull('hotel_id')
            ->where('status', 'notified')
            ->orderByDesc('created_at')
            ->get(['id', 'lead_name', 'lead_phone', 'lead_email', 'summary', 'messages', 'created_at']);

        return response()->json(['data' => $todos]);
    }

    public function markHandled(string $id)
    {
        Log::info('[ChatController] markHandled called', ['id' => $id]);

        $conversation = Conversation::findOrFail($id);
        $conversation->update(['status' => 'contacted']);

        return response()->json(['data' => ['id' => $conversation->id, 'status' => 'contacted']]);
    }

    /**
     * Vérifie qu'un numéro de téléphone contient bien 10 chiffres.
     */
    private function isValidPhoneNumber(?string $phone): bool
    {
        if (!$phone) {
            return false;
        }

        $digits = preg_replace('/\D/', '', $phone);

        if (str_starts_with($digits, '212')) {
            $digits = '0' . substr($digits, 3);
        }

        return (bool) preg_match('/^0[67][0-9]{8}$/', $digits);
    }

    /**
     * Vérifie qu'un email respecte un format standard.
     */
    private function isValidEmail(?string $email): bool
    {
        if (!$email) {
            return false;
        }

        return filter_var(trim($email), FILTER_VALIDATE_EMAIL) !== false;
    }
}
