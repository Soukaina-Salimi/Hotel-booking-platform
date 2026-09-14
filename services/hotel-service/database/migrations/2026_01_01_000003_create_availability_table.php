<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability', function (Blueprint $table) {
            $table->id(); // volume important (une ligne par chambre/jour) : auto-increment plus leger qu'un uuid ici
            $table->foreignUuid('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->date('day');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['room_id', 'day']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability');
    }
};
