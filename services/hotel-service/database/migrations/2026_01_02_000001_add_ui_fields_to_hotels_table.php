<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Champs necessaires a l'affichage cote frontend, absents du schema de conception initial
    // (qui se concentrait sur les donnees metier). Amenities est stocke en JSON pour eviter une
    // table de jointure supplementaire au stade du MVP - a revoir si le filtrage par equipement
    // doit devenir plus complexe (recherche combinee, comptage, etc.)
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->text('description')->nullable()->after('address');
            $table->string('cover_image')->nullable()->after('description');
            $table->string('badge', 40)->nullable()->after('cover_image');
            $table->json('amenities')->nullable()->after('badge');
            $table->boolean('featured')->default(false)->after('amenities');
        });
    }

    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropColumn(['description', 'cover_image', 'badge', 'amenities', 'featured']);
        });
    }
};
