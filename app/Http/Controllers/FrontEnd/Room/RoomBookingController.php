<?php

namespace App\Http\Controllers\FrontEnd\Room;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Room\FlutterwaveController;
use App\Http\Controllers\FrontEnd\Room\InstamojoController;
use App\Http\Controllers\FrontEnd\Room\MercadoPagoController;
use App\Http\Controllers\FrontEnd\Room\MollieController;
use App\Http\Controllers\FrontEnd\Room\PayPalController;
use App\Http\Controllers\FrontEnd\Room\PaystackController;
use App\Http\Controllers\FrontEnd\Room\PaytmController;
use App\Http\Controllers\FrontEnd\Room\RazorpayController;
use App\Http\Controllers\FrontEnd\Room\StripeController;
use App\Http\Requests\RoomBookingRequest;
use App\Models\BasicSettings\Basic;
use App\Models\BasicSettings\MailTemplate;
use App\Models\Commission;
use App\Models\RoomManagement\Refund;
use App\Models\RoomManagement\Room;
use App\Models\RoomManagement\RoomAmenity;
use App\Models\RoomManagement\RoomBooking;
use App\Models\RoomManagement\RoomContent;
use App\Traits\MiscellaneousTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Log;

class RoomBookingController extends Controller
{
  use MiscellaneousTrait;

  public function makeRoomBooking(RoomBookingRequest $request)
  {
    // check whether user is logged in or not (start)
    $status = DB::table('basic_settings')->select('room_guest_checkout_status')
      ->where('uniqid', '=', 12345)
      ->first();

    if (($status->room_guest_checkout_status == 0) && (Auth::guard('web')->check() == false)) {
      return redirect()->route('user.login', ['redirectPath' => 'room_details']);
    }
    // check whether user is logged in or not (end)

    if ($request->paymentType == 'none') {
      session()->flash('error', 'Please select a payment method.');

      return redirect()->back()->withInput();
    } else if ($request->paymentType == 'paypal') {
      $paypal = new PayPalController();

      return $paypal->bookingProcess($request);
    } else if ($request->paymentType == 'stripe') {
      $stripe = new StripeController();

      return $stripe->bookingProcess($request);
    } else if ($request->paymentType == 'paytm') {
      $paytm = new PaytmController();

      return $paytm->bookingProcess($request);
    } else if ($request->paymentType == 'instamojo') {
      $instamojo = new InstamojoController();

      return $instamojo->bookingProcess($request);
    } else if ($request->paymentType == 'paystack') {
      $paystack = new PaystackController();

      return $paystack->bookingProcess($request);
    } else if ($request->paymentType == 'flutterwave') {
      $flutterwave = new FlutterwaveController();

      return $flutterwave->bookingProcess($request);
    } else if ($request->paymentType == 'mollie') {
      $mollie = new MollieController();

      return $mollie->bookingProcess($request);
    } else if ($request->paymentType == 'razorpay') {
      $razorpay = new RazorpayController();

      return $razorpay->bookingProcess($request);
    } else if ($request->paymentType == 'mercadopago') {
      $mercadopago = new MercadoPagoController();

      return $mercadopago->bookingProcess($request);
    } else if ($request->paymentType == 'yoco') {
      $payment = new YocoController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'xendit') {
      $payment = new XenditController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'perfect_money') {
      $payment = new PerfectMoneyController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'toyyibpay') {
      $payment = new ToyyibpayController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'paytabs') {
      $payment = new PaytabsController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'phonepe') {
      $payment = new PhonePeController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'iyzico') {
      $payment = new IyzicoController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'myfatoorah') {
      $payment = new MyFatoorahController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'midtrans') {
      $payment = new MidtransController();

      return $payment->bookingProcess($request);
    } else if ($request->paymentType == 'authorizenet') {
      $payment = new AuthorizenetController();

      return $payment->bookingProcess($request);
    } else {
      $offline = new OfflineController();

      return $offline->bookingProcess($request);
    }
  }

  public function calculation(Request $request)
  {
    $totalRentRoom = Session::get('totalRentRoom', 0.0);
    $roomDiscount = Session::get('roomDiscount', 0.0);

    $bs = Basic::select('tax')->first();

    $taxRate = is_numeric($bs->tax ?? null) ? $bs->tax : 0;
    $tax = ($totalRentRoom - $roomDiscount) * ($taxRate / 100);

    $grandTotal = $totalRentRoom - $roomDiscount + $tax;
    $payingAmount = Session::get('paying_amount', 0.0);
    $due = $grandTotal - $payingAmount;

    $calculatedData = array(
      'total_rent' => $totalRentRoom,
      'service_charge' => 0.00,
      'subtotal' => $totalRentRoom,
      'discount' => $roomDiscount,
      'tax_percentage' => $taxRate,
      'tax' => $tax,
      'grand_total' => $grandTotal,
      'paying_amount' => $payingAmount,
      'due' => $due,
    );

    session()->forget('couponCode');

    return $calculatedData;
  }

