<?php

namespace App\Http\Controllers\FrontEnd\Room;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\PaymentGateway\OfflineGateway;
use App\Models\PaymentGateway\OnlineGateway;
use App\Models\RoomManagement\RoomBooking;
use App\Models\RoomManagement\RoomAmenity;
use App\Models\RoomManagement\RoomContent;
use App\Models\RoomManagement\RoomReview;
use App\Models\PackageManagement\Package;
use Illuminate\Support\Facades\Validator;
use App\Models\RoomManagement\Coupon;
use Illuminate\Support\Facades\Auth;
use App\Models\BasicSettings\Basic;
use App\Models\RoomManagement\Room;
use App\Models\RoomManagement\RoomNumber;
use Illuminate\Support\Facades\DB;
use App\Traits\MiscellaneousTrait;
use Illuminate\Http\Request;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Session;
use Carbon\CarbonPeriod;

class RoomController extends Controller
{
  use MiscellaneousTrait;

  public function rooms(Request $request)
  {
    $information['breadcrumbInfo'] = MiscellaneousTrait::getBreadcrumb();
    $roomRating = DB::table('basic_settings')->select('room_rating_status')->first();
    $information['roomRating'] = $roomRating;

    $language = MiscellaneousTrait::getLanguage();

    $information['pageHeading'] = MiscellaneousTrait::getPageHeading($language);

    $num_of_bed = $num_of_bath = $num_of_adult = $num_of_child = $min_rent = $max_rent = $location = null;

    $roomIds = [];
    $dates = [];

    if ($request->filled('dates')) {
      $dateArray = explode(' ', $request->dates);
      $date1 = $dateArray[0];
      $date2 = $dateArray[2];

      $dates = $this->displayDates($date1, $date2);

      $rooms = Room::all();

      foreach ($rooms as $key => $room) {
        foreach ($dates as $key => $date) {
          $cDate = Carbon::parse($date);
          $count = RoomBooking::whereDate('arrival_date', '<=', $cDate)->whereDate('departure_date', '>', $cDate)->where('room_category_id', $room->id)->count();

          if ($count >= $room->quantity) {
            if (!in_array($room->id, $roomIds)) {
              $roomIds[] = $room->id;
            }
          }
        }
      }
    }

    if ($request->filled('beds')) {
      $num_of_bed = $request->beds;
    }
    if ($request->filled('location')) {
      $location = $request->location;
    }
    if ($request->filled('baths')) {
      $num_of_bath = $request->baths;
    }
    if ($request->filled('adult')) {
      $num_of_adult = $request->adult;
    }
    if ($request->filled('child')) {
      $num_of_child = $request->child;
    }
    if ($request->filled('rents')) {
      $bs = Basic::select('base_currency_symbol')->first();
      $rents = str_replace($bs->base_currency_symbol, ' ', $request->rents);
      $rentArray = explode(' ', $rents);
      $min_rent = $rentArray[1];
      $max_rent = $rentArray[4];
    }
    $sortBy = $request->sort_by;
    $ammenities = $request->ammenities;

    $information['roomInfos'] = DB::table('room_categories')
      ->join('room_category_contents', 'room_categories.id', '=', 'room_category_contents.room_id')
      ->where('room_categories.status', '=', 1)
      ->where('room_category_contents.language_id', '=', $language->id)
      ->when($num_of_adult, function ($query, $num_of_adult) {
        return $query->where('adult', '>=', $num_of_adult);
      })
      ->when($num_of_child, function ($query, $num_of_child) {
        return $query->where('child', '>=', $num_of_child);
      })
      ->when($num_of_bed, function ($query, $num_of_bed) {
        return $query->where('bed', $num_of_bed);
      })->when($num_of_bath, function ($query, $num_of_bath) {
        return $query->where('bath', $num_of_bath);
      })->when(($min_rent && $max_rent), function ($query) use ($min_rent, $max_rent) {
        return $query->where('rent', '>=', $min_rent)->where('rent', '<=', $max_rent);
      })->when($ammenities, function ($query, $ammenities) {
        return $query->where(function ($query) use ($ammenities) {
          foreach ($ammenities as $key => $amm) {
            if ($key == 0) {
              $query->where('room_category_contents.amenities', 'LIKE',  "%" . '"' . $amm . '"' . "%");
            } else {
              $query->orWhere('room_category_contents.amenities', 'LIKE', "%" . '"' . $amm . '"' . "%");
            }
          }
        });
      })->when($sortBy, function ($query, $sortBy) {
        if ($sortBy == 'asc') {
          return $query->orderBy('room_categories.id', 'ASC');
        } elseif ($sortBy == 'desc') {
          return $query->orderBy('room_categories.id', 'DESC');
        } elseif ($sortBy == 'price-desc') {
          return $query->orderBy('rent', 'DESC');
        } elseif ($sortBy == 'price-asc') {
          return $query->orderBy('rent', 'ASC');
        }
      }, function ($query) {
        return $query->orderBy('room_categories.id', 'DESC');
      })
      ->whereNotIn('room_categories.id', $roomIds)
      ->paginate(6);

    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    $information['numOfBed'] = Room::where('status', 1)->max('bed');

    $information['numOfBath'] = Room::where('status', 1)->max('bath');

    $maxPrice = Room::where('status', 1)->max('rent');
    $minPrice = Room::where('status', 1)->min('rent');
    $maxAdults = Room::where('status', 1)->max('adult');
    $maxChilds = Room::where('status', 1)->max('child');

    $information['maxPrice'] = $maxPrice;
    $information['minPrice'] = $minPrice;
    $information['maxAdults'] = $maxAdults;
    $information['maxChilds'] = $maxChilds;

    if ($request->filled('rents')) {
      $information['maxRent'] = $max_rent;
      $information['minRent'] = $min_rent;
    } else {
      $information['maxRent'] = $maxPrice;
      $information['minRent'] = $minPrice;
    }

    $information['amenities'] = RoomAmenity::where('language_id', $language->id)->get();

    return view('frontend.rooms.rooms', $information);
  }

