<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            HotelSeeder::class,       // doit passer en premier : rooms et reviews referencent hotel_id
            RoomSeeder::class,        // doit passer avant availability : reference room_id
            AvailabilitySeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
