<?php

namespace App\Models\RoomManagement;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
  use HasFactory;

  protected $fillable = [
    'booking_id',
    'vendor_id',
    'customer_name',
    'customer_email',
    'customer_phone',
    'paying_amount',
    'refund_amount',
    'refund_reason',
    'status',
    'request_from',
  ];
}
