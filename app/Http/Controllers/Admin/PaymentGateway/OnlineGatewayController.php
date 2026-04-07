<?php

namespace App\Http\Controllers\Admin\PaymentGateway;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway\OnlineGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class OnlineGatewayController extends Controller
{
  public function onlineGateways()
  {
    $gatewayInfo['paypal'] = OnlineGateway::where('keyword', 'paypal')->first();
    $gatewayInfo['stripe'] = OnlineGateway::where('keyword', 'stripe')->first();
    $gatewayInfo['paytm'] = OnlineGateway::where('keyword', 'paytm')->first();
    $gatewayInfo['instamojo'] = OnlineGateway::where('keyword', 'instamojo')->first();
    $gatewayInfo['paystack'] = OnlineGateway::where('keyword', 'paystack')->first();
    $gatewayInfo['flutterwave'] = OnlineGateway::where('keyword', 'flutterwave')->first();
    $gatewayInfo['mollie'] = OnlineGateway::where('keyword', 'mollie')->first();
    $gatewayInfo['razorpay'] = OnlineGateway::where('keyword', 'razorpay')->first();
    $gatewayInfo['mercadopago'] = OnlineGateway::where('keyword', 'mercadopago')->first();
    $gatewayInfo['authorizenet'] = OnlineGateway::query()->whereKeyword('authorizenet')->first();
    $gatewayInfo['midtrans'] = OnlineGateway::where('keyword', 'midtrans')->first();
    $gatewayInfo['iyzico'] = OnlineGateway::where('keyword', 'iyzico')->first();
    $gatewayInfo['paytabs'] = OnlineGateway::where('keyword', 'paytabs')->first();
    $gatewayInfo['toyyibpay'] = OnlineGateway::where('keyword', 'toyyibpay')->first();
    $gatewayInfo['phonepe'] = OnlineGateway::where('keyword', 'phonepe')->first();
    $gatewayInfo['yoco'] = OnlineGateway::where('keyword', 'yoco')->first();
    $gatewayInfo['myfatoorah'] = OnlineGateway::where('keyword', 'myfatoorah')->first();
    $gatewayInfo['xendit'] = OnlineGateway::where('keyword', 'xendit')->first();
    $gatewayInfo['perfect_money'] = OnlineGateway::where('keyword', 'perfect_money')->first();
    return view('admin.payment_gateways.online_gateways', $gatewayInfo);
  }

  public function updatePayPalInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'sandbox_status' => 'required',
      'client_id' => 'required',
      'client_secret' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['sandbox_status'] = $request->sandbox_status;
    $information['client_id'] = $request->client_id;
    $information['client_secret'] = $request->client_secret;

    $paypalInfo = OnlineGateway::where('keyword', 'paypal')->first();

    $paypalInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    session()->flash('success', 'PayPal\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateStripeInfo(Request $request)
  {
    $stripe = OnlineGateway::where('keyword', 'stripe')->first();
    $stripe->status = $request->status;

    $information = [];
    $information['key'] = $request->key;
    $information['secret'] = $request->secret;

    $stripe->information = json_encode($information);

    $stripe->save();

    session()->flash('success', "Stripe informations updated successfully!");

    return back();
  }

  public function updateInstamojoInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'sandbox_status' => 'required',
      'instamojo_key' => 'required',
      'instamojo_token' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['sandbox_status'] = $request->sandbox_status;
    $information['instamojo_key'] = $request->instamojo_key;
    $information['instamojo_token'] = $request->instamojo_token;

    $instamojoInfo = OnlineGateway::where('keyword', 'instamojo')->first();

    $instamojoInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    session()->flash('success', 'Instamojo\'s information updated successfully!');

    return redirect()->back();
  }

  public function updatePaystackInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'paystack_key' => 'required',
      'paystack_email' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['paystack_key'] = $request->paystack_key;
    $information['paystack_email'] = $request->paystack_email;

    $paystackInfo = OnlineGateway::where('keyword', 'paystack')->first();

