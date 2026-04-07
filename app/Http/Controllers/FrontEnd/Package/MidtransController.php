<?php

namespace App\Http\Controllers\FrontEnd\Package;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Package\PackageBookingController;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\PackageManagement\Package;
use App\Models\PackageManagement\PackageBooking;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\Vendor;
use App\Traits\MiscellaneousTrait;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Midtrans\Snap;
use Midtrans\Config as MidtransConfig;

class MidtransController extends Controller
{
    use MiscellaneousTrait;

    public $gateway_information;

    public function __construct()
    {
        $data = OnlineGateway::whereKeyword('midtrans')->first();
        $information = json_decode($data->information, true);

        $this->gateway_information = $information;
    }

    public function bookingProcess(Request $request)
    {
        $packageBooking = new PackageBookingController();

        // do calculation
        $calculatedData = $packageBooking->calculation($request);

        $currencyInfo = MiscellaneousTrait::getCurrencyInfo();

        // checking whether the currency is set to 'INR' or not
        if ($currencyInfo->base_currency_text !== 'IDR') {
            return redirect()->back()->with('error', 'Invalid currency for midtrans payment.');
        }

        $information['subtotal'] = $calculatedData['subtotal'];
        $information['discount'] = $calculatedData['discount'];
        $information['total'] = $calculatedData['total'];
        $information['currency_symbol'] = $currencyInfo->base_currency_symbol;
        $information['currency_symbol_position'] = $currencyInfo->base_currency_symbol_position;
        $information['currency_text'] = $currencyInfo->base_currency_text;
        $information['currency_text_position'] = $currencyInfo->base_currency_text_position;
        $information['method'] = 'Midtrans';
        $information['type'] = 'online';

        $notify_url = route('package_booking.midtrans.notify');
        $cancel_url = route('package_booking.cancel');

        /***************************************************
         ************** Payment gateway info **************
         ***************************************************/

        $first_name = $request->customer_name;
        $phone = $request->customer_phone;
        $email = $request->customer_email;

        // will come from database
        MidtransConfig::$serverKey = $this->gateway_information['server_key'];
        MidtransConfig::$isProduction = $this->gateway_information['is_production'] == 0 ? true : false;
        MidtransConfig::$isSanitized = true;
        MidtransConfig::$is3ds = true;
        $token = uniqid();
        Session::put('token', $token);
        $params = [
            'transaction_details' => [
                'order_id' => $token,
                'gross_amount' => $calculatedData['total'] * 1000, // will be multiplied by 1000
            ],
            'customer_details' => [
                'first_name' => $first_name,
                'email' => $email,
                'phone' => $phone,
            ],
        ];

        $snapToken = Snap::getSnapToken($params);

        // put some data in session before redirect to midtrans url
        if ($this->gateway_information['is_production'] == 1) {
            $is_production = $this->gateway_information['is_production'];
        }
        $data['title'] = 'Package Booking via Midtrans';
        $data['snapToken'] = $snapToken;
        $data['is_production'] = $is_production;
        $data['success_url'] = $notify_url;
        $data['_cancel_url'] = $cancel_url;
        $data['client_key'] = $this->gateway_information['server_key'];
        Session::put('midtrans_payment_type', 'package');

        // store the package booking information in database
        $booking_details = $packageBooking->storeData($request, $information);

        // put some data in session before redirect
        Session::put('bookingId', $booking_details->id);   // db row number
        return view('frontend.payment.midtrans', $data);
    }

