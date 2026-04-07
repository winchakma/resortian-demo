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
use Config\Iyzipay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class IyzicoController extends Controller
{
  use MiscellaneousTrait;

  private $gateway_information;

  public function __construct()
  {
    $data = OnlineGateway::whereKeyword('iyzico')->first();
    $information = json_decode($data->information, true);

    $this->gateway_information = $information;
  }

  public function bookingProcess(Request $request)
  {
    $fname = $request->customer_name;
    $lname = $request->customer_name;
    $email = $request->customer_email;
    $phone_number = $request->customer_phone;

    $city = $request->city;
    $country = $request->country;
    $address = $request->address;
    $zip_code = $request->zip_code;

    $identity_number = $request->identity_number;

    $conversion_id = uniqid(9999, 999999);
    $basket_id = 'B' . uniqid(999, 99999);

    $roomBooking = new RoomBookingController();
    // do calculation
    $calculatedData = $roomBooking->calculation($request);
    $available_currency = array('TRY');
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    // checking whether the base currency is allowed or not
    if (!in_array($currencyInfo->base_currency_text, $available_currency)) {
      Session::flash('error', 'Invalid currency for iyzico payment.');
      return redirect()->back()->withInput();
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
    $data['method'] = 'Iyzico';
    $data['type'] = 'online';
    $data['conversation_id'] = $conversion_id;

    $notify_url = route('room_booking.iyzico.notify');
    /***************************************************
     ************** Payment gateway info **************
     ***************************************************/

    $options = Iyzipay::options();
    # create request class
    $i_request = new \Iyzipay\Request\CreatePayWithIyzicoInitializeRequest();
    $i_request->setLocale(\Iyzipay\Model\Locale::EN);
    $i_request->setConversationId($conversion_id);
    $i_request->setPrice($calculatedData['paying_amount']);
    $i_request->setPaidPrice($calculatedData['paying_amount']);
    $i_request->setCurrency(\Iyzipay\Model\Currency::TL);
    $i_request->setBasketId($basket_id);
    $i_request->setPaymentGroup(\Iyzipay\Model\PaymentGroup::PRODUCT);
    $i_request->setCallbackUrl($notify_url);
    $i_request->setEnabledInstallments(array(2, 3, 6, 9));

    $buyer = new \Iyzipay\Model\Buyer();
    $buyer->setId(uniqid());
    $buyer->setName($fname);
    $buyer->setSurname($lname);
    $buyer->setGsmNumber($phone_number);
    $buyer->setEmail($email);
    $buyer->setIdentityNumber($identity_number);
    $buyer->setLastLoginDate("");
    $buyer->setRegistrationDate("");
    $buyer->setRegistrationAddress($address);
    $buyer->setIp("");
    $buyer->setCity($city);
    $buyer->setCountry($country);
    $buyer->setZipCode($zip_code);
    $i_request->setBuyer($buyer);

    $shippingAddress = new \Iyzipay\Model\Address();
    $shippingAddress->setContactName($fname);
    $shippingAddress->setCity($city);
    $shippingAddress->setCountry($country);
    $shippingAddress->setAddress($address);
    $shippingAddress->setZipCode($zip_code);
    $i_request->setShippingAddress($shippingAddress);

    $billingAddress = new \Iyzipay\Model\Address();
    $billingAddress->setContactName($fname);
    $billingAddress->setCity($city);
    $billingAddress->setCountry($country);
    $billingAddress->setAddress($address);
    $billingAddress->setZipCode($zip_code);
    $i_request->setBillingAddress($billingAddress);

    $q_id = uniqid(999, 99999);
    $basketItems = array();
    $firstBasketItem = new \Iyzipay\Model\BasketItem();
    $firstBasketItem->setId($q_id);
    $firstBasketItem->setName("Booking Id " . $q_id);
    $firstBasketItem->setCategory1("Room Booking");
    $firstBasketItem->setCategory2("");
    $firstBasketItem->setItemType(\Iyzipay\Model\BasketItemType::PHYSICAL);
    $firstBasketItem->setPrice($calculatedData['paying_amount']);
    $basketItems[0] = $firstBasketItem;
    $i_request->setBasketItems($basketItems);

    # make request
    $payWithIyzicoInitialize = \Iyzipay\Model\PayWithIyzicoInitialize::create($i_request, $options);

    $paymentResponse = (array)$payWithIyzicoInitialize;
    foreach ($paymentResponse as $key => $data) {
      $paymentInfo = json_decode($data, true);
      if ($paymentInfo['status'] == 'success') {
        if (!empty($paymentInfo['payWithIyzicoPageUrl'])) {
          // store the room booking information in database
          $booking_details = $roomBooking->storeData($request, $data);

          // put some data in session before redirect
          Session::put('bookingId', $booking_details->id);   // db row number

          return redirect($paymentInfo['payWithIyzicoPageUrl']);
        } else {
          return redirect()->back()->with('error', 'The Payment has been canceled');
        }
      } else {
        return redirect()->back()->with('error', 'The Payment has been canceled');
      }
    }
  }

  public function notify(Request $request)
  {
    // remove all session data
    Session::forget('bookingId');
    return redirect()->route('room_booking.complete');
  }

  public function updatePayment($bookingId)
  {
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
  }
}
