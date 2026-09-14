<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // hotel_id nullable = la conversation concerne la plateforme elle-meme
    // (paiement, compte, litige), pas un hotel precis.
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->uuid('hotel_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->uuid('hotel_id')->nullable(false)->change();
        });
    }
};