    public function cardNotify(Request $request)
    {
        // get the information from Session
        $bookingId = Session::get('bookingId');
        $token = Session::get('token');
        if ($request->status_code == 200 && $token == $request->order_id) {
            // update the payment status for package booking in database
            $bookingInfo = PackageBooking::where('id', $bookingId)->first();

            $bookingInfo->update(['payment_status' => 1]);

            $packageBooking = new PackageBookingController();

            // generate an invoice in pdf format
            $invoice = $packageBooking->generateInvoice($bookingInfo);

            $package = Package::where('id', $bookingInfo->package_id)->first();
            if (!empty($package)) {
                if ($package->vendor_id != NULL) {
                    $vendor_id = $package->vendor_id;
                } else {
                    $vendor_id = NULL;
                }
            } else {
                $vendor_id = NULL;
            }

            //calculate commission
            $percent = Commission::select('package_booking_commission')->first();

            $commission = (($bookingInfo->grand_total) * $percent->package_booking_commission) / 100;

            //get vendor
            $vendor = Vendor::where('id', $vendor_id)->first();

            //add blance to admin revinue
            $earning = Earning::first();

            $earning->total_revenue = $earning->total_revenue + $bookingInfo->grand_total;
            if ($vendor) {
                $earning->total_earning = $earning->total_earning + $commission;
            } else {
                $earning->total_earning = $earning->total_earning + $bookingInfo->grand_total;
            }
            $earning->save();

            //store Balance  to vendor
            if ($vendor) {
                $pre_balance = $vendor->amount;
                $vendor->amount = $vendor->amount + ($bookingInfo->grand_total - ($commission + $bookingInfo->tax));
                $vendor->save();
                $after_balance = $vendor->amount;

                $received_amount = ($bookingInfo->grand_total - ($commission));

                // then, update the invoice field info in database
                $bookingInfo->update([
                    'invoice' => $invoice,
                    'comission' => $commission,
                    'received_amount' => $received_amount,
                ]);
            } else {
                // then, update the invoice field info in database
                $bookingInfo->update([
                    'invoice' => $invoice
                ]);
                $received_amount = $bookingInfo->grand_total;
                $after_balance = NULL;
                $pre_balance = NULL;
            }
            //calculate commission end

            $data = [
                'transcation_id' => time(),
                'booking_id' => $bookingInfo->id,
                'transcation_type' => 5,
                'user_id' => null,
                'vendor_id' => $vendor_id,
                'payment_status' => 1,
                'payment_method' => $bookingInfo->payment_method,
                'grand_total' => $bookingInfo->grand_total,
                'commission' => $bookingInfo->comission,
                'pre_balance' => $pre_balance,
                'after_balance' => $after_balance,
                'gateway_type' => $bookingInfo->gateway_type,
                'currency_symbol' => $bookingInfo->currency_symbol,
                'currency_symbol_position' => $bookingInfo->currency_symbol_position,
            ];
            store_transaction($data);

            // send a mail to the customer with an invoice
            $packageBooking->sendMail($bookingInfo);

            // remove all session data
            session()->forget('bookingId');
            session()->forget('paymentId');

            return redirect()->route('package_booking.complete');
        } else {
            return redirect()->route('package_booking.cancel');
        }
    }

    public function bankNotify(Request $request)
    {
        // get the information from Session
        $bookingId = Session::get('bookingId');
        $token = Session::get('token');
        if ($request->status_code == 200 && $token == $request->order_id) {
            // update the payment status for package booking in database
            $bookingInfo = PackageBooking::where('id', $bookingId)->first();

            $bookingInfo->update(['payment_status' => 1]);

            $packageBooking = new PackageBookingController();

            // generate an invoice in pdf format
            $invoice = $packageBooking->generateInvoice($bookingInfo);

            $package = Package::where('id', $bookingInfo->package_id)->first();
            if (!empty($package)) {
                if ($package->vendor_id != NULL) {
                    $vendor_id = $package->vendor_id;
                } else {
                    $vendor_id = NULL;
                }
            } else {
                $vendor_id = NULL;
            }

            //calculate commission
            $percent = Commission::select('package_booking_commission')->first();

            $commission = (($bookingInfo->grand_total) * $percent->package_booking_commission) / 100;

            //get vendor
            $vendor = Vendor::where('id', $vendor_id)->first();

            //add blance to admin revinue
            $earning = Earning::first();

            $earning->total_revenue = $earning->total_revenue + $bookingInfo->grand_total;
            if ($vendor) {
                $earning->total_earning = $earning->total_earning + $commission;
            } else {
                $earning->total_earning = $earning->total_earning + $bookingInfo->grand_total;
            }
            $earning->save();

            //store Balance  to vendor
            if ($vendor) {
                $pre_balance = $vendor->amount;
                $vendor->amount = $vendor->amount + ($bookingInfo->grand_total - ($commission + $bookingInfo->tax));
                $vendor->save();
                $after_balance = $vendor->amount;

                $received_amount = ($bookingInfo->grand_total - ($commission));

                // then, update the invoice field info in database
                $bookingInfo->update([
                    'invoice' => $invoice,
                    'comission' => $commission,
                    'received_amount' => $received_amount,
                ]);
            } else {
                // then, update the invoice field info in database
                $bookingInfo->update([
                    'invoice' => $invoice
                ]);
                $received_amount = $bookingInfo->grand_total;
                $after_balance = NULL;
                $pre_balance = NULL;
            }
            //calculate commission end

            $data = [
                'transcation_id' => time(),
                'booking_id' => $bookingInfo->id,
                'transcation_type' => 5,
                'user_id' => null,
                'vendor_id' => $vendor_id,
                'payment_status' => 1,
                'payment_method' => $bookingInfo->payment_method,
                'grand_total' => $bookingInfo->grand_total,
                'commission' => $bookingInfo->comission,
                'pre_balance' => $pre_balance,
                'after_balance' => $after_balance,
                'gateway_type' => $bookingInfo->gateway_type,
                'currency_symbol' => $bookingInfo->currency_symbol,
                'currency_symbol_position' => $bookingInfo->currency_symbol_position,
            ];
            store_transaction($data);

            // send a mail to the customer with an invoice
            $packageBooking->sendMail($bookingInfo);

            // remove all session data
            session()->forget('bookingId');
            session()->forget('paymentId');

            return route('package_booking.complete');
        } else {
            return route('package_booking.cancel');
        }
    }
}
