<?php

namespace App\Models\RoomManagement;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomNumber extends Model
{
    use HasFactory;
    protected $fillable = ['room_number', 'room_category_id', 'status', 'vendor_id'];

    public function categoryContents()
    {
        return $this->hasMany(RoomContent::class, 'room_id', 'room_category_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
    }
}
