<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->json('proposed_slots')->nullable()->after('messages');
            $table->timestamp('slots_proposed_at')->nullable()->after('proposed_slots');
            $table->string('google_event_id', 255)->nullable()->after('slots_proposed_at');
            $table->timestamp('appointment_at')->nullable()->after('google_event_id');
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn([
                'proposed_slots',
                'slots_proposed_at',
                'google_event_id',
                'appointment_at',
            ]);
        });
    }
};
