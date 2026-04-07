<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Room\MidtransController;
use App\Http\Controllers\FrontEnd\Package\MidtransController as PackageMidtransController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class MidtransBankNotifyController extends Controller
{
    public function bank_notify(Request $request)
    {
        $midtrans_payment_type = Session::get('midtrans_payment_type');
        if ($midtrans_payment_type == 'room') {
            try {
                $data = new MidtransController();
                $result = $data->bankNotify($request);
                return redirect($result);
            } catch (\Exception $th) {
            }
        } elseif ($midtrans_payment_type == 'package') {
            try {
                $data = new PackageMidtransController();
                $result = $data->bankNotify($request);
                return redirect($result);
            } catch (\Exception $th) {
            }
        }
    }

    public function cancel()
    {
        Session::flash('error', 'The payment has been canceled');
        return redirect()->route('rooms');
    }
}
