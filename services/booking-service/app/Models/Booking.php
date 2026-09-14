<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasUuids;

    protected $fillable = ['user_id', 'room_id', 'check_in', 'check_out', 'status'];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
    ];
}
