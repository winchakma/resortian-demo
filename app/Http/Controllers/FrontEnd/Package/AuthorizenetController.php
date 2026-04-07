<?php

namespace App\Http\Controllers\FrontEnd\Package;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\PackageManagement\Package;
use App\Models\PackageManagement\PackageBooking;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Omnipay\Omnipay;
use App\Traits\MiscellaneousTrait;
use Exception;

class AuthorizenetController extends Controller
{
    public $gateway;
    public function __construct()
    {
        $data = OnlineGateway::whereKeyword('authorizenet')->first();
        $paydata = json_decode($data->information, true);

        $this->gateway = Omnipay::create('AuthorizeNetApi_Api');
        $this->gateway->setAuthName($paydata['login_id']);
        $this->gateway->setTransactionKey($paydata['transaction_key']);
        if ($paydata['sandbox_status'] == 1) {
            $this->gateway->setTestMode(true);
        }
    }

    public function bookingProcess(Request $request)
    {
        $packageBooking = new PackageBookingController();
        $available_currency = array('USD', 'CAD', 'CHF', 'DKK', 'EUR', 'GBP', 'NOK', 'PLN', 'SEK', 'AUD', 'NZD');
        $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
        // checking whether the base currency is allowed or not
        if (!in_array($currencyInfo->base_currency_text, $available_currency)) {
            return redirect()->back()->with('error', 'Invalid currency for authorize.net payment.');
        }

        // do calculation
        $calculatedData = $packageBooking->calculation($request);

        $currencyInfo = MiscellaneousTrait::getCurrencyInfo();

        $information['subtotal'] = $calculatedData['subtotal'];
        $information['discount'] = $calculatedData['discount'];
        $information['total'] = $calculatedData['total'];
        $information['currency_symbol'] = $currencyInfo->base_currency_symbol;
        $information['currency_symbol_position'] = $currencyInfo->base_currency_symbol_position;
        $information['currency_text'] = $currencyInfo->base_currency_text;
        $information['currency_text_position'] = $currencyInfo->base_currency_text_position;
        $information['method'] = 'Authorize.net';
        $information['type'] = 'online';

        // store the package booking information in database
        $booking_details = $packageBooking->storeData($request, $information);

        /************************************************************
         *************** Payment Gateway info ***********************
         ************************************************************/
        try {
            $transactionId = rand(100000000, 999999999);
            $response = $this->gateway->authorize([
                'amount' => $calculatedData['total'],
                'currency' => $currencyInfo->base_currency_text,
                'transactionId' => $transactionId,
                'opaqueDataDescriptor' => $request->opaqueDataDescriptor,
                'opaqueDataValue' => $request->opaqueDataValue,
            ])->send();
            if ($response->isSuccessful()) {
                $transactionReference = $response->getTransactionReference();
                $response = $this->gateway->capture([
                    'amount' => $calculatedData['total'],
                    'currency' => $currencyInfo->base_currency_text,
                    'transactionReference' => $transactionReference,
                ])->send();
                // update the payment status for package booking in database
                $bookingInfo = PackageBooking::where('id', $booking_details->id)->first();

                $bookingInfo->update(['payment_status' => 1]);

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

                return redirect()->route('package_booking.complete');
            } else {
                return redirect()->route('package_booking.cancel');
            }
        } catch (Exception $e) {
            session()->flash('error', $e->getMessage());

            return redirect()->route('package_booking.cancel');
        }
    }
}
