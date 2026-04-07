@extends('vendors.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Settings') }}</h4>
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
                <a href="#">{{ __('Settings') }}</a>
            </li>
        </ul>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="card-title">{{ __('Settings') }}</div>
                        </div>
                    </div>
                </div>

                <div class="card-body pt-5 pb-5">
                    <div class="row">
                        <div class="col-lg-10 offset-lg-1">
                            <form id="ajaxForm" action="{{ route('vendor.rooms_management.settings.update_preference') }}"
                                method="post">
                                @csrf
                                <div class="row">

                                    <div class="col-6 form-group">
                                        <label>{{ __('Checkin Time') . '*' }}</label>
                                        <input type="time" name="checkin_time" class="form-control"
                                            value="{{ old('checkin_time', $data->checkin_time) }}">
                                        <p id="err_checkin_time" class="mb-0 text-danger em"></p>
                                    </div>
                                    <div class="col-6 form-group">
                                        <label>{{ __('Checkout Time') . '*' }}</label>
                                        <input type="time" name="checkout_time" class="form-control"
                                            value="{{ old('checkout_time', $data->checkout_time) }}">
                                        <p id="err_checkout_time" class="mb-0 text-danger em"></p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="row">
                        <div class="col-12 text-center">
                            <button type="submit" id="submitBtn" class="btn btn-success">
                                {{ __('Update') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
