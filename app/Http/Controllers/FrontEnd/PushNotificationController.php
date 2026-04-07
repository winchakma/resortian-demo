<?php

namespace App\Http\Controllers\FrontEnd;

use App\Http\Controllers\Controller;
use App\Models\BasicSettings\Basic;
use App\Models\Guest;
use App\Models\RoomManagement\RoomBooking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PushNotificationController extends Controller
{
  public function store(Request $request)
  {
    $request->validate([
      'endpoint' => 'required',
      'keys.p256dh' => 'required',
      'keys.auth' => 'required'
    ]);

    $endpoint = $request->endpoint;
    $key = $request->keys['p256dh'];
    $token = $request->keys['auth'];

    $guest = Guest::query()->firstOrCreate([
      'endpoint' => $endpoint
    ]);

    $guest->updatePushSubscription($endpoint, $key, $token);

    return response()->json(['status' => 'Success'], 200);
  }

  public function generateInvoice()
  {
    $bookingInfo = RoomBooking::find(3);
    $bs = Basic::select('website_title', 'support_contact', 'support_email', 'address')->first();

    // delete previous invoice from local storage
    @unlink(public_path('assets/invoices/rooms/') . $bookingInfo->invoice);

    $fileName = $bookingInfo->booking_number . '.pdf';
    $directory = public_path('assets/invoices/rooms/');

    @mkdir($directory, 0777, true);

    $fileLocated = $directory . $fileName;

    $pdf =   Pdf::loadView('frontend.pdf.room_booking_2', compact('bookingInfo', 'bs'))->save($fileLocated);

    return $pdf->stream('invoice.pdf');

    return view('frontend.pdf.room_booking_2', ['bookingInfo' => $bookingInfo, 'bs' => $bs]);
  }
}
