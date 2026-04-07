<?php

namespace App\Http\Controllers\FrontEnd\Room;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Room\RoomBookingController;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\RoomManagement\Room;
use App\Models\RoomManagement\RoomBooking;
use App\Models\Vendor;
use App\Traits\MiscellaneousTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Ixudra\Curl\Facades\Curl;

class PhonePeController extends Controller
{
  use MiscellaneousTrait;

  private $gateway_information;

  public function __construct()
  {
    $data = OnlineGateway::whereKeyword('phonepe')->first();
    $information = json_decode($data->information, true);

    $this->gateway_information = $information;
  }

  public function bookingProcess(Request $request)
  {
    $roomBooking = new RoomBookingController();
    // do calculation
    $calculatedData = $roomBooking->calculation($request);
    $available_currency = array('INR');
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    // checking whether the base currency is allowed or not
    if (!in_array($currencyInfo->base_currency_text, $available_currency)) {
      return redirect()->back()->with('error', 'Invalid currency for PhonePe payment.');
    }

    $data['total_rent'] = $calculatedData['total_rent'];
    $data['service_charge'] = $calculatedData['service_charge'];
    $data['subtotal'] = $calculatedData['subtotal'];
    $data['discount'] = $calculatedData['discount'];
    $data['tax_percentage'] = $calculatedData['tax_percentage'];
    $data['tax'] = $calculatedData['tax'];
    $data['grand_total'] = $calculatedData['grand_total'];
    $data['paying_amount'] = $calculatedData['paying_amount'];
    $data['due'] = $calculatedData['due'];
    $data['method'] = 'PhonePe';
    $data['type'] = 'online';


    $notify_url = route('room_booking.phonepe.notify');

    /***************************************************
     ************** Payment gateway info **************
     ***************************************************/

    $randomNo = substr(uniqid(), 0, 3);
    $pay_info = array(
      'merchantId' => $this->gateway_information['merchant_id'],
      'merchantTransactionId' => uniqid(),
      'merchantUserId' => 'MUID' . $randomNo,
      'amount' => $calculatedData['paying_amount']  * 100,
      'redirectUrl' => $notify_url,
      'redirectMode' => 'POST',
      'callbackUrl' => $notify_url,
      'mobileNumber' => $request->customer_phone ? $request->customer_phone : '9999999999',
      'paymentInstrument' =>
      array(
        'type' => 'PAY_PAGE',
      ),
    );

    $encode = base64_encode(json_encode($pay_info));

    $saltKey = $this->gateway_information['salt_key']; // sandbox salt key
    $saltIndex = $this->gateway_information['salt_index'];

    $string = $encode . '/pg/v1/pay' . $saltKey;
    $sha256 = hash('sha256', $string);

    $finalXHeader = $sha256 . '###' . $saltIndex;

    if ($this->gateway_information['sandbox_status'] == 1) {
      $url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"; // sandbox payment URL
    } else {
      $url = "https://api.phonepe.com/apis/hermes/pg/v1/pay"; // prod payment URL
    }

    $response = Curl::to($url)
      ->withHeader('Content-Type:application/json')
      ->withHeader('X-VERIFY:' . $finalXHeader)
      ->withData(json_encode(['request' => $encode]))
      ->post();

    $rData = json_decode($response);
    if ($rData->success == true) {
      if (!empty($rData->data->instrumentResponse->redirectInfo->url)) {
        // store the room booking information in database
        $booking_details = $roomBooking->storeData($request, $data);

        // put some data in session before redirect
        Session::put('bookingId', $booking_details->id);   // db row number
        return redirect()->to($rData->data->instrumentResponse->redirectInfo->url);
      } else {
        return redirect()->back()->with('error', 'The Payment has been canceled');
      }
    } else {
      return redirect()->back()->with('error', 'The Payment has been canceled');
    }
  }

