<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    "user_id","district_id","name","short_description",
    "long_description","rating","reviews_count","price","amenities"
])]

class Hotel extends Model
{
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
