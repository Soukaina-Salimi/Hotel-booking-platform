<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HotelSeeder extends Seeder
{
    // Meme logique que UserSeeder : IDs fixes pour etre reutilises par RoomSeeder,
    // ReviewSeeder et par booking-service. owner_id pointe vers les 3 comptes
    // 'hotel' crees dans auth_db (users 1002, 1003, 1004).
    public function run(): void
    {
        $hotels = [
            ['id' => '22222222-2222-2222-2222-222222222001', 'owner_id' => '11111111-1111-1111-1111-111111111002', 'name' => 'Riad Yasmine',          'city' => 'Marrakech',   'address' => 'Derb El Hammam, Medina', 'status' => 'active',  'description' => 'Riad traditionnel au coeur de la medina avec patio et fontaine.', 'badge' => 'Traditionnel', 'amenities' => ['Wi-Fi', 'Terrasse', 'Restaurant', 'Patio'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222002', 'owner_id' => '11111111-1111-1111-1111-111111111002', 'name' => 'Riad Atlas Bleu',       'city' => 'Marrakech',   'address' => 'Rue Riad Zitoun',        'status' => 'active',  'description' => 'Palais moderne avec piscine a debordement et spa.',              'badge' => 'Moderne',      'amenities' => ['Spa', 'Piscine', 'Restaurant', 'Jardin', 'Wi-Fi'], 'featured' => true],
            ['id' => '22222222-2222-2222-2222-222222222003', 'owner_id' => '11111111-1111-1111-1111-111111111003', 'name' => 'Atlantic Resort',       'city' => 'Agadir',      'address' => 'Boulevard du 20 Aout',   'status' => 'active',  'description' => 'Resort en bord de mer avec acces direct a la plage.',            'badge' => 'Resort',       'amenities' => ['Piscine', 'Plage', 'Restaurant', 'Spa', 'Wi-Fi'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222004', 'owner_id' => '11111111-1111-1111-1111-111111111003', 'name' => 'Agadir Beach Hotel',    'city' => 'Agadir',      'address' => 'Avenue Mohammed V',      'status' => 'active',  'description' => 'Hotel confortable proche de la plage, ideal pour la famille.',   'badge' => 'Plage',        'amenities' => ['Piscine', 'Wi-Fi', 'Parking'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222005', 'owner_id' => '11111111-1111-1111-1111-111111111004', 'name' => 'Dar Chefchaouen',       'city' => 'Chefchaouen', 'address' => 'Place Outa el Hammam',   'status' => 'active',  'description' => 'Riad bleu typique avec vue sur les montagnes.',                  'badge' => 'Pittoresque',  'amenities' => ['Terrasse', 'Wi-Fi', 'Petit-dejeuner'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222006', 'owner_id' => '11111111-1111-1111-1111-111111111002', 'name' => 'Fes Palace Hotel',      'city' => 'Fes',         'address' => 'Route de Fes El Jdid',   'status' => 'active',  'description' => 'Vue panoramique sur la medina avec terrasse et spa.',            'badge' => 'Authentique',  'amenities' => ['Spa', 'Restaurant', 'Terrasse', 'Wi-Fi'], 'featured' => true],
            ['id' => '22222222-2222-2222-2222-222222222007', 'owner_id' => '11111111-1111-1111-1111-111111111003', 'name' => 'Essaouira Ocean Vue',   'city' => 'Essaouira',   'address' => 'Avenue Mohammed V',      'status' => 'active',  'description' => 'Ecrin de verdure pres de l ocean avec piscine et jardin.',       'badge' => 'Nature',       'amenities' => ['Piscine', 'Jardin', 'Terrasse', 'Wi-Fi', 'Parking'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222008', 'owner_id' => '11111111-1111-1111-1111-111111111004', 'name' => 'Tanger Bay Hotel',      'city' => 'Tanger',      'address' => 'Avenue des FAR',         'status' => 'active',  'description' => 'Vue sur le detroit de Gibraltar, emplacement central.',          'badge' => 'Vue mer',      'amenities' => ['Wi-Fi', 'Restaurant', 'Vue'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222009', 'owner_id' => '11111111-1111-1111-1111-111111111002', 'name' => 'Riad des Kasbahs',      'city' => 'Marrakech',   'address' => 'Kasbah, Medina',         'status' => 'pending', 'description' => 'Suite avec patio interieur et fontaine, tres calme.',            'badge' => 'Luxe',         'amenities' => ['Spa', 'Wi-Fi', 'Terrasse'], 'featured' => false],
            ['id' => '22222222-2222-2222-2222-222222222010', 'owner_id' => '11111111-1111-1111-1111-111111111004', 'name' => 'Chefchaouen Blue Pearl','city' => 'Chefchaouen', 'address' => 'Ras El Maa',             'status' => 'pending', 'description' => 'Chambre simple pres de la place Ras El Maa.',                   'badge' => 'Economique',   'amenities' => ['Wi-Fi'], 'featured' => false],
        ];

        foreach ($hotels as $h) {
            DB::table('hotels')->insert([
                'id' => $h['id'],
                'owner_id' => $h['owner_id'],
                'name' => $h['name'],
                'city' => $h['city'],
                'address' => $h['address'],
                'status' => $h['status'],
                'description' => $h['description'],
                'cover_image' => null, // pas encore de vraies photos - voir note dans la reponse
                'badge' => $h['badge'],
                'amenities' => json_encode($h['amenities']),
                'featured' => $h['featured'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
