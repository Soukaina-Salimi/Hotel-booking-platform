<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    /**
     * GET /api/hotels
     * Retourne les hotels actifs avec le prix de depart (chambre la moins chere),
     * la note moyenne et le nombre d'avis - calcules a la volee plutot que stockes,
     * pour rester toujours a jour avec les vraies donnees de rooms/reviews.
     */
    public function index(Request $request)
    {
        $hotels = Hotel::query()
            ->where('status', 'active')
            ->withMin('rooms', 'price')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->when($request->query('city'), fn($q, $city) => $q->where('city', $city))
            ->when($request->query('search'), function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->get();

        $formatted = $hotels->map(function (Hotel $hotel) {
            return [
                'id' => $hotel->id,
                'name' => $hotel->name,
                'location' => $hotel->city,
                'description' => $hotel->description,
                'price' => $hotel->rooms_min_price !== null ? (float) $hotel->rooms_min_price : null,
                'rating' => $hotel->reviews_avg_rating !== null ? round((float) $hotel->reviews_avg_rating, 1) : null,
                'reviews' => $hotel->reviews_count,
                'image' => $hotel->cover_image ?? '/images/hotels/placeholder.jpg',
                'amenities' => $hotel->amenities ?? [],
                'badge' => $hotel->badge,
                'featured' => $hotel->featured,
            ];
        });

        return response()->json(['data' => $formatted]);
    }

    /**
     * POST /api/hotels
     * Cree la fiche hotel lors de l'inscription partenaire (page /partner/register).
     * Statut "pending" par defaut - necessite une validation admin avant de devenir visible
     * publiquement dans l'index(), conformement au flux de validation prevu a la conception.
     *
     * Note de securite a corriger avant mise en production : cet endpoint fait confiance a
     * owner_id envoye par le frontend, sans verifier via un token que l'appelant est bien ce
     * owner. Ca marche pour le flux d'inscription (l'utilisateur vient d'etre cree, il n'a pas
     * encore de session), mais il faudra mettre en place une verification inter-services
     * (auth-service expose un endpoint de verification de token que hotel-service appelle)
     * avant d'ouvrir cet endpoint a d'autres usages.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'owner_id' => 'required|uuid',
            'name' => 'required|string|max:150',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
        ]);

        $hotel = Hotel::create([
            'owner_id' => $data['owner_id'],
            'name' => $data['name'],
            'city' => $data['city'],
            'address' => $data['address'] ?? null,
            'description' => $data['description'] ?? null,
            'amenities' => $data['amenities'] ?? [],
            'status' => 'pending', // validation admin requise avant d'apparaitre publiquement
        ]);

        return response()->json(['data' => $hotel], 201);
    }

    public function mine(Request $request)
    {
        $request->validate(['owner_id' => 'required|uuid']);

        $hotel = Hotel::where('owner_id', $request->query('owner_id'))->first();

        return response()->json(['data' => $hotel]);
    }

    /**
     * POST /api/hotels/{id}  (avec _method=PUT spoofing pour l'upload de fichier)
     * Mise a jour de la fiche hotel par son proprietaire, depuis la page Parametres
     * du dashboard partenaire. Gere aussi l'upload d'une nouvelle photo de couverture.
     *
     * Meme limite de securite que store() : owner_id est verifie par comparaison simple,
     * pas par un vrai token inter-services valide - a durcir avant la production.
     */
    public function update(Request $request, string $id)
    {
        $hotel = Hotel::findOrFail($id);

        $data = $request->validate([
            'owner_id' => 'required|uuid',
            'name' => 'sometimes|required|string|max:150',
            'city' => 'sometimes|required|string|max:100',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'cover_image' => 'nullable|image|max:4096', // 4 Mo max
        ]);

        if ($hotel->owner_id !== $data['owner_id']) {
            return response()->json(['message' => "Vous n'êtes pas autorisé à modifier cet hôtel."], 403);
        }

        if ($request->hasFile('cover_image')) {
            // Supprime l'ancienne image si elle vient bien de notre propre stockage
            if ($hotel->cover_image && str_contains($hotel->cover_image, '/storage/hotels/')) {
                $oldPath = 'hotels/' . basename($hotel->cover_image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('cover_image')->store('hotels', 'public');
            $data['cover_image'] = rtrim(config('app.url'), '/') . '/storage/' . $path;
        }

        $hotel->update(collect($data)->except(['owner_id', 'cover_image'])
            ->when(isset($data['cover_image']), fn($c) => $c->put('cover_image', $data['cover_image']))
            ->toArray());

        return response()->json(['data' => $hotel->fresh()]);
    }

    /**
     * GET /api/hotels/{id}
     * Detail d'un hotel avec ses chambres, pour la page fiche hotel.
     */
    public function show(string $id)
    {
        $hotel = Hotel::query()
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->with('rooms')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $hotel->id,
                'name' => $hotel->name,
                'location' => $hotel->city,
                'address' => $hotel->address,
                'description' => $hotel->description,
                'rating' => $hotel->reviews_avg_rating !== null ? round((float) $hotel->reviews_avg_rating, 1) : null,
                'reviews' => $hotel->reviews_count,
                'image' => $hotel->cover_image ?? '/images/hotels/placeholder.jpg',
                'amenities' => $hotel->amenities ?? [],
                'badge' => $hotel->badge,
                'featured' => $hotel->featured,
                'rooms' => $hotel->rooms->map(fn($room) => [
                    'id' => $room->id,
                    'room_type' => $room->room_type,
                    'price' => (float) $room->price,
                    'capacity' => $room->capacity,
                    'description' => $room->description,
                ]),
            ],
        ]);
    }
}
