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
                <a href="#">{{ __('Rooms Management') }}</a>
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
                    <div class="row">
                        <div class="col-lg-5">
                            <div class="card-title d-inline-block">{{ __('Paid Services') }}</div>
                        </div>
                        <div class="col-lg-7">
                            <a href="#" data-toggle="modal" data-target="#createModal"
                                class="btn btn-primary btn-sm float-lg-right float-left"><i class="fas fa-plus"></i>
                                {{ __('Add') }}</a>

                            <button class="btn btn-danger btn-sm float-right mr-2 d-none bulk-delete"
                                data-href="{{ route('vendor.rooms_management.paid_service.bulk_delete') }}"><i
                                    class="flaticon-interface-5"></i>
                                {{ __('Delete') }}</button>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">
                            @if (count($paidServices) == 0)
                                <h3 class="text-center">{{ __('NO SERVICE FOUND') . '!' }}</h3>
                            @else
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3" id="basic-datatables">
                                        <thead>
                                            <tr>
                                                <th scope="col">
                                                    <input type="checkbox" class="bulk-check" data-val="all">
                                                </th>
                                                <th scope="col">{{ __('Name') }}</th>
                                                <th scope="col">{{ __('Price') }}</th>
                                                <th scope="col">{{ __('Status') }}</th>
                                                <th scope="col">{{ __('Actions') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($paidServices as $service)
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" class="bulk-check"
                                                            data-val="{{ $service->id }}">
                                                    </td>
                                                    <td>{{ $service->name }}</td>
                                                    <td>
                                                        @if ($currencyInfo->base_currency_symbol_position == 'left')
                                                            {{ $currencyInfo->base_currency_symbol }}
                                                            {{ number_format($service->price, 2) }}
                                                        @else
                                                            {{ number_format($service->price, 2) }}
                                                            {{ $currencyInfo->base_currency_symbol }}
                                                        @endif
                                                    </td>

                                                    <td>
                                                        @if ($service->status)
                                                            <span class="badge badge-success">{{ __('Active') }}</span>
                                                        @else
                                                            <span class="badge badge-danger">{{ __('Deactive') }}</span>
                                                        @endif
                                                    </td>
                                                    <td>
                                                        <a class="btn btn-secondary btn-sm mr-1 editBtn" href="#"
                                                            data-toggle="modal" data-target="#editModal"
                                                            data-id="{{ $service->id }}"
                                                            data-status="{{ $service->status }}"
                                                            data-price="{{ $service->price }}"
                                                            data-name="{{ $service->name }}">
                                                            <span class="btn-label">
                                                                <i class="fas fa-edit"></i>
                                                            </span>
                                                            {{ __('Edit') }}
                                                        </a>

                                                        <form class="deleteForm d-inline-block"
                                                            action="{{ route('vendor.rooms_management.paid_service.delete') }}"
                                                            method="post">
                                                            @csrf
                                                            <input type="hidden" name="service_id"
                                                                value="{{ $service->id }}">

                                                            <button type="submit" class="btn btn-danger btn-sm deleteBtn">
                                                                <span class="btn-label">
                                                                    <i class="fas fa-trash"></i>
                                                                </span>
                                                                {{ __('Delete') }}
                                                            </button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- create modal --}}
    @include('vendors.rooms.paid-services.create')

    {{-- edit modal --}}
    @include('vendors.rooms.paid-services.edit')
@endsection
