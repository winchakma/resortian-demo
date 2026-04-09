<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'type',
        'unit_price',
        'total_units',
        'net_profit',
        'return',
        'total_return',
        'duration',
        'location',
        'image',
        'description',
        'isFeatured',
    ];

    protected $casts = [
        'isFeatured' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(ProjectBooking::class);
    }
}
