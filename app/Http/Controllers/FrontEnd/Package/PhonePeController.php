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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Ixudra\Curl\Facades\Curl;

class PhonePeController extends Controller
{
    use MiscellaneousTrait;

    public $gateway_information;

    public function __construct()
    {
        $data = OnlineGateway::whereKeyword('phonepe')->first();
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
        if ($currencyInfo->base_currency_text !== 'INR') {
            return redirect()->back()->with('error', 'Invalid currency for PhonePe payment.');
        }

        $information['subtotal'] = $calculatedData['subtotal'];
        $information['discount'] = $calculatedData['discount'];
        $information['total'] = $calculatedData['total'];
        $information['currency_symbol'] = $currencyInfo->base_currency_symbol;
        $information['currency_symbol_position'] = $currencyInfo->base_currency_symbol_position;
        $information['currency_text'] = $currencyInfo->base_currency_text;
        $information['currency_text_position'] = $currencyInfo->base_currency_text_position;
        $information['method'] = 'PhonePe';
        $information['type'] = 'online';

        $notify_url = route('package_booking.phonepe.notify');

        /***************************************************
         ************** Payment gateway info **************
         ***************************************************/

        $randomNo = substr(uniqid(), 0, 3);
        $pay_info = array(
            'merchantId' => $this->gateway_information['merchant_id'],
            'merchantTransactionId' => uniqid(),
            'merchantUserId' => 'MUID' . $randomNo,
            'amount' => $calculatedData['total']  * 100,
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
                // store the package booking information in database
                $booking_details = $packageBooking->storeData($request, $information);
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
