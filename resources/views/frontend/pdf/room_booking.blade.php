<!DOCTYPE html>
<html>

<head lang="en">
    {{-- required meta tags --}}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    {{-- title --}}
    <title>{{ 'Room Booking Invoice | ' . config('app.name') }}</title>

    {{-- fav icon --}}
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/img/' . $websiteInfo->favicon) }}">
    @php
        $mb_30 = '35px';
    @endphp

    <link rel="stylesheet" href="{{ asset('assets/css/invoice.css') }}">
</head>

<body>
    <div class="room-booking-invoice my-5">
        <div class="invoice-container">
            <div class="header clearfix">
                <div class="logo">
                    <img src="{{ asset('assets/img/' . $websiteInfo->logo) }}" alt="Company Logo">
                </div>

                <h2 class="invoice-title">
                    {{ __('INVOICE') }}
                </h2>
            </div>

            <table class="table header-table mb-20 table-bordered">
                <tbody>
                    <td>
                        <p class="d-inline-block mb-0"><strong>{{ __('Booking Date:') }}</strong>
                            {{ \Carbon\Carbon::parse($bookingInfo->created_at)->format('d M, Y') }}</p>
                    </td>
                    <td class="text-end">
                        <p class="d-inline-block mb-0"><strong>{{ __('Invoice No:') }}</strong>
                            #{{ $bookingInfo->booking_number }}
                        </p>
                    </td>
                </tbody>
            </table>

            <div class="booking-info clearfix">
                <ul class="booking-to float-left mb-30">
                    <h5>TO:</h5>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Name') . ':' }}</h6>
                        <h6 class="d-inline-block fw-medium gray">{{ $bookingInfo->customer_name }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Phone') . ':' }}</h6>
                        <h6 class="d-inline-block fw-medium gray">{{ $bookingInfo->customer_phone }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Email') . ':' }}</h6>
                        <h6 class="d-inline-block fw-medium gray">{{ $bookingInfo->customer_email }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Check In Date') . ':' }}</h6>
                        <h6 class="d-inline-block fw-medium gray">
                            {{ \Carbon\Carbon::parse($bookingInfo->arrival_date)->format('d M, Y') }}
                        </h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Check Out Date') . ':' }}</h6>
                        <h6 class="d-inline-block fw-medium gray">
                            {{ \Carbon\Carbon::parse($bookingInfo->departure_date)->format('d M, Y') }}
                        </h6>
                    </li>
                </ul>
                <ul class="booking-from float-right mb-30">
                    <h5>{{ __('FROM') . ':' }}</h5>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ $bs->website_title }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ $bs->support_contact }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ $bs->support_email }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ $bs->address }}</h6>
                    </li>
                </ul>
            </div>
            @php
                $position = $bookingInfo->currency_text_position;
                $currency = $bookingInfo->currency_text;
            @endphp
            @php
                $grouped = collect($bookingInfo->reserved_dates_info)->groupBy('date');
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

            <div class="payment-area clearfix">
                <ul class="payment-method float-left">
                    <li>
                        <h5 class="d-inline-block">{{ __('Payment Method:') }}</h5>
                        <h5 class="d-inline-block">{{ $bookingInfo->payment_method }}</h5>
                    </li>
                    <li>
                        <h5 class="d-inline-block me-2">{{ __('Payment Status:') }}</h5>
                        @if ($bookingInfo->payment_status == 1)
                            <h5 class="d-inline-block text-success">{{ __('Complete') }}</h5>
                        @elseif ($bookingInfo->payment_status == 3)
                            <h5 class="d-inline-block text-info">{{ __('Partial Paid') }}</h5>
                        @elseif ($bookingInfo->payment_status == 0)
                            <h5 class="d-inline-block text-warning">{{ __('Pending') }}</h5>
                        @else
                            <h5 class="text-danger d-inline-block ">{{ __('Rejected') }}</h5>
                        @endif
                    </li>
                </ul>

                <ul class="payment-info float-right text-end mb-30">
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Total Rent:') }}</h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->total_rent }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Service Charge:') }}</h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->service_charge }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Sub Total:') }}</h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->subtotal }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Discount:') }}</h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->discount }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Tax') }} ({{ $bookingInfo->tax_percentage }}
                            %) :</h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->tax }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Grand Total:') }} </h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->grand_total }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Paying Amount:') }} </h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->paying_amount }}</h6>
                    </li>
                    <li>
                        <h6 class="d-inline-block fw-semibold">{{ __('Due:') }} </h6>
                        <h6 class="d-inline-block fw-medium">{{ $bookingInfo->due }}</h6>
                    </li>
                </ul>
            </div>
            <p class="text-center"> {{ __('Dear') }} {{ $bookingInfo->customer_name }},
                {{ __('thank you for choosing') }} <a href="#">{{ $bs->website_title }}</a> </p>
        </div>
    </div>
</body>
</html>