  public function notify(Request $request)
  {
    // get the information from Session
    $bookingId = Session::get('bookingId');
    if ($request->code == 'PAYMENT_SUCCESS' && $this->gateway_information['merchant_id'] == $request->merchantId) {
      // update the payment status for room booking in database
      $bookingInfo = RoomBooking::where('id', $bookingId)->firstOrFail();

      if ($bookingInfo->due > 0) {
        $bookingInfo->update(['payment_status' => 3]); // partial
      } else {
        $bookingInfo->update(['payment_status' => 1]); // full
      }

      $roomBooking = new RoomBookingController();

      // generate invoice
      $invoice = $roomBooking->generateInvoice($bookingInfo);

      $room = Room::where('id', $bookingInfo->room_category_id)->first();

      $vendor_id = 0;
      if (!empty($room) && (int)$room->vendor_id !== 0) {
        $vendor_id = (int)$room->vendor_id;
      }

      $vendor = $vendor_id ? Vendor::where('id', $vendor_id)->first() : null;

      // Commission percent
      $commissionPercent = Commission::value('room_booking_commission') ?? 0;

      // Totals
      $grandTotal = (float) $bookingInfo->grand_total;
      $paidAmount = (float) ($bookingInfo->paying_amount ?? 0);

      // ============ ADMIN ROOM CASE ============
      if ($vendor_id == 0 || !$vendor) {

        // admin gets everything (100%)
        $adminPaidCommission = $paidAmount;
        $adminDueCommission  = max(0, $grandTotal - $paidAmount);

        $bookingInfo->update([
          'invoice'             => $invoice,
          'commission_percentage' => 100,
          'comission'           => $grandTotal,
          'received_amount'     => 0,
          'admin_paid_commission' => $adminPaidCommission,
          'admin_due_commission'  => $adminDueCommission,
          'vendor_paid_amount'    => 0,
          'vendor_due_amount'     => 0,
        ]);

        $earning = Earning::first();
        $earning->total_revenue = (float)$earning->total_revenue + $paidAmount;
        $earning->total_earning = (float)$earning->total_earning + $adminPaidCommission;
        $earning->save();

        store_transaction([
          'transcation_id' => time(),
          'booking_id' => $bookingInfo->id,
          'transcation_type' => 1,
          'user_id' => null,
          'vendor_id' => 0,
          'payment_status' => 1,
          'payment_method' => $bookingInfo->payment_method,
          'grand_total' => $paidAmount,
          'commission'  => $adminPaidCommission,
          'pre_balance' => null,
          'after_balance' => null,
          'gateway_type' => $bookingInfo->gateway_type,
          'currency_symbol' => $bookingInfo->currency_symbol,
          'currency_symbol_position' => $bookingInfo->currency_symbol_position,
        ]);

        $roomBooking->sendMail($bookingInfo);

        session()->forget('bookingId');
        session()->forget('paymentId');

        return redirect()->route('room_booking.complete');
      }

      // ============ VENDOR ROOM (COMMISSION-FIRST) ============
      $totalCommission   = round(($grandTotal * $commissionPercent) / 100, 2);
      $totalVendorAmount = round($grandTotal - $totalCommission, 2);

      $oldAdminPaid  = (float) ($bookingInfo->admin_paid_commission ?? 0);
      $oldVendorPaid = (float) ($bookingInfo->vendor_paid_amount ?? 0);

      $thisPayToAdmin  = 0.00;
      $thisPayToVendor = 0.00;

      if ($paidAmount > 0) {

        $remainingCommission = max(0, round($totalCommission - $oldAdminPaid, 2));

        if ($paidAmount <= $remainingCommission) {
          $thisPayToAdmin  = $paidAmount;
          $thisPayToVendor = 0.00;
        } else {
          $thisPayToAdmin  = $remainingCommission;
          $thisPayToVendor = $paidAmount - $remainingCommission;
        }
      }

      $newAdminPaid  = round($oldAdminPaid + $thisPayToAdmin, 2);
      $newVendorPaid = round($oldVendorPaid + $thisPayToVendor, 2);

      $adminDueCommission = max(0, round($totalCommission - $newAdminPaid, 2));
      $vendorDueAmount    = max(0, round($totalVendorAmount - $newVendorPaid, 2));

      // vendor balance update only for vendor part
      $pre_balance = (float) $vendor->amount;
      if ($thisPayToVendor > 0) {
        $vendor->amount = (float) $vendor->amount + (float) $thisPayToVendor;
        $vendor->save();
      }
      $after_balance = (float) $vendor->amount;

      // booking update
      $bookingInfo->update([
        'invoice'               => $invoice,
        'commission_percentage' => $commissionPercent,
        'comission'             => $totalCommission,
        'received_amount'       => $thisPayToVendor, // vendor got now
        'admin_paid_commission' => $newAdminPaid,
        'admin_due_commission'  => $adminDueCommission,
        'vendor_paid_amount'    => $newVendorPaid,
        'vendor_due_amount'     => $vendorDueAmount,
      ]);

      // earning update
      $earning = Earning::first();
      $earning->total_revenue = (float)$earning->total_revenue + $paidAmount;
      $earning->total_earning = (float)$earning->total_earning + $thisPayToAdmin;
      $earning->save();

      // transaction
      store_transaction([
        'transcation_id' => time(),
        'booking_id' => $bookingInfo->id,
        'transcation_type' => 1,
        'user_id' => null,
        'vendor_id' => $vendor_id,
        'payment_status' => 1,
        'payment_method' => $bookingInfo->payment_method,
        'grand_total' => $paidAmount,
        'commission' => $thisPayToAdmin,
        'pre_balance' => $pre_balance,
        'after_balance' => $after_balance,
        'gateway_type' => $bookingInfo->gateway_type,
        'currency_symbol' => $bookingInfo->currency_symbol,
        'currency_symbol_position' => $bookingInfo->currency_symbol_position,
      ]);

      // send mail
      $roomBooking->sendMail($bookingInfo);

      // remove all session data
      Session::forget('bookingId');

      return redirect()->route('room_booking.complete');
    } else {
      return redirect()->route('room_booking.cancel');
    }
  }
}