  public function displayDates($date1, $date2, $format = 'Y-m-d')
  {
    $dates = array();
    $current = strtotime($date1);
    $date2 = strtotime($date2);
    $stepVal = '+1 day';

    while ($current < $date2) {
      $dates[] = date($format, $current);
      $current = strtotime($stepVal, $current);
    }

    return $dates;
  }

  public function roomDetails($id, $slug)
  {
    $information['breadcrumbInfo'] = MiscellaneousTrait::getBreadcrumb();

    $language = MiscellaneousTrait::getLanguage();

    $details = RoomContent::join('room_categories', 'room_categories.id', 'room_category_contents.room_id')
      ->where('language_id', $language->id)
      ->where('room_id', $id)
      ->first();

    $information['details'] = $details;

    $amms = [];

    if (!empty($details->amenities) && $details->amenities != '[]') {
      $ammIds = json_decode($details->amenities, true);
      $ammenities = RoomAmenity::whereIn('id', $ammIds)->orderBy('serial_number', 'ASC')->get();
      foreach ($ammenities as $key => $ammenity) {
        $amms[] = $ammenity->name;
      }
    }

    $information['amms'] = $amms;

    $information['reviews'] = RoomReview::where('room_id', $id)->orderBy('id', 'DESC')->get();

    $information['currencyInfo'] = MiscellaneousTrait::getCurrencyInfo();

    $information['status'] = DB::table('basic_settings')
      ->select('room_rating_status', 'room_guest_checkout_status')
      ->where('uniqid', '=', 12345)
      ->first();


    $information['onlineGateways'] = OnlineGateway::where('status', 1)->get();

    $information['offlineGateways'] = OfflineGateway::where('status', 1)->orderBy('serial_number', 'asc')->get()->map(function ($gateway) {
      return [
        'id' => $gateway->id,
        'name' => $gateway->name,
        'short_description' => $gateway->short_description,
        'instructions' => replaceBaseUrl($gateway->instructions, 'summernote'),
        'attachment_status' => $gateway->attachment_status,
        'serial_number' => $gateway->serial_number
      ];
    });

    $information['latestRooms'] = RoomContent::where('language_id', $language->id)->with(['room' => function ($query) {
      $query->status();
    }])
      ->where('room_id', '<>', $details->room_id)
      ->orderBy('room_id', 'desc')
      ->limit(3)
      ->get();

    $information['avgRating'] = RoomReview::where('room_id', $id)->avg('rating');

    $stripe = OnlineGateway::query()->whereKeyword('stripe')->first();
    if ($stripe) {
      $stripeInformation = json_decode($stripe->information, true);
      $information['stripeKey'] = $stripeInformation['key'];
    } else {
      $information['stripeKey'] = null;
    }
    $information['bs'] = Basic::select('tax')->first();


    $totalRoomsInCategory = RoomNumber::query()
      ->where('room_category_id', $id)
      ->count();

    $bookings = RoomBooking::query()
      ->where('room_category_id', $id)
      ->whereIn('booking_status', [1])
      ->whereIn('payment_status', [1, 3])
      ->get(['id', 'reserved_dates_info']);

    $bookedMap = []; // date => set of room_numbers

    foreach ($bookings as $b) {

      $info = $b->reserved_dates_info; // already array (casted)
      if (!is_array($info) || empty($info)) continue;

      foreach ($info as $row) {

        $dateStr = $row['date'] ?? null;
        $roomNo  = $row['room_number'] ?? null;

        if (!$dateStr || !$roomNo) continue;

        if (!isset($bookedMap[$dateStr])) {
          $bookedMap[$dateStr] = [];
        }

        // unique rooms per date
        $bookedMap[$dateStr][(string)$roomNo] = true;
      }
    }

    // only fully-booked dates
    $disabledDates = [];

    foreach ($bookedMap as $dateStr => $roomsSet) {
      if (count($roomsSet) >= $totalRoomsInCategory) {
        $disabledDates[] = $dateStr;
      }
    }

    $information['dateArray'] = array_values(array_unique($disabledDates));
    
    return view('frontend.rooms.room-details', $information);
  }

