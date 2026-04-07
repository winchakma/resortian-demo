<?php

namespace App\Http\Controllers\FrontEnd\Package;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Package\PackageBookingController;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\PackageManagement\Package;
use App\Models\PackageManagement\PackageBooking;
use App\Models\Vendor;
use App\Traits\MiscellaneousTrait;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class XenditController extends Controller
{
    use MiscellaneousTrait;

    public function bookingProcess(Request $request)
    {
        $packageBooking = new PackageBookingController();

        // do calculation
        $calculatedData = $packageBooking->calculation($request);

        $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
        $available_currency = array('IDR', 'PHP', 'USD', 'SGD', 'MYR');
        // checking whether the base currency is allowed or not
        if (!in_array($currencyInfo->base_currency_text, $available_currency)) {
            return redirect()->back()->with('error', 'Invalid currency for xendit payment.');
        }

        $information['subtotal'] = $calculatedData['subtotal'];
        $information['discount'] = $calculatedData['discount'];
        $information['total'] = $calculatedData['total'];
        $information['currency_symbol'] = $currencyInfo->base_currency_symbol;
        $information['currency_symbol_position'] = $currencyInfo->base_currency_symbol_position;
        $information['currency_text'] = $currencyInfo->base_currency_text;
        $information['currency_text_position'] = $currencyInfo->base_currency_text_position;
        $information['method'] = 'Xendit';
        $information['type'] = 'online';

        $notify_url = route('package_booking.xendit.notify');

        /***************************************************
         ************** Payment gateway info **************
         ***************************************************/
        $external_id = Str::random(10);
        $secret_key = 'Basic ' . config('xendit.key_auth');
        $data_request = Http::withHeaders([
            'Authorization' => $secret_key
        ])->post('https://api.xendit.co/v2/invoices', [
            'external_id' => $external_id,
            'amount' => $calculatedData['total'],
            'currency' => $currencyInfo->base_currency_text,
            'success_redirect_url' => $notify_url
        ]);
        $response = $data_request->object();
        $response = json_decode(json_encode($response), true);
        if (!empty($response['success_redirect_url'])) {
            // store the package booking information in database
            $booking_details = $packageBooking->storeData($request, $information);
            // put some data in session before redirect
            Session::put('bookingId', $booking_details->id);   // db row number

            Session::put('xendit_id', $response['id']);
            Session::put('secret_key', config('xendit.key_auth'));
            return redirect($response['invoice_url']);
        } else {
            return redirect()->back()->with('error', 'The Payment has been canceled');
        }
    }

    public function notify(Request $request)
    {
        // get the information from Session
        $bookingId = Session::get('bookingId');
        $xendit_id = Session::get('xendit_id');
        $secret_key = Session::get('secret_key');
        if (!is_null($xendit_id) && $secret_key == config('xendit.key_auth')) {
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
}
