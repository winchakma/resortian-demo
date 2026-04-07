@extends('vendors.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Paid Services') }}</h4>
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
                <a href="#">{{ __('Paid Services') }}</a>
            </li>
        </ul>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="row w-100 align-items-center">
                        <div class="col-md-7">
                            <h5 class="card-title mb-0 d-inline-block">{{ __('Additional Services') }}</h5>
                        </div>
                        <div class="col-md-5 text-md-right mt-2 mt-md-0">
                            <a href="#" data-toggle="modal" data-target="#createModal" class="btn btn-primary btn-sm">
                                <i class="fas fa-plus"></i> {{ __('Add Service') }}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">

                            @if (is_array($paidServices) && count($paidServices) == 0)
                                <h3 class="text-center">{{ __('NO SERVICE FOUND!') }}</h3>
                            @elseif (is_array($paidServices))
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3" id="basic-datatables">
                                        <thead>
                                            <tr>
                                                <th>{{ __('Date') }}</th>
                                                <th>{{ __('Room') }}</th>
                                                <th>{{ __('Service') }}</th>
                                                <th>{{ __('Quantity') }}</th>
                                                <th>{{ __('Unit Price') }}</th>
                                                <th>{{ __('Total Price') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @php
                                                $symbol = $currencyInfo->base_currency_symbol;
                                                $symbolPosition = $currencyInfo->base_currency_symbol_position;
                                                $totalServiceAmount = 0;
                                            @endphp

                                            @foreach ($paidServices as $service)
                                                @php
                                                    $unitPrice = $service['unit_price'] ?? 0;
                                                    $totalPrice = $service['total_price'] ?? 0;

                                                    $totalServiceAmount += $totalPrice;

                                                    $formattedUnit =
                                                        $symbolPosition == 'left'
                                                            ? $symbol . number_format($unitPrice, 2)
                                                            : number_format($unitPrice, 2) . $symbol;

                                                    $formattedTotal =
                                                        $symbolPosition == 'left'
                                                            ? $symbol . number_format($totalPrice, 2)
                                                            : number_format($totalPrice, 2) . $symbol;
                                                @endphp

                                                <tr>
                                                    <td>
                                                        {{ isset($service['date']) ? \Carbon\Carbon::parse($service['date'])->format('d M, Y') : '-' }}
                                                    </td>
                                                    <td>{{ $service['room'] ?? '-' }}</td>
                                                    <td>{{ $service['service'] ?? '-' }}</td>
                                                    <td>{{ $service['quantity'] ?? 1 }}</td>
                                                    <td>{{ $formattedUnit }}</td>
                                                    <td>{{ $formattedTotal }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>

                                        <tfoot>
                                            <tr>
                                                <th colspan="5" class="text-right">{{ __('Total') }}</th>
                                                <th>
                                                    {{ $symbolPosition == 'left'
                                                        ? $symbol . number_format($totalServiceAmount, 2)
                                                        : number_format($totalServiceAmount, 2) . $symbol }}
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            @else
                                <h3 class="text-center">{{ __('NO SERVICE FOUND!') }}</h3>
                            @endif

                        </div>
                    </div>
                </div>

                <div class="card-footer"></div>
            </div>
        </div>
    </div>
    {{-- create modal --}}
    @include('vendors.rooms.booking.add-service')
    {{-- paid services list --}}
@endsection
