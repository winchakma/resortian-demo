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

class FlutterwaveController extends Controller
{
  use MiscellaneousTrait;

  private $public_key, $secret_key;

  public function __construct()
  {
    $data = OnlineGateway::whereKeyword('flutterwave')->first();
    $flutterwaveData = json_decode($data->information, true);

    $this->public_key = $flutterwaveData['flutterwave_public_key'];
    $this->secret_key = $flutterwaveData['flutterwave_secret_key'];
  }

  public function bookingProcess(Request $request)
  {
    $roomBooking = new RoomBookingController();

    // do calculation
    $calculatedData = $roomBooking->calculation($request);

    $available_currency = array('BIF', 'CAD', 'CDF', 'CVE', 'EUR', 'GBP', 'GHS', 'GMD', 'GNF', 'KES', 'LRD', 'MWK', 'NGN', 'RWF', 'SLL', 'STD', 'TZS', 'UGX', 'USD', 'XAF', 'XOF', 'ZMK', 'ZMW', 'ZWD');

    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();

    // checking whether the base currency is allowed or not
    if (!in_array($currencyInfo->base_currency_text, $available_currency)) {
      return redirect()->back()->with('error', 'Invalid currency for flutterwave payment.');
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
    $data['method'] = 'Flutterwave';
    $data['type'] = 'online';

    // store the room booking information in database
    $booking_details = $roomBooking->storeData($request, $data);

    $notify_url = route('room_booking.flutterwave.notify');

    // set curl
    $curl = curl_init();
    $uniqId = time();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/hosted/pay",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode([
        'amount' => intval($calculatedData['paying_amount']),
        'customer_email' => $booking_details->customer_email,
        'currency' => $booking_details->currency_text,
        'txref' => $uniqId,
        'PBFPubKey' => $this->public_key,
        'redirect_url' => $notify_url,
        'payment_plan' => ''
      ]),
      CURLOPT_HTTPHEADER => [
        "content-type: application/json",
        "cache-control: no-cache"
      ],
    ));

    $response = curl_exec($curl);

    // close curl
    curl_close($curl);

    $transaction = json_decode($response, true);

    // put some data in session before redirect to flutterwave url
    session()->put('bookingId', $booking_details->id);   // db row number
    session()->put('orderNumber', $uniqId);

    if (!array_key_exists('data', $transaction) || !array_key_exists('link', $transaction['data'])) {
      return redirect()->back()->with('error', 'API returned error: ' . $transaction['message']);
    } else {
      return redirect($transaction['data']['link']);
    }
  }

  public function notify(Request $request)
  {
    // get the information from Session
    $bookingId = session()->get('bookingId');
    $orderNumber = session()->get('orderNumber');

    // get the information from the url
    $urlInfo = $request->all();

    if (isset($urlInfo['txref'])) {
      $ref = $orderNumber;

      $query = array(
        "SECKEY" => $this->secret_key,
        "txref" => $ref
      );

      $data_string = json_encode($query);

      $ch = curl_init('https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/verify');
      curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
      curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

      $response = curl_exec($ch);

      curl_close($ch);

      $resp = json_decode($response, true);

      if ($resp['status'] == 'error') {
        return redirect()->route('room_booking.cancel');
      }

      if ($resp['status'] = "success") {
        $paymentStatus = $resp['data']['status'];
        $chargeResponsecode = $resp['data']['chargecode'];

        if (($chargeResponsecode == "00" || $chargeResponsecode == "0") && ($paymentStatus == "successful")) {
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
          session()->forget('paymentId');

          return redirect()->route('room_booking.complete');
        }
      }

      return redirect()->route('room_booking.cancel');
    }

    return redirect()->route('room_booking.cancel');
  }
}
