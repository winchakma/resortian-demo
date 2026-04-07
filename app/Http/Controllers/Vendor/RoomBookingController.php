<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminRoomBookingRequest;
use App\Models\BasicSettings\MailTemplate;
use App\Models\Language;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\RoomManagement\Room;
use App\Models\RoomManagement\RoomAmenity;
use App\Models\RoomManagement\RoomContent;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use PHPMailer\PHPMailer\PHPMailer;
use App\Models\BasicSettings\Basic;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\PaymentGateway\OfflineGateway;
use App\Models\RoomManagement\PaidService;
use App\Models\RoomManagement\Refund;
use App\Models\RoomManagement\RoomBooking;
use App\Models\RoomManagement\RoomNumber;
use App\Models\Vendor;
use App\Traits\MiscellaneousTrait;

class RoomBookingController extends Controller
{
  use MiscellaneousTrait;

  public function index(Request $request)
  {
    $booking_number = $booking_status = $status = $keyword = null;
    $vendorId = Auth::guard('vendor')->id();

    if ($request->filled('booking_no')) {
      $booking_number = $request['booking_no'];
    }
    if ($request->filled('status')) {
      $status = $request['status'];
    }
    if ($request->filled('keyword')) {
      $keyword = $request['keyword'];
    }

    if ($request->routeIs('vendor.room_bookings.approved_bookings')) {
      $booking_status = "approved";
    } else if ($request->routeIs('vendor.room_bookings.pending_bookings')) {

      $booking_status = "pending";
    } else if ($request->routeIs('vendor.room_bookings.canceled_bookings')) {

      $booking_status = "canceled";
    }

    $now = Carbon::now(config('app.timezone'));
    $vendorTimeSettings = Vendor::where('id', $vendorId)->select('checkin_time', 'checkout_time')->first();
    $checkinTime = $vendorTimeSettings->checkin_time ?? '14:00:00';
    $checkOutTime = $vendorTimeSettings->checkout_time ?? '12:00:00';

    $information['bookings'] = RoomBooking::when($booking_number, function ($query, $booking_number) {
      return $query->where('booking_number', 'like', '%' . $booking_number . '%');
    })
      ->when($booking_status, function ($query, $booking_status) {
        if ($booking_status === 'approved') {
          return $query->where('booking_status', 1);
        } elseif ($booking_status === 'canceled') {
          return $query->where('booking_status', 2);
        } elseif ($booking_status === 'pending') {
          return $query->where('booking_status', 0);
        }
        return $query;
      })
      ->when($keyword, function ($query, $keyword) {
        $query->where(function ($q) use ($keyword) {
          $q->where('customer_name', 'like', '%' . $keyword . '%')
            ->orWhere('customer_email', 'like', '%' . $keyword . '%')
            ->orWhere('customer_phone', 'like', '%' . $keyword . '%');
        });
        return $query;
      })
      ->when($status, function ($query, $status) {
        if ($status === 'approved') {
          return $query->where('booking_status', 1);
        } elseif ($status === 'canceled') {
          return $query->where('booking_status', 2);
        } elseif ($status === 'pending') {
          return $query->where('booking_status', 0);
        }
        return $query;
      })
      ->when($request->routeIs('vendor.room_bookings.active_bookings'), function ($query) use ($now, $checkinTime, $checkOutTime) {
        return $query->where('booking_status', '!=', 2)
          ->where('payment_status', '!=', 2)
          ->whereRaw(
            "STR_TO_DATE(CONCAT(arrival_date, ' ', ?), '%Y-%m-%d %H:%i:%s') <= ?",
            [$checkinTime, $now->toDateTimeString()]
          )
          ->whereRaw(
            "STR_TO_DATE(CONCAT(departure_date, ' ', ?), '%Y-%m-%d %H:%i:%s') >= ?",
            [$checkOutTime, $now->toDateTimeString()]
          );
      })
      ->where('vendor_id', $vendorId)
      ->orderBy('id', 'desc')
      ->paginate(10);


    $language = Language::query()->where('is_default', '=', 1)->first();

    $information['roomInfos'] = Room::join('room_category_contents', 'room_categories.id', '=', 'room_category_contents.room_id')
      ->where('vendor_id', $vendorId)
      ->where('room_category_contents.language_id', $language->id)
      ->select('room_id', 'title')
      ->orderBy('title', 'ASC')
      ->get();
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    return view('vendors.rooms.booking.index', $information);
  }
  public function todaysBooked(Request $request)
  {
    $language = Language::where('is_default', 1)->firstOrFail();
    $vendorId = Auth::guard('vendor')->id();

    $now = Carbon::now(config('app.timezone'));
    $today = $now->copy()->startOfDay(); // Start of today

    $vendorTimeSettings = Vendor::where('id', $vendorId)->select('checkin_time', 'checkout_time')->first();
    $checkinTime = $vendorTimeSettings->checkin_time ?? '14:00:00';
    $checkOutTime = $vendorTimeSettings->checkout_time ?? '12:00:00';

    // Create today's checkout datetime using checkout time
    $todayCheckout = Carbon::parse($today->format('Y-m-d') . ' ' . $checkOutTime, config('app.timezone'));

    // If current time is before checkout time, treat it as previous day
    if ($now->lt($todayCheckout)) {
      $today->subDay();
    }

    $today = $today->format('Y-m-d');

    // Step 1: Get the IDs of rooms that are actively booked today
    $bookedRoomIds = DB::table('room_bookings')
      ->whereRaw(
        "STR_TO_DATE(CONCAT(arrival_date, ' ', ?), '%Y-%m-%d %H:%i:%s') <= ?",
        [$checkinTime, $now->toDateTimeString()]
      )
      ->whereRaw(
        "STR_TO_DATE(CONCAT(departure_date, ' ', ?), '%Y-%m-%d %H:%i:%s') >= ?",
        [$checkOutTime, $now->toDateTimeString()]
      )
      ->where('booking_status', '!=', 2)
      ->where('vendor_id', $vendorId)
      ->pluck('reserved_dates_info')
      ->flatMap(function ($json) use ($today) {
        $decoded = json_decode($json, true);

        // Skip if JSON is null or not an array
        if (!is_array($decoded)) return [];

        return collect($decoded)
          ->filter(function ($item) use ($today) {
            return isset($item['date'], $item['room_id']) && $item['date'] === $today;
          })
          ->pluck('room_id');
      })
      ->unique()
      ->values();

    // Step 2: Get the booked room details with room names (based on language)
    $bookedRooms = DB::table('room_numbers as rn')
      ->leftJoin('room_category_contents as rc', 'rn.room_category_id', '=', 'rc.room_id')
      ->whereIn('rn.id', $bookedRoomIds)
      ->where('rc.language_id', $language->id)
      ->where('rn.vendor_id', $vendorId)
      ->select('rn.*', 'rc.title as room_name')
      ->get();

    // Step 3: Get the available (not booked) rooms
    $availableRooms = DB::table('room_numbers as rn')
      ->leftJoin('room_category_contents as rc', 'rn.room_category_id', '=', 'rc.room_id')
      ->whereNotIn('rn.id', $bookedRoomIds)
      ->where('rc.language_id', $language->id)
      ->where('rn.vendor_id', $vendorId)
      ->select('rn.*', 'rc.title as room_name')
      ->get();

    $information['bookedRoomNumbers'] = $bookedRooms;
    $information['avaiableroomNumbers'] = $availableRooms;
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    return view('vendors.rooms.booking.todays-booked', $information);
  }
  public function checkIn(Request $request)
  {
    $booking_number = $request->filled('booking_no') ? $request->input('booking_no') : null;
    $date_option    = $request->input('date_option', 'today');

    if ($request->filled('keyword')) {
      $keyword = $request['keyword'];
    } else {
      $keyword = null;
    }

    $now = now(config('app.timezone'));
    $bs = Vendor::where('id', Auth::guard('vendor')->user()->id)->select('checkin_time')->first();
    $checkinTime = $bs->checkin_time ?? '14:00:00';

    // arrival_date + checkinTime -> DATETIME
    $checkinExpr = "STR_TO_DATE(CONCAT(arrival_date, ' ', ?), '%Y-%m-%d %H:%i:%s')";

    $bookings = RoomBooking::query()
      ->when(
        $booking_number,
        fn($q) =>
        $q->where('booking_number', 'like', '%' . $booking_number . '%')
      )
      // Common guards
      ->where('booking_status', '!=', 2)
      ->where('payment_status', '!=', 2)
      ->where('stay_status', 'Upcoming')
      ->where('vendor_id', Auth::guard('vendor')->user()->id)
      ->when($keyword, function ($query, $keyword) {
        $query->where(function ($q) use ($keyword) {
          $q->where('customer_name', 'like', '%' . $keyword . '%')
            ->orWhere('customer_email', 'like', '%' . $keyword . '%')
            ->orWhere('customer_phone', 'like', '%' . $keyword . '%');
        });
        return $query;
      })

      ->when($request->routeIs('vendor.check_ins.delayed'), function ($q) use ($request, $date_option, $checkinExpr, $checkinTime, $now) {

        if ($date_option === 'custom') {
          $request->validate([
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date'   => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
          ]);

          $start = Carbon::createFromFormat('Y-m-d', $request->start_date)->toDateString();
          $end   = Carbon::createFromFormat('Y-m-d', $request->end_date)->toDateString();

          $q->whereBetween('arrival_date', [$start, $end]);
          $q->whereRaw("$checkinExpr <= ?", [$checkinTime, $now->toDateTimeString()]);
        } else {
          $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
          ]);

          $selected = $request->filled('date')
            ? Carbon::createFromFormat('Y-m-d', $request->date)
            : now();

          if ($date_option === 'yesterday') {
            $selected = now()->subDay();
          }

          if ($selected->isFuture()) {
            return $q->whereRaw('1=0');
          }

          $q->whereDate('arrival_date', $selected->toDateString());

          if ($selected->isToday()) {
            $q->whereRaw("$checkinExpr <= ?", [$checkinTime, $now->toDateTimeString()]);
          }
        }
      })

      ->when($request->routeIs('vendor.check_ins.upcoming'), function ($q) use ($request, $date_option, $checkinExpr, $checkinTime, $now) {

        if ($date_option === 'custom') {
          $request->validate([
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date'   => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
          ]);

          $start = Carbon::createFromFormat('Y-m-d', $request->start_date)->toDateString();
          $end   = Carbon::createFromFormat('Y-m-d', $request->end_date)->toDateString();

          $q->whereBetween('arrival_date', [$start, $end]);
          $q->whereRaw("$checkinExpr > ?", [$checkinTime, $now->toDateTimeString()]);
        } else {
          $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
          ]);

          $selected = $request->filled('date')
            ? Carbon::createFromFormat('Y-m-d', $request->date)
            : now();

          if ($date_option === 'tomorrow') {
            $selected = now()->addDay();
          }

          $q->whereDate('arrival_date', $selected->toDateString());
          if ($selected->isToday()) {
            $q->whereRaw("$checkinExpr > ?", [$checkinTime, $now->toDateTimeString()]);
          }
        }
      })

      ->orderBy('id', 'desc')
      ->paginate(10);

    $information['bookings']     = $bookings;
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    return view('vendors.rooms.booking.check-in', $information);
  }
  public function checkOut(Request $request)
  {
    $booking_number = $request->filled('booking_no') ? $request->input('booking_no') : null;
    $date_option    = $request->input('date_option', 'today');

    if ($request->filled('keyword')) {
      $keyword = $request['keyword'];
    } else {
      $keyword = null;
    }

    $bs = Vendor::where('id', Auth::guard('vendor')->user()->id)->select('checkout_time')->first();
    $checkOutTime = $bs->checkout_time ?? '12:00:00';

    $now = now(config('app.timezone'));

    // departure_date + checkoutTime -> DATETIME
    $checkoutExpr = "STR_TO_DATE(CONCAT(departure_date, ' ', ?), '%Y-%m-%d %H:%i:%s')";

    $bookings = RoomBooking::query()
      ->when(
        $booking_number,
        fn($q) =>
        $q->where('booking_number', 'like', '%' . $booking_number . '%')
      )
      // Common guards
      ->where('booking_status', '!=', 2)
      ->where('payment_status', '!=', 2)
      ->where('stay_status', 'checked-in')
      ->where('vendor_id', Auth::guard('vendor')->user()->id)
      ->when($keyword, function ($query, $keyword) {
        $query->where(function ($q) use ($keyword) {
          $q->where('customer_name', 'like', '%' . $keyword . '%')
            ->orWhere('customer_email', 'like', '%' . $keyword . '%')
            ->orWhere('customer_phone', 'like', '%' . $keyword . '%');
        });
        return $query;
      })

      /* 🔴 DELAYED: specific(yesterday/today) + custom-range */
      ->when($request->routeIs('vendor.check_outs.delayed'), function ($q) use ($request, $checkoutExpr, $checkOutTime, $now, $date_option) {

        if ($date_option === 'custom') {
          $request->validate([
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date'   => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
          ]);

          $start = Carbon::createFromFormat('Y-m-d', $request->start_date)->toDateString();
          $end   = Carbon::createFromFormat('Y-m-d', $request->end_date)->toDateString();

          $q->whereBetween('departure_date', [$start, $end]);
          $q->whereRaw("$checkoutExpr <= ?", [$checkOutTime, $now->toDateTimeString()]);
        } else {
          // specific day: today | yesterday
          $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
          ]);
          $selected = $request->filled('date')
            ? Carbon::createFromFormat('Y-m-d', $request->date)
            : now();

          if ($date_option === 'yesterday') {
            $selected = now()->subDay();
          }

          $q->whereDate('departure_date', $selected->toDateString());

          if ($selected->isToday()) {
            $q->whereRaw("$checkoutExpr <= ?", [$checkOutTime, $now->toDateTimeString()]);
          }
          if ($selected->isFuture()) {
            $q->whereRaw('1=0');
          }
        }
      })

      /* 🟢 UPCOMING: specific(today/tomorrow) + custom-range */
      ->when($request->routeIs('vendor.check_outs.upcoming'), function ($q) use ($request, $checkoutExpr, $checkOutTime, $now, $date_option) {

        if ($date_option === 'custom') {
          $request->validate([
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date'   => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
          ]);

          $start = Carbon::createFromFormat('Y-m-d', $request->start_date)->toDateString();
          $end   = Carbon::createFromFormat('Y-m-d', $request->end_date)->toDateString();

          $q->whereBetween('departure_date', [$start, $end]);
          $q->whereRaw("$checkoutExpr > ?", [$checkOutTime, $now->toDateTimeString()]);
        } else {
          $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
          ]);

          $selected = $request->filled('date')
            ? Carbon::createFromFormat('Y-m-d', $request->date)
            : now();

          if ($date_option === 'tomorrow') {
            $selected = now()->addDay();
          }

          $q->whereDate('departure_date', $selected->toDateString());

          if ($selected->isToday()) {
            $q->whereRaw("$checkoutExpr > ?", [$checkOutTime, $now->toDateTimeString()]);
          }
        }
      })

      ->orderBy('id', 'desc')
      ->paginate(10);

    $information['bookings']     = $bookings;
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    return view('vendors.rooms.booking.check-out', $information);
  }


  public function updatePaymentStatus(Request $request)
  {
    $roomBooking = RoomBooking::findOrFail($request->booking_id);

    // If user submitted 'Paid' status
    if ($request->payment_status == 1) {

      if ($roomBooking->due > 0) {
        // Some amount is still due, so mark as Partial Paid
        $roomBooking->payment_status = 3;
      } else {
        // Full payment received, mark as Fully Paid
        $roomBooking->payment_status = 1;
      }
    } elseif ($request->payment_status == 2) {
      $roomBooking->paying_amount = 0.00;
      $roomBooking->due =  $roomBooking->grand_total;
      $roomBooking->payment_status = $request->payment_status;
    }

    $roomBooking->save();

    // delete previous invoice from local storage
    if (
      !is_null($roomBooking->invoice) &&
      file_exists(public_path('assets/invoices/rooms/') . $roomBooking->invoice)
    ) {
      unlink(public_path('assets/invoices/rooms/') . $roomBooking->invoice);
    }

    // then, generate an invoice in pdf format
    $invoice = $this->generateInvoice($roomBooking);

    // update the invoice field information in database
    $roomBooking->update(['invoice' => $invoice]);

    // finally, send a mail to the customer with the invoice
    $this->sendMailForPaymentStatus($roomBooking, $request->payment_status);

    session()->flash('success', 'Payment status updated successfully!');

    return redirect()->back();
  }
  public function updatePartialAmount(Request $request)
  {
    $roomBooking = RoomBooking::findOrFail($request->booking_id);

    if ($request->paying_amount <= 0) {
      session()->flash('warning', 'Paying amount must be greater than zero.');
      return redirect()->back();
    }

    if ($request->paying_amount > $roomBooking->due) {
      session()->flash('warning', 'Paying amount cannot exceed due amount.');
      return redirect()->back();
    }

    DB::beginTransaction();

    try {
      $payNow = (float) $request->paying_amount;

      // ===============================
      // UPDATE BASIC PAYMENT FIELDS
      // ===============================
      $roomBooking->paying_amount += $payNow;
      $roomBooking->due -= $payNow;

      if (bccomp($roomBooking->due, 0, 2) === 0) {
        $roomBooking->payment_status = 1; // Fully paid
      } else {
        $roomBooking->payment_status = 3; // Partial
      }

      $roomBooking->save();

      // ===============================
      // COMMISSION CALCULATION
      // ===============================
      $commissionPercent = (float) ($roomBooking->commission_percentage ?? 0);
      $totalCommission   = (float) $roomBooking->comission;

      $alreadyPaidCommission = (float) $roomBooking->admin_paid_commission;
      $remainingCommission   = max(0, $totalCommission - $alreadyPaidCommission);

      $adminPaidNow  = 0;
      $vendorPaidNow = 0;

      if ($payNow <= $remainingCommission) {
        $adminPaidNow  = $payNow;
        $vendorPaidNow = 0;
      } else {
        $adminPaidNow  = $remainingCommission;
        $vendorPaidNow = $payNow - $remainingCommission;
      }

      // ===============================
      // UPDATE BOOKING ACCOUNTING
      // ===============================
      $roomBooking->admin_paid_commission += $adminPaidNow;
      $roomBooking->admin_due_commission  -= $adminPaidNow;
      $roomBooking->vendor_paid_amount    += $vendorPaidNow;
      $roomBooking->vendor_due_amount     -= $vendorPaidNow;
      $roomBooking->received_amount       += $vendorPaidNow;

      // Safety
      $roomBooking->admin_paid_commission = max(0, round($roomBooking->admin_paid_commission, 2));
      $roomBooking->admin_due_commission  = max(0, round($roomBooking->admin_due_commission, 2));
      $roomBooking->vendor_paid_amount    = max(0, round($roomBooking->vendor_paid_amount, 2));
      $roomBooking->vendor_due_amount     = max(0, round($roomBooking->vendor_due_amount, 2));
      $roomBooking->received_amount       = max(0, round($roomBooking->received_amount, 2));

      $roomBooking->save();

      // ===============================
      // VENDOR BALANCE (COMMISSION ONLY)
      // ===============================
      if ($adminPaidNow > 0 && $roomBooking->vendor_id) {
        $vendor = Vendor::find($roomBooking->vendor_id);
        if ($vendor) {
          $vendor->amount = (float) $vendor->amount - $adminPaidNow;
          $vendor->save();
        }
      }

      // ===============================
      // ADMIN EARNING
      // ===============================
      if ($adminPaidNow > 0) {
        $earning = Earning::first();
        $earning->total_earning += $adminPaidNow;
        $earning->save();
      }

      // ===============================
      // TRANSACTION LOG
      // ===============================
      store_transaction([
        'transcation_id' => time(),
        'booking_id' => $roomBooking->id,
        'transcation_type' => 2, // partial payment
        'user_id' => null,
        'vendor_id' => $roomBooking->vendor_id,
        'payment_status' => $roomBooking->payment_status,
        'payment_method' => $roomBooking->payment_method,
        'grand_total' => $payNow,
        'commission' => $adminPaidNow,
        'pre_balance' => null,
        'after_balance' => null,
        'gateway_type' => $roomBooking->gateway_type,
        'currency_symbol' => $roomBooking->currency_symbol,
        'currency_symbol_position' => $roomBooking->currency_symbol_position,
      ]);

      // ===============================
      // INVOICE UPDATE
      // ===============================
      $this->generateInvoice($roomBooking);

      DB::commit();
      session()->flash('success', 'Payment status updated successfully!');
      return redirect()->back();
    } catch (\Throwable $e) {
      DB::rollBack();
      session()->flash('error', 'Something went wrong while updating payment.');
      return redirect()->back();
    }
  }

  public function updateStayStatus(Request $request)
  {
    $roomBooking = RoomBooking::findOrFail($request->booking_id);

    $roomBooking->stay_status = $request->stay_status;

    $roomBooking->save();

    if ($request->stay_status == 'checked-out') {
      session()->flash('warning', 'Please Update The Booking.');
    }

    session()->flash('success', 'Stay status updated successfully!');

    return redirect()->back();
  }
  public function updateBookingStatus(Request $request)
  {
    $roomBooking = RoomBooking::findOrFail($request->booking_id);

    $roomBooking->update(['booking_status' => $request->booking_status]);

    session()->flash('success', 'Booking status updated successfully!');

    return redirect()->back();
  }
  public function makeRefund(Request $request)
  {
    $request->validate([
      'booking_id' => 'required|integer',
      'refund_amount' => 'required|numeric|min:0.01'
    ]);

    $vendorId = Auth::guard('vendor')->user()->id;

    $roomBooking = RoomBooking::query()
      ->where('id', $request->booking_id)
      ->where('vendor_id', $vendorId)
      ->firstOrFail();


    if (Refund::where('booking_id', $roomBooking->id)->exists()) {
      return back()->with('error', 'Refund request already exists for this booking.');
    }


    $paidAmount = 0.0;
    if (in_array((int)$roomBooking->payment_status, [1, 3], true)) {
      $paidAmount = (float) ($roomBooking->paying_amount ?? 0);
    }

    $refundAmount = round((float) $request->refund_amount, 2);

    if ($refundAmount <= 0) {
      return back()->with('warning', 'Refund amount must be greater than zero.');
    }

    if ($refundAmount > $paidAmount) {
      return back()->with('error', 'Refund amount cannot be greater than the paid amount.');
    }


    if ((int)$roomBooking->booking_status !== 2) {
      $roomBooking->update(['booking_status' => 2]);
    }


    Refund::create([
      'booking_id'     => $roomBooking->id,
      'vendor_id'      => $roomBooking->vendor_id,
      'customer_name'  => $roomBooking->customer_name,
      'customer_email' => $roomBooking->customer_email,
      'customer_phone' => $roomBooking->customer_phone,
      'paying_amount'  => $paidAmount,
      'refund_amount'  => $refundAmount,
      'refund_reason'  => $request->refund_reason ?? null,
      'status'         => 1,
      'request_from'   => 'vendor',
    ]);

    return back()->with('success', 'Booking cancelled and refund request sent to admin.');
  }

  public function refunds()
  {
    $vendorId = Auth::guard('vendor')->user()->id;

    $information['refunds'] = Refund::where('vendor_id', $vendorId)
      ->whereIn('status', [0, 1, 2, 4, 5]) // only vendor-related states
      ->orderBy('id', 'desc')
      ->get();

    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    return view('vendors.rooms.booking.refunds', $information);
  }

  public function updateRefundStatus(Request $request)
  {

    $request->validate([
      'refund_id' => 'required|integer',
      'status'    => 'required|in:1,2', // vendor can only approve(1) or reject(2)
    ]);

    $vendorId = Auth::guard('vendor')->user()->id;

    // refund must belong to this vendor AND must be pending
    $refund = Refund::where('id', $request->refund_id)
      ->where('vendor_id', $vendorId)
      ->where('status', 0) // only pending can be updated by vendor
      ->firstOrFail();


    $refund->status = (int) $request->status;
    $refund->save();

    // Booking fetch (for email / sanity)
    $booking = RoomBooking::find($refund->booking_id);

    // If vendor rejects: send mail to customer (dispute option)
    if ((int)$refund->status == 2) {
      $this->sendMailForRefundRejectByVendor($booking,  $refund);
      session()->flash('success', 'Refund request rejected. Customer has been notified.');
      return redirect()->back();
    }

    // If vendor approves: it will be shown in Admin panel (status=1)
    session()->flash('success', 'Refund request approved and sent to admin for final decision.');
    return redirect()->back();
  }

  private function sendMailForRefundRejectByVendor($booking, $refund)
  {
    // first get the mail template information from db
    $mailTemplate = MailTemplate::where('mail_type', 'refund_reject_by_vendor')->firstOrFail();

    $mailSubject = $mailTemplate->mail_subject;
    $mailBody = $mailTemplate->mail_body;

    // second get the website title & mail's smtp information from db
    $info = DB::table('basic_settings')
      ->select('website_title', 'smtp_status', 'smtp_host', 'smtp_port', 'encryption', 'smtp_username', 'smtp_password', 'from_mail', 'from_name')
      ->first();

    $bookingLink = route('user.room_booking_details', $booking->id);
    $disputeLink = route('frontend.room_booking.cancel.dispute', $refund->id);

    // if template has booking number placeholder

    // replace template's curly-brace string with actual data

    $mailBody = str_replace('{booking_link}', '<a href="' . $bookingLink . '">' . $bookingLink . '</a>', $mailBody);
    $mailBody = str_replace('{dispute_link}', '<a href="' . $disputeLink . '">' . $disputeLink . '</a>', $mailBody);
    $mailBody = str_replace('{customer_name}', $booking->customer_name, $mailBody);
    $mailBody = str_replace('{website_title}', $info->website_title, $mailBody);

    // initialize a new mail
    $mail = new PHPMailer(true);

    // if smtp status == 1, then set some value for PHPMailer
    if ($info->smtp_status == 1) {
      $mail->isSMTP();
      $mail->Host       = $info->smtp_host;
      $mail->SMTPAuth   = true;
      $mail->Username   = $info->smtp_username;
      $mail->Password   = $info->smtp_password;

      if ($info->encryption == 'TLS') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      }

      $mail->Port       = $info->smtp_port;
    } else {
      return;
    }

    // finally add other informations and send the mail
    try {
      // Recipients
      $mail->setFrom($info->from_mail, $info->from_name);
      $mail->addAddress($refund->customer_email);

      // Attachments (Invoice)
      // $mail->addAttachment(public_path('assets/invoices/rooms/') . $booking->invoice);

      // Content
      $mail->isHTML(true);
      $mail->Subject = $mailSubject;
      $mail->Body    = $mailBody;

      $mail->send();

      return;
    } catch (Exception $e) {
      session()->flash('warning', 'Mail could not be sent!');

      return;
    }
  }


  public function editBooking($id)
  {
    $details = RoomBooking::findOrFail($id);
    $information['details'] = $details;

    // get the difference of two dates, date should be in 'YYYY-MM-DD' format
    $date1 = new DateTime($details->arrival_date);
    $date2 = new DateTime($details->departure_date);
    $information['interval2'] = $date1->diff($date2, true);

    $language = Language::where('is_default', 1)->first();
    $roomInfo = $details->hotelRoom()->first();

    $roomContentInfo = $roomInfo->roomContent()->where('language_id', $language->id)->first();
    $information['roomTitle'] = $roomContentInfo->title;

    $information['onlineGateways'] = OnlineGateway::query()
      ->where('status', '=', 1)
      ->select('name')
      ->get();

    $information['offlineGateways'] = OfflineGateway::query()
      ->where('status', '=', 1)
      ->select('name')
      ->orderBy('serial_number', 'asc')
      ->get();


    $start = \Carbon\Carbon::parse($details->arrival_date);
    $end = \Carbon\Carbon::parse($details->departure_date)->subDay();
    $interval = $start->diffInDays($end) + 1;

    $maxRoomsPerDay = (int) $details->total_rooms;

    $roomCategory = Room::findOrFail($details->room_category_id);
    $roomRent = $roomCategory->rent;

    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    $allRooms = RoomNumber::where('room_category_id', $details->room_category_id)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers by date
    $roomBookings = RoomBooking::where('room_category_id', $details->room_category_id)
      ->where('booking_status', '!=', 2)
      ->whereNotNull('reserved_dates_info')
      ->where('id', '!=', $details->id)
      ->get(['reserved_dates_info']);

    $bookedRoomsByDate = [];

    foreach ($roomBookings as $booking) {
      $reserved = is_string($booking->reserved_dates_info)
        ? json_decode($booking->reserved_dates_info, true)
        : $booking->reserved_dates_info;

      foreach ($reserved as $entry) {
        $date = $entry['date'];
        $roomNumber = $entry['room_number'];
        $bookedRoomsByDate[$date][] = $roomNumber;
      }
    }

    $reservedData = is_string($details->reserved_dates_info)
      ? json_decode($details->reserved_dates_info, true)
      : $details->reserved_dates_info;

    $mySelectedRoomsByDate = [];

    foreach ($reservedData as $entry) {
      $mySelectedRoomsByDate[$entry['date']][] = $entry['room_number'];
    }

    // Step 2: Build daily room status
    $dates = [];
    $tempStart = $start->copy();

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $rooms = $allRooms->map(function ($room) use ($bookedRoomNumbers, $roomRent, $mySelectedRoomsByDate, $dateStr) {
        $roomNumber = $room->room_number;

        $status = in_array($roomNumber, $bookedRoomNumbers) ? 'booked' : 'available';

        // selected check
        $selected = false;
        if ($status !== 'booked') {
          $selected = in_array($roomNumber, $mySelectedRoomsByDate[$dateStr] ?? []);
        }

        return [
          'id' => $room->id,
          'room_number' => $roomNumber,
          'status' => $status,
          'rent' => $roomRent,
          'selected' => $selected,
        ];
      })->values()->toArray();


      $dates[] = [
        'date' => $dateStr,
        'rooms' => $rooms,
      ];

      $tempStart->addDay();
    }

    // Step 2b: Check if any date has insufficient rooms
    $tempStart = $start->copy(); //reset again
    $insufficientDate = null;

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $availableCount = $allRooms->filter(function ($room) use ($bookedRoomNumbers) {
        return !in_array($room->room_number, $bookedRoomNumbers);
      })->count();

      if ($availableCount < $maxRoomsPerDay) {
        $insufficientDate = $dateStr;
        break;
      }

      $tempStart->addDay();
    }
    $roomDays = [];

    foreach ($reservedData as $entry) {
      $roomKey = $entry['room_number'];
      if (!isset($roomDays[$roomKey])) {
        $roomDays[$roomKey] = 0;
      }
      $roomDays[$roomKey]++;
    }

    // Build final roomList for the view
    $roomList = [];

    foreach ($roomDays as $roomNumber => $days) {
      $room = $allRooms->firstWhere('room_number', $roomNumber);
      if ($room) {
        $roomList[] = [
          'room_number' => $roomNumber,
          'room_id' => $room->id,
          'rent' => $roomRent,
          'days' => $days,
        ];
      }
    }

    $dates2[] = [
      'rooms' => $roomList,
    ];


    $information['interval']  = $interval;
    $information['dates']  = $dates;
    $information['dates2']  = $dates2;
    $information['totalRooms']  = $details->total_rooms;
    $information['discount']  = 0.00; // default discount is 0.00
    $information['bs']  = $bs;
    $information['insufficientDate']  = $insufficientDate;
    $information['dateStr']  = $dateStr;
    $information['availableCount']  = $availableCount;

    return view('vendors.rooms.booking.edit', $information);
  }

  public function updateBooking(AdminRoomBookingRequest $request)
  {
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    $dateArray = explode(' ', $request->dates);

    $onlinePaymentGateway = [
      'PayPal',
      'Stripe',
      'Instamojo',
      'Paystack',
      'Flutterwave',
      'Razorpay',
      'MercadoPago',
      'Mollie',
      'Paytm',
      'Phonepe',
      'Xendit',
      'Perfect Money',
      'Myfatoorah',
      'Yoco',
      'Toyyibpay',
      'Paytabs',
      'Iyzico',
      'Midtrans',
      'Authorize.net',
    ];
    $gatewayType = in_array($request->payment_method, $onlinePaymentGateway) ? 'online' : 'offline';

    $booking = RoomBooking::findOrFail($request->booking_id);

    DB::beginTransaction();

    try {
      // ===============================
      // OLD SNAPSHOT
      // ===============================
      $oldPayingAmount = round((float) $booking->paying_amount, 2);

      $oldAdminPaid  = round((float) $booking->admin_paid_commission, 2);
      $oldVendorPaid = round((float) $booking->vendor_paid_amount, 2);
      $oldAllocated  = round($oldAdminPaid + $oldVendorPaid, 2);

      // ===============================
      // RECALCULATE TOTAL (discount + tax)
      // ===============================
      $roomCategory = Room::query()->findOrFail($request->room_category_id);

      $totalRooms = count($request->rooms);
      $totalRent  = (float) $roomCategory->rent * $totalRooms;

      $discount = (float) ($request->discount ?? 0);
      $subtotal = max(0, $totalRent - $discount);

      $taxPercent = (float) Basic::query()->value('tax');
      $taxAmount  = ($subtotal * $taxPercent) / 100;
      $grandTotal = $subtotal + $taxAmount;

      // HARD RULE: grand_total cannot be less than already paid amount
      if (round($grandTotal, 2) < $oldPayingAmount) {
        DB::rollBack();
        session()->flash('warning', 'Grand total cannot be less than already paid amount.');
        return 'success';
      }

      // ===============================
      // PAYING AMOUNT RULE (cannot reduce)
      // ===============================
      $newPayingAmount = $oldPayingAmount;

      if ((int) $request->payment_status === 1) {
        $newPayingAmount = round((float) $grandTotal, 2);
      } elseif ((int) $request->payment_status === 3) {
        $reqPay = round((float) ($request->paying_amount ?? 0), 2);

        if ($reqPay < $oldPayingAmount) {
          DB::rollBack();
          session()->flash('warning', 'Paying amount cannot be reduced.');
          return 'success';
        }

        $newPayingAmount = min($reqPay, round((float) $grandTotal, 2));
      } else {
        // keep old paying history (vendor panel should not wipe paid history)
        $newPayingAmount = $oldPayingAmount;
      }

      $due = max(0, round($grandTotal - $newPayingAmount, 2));

      // ===============================
      // BASIC UPDATE
      // ===============================
      $booking->update([
        'customer_name' => $request->customer_name,
        'customer_email' => $request->customer_email,
        'customer_phone' => $request->customer_phone,
        'room_category_id' => $request->room_category_id,
        'arrival_date' => $dateArray[0],
        'departure_date' => $dateArray[2],
        'adult' => $request->adult,
        'child' => $request->child,
        'total_rent' => $totalRent,
        'subtotal' => $subtotal,
        'discount' => $discount,
        'tax_percentage' => $taxPercent,
        'tax' => $taxAmount,
        'grand_total' => $grandTotal,
        'paying_amount' => $newPayingAmount,
        'due' => $due,
        'currency_symbol' => $currencyInfo->base_currency_symbol,
        'currency_symbol_position' => $currencyInfo->base_currency_symbol_position,
        'currency_text' => $currencyInfo->base_currency_text,
        'currency_text_position' => $currencyInfo->base_currency_text_position,
        'payment_method' => $request->payment_method,
        'gateway_type' => $gatewayType,
        'reserved_dates_info' => $request->rooms,
        'total_rooms' => $request->total_rooms,
        'payment_status' => $request->payment_status,
        'booking_status' => $request->booking_status,
      ]);

      $booking->refresh();

      // ===============================
      // VENDOR DETECT
      // ===============================
      $vendor = $booking->vendor_id ? Vendor::query()->find($booking->vendor_id) : null;
      if (!$vendor) {
        DB::rollBack();
        session()->flash('warning', 'Vendor not found for this booking.');
        return 'success';
      }

      // ===============================
      // COMMISSION RECALC (commission-first)
      // ===============================
      $commissionRate = (float) Commission::query()->value('room_booking_commission');
      $newTotalCommission = round(($grandTotal * $commissionRate) / 100, 2);
      $newVendorTotal     = round($grandTotal - $newTotalCommission, 2);

      // paying cannot go below previously allocated
      if ($newPayingAmount < $oldAllocated) {
        DB::rollBack();
        session()->flash('warning', 'Paying amount cannot be reduced without refund.');
        return 'success';
      }

      // Target split (commission-first)
      $targetAdminPaid  = round(min($newPayingAmount, $newTotalCommission), 2);
      $targetVendorPaid = round(max(0, $newPayingAmount - $newTotalCommission), 2);

      $deltaAdmin   = round($targetAdminPaid - $oldAdminPaid, 2);     // can be +/-
      $deltaVendor  = round($targetVendorPaid - $oldVendorPaid, 2);   // can be +/-
      $paymentDelta = round($newPayingAmount - $oldPayingAmount, 2);  // >=0 (new cash collected by vendor)

      $preBalance = null;
      $afterBalance = null;

      if ($paymentDelta == 0) {
        // If deltas don't offset, something inconsistent
        if (round($deltaAdmin + $deltaVendor, 2) !== 0.00) {
          DB::rollBack();
          session()->flash('warning', 'Allocation mismatch. Admin adjustment required.');
          return 'success';
        }

        // (a) vendor -> admin shift: need to deduct from vendor balance
        if ($deltaAdmin > 0 && $deltaVendor < 0) {
          $shift = round($deltaAdmin, 2);

          $vendor->refresh();
          $preBalance = (float) $vendor->amount;

          if ($preBalance < $shift) {
            DB::rollBack();
            session()->flash('warning', 'Vendor balance is insufficient for commission adjustment.');
            return 'success';
          }

          $vendor->amount = $preBalance - $shift;
          $vendor->save();
          $afterBalance = (float) $vendor->amount;
        }
      }

      if ($paymentDelta > 0) {
        // In new cash scenario, admin paid should not decrease
        if ($deltaAdmin < 0) {
          DB::rollBack();
          session()->flash('warning', 'Invalid commission allocation on new payment.');
          return 'success';
        }

        $commissionCutNow = round($deltaAdmin, 2); // admin commission part created by this update
        if ($commissionCutNow > 0) {
          $vendor->refresh();
          $preBalance = (float) $vendor->amount;

          if ($preBalance < $commissionCutNow) {
            DB::rollBack();
            session()->flash('warning', 'Vendor balance is insufficient to deduct commission.');
            return 'success';
          }

          $vendor->amount = $preBalance - $commissionCutNow;
          $vendor->save();
          $afterBalance = (float) $vendor->amount;
        }

        // transaction log for new payment
        store_transaction([
          'transcation_id' => time(),
          'booking_id' => $booking->id,
          'transcation_type' => 6,
          'user_id' => null,
          'vendor_id' => $booking->vendor_id,
          'payment_status' => $booking->payment_status,
          'payment_method' => $booking->payment_method,
          'grand_total' => $paymentDelta,
          'commission' => $commissionCutNow,
          'pre_balance' => null,
          'after_balance' => null,
          'gateway_type' => $booking->gateway_type,
          'currency_symbol' => $booking->currency_symbol,
          'currency_symbol_position' => $booking->currency_symbol_position,
        ]);
      }

      $adminDue  = max(0, round($newTotalCommission - $targetAdminPaid, 2));
      $vendorDue = max(0, round($newVendorTotal - $targetVendorPaid, 2));

      $booking->update([
        'commission_percentage' => $commissionRate,
        'comission' => $newTotalCommission,
        'admin_paid_commission' => $targetAdminPaid,
        'admin_due_commission' => $adminDue,
        'vendor_paid_amount' => $targetVendorPaid,
        'vendor_due_amount' => $vendorDue,
        'received_amount' => $targetVendorPaid,
        'due' => $due,
      ]);

      // ===============================
      // INVOICE
      // ===============================
      $invoice = $this->generateInvoice($booking);
      $booking->update(['invoice' => $invoice]);

      // Optional: log commission shift (paymentDelta==0 and deltaAdmin>0)
      if ($paymentDelta == 0 && $deltaAdmin > 0) {
        store_transaction([
          'transcation_id' => time(),
          'booking_id' => $booking->id,
          'transcation_type' => 6,
          'user_id' => null,
          'vendor_id' => $booking->vendor_id,
          'payment_status' => $booking->payment_status,
          'payment_method' => $booking->payment_method,
          'grand_total' => 0,
          'commission' => $deltaAdmin,
          'pre_balance' => $preBalance,
          'after_balance' => $afterBalance,
          'gateway_type' => $booking->gateway_type,
          'currency_symbol' => $booking->currency_symbol,
          'currency_symbol_position' => $booking->currency_symbol_position,
        ]);
      }

      DB::commit();
      session()->flash('success', 'Booking information updated successfully.');
      return 'success';
    } catch (\Throwable $e) {
      DB::rollBack();
      if (config('app.debug')) {
        session()->flash('error', get_class($e) . ': ' . $e->getMessage());
      } else {
        session()->flash('error', 'Something went wrong while updating booking.');
      }
      return 'error';
    }
  }

  public function bookingDetails($id)
  {
    $details = RoomBooking::findOrFail($id);
    $information['details'] = $details;
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    // get the difference of two dates, date should be in 'YYYY-MM-DD' format
    $date1 = new DateTime($details->arrival_date);
    $date2 = new DateTime($details->departure_date);
    $information['interval2'] = $date1->diff($date2, true);

    $language = Language::where('is_default', 1)->first();
    $roomInfo = $details->hotelRoom()->first();

    $roomContentInfo = $roomInfo->roomContent()->where('language_id', $language->id)->first();
    $information['roomTitle'] = $roomContentInfo->title;

    $information['onlineGateways'] = OnlineGateway::query()
      ->where('status', '=', 1)
      ->select('name')
      ->get();

    $information['offlineGateways'] = OfflineGateway::query()
      ->where('status', '=', 1)
      ->select('name')
      ->orderBy('serial_number', 'asc')
      ->get();

    $start = \Carbon\Carbon::parse($details->arrival_date);
    $end = \Carbon\Carbon::parse($details->departure_date)->subDay();
    $interval = $start->diffInDays($end) + 1;

    $maxRoomsPerDay = (int) $details->total_rooms;

    $roomCategory = Room::findOrFail($details->room_category_id);
    $roomRent = $roomCategory->rent;

    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    $allRooms = RoomNumber::where('room_category_id', $details->room_category_id)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers by date
    $roomBookings = RoomBooking::where('room_category_id', $details->room_category_id)
      ->where('booking_status', '!=', 2)
      ->whereNotNull('reserved_dates_info')
      ->where('id', '!=', $details->id)
      ->get(['reserved_dates_info']);

    $bookedRoomsByDate = [];

    foreach ($roomBookings as $booking) {
      $reserved = is_string($booking->reserved_dates_info)
        ? json_decode($booking->reserved_dates_info, true)
        : $booking->reserved_dates_info;

      foreach ($reserved as $entry) {
        $date = $entry['date'];
        $roomNumber = $entry['room_number'];
        $bookedRoomsByDate[$date][] = $roomNumber;
      }
    }

    $reservedData = is_string($details->reserved_dates_info)
      ? json_decode($details->reserved_dates_info, true)
      : $details->reserved_dates_info;

    $mySelectedRoomsByDate = [];

    foreach ($reservedData as $entry) {
      $mySelectedRoomsByDate[$entry['date']][] = $entry['room_number'];
    }

    // Step 2: Build daily room status
    $dates = [];
    $tempStart = $start->copy();

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $rooms = $allRooms->map(function ($room) use ($bookedRoomNumbers, $roomRent, $mySelectedRoomsByDate, $dateStr) {
        $roomNumber = $room->room_number;

        $status = in_array($roomNumber, $bookedRoomNumbers) ? 'booked' : 'available';

        // selected check
        $selected = false;
        if ($status !== 'booked') {
          $selected = in_array($roomNumber, $mySelectedRoomsByDate[$dateStr] ?? []);
        }

        return [
          'id' => $room->id,
          'room_number' => $roomNumber,
          'status' => $status,
          'rent' => $roomRent,
          'selected' => $selected,
        ];
      })->values()->toArray();


      $dates[] = [
        'date' => $dateStr,
        'rooms' => $rooms,
      ];

      $tempStart->addDay();
    }

    // Step 2b: Check if any date has insufficient rooms
    $tempStart = $start->copy();
    $insufficientDate = null;

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $availableCount = $allRooms->filter(function ($room) use ($bookedRoomNumbers) {
        return !in_array($room->room_number, $bookedRoomNumbers);
      })->count();

      if ($availableCount < $maxRoomsPerDay) {
        $insufficientDate = $dateStr;
        break;
      }

      $tempStart->addDay();
    }
    $roomDays = [];

    foreach ($reservedData as $entry) {
      $roomKey = $entry['room_number'];
      if (!isset($roomDays[$roomKey])) {
        $roomDays[$roomKey] = 0;
      }
      $roomDays[$roomKey]++;
    }
    $information['interval']  = $interval;

    return view('vendors.rooms.booking.details', $information);
  }

  public function paidServices($id)
  {
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    $details = RoomBooking::findOrFail($id);
    $information['currencyInfo'] = $currencyInfo;
    $information['id'] = $id;
    $information['roomDates'] = $details->reserved_dates_info;
    $information['paidServices'] = $details->paid_services;
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    $information['services'] = PaidService::query()
      ->where('status', '=', 1)
      ->where('vendor_id', '=', Auth::guard('vendor')->user()->id)
      ->orderBy('id', 'asc')
      ->get();

    return view('vendors.rooms.booking.paid-services', $information);
  }

  public function updatePaidServices(Request $request)
  {
    $rules = [
      'date'     => 'required',
      'room'     => 'required',
      'service'  => 'required',
      'quantity' => 'required|integer|min:1'
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return response()->json([
        'errors' => $validator->errors()
      ], 400);
    }

    $unitPrice  = (float) PaidService::where('name', $request->service)->value('price');
    $totalPrice = $unitPrice * (int) $request->quantity;

    $booking = RoomBooking::findOrFail($request->booking_id);

    // safe array
    $services = is_array($booking->paid_services) ? $booking->paid_services : [];

    $newId = collect($services)->max('id') + 1;
    $services[] = [
      'id'          => $newId,
      'date'        => $request->date,
      'room'        => $request->room,
      'service'     => $request->service,
      'unit_price'  => $unitPrice,
      'quantity'    => (int) $request->quantity,
      'total_price' => $totalPrice,
      'is_paid'     => false,
    ];

    // PAYMENT SAFE LOGIC
    $oldPaid = (float) $booking->paying_amount;

    // price increase only
    $booking->paid_services          = $services;
    $booking->service_charge        += $totalPrice;
    $booking->subtotal              += $totalPrice;
    $booking->grand_total           += $totalPrice;
    $booking->vendor_paid_amount    += $totalPrice;
    $booking->vendor_due_amount     += $totalPrice;

    // payment untouched
    $booking->paying_amount = $oldPaid;

    // due recalculated
    $booking->due = max(0, $booking->grand_total - $booking->paying_amount);

    // booking becomes partial if due exists
    if ($booking->due > 0) {
      $booking->payment_status = 3; // partial
    }

    $booking->save();

    session()->flash('success', 'Service added successfully!');
    return 'success';
  }

  public function updatePaidServicesPaymentStatus(Request $request)
  {
    $roomBooking = RoomBooking::findOrFail($request->booking_id);

    $paidServices = $roomBooking->paid_services;

    $updatedAmount = 0;

    foreach ($paidServices as &$service) {
      if ($service['id'] == $request->service_id) {
        // Only update the amount if the previous status was 'due' and the new status is 'paid'
        if ($service['payment_status'] == 'due' && $request->payment_status == 'paid') {
          $updatedAmount = (float) $service['price'];
        }
        $service['payment_status'] = $request->payment_status;
        break;
      }
    }

    // Update paid_services JSON
    $roomBooking->paid_services = $paidServices;

    // Update amounts
    $roomBooking->paying_amount += $updatedAmount;
    $roomBooking->due -= $updatedAmount;

    // Check if fully paid
    if ($roomBooking->due <= 0) {
      $roomBooking->payment_status = 1; // Fully paid
    }

    $roomBooking->save();

    session()->flash('success', 'Payment status updated successfully!');
    return redirect()->back();
  }



  public function sendMail(Request $request)
  {
    $rules = [
      'subject' => 'required',
      'message' => 'required',
    ];

    $messages = [
      'subject.required' => 'The email subject field is required.',
      'message.required' => 'The email message field is required.'
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {
      return Response::json([
        'errors' => $validator->getMessageBag()->toArray()
      ], 400);
    }

    // get the mail's smtp information from db
    $mailInfo = DB::table('basic_settings')
      ->select('smtp_status', 'smtp_host', 'smtp_port', 'encryption', 'smtp_username', 'smtp_password', 'from_mail', 'from_name')
      ->where('uniqid', 12345)
      ->first();

    // initialize a new mail
    $mail = new PHPMailer(true);

    // if smtp status == 1, then set some value for PHPMailer
    if ($mailInfo->smtp_status == 1) {
      $mail->isSMTP();
      $mail->Host       = $mailInfo->smtp_host;
      $mail->SMTPAuth   = true;
      $mail->Username   = $mailInfo->smtp_username;
      $mail->Password   = $mailInfo->smtp_password;

      if ($mailInfo->encryption == 'TLS') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      }

      $mail->Port       = $mailInfo->smtp_port;
    }

    // finally add other informations and send the mail
    try {
      // Recipients
      $mail->setFrom($mailInfo->from_mail, $mailInfo->from_name);
      $mail->addAddress($request->customer_email);

      // Content
      $mail->isHTML(true);
      $mail->Subject = $request->subject;
      $mail->Body    = clean($request->message);

      $mail->send();

      session()->flash('success', 'Mail has been sent!');

      /**
       * this 'success' is returning for ajax call.
       * if return == 'success' then ajax will reload the page.
       */
      return 'success';
    } catch (Exception $e) {
      session()->flash('warning', 'Mail could not be sent!');

      /**
       * this 'success' is returning for ajax call.
       * if return == 'success' then ajax will reload the page.
       */
      return 'success';
    }
  }

  public function deleteBooking(Request $request, $id)
  {
    $roomBooking = RoomBooking::findOrFail($id);

    // first, delete the attachment
    if (
      !is_null($roomBooking->attachment) &&
      file_exists(public_path('assets/img/attachments/rooms/') . $roomBooking->attachment)
    ) {
      unlink(public_path('assets/img/attachments/rooms/') . $roomBooking->attachment);
    }

    // second, delete the invoice
    if (
      !is_null($roomBooking->invoice) &&
      file_exists(public_path('assets/invoices/rooms/') . $roomBooking->invoice)
    ) {
      unlink(public_path('assets/invoices/rooms/') . $roomBooking->invoice);
    }

    // finally, delete the room booking record from db
    $roomBooking->delete();

    session()->flash('success', 'Room booking record deleted successfully!');

    return redirect()->back();
  }

  public function bulkDeleteBooking(Request $request)
  {
    $ids = $request->ids;

    foreach ($ids as $id) {
      $roomBooking = RoomBooking::findOrFail($id);

      // first, delete the attachment
      if (
        !is_null($roomBooking->attachment) &&
        file_exists(public_path('assets/img/attachments/rooms/') . $roomBooking->attachment)
      ) {
        unlink(public_path('assets/img/attachments/rooms/') . $roomBooking->attachment);
      }

      // second, delete the invoice
      if (
        !is_null($roomBooking->invoice) &&
        file_exists(public_path('assets/invoices/rooms/') . $roomBooking->invoice)
      ) {
        unlink(public_path('assets/invoices/rooms/') . $roomBooking->invoice);
      }

      // finally, delete the room booking record from db
      $roomBooking->delete();
    }

    session()->flash('success', 'Room booking records deleted successfully!');

    /**
     * this 'success' is returning for ajax call.
     * if return == 'success' then ajax will reload the page.
     */
    return 'success';
  }


  public function generateInvoice($bookingInfo)
  {
    $bs = Basic::select('website_title', 'support_contact', 'support_email', 'address')->first();

    // delete previous invoice from local storage
    @unlink(public_path('assets/invoices/rooms/') . $bookingInfo->invoice);

    $fileName = $bookingInfo->booking_number . '.pdf';
    $directory = public_path('assets/invoices/rooms/');

    @mkdir($directory, 0777, true);

    $fileLocated = $directory . $fileName;

    Pdf::loadView('frontend.pdf.room_booking', compact('bookingInfo', 'bs'))->save($fileLocated);

    return $fileName;
  }

  private function sendMailForPaymentStatus($roomBooking, $status)
  {
    // first get the mail template information from db
    if ($status == 1) {
      $mailTemplate = MailTemplate::where('mail_type', 'payment_received')->firstOrFail();
    } else {
      $mailTemplate = MailTemplate::where('mail_type', 'payment_cancelled')->firstOrFail();
    }
    $mailSubject = $mailTemplate->mail_subject;
    $mailBody = $mailTemplate->mail_body;

    // second get the website title & mail's smtp information from db
    $info = DB::table('basic_settings')
      ->select('website_title', 'smtp_status', 'smtp_host', 'smtp_port', 'encryption', 'smtp_username', 'smtp_password', 'from_mail', 'from_name')
      ->first();

    // replace template's curly-brace string with actual data
    $mailBody = str_replace('{customer_name}', $roomBooking->customer_name, $mailBody);
    $mailBody = str_replace('{website_title}', $info->website_title, $mailBody);

    // initialize a new mail
    $mail = new PHPMailer(true);

    // if smtp status == 1, then set some value for PHPMailer
    if ($info->smtp_status == 1) {
      $mail->isSMTP();
      $mail->Host       = $info->smtp_host;
      $mail->SMTPAuth   = true;
      $mail->Username   = $info->smtp_username;
      $mail->Password   = $info->smtp_password;

      if ($info->encryption == 'TLS') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      }

      $mail->Port       = $info->smtp_port;
    }

    // finally add other informations and send the mail
    try {
      // Recipients
      $mail->setFrom($info->from_mail, $info->from_name);
      $mail->addAddress($roomBooking->customer_email);

      // Attachments (Invoice)
      $mail->addAttachment(public_path('assets/invoices/rooms/') . $roomBooking->invoice);

      // Content
      $mail->isHTML(true);
      $mail->Subject = $mailSubject;
      $mail->Body    = $mailBody;

      $mail->send();

      return;
    } catch (Exception $e) {
      return redirect()->back()->with('warning', 'Mail could not be sent!');
    }
  }



  public function getBookedDatesOfRoom($id, $bookingId = null)
  {
    $quantity = Room::query()->findOrFail($id)->quantity;

    $bookings = RoomBooking::query()->where('room_category_id', '=', $id)
      ->where('payment_status', '=', 1)
      ->select('arrival_date', 'departure_date')
      ->get();

    $bookedDates = [];

    foreach ($bookings as $booking) {
      // get all the dates between the booking arrival date & booking departure date
      $date_1 = $booking->arrival_date;
      $date_2 = $booking->departure_date;

      $allDates = $this->getAllDates($date_1, $date_2, 'Y-m-d');

      // loop through the list of dates, which we have found from the booking arrival date & booking departure date
      foreach ($allDates as $date) {
        $bookingCount = 0;

        // loop through all the bookings
        foreach ($bookings as $currentBooking) {
          $bookingStartDate = Carbon::parse($currentBooking->arrival_date);
          $bookingEndDate = Carbon::parse($currentBooking->departure_date);
          $currentDate = Carbon::parse($date);

          // check for each date, whether the date is present or not in any of the booking date range
          if ($currentDate->betweenIncluded($bookingStartDate, $bookingEndDate)) {
            $bookingCount++;
          }
        }

        // if the number of booking of a specific date is same as the room quantity, then mark that date as unavailable
        if ($bookingCount >= $quantity && !in_array($date, $bookedDates)) {
          array_push($bookedDates, $date);
        }
      }
    }

    if (is_null($bookingId)) {
      return $bookedDates;
    } else {
      $booking = RoomBooking::query()->findOrFail($bookingId);
      $arrivalDate = $booking->arrival_date;
      $departureDate = $booking->departure_date;

      // get all the dates between the booking arrival date & booking departure date
      $bookingAllDates = $this->getAllDates($arrivalDate, $departureDate, 'Y-m-d');

      // remove dates of this booking from 'bookedDates' array while editing a room booking
      foreach ($bookingAllDates as $date) {
        $key = array_search($date, $bookedDates);

        if ($key !== false) {
          unset($bookedDates[$key]);
        }
      }

      return array_values($bookedDates);
    }
  }

  public function getAllDates($startDate, $endDate, $format)
  {
    $dates = [];

    // convert string to timestamps
    $currentTimestamps = strtotime($startDate);
    $endTimestamps = strtotime($endDate);

    // set an increment value
    $stepValue = '+1 day';

    // push all the timestamps to the 'dates' array by formatting those timestamps into date
    while ($currentTimestamps <= $endTimestamps) {
      $formattedDate = date($format, $currentTimestamps);
      array_push($dates, $formattedDate);
      $currentTimestamps = strtotime($stepValue, $currentTimestamps);
    }

    return $dates;
  }

  // room booking from admin panel
  public function bookedDates(Request $request)
  {
    $rule = [
      'room_category_id' => 'required',
      'dates' => 'required'
    ];

    $message = [
      'room_category_id.required' => 'Please select a room Category.',
      'dates.required' => 'Please select Check In / Out Date.'
    ];

    $validator = Validator::make($request->all(), $rule, $message);

    if ($validator->fails()) {
      return response()->json([
        'error' => $validator->getMessageBag()
      ]);
    }

    // get all the booked dates of the selected room
    $roomId = $request['room_category_id'];
    $dates = $request['dates'];

    $bookedDates = $this->getBookedDatesOfRoom($roomId);

    session()->put('bookedDates', $bookedDates);

    return response()->json([
      'success' => route('vendor.room_bookings.booking_form', [
        'room_category_id' => $roomId,
        'dates' => $dates
      ])
    ]);
  }

  public function bookingForm(Request $request)
  {
    $roomCategory = Room::where('id', $request->room_category_id)
      ->where('vendor_id', Auth::guard('vendor')->id())
      ->firstOrFail();

    $information['datesC'] = $request->dates;
    [$startDate, $endDate] = explode(' - ', $request->dates);
    $start = \Carbon\Carbon::parse($startDate);
    $end = \Carbon\Carbon::parse($endDate)->subDay();
    $interval = $start->diffInDays($end) + 1;


    $id = $request['room_category_id'];
    $information['id'] = $id;

    $room = Room::query()->find($id);
    $information['rent'] = $room->rent;

    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    $information['onlineGateways'] = OnlineGateway::query()
      ->where('status', '=', 1)
      ->select('name')
      ->get();

    $information['offlineGateways'] = OfflineGateway::query()
      ->where('status', '=', 1)
      ->select('name')
      ->orderBy('serial_number', 'asc')
      ->get();

    $maxRoomsPerDay = 1;
    $roomRent = $roomCategory->rent;

    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    $allRooms = RoomNumber::where('room_category_id', $request->room_category_id)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers by date
    $roomBookings = RoomBooking::where('room_category_id', $request->room_category_id)
      ->where('booking_status', '!=', 2)
      ->whereNotNull('reserved_dates_info')
      ->get(['reserved_dates_info']);

    $bookedRoomsByDate = [];

    foreach ($roomBookings as $booking) {
      $reserved = is_string($booking->reserved_dates_info)
        ? json_decode($booking->reserved_dates_info, true)
        : $booking->reserved_dates_info;

      foreach ($reserved as $entry) {
        $date = $entry['date'];
        $roomNumber = $entry['room_number'];
        $bookedRoomsByDate[$date][] = $roomNumber;
      }
    }

    // Step 2: Build daily room status
    $dates = [];
    $tempStart = $start->copy();

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $rooms = $allRooms->map(function ($room) use ($bookedRoomNumbers, $roomRent) {
        return [
          'id' => $room->id,
          'room_number' => $room->room_number,
          'status' => in_array($room->room_number, $bookedRoomNumbers) ? 'booked' : 'available',
          'rent' => $roomRent,
        ];
      })->values()->toArray();

      $dates[] = [
        'date' => $dateStr,
        'rooms' => $rooms,
      ];

      $tempStart->addDay();
    }

    // Step 2b: Check if any date has insufficient rooms
    $tempStart = $start->copy(); //reset again
    $insufficientDate = null;

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $availableCount = $allRooms->filter(function ($room) use ($bookedRoomNumbers) {
        return !in_array($room->room_number, $bookedRoomNumbers);
      })->count();

      if ($availableCount < $maxRoomsPerDay) {
        $insufficientDate = $dateStr;
        break;
      }

      $tempStart->addDay();
    }

    // Step 3: Suggest rooms available for all dates
    $roomSummary = [];
    $dailySummaryCounter = [];
    $loopDate = $start->copy();

    while ($loopDate->lte($end)) {
      $dateStr = $loopDate->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      foreach ($allRooms as $room) {
        $roomKey = $room->room_number;

        if (isset($roomSummary[$roomKey]) && $roomSummary[$roomKey]['days'] >= $interval) {
          continue;
        }

        if (in_array($roomKey, $bookedRoomNumbers)) {
          continue;
        }

        if (!isset($dailySummaryCounter[$dateStr])) {
          $dailySummaryCounter[$dateStr] = 0;
        }

        if ($dailySummaryCounter[$dateStr] >= $maxRoomsPerDay) {
          continue;
        }

        if (!isset($roomSummary[$roomKey])) {
          $roomSummary[$roomKey] = [
            'room_number' => $room->room_number,
            'room_id' => $room->id,
            'rent' => $roomRent,
            'days' => 0,
          ];
        }

        $roomSummary[$roomKey]['days'] += 1;
        $dailySummaryCounter[$dateStr] += 1;
      }

      $loopDate->addDay();
    }

    $roomList = array_values($roomSummary);
    $dates2[] = [
      'rooms' => $roomList,
    ];

    $information['interval']  = $interval;
    $information['dates']  = $dates;
    $information['dates2']  = $dates2;
    $information['totalRooms']  = 1;
    $information['discount']  = 0.00; // default discount is 0.00
    $information['bs']  = $bs;
    $information['insufficientDate']  = $insufficientDate;
    $information['dateStr']  = $dateStr;
    $information['availableCount']  = $availableCount;
    $information['roomCategory']  = $roomCategory;

    return view('vendors.rooms.booking.booking-form', $information);
  }


  public function totalRooms(Request $request)
  {
    // Optional booking ID (used to exclude a specific booking when editing)
    $bookingId = null;
    if ($request->bookingId) {
      $bookingId = $request->bookingId;
    }

    // Split the date range from request (format: 'Y-m-d - Y-m-d')
    [$startDate, $endDate] = explode(' - ', $request->dates);
    $start = \Carbon\Carbon::parse($startDate);
    $end = \Carbon\Carbon::parse($endDate)->subDay(); // exclude checkout day
    $interval = $start->diffInDays($end) + 1; // total number of booking days

    // Max number of rooms needed per day
    $maxRoomsPerDay = (int) $request->totalRooms;

    // Get room category and rent
    $roomCategory = Room::findOrFail($request->roomCategoryId);
    $roomRent = $roomCategory->rent;

    // Get basic settings like tax and currency format
    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    // Get all active rooms for the given category
    $allRooms = RoomNumber::where('room_category_id', $request->roomCategoryId)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers and group them by date
    $roomBookings = RoomBooking::where('room_category_id', $request->roomCategoryId)
      ->where('booking_status', '!=', 2)
      ->whereNotNull('reserved_dates_info')
      ->when($bookingId, function ($query) use ($bookingId) {
        $query->where('id', '!=', $bookingId); // exclude current booking if editing
      })
      ->get(['reserved_dates_info']);

    $bookedRoomsByDate = [];

    foreach ($roomBookings as $booking) {
      $reserved = is_string($booking->reserved_dates_info)
        ? json_decode($booking->reserved_dates_info, true)
        : $booking->reserved_dates_info;

      foreach ($reserved as $entry) {
        $date = $entry['date'];
        $roomNumber = $entry['room_number'];
        $bookedRoomsByDate[$date][] = $roomNumber;
      }
    }

    // Step 2: Build daily room status for calendar view
    $dates = [];
    $tempStart = $start->copy();

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $rooms = $allRooms->map(function ($room) use ($bookedRoomNumbers, $roomRent) {
        return [
          'id' => $room->id,
          'room_number' => $room->room_number,
          'status' => in_array($room->room_number, $bookedRoomNumbers) ? 'booked' : 'available',
          'rent' => $roomRent,
        ];
      })->values()->toArray();

      $dates[] = [
        'date' => $dateStr,
        'rooms' => $rooms,
      ];

      $tempStart->addDay();
    }

    // Step 2b: Check for any date with insufficient available rooms
    $tempStart = $start->copy();
    $insufficientDate = null;

    while ($tempStart->lte($end)) {
      $dateStr = $tempStart->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      $availableCount = $allRooms->filter(function ($room) use ($bookedRoomNumbers) {
        return !in_array($room->room_number, $bookedRoomNumbers);
      })->count();

      if ($availableCount < $maxRoomsPerDay) {
        $insufficientDate = $dateStr;
        break; // stop checking after first insufficient date
      }

      $tempStart->addDay();
    }

    // Step 3: Build a suggested list of rooms available across the full interval
    $roomSummary = [];
    $dailySummaryCounter = [];
    $loopDate = $start->copy();

    while ($loopDate->lte($end)) {
      $dateStr = $loopDate->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];

      foreach ($allRooms as $room) {
        $roomKey = $room->room_number;

        // Skip room if already assigned for enough days
        if (isset($roomSummary[$roomKey]) && $roomSummary[$roomKey]['days'] >= $interval) {
          continue;
        }

        // Skip if already booked for this date
        if (in_array($roomKey, $bookedRoomNumbers)) {
          continue;
        }

        // Limit max number of rooms per day
        if (!isset($dailySummaryCounter[$dateStr])) {
          $dailySummaryCounter[$dateStr] = 0;
        }

        if ($dailySummaryCounter[$dateStr] >= $maxRoomsPerDay) {
          continue;
        }

        // Add room to the summary list
        if (!isset($roomSummary[$roomKey])) {
          $roomSummary[$roomKey] = [
            'room_number' => $room->room_number,
            'room_id' => $room->id,
            'rent' => $roomRent,
            'days' => 0,
          ];
        }

        $roomSummary[$roomKey]['days'] += 1;
        $dailySummaryCounter[$dateStr] += 1;
      }

      $loopDate->addDay();
    }

    // Prepare final list for room suggestion view
    $roomList = array_values($roomSummary);
    $dates2[] = [
      'rooms' => $roomList,
    ];
    // Render the booking availability view with all data
    return view('vendors.rooms.booking.available-room', [
      'warning' => 'Updating the date will reset assigned rooms. Please reassign rooms for each date.',
      'dates' => $dates,
      'dates2' => $dates2,
      'totalRooms' => $request->totalRooms,
      'discount' => $request->discount,
      'bs' => $bs,
      'insufficientDate' => $insufficientDate,
      'dateStr' => $dateStr,
      'availableCount' => $availableCount,
    ])->render();
  }

  public function makeBooking(AdminRoomBookingRequest $request)
  {
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();

    $dateArray = explode(' ', $request->dates);

    $onlinePaymentGateway = [
      'PayPal',
      'Stripe',
      'Instamojo',
      'Paystack',
      'Flutterwave',
      'Razorpay',
      'MercadoPago',
      'Mollie',
      'Paytm',
      'Phonepe',
      'Xendit',
      'Perfect Money',
      'Myfatoorah',
      'Yoco',
      'Toyyibpay',
      'Paytabs',
      'Iyzico',
      'Midtrans',
      'Authorize.net',
    ];

    $gatewayType = in_array($request->payment_method, $onlinePaymentGateway) ? 'online' : 'offline';
    $roomCategory = Room::query()->findOrFail($request->room_category_id);

    $totalRooms = count($request->rooms);
    $total_rent = (float) $roomCategory->rent * (int) $totalRooms;
    $discount   = (float) ($request->discount ?? 0);
    $subtotal   = max(0, $total_rent - $discount);

    $tax_percentage = Basic::query()->select('tax')->first()->tax;
    $tax_amount = ($subtotal * $tax_percentage) / 100;
    $grand_total = $subtotal + $tax_amount;

    $payingAmount = 0.00;

    if ($request->payment_status == '1') {
      $payingAmount = (float) $grand_total;
    } elseif ($request->payment_status == '3') {
      $payingAmount = (float) ($request->paying_amount ?? 0);
      if ($payingAmount < 0) $payingAmount = 0;
      if ($payingAmount > (float) $grand_total) $payingAmount = (float) $grand_total;
    }

    $due = (float) $grand_total - (float) $payingAmount;
    if ($due < 0) $due = 0;

    $bookingInfo = RoomBooking::query()->create([
      'booking_number' => time(),
      'user_id' => null,
      'vendor_id' => $roomCategory->vendor_id,
      'customer_name' => $request->customer_name,
      'customer_email' => $request->customer_email,
      'customer_phone' => $request->customer_phone,
      'room_category_id' => $request->room_category_id,
      'arrival_date' => $dateArray[0],
      'departure_date' => $dateArray[2],
      'adult' => $request->adult,
      'child' => $request->child,
      'total_rent' => $total_rent,
      'service_charge' => 0.00,
      'subtotal' => $subtotal,
      'discount' => $request->discount,
      'tax_percentage' => $tax_percentage,
      'tax' => $tax_amount,
      'grand_total' => $grand_total,
      'paying_amount' => $payingAmount,
      'due' => $due,
      'currency_symbol' => $currencyInfo->base_currency_symbol,
      'currency_symbol_position' => $currencyInfo->base_currency_symbol_position,
      'currency_text' => $currencyInfo->base_currency_text,
      'currency_text_position' => $currencyInfo->base_currency_text_position,
      'payment_method' => $request->payment_method,
      'gateway_type' => $gatewayType,
      'reserved_dates_info' => $request->rooms,
      'total_rooms' => $request->total_rooms,
      'payment_status' => $request->payment_status,
      'booking_status' => $request->booking_status
    ]);

    // Invoice and email
    $invoice = $this->generateInvoice($bookingInfo);
    $bookingInfo->update(['invoice' => $invoice]);
    $this->sendMailForRoomBooking($bookingInfo);

    // ===============================
    // COMMISSION LOGIC (VENDOR MODEL)
    // ===============================

    $commissionPercent = Commission::value('room_booking_commission') ?? 0;
    $grandTotal = (float) $bookingInfo->grand_total;
    $paidAmount = (float) ($bookingInfo->paying_amount ?? 0);

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

    $thisPayToAdmin  = max(0, round($thisPayToAdmin, 2));
    $thisPayToVendor = max(0, round($thisPayToVendor, 2));
    $newAdminPaid    = max(0, round($newAdminPaid, 2));
    $newVendorPaid   = max(0, round($newVendorPaid, 2));

    $paymentStatus = ($paidAmount >= $grandTotal) ? 1 : 3;


    $bookingInfo->update([
      'commission_percentage' => $commissionPercent,
      'comission'             => $totalCommission,
      'received_amount'       => $thisPayToVendor,
      'admin_paid_commission' => $newAdminPaid,
      'admin_due_commission'  => $adminDueCommission,
      'vendor_paid_amount'    => $newVendorPaid,
      'vendor_due_amount'     => $vendorDueAmount,
      'payment_status'        => $paymentStatus,
    ]);

    $pre_balance = null;
    $after_balance = null;

    if ($thisPayToAdmin > 0 && $bookingInfo->vendor_id) {
      $vendor = Vendor::find($bookingInfo->vendor_id);
      if ($vendor) {
        $pre_balance = (float) $vendor->amount;
        $vendor->amount = (float) $vendor->amount - (float) $thisPayToAdmin;
        $vendor->save();
        $after_balance = (float) $vendor->amount;
      }
    }

    if ($thisPayToAdmin > 0 || $paidAmount > 0) {
      $earning = Earning::first();
      $earning->total_revenue = (float) $earning->total_revenue + (float) $paidAmount;
      $earning->total_earning = (float) $earning->total_earning + (float) $thisPayToAdmin;
      $earning->save();
    }

    store_transaction([
      'transcation_id' => time(),
      'booking_id' => $bookingInfo->id,
      'transcation_type' => 1,
      'user_id' => null,
      'vendor_id' => $bookingInfo->vendor_id,
      'payment_status' => $bookingInfo->payment_status,
      'payment_method' => $bookingInfo->payment_method,
      'grand_total' => $paidAmount,
      'commission' => $thisPayToAdmin,
      'pre_balance' => $pre_balance,
      'after_balance' => $after_balance,
      'gateway_type' => $bookingInfo->gateway_type,
      'currency_symbol' => $bookingInfo->currency_symbol,
      'currency_symbol_position' => $bookingInfo->currency_symbol_position,
    ]);


    session()->flash('success', 'Room has booked successfully.');
    return 'success';
  }


  public function sendMailForRoomBooking($bookingInfo)
  {
    // first get the mail template information from db
    $mailTemplate = MailTemplate::query()->where('mail_type', '=', 'room_booking')->first();
    $mailSubject = $mailTemplate->mail_subject;
    $mailBody = replaceBaseUrl($mailTemplate->mail_body, 'summernote');

    // second get the website title & mail's smtp information from db
    $info = DB::table('basic_settings')
      ->select('website_title', 'smtp_status', 'smtp_host', 'smtp_port', 'encryption', 'smtp_username', 'smtp_password', 'from_mail', 'from_name')
      ->first();

    // get the difference of two dates, date should be in 'YYYY-MM-DD' format
    $date1 = new DateTime($bookingInfo->arrival_date);
    $date2 = new DateTime($bookingInfo->departure_date);
    $interval = $date1->diff($date2, true);

    // get the room category name according to language
    $language = Language::query()->where('is_default', '=', 1)->first();

    $roomContent = RoomContent::query()->where('language_id', '=', $language->id)
      ->where('room_id', '=', $bookingInfo->room_category_id)
      ->first();

    $roomRent = ($bookingInfo->currency_text_position == 'left' ? $bookingInfo->currency_text . ' ' : '') . $bookingInfo->grand_total . ($bookingInfo->currency_text_position == 'right' ? ' ' . $bookingInfo->currency_text : '');

    // get the amenities of booked room
    $amenityIds = json_decode($roomContent->amenities);

    $amenityArray = [];

    foreach ($amenityIds as $id) {
      $amenity = RoomAmenity::query()->findOrFail($id);
      array_push($amenityArray, $amenity->name);
    }

    // now, convert amenity array into comma separated string
    $amenityString = implode(', ', $amenityArray);

    // replace template's curly-brace string with actual data
    $mailBody = str_replace('{customer_name}', $bookingInfo->customer_name, $mailBody);
    $mailBody = str_replace('{room_name}', $roomContent->title, $mailBody);
    $mailBody = str_replace('{room_rent}', $roomRent, $mailBody);
    $mailBody = str_replace('{booking_number}', $bookingInfo->booking_number, $mailBody);
    $mailBody = str_replace('{booking_date}', date_format($bookingInfo->created_at, 'F d, Y'), $mailBody);
    $mailBody = str_replace('{number_of_night}', $interval->days, $mailBody);
    $mailBody = str_replace('{website_title}', $info->website_title, $mailBody);
    $mailBody = str_replace('{check_in_date}', $bookingInfo->arrival_date, $mailBody);
    $mailBody = str_replace('{check_out_date}', $bookingInfo->departure_date, $mailBody);
    $mailBody = str_replace('{number_of_adults}', $bookingInfo->adult, $mailBody);
    $mailBody = str_replace('{number_of_child}', $bookingInfo->child, $mailBody);
    $mailBody = str_replace('{room_amenities}', $amenityString, $mailBody);

    // initialize a new mail
    $mail = new PHPMailer(true);

    // if smtp status == 1, then set some value for PHPMailer
    if ($info->smtp_status == 1) {
      $mail->isSMTP();
      $mail->Host       = $info->smtp_host;
      $mail->SMTPAuth   = true;
      $mail->Username   = $info->smtp_username;
      $mail->Password   = $info->smtp_password;

      if ($info->encryption == 'TLS') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      }

      $mail->Port       = $info->smtp_port;
    }

    // finally add other informations and send the mail
    try {
      // Recipients
      $mail->setFrom($info->from_mail, $info->from_name);
      $mail->addAddress($bookingInfo->customer_email);

      // Attachments (Invoice)
      $mail->addAttachment(public_path('assets/invoices/rooms/') . $bookingInfo->invoice);

      // Content
      $mail->isHTML(true);
      $mail->Subject = $mailSubject;
      $mail->Body    = $mailBody;

      $mail->send();

      return;
    } catch (Exception $e) {
      return;
    }
  }
}