  public function storeData(Request $request, $data)
  {
    $dateArray = explode(' ', $request->dates);
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    $bs = Basic::select('room_auto_approval')->first();
    $rooms = Session::get('selectedRoomsPerDate', 0.0);

    $room = Room::where('id', $request->room_category_id)->first();
    if (!empty($room)) {
      if ($room->vendor_id != NULL) {
        $vendor_id = $room->vendor_id;
      } else {
        $vendor_id = 0;
      }
    } else {
      $vendor_id = 0;
    }

    $booking_details = RoomBooking::create([
      'booking_number' => time(),
      'user_id' => Auth::guard('web')->check() == true ? Auth::guard('web')->user()->id : null,
      'customer_name' => $request->customer_name,
      'customer_email' => $request->customer_email,
      'customer_phone' => $request->customer_phone,
      'room_category_id' => $request->room_category_id,
      'vendor_id' => $vendor_id,
      'arrival_date' => $dateArray[0],
      'departure_date' => $dateArray[2],
      'adult' => $request->adult,
      'child' => $request->child,

      'total_rent' => $data['total_rent'],
      'service_charge' => $data['service_charge'],
      'subtotal' => $data['subtotal'],
      'discount' => $data['discount'],
      'tax_percentage' => $data['tax_percentage'],
      'tax' => $data['tax'],
      'grand_total' => $data['grand_total'],
      'paying_amount' => $data['paying_amount'],
      'due' => $data['due'],

      'currency_symbol' => $currencyInfo->base_currency_symbol,
      'currency_symbol_position' => $currencyInfo->base_currency_symbol_position,
      'currency_text' => $currencyInfo->base_currency_text,
      'currency_text_position' => $currencyInfo->base_currency_text_position,


      'payment_method' => $data['payment_method'],
      'gateway_type' => $data['gateway_type'],


      'reserved_dates_info' => $rooms,
      'total_rooms' => $request->total_rooms,
      'payment_status' => 0,
      'booking_status' => $bs->room_auto_approval == 1 ? 1 : 0,


      'attachment' => $request->hasFile('attachment') ? $data['attachment'] : null,
      'conversation_id' => array_key_exists('conversation_id', $data) ? $data["conversation_id"] : null
    ]);

    return $booking_details;
  }

  public function generateInvoice($bookingInfo)
  {
    $bs = Basic::select('website_title', 'support_contact', 'support_email', 'address')->first();

    // delete previous invoice from local storage
    @unlink(public_path('assets/invoices/rooms/') . $bookingInfo->invoice);

    $fileName = $bookingInfo->booking_number . '.pdf';
    $directory = public_path('assets/invoices/rooms/');

    @mkdir($directory, 0777, true);

    $fileLocated = $directory . $fileName;

    Pdf::loadView('frontend.pdf.room_booking', compact('bookingInfo', 'bs'))->save($fileLocated);

    return $fileName;
  }

