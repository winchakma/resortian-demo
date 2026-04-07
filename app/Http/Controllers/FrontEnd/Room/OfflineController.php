<?php

namespace App\Http\Controllers\FrontEnd\Room;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Room\RoomBookingController;
use App\Models\PaymentGateway\OfflineGateway;
use App\Models\RoomManagement\RoomBooking;
use App\Traits\MiscellaneousTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OfflineController extends Controller
{
  use MiscellaneousTrait;

  public function bookingProcess(Request $request)
  {
    $offlineMethod = OfflineGateway::where('id', $request->paymentType)->first();

    // check whether attachment is required or not
    if ($offlineMethod->attachment_status == 1) {
      $rules = [
        'attachment' => 'required|mimes:jpg,jpeg,png'
      ];

      $validator = Validator::make($request->all(), $rules);

      if ($validator->fails()) {
        return redirect()->back()->withErrors($validator->errors())->withInput();
      }
    }

    // store attachment in local storage
    if ($request->hasFile('attachment')) {
      $img = $request->file('attachment');
      $img_name = time() . '.' . $img->getClientOriginalExtension();
      $directory = public_path('assets/img/attachments/rooms/');

      if (!file_exists($directory)) {
        @mkdir($directory, 0775, true);
      }

      $img->move($directory, $img_name);
    }

    $roomBooking = new RoomBookingController();

    // do calculation
    $calculatedData = $roomBooking->calculation($request);

    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();

    $data['total_rent'] = $calculatedData['total_rent'];
    $data['service_charge'] = $calculatedData['service_charge'];
    $data['subtotal'] = $calculatedData['subtotal'];
    $data['discount'] = $calculatedData['discount']; 
    $data['tax_percentage'] = $calculatedData['tax_percentage'];
    $data['tax'] = $calculatedData['tax'];
    $data['grand_total'] = $calculatedData['grand_total'];
    $data['paying_amount'] = $calculatedData['paying_amount'];
    $data['due'] = $calculatedData['due'];
    $data['payment_method'] = $offlineMethod->name;
    $data['gateway_type'] = 'offline';
    $data['attachment'] = $request->hasFile('attachment') ? $img_name : null;

    // store the room booking information in database
    $booking_details = $roomBooking->storeData($request, $data);

    $bookingInfo = RoomBooking::where('id', $booking_details->id)->first();

    // generate an invoice in pdf format
    $invoice = $roomBooking->generateInvoice($bookingInfo);

    // update the invoice field information in database
    $bookingInfo->update(['invoice' => $invoice]);

    // send a mail to the customer with an invoice
    $roomBooking->sendMail($bookingInfo);

    return redirect()->route('room_booking.complete', ['type' => 'offline']);
  }
}
