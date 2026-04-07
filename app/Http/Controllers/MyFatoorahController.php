<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\FrontEnd\Room\MyFatoorahController as RoomMyFatoorahController;
use App\Http\Controllers\FrontEnd\Package\MyFatoorahController as PackageMyFatoorahController;

class MyFatoorahController extends Controller
{
    public function callback(Request $request)
    {
        $type = Session::get('myfatoorah_payment_type');
        if ($type == 'room') {
            $data = new RoomMyFatoorahController();
            $data = $data->notify($request);
            Session::forget('myfatoorah_payment_type');
            return redirect($data);
        } elseif ($type == 'package') {
            $data = new PackageMyFatoorahController();
            $data = $data->notify($request);
            Session::forget('myfatoorah_payment_type');
            return redirect($data);
        }
    }

    public function  cancel(Request $request)
    {
        return redirect()->route('index')->with(['alert-type' => 'error', 'message' => 'Payment failed']);
    }
}
