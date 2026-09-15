<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function __construct(private GroqService $groq) {}

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

            // LOG 2 : URL appelée pour le mode "hotel"
            Log::info('[ChatController] Calling hotel service', [
                'url' => $hotelUrl,
                'hotel_id' => $data['hotel_id'],
            ]);

            try {
                $hotelResponse = Http::timeout(30)->get($hotelUrl);

                // LOG 3 : Réponse du service hôtel
                Log::info('[ChatController] Hotel service response', [
                    'status' => $hotelResponse->status(),
                    'successful' => $hotelResponse->successful(),
                    'body_preview' => substr($hotelResponse->body(), 0, 500),
                ]);

                $hotel = $hotelResponse->json('data') ?? [];
            } catch (\Throwable $e) {
                // LOG 4 : Exception sur l'appel au service hôtel
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

                // LOG 5 : URL appelée pour le mode "platform"
                Log::info('[ChatController] Calling booking service', [
                    'url' => $bookingUrl,
                    'user_id' => $data['user_id'],
                ]);

                try {
                    $bookingsResponse = Http::timeout(30)->get($bookingUrl, [
                        'user_id' => $data['user_id'],
                    ]);

                    // LOG 6 : Réponse du service booking
                    Log::info('[ChatController] Booking service response', [
                        'status' => $bookingsResponse->status(),
                        'successful' => $bookingsResponse->successful(),
                        'body_preview' => substr($bookingsResponse->body(), 0, 500),
                    ]);

                    $bookings = $bookingsResponse->successful() ? $bookingsResponse->json('data') : [];
                } catch (\Throwable $e) {
                    // LOG 7 : Exception sur l'appel au service booking
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
            'ready_to_notify' => !empty($result['ready_to_notify']),
        ]);

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

        // LOG 9 : Fin de la requête
        Log::info('[ChatController] sendMessage completed', [
            'conversation_id' => $conversation->id,
            'has_booking_link' => !empty($bookingLink),
        ]);

        return response()->json([
            'conversation_id' => $conversation->id,
            'reply' => $result['reply'],
            'link' => $bookingLink ?? ($result['link'] ?? null),
        ]);
    }

    public function todos(Request $request)
    {
        $request->validate(['hotel_id' => 'required|uuid']);

        Log::info('[ChatController] todos called', ['hotel_id' => $request->query('hotel_id')]);

        $todos = Conversation::query()
            ->where('hotel_id', $request->query('hotel_id'))
            ->orderByDesc('created_at')
            ->get(['id', 'lead_name', 'lead_phone', 'summary', 'status', 'messages', 'created_at']);

        return response()->json(['data' => $todos]);
    }

    public function adminTodos()
    {
        Log::info('[ChatController] adminTodos called');

        $todos = Conversation::query()
            ->whereNull('hotel_id')
            ->where('status', 'notified')
            ->orderByDesc('created_at')
            ->get(['id', 'lead_name', 'lead_phone', 'summary', 'messages', 'created_at']);

        return response()->json(['data' => $todos]);
    }

    public function markHandled(string $id)
    {
        Log::info('[ChatController] markHandled called', ['id' => $id]);

        $conversation = Conversation::findOrFail($id);
        $conversation->update(['status' => 'contacted']);

        return response()->json(['data' => ['id' => $conversation->id, 'status' => 'contacted']]);
    }
}
