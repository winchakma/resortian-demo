<?php

namespace App\Http\Requests;

use App\Rules\IsRoomAvailableRule;
use Illuminate\Foundation\Http\FormRequest;

class AdminRoomBookingRequest extends FormRequest
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
  public function rules()
  {
    if ($this->filled('booking_id')) {
      $booking_id = $this->booking_id;
    } else {
      $booking_id = null;
    }
    return [
      'dates' => 'required',
      'total_rooms' => 'required',
      'nights' => 'required',
      'adult' => 'required|numeric|min:1',
      'customer_name' => 'required',
      'customer_phone' => 'required',
      'customer_email' => 'required',
      'payment_method' => 'required',
      'payment_status' => 'required',
      'booking_status' => 'required',
      'paying_amount' => 'required_if:payment_status,3',
      'rooms' => 'required|array|min:1',
      'rooms.*.room_number' => 'required|string',
      'rooms.*.room_id' => 'required|numeric',
      'rooms.*.date' => ['required', 'date'],
    ];
  }

  public function withValidator($validator)
  {
    $validator->after(function ($validator) {
      [$startDate, $endDate] = explode(' - ', $this->dates);
      $start = \Carbon\Carbon::parse($startDate);
      $end = \Carbon\Carbon::parse($endDate)->subDay();
      $interval = $start->diffInDays($end) + 1;

      $requiredRooms = (int) $this->total_rooms;
      $expectedTotal = $interval * $requiredRooms;

      $submittedRooms = is_array($this->rooms) ? count($this->rooms) : 0;

      if ($submittedRooms < $expectedTotal) {
        $validator->errors()->add('rooms', "You must select {$expectedTotal} rooms — {$requiredRooms} per day for {$interval} days. You have selected only {$submittedRooms}.");
      }
    });
  }

  /**
   * Get the validation messages that apply to the request.
   *
   * @return array
   */
  public function messages()
  {
    return [
      'adult.min' => 'The adult must be at least 1 person.',
      'paying_amount.required' => 'The paying amount field is required when payment status is partially paid.',
    ];
  }
}
