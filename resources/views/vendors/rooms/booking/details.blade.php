@extends('vendors.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Booking Details') }}</h4>
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
                <a href="#">{{ __('Booking Details') }}</a>
            </li>
        </ul>
        <a href="{{ route('vendor.room_bookings.all_bookings') }}" class="btn btn-primary ml-auto">
            <span class="btn-label">
                <i class="fas fa-backward"></i>
            </span>
            {{ __('Back') }}
        </a>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title d-inline-block">{{ __('Booking No') . ':' }}
                                #{{ $details->booking_number }} </div>
                        </div>
                        <div class="card-body">
                            <div class="container">

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Booking Date') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ date_format($details->created_at, 'F d, Y') }}
                                    </div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Room Category') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $roomTitle }}</div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Total Rent') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->currency_symbol }} {{ number_format($details->total_rent, 2) }}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Service Charge') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->currency_symbol }} {{ number_format($details->service_charge, 2) }}
                                    </div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Discount') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->currency_symbol }} {{ number_format($details->discount, 2) }}
                                    </div>
                                </div>
                                <hr>

                                @if ($details->tax > 0 || $userBs->room_tax_status == 1)
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <strong>{{ __('Tax') . ' (' . $details->tax_percentage . '%) :' }}</strong>
                                        </div>
                                        <div class="col-lg-8">
                                            {{ $details->currency_symbol }} {{ number_format($details->tax, 2) }}
                                        </div>
                                    </div>
                                    <hr>
                                @endif

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Total') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->currency_symbol }} {{ $details->grand_total }}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Paying Amount') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->currency_symbol }} {{ $details->paying_amount }}
                                    </div>
                                </div>
                                <hr>
                                @if ($details->vendor_id != 0)
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <strong>{{ __('Vendor Received') }} :</strong>
                                        </div>
                                        <div class="col-lg-8">
                                            {{ $details->currency_symbol }}
                                            {{ number_format($details->vendor_paid_amount, 2) }}
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="row">
                                        <div class="col-lg-4">
                                            <strong>{{ __('Vendor Due') }} :</strong>
                                        </div>
                                        <div class="col-lg-8">
                                            {{ $details->currency_symbol }}
                                            {{ number_format($details->vendor_due_amount, 2) }}
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="row">
                                        <div class="col-lg-4">
                                            <strong>{{ __('Admin Received') }} :</strong>
                                        </div>
                                        <div class="col-lg-8">
                                            {{ $details->currency_symbol }}
                                            {{ number_format($details->admin_paid_commission, 2) }}
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="row">
                                        <div class="col-lg-4">
                                            <strong>{{ __('Admin Due') }} :</strong>
                                        </div>
                                        <div class="col-lg-8">
                                            {{ $details->currency_symbol }}
                                            {{ number_format($details->admin_due_commission, 2) }}
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="row">
                                        <div class="col-lg-4">
                                            <strong>{{ __('Total Commission') }} :</strong>
                                        </div>
                                        <div class="col-lg-8">
                                            {{ $details->currency_symbol }} {{ number_format($details->comission, 2) }}
                                        </div>
                                    </div>
                                    <hr>
                                @endif
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Due') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->currency_symbol }} {{ $details->due }}
                                    </div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Payment Method') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8"><span
                                            class="badge badge-success">{{ __($details->payment_method) }} </span>
                                    </div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Payment Status') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        @if ($details->payment_status == 1)
                                            <span class="badge badge-success">{{ __('Full Paid') }}</span>
                                        @elseif ($details->payment_status == 3)
                                            <span class="badge badge-info">{{ __('Partial Paid') }}</span>
                                        @elseif ($details->payment_status == 2)
                                            <span class="badge badge-danger">{{ __('Rejected') }}</span>
                                        @else
                                            <span class="badge badge-warning">{{ __('Pending') }}</span>
                                        @endif
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title d-inline-block">{{ __('Booking Information') }}</div>
                        </div>
                        <div class="card-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Arrival Date') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ \Carbon\Carbon::parse($details->arrival_date)->format('F d, Y') }}</div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Departure Date') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ \Carbon\Carbon::parse($details->departure_date)->format('F d, Y') }}
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Total Room') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">
                                        {{ $details->total_rooms }}
                                    </div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Number Of Adult') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $details->adult }}</div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Number Of Child') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $details->child }}</div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Number Of Nights') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $interval }}</div>
                                </div>
                                <hr>
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title d-inline-block">{{ __('Billing Details') }}</div>
                        </div>
                        <div class="card-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Name') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $details->customer_name }}</div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Email') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $details->customer_email }}</div>
                                </div>
                                <hr>

                                <div class="row">
                                    <div class="col-lg-4">
                                        <strong>{{ __('Contact Number') . ':' }}</strong>
                                    </div>
                                    <div class="col-lg-8">{{ $details->customer_phone }}</div>
                                </div>
                                <hr>
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title d-inline-block">{{ __('Room Numbers') }}</div>

                        </div>
                        <div class="card-body">
                            @php
                                $position = $details->currency_text_position;
                                $currency = $details->currency_text;
                            @endphp
                            @php
                                $grouped = collect($details->reserved_dates_info)->groupBy('date');
                            @endphp

                            <table class="table table-striped mb-20 table-bordered">
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
                        <div class="card-footer">

                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title d-inline-block">{{ __('Paid Services') }}</div>

                        </div>
                        @php
                            $details['paidServices'] = $details->paid_services;
                            $paidServices = $details['paidServices'];
                        @endphp
                        <div class="card-body">
                            @if (is_array($paidServices) && count($paidServices) == 0)
                                <h3 class="text-center">{{ __('NO SERVICE FOUND') . '!' }}</h3>
                            @elseif (is_array($paidServices))
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th>{{ __('Date') }}</th>
                                                <th>{{ __('Room Number') }}</th>
                                                <th>{{ __('Service') }}</th>
                                                <th>{{ __('Price') }}</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            @php
                                                $symbol = $currencyInfo->base_currency_symbol;
                                                $symbolPosition = $currencyInfo->base_currency_symbol_position;
                                            @endphp

                                            @foreach ($paidServices as $service)
                                                @php
                                                    $unitPrice = $service['unit_price'] ?? ($service['price'] ?? 0);
                                                    $quantity = $service['quantity'] ?? 1;
                                                    $total = $unitPrice * $quantity;

                                                    $format = function ($amount) use ($symbol, $symbolPosition) {
                                                        return $symbolPosition == 'left'
                                                            ? $symbol . number_format($amount, 2)
                                                            : number_format($amount, 2) . $symbol;
                                                    };
                                                @endphp

                                                <tr>
                                                    <td>
                                                        {{ isset($service['date']) ? \Carbon\Carbon::parse($service['date'])->format('d M, Y') : '-' }}
                                                    </td>

                                                    <td>{{ $service['room'] ?? '-' }}</td>

                                                    <td>{{ $service['service'] ?? '-' }}</td>

                                                    <td>
                                                        <small class="text-muted">
                                                            {{ $format($unitPrice) }} × {{ $quantity }}
                                                        </small>
                                                        <br>
                                                        <strong>{{ $format($total) }}</strong>
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            @else
                                <h3 class="text-center">{{ __('NO SERVICE FOUND') . '!' }}</h3>
                            @endif

                        </div>
                        <div class="card-footer">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
