<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    /**
     * GET /api/rooms?hotel_id=...
     * Liste les chambres d'un hotel, pour la page de gestion partenaire.
     */
    public function index(Request $request)
    {
        $request->validate(['hotel_id' => 'required|uuid']);

        $rooms = Room::where('hotel_id', $request->query('hotel_id'))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $rooms]);
    }

    /**
     * GET /api/rooms/{id}
     */
    public function show(string $id)
    {
        return response()->json(['data' => Room::findOrFail($id)]);
    }

    /**
     * POST /api/rooms
     * Meme reserve de securite que HotelController: owner_id verifie par
     * comparaison simple, pas par un vrai token inter-services - a durcir
     * avant la production.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'hotel_id' => 'required|uuid',
            'owner_id' => 'required|uuid',
            'room_type' => 'required|string|max:150',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:50',
            'bed_type' => 'nullable|string|max:100',
            'status' => 'nullable|in:available,occupied,maintenance',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'featured' => 'nullable|boolean',
            'image' => 'nullable|image|max:4096',
        ]);

        $hotel = Hotel::findOrFail($data['hotel_id']);
        if ($hotel->owner_id !== $data['owner_id']) {
            return response()->json(['message' => "Vous n'êtes pas autorisé à ajouter une chambre à cet hôtel."], 403);
        }

        if ($request->hasFile('image')) {
            $data['image'] = rtrim(config('app.url'), '/') . '/storage/' . $request->file('image')->store('rooms', 'public');
        }

        $room = Room::create(collect($data)->except(['owner_id'])->toArray());

        return response()->json(['data' => $room], 201);
    }

    /**
     * POST /api/rooms/{id}  (avec _method=PUT spoofing pour l'upload de fichier)
     */
    public function update(Request $request, string $id)
    {
        $room = Room::findOrFail($id);

        $data = $request->validate([
            'owner_id' => 'required|uuid',
            'room_type' => 'sometimes|required|string|max:150',
            'price' => 'sometimes|required|numeric|min:0',
            'capacity' => 'sometimes|required|integer|min:1',
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:50',
            'bed_type' => 'nullable|string|max:100',
            'status' => 'nullable|in:available,occupied,maintenance',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'featured' => 'nullable|boolean',
            'image' => 'nullable|image|max:4096',
        ]);

        $hotel = Hotel::findOrFail($room->hotel_id);
        if ($hotel->owner_id !== $data['owner_id']) {
            return response()->json(['message' => "Vous n'êtes pas autorisé à modifier cette chambre."], 403);
        }

        if ($request->hasFile('image')) {
            if ($room->image && str_contains($room->image, '/storage/rooms/')) {
                Storage::disk('public')->delete('rooms/' . basename($room->image));
            }
            $data['image'] = rtrim(config('app.url'), '/') . '/storage/' . $request->file('image')->store('rooms', 'public');
        }

        $room->update(collect($data)->except(['owner_id'])->toArray());

        return response()->json(['data' => $room->fresh()]);
    }

    /**
     * DELETE /api/rooms/{id}?owner_id=...
     */
    public function destroy(Request $request, string $id)
    {
        $request->validate(['owner_id' => 'required|uuid']);

        $room = Room::findOrFail($id);
        $hotel = Hotel::findOrFail($room->hotel_id);

        if ($hotel->owner_id !== $request->query('owner_id')) {
            return response()->json(['message' => "Vous n'êtes pas autorisé à supprimer cette chambre."], 403);
        }

        if ($room->image && str_contains($room->image, '/storage/rooms/')) {
            Storage::disk('public')->delete('rooms/' . basename($room->image));
        }

        $room->delete();

        return response()->json(['message' => 'Chambre supprimée.']);
    }
}
