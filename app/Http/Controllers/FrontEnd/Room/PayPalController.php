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
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Redirect;
use PayPal\Api\Amount;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

class PayPalController extends Controller
{
  use MiscellaneousTrait;

  private $api_context;

  public function __construct()
  {
    $data = OnlineGateway::whereKeyword('paypal')->first();
    $paypalData = json_decode($data->information, true);

    $paypal_conf = Config::get('paypal');
    $paypal_conf['client_id'] = $paypalData['client_id'];
    $paypal_conf['secret'] = $paypalData['client_secret'];
    $paypal_conf['settings']['mode'] = $paypalData['sandbox_status'] == 1 ? 'sandbox' : 'live';

    $this->api_context = new ApiContext(
      new OAuthTokenCredential(
        $paypal_conf['client_id'],
        $paypal_conf['secret']
      )
    );

    $this->api_context->setConfig($paypal_conf['settings']);
  }

  public function bookingProcess(Request $request)
  {
    $roomBooking = new RoomBookingController();
    // do calculation
    $calculatedData = $roomBooking->calculation($request);

    $title = 'Room Booking';

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
    $data['payment_method'] = 'PayPal';
    $data['gateway_type'] = 'online';

    // store the room booking information in database
    $booking_details = $roomBooking->storeData($request, $data);

    // changing the currency before redirect to PayPal
    if ($currencyInfo->base_currency_text !== 'USD') {
      $rate = $currencyInfo->base_currency_rate;
      $convertedTotal = $calculatedData['paying_amount'] / $rate;
    }

    $paypalTotal = $currencyInfo->base_currency_text === 'USD' ? $calculatedData['paying_amount'] : $convertedTotal;

    $notify_url = route('room_booking.paypal.notify');
    $cancel_url = route('room_booking.cancel');

    $payer = new Payer();
    $payer->setPaymentMethod('paypal');
    $item_1 = new Item();
    $item_1->setName($title)
      /** item name **/
      ->setCurrency('USD')
      ->setQuantity(1)
      ->setPrice($paypalTotal);
    /** unit price **/
    $item_list = new ItemList();
    $item_list->setItems(array($item_1));
    $amount = new Amount();
    $amount->setCurrency('USD')
      ->setTotal($paypalTotal);
    $transaction = new Transaction();
    $transaction->setAmount($amount)
      ->setItemList($item_list)
      ->setDescription($title . ' Via PayPal');
    $redirect_urls = new RedirectUrls();
    $redirect_urls->setReturnUrl($notify_url)
      /** Specify return URL **/
      ->setCancelUrl($cancel_url);
    $payment = new Payment();
    $payment->setIntent('Sale')
      ->setPayer($payer)
      ->setRedirectUrls($redirect_urls)
      ->setTransactions(array($transaction));

    try {
      $payment->create($this->api_context);
    } catch (\PayPal\Exception\PPConnectionException $ex) {
      return redirect()->back()->with('error', $ex->getMessage());
    }

    foreach ($payment->getLinks() as $link) {
      if ($link->getRel() == 'approval_url') {
        $redirect_url = $link->getHref();
        break;
      }
    }
    // put some data in session before redirect to paypal url
    session()->put('bookingId', $booking_details->id);   // db row number
    session()->put('paymentId', $payment->getId());

    if (isset($redirect_url)) {
      /** redirect to paypal **/
      return Redirect::away($redirect_url);
    }
  }

  public function notify(Request $request)
  {
    // get the information from session
    $bookingId = session()->get('bookingId');
    $paymentId = session()->get('paymentId');

    // get the information from the url
    $urlInfo = $request->all();

    if (empty($urlInfo['token']) || empty($urlInfo['PayerID'])) {
      return redirect()->route('room_booking.cancel');
    }

    /** Execute The Payment **/
    $payment = Payment::get($paymentId, $this->api_context);
    $execution = new PaymentExecution();
    $execution->setPayerId($urlInfo['PayerID']);
    $result = $payment->execute($execution, $this->api_context);

    if ($result->getState() == 'approved') { 

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

      // remove session
      session()->forget('bookingId');
      session()->forget('paymentId');

      return redirect()->route('room_booking.complete');
    } else {
      return redirect()->route('room_booking.cancel');
    }
  }
}
