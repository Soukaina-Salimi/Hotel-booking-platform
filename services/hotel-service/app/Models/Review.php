<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasUuids;

    protected $fillable = ['user_id', 'hotel_id', 'rating', 'comment'];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
