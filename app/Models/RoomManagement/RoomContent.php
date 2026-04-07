<?php

namespace App\Models\RoomManagement;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomContent extends Model
{
  use HasFactory;
  protected $table = 'room_category_contents';

  protected $fillable = [
    'language_id',
    'room_category_id',
    'room_id',
    'title',
    'slug',
    'summary',
    'description',
    'amenities',
    'meta_keywords',
    'meta_description'
  ];

  public function room()
  {
    return $this->belongsTo('App\Models\RoomManagement\Room');
  }

  public function roomContentLang()
  {
    return $this->belongsTo('App\Models\Language');
  }
}
