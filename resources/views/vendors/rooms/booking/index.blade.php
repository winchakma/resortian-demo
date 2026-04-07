@extends('vendors.layout')

@section('content')
    <div class="page-header">
        @if (request()->routeIs('vendor.room_bookings.all_bookings'))
            <h4 class="page-title">{{ __('All Bookings') }}</h4>
        @elseif (request()->routeIs('vendor.room_bookings.approved_bookings'))
            <h4 class="page-title">{{ __('Approved Bookings') }}</h4>
        @elseif (request()->routeIs('vendor.room_bookings.pending_bookings'))
            <h4 class="page-title">{{ __('Pending Bookings') }}</h4>
        @elseif (request()->routeIs('vendor.room_bookings.active_bookings'))
            <h4 class="page-title">{{ __('Active Bookings') }}</h4>
        @elseif (request()->routeIs('vendor.room_bookings.canceled_bookings'))
            <h4 class="page-title">{{ __('Canceled Bookings') }}</h4>
        @endif

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
                <a href="#">{{ __('Rooms Bookings') }}</a>
            </li>
            <li class="separator">
                <i class="flaticon-right-arrow"></i>
            </li>
            <li class="nav-item">
                @if (request()->routeIs('vendor.room_bookings.all_bookings'))
                    <a href="#">{{ __('All Bookings') }}</a>
                @elseif (request()->routeIs('vendor.room_bookings.approved_bookings'))
                    <a href="#">{{ __('Approved Bookings') }}</a>
                @elseif (request()->routeIs('vendor.room_bookings.pending_bookings'))
                    <a href="#">{{ __('Pending Bookings') }}</a>
                @elseif (request()->routeIs('vendor.room_bookings.active_bookings'))
                    <a href="#">{{ __('Active Bookings') }}</a>
                @elseif (request()->routeIs('vendor.room_bookings.canceled_bookings'))
                    <a href="#">{{ __('Canceled Bookings') }}</a>
                @endif
            </li>
        </ul>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="row justify-content-between">
                        <div class="col-lg-4">
                            <div class="card-title mb-2">
                                @if (request()->routeIs('vendor.room_bookings.all_bookings'))
                                    {{ __('All Room Bookings') }}
                                @elseif (request()->routeIs('vendor.room_bookings.approved_bookings'))
                                    {{ __('Approved Bookings') }}
                                @elseif (request()->routeIs('vendor.room_bookings.pending_bookings'))
                                    {{ __('Pending Bookings') }}
                                @elseif (request()->routeIs('vendor.room_bookings.active_bookings'))
                                    {{ __('Active Bookings') }}
                                @elseif (request()->routeIs('vendor.room_bookings.canceled_bookings'))
                                    {{ __('Canceled Bookings') }}
                                @endif
                            </div>
                        </div>

                        <div class="col-lg-2">
                            <form
                                @if (request()->routeIs('vendor.room_bookings.all_bookings')) action="{{ route('vendor.room_bookings.all_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.approved_bookings'))
                  action="{{ route('vendor.room_bookings.approved_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.canceled_bookings'))
                  action="{{ route('vendor.room_bookings.canceled_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.active_bookings'))
                  action="{{ route('vendor.room_bookings.active_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.pending_bookings'))
                  action="{{ route('vendor.room_bookings.pending_bookings') }}" @endif
                                method="GET">

                                {{-- Booking No Search --}}
                                <input name="booking_no" id="booking_no" type="text" class="form-control mb-2"
                                    placeholder="Search By Booking No." value="{{ request()->input('booking_no') ?? '' }}">
                            </form>
                        </div>

                        <div class="col-lg-2">
                            <form
                                @if (request()->routeIs('vendor.room_bookings.all_bookings')) action="{{ route('vendor.room_bookings.all_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.approved_bookings'))
                  action="{{ route('vendor.room_bookings.approved_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.canceled_bookings'))
                  action="{{ route('vendor.room_bookings.canceled_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.active_bookings'))
                  action="{{ route('vendor.room_bookings.active_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.pending_bookings'))
                  action="{{ route('vendor.room_bookings.pending_bookings') }}" @endif
                                method="GET">

                                <input name="keyword" id="keyword" type="text" class="form-control mb-2"
                                    placeholder="Search By name / phone / email"
                                    value="{{ request()->input('keyword') ?? '' }}">

                            </form>
                        </div>



                        <div class="col-lg-2">
                            <form
                                @if (request()->routeIs('vendor.room_bookings.all_bookings')) action="{{ route('vendor.room_bookings.all_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.approved_bookings'))
                  action="{{ route('vendor.room_bookings.approved_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.canceled_bookings'))
                  action="{{ route('vendor.room_bookings.canceled_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.active_bookings'))
                  action="{{ route('vendor.room_bookings.active_bookings') }}"
                @elseif (request()->routeIs('vendor.room_bookings.pending_bookings'))
                  action="{{ route('vendor.room_bookings.pending_bookings') }}" @endif
                                method="GET">

                                @if (request()->routeIs('vendor.room_bookings.all_bookings'))
                                    {{-- Booking Status Search --}}
                                    <select name="status" class="form-control mb-2" onchange="this.form.submit()">
                                        <option value="" {{ request()->input('status') == '' ? 'selected' : '' }}>
                                            {{ __('All') }}
                                        </option>
                                        <option value="approved"
                                            {{ request()->input('status') == 'approved' ? 'selected' : '' }}>
                                            {{ __('Approved') }}
                                        </option>
                                        <option value="pending"
                                            {{ request()->input('status') == 'pending' ? 'selected' : '' }}>
                                            {{ __('Pending') }}
                                        </option>

                                        <option value="canceled"
                                            {{ request()->input('status') == 'canceled' ? 'selected' : '' }}>
                                            {{ __('Canceled') }}
                                        </option>
                                    </select>
                                @endif
                            </form>
                        </div>

                        <div class="col-lg-2">
                            <button class="btn btn-danger btn-sm float-right d-none bulk-delete ml-3 "
                                data-href="{{ route('vendor.room_bookings.bulk_delete_booking') }}">
                                <i class="flaticon-interface-5"></i> {{ __('Delete') }}
                            </button>
                            <a href="#" data-toggle="modal" data-target="#roomModal"
                                class="btn btn-primary btn-sm float-right ">
                                {{ __('Add Booking') }}
                            </a>
                        </div>

                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">

                            @if (request()->routeIs('vendor.room_bookings.active_bookings'))
                                <div class="col-lg-6 offset-lg-3">
                                    <div class="alert alert-danger text-center" role="alert">
                                        {{ __('Shows all active bookings where the guest has already checked in but has not yet checked out.') }}
                                    </div>
                                </div>
                                <hr>
                            @endif
                            @if (count($bookings) == 0)
                                <h3 class="text-center mt-2">{{ __('NO ROOM BOOKING FOUND!') }}</h3>
                            @else
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th scope="col">
                                                    <input type="checkbox" class="bulk-check" data-val="all">
                                                </th>
                                                <th scope="col">{{ __('Booking No.') }}</th>
                                                <th scope="col">{{ __('Guest') }}</th>
                                                <th scope="col">{{ __('Check In - Check Out') }}</th>
                                                <th scope="col">{{ __('Total Amount') }}</th>
                                                <th scope="col">{{ __('Stay Status') }}</th>
                                                <th scope="col">{{ __('Payment Status') }}</th>
                                                <th scope="col">{{ __('Booking Status') }}</th>
                                                <th scope="col">{{ __('Actions') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($bookings as $booking)
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" class="bulk-check"
                                                            data-val="{{ $booking->id }}">
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {{ '#' . $booking->booking_number }}
                                                        </div>
                                                        <div>
                                                            {{ \Carbon\Carbon::parse($booking->created_at)->format('d M, Y h:i A') }}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            @php
                                                                $user = $booking->roomBookedByUser()->first();
                                                            @endphp
                                                            @if ($user)
                                                                <a href="{{ route('register.user.view', $user->id) }}"
                                                                    class="">{{ $user->username }}</a>
                                                            @else
                                                                {{ __('--') }}
                                                            @endif
                                                        </div>
                                                        <div>
                                                            <a href="#">
                                                                {{ $booking->customer_phone }}
                                                            </a>
                                                        </div>
                                                        <div>
                                                            <a href="#" class=" mailBtn mailBtn-underline"
                                                                data-target="#mailModal" data-toggle="modal"
                                                                data-customer_email="{{ $booking->customer_email }}">
                                                                {{ $booking->customer_email }}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {{ \Carbon\Carbon::parse($booking->arrival_date)->format('d M, Y') }}
                                                        </div>
                                                        <div>
                                                            {{ \Carbon\Carbon::parse($booking->departure_date)->format('d M, Y') }}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {{ $booking->currency_text_position == 'left' ? $booking->currency_text : '' }}
                                                        {{ $booking->grand_total }}
                                                        {{ $booking->currency_text_position == 'right' ? $booking->currency_text : '' }}
                                                    </td>
                                                    <td>
                                                        @if ($booking->booking_status == 2)
                                                            <span class="badge badge-danger">{{ __('Canceled') }}</span>
                                                        @else
                                                            @if ($booking->stay_status == 'checked-out')
                                                                <span
                                                                    class="badge badge-danger">{{ __('Checked-Out') }}</span>
                                                            @else
                                                                <form id="stayStatusForm{{ $booking->id }}"
                                                                    class="d-inline-block"
                                                                    action="{{ route('vendor.room_bookings.update_stay_status') }}"
                                                                    method="post">
                                                                    @csrf
                                                                    <input type="hidden" name="booking_id"
                                                                        value="{{ $booking->id }}">
                                                                    @php
                                                                        $statusClass = match ($booking->stay_status) {
                                                                            'Upcoming' => 'bg-info',
                                                                            'checked-out' => 'bg-danger',
                                                                            'checked-in' => 'bg-success',
                                                                            default => '',
                                                                        };
                                                                    @endphp

                                                                    <select
                                                                        class="form-control form-control-sm {{ $statusClass }}"
                                                                        name="stay_status"
                                                                        onchange="document.getElementById('stayStatusForm{{ $booking->id }}').submit();">

                                                                        {{-- Show "Upcoming" only if current status is not "checked-in" --}}
                                                                        @if ($booking->stay_status != 'checked-in')
                                                                            <option value="Upcoming"
                                                                                {{ $booking->stay_status == 'Upcoming' ? 'selected' : '' }}>
                                                                                {{ __('Upcoming') }}
                                                                            </option>
                                                                        @endif

                                                                        {{-- Always show "Checked In" --}}
                                                                        <option value="checked-in"
                                                                            {{ $booking->stay_status == 'checked-in' ? 'selected' : '' }}>
                                                                            {{ __('Checked In') }}
                                                                        </option>

                                                                        {{-- Show "Checked Out" only if current status is not "Upcoming" --}}
                                                                        @if ($booking->stay_status != 'Upcoming')
                                                                            <option value="checked-out"
                                                                                {{ $booking->stay_status == 'checked-out' ? 'selected' : '' }}>
                                                                                {{ __('Checked Out') }}
                                                                            </option>
                                                                        @endif
                                                                    </select>
                                                                </form>
                                                            @endif
                                                        @endif
                                                    </td>
                                                    <td>

                                                        @if ($booking->gateway_type == 'online')
                                                            @if ($booking->payment_status == 1)
                                                                <h2 class="d-inline-block"><span
                                                                        class="badge badge-success">{{ __('Full Paid') }}</span>
                                                                </h2>
                                                            @elseif ($booking->payment_status == 3 || $booking->payment_status == 2)
                                                                <button
                                                                    class="badge {{ $booking->payment_status == 3 ? 'badge-info' : 'badge-danger' }}"
                                                                    @if ($booking->booking_status === 2) disabled @endif>
                                                                    {{ $booking->payment_status == 3 ? __('Partial Paid') : __('Rejected') }}
                                                                </button>
                                                                @if ($booking->booking_status != 2)
                                                                    <button class="button-info eye-icon"
                                                                        data-toggle="modal"
                                                                        data-target="#paymentModal{{ $booking->id }}">
                                                                        <i class="fa fa-eye"></i>
                                                                    </button>
                                                                @endif
                                                                @includeIf('vendors.rooms.booking.partial-paid')
                                                            @else
                                                                <h2 class="d-inline-block"><span
                                                                        class="badge badge-warning">{{ __('Pending') }}</span>
                                                                </h2>
                                                            @endif
                                                        @else
                                                            @if ($booking->payment_status == 1)
                                                                <h2 class="d-inline-block"><span
                                                                        class="badge badge-success">{{ __('Full Paid') }}</span>
                                                                </h2>
                                                            @elseif ($booking->payment_status == 3 || $booking->payment_status == 2)
                                                                <button
                                                                    class="badge {{ $booking->payment_status == 3 ? 'badge-info' : 'badge-danger' }}"
                                                                    @if ($booking->booking_status === 2) disabled @endif>
                                                                    {{ $booking->payment_status == 3 ? __('Partial Paid') : __('Rejected') }}
                                                                </button>
                                                                @if ($booking->booking_status != 2)
                                                                    <button class="button-info eye-icon"
                                                                        data-toggle="modal"
                                                                        data-target="#paymentModal{{ $booking->id }}">
                                                                        <i class="fa fa-eye"></i>
                                                                    </button>
                                                                @endif
                                                                @includeIf('vendors.rooms.booking.partial-paid')
                                                            @else
                                                                <form id="paymentStatusForm{{ $booking->id }}"
                                                                    class="d-inline-block"
                                                                    action="{{ route('vendor.room_bookings.update_payment_status') }}"
                                                                    method="post">
                                                                    @csrf
                                                                    <input type="hidden" name="booking_id"
                                                                        value="{{ $booking->id }}">

                                                                    <select
                                                                        class="form-control form-control-sm {{ $booking->payment_status == 3 ? 'bg-info' : 'bg-warning' }}"
                                                                        name="payment_status"
                                                                        onchange="document.getElementById('paymentStatusForm{{ $booking->id }}').submit();">
                                                                        <option value="1"
                                                                            {{ $booking->payment_status == 1 ? 'selected' : '' }}>
                                                                            {{ __('Approve') }}
                                                                        </option>
                                                                        <option value="0"
                                                                            {{ $booking->payment_status == 0 ? 'selected' : '' }}>
                                                                            {{ __('Pending') }}
                                                                        <option value="2"
                                                                            {{ $booking->payment_status == 2 ? 'selected' : '' }}>
                                                                            {{ __('Rejected') }}
                                                                        </option>
                                                                    </select>
                                                                </form>
                                                            @endif
                                                        @endif
                                                    </td>
                                                    <td>
                                                        @if ($booking->booking_status != 2)
                                                            <form id="bookingStatusForm{{ $booking->id }}"
                                                                class="d-inline-block"
                                                                action="{{ route('vendor.room_bookings.update_booking_status') }}"
                                                                method="post">
                                                                @csrf
                                                                <input type="hidden" name="booking_id"
                                                                    value="{{ $booking->id }}">

                                                                <select
                                                                    class="form-control form-control-sm {{ $booking->booking_status == 1 ? 'bg-success' : 'bg-warning' }}"
                                                                    name="booking_status"
                                                                    onchange="handleBookingStatusChange(this, {{ $booking->id }})">
                                                                    <option value="0"
                                                                        {{ $booking->booking_status == 0 ? 'selected' : '' }}>
                                                                        {{ __('Pending') }}
                                                                    </option>
                                                                    <option value="1"
                                                                        {{ $booking->booking_status == 1 ? 'selected' : '' }}>
                                                                        {{ __('Approved') }}
                                                                    </option>
                                                                    <option value="2"
                                                                        {{ $booking->booking_status == 2 ? 'selected' : '' }}>
                                                                        {{ __('Canceled') }}
                                                                    </option>
                                                                </select>
                                                            </form>
                                                            @includeIf('vendors.rooms.booking.make-refund')
                                                        @else
                                                            @if ($booking->booking_status == 1)
                                                                <h2 class="d-inline-block"><span
                                                                        class="badge badge-success">{{ __('Approved') }}</span>
                                                                </h2>
                                                            @else
                                                                <h2 class="d-inline-block"><span
                                                                        class="badge badge-danger">{{ __('Canceled') }}</span>
                                                                </h2>
                                                            @endif
                                                        @endif
                                                    </td>

                                                    <td>
                                                        <div class="dropdown">
                                                            <button class="btn btn-secondary btn-sm dropdown-toggle"
                                                                type="button" id="dropdownMenuButton"
                                                                data-toggle="dropdown" aria-haspopup="true"
                                                                aria-expanded="false">
                                                                {{ __('Select') }}
                                                            </button>

                                                            <div class="dropdown-menu"
                                                                aria-labelledby="dropdownMenuButton">
                                                                @if ($booking->booking_status != 2)
                                                                    <a href="{{ route('vendor.room_bookings.booking_details', ['id' => $booking->id]) }}"
                                                                        class="dropdown-item">
                                                                        {{ __('Details') }}
                                                                    </a>
                                                                @endif
                                                                @if ($booking->booking_status != 2)
                                                                    <a href="{{ route('vendor.room_bookings.booking.edit', ['id' => $booking->id]) }}"
                                                                        class="dropdown-item">
                                                                        {{ __('Edit') }}
                                                                    </a>
                                                                @endif
                                                                @if ($booking->booking_status != 2)
                                                                    <a href="{{ route('vendor.room_bookings.booking_paid_services', ['id' => $booking->id]) }}"
                                                                        class="dropdown-item">
                                                                        {{ __('Paid Services') }}
                                                                    </a>
                                                                @endif

                                                                @if (!empty($booking->attachment))
                                                                    <a class="dropdown-item" href="#"
                                                                        data-toggle="modal"
                                                                        data-target="#attachmentModal{{ $booking->id }}">
                                                                        {{ __('Attachment') }}
                                                                    </a>
                                                                @endif

                                                                @if ($booking->invoice)
                                                                    <a href="{{ asset('assets/invoices/rooms/' . $booking->invoice) }}"
                                                                        class="dropdown-item" target="_blank">
                                                                        {{ __('Invoice') }}
                                                                    </a>
                                                                @endif


                                                                <a href="#" class="dropdown-item mailBtn"
                                                                    data-target="#mailModal" data-toggle="modal"
                                                                    data-customer_email="{{ $booking->customer_email }}">
                                                                    {{ __('Send Mail') }}
                                                                </a>

                                                                <form class="deleteForm d-block"
                                                                    action="{{ route('vendor.room_bookings.delete_booking', ['id' => $booking->id]) }}"
                                                                    method="post">
                                                                    @csrf
                                                                    <button type="submit" class="deleteBtn">
                                                                        {{ __('Delete') }}
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                @includeIf('vendors.rooms.booking.show-attachment')
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="row">
                        <div class="d-inline-block mx-auto">
                            {{ $bookings->appends(['booking_no' => request()->input('booking_no')])->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @includeIf('vendors.rooms.booking.send-mail')
    @includeIf('vendors.rooms.booking.all-room-categories')
@endsection

@section('script')
    <script>
        var currency = "{{ $currencyInfo->base_currency_text }}";

        function handleBookingStatusChange(selectElem, bookingId) {
            const selectedValue = selectElem.value;

            if (selectedValue === '2') {
                // Show the refund modal if status is 'Cancelled'
                $('#refundModal-' + bookingId).modal('show');
            } else {
                // Submit the form for any status other than 'Cancelled'
                document.getElementById('bookingStatusForm' + bookingId).submit();
            }
        }
    </script>

    <script type="text/javascript" src="{{ asset('assets/js/admin-room.js') }}"></script>
@endsection