    $paystackInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    session()->flash('success', 'Paystack\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateFlutterwaveInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'flutterwave_public_key' => 'required',
      'flutterwave_secret_key' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['flutterwave_public_key'] = $request->flutterwave_public_key;
    $information['flutterwave_secret_key'] = $request->flutterwave_secret_key;

    $flutterwaveInfo = OnlineGateway::where('keyword', 'flutterwave')->first();

    $flutterwaveInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    session()->flash('success', 'Flutterwave\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateRazorpayInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'razorpay_key' => 'required',
      'razorpay_secret' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['razorpay_key'] = $request->razorpay_key;
    $information['razorpay_secret'] = $request->razorpay_secret;

    $razorpayInfo = OnlineGateway::where('keyword', 'razorpay')->first();

    $razorpayInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    session()->flash('success', 'Razorpay\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateMercadoPagoInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'sandbox_status' => 'required',
      'mercadopago_token' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['sandbox_status'] = $request->sandbox_status;
    $information['mercadopago_token'] = $request->mercadopago_token;

    $mercadopagoInfo = OnlineGateway::where('keyword', 'mercadopago')->first();

    $mercadopagoInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    session()->flash('success', 'MercadoPago\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateMollieInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'mollie_key' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['mollie_key'] = $request->mollie_key;

    $mollieInfo = OnlineGateway::where('keyword', 'mollie')->first();

    $mollieInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    $array = ['MOLLIE_KEY' => $request->mollie_key];

    setEnvironmentValue($array);
    Artisan::call('config:clear');

    session()->flash('success', 'Mollie\'s information updated successfully!');

    return redirect()->back();
  }

  public function updatePaytmInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'environment' => 'required',
      'merchant_key' => 'required',
      'merchant_mid' => 'required',
      'merchant_website' => 'required',
      'industry' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['environment'] = $request->environment;
    $information['merchant_key'] = $request->merchant_key;
    $information['merchant_mid'] = $request->merchant_mid;
    $information['merchant_website'] = $request->merchant_website;
    $information['industry'] = $request->industry;

    $paytmInfo = OnlineGateway::where('keyword', 'paytm')->first();

    $paytmInfo->update($request->except('information') + [
      'information' => json_encode($information)
    ]);

    $array = [
      'PAYTM_ENVIRONMENT' => $request->environment,
      'PAYTM_MERCHANT_ID' => $request->merchant_mid,
      'PAYTM_MERCHANT_KEY' => $request->merchant_key,
      'PAYTM_MERCHANT_WEBSITE' => $request->merchant_website,
      'PAYTM_INDUSTRY_TYPE' => $request->industry
    ];

    setEnvironmentValue($array);
    Artisan::call('config:clear');

    session()->flash('success', 'Paytm\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateYocoInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'secret_key' => 'required',
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['secret_key'] = $request->secret_key;

    $data = OnlineGateway::where('keyword', 'yoco')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    Session::flash('success', "Updated Yoco's Information Successfully");

    return redirect()->back();
  }

  public function updateXenditInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'secret_key' => 'required',
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['secret_key'] = $request->secret_key;

    $data = OnlineGateway::where('keyword', 'xendit')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    $array = [
      'XENDIT_SECRET_KEY' => $request->secret_key,
    ];

    setEnvironmentValue($array);
    Artisan::call('config:clear');

    Session::flash('success', "Updated Xendit' Information Successfully");

    return redirect()->back();
  }

  public function updatePerfectMoneyInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'perfect_money_wallet_id' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information = [
      'perfect_money_wallet_id' => $request->perfect_money_wallet_id
    ];

    $data = OnlineGateway::where('keyword', 'perfect_money')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    Session::flash('success', "Updated Perfect Money's Information Successfully");

    return redirect()->back();
  }

  public function updateMyFatoorahInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'sandbox_status' => 'required',
      'token' => 'required',
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information = [
      'token' => $request->token,
      'sandbox_status' => $request->sandbox_status
    ];

    $data = OnlineGateway::where('keyword', 'myfatoorah')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    $array = [
      'MYFATOORAH_TOKEN' => $request->token,
      'MYFATOORAH_CALLBACK_URL' => route('myfatoorah_callback'),
      'MYFATOORAH_ERROR_URL' => route('myfatoorah_cancel'),
    ];

    setEnvironmentValue($array);
    Artisan::call('config:clear');

    Session::flash('success', "Updated Myfatoorah's Information Successfully");

    return redirect()->back();
  }

