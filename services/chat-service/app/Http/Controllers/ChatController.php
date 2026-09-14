<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function __construct(private GroqService $groq) {}

    /**
     * POST /api/chat/message
     * body: { hotel_id (optionnel), conversation_id (optionnel), message, user_id (optionnel) }
     *
     * - hotel_id present  -> mode Moha (concierge de cet hotel)
     * - hotel_id absent   -> mode plateforme (onglet Contact)
     * - user_id present, mode plateforme -> va chercher les reservations de CET utilisateur
     *   uniquement, jamais une liste globale.
     */
    public function sendMessage(Request $request)
    {
        $data = $request->validate([
            'hotel_id' => 'nullable|uuid',
            'conversation_id' => 'nullable|uuid',
            'message' => 'required|string|max:1000',
            'user_id' => 'nullable|uuid',
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
            $hotel = Http::get(config('services.hotel_service.url') . "/api/hotels/{$data['hotel_id']}")
                ->json('data') ?? [];
            $result = $this->groq->chatHotel($hotel, $history);
        } else {
            $isLoggedIn = !empty($data['user_id']);
            $bookings = null;
            if ($isLoggedIn) {
                $bookingsResponse = Http::get(config('services.booking_service.url') . '/api/bookings', [
                    'user_id' => $data['user_id'],
                ]);
                $bookings = $bookingsResponse->successful() ? $bookingsResponse->json('data') : [];
            }
            $result = $this->groq->chatPlatform($bookings, $isLoggedIn, $history);
        }

        $history[] = ['role' => 'assistant', 'content' => $result['reply']];

        $conversation->messages = $history;
        if (!empty($result['lead_name'])) {
            $conversation->lead_name = $result['lead_name'];
        }
        if (!empty($result['ready_to_notify']) && !empty($result['lead_phone'])) {
            $conversation->lead_phone = $result['lead_phone'];
            $conversation->summary = $result['summary'];
            $conversation->status = 'notified';
        }
        $conversation->save();

        // Construit l'URL de reservation nous-memes a partir du room_id fourni par le
        // modele, plutot que de lui faire confiance pour generer une URL complete -
        // on reste seul maitre du format des routes du site.
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

        return response()->json([
            'conversation_id' => $conversation->id,
            'reply' => $result['reply'],
            'link' => $bookingLink ?? ($result['link'] ?? null),
        ]);
    }

    /**
     * GET /api/chat/todos?hotel_id=...
     * Pave "a faire" du dashboard PARTENAIRE - un hotel precis uniquement.
     */
    /**
     * GET /api/chat/todos?hotel_id=...
     * Liste complete des conversations du dashboard PARTENAIRE pour un hotel donne,
     * tous statuts confondus (in_progress / notified / contacted) - le frontend
     * affiche un badge colore selon le statut.
     */
    public function todos(Request $request)
    {
        $request->validate(['hotel_id' => 'required|uuid']);

        $todos = Conversation::query()
            ->where('hotel_id', $request->query('hotel_id'))
            ->orderByDesc('created_at')
            ->get(['id', 'lead_name', 'lead_phone', 'summary', 'status', 'messages', 'created_at']);

        return response()->json(['data' => $todos]);
    }

    /**
     * GET /api/chat/admin-todos
     * Pave "a faire" du dashboard ADMIN - conversations plateforme (hotel_id null) uniquement.
     * Meme limite de securite que le reste du projet : pas encore de verification de role
     * admin via un vrai token inter-services, le frontend gate l'acces a la page.
     */
    public function adminTodos()
    {
        $todos = Conversation::query()
            ->whereNull('hotel_id')
            ->where('status', 'notified')
            ->orderByDesc('created_at')
            ->get(['id', 'lead_name', 'lead_phone', 'summary', 'messages', 'created_at']);

        return response()->json(['data' => $todos]);
    }

    /**
     * POST /api/chat/todos/{id}/handled
     * Commun aux deux dashboards (partenaire et admin).
     */
    public function markHandled(string $id)
    {
        $conversation = Conversation::findOrFail($id);
        $conversation->update(['status' => 'contacted']);

        return response()->json(['data' => ['id' => $conversation->id, 'status' => 'contacted']]);
    }
}
