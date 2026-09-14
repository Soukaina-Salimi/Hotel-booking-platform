<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('size')->nullable()->after('capacity');
            $table->string('bed_type')->nullable()->after('size');
            $table->enum('status', ['available', 'occupied', 'maintenance'])
                ->default('available')->after('bed_type');
            $table->string('image')->nullable()->after('status');
            $table->json('amenities')->nullable()->after('image');
            $table->boolean('featured')->default(false)->after('amenities');
        });
    }

    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn(['size', 'bed_type', 'status', 'image', 'amenities', 'featured']);
        });
    }
};