  public function sendMail($bookingInfo)
  {
    // first get the mail template information from db
    $mailTemplate = MailTemplate::where('mail_type', 'room_booking')->first();
    $mailSubject = $mailTemplate->mail_subject;
    $mailBody = replaceBaseUrl($mailTemplate->mail_body, 'summernote');

    // second get the website title & mail's smtp information from db
    $info = DB::table('basic_settings')
      ->select('website_title', 'smtp_status', 'smtp_host', 'smtp_port', 'encryption', 'smtp_username', 'smtp_password', 'from_mail', 'from_name')
      ->first();

    // get the difference of two dates, date should be in 'YYYY-MM-DD' format
    $date1 = new DateTime($bookingInfo->arrival_date);
    $date2 = new DateTime($bookingInfo->departure_date);
    $interval = $date1->diff($date2, true);

    // get the room category name according to language
    $language = MiscellaneousTrait::getLanguage();

    $roomContent = RoomContent::where('language_id', $language->id)
      ->where('room_id', $bookingInfo->room_category_id)
      ->first();

    $roomRent = ($bookingInfo->currency_text_position == 'left' ? $bookingInfo->currency_text . ' ' : '') . $bookingInfo->grand_total . ($bookingInfo->currency_text_position == 'right' ? ' ' . $bookingInfo->currency_text : '');

    // get the amenities of booked room
    $amenityIds = json_decode($roomContent->amenities);

    $amenityArray = [];

    foreach ($amenityIds as $id) {
      $amenity = RoomAmenity::where('id', $id)->first();
      array_push($amenityArray, $amenity->name);
    }

    // now, convert amenity array into comma separated string
    $amenityString = implode(', ', $amenityArray);

    // replace template's curly-brace string with actual data
    $mailBody = str_replace('{customer_name}', $bookingInfo->customer_name, $mailBody);
    $mailBody = str_replace('{room_name}', '<a href="' . route('room_details', [$roomContent->room_id, $roomContent->slug]) . '">' . $roomContent->title . '</a>', $mailBody);
    $mailBody = str_replace('{room_rent}', $roomRent, $mailBody);
    $mailBody = str_replace('{booking_number}', $bookingInfo->booking_number, $mailBody);
    $mailBody = str_replace('{booking_date}', date_format($bookingInfo->created_at, 'F d, Y'), $mailBody);
    $mailBody = str_replace('{number_of_night}', $interval->days, $mailBody);
    $mailBody = str_replace('{website_title}', $info->website_title, $mailBody);
    $mailBody = str_replace('{check_in_date}', $bookingInfo->arrival_date, $mailBody);
    $mailBody = str_replace('{check_out_date}', $bookingInfo->departure_date, $mailBody);
    $mailBody = str_replace('{number_of_guests}', $bookingInfo->guests, $mailBody);
    $mailBody = str_replace('{room_amenities}', $amenityString, $mailBody);

    $data = [
      'invoice' => $bookingInfo->invoice,
      'toMail' => $bookingInfo->customer_email,
      'from_mail' => $info->from_mail,
      'from_name' => $info->from_name
    ];

    if ($info->smtp_status == 1) {
      try {
        $smtp = [
          'transport' => 'smtp',
          'host' => $info->smtp_host,
          'port' => $info->smtp_port,
          'encryption' => $info->encryption,
          'username' => $info->smtp_username,
          'password' => $info->smtp_password,
          'timeout' => null,
          'auth_mode' => null,
        ];
        Config::set('mail.mailers.smtp', $smtp);
      } catch (\Exception $e) {
        Session::flash('error', $e->getMessage());
        return back();
      }
    }


    if ($info->smtp_status == 1) {
      try {

        Mail::send([], [], function (Message $message) use ($data, $mailBody, $mailSubject) {
          $fromMail = $data['from_mail'];
          $fromName = $data['from_name'];

          $message->to($data['toMail'])
            ->subject($mailSubject)
            ->from($fromMail, $fromName)
            ->html($mailBody, 'text/html');

          if (array_key_exists('invoice', $data)) {
            $message->attach(public_path('assets/invoices/rooms/' . $data['invoice']), [
              'as' => 'Invoice',
              'mime' => 'application/pdf',
            ]);
          }
        });
      } catch (\Exception $e) {
        Session::flash('error', $e->getMessage());
        return back();
      }
    }
    //laravel facade mailer end
  }

  public function complete()
  {
    $information['breadcrumbInfo'] = MiscellaneousTrait::getBreadcrumb();

    return view('frontend.partials.payment_success', $information);
  }

  public function cancel()
  {
    return redirect('/rooms')->with('error', 'Sorry, an error has occured!');
  }
  public function dispute($id)
  {
    $information['breadcrumbInfo'] = MiscellaneousTrait::getBreadcrumb();

    $refund = Refund::where([
      ['status', '=', 2],
      ['id', '=', $id],
    ])->firstOrFail();
    $language = MiscellaneousTrait::getLanguage();

    $booking = RoomBooking::Where('id', $refund->booking_id)->firstOrFail();

    $roomInfo = $booking->hotelRoom()->first();

    $roomContentInfo = $roomInfo->roomContent()->where('language_id', $language->id)->first();
    $information['roomTitle'] = $roomContentInfo->title;



    $information['booking'] = $booking;
    $information['refund'] = $refund;

    return view('frontend.rooms.dispute', $information);
  }

  public function disputeStore(Request $request)
  {

    $validated = $request->validate([
      'refund_id' => 'required|integer|exists:refunds,id',
      'reason'    => 'required|string',
    ]);

    $refund = Refund::where('id', $validated['refund_id'])
      ->where('status', 2)
      ->firstOrFail();

    $refund->status = 3; // dispute submitted
    $refund->dispute_message = $validated['reason'];
    $refund->save();

    return redirect()->route('index')->with('success', 'Dispute submitted successfully!');
  }
}
