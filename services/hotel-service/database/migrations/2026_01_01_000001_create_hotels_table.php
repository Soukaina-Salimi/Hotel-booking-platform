<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('owner_id'); // reference logique vers users.id (auth_db) - pas de FK physique inter-bases
            $table->string('name', 150);
            $table->string('city', 100);
            $table->string('address', 255)->nullable();
            $table->enum('status', ['pending', 'active'])->default('pending');
            $table->timestamps();

            $table->index('owner_id');
            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
