<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasUuids;

    protected $fillable = [
        'owner_id', 'name', 'city', 'address', 'status',
        'description', 'cover_image', 'badge', 'amenities', 'featured',
    ];

    protected $casts = [
        'amenities' => 'array',
        'featured' => 'boolean',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
