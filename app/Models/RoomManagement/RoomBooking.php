<?php

namespace App\Models\RoomManagement;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomBooking extends Model
{
  use HasFactory;

  protected $fillable = [
    'booking_number',
    'user_id',
    'vendor_id',
    'customer_name',
    'customer_email',
    'customer_phone',
    'room_category_id',
    'arrival_date',
    'departure_date',
    'adult',
    'child',
    'total_rent',
    'service_charge',
    'subtotal',
    'discount',
    'tax_percentage',
    'tax',
    'grand_total',
    'paying_amount',
    'due',
    'paid_services', 
    'currency_symbol',
    'currency_symbol_position',
    'currency_text',
    'currency_text_position',
    'payment_method',
    'gateway_type',
    'attachment',
    'invoice',
    'payment_status',
    'booking_status',
    'reserved_dates_info',
    'total_rooms',
    'stay_status',
    'conversation_id',
    'comission',
    'received_amount',
    'admin_paid_commission',
    'admin_due_commission',
    'vendor_paid_amount',
    'vendor_due_amount'
  ];

  protected $casts = [
    'reserved_dates_info' => 'array',
    'paid_services' => 'array',
  ];

  public function hotelRoom()
  {
    return $this->belongsTo('App\Models\RoomManagement\Room', 'room_category_id', 'id');
  }

  public function roomBookedByUser()
  {
    return $this->belongsTo('App\Models\User', 'user_id', 'id');
  }

  //vendor
  public function vendor()
  {
    return $this->belongsTo(Vendor::class, 'vendor_id', 'id');
  }
  //user
  public function user()
  {
    return $this->belongsTo(User::class, 'user_id', 'id');
  }
}
