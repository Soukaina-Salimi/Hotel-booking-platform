<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    // user_id -> clients de auth_db (1005 a 1010) ; room_id -> chambres de hotel_db (voir RoomSeeder)
    public function run(): void
    {
        $bookings = [
            ['user_id' => '11111111-1111-1111-1111-111111111005', 'room_id' => '33333333-3333-3333-3333-333333333001', 'check_in' => '2026-06-20', 'check_out' => '2026-06-25', 'status' => 'confirmed'],
            ['user_id' => '11111111-1111-1111-1111-111111111006', 'room_id' => '33333333-3333-3333-3333-333333333002', 'check_in' => '2026-06-18', 'check_out' => '2026-06-21', 'status' => 'confirmed'],
            ['user_id' => '11111111-1111-1111-1111-111111111007', 'room_id' => '33333333-3333-3333-3333-333333333003', 'check_in' => '2026-07-02', 'check_out' => '2026-07-06', 'status' => 'pending'],
            ['user_id' => '11111111-1111-1111-1111-111111111008', 'room_id' => '33333333-3333-3333-3333-333333333004', 'check_in' => '2026-07-01', 'check_out' => '2026-07-03', 'status' => 'confirmed'],
            ['user_id' => '11111111-1111-1111-1111-111111111009', 'room_id' => '33333333-3333-3333-3333-333333333005', 'check_in' => '2026-08-10', 'check_out' => '2026-08-14', 'status' => 'cancelled'],
            ['user_id' => '11111111-1111-1111-1111-111111111010', 'room_id' => '33333333-3333-3333-3333-333333333006', 'check_in' => '2026-08-15', 'check_out' => '2026-08-20', 'status' => 'confirmed'],
            ['user_id' => '11111111-1111-1111-1111-111111111005', 'room_id' => '33333333-3333-3333-3333-333333333007', 'check_in' => '2026-05-01', 'check_out' => '2026-05-04', 'status' => 'completed'],
            ['user_id' => '11111111-1111-1111-1111-111111111006', 'room_id' => '33333333-3333-3333-3333-333333333008', 'check_in' => '2026-05-10', 'check_out' => '2026-05-12', 'status' => 'completed'],
            ['user_id' => '11111111-1111-1111-1111-111111111007', 'room_id' => '33333333-3333-3333-3333-333333333009', 'check_in' => '2026-09-01', 'check_out' => '2026-09-05', 'status' => 'pending'],
            ['user_id' => '11111111-1111-1111-1111-111111111008', 'room_id' => '33333333-3333-3333-3333-333333333010', 'check_in' => '2026-09-10', 'check_out' => '2026-09-12', 'status' => 'confirmed'],
        ];

        foreach ($bookings as $b) {
            DB::table('bookings')->insert([
                'id' => Str::uuid(),
                'user_id' => $b['user_id'],
                'room_id' => $b['room_id'],
                'check_in' => Carbon::parse($b['check_in']),
                'check_out' => Carbon::parse($b['check_out']),
                'status' => $b['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
