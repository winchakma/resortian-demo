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
use Cartalyst\Stripe\Exception\CardErrorException;
use Cartalyst\Stripe\Exception\UnauthorizedException;
use Cartalyst\Stripe\Stripe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class StripeController extends Controller
{
  public function __construct()
  {
    $data = OnlineGateway::whereKeyword('stripe')->first();
    $stripeConf = json_decode($data->information, true);

    Config::set('services.stripe.key', $stripeConf["key"]);
    Config::set('services.stripe.secret', $stripeConf["secret"]);
  }

  public function bookingProcess(Request $request)
  {
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
    $data['method'] = 'Stripe';
    $data['type'] = 'online';

    // store the room booking information in database
    $booking_details = $roomBooking->storeData($request, $data);

    // changing the currency before redirect to PayPal
    if ($currencyInfo->base_currency_text !== 'USD') {
      $rate = $currencyInfo->base_currency_rate;
      $convertedTotal = round(($calculatedData['paying_amount'] / $rate), 2);
    }

    $stripeTotal = $currencyInfo->base_currency_text === 'USD' ? $calculatedData['paying_amount'] : $convertedTotal;

    try {
      // initialize stripe
      $stripe = Stripe::make(Config::get('services.stripe.secret'));

      try {
        // generate token
        $token = $request->stripeToken;
        // generate charge
        $charge = $stripe->charges()->create([
          'source' => $token,
          'currency' => 'USD',
          'amount'   => $stripeTotal
        ]);

        if ($charge['status'] == 'succeeded') {
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

          return redirect()->route('room_booking.complete');
        } else {
          return redirect()->route('room_booking.cancel');
        }
      } catch (CardErrorException $e) {
        session()->flash('error', $e->getMessage());

        return redirect()->route('room_booking.cancel');
      }
    } catch (UnauthorizedException $e) {
      session()->flash('error', $e->getMessage());

      return redirect()->route('room_booking.cancel');
    }
  }
}
