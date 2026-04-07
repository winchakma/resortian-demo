@extends('vendors.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('New Booking') }}</h4>
        <ul class="breadcrumbs">
            <li class="nav-home">
                <a href="{{ route('vendor.dashboard') }}">
                    <i class="flaticon-home"></i>
                </a>
            </li>
            <li class="separator">
                <i class="flaticon-right-arrow"></i>
            </li>
            <li class="nav-item">
                <a href="#">{{ __('Room Bookings') }}</a>
            </li>
            <li class="separator">
                <i class="flaticon-right-arrow"></i>
            </li>
            <li class="nav-item">
                <a href="#">{{ __('New Booking') }}</a>
            </li>
        </ul>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="card-title d-inline-block">{{ __('Make New Booking') }}</div>
                </div>

                <div class="card-body">
                    <form id="bookingForm" action="{{ route('vendor.room_bookings.make_booking') }}" method="POST">
                        @csrf
                        <div class="row">
                            <div class="col-lg-6">
                                <input type="hidden" name="room_category_id"
                                    value="{{ request()->input('room_category_id') }}">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Check In / Out Date') . '*' }}</label>
                                            <input type="text" class="form-control"
                                                placeholder="{{ __('Select Dates') }}" id="date-range" name="dates"
                                                value="{{ $datesC }}" readonly onchange="sendRoomData()" />
                                            <small id="err_dates" class="text-danger em"></small>
                                        </div>
                                    </div>

                                    <input type="hidden" class="form-control"
                                        placeholder="{{ __('Enter Room Category ID') }}" name="room_category_id"
                                        value="{{ request()->get('room_category_id') }}" />

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Total Room') . '*' }}</label>
                                            <input type="text" class="form-control"
                                                placeholder="{{ __('Enter Total Room') }}" name="total_rooms"
                                                value="1" onchange="sendRoomData()" />
                                            <small id="err_total_rooms" class="text-danger em"></small>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Number of Nights') . '*' }}</label>
                                            <input type="text" class="form-control"
                                                placeholder="{{ __('Number of Nights') }}" id="night" name="nights"
                                                value="{{ old('nights', $interval ?? '') }}" readonly>
                                            <small id="err_nights" class="text-danger em"></small>
                                            <p class="text-warning mt-1 mb-0 ml-1">
                                                {{ __('Number of nights will be calculated based on checkin & checkout date.') }}
                                            </p>
                                        </div>
                                    </div>


                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Number of Adult') . '*' }}</label>
                                            <select class="form-control select2" name="adult">
                                                @for ($i = 1; $i <= $roomCategory->adult; $i++)
                                                    <option value="{{ $i }}"
                                                        {{ old('adult', 1) == $i ? 'selected' : '' }}>
                                                        {{ $i }}
                                                    </option>
                                                @endfor
                                            </select>
                                            <small id="err_adult" class="text-danger em"></small>
                                        </div>
                                    </div>


                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Number of Child') }}</label>

                                            <select class="form-control select2" name="child">
                                                @for ($i = 0; $i <= $roomCategory->child; $i++)
                                                    <option value="{{ $i }}"
                                                        {{ old('child', 0) == $i ? 'selected' : '' }}>
                                                        {{ $i }}
                                                    </option>
                                                @endfor
                                            </select>

                                        </div>
                                    </div>


                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Total Rent') . ' (' . $currencyInfo->base_currency_text . ')' }}</label>
                                            <input type="text" class="form-control" name="total" value="0.00"
                                                readonly id="total">
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Discount') . ' (' . $currencyInfo->base_currency_text . ')' }}</label>
                                            <input type="text" class="form-control" name="discount" value="0.00"
                                                id="discount" placeholder="Enter Discount Amount"
                                                onchange="sendRoomData()" />
                                            <p class="text-warning mt-1 mb-0 ml-1">
                                            </p>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Customer Full Name') . '*' }}</label>
                                            <input type="text" class="form-control"
                                                placeholder="{{ __('Enter Full Name') }}" name="customer_name"
                                                value="{{ old('customer_name') }}">
                                            <small id="err_customer_name" class="text-danger em"></small>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Customer Phone Number') . '*' }}</label>
                                            <input type="text" class="form-control"
                                                placeholder="{{ __('Enter Phone Number') }}" name="customer_phone"
                                                value="{{ old('customer_phone') }}">
                                            <small id="err_customer_phone" class="text-danger em"></small>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Customer Email') . '*' }}</label>
                                            <input type="email" class="form-control"
                                                placeholder="{{ __('Enter Customer Email') }}" name="customer_email"
                                                value="{{ old('customer_email') }}">
                                            <small id="err_customer_email" class="text-danger em"></small>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Payment Method') . '*' }}</label>
                                            <select name="payment_method" class="form-control">
                                                <option selected disabled>{{ __('Select a Method') }}</option>

                                                @if (count($onlineGateways) > 0)
                                                    @foreach ($onlineGateways as $onlineGateway)
                                                        <option
                                                            {{ old('payment_method') == $onlineGateway->name ? 'selected' : '' }}
                                                            value="{{ $onlineGateway->name }}">
                                                            {{ $onlineGateway->name }}
                                                        </option>
                                                    @endforeach
                                                @endif

                                                @if (count($offlineGateways) > 0)
                                                    @foreach ($offlineGateways as $offlineGateway)
                                                        <option
                                                            {{ old('payment_method') == $offlineGateway->name ? 'selected' : '' }}
                                                            value="{{ $offlineGateway->name }}">
                                                            {{ $offlineGateway->name }}
                                                        </option>
                                                    @endforeach
                                                @endif
                                            </select>
                                            <small id="err_payment_method" class="text-danger em"></small>
                                        </div>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Payment Status') . '*' }}</label>
                                            <select name="payment_status" class="form-control" id="payment_status">
                                                <option selected disabled>{{ __('Select Payment Status') }}</option>
                                                <option {{ old('payment_status') == '1' ? 'selected' : '' }}
                                                    value="1">
                                                    {{ __('Full Paid') }}
                                                </option>
                                                <option {{ old('payment_status') == '3' ? 'selected' : '' }}
                                                    value="3">
                                                    {{ __('Partial Paid') }}
                                                </option>
                                            </select>
                                            <small id="err_payment_status" class="text-danger em"></small>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>{{ __('Booking Status') . '*' }}</label>
                                            <select name="booking_status" class="form-control">
                                                <option selected disabled>{{ __('Select Booking Status') }}</option>
                                                <option {{ old('booking_status') == '1' ? 'selected' : '' }}
                                                    value="1">
                                                    {{ __('Approved') }}
                                                </option>
                                                <option {{ old('booking_status') == '0' ? 'selected' : '' }}
                                                    value="0">
                                                    {{ __('Pending') }}
                                                </option>
                                            </select>
                                            <small id="err_booking_status" class="text-danger em"></small>
                                        </div>
                                    </div>

                                    <div class="col-lg-6" id="paying_amount" style="display: none;">
                                        <div class="form-group">
                                            <label>{{ __('Paying Amount') . '*' }}</label>
                                            <input type="numper" class="form-control" step="0.01"
                                                name="paying_amount" value="0.00">
                                            <small id="err_paying_amount" class="text-danger em"></small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">

                                <div class="search-container">
                                    @if ($insufficientDate)
                                        <div class="row booking-wrapper">
                                            <div class="col-12">
                                                <div class="form-group">
                                                    <h3 class="text-primary"> {{ __('We have only') }}
                                                        {{ $availableCount }}
                                                        {{ __('room avaiable for') }}
                                                        {{ $dateStr }}</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <small id="err_rooms" class="text-danger em"></small>
                                    @else
                                        <div class="row booking-wrapper">
                                            <div class="col-xl-12">
                                                <div class="card">
                                                    <!-- card-header -->
                                                    <div
                                                        class="card-header d-flex gap-2 flex-wrap justify-content-between">
                                                        <div
                                                            class="card-title d-flex justify-content-between booking-info-title mb-0">
                                                            <h3 class="mb-0">{{ __('Room Assignment') }}</h3>
                                                        </div>
                                                        <div>
                                                            <span class="fas fa-circle text-danger"></span>
                                                            <span class="">{{ __('Booked') }}</span>
                                                            <span class="fas fa-circle text-success"></span>
                                                            <span class="">{{ __('Selected') }}</span>
                                                            <span class="fas fa-circle text-primary"></span>
                                                            <span>{{ __('Available') }}</span>
                                                        </div>
                                                    </div>
                                                    <!-- card-Body -->
                                                    <div class="card-body">

                                                        <div class="alert alert-info room-assign-alert p-3"
                                                            role="alert">
                                                            {{ __('Select or deselect rooms with one click. Booked rooms are disabled. Ensure your selection matches the total room count.') }}
                                                        </div>

                                                        <div class="bookingInfo">
                                                            <table class="table-light table-bordered booking-table table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>{{ __('Date') }}</th>
                                                                        <th>{{ __('Room Number') }}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="room-table">
                                                                    @foreach ($dates as $day)
                                                                        <tr>
                                                                            <td class="text-center">
                                                                                {{ \Carbon\Carbon::parse($day['date'])->format('d M, Y') }}
                                                                                -
                                                                                {{ \Carbon\Carbon::parse($day['date'])->addDay()->format('d M, Y') }}
                                                                            </td>
                                                                            <td class="room-column">
                                                                                <div class="d-flex w-100 flex-wrap gap-2">

                                                                                    @php
                                                                                        $selectedRooms = [];
                                                                                    @endphp

                                                                                    @foreach ($day['rooms'] as $index => $room)
                                                                                        @php
                                                                                            $btnClass =
                                                                                                $room['status'] ===
                                                                                                'booked'
                                                                                                    ? 'btn-danger'
                                                                                                    : 'btn-primary';
                                                                                            $isAvailable =
                                                                                                $room['status'] ===
                                                                                                'available';

                                                                                            $selectedClass =
                                                                                                $isAvailable &&
                                                                                                count($selectedRooms) <
                                                                                                    $totalRooms
                                                                                                    ? 'selected btn-success'
                                                                                                    : '';

                                                                                            // Skip booked rooms and mark them as disabled
                                                                                            $dataStatus =
                                                                                                $room['status'] ===
                                                                                                'booked'
                                                                                                    ? 1
                                                                                                    : 0;
                                                                                            $roomId = str_pad(
                                                                                                $index + 1,
                                                                                                2,
                                                                                                '0',
                                                                                                STR_PAD_LEFT,
                                                                                            );

                                                                                            // Add the room to the selected list if it's available
if (
    $isAvailable &&
    count($selectedRooms) <
        $totalRooms
) {
    $selectedRooms[] =
        $room[
            'room_number'
                                                                                                    ];
                                                                                            }
                                                                                        @endphp
                                                                                        <button type="button"
                                                                                            class="btn btn-sm room-btn available {{ $btnClass }} {{ $selectedClass }}"
                                                                                            room="room-{{ $room['room_number'] }}"
                                                                                            data-room_number="{{ $room['room_number'] }}"
                                                                                            data-room_id="{{ $room['id'] ?? $room['room_number'] }}"
                                                                                            data-rent="{{ $room['rent'] ?? 60 }}"
                                                                                            data-date="{{ $day['date'] }}"
                                                                                            data-booked_status="{{ $dataStatus }}"
                                                                                            {{ $room['status'] === 'booked' ? 'disabled' : '' }}>
                                                                                            {{ $room['room_number'] }}
                                                                                        </button>
                                                                                    @endforeach
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    @endforeach
                                                                </tbody>
                                                            </table>
                                                            <small id="err_rooms" class="text-danger em"></small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-12">
                                                <div class="card">
                                                    <div class="card-header">
                                                        <div class="card-title mb-0">
                                                            <h3 class="mb-0">{{ __('Booked Rooms') }}</h3>
                                                        </div>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class="orderList">
                                                            <!-- list-group-flush -->
                                                            <ul class="list-group list-group-flush orderItem">
                                                                <li class="list-group-item">
                                                                    <h5 class="mb-0">{{ __('Room') }}</h5>
                                                                    <h5 class="mb-0">{{ __('Days') }}</h5>
                                                                    <h5 class="mb-0">{{ __('Rent') }}</h5>
                                                                    <h5 class="mb-0">{{ __('Total') }}</h5>
                                                                </li>
                                                                @php
                                                                    $grandTotal = 0;
                                                                @endphp

                                                                @foreach ($dates2[0]['rooms'] as $room)
                                                                    @php
                                                                        $subtotal = $room['rent'] * $room['days'];
                                                                        $grandTotal += $subtotal;
                                                                    @endphp

                                                                    @php
                                                                        $currencySymbol = $bs->base_currency_text;
                                                                        $symbolPosition =
                                                                            $bs->base_currency_symbol_position;
                                                                        $tax = $bs->tax;
                                                                    @endphp
                                                                    <li class="list-group-item"
                                                                        data-room_number="{{ $room['room_number'] }}">
                                                                        <span>
                                                                            <span class="removeItem btn btn-sm btn-danger">
                                                                                <i class="fa fa-times"></i>
                                                                            </span>
                                                                            {{ $room['room_number'] }}
                                                                        </span>
                                                                        <span class="totalDays">{{ $room['days'] }}</span>
                                                                        <span class="unitRent">
                                                                            @if ($symbolPosition === 'left')
                                                                                {{ $currencySymbol }} {{ $room['rent'] }}
                                                                            @else
                                                                                {{ $room['rent'] }} {{ $currencySymbol }}
                                                                            @endif
                                                                        </span>
                                                                        <span class="subTotal"
                                                                            sub_total="{{ $subtotal }}">
                                                                            @if ($symbolPosition === 'left')
                                                                                {{ $currencySymbol }}
                                                                                {{ number_format($subtotal, 2) }}
                                                                            @else
                                                                                {{ number_format($subtotal, 2) }}{{ $currencySymbol }}
                                                                            @endif
                                                                        </span>
                                                                    </li>
                                                                @endforeach
                                                            </ul>

                                                            @php
                                                                $taxRate = $bs->tax;
                                                                $taxAmount =
                                                                    (($grandTotal - $discount) * $taxRate) / 100;
                                                                $finalTotal = $grandTotal - $discount + $taxAmount;
                                                                $currencySymbol = $bs->base_currency_text;
                                                                $symbolPosition = $bs->base_currency_symbol_position;
                                                            @endphp

                                                            <!-- Grand Total -->
                                                            <div
                                                                class="d-flex justify-content-between align-items-center border-top p-2 px-3">
                                                                <span>{{ __('Total Rent') }}</span>
                                                                <span class="totalRent"
                                                                    data-amount="{{ $grandTotal }}">

                                                                    @if ($symbolPosition === 'left')
                                                                        {{ $currencySymbol }}
                                                                        {{ number_format($grandTotal, 2) }}
                                                                    @else
                                                                        {{ number_format($grandTotal, 2) }}{{ $currencySymbol }}
                                                                    @endif
                                                                </span>
                                                            </div>
                                                            <div
                                                                class="d-flex justify-content-between align-items-center border-top p-2 px-3">
                                                                <span>{{ __('Discount') }}</span>
                                                                <span class="totalDiscount"
                                                                    data-amount="{{ $discount }}">

                                                                    @if ($symbolPosition === 'left')
                                                                        {{ $currencySymbol }}
                                                                        {{ number_format($discount, 2) }}
                                                                    @else
                                                                        {{ number_format($discount, 2) }}{{ $currencySymbol }}
                                                                    @endif
                                                                </span>
                                                            </div>
                                                            <div
                                                                class="d-flex justify-content-between align-items-center border-top p-2 px-3">
                                                                <span>{{ __('Tax') }}
                                                                    <small>({{ $taxRate }}%)</small></span>
                                                                <span>
                                                                    @if ($symbolPosition === 'left')
                                                                        <span class="taxCharge">{{ $currencySymbol }}
                                                                            {{ number_format($taxAmount, 2) }}</span>
                                                                    @else
                                                                        <span
                                                                            class="taxCharge">{{ number_format($taxAmount, 2) }}
                                                                            {{ $currencySymbol }}</span>
                                                                    @endif
                                                                </span>
                                                                <input name="tax_charge" type="hidden"
                                                                    value="{{ number_format($taxAmount, 2) }}">
                                                            </div>

                                                            <div
                                                                class="d-flex justify-content-between align-items-center border-top p-2 px-3">
                                                                <span>{{ __('Grand Total') }}</span>
                                                                <span class="grandTotalRent">
                                                                    @if ($symbolPosition === 'left')
                                                                        {{ $currencySymbol }}
                                                                        {{ number_format($finalTotal, 2) }}
                                                                    @else
                                                                        {{ number_format($finalTotal, 2) }}
                                                                        {{ $currencySymbol }}
                                                                    @endif
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="card-footer">
                    <div class="row">
                        <div class="col-12 text-center">
                            <button type="submit" form="bookingForm" class="btn btn-success">
                                {{ __('Submit') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script>
        'use strict';
        var taxRate = {{ $bs->tax ?? 0 }};
        var currency = "{{ $currencyInfo->base_currency_text }}";
        var roomUpdateUrl = "{{ route('vendor.rooms_management.bookings.total_rooms') }}";
    </script>
    <script type="text/javascript" src="{{ asset('assets/js/admin-room.js') }}"></script>
@endsection
