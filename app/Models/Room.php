<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    "hotel_id","name","description","price","capacity","room_type","view","size","images"
])]

class Room extends Model
{
    public function hotel()
    {
        return $this->belongsTo(Hotel::class)->withDefault();
    }
}
