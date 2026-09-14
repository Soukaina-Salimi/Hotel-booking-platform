<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    // Une chambre par hotel pour ce premier jeu de test (IDs fixes, reutilises
    // par AvailabilitySeeder et par booking-service).
    public function run(): void
    {
        $rooms = [
            ['id' => '33333333-3333-3333-3333-333333333001', 'hotel_id' => '22222222-2222-2222-2222-222222222001', 'room_type' => 'Suite vue sur mer',   'price' => 1200.00, 'capacity' => 2, 'description' => 'Suite avec terrasse privee et vue sur les jardins.'],
            ['id' => '33333333-3333-3333-3333-333333333002', 'hotel_id' => '22222222-2222-2222-2222-222222222002', 'room_type' => 'Chambre Deluxe',      'price' => 800.00,  'capacity' => 2, 'description' => 'Chambre climatisee avec salle de bain marbre.'],
            ['id' => '33333333-3333-3333-3333-333333333003', 'hotel_id' => '22222222-2222-2222-2222-222222222003', 'room_type' => 'Suite vue sur mer',   'price' => 1500.00, 'capacity' => 3, 'description' => 'Suite face a l ocean avec balcon.'],
            ['id' => '33333333-3333-3333-3333-333333333004', 'hotel_id' => '22222222-2222-2222-2222-222222222004', 'room_type' => 'Chambre Standard',    'price' => 500.00,  'capacity' => 2, 'description' => 'Chambre confortable proche de la plage.'],
            ['id' => '33333333-3333-3333-3333-333333333005', 'hotel_id' => '22222222-2222-2222-2222-222222222005', 'room_type' => 'Chambre Traditionnelle','price' => 450.00, 'capacity' => 2, 'description' => 'Decoration artisanale, vue sur la medina bleue.'],
            ['id' => '33333333-3333-3333-3333-333333333006', 'hotel_id' => '22222222-2222-2222-2222-222222222006', 'room_type' => 'Suite Royale',        'price' => 2000.00, 'capacity' => 4, 'description' => 'Suite avec salon prive et service de majordome.'],
            ['id' => '33333333-3333-3333-3333-333333333007', 'hotel_id' => '22222222-2222-2222-2222-222222222007', 'room_type' => 'Chambre vue Ocean',   'price' => 700.00,  'capacity' => 2, 'description' => 'Vue directe sur le port d Essaouira.'],
            ['id' => '33333333-3333-3333-3333-333333333008', 'hotel_id' => '22222222-2222-2222-2222-222222222008', 'room_type' => 'Chambre Deluxe',      'price' => 900.00,  'capacity' => 2, 'description' => 'Vue sur le detroit de Gibraltar.'],
            ['id' => '33333333-3333-3333-3333-333333333009', 'hotel_id' => '22222222-2222-2222-2222-222222222009', 'room_type' => 'Suite Kasbah',        'price' => 1100.00, 'capacity' => 3, 'description' => 'Suite avec patio interieur et fontaine.'],
            ['id' => '33333333-3333-3333-3333-333333333010', 'hotel_id' => '22222222-2222-2222-2222-222222222010', 'room_type' => 'Chambre Standard',    'price' => 400.00,  'capacity' => 2, 'description' => 'Chambre simple pres de la place Ras El Maa.'],
        ];

        foreach ($rooms as $r) {
            DB::table('rooms')->insert([
                'id' => $r['id'],
                'hotel_id' => $r['hotel_id'],
                'room_type' => $r['room_type'],
                'price' => $r['price'],
                'capacity' => $r['capacity'],
                'description' => $r['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
