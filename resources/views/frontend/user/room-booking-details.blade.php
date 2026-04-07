@extends('frontend.layout')

@section('pageHeading')
    {{ __('Room Booking Details') }}
@endsection

@section('content')
    <main>
        <!-- Breadcrumb Section Start -->
        <section class="breadcrumb-area d-flex align-items-center position-relative bg-img-center"
            style="background-image: url({{ asset('assets/img/' . $breadcrumbInfo->breadcrumb) }});">
            <div class="container">
                <div class="breadcrumb-content text-center">
                    <h1>{{ __('Room Booking Details') }}</h1>
                    <ul class="list-inline">
                        <li><a href="{{ route('index') }}">{{ __('Home') }}</a></li>
                        <li><i class="far fa-angle-double-right"></i></li>
                        <li>{{ __('Room Booking Details') }}</li>
                    </ul>
                </div>
            </div>
        </section>
        <!-- Breadcrumb Section End -->

        <!-- Room Booking Details Area Start -->
        <section class="user-dashboard">
            <div class="container">
                <div class="row">
                    @include('frontend.user.side_navbar')

                    <div class="col-lg-9">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="user-profile-details">
                                    <div class="order-details">
                                        <div class="title d-flex justify-content-between align-items-center">
                                            <h4>{{ __('Room Booking Details') }}</h4>
                                            @if ($cancelation)
                                                <a href="{{ route('user.room_booking.cancel', $details->id) }}"
                                                    class="btn-danger btn-sm">
                                                    {{ __('Cancel Booking') }}
                                                </a>
                                            @endif
                                        </div>


                                        <div class="view-order-page">
                                            <div class="order-info-area">
                                                <div class="row align-items-center">
                                                    <div class="col-lg-8">
                                                        <div class="order-info">
                                                            <h3>{{ __('Booking') . ': ' . '#' . $details->booking_number }}
                                                            </h3>

                                                            <p>{{ __('Booking Date') . ': ' . date_format($details->created_at, 'M d, Y') }}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-4">
                                                        <div class="print">
                                                            <a href="{{ asset('assets/invoices/rooms/' . $details->invoice) }}"
                                                                download class="btn">
                                                                <i class="fas fa-download"></i>{{ __('Invoice') }}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="billing-add-area">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="main-info">
                                                        <h5>{{ __('User Information') }}</h5>
                                                        <ul class="list">
                                                            <li>
                                                                <p>
                                                                    <strong>{{ __('Name') . ':' }}</strong>
                                                                    {{ $userInfo->first_name . ' ' . $userInfo->last_name }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('Email') . ':' }}</strong>
                                                                    {{ $userInfo->email }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('Phone') . ':' }}</strong>
                                                                    {{ $userInfo->contact_number }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('Address') . ':' }}</strong>
                                                                    {{ $userInfo->address }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('City') . ':' }}</strong>
                                                                    {{ $userInfo->city }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('State') . ':' }}</strong>
                                                                    {{ $userInfo->state }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('Country') . ':' }}</strong>
                                                                    {{ $userInfo->country }}
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                @php
                                                    $position = $details->currency_symbol_position;
                                                    $symbol = $details->currency_symbol;
                                                @endphp

                                                <div class="col-md-6">
                                                    <div class="main-info">
                                                        <h5>{{ __('Payment Information') }}</h5>
                                                        <ul class="list">
                                                            <li>
                                                                <p><strong>{{ __('Total Rent') . ':' }}</strong>
                                                                    <span class="amount">
                                                                        {{ $position == 'left' ? $symbol : '' }}{{ $details->total_rent }}{{ $position == 'right' ? $symbol : '' }}
                                                                    </span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p><strong>{{ __('Service Charge') . ':' }}</strong>
                                                                    <span class="amount">
                                                                        {{ $position == 'left' ? $symbol : '' }}{{ $details->service_charge }}{{ $position == 'right' ? $symbol : '' }}
                                                                    </span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p><strong>{{ __('Subtotal') . ':' }}</strong>
                                                                    <span class="amount">
                                                                        {{ $position == 'left' ? $symbol : '' }}{{ $details->subtotal }}{{ $position == 'right' ? $symbol : '' }}
                                                                    </span>
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p>
                                                                    <strong>{{ __('Discount') }} (<i
                                                                            class="far fa-minus text-success"></i>):</strong>
                                                                    <span class="amount">
                                                                        {{ $position == 'left' ? $symbol : '' }}{{ $details->discount }}{{ $position == 'right' ? $symbol : '' }}
                                                                    </span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p>
                                                                    <strong>{{ __('Tax') }} (<i
                                                                            class="far fa-plus text-success"></i>):</strong>
                                                                    <span
                                                                        class="amount">{{ $position == 'left' ? $symbol : '' }}{{ $details->tax }}{{ $position == 'right' ? $symbol : '' }}
                                                                    </span>
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('Total') . ':' }}</strong>
                                                                    <span
                                                                        class="amount">{{ $position == 'left' ? $symbol : '' }}{{ $details->grand_total }}{{ $position == 'right' ? $symbol : '' }}</span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p><strong>{{ __('Paying Amount') . ':' }}</strong>
                                                                    <span class="amount">
                                                                        {{ $position == 'left' ? $symbol : '' }}{{ $details->paying_amount }}{{ $position == 'right' ? $symbol : '' }}
                                                                    </span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p><strong>{{ __('Due') . ':' }}</strong>
                                                                    <span
                                                                        class="amount">{{ $position == 'left' ? $symbol : '' }}{{ $details->due }}{{ $position == 'right' ? $symbol : '' }}</span>
                                                                </p>
                                                            </li>

                                                            <li>
                                                                <p><strong>{{ __('Paid via') . ':' }}</strong>
                                                                    {{ $details->payment_method }}
                                                                </p>
                                                            </li>

                                                            <li>
                                                                @if ($details->payment_status == 1)
                                                                    <p><strong>{{ __('Payment Status') . ':' }}</strong>
                                                                        <span
                                                                            class="badge badge-success px-2 py-1">{{ __('Complete') }}</span>
                                                                    </p>
                                                                @elseif ($details->payment_status == 3)
                                                                    <p><strong>{{ __('Payment Status') . ':' }}</strong>
                                                                        <span class="badge badge-info px-2 py-1">
                                                                            {{ __('Partial Paid') }}
                                                                        </span>
                                                                    </p>
                                                                @elseif ($details->payment_status == 2)
                                                                    <p><strong>{{ __('Payment Status') . ':' }}</strong>
                                                                        <span class="badge badge-danger px-2 py-1">
                                                                            {{ __('Rejected') }}
                                                                        </span>
                                                                    </p>
                                                                @else
                                                                    <p><strong>{{ __('Payment Status') . ':' }}</strong><span
                                                                            class="badge badge-warning px-2 py-1">{{ __('Pending') }}</span>
                                                                    </p>
                                                                @endif
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="edit-account-info">
                                            <div class="d-flex gap-10 flex-wrap">
                                                <a href="{{ url()->previous() }}"
                                                    class="btn btn-primary">{{ __('back') }}</a>
                                                <!-- Button -->
                                                @php
                                                    $grouped = collect($details->reserved_dates_info)->groupBy('date');
                                                @endphp
                                                <button class="btn btn-primary open-room-modal" data-bs-toggle="modal"
                                                    data-bs-target="#roomModal">{{ __('View Room') }}</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- Room Booking Details Area End -->

        <!-- Modal -->
        <div class="modal fade roomModal" id="roomModal" tabindex="-1" role="dialog" aria-labelledby="RoomModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title" id="RoomModalLabel">{{ __('Room Details') }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                    </div>

                    <div class="modal-body">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">{{ __('SL') }}</th>
                                    <th scope="col">{{ __('Date') }}</th>
                                    <th scope="col">{{ __('Room Numbers') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($grouped as $date => $rooms)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ \Carbon\Carbon::parse($date)->format('d M, Y') }}</td>
                                        <td>
                                            {{ collect($rooms)->pluck('room_number')->implode(', ') }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">{{ __('Close') }}</button>

                    </div>

                </div>
            </div>
        </div>
    </main>
@endsection
