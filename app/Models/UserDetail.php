<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    protected $fillable = [
        'user_id',
        'nid_number',
        'date_of_birth',
        'gender',
        'photo',
        'bank_name',
        'account_name',
        'account_number',
        'branch_name',
        'routing_number',
        'swift_code',
        'nominee_name',
        'nominee_number',
        'nominee_nid',
        'nominee_relation',
        'nominee_photo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withDefault();
    }
}
