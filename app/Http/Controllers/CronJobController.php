<?php

namespace App\Http\Controllers;

use App\Http\Controllers\FrontEnd\Room\IyzicoController;
use App\Http\Controllers\FrontEnd\Package\IyzicoController as PackageIyzicoController;
use App\Models\PackageManagement\PackageBooking;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\RoomManagement\RoomBooking;

class CronJobController extends Controller
{
    public function check_payment()
    {
        // check room bookings
        $room_bookings = RoomBooking::where([['payment_method', 'Iyzico'], ['payment_status', 0]])->select('id', 'conversation_id')->get();
        foreach ($room_bookings as $room_booking) {
            if (!is_null($room_booking->conversation_id)) {
                $result = $this->IyzicoPaymentStatus($room_booking->conversation_id);
                if ($result == 'success') {
                    $data = new IyzicoController();
                    $data->updatePayment($room_booking->id);
                }
            }
        }
        // check room bookings
        $package_bookings = PackageBooking::where([['payment_method', 'Iyzico'], ['payment_status', 0]])->select('id', 'conversation_id')->get();
        foreach ($package_bookings as $package_booking) {
            if (!is_null($package_booking->conversation_id)) {
                $result = $this->IyzicoPaymentStatus($package_booking->conversation_id);
                if ($result == 'success') {
                    $data = new PackageIyzicoController();
                    $data->updatePayment($package_booking->id);
                }
            }
        }
    }

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ----------- Get iyzico payment status from iyzico server ---------
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    private function IyzicoPaymentStatus($conversation_id)
    {
        $paymentMethod = OnlineGateway::where('keyword', 'iyzico')->first();
        $paydata = json_decode($paymentMethod->information, true);

        $options = new \Iyzipay\Options();
        $options->setApiKey($paydata['api_key']);
        $options->setSecretKey($paydata['secrect_key']);
        if ($paydata['sandbox_status'] == 1) {
            $options->setBaseUrl("https://sandbox-api.iyzipay.com");
        } else {
            $options->setBaseUrl("https://api.iyzipay.com"); // production mode
        }

        $request = new \Iyzipay\Request\ReportingPaymentDetailRequest();
        $request->setPaymentConversationId($conversation_id);

        $paymentResponse = \Iyzipay\Model\ReportingPaymentDetail::create($request, $options);
        $result = (array) $paymentResponse;
        foreach ($result as $key => $data) {
            $data = json_decode($data, true);
            if ($data['status'] == 'success' && !empty($data['payments'])) {
                if (is_array($data['payments'])) {
                    if ($data['payments'][0]['paymentStatus'] == 1) {
                        return 'success';
                    } else {
                        return 'not found';
                    }
                } else {
                    return 'not found';
                }
            } else {
                return 'not found';
            }
        }
        return 'not found';
    }
}
