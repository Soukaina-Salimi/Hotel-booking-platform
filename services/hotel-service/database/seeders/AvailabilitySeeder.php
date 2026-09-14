<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AvailabilitySeeder extends Seeder
{
    // 10 lignes de disponibilite reparties sur quelques chambres, pour illustrer
    // la table sans avoir a generer un calendrier complet.
    public function run(): void
    {
        $rows = [
            ['room_id' => '33333333-3333-3333-3333-333333333001', 'day' => '2026-06-18', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333001', 'day' => '2026-06-19', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333001', 'day' => '2026-06-20', 'is_available' => false], // deja reservee
            ['room_id' => '33333333-3333-3333-3333-333333333002', 'day' => '2026-06-18', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333002', 'day' => '2026-06-19', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333003', 'day' => '2026-07-01', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333003', 'day' => '2026-07-02', 'is_available' => false],
            ['room_id' => '33333333-3333-3333-3333-333333333004', 'day' => '2026-07-01', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333005', 'day' => '2026-08-10', 'is_available' => true],
            ['room_id' => '33333333-3333-3333-3333-333333333006', 'day' => '2026-08-15', 'is_available' => true],
        ];

        foreach ($rows as $row) {
            DB::table('availability')->insert([
                'room_id' => $row['room_id'],
                'day' => Carbon::parse($row['day']),
                'is_available' => $row['is_available'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