  public function totalRooms(Request $request)
  {
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


    $totalRent = $roomRent * $interval * $maxRoomsPerDay;
    Session::put('totalRentRoom', $totalRent);

    if ($roomCategory->payment_system == 'advance') {
      Session::put('paying_amount', $roomCategory->amount * $interval * $maxRoomsPerDay);
    } else {
      Session::put('paying_amount', $totalRent);
    }

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

    // Step 4: Prepare session data for selected rooms with date
    $sessionRoomData = [];
    $loopDate = $start->copy();

    while ($loopDate->lte($end)) {
      $dateStr = $loopDate->format('Y-m-d');
      $bookedRoomNumbers = $bookedRoomsByDate[$dateStr] ?? [];
      $dailyCount = 0;

      foreach ($allRooms as $room) {
        if (in_array((string) $room->room_number, array_map('strval', $bookedRoomNumbers))) {
          continue;
        }

        if ($dailyCount >= $maxRoomsPerDay) break;

        $sessionRoomData[] = [
          'date' => $dateStr,
          'room_id' => $room->id,
          'room_number' => $room->room_number,
        ];

        $dailyCount++;
      }


      $loopDate->addDay();
    }

    Session::put('selectedRoomsPerDate', $sessionRoomData);

    Session::put('roomDiscount', 0.00);

    // Render the booking availability view with all data
    return view('frontend.rooms.total-room', [
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

  public function applyCoupon(Request $request)
  {
    try {
      $coupon = Coupon::where('code', $request->coupon)->firstOrFail();

      $startDate = Carbon::parse($coupon->start_date);
      $endDate = Carbon::parse($coupon->end_date);
      $todayDate = Carbon::now();

      // check coupon is valid or not
      if ($todayDate->between($startDate, $endDate) == false) {
        return response()->json(['error' => 'Sorry, coupon has been expired!']);
      }

      // check coupon is valid or not for this room
      $roomId = $request->roomId;
      $roomIds = empty($coupon->rooms) ? '' : json_decode($coupon->rooms);

      if (!empty($roomIds) && !in_array($roomId, $roomIds)) {
        return response()->json(['error' => 'You can not apply this coupon for this room!']);
      }

      session()->put('couponCode', $request->coupon);

      $initTotalRent = str_replace(',', '', $request->initTotal);

      if ($initTotalRent == '0.00') {
        return response()->json(['error' => 'First, fillup the booking dates.']);
      } else {
        if ($coupon->type == 'fixed') {
          $total = floatval($initTotalRent) - floatval($coupon->value);
          Session::put('roomDiscount', $coupon->value);

          return response()->json([
            'success' => 'Coupon applied successfully.',
            'discount' => $coupon->value,
            'total' => $total,
          ]);
        } else {
          $initTotalRent = floatval($initTotalRent);
          $couponVal = floatval($coupon->value);

          $discount = $initTotalRent * ($couponVal / 100);
          Session::put('roomDiscount', $discount);
          $total = $initTotalRent - $discount;

          return response()->json([
            'success' => 'Coupon applied successfully.',
            'discount' => $discount,
            'total' => $total
          ]);
        }
      }
    } catch (ModelNotFoundException $e) {
      return response()->json(['error' => 'Coupon is not valid!']);
    }
  }

  public function remove_coupon()
  {
    session()->forget('couponCode');
  }

  public function storeReview(Request $request, $id)
  {
    $booking = RoomBooking::where('user_id', Auth::user()->id)->where('room_id', $id)->where('payment_status', 1)->count();

    if ($booking == 0) {
      session()->flash('error', "You had not booked this room yet.");

      return back();
    }

    $rules = ['rating' => 'required|numeric'];

    $message = [
      'rating.required' => 'The star rating field is required.'
    ];

    $validator = Validator::make($request->all(), $rules, $message);

    if ($validator->fails()) {
      return redirect()->back()->withErrors($validator)->withInput();
    }

    $user = Auth::guard('web')->user();

    $review = RoomReview::where('user_id', $user->id)->where('room_id', $id)->first();

    /**
     * if, room review of auth user does not exist then create a new one.
     * otherwise, update the existing review of that auth user.
     */
    if ($review == null) {
      RoomReview::create($request->except('user_id', 'room_id') + [
        'user_id' => $user->id,
        'room_id' => $id
      ]);

      // now, store the average rating of this room
      $room = Room::where('id', $id)->first();

      $room->update(['avg_rating' => $request->rating]);
    } else {
      $review->update($request->all());

      // now, get the average rating of this room
      $roomReviews = RoomReview::where('room_id', $id)->get();

      $totalRating = 0;

      foreach ($roomReviews as $roomReview) {
        $totalRating += $roomReview->rating;
      }

      $avgRating = $totalRating / $roomReviews->count();

      // finally, store the average rating of this room
      $room = Room::where('id', $id)->first();

      $room->update(['avg_rating' => $avgRating]);
    }

    if ($room->vendor_id != NULL) {
      $room_review_avg = Room::where('vendor_id', $room->vendor_id)->avg('avg_rating');
      $package_review_avg = Package::where('vendor_id', $room->vendor_id)->avg('avg_rating');


      $avg = ($room_review_avg + $package_review_avg) / 2;

      $vendor = Vendor::where('id', $room->vendor_id)->first();
      $vendor->avg_rating = $avg;
      $vendor->save();
    }

    session()->flash('success', 'Review saved successfully!');

    return redirect()->back();
  }
}
