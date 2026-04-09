<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectBooking extends Model
{
    protected $fillable = [
        'project_id',
        'units',
        'user_id',
        'payment_receipt',
        'payment_date',
        'payment_method',
        'payment_status',
        'status',
        'is_returned',
        'booking_no',
        'return_percent',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($booking) {
            $booking->updateQuietly([
                'booking_no' => 'AGV-' . str_pad($booking->id, 5, '0', STR_PAD_LEFT)
            ]);
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
