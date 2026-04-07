<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;

class RoomBookingRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */
  public function authorize()
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array
   */
  public function rules(Request $request)
  {
    $ruleArray = [
      'dates' => ['required'],
      'nights' => 'required',
      'adult' => 'required|numeric|min:1',
      'customer_name' => 'required',
      'customer_phone' => 'required',
      'customer_email' => 'required|email:rfc,dns',
      'total_rooms' => [
        'required',
        'numeric',
        'min:1',
        function ($attribute, $value, $fail) use ($request) {
          $requested = (int) $value;
          $available = (int) $request->input('total_room_avaiable');

          if ($requested > $available) {
            $fail("Only {$available} rooms are available. You requested {$requested}.");
          }
        },
      ],
    ];


    if ($this->paymentType == 'stripe') {
      $ruleArray['stripeToken'] = 'required';
    }

    if ($this->paymentType == 'iyzico') {
      $ruleArray['city'] = 'required';
      $ruleArray['country'] = 'required';
      $ruleArray['address'] = 'required';
      $ruleArray['zip_code'] = 'required';
      $ruleArray['identity_number'] = 'required';
    }
    if ($this->paymentType == 'authorize.net') {
      $ruleArray['opaqueDataDescriptor'] = 'required';
      $ruleArray['opaqueDataValue'] = 'required';
    }

    return $ruleArray;
  }
}
