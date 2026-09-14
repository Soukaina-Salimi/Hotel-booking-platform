<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasUuids;

    protected $fillable = [
        'hotel_id', 'lead_name', 'lead_phone', 'summary', 'messages', 'status',
    ];

    protected $casts = [
        'messages' => 'array',
    ];
}
