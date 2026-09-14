<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasUuids;

    protected $fillable = [
        'hotel_id',
        'room_type',
        'price',
        'capacity',
        'description',
        'size',
        'bed_type',
        'status',
        'image',
        'amenities',
        'featured',
    ];

    protected $casts = [
        'amenities' => 'array',
        'featured' => 'boolean',
        'price' => 'float',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
