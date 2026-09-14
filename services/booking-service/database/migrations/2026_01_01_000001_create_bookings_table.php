<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');  // reference logique vers users.id (auth_db)
            $table->uuid('room_id');  // reference logique vers rooms.id (hotel_db)
            $table->date('check_in');
            $table->date('check_out');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->timestamps();

            $table->index('user_id');
            $table->index('room_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
