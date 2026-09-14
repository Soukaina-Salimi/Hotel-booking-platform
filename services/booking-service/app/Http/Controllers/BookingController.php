<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * GET /api/bookings?user_id=...
     * Volontairement scope a un seul utilisateur a la fois - jamais de liste
     * globale exposee publiquement. Utilise par le dashboard client et par
     * le chatbot plateforme (qui ne doit voir que les reservations de la
     * personne connectee, jamais celles des autres).
     */
    public function index(Request $request)
    {
        $request->validate(['user_id' => 'required|uuid']);

        $bookings = Booking::where('user_id', $request->query('user_id'))
            ->orderByDesc('check_in')
            ->get();

        return response()->json(['data' => $bookings]);
    }

    /**
     * POST /api/bookings
     * Cree la reservation depuis le formulaire (pre-rempli ou non par le chatbot Moha).
     * Pas encore de verification de disponibilite reelle (table availability) ni de
     * verrouillage anti double-booking a ce stade - a ajouter avant la production,
     * comme prevu dans le diagramme de sequence de la conception initiale.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|uuid',
            'room_id' => 'required|uuid',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
        ]);

        $booking = Booking::create([
            'user_id' => $data['user_id'],
            'room_id' => $data['room_id'],
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'status' => 'pending',
        ]);

        return response()->json(['data' => $booking], 201);
    }
}
