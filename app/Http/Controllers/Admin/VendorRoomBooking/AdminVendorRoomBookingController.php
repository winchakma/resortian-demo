<?php

namespace App\Http\Controllers\Admin\VendorRoomBooking;

use App\Http\Controllers\Controller;
use App\Http\Controllers\FrontEnd\Room\RoomBookingController;
use App\Http\Requests\AdminRoomBookingRequest;
use App\Models\BasicSettings\Basic;
use App\Models\BasicSettings\MailTemplate;
use App\Models\Commission;
use App\Models\Earning;
use App\Models\Language;
use App\Models\PaymentGateway\OfflineGateway;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\RoomManagement\PaidService;
use App\Models\RoomManagement\Refund;
use App\Models\RoomManagement\Room;
use App\Models\RoomManagement\RoomAmenity;
use App\Models\RoomManagement\RoomBooking;
use App\Models\RoomManagement\RoomContent;
use App\Models\RoomManagement\RoomNumber;
use App\Models\Vendor;
use App\Traits\MiscellaneousTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class AdminVendorRoomBookingController extends Controller
{
  private function vendorRoomBookingQuery()
  {
    return RoomBooking::query()->where('vendor_id', '!=', 0);
  }

  private function vendorRoomBookingOrFail($id)
  {
    return $this->vendorRoomBookingQuery()->findOrFail($id);
  }

  private function vendorRoomCategoryQuery()
  {
    return Room::query()->where('vendor_id', '!=', 0);
  }

  private function vendorRoomCategoryOrFail($id)
  {
    return $this->vendorRoomCategoryQuery()->findOrFail($id);
  }

  public function index(Request $request)
  {
    $booking_number = $booking_status = $status = $keyword = $vendorId = null;

    if ($request->filled('booking_no')) {
      $booking_number = $request['booking_no'];
    }
    if ($request->filled('status')) {
      $status = $request['status'];
    }
    if ($request->filled('keyword')) {
      $keyword = $request['keyword'];
    }
    if ($request->filled('vendor_id')) {
      $vendorId = (int) $request['vendor_id'];
    }

    if (URL::current() == Route::is('admin.vendor_room_bookings.approved_bookings')) {
      $booking_status = "approved";
    } else if (URL::current() == Route::is('admin.vendor_room_bookings.pending_bookings')) {

      $booking_status = "pending";
    } else if (URL::current() == Route::is('admin.vendor_room_bookings.canceled_bookings')) {

      $booking_status = "canceled";
    }

    $information['bookings'] = RoomBooking::where('vendor_id', '!=', 0)
      ->with(['vendor:id,username'])
      ->when($booking_number, function ($query, $booking_number) {
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
      ->when($vendorId, function ($query, $vendorId) {
        return $query->where('vendor_id', $vendorId);
      })
      ->orderBy('id', 'desc')
      ->paginate(10);


    $language = Language::query()->where('is_default', '=', 1)->first();

    $information['roomInfos'] = $language->roomDetails()->whereHas('room', function (Builder $query) {
      $query->where('status', '=', 1);
      $query->where('vendor_id', '!=', 0);
    })
      ->select('room_id', 'title')
      ->orderBy('title', 'ASC')
      ->get();
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();
    $information['defaultLanguageCode'] = $language->code ?? 'en';
    $information['vendors'] = Vendor::query()
      ->where('status', 1)
      ->orderBy('username', 'asc')
      ->get(['id', 'username']);

    return view('admin.rooms.vendor_booking.index', $information);
  }


  public function updatePaymentStatus(Request $request)
  {
    $bookingInfo = $this->vendorRoomBookingOrFail($request->booking_id);

    // If user submitted 'Paid' status
    if ($request->payment_status == 1) {

      if ($bookingInfo->due > 0) {
        $bookingInfo->update(['payment_status' => 3]); // partial
      } else {
        $bookingInfo->update(['payment_status' => 1]); // full
      }

      $roomBooking = new RoomBookingController();

      $room = $this->vendorRoomCategoryQuery()->find($bookingInfo->room_category_id);

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
      }
    } elseif ($request->payment_status == 2) {
      $bookingInfo->paying_amount = 0.00;
      $bookingInfo->due =  $bookingInfo->grand_total;
      $bookingInfo->payment_status = $request->payment_status;
    }

    $bookingInfo->save();

    // delete previous invoice from local storage
    if (
      !is_null($bookingInfo->invoice) &&
      file_exists(public_path('assets/invoices/rooms/') . $bookingInfo->invoice)
    ) {
      unlink(public_path('assets/invoices/rooms/') . $bookingInfo->invoice);
    }

    // then, generate an invoice in pdf format
    $invoice = $this->generateInvoice($bookingInfo);

    // update the invoice field information in database
    $bookingInfo->update(['invoice' => $invoice]);

    // finally, send a mail to the customer with the invoice
    $this->sendMailForPaymentStatus($bookingInfo, $request->payment_status);

    session()->flash('success', 'Payment status updated successfully!');

    return redirect()->back();
  }
  public function updatePartialAmount(Request $request)
  {
    $booking = $this->vendorRoomBookingOrFail($request->booking_id);

    $payingNow = (float) $request->paying_amount;

    if ($payingNow <= 0) {
      session()->flash('warning', 'Paying amount must be greater than zero.');
      return redirect()->back();
    }

    if ($payingNow > $booking->due) {
      session()->flash('warning', 'Paying amount cannot exceed due amount.');
      return redirect()->back();
    }

    // ===============================
    // Update basic payment info
    // ===============================
    $booking->paying_amount += $payingNow;
    $booking->due -= $payingNow;

    if ($booking->due <= 0) {
      $booking->payment_status = 1; // fully paid
    } else {
      $booking->payment_status = 3; // partial paid
    }

    $booking->save();

    // ===============================
    // COMMISSION FIRST LOGIC
    // ===============================
    $room = $this->vendorRoomCategoryQuery()->find($booking->room_category_id);
    $vendor_id = ($room && $room->vendor_id != 0) ? $room->vendor_id : 0;
    $vendor = $vendor_id ? Vendor::find($vendor_id) : null;

    $commissionPercent = $booking->commission_percentage;
    $grandTotal        = (float) $booking->grand_total;
    $paidAmount        = $payingNow;

    // Admin room: no commission
    if ($vendor_id == 0) {

      $earning = Earning::first();
      $earning->total_revenue += $paidAmount;
      $earning->total_earning += $paidAmount;
      $earning->save();

      store_transaction([
        'transcation_id' => time(),
        'booking_id' => $booking->id,
        'transcation_type' => 1,
        'user_id' => null,
        'vendor_id' => 0,
        'payment_status' => 1,
        'payment_method' => $booking->payment_method,
        'grand_total' => $paidAmount,
        'commission' => 0,
        'pre_balance' => null,
        'after_balance' => null,
        'gateway_type' => $booking->gateway_type,
        'currency_symbol' => $booking->currency_symbol,
        'currency_symbol_position' => $booking->currency_symbol_position,
      ]);

      session()->flash('success', 'Payment updated successfully!');
      return redirect()->back();
    }

    // ===============================
    // Vendor room commission-first
    // ===============================
    $totalCommission = (float) $booking->comission;

    $alreadyPaidCommission = (float) $booking->admin_paid_commission;
    $remainingCommission   = max(0, $totalCommission - $alreadyPaidCommission);

    $adminPaidCommission = 0;
    $vendorPaidAmount    = 0;

    if ($paidAmount <= $remainingCommission) {
      $adminPaidCommission = $paidAmount;
      $vendorPaidAmount = 0;
    } else {
      $adminPaidCommission = $remainingCommission;
      $vendorPaidAmount = $paidAmount - $remainingCommission;
    }

    // update booking accounting
    $booking->admin_paid_commission += $adminPaidCommission;
    $booking->admin_due_commission  -= $adminPaidCommission;

    $booking->vendor_paid_amount += $vendorPaidAmount;
    $booking->vendor_due_amount  -= $vendorPaidAmount;

    $booking->received_amount += $vendorPaidAmount;
    $booking->save();

    // update vendor balance
    $pre_balance = $vendor->amount;
    $vendor->amount += $vendorPaidAmount;
    $vendor->save();
    $after_balance = $vendor->amount;

    // admin earning
    $earning = Earning::first();
    $earning->total_revenue += $paidAmount;
    $earning->total_earning += $adminPaidCommission;
    $earning->save();

    // transaction log
    store_transaction([
      'transcation_id' => time(),
      'booking_id' => $booking->id,
      'transcation_type' => 1,
      'user_id' => null,
      'vendor_id' => $vendor_id,
      'payment_status' => 1,
      'payment_method' => $booking->payment_method,
      'grand_total' => $paidAmount,
      'commission' => $adminPaidCommission,
      'pre_balance' => $pre_balance,
      'after_balance' => $after_balance,
      'gateway_type' => $booking->gateway_type,
      'currency_symbol' => $booking->currency_symbol,
      'currency_symbol_position' => $booking->currency_symbol_position,
    ]);

    // regenerate invoice
    $this->generateInvoice($booking);

    session()->flash('success', 'Partial payment processed successfully!');
    return redirect()->back();
  }

  public function updateStayStatus(Request $request)
  {
    $roomBooking = $this->vendorRoomBookingOrFail($request->booking_id);

    $roomBooking->stay_status = $request->stay_status;

    $roomBooking->save();

    session()->flash('success', 'Stay status updated successfully!');

    return redirect()->back();
  }
  public function updateBookingStatus(Request $request)
  {
    $roomBooking = $this->vendorRoomBookingOrFail($request->booking_id);

    $roomBooking->update(['booking_status' => $request->booking_status]);

    session()->flash('success', 'Booking status updated successfully!');

    return redirect()->back();
  }
  public function makeRefund(Request $request)
  {
    $request->validate([
      'booking_id'    => 'required|integer',
      'refund_amount' => 'required|numeric',
      'refund_reason' => 'nullable|string|max:1000',
    ]);

    $roomBooking = $this->vendorRoomBookingOrFail($request->booking_id);

    // prevent duplicate refund
    if (Refund::where('booking_id', $roomBooking->id)->exists()) {
      return back()->with('error', 'Refund request already exists for this booking.');
    }

    // paid amount
    $paidAmount = 0.0;
    if (in_array((int)$roomBooking->payment_status, [1, 3], true)) {
      $paidAmount = (float) ($roomBooking->paying_amount ?? 0);
    }

    $refundAmount = round((float) $request->refund_amount, 2);

    if ($refundAmount > $paidAmount) {
      return back()->with('error', 'Refund amount cannot be greater than the paid amount.');
    }

    // cancel booking if not already
    if ((int)$roomBooking->booking_status !== 2) {
      $roomBooking->update(['booking_status' => 2]);
    }

    DB::transaction(function () use ($roomBooking, $refundAmount, $paidAmount, $request) {

      $vendorPaid = round((float) ($roomBooking->vendor_paid_amount ?? 0), 2);
      $adminPaid  = round((float) ($roomBooking->admin_paid_commission ?? 0), 2);

      // Step 1: take from vendor first
      $fromVendor = min($refundAmount, $vendorPaid);
      $remaining  = round($refundAmount - $fromVendor, 2);

      // Step 2: take remaining from admin
      $fromAdmin  = min($remaining, $adminPaid);
      $remaining  = round($remaining - $fromAdmin, 2);

      if ($remaining > 0) {
        throw new \Exception('Refund exceeds distributed amounts.');
      }

      // vendor wallet reverse
      if ((int)$roomBooking->vendor_id !== 0 && $fromVendor > 0) {
        $vendor = Vendor::find($roomBooking->vendor_id);
        if ($vendor) {
          $vendor->amount = max(0, round(((float)$vendor->amount - $fromVendor), 2));
          $vendor->save();
        }
      }

      // update booking money fields
      $roomBooking->vendor_paid_amount    = round($vendorPaid - $fromVendor, 2);
      $roomBooking->admin_paid_commission = round($adminPaid - $fromAdmin, 2);

      $roomBooking->paying_amount = max(0, round(((float)$roomBooking->paying_amount - $refundAmount), 2));
      $roomBooking->due = max(0, round(((float)$roomBooking->grand_total - $roomBooking->paying_amount), 2));

      $roomBooking->save();

      // update platform earnings
      $earning = Earning::first();
      if ($earning) {
        $earning->total_revenue = max(0, round(((float)$earning->total_revenue - $refundAmount), 2));
        $earning->total_earning = max(0, round(((float)$earning->total_earning - $fromAdmin), 2));
        $earning->save();
      }

      // create refund row (admin initiated, already refunded)
      Refund::create([
        'booking_id'     => $roomBooking->id,
        'vendor_id'      => $roomBooking->vendor_id,
        'customer_name'  => $roomBooking->customer_name,
        'customer_email' => $roomBooking->customer_email,
        'customer_phone' => $roomBooking->customer_phone,
        'paying_amount'  => $paidAmount,
        'refund_amount'  => $refundAmount,
        'refund_reason'  => $request->refund_reason ?? null,
        'status'         => 4,          // Admin Approved / Refunded
        'request_from'   => 'admin',
      ]);
    });

    return back()->with('success', 'Booking cancelled and refund processed successfully.');
  }


  public function refunds(Request $request)
  {
    $vendorId = null;

    if ($request->filled('vendor_id')) {
      $vendorId = (int) $request->vendor_id;
    }

    $information['refunds'] = Refund::query()
      ->where('vendor_id', '!=', 0)
      ->whereIn('status', [1, 4, 5])
      ->when($vendorId, function ($query, $vendorId) {
        return $query->where('vendor_id', $vendorId);
      })
      ->orderBy('id', 'desc')
      ->paginate(10);

    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();
    $information['vendors'] = Vendor::query()
      ->orderBy('username', 'asc')
      ->get(['id', 'username']);
    $information['vendorNames'] = $information['vendors']->pluck('username', 'id');
    $information['defaultLanguageCode'] = Language::query()
      ->where('is_default', 1)
      ->value('code') ?? 'en';

    return view('admin.rooms.vendor_booking.refunds', $information);
  }

  public function updateRefundStatus(Request $request)
  {
    $request->validate([
      'refund_id' => 'required|integer',
      'status'    => 'required',
    ]);

    $refund = Refund::query()->where('vendor_id', '!=', 0)->findOrFail($request->refund_id);

    $newStatus = (int) $request->status;

    $vendorId = (int) ($refund->vendor_id ?? 0);
    $currentStatus = (int) $refund->status;


    // update refund status
    $refund->status = $newStatus;
    $refund->save();

    // booking (optional, but useful)
    $booking = $this->vendorRoomBookingQuery()->find($refund->booking_id);

    //If admin approved refund
    if ($newStatus === 4) {
      $booking = $this->vendorRoomBookingOrFail($refund->booking_id);

      $refundAmount = round((float) $refund->refund_amount, 2);

      // safety: cannot refund more than actually paid
      $paidAmount = round((float) ($booking->paying_amount ?? 0), 2);
      if ($refundAmount <= 0) {
        return back()->with('error', 'Invalid refund amount.');
      }
      if ($refundAmount > $paidAmount) {
        return back()->with('error', 'Refund amount cannot be greater than paid amount.');
      }

      DB::transaction(function () use ($refund, $booking, $refundAmount) {

        $vendorPaid = round((float) ($booking->vendor_paid_amount ?? 0), 2);
        $adminPaid  = round((float) ($booking->admin_paid_commission ?? 0), 2);

        // 1) take from vendor first
        $takeFromVendor = min($refundAmount, $vendorPaid);
        $remaining      = round($refundAmount - $takeFromVendor, 2);

        // 2) then take remaining from admin commission
        $takeFromAdmin  = min($remaining, $adminPaid);
        $remaining      = round($remaining - $takeFromAdmin, 2);

        // If still remaining, something inconsistent (refunding more than distributed)
        if ($remaining > 0.00001) {
          throw new \Exception('Refund exceeds distributed amounts (vendor/admin).');
        }

        // Update vendor wallet/balance if vendor exists
        if ((int) $booking->vendor_id !== 0 && $takeFromVendor > 0) {
          $vendor = Vendor::find($booking->vendor_id);
          if ($vendor) {
            $vendor->amount = round(((float) $vendor->amount - $takeFromVendor), 2);
            if ($vendor->amount < 0) $vendor->amount = 0; // optional safeguard
            $vendor->save();
          }
        }

        // Update booking distributed amounts (reverse distribution)
        $booking->vendor_paid_amount    = round($vendorPaid - $takeFromVendor, 2);
        $booking->admin_paid_commission = round($adminPaid - $takeFromAdmin, 2);

        // Also reduce paying_amount because customer got money back
        $booking->paying_amount = round(((float) $booking->paying_amount - $refundAmount), 2);
        if ($booking->paying_amount < 0) $booking->paying_amount = 0;

        // Optional: due recalculation (if you want consistency)
        $grandTotal = round((float) ($booking->grand_total ?? 0), 2);
        $booking->due = max(0, round($grandTotal - (float)$booking->paying_amount, 2));

        $booking->save();

        // Update earnings (recommended)
        $earning = Earning::first();
        if ($earning) {
          $earning->total_revenue = round(((float)$earning->total_revenue - $refundAmount), 2);
          $earning->total_earning = round(((float)$earning->total_earning - $takeFromAdmin), 2);
          if ($earning->total_revenue < 0) $earning->total_revenue = 0;
          if ($earning->total_earning < 0) $earning->total_earning = 0;
          $earning->save();
        }

        // Mark refund as refunded (admin approved)
        $refund->status = 4;
        $refund->save();
      });

      session()->flash('success', 'Refund approved successfully!');
      return redirect()->back();
    }

    session()->flash('success', 'Refund rejected successfully!');
    return redirect()->back();
  }

  public function deleteRefund(Request $request)
  {
    Refund::query()->where('vendor_id', '!=', 0)->findOrFail($request->refund_id)->delete();

    session()->flash('success', 'Refund deleted successfully!');

    return redirect()->back();
  }

  public function disputes(Request $request)
  {
    $vendorId = null;

    if ($request->filled('vendor_id')) {
      $vendorId = (int) $request->vendor_id;
    }

    $information['refunds'] = Refund::query()
      ->where('vendor_id', '!=', 0)
      ->where('status', 3)   // 3 = Dispute Raised (Waiting Admin)
      ->when($vendorId, function ($query, $vendorId) {
        return $query->where('vendor_id', $vendorId);
      })
      ->orderBy('id', 'desc')
      ->paginate(10);

    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();
    $information['vendors'] = Vendor::query()
      ->orderBy('username', 'asc')
      ->get(['id', 'username']);
    $information['vendorNames'] = $information['vendors']->pluck('username', 'id');
    $information['defaultLanguageCode'] = Language::query()
      ->where('is_default', 1)
      ->value('code') ?? 'en';

    return view('admin.rooms.vendor_booking.disputes', $information);
  }


  public function editBooking($id)
  {
    $details = $this->vendorRoomBookingOrFail($id);
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

    $roomCategory = $this->vendorRoomCategoryOrFail($details->room_category_id);
    $roomRent = $roomCategory->rent;

    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    $allRooms = RoomNumber::where('room_category_id', $details->room_category_id)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers by date
    $roomBookings = RoomBooking::where('vendor_id', '!=', 0)->where('room_category_id', $details->room_category_id)
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
    $information['discount']  = $details->discount;
    $information['bs']  = $bs;
    $information['insufficientDate']  = $insufficientDate;
    $information['dateStr']  = $dateStr;
    $information['availableCount']  = $availableCount;

    return view('admin.rooms.vendor_booking.edit', $information);
  }

  public function updateBooking(AdminRoomBookingRequest $request)
  {

    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    $dateArray = explode(' ', $request->dates);

    $onlineGateways = [
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
    $gatewayType = in_array($request->payment_method, $onlineGateways) ? 'online' : 'offline';

    // Calculate rent
    $roomCategory = $this->vendorRoomCategoryOrFail($request->room_category_id);
    $totalRooms = count($request->rooms);
    $totalRent  = (float) $roomCategory->rent * $totalRooms;

    // Discount + Tax
    $discount = (float) ($request->discount ?? 0);
    $subtotal = max(0, $totalRent - $discount);

    $taxPercent = (float) Basic::query()->value('tax');
    $taxAmount  = ($subtotal * $taxPercent) / 100;
    $grandTotal = $subtotal + $taxAmount;

    // Determine paying amount from request
    $payingAmount = 0;
    if ((int)$request->payment_status === 1) {
      $payingAmount = $grandTotal;
    } elseif ((int)$request->payment_status === 3) {
      $payingAmount = min(max((float)$request->paying_amount, 0), $grandTotal);
    }

    $due = max(0, $grandTotal - $payingAmount);

    $bookingInfo = $this->vendorRoomBookingOrFail($request->booking_id);

    DB::beginTransaction();

    try {
      // Hard safety: cannot reduce grand total below already paid amount
      $oldPaying = round((float)$bookingInfo->paying_amount, 2);
      if (round($grandTotal, 2) < $oldPaying) {
        DB::rollBack();
        session()->flash('warning', 'Grand total cannot be less than already paid amount. Refund/adjustment required.');
        return 'success';
      }

      // Basic update
      $bookingInfo->update([
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
        'booking_status' => $request->booking_status,
      ]);

      $bookingInfo->refresh();

      // Detect vendor
      $room = $this->vendorRoomCategoryQuery()->find($request->room_category_id);
      $vendor_id = ($room && (int)$room->vendor_id !== 0) ? (int)$room->vendor_id : 0;
      $vendor = $vendor_id ? Vendor::query()->find($vendor_id) : null;

      // Already allocated buckets
      $alreadyAdminPaid  = round((float) $bookingInfo->admin_paid_commission, 2);
      $alreadyVendorPaid = round((float) $bookingInfo->vendor_paid_amount, 2);
      $alreadyAllocated  = round($alreadyAdminPaid + $alreadyVendorPaid, 2);

      // Admin room
      if ($vendor_id == 0) {

        $newPayingTotal = round((float) $bookingInfo->paying_amount, 2);
        $oldPaying      = round((float) $oldPaying, 2);
        $paymentDelta   = round($newPayingTotal - $oldPaying, 2);

        if ($paymentDelta < 0) {
          DB::rollBack();
          session()->flash('warning', 'Paying amount cannot be reduced without refund.');
          return 'success';
        }

        $adminPaidCommission = $newPayingTotal;
        $adminDueCommission  = max(0, round($grandTotal - $newPayingTotal, 2));

        $invoice = $this->generateInvoice($bookingInfo);

        $bookingInfo->update([
          'invoice'                => $invoice,
          'commission_percentage'  => 100,
          'comission'              => round($grandTotal, 2),
          'admin_paid_commission'  => round($adminPaidCommission, 2),
          'admin_due_commission'   => round($adminDueCommission, 2),
          'vendor_paid_amount'     => 0,
          'vendor_due_amount'      => 0,
          'received_amount'        => 0,
          'due'                    => max(0, round($grandTotal - $newPayingTotal, 2)),
          'payment_status'         => ($newPayingTotal <= 0 ? 0 : ($newPayingTotal >= $grandTotal ? 1 : 3)),
        ]);

        if ($paymentDelta > 0) {
          $earning = Earning::query()->first();
          if ($earning) {
            $earning->total_revenue = (float) $earning->total_revenue + (float) $paymentDelta;
            $earning->total_earning = (float) $earning->total_earning + (float) $paymentDelta;
            $earning->save();
          }

          store_transaction([
            'transcation_id' => time(),
            'booking_id' => $bookingInfo->id,
            'transcation_type' => 6,
            'user_id' => null,
            'vendor_id' => 0,
            'payment_status' => $bookingInfo->payment_status,
            'payment_method' => $bookingInfo->payment_method,
            'grand_total' => $paymentDelta,
            'commission' => $paymentDelta,
            'pre_balance' => null,
            'after_balance' => null,
            'gateway_type' => $bookingInfo->gateway_type,
            'currency_symbol' => $bookingInfo->currency_symbol,
            'currency_symbol_position' => $bookingInfo->currency_symbol_position,
          ]);
        }

        DB::commit();
        session()->flash('success', 'Booking information has updated.');
        return 'success';
      }


      // Commission recalculation
      $commissionRate = (float) Commission::query()->value('room_booking_commission');
      $newTotalCommission = round(($grandTotal * $commissionRate) / 100, 2);
      $newVendorTotal     = round($grandTotal - $newTotalCommission, 2);

      $newPayingTotal = round((float) $bookingInfo->paying_amount, 2);

      // Prevent reducing paid amount below allocated
      if ($newPayingTotal < $alreadyAllocated) {
        DB::rollBack();
        session()->flash('warning', 'Paying amount cannot be reduced without refund.');
        return 'success';
      }

      // Target allocation (commission-first)
      $targetAdminPaid  = round(min($newPayingTotal, $newTotalCommission), 2);
      $targetVendorPaid = round(max(0, $newPayingTotal - $newTotalCommission), 2);

      if ($targetVendorPaid > $newVendorTotal || $targetAdminPaid > $newTotalCommission) {
        DB::rollBack();
        session()->flash('warning', 'Invalid allocation after recalculation.');
        return 'success';
      }

      // Deltas
      $deltaAdmin   = round($targetAdminPaid - $alreadyAdminPaid, 2);        // can be +/-
      $deltaVendor  = round($targetVendorPaid - $alreadyVendorPaid, 2);      // can be +/-
      $paymentDelta = round($newPayingTotal - $alreadyAllocated, 2);         // >=0 always

      $preBalance = null;
      $afterBalance = null;

      $shiftType = null;
      $shiftAmount = 0;

      if ($paymentDelta == 0) {
        // must be exact opposite deltas
        if (round($deltaAdmin + $deltaVendor, 2) !== 0.00) {
          DB::rollBack();
          session()->flash('warning', 'Refund or adjustment required.');
          return 'success';
        }

        if ($deltaAdmin > 0 && $deltaVendor < 0) {
          $shiftType = 'VENDOR_TO_ADMIN';
          $shiftAmount = round($deltaAdmin, 2);

          $vendor->refresh();
          $preBalance = (float) $vendor->amount;

          // cannot claw back more than vendor wallet balance
          if ($preBalance < $shiftAmount) {
            DB::rollBack();
            session()->flash('warning', 'Vendor wallet balance is insufficient for commission adjustment.');
            return 'success';
          }

          $vendor->amount = $preBalance - $shiftAmount;
          $vendor->save();
          $afterBalance = (float) $vendor->amount;

          $earning = Earning::query()->first();
          if ($earning) {
            $earning->total_earning = (float) $earning->total_earning + $shiftAmount;
            $earning->save();
          }
        } elseif ($deltaAdmin < 0 && $deltaVendor > 0) {
          $shiftType = 'ADMIN_TO_VENDOR';
          $shiftAmount = round(abs($deltaAdmin), 2);

          // vendor wallet increases (admin commission reduced means vendor share increases)
          $vendor->refresh();
          $preBalance = (float) $vendor->amount;

          $vendor->amount = $preBalance + $shiftAmount;
          $vendor->save();
          $afterBalance = (float) $vendor->amount;

          // admin earning decreases because commission reduced
          $earning = Earning::query()->first();
          if ($earning) {
            $earning->total_earning = (float) $earning->total_earning - $shiftAmount;
            if ($earning->total_earning < 0) {
              $earning->total_earning = 0; // safety clamp
            }
            $earning->save();
          }
        } else {
          // no shift needed (totals changed but allocation doesn't change)
          // ok
        }
      }


      if ($paymentDelta > 0) {
        if ($deltaVendor < 0) {
          DB::rollBack();
          session()->flash('warning', 'Invalid vendor allocation on new payment. Adjustment required.');
          return 'success';
        }

        $vendor->refresh();
        $preBalance = (float) $vendor->amount;
        $vendor->amount = $preBalance + $deltaVendor;
        $vendor->save();
        $afterBalance = (float) $vendor->amount;

        $earning = Earning::query()->first();
        if ($earning) {
          $earning->total_revenue = (float) $earning->total_revenue + $paymentDelta;
          if ($deltaAdmin > 0) {
            $earning->total_earning = (float) $earning->total_earning + $deltaAdmin;
          }
          $earning->save();
        }
      }

      // Recalculate dues
      $adminDue  = max(0, round($newTotalCommission - $targetAdminPaid, 2));
      $vendorDue = max(0, round($newVendorTotal - $targetVendorPaid, 2));
      $finalDue  = max(0, round($grandTotal - $newPayingTotal, 2));

      // Payment status sync
      $finalPaymentStatus = $bookingInfo->payment_status;
      if ($newPayingTotal <= 0) {
        $finalPaymentStatus = 0;
      } elseif ($finalDue <= 0) {
        $finalPaymentStatus = 1;
      } else {
        $finalPaymentStatus = 3;
      }

      // Update booking accounting fields
      $bookingInfo->update([
        'commission_percentage' => $commissionRate,
        'comission' => $newTotalCommission,
        'admin_paid_commission' => $targetAdminPaid,
        'admin_due_commission' => $adminDue,
        'vendor_paid_amount' => $targetVendorPaid,
        'vendor_due_amount' => $vendorDue,
        'received_amount' => $targetVendorPaid,
        'due' => $finalDue,
        'payment_status' => $finalPaymentStatus,
      ]);

      // Invoice regenerate
      $bookingInfo->refresh();
      $invoice = $this->generateInvoice($bookingInfo);
      $bookingInfo->update(['invoice' => $invoice]);

      // Transaction log
      $shouldLog = ($paymentDelta > 0) || ($paymentDelta == 0 && $shiftAmount > 0);
      if ($shouldLog) {
        store_transaction([
          'transcation_id' => time(),
          'booking_id' => $bookingInfo->id,
          'transcation_type' => 6,
          'user_id' => null,
          'vendor_id' => $vendor_id,
          'payment_status' => $bookingInfo->payment_status,
          'payment_method' => $bookingInfo->payment_method,
          'grand_total' => $paymentDelta > 0 ? $paymentDelta : 0,
          'commission' => $paymentDelta > 0 ? max(0, $deltaAdmin) : $shiftAmount, // shift logs as commission adjustment
          'pre_balance' => $preBalance,
          'after_balance' => $afterBalance,
          'gateway_type' => $bookingInfo->gateway_type,
          'currency_symbol' => $bookingInfo->currency_symbol,
          'currency_symbol_position' => $bookingInfo->currency_symbol_position,
        ]);
      }

      DB::commit();
      session()->flash('success', 'Booking information has updated.');
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
    $details = $this->vendorRoomBookingOrFail($id);
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

    $roomCategory = $this->vendorRoomCategoryOrFail($details->room_category_id);
    $roomRent = $roomCategory->rent;

    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    $allRooms = RoomNumber::where('room_category_id', $details->room_category_id)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers by date
    $roomBookings = RoomBooking::where('vendor_id', '!=', 0)->where('room_category_id', $details->room_category_id)
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

    return view('admin.rooms.vendor_booking.details', $information);
  }
  public function paidServices($id)
  {
    $currencyInfo = MiscellaneousTrait::getCurrencyInfo();
    $details = $this->vendorRoomBookingOrFail($id);
    $information['currencyInfo'] = $currencyInfo;
    $information['id'] = $id;
    $information['roomDates'] = $details->reserved_dates_info;
    $information['paidServices'] = $details->paid_services;
    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    $information['services'] = PaidService::query()
      ->where('status', '=', 1)
      ->where('vendor_id', '=', $details->vendor_id)
      ->orderBy('id', 'asc')
      ->get();

    return view('admin.rooms.vendor_booking.paid-services', $information);
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

    $booking = $this->vendorRoomBookingOrFail($request->booking_id);

    // safe array
    $services = is_array($booking->paid_services) ? $booking->paid_services : [];

    $newId = collect($services)->max('id') + 1;

    // ALWAYS UNPAID
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
    $roomBooking = $this->vendorRoomBookingOrFail($request->booking_id);

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
    $roomBooking = $this->vendorRoomBookingOrFail($id);

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
      $roomBooking = $this->vendorRoomBookingOrFail($id);

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
    $quantity = $this->vendorRoomCategoryOrFail($id)->quantity;

    $bookings = RoomBooking::query()->where('vendor_id', '!=', 0)->where('room_category_id', '=', $id)
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
      $booking = $this->vendorRoomBookingOrFail($bookingId);
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
      'success' => route('admin.vendor_room_bookings.booking_form', [
        'room_category_id' => $roomId,
        'dates' => $dates
      ])

    ]);
  }

  public function bookingForm(Request $request)
  {
    $information['datesC'] = $request->dates;
    [$startDate, $endDate] = explode(' - ', $request->dates);
    $start = \Carbon\Carbon::parse($startDate);
    $end = \Carbon\Carbon::parse($endDate)->subDay();
    $interval = $start->diffInDays($end) + 1;


    $id = $request['room_category_id'];
    $information['id'] = $id;

    $room = $this->vendorRoomCategoryOrFail($id);
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

    $roomCategory = $this->vendorRoomCategoryOrFail($request->room_category_id);
    $roomRent = $roomCategory->rent;

    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    $allRooms = RoomNumber::where('room_category_id', $request->room_category_id)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers by date
    $roomBookings = RoomBooking::where('vendor_id', '!=', 0)->where('room_category_id', $request->room_category_id)
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
    $tempStart = $start->copy(); // reset again
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

    return view('admin.rooms.vendor_booking.booking-form', $information);
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
    $roomCategory = $this->vendorRoomCategoryOrFail($request->roomCategoryId);
    $roomRent = $roomCategory->rent;

    // Get basic settings like tax and currency format
    $bs = Basic::select('tax', 'base_currency_text', 'base_currency_symbol_position')->first();

    // Get all active rooms for the given category
    $allRooms = RoomNumber::where('room_category_id', $request->roomCategoryId)
      ->where('status', 1)
      ->get(['id', 'room_number']);

    // Step 1: Load all booked room numbers and group them by date
    $roomBookings = RoomBooking::where('vendor_id', '!=', 0)->where('room_category_id', $request->roomCategoryId)
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
    return view('admin.rooms.vendor_booking.available-room', [
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
    $roomCategory = $this->vendorRoomCategoryOrFail($request->room_category_id);

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

      if ($payingAmount < 0) {
        $payingAmount = 0;
      }
      if ($payingAmount > (float) $grand_total) {
        $payingAmount = (float) $grand_total;
      }
    }

    $due = (float) $grand_total - (float) $payingAmount;
    if ($due < 0) {
      $due = 0;
    }

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

    // Vendor setup
    $room = $this->vendorRoomCategoryQuery()->find($bookingInfo->room_category_id);

    $vendor_id = ($room && $room->vendor_id != 0) ? $room->vendor_id : 0;
    $vendor    = $vendor_id ? Vendor::find($vendor_id) : null;

    $commissionPercent = Commission::value('room_booking_commission') ?? 0;

    $grandTotal = (float) $bookingInfo->grand_total;
    $paidAmount = (float) ($bookingInfo->paying_amount ?? 0);

    // Admin room case
    if ($vendor_id == 0) {

      $grandTotal = (float) $bookingInfo->grand_total;
      $paidAmount = (float) ($bookingInfo->paying_amount ?? 0);

      $adminPaidCommission = $paidAmount;
      $adminDueCommission  = max(0, $grandTotal - $paidAmount);

      $bookingInfo->update([
        'commission_percentage' => 100,
        'comission'             => $grandTotal,
        'received_amount'       => 0,
        'admin_paid_commission' => $adminPaidCommission,
        'admin_due_commission'  => $adminDueCommission,
        'vendor_paid_amount'    => 0,
        'vendor_due_amount'     => 0,
      ]);

      $earning = Earning::first();
      $earning->total_revenue += $paidAmount;
      $earning->total_earning += $adminPaidCommission;
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

      return;
    }

    // Vendor room commission-first
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

    $bookingInfo->update([
      'commission_percentage' => $commissionPercent,
      'comission'             => $totalCommission,
      'received_amount'       => $thisPayToVendor,
      'admin_paid_commission' => $newAdminPaid,
      'admin_due_commission'  => $adminDueCommission,
      'vendor_paid_amount'    => $newVendorPaid,
      'vendor_due_amount'     => $vendorDueAmount,
    ]);

    $pre_balance  = $vendor->amount;

    if ($thisPayToVendor > 0) {
      $vendor->amount = (float) $vendor->amount + (float) $thisPayToVendor;
      $vendor->save();
    }

    $after_balance = $vendor->amount;

    $earning = Earning::first();
    $earning->total_revenue = (float) $earning->total_revenue + (float) $paidAmount;
    $earning->total_earning = (float) $earning->total_earning + (float) $thisPayToAdmin;
    $earning->save();

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

    session()->flash('success', 'Room has booked.');

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
      Log::error('Mail could not be sent for room booking: ' . $e->getMessage());
      return;
    }
  }
}
