<?php

namespace App\Models\RoomManagement;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaidService extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'status',
        'vendor_id'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }
}
