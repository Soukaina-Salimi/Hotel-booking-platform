<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasUuids;

    protected $fillable = [
        'hotel_id',
        'lead_name',
        'lead_phone',
        'summary',
        'messages',
        'status',
        'proposed_slots',
        'slots_proposed_at',
        'appointment_at',
        'google_event_id',
    ];

    protected $casts = [
        'messages' => 'array',
        'proposed_slots'    => 'array',      // ✅ AJOUT — JSON → array
        'slots_proposed_at' => 'datetime',   // ✅ AJOUT — string → Carbon
        'appointment_at'    => 'datetime',   // ✅ AJOUT
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
    ];
}
