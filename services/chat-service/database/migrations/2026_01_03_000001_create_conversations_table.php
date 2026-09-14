<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Une seule table, volontairement simple pour le MVP :
    // - "messages" stocke tout l'historique en JSON (pas de table separee par message)
    // - "status" fait office de "pavé a faire" pour le dashboard gerant :
    //   in_progress = conversation en cours, rien a faire pour le gerant
    //   notified    = telephone capture, apparait dans la liste "a faire"
    //   contacted   = le gerant a marque la demande comme traitee
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('hotel_id'); // reference logique vers hotel_db.hotels
            $table->string('lead_name')->nullable();
            $table->string('lead_phone', 30)->nullable();
            $table->text('summary')->nullable();
            $table->json('messages');
            $table->enum('status', ['in_progress', 'notified', 'contacted'])->default('in_progress');
            $table->timestamps();

            $table->index('hotel_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