  public function updateToyyibpayInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'sandbox_status' => 'required',
      'secret_key' => 'required',
      'category_code' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['sandbox_status'] = $request->sandbox_status;
    $information['secret_key'] = $request->secret_key;
    $information['category_code'] = $request->category_code;

    $data = OnlineGateway::where('keyword', 'toyyibpay')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    Session::flash('success', "Updated Toyyibpay's Information Successfully");

    return redirect()->back();
  }

  public function updateMidtransInfo(Request $request)
  {
    $midtrans = OnlineGateway::where('keyword', 'midtrans')->first();

    $information = [];
    $information['server_key'] = $request->server_key;
    $information['is_production'] = $request->is_production;

    $midtrans->information = json_encode($information);
    $midtrans->status = $request->status;
    $midtrans->save();

    Session::flash('success', "Midtrans informations updated successfully!");

    return back();
  }

  // authorize.net
  public function updateAuthorizeNetInfo(Request $request)
  {
    $rules = [
      'authorizenet_status' => 'required',
      'authorizenet_sandbox_status' => 'required',
      'login_id' => 'required',
      'transaction_key' => 'required',
      'public_key' => 'required'
    ];

    $messages = [
      'authorizenet_status.required' => 'The status field is required.',
      'authorizenet_sandbox_status.required' => 'The test mode field is required.',
      'login_id.required' => 'The api login id field is required.',
      'transaction_key.required' => 'The transaction key field is required.',
      'public_key.required' => 'The public client key field is required.'
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['sandbox_status'] = $request->authorizenet_sandbox_status;
    $information['login_id'] = $request->login_id;
    $information['transaction_key'] = $request->transaction_key;
    $information['public_key'] = $request->public_key;

    $authorizenetInfo = OnlineGateway::query()->whereKeyword('authorizenet')->first();

    $authorizenetInfo->update([
      'information' => json_encode($information),
      'status' => $request->authorizenet_status
    ]);

    Session::flash('success', 'Authorize.Net\'s information updated successfully!');

    return redirect()->back();
  }

  public function updateIyzicoInfo(Request $request)
  {

    $iyzico = OnlineGateway::where('keyword', 'iyzico')->first();

    $information = [];
    $information['api_key'] = $request->api_key;
    $information['secrect_key'] = $request->secrect_key;
    $information['sandbox_status'] = $request->sandbox_status;

    $iyzico->information = json_encode($information);
    $iyzico->status = $request->status;
    $iyzico->save();

    Session::flash('success', "Iyzico's informations updated successfully!");

    return back();
  }

  public function updatePaytabsInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'country' => 'required',
      'server_key' => 'required',
      'profile_id' => 'required',
      'api_endpoint' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['server_key'] = $request->server_key;
    $information['profile_id'] = $request->profile_id;
    $information['country'] = $request->country;
    $information['api_endpoint'] = $request->api_endpoint;

    $data = OnlineGateway::where('keyword', 'paytabs')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    Session::flash('success', "Updated Paytabs's Information Successfully");

    return redirect()->back();
  }

  public function updatePhonepeInfo(Request $request)
  {
    $rules = [
      'status' => 'required',
      'sandbox_status' => 'required',
      'merchant_id' => 'required',
      'salt_key' => 'required',
      'salt_index' => 'required'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator->errors());
    }

    $information['merchant_id'] = $request->merchant_id;
    $information['sandbox_status'] = $request->sandbox_status;
    $information['salt_key'] = $request->salt_key;
    $information['salt_index'] = $request->salt_index;

    $data = OnlineGateway::where('keyword', 'phonepe')->first();

    $data->update([
      'information' => json_encode($information),
      'status' => $request->status
    ]);

    Session::flash('success', "Updated Phonepe's Information Successfully");

    return redirect()->back();
  }
}
