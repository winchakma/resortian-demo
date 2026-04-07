<?php

namespace App\Http\Controllers\FrontEnd\Room;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Room\RoomBookingController;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\RoomManagement\Room;
use App\Models\RoomManagement\RoomBooking;
use App\Models\Transaction;
use App\Models\Vendor;
use App\Traits\MiscellaneousTrait;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class RazorpayController extends Controller
{
  use MiscellaneousTrait;

  private $key, $secret, $api;

  public function __construct()
  {
    $data = OnlineGateway::whereKeyword('razorpay')->first();
    $razorpayData = json_decode($data->information, true);

    $this->key = $razorpayData['razorpay_key'];
    $this->secret = $razorpayData['razorpay_secret'];
    $this->api = new Api($this->key, $this->secret);
  }

  public function bookingProcess(Request $request)
  {
    $roomBooking = new RoomBookingController();

    // do calculation
    $calculatedData = $roomBooking->calculation($request);

    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();

    // checking whether the currency is set to 'INR' or not
    if ($currencyInfo->base_currency_text !== 'INR') {
      return redirect()->back()->with('error', 'Invalid currency for razorpay payment.');
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
    $data['method'] = 'Razorpay';
    $data['type'] = 'online';

    // store the room booking information in database
    $booking_details = $roomBooking->storeData($request, $data);

    $notify_url = route('room_booking.razorpay.notify');

    $orderData = [
      'receipt'         => 'Room Booking',
      'amount'          => $calculatedData['paying_amount'] * 100, // convert total rent into smallest unit
      'currency'        => 'INR',
      'payment_capture' => 1 // auto capture
    ];

    $razorpayOrder = $this->api->order->create($orderData);

    $data = [
      'key'               => $this->key,
      'amount'            => $orderData['amount'],
      'name'              => $orderData['receipt'],
      'description'       => 'Booking Room via Razorpay Gateway',
      'prefill'           => [
        'name'              => $booking_details->customer_name,
        'email'             => $booking_details->customer_email,
        'contact'           => $booking_details->customer_phone
      ],
      'notes'             => [
        'merchant_order_id' => $booking_details->order_number
      ],
      'order_id'          => $razorpayOrder['id']
    ];

    $jsonData = json_encode($data);

    // put some data in session before redirect to razorpay url
    session()->put('bookingId', $booking_details->id);   // db row number
    session()->put('razorpayOrderId', $razorpayOrder['id']);

    return view('frontend.partials.razorpay', compact('jsonData', 'notify_url'));
  }

  public function notify(Request $request)
  {
    // get the information from session
    $bookingId = session()->get('bookingId');
    $razorpayOrderId = session()->get('razorpayOrderId');

    // get the information from the url, which has send by razorpay through post request
    $urlInfo = $request->all();

    // let, assume that the transaction was successfull
    $success = true;

    // Either razorpay_order_id or razorpay_subscription_id must be present
    // the keys of $attributes array must be follow razorpay convention
    try {
      $attributes = [
        'razorpay_order_id' => $razorpayOrderId,
        'razorpay_payment_id' => $urlInfo['razorpayPaymentId'],
        'razorpay_signature' => $urlInfo['razorpaySignature']
      ];

      $this->api->utility->verifyPaymentSignature($attributes);
    } catch (SignatureVerificationError $e) {
      $success = false;
    }

    if ($success === true) {
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
      session()->forget('bookingId');
      session()->forget('razorpayOrderId');

      return redirect()->route('room_booking.complete');
    } else {
      return redirect()->route('room_booking.cancel');
    }
  }
}
