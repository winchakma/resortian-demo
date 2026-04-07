@extends('admin.layout')

@section('content')
  <div class="page-header">
    <h4 class="page-title">{{ __('Preference') }}</h4>
    <ul class="breadcrumbs">
      <li class="nav-home">
        <a href="{{ route('admin.dashboard') }}">
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
      <li class="separator">
        <i class="flaticon-right-arrow"></i>
      </li>
      <li class="nav-item">
        <a href="#">{{ __('Preference') }}</a>
      </li>
    </ul>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-4">
              <div class="card-title">{{ __('Preference') }}</div>
            </div>
          </div>
        </div>

        <div class="card-body pt-5 pb-5">
          <div class="row">
            <div class="col-lg-10 offset-lg-1">
              <form id="ajaxForm" action="{{ route('admin.rooms_management.settings.update_preference') }}"
                method="post">
                @csrf
                <div class="row">
                  <div class="col-6 form-group">
                    <label>{{ __('Rating Status') . '*' }}</label>
                    <div class="selectgroup w-100">
                      <label class="selectgroup-item">
                        <input type="radio" name="room_rating_status" value="1" class="selectgroup-input"
                          {{ $data->room_rating_status == 1 ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Active') }}</span>
                      </label>

                      <label class="selectgroup-item">
                        <input type="radio" name="room_rating_status" value="0" class="selectgroup-input"
                          {{ $data->room_rating_status == 0 ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Deactive') }}</span>
                      </label>
                    </div>
                    <p id="err_room_rating_status" class="mb-0 text-danger em"></p>

                    <p class="text-warning mt-2 mb-0">
                      {{ __('Specify whether the rating system for room will be active or not.') }}
                    </p>
                  </div>
                  <div class="col-6 form-group">
                    <label>{{ __('Guest Checkout Status') . '*' }}</label>
                    <div class="selectgroup w-100">
                      <label class="selectgroup-item">
                        <input type="radio" name="room_guest_checkout_status" value="1" class="selectgroup-input"
                          {{ $data->room_guest_checkout_status == 1 ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Active') }}</span>
                      </label>

                      <label class="selectgroup-item">
                        <input type="radio" name="room_guest_checkout_status" value="0" class="selectgroup-input"
                          {{ $data->room_guest_checkout_status == 0 ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Deactive') }}</span>
                      </label>
                    </div>
                    <p id="err_room_guest_checkout_status" class="mb-0 text-danger em"></p>

                    <p class="text-warning mt-2 mb-0">
                      {{ __('If guest checkout is active, then users can checkout without login.') }}
                    </p>
                  </div>


                  <div class="col-6 form-group">
                    <label>{{ __('Booking Auto Approval') . '*' }}</label>
                    <div class="selectgroup w-100">
                      <label class="selectgroup-item">
                        <input type="radio" name="room_auto_approval" value="1" class="selectgroup-input"
                          {{ $data->room_auto_approval == 1 ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Active') }}</span>
                      </label>

                      <label class="selectgroup-item">
                        <input type="radio" name="room_auto_approval" value="0" class="selectgroup-input"
                          {{ $data->room_auto_approval == 0 ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Deactive') }}</span>
                      </label>
                    </div>
                    <p id="err_room_auto_approval" class="mb-0 text-danger em"></p>
                  </div>
                  <div class="col-6 form-group">
                    <label>{{ __('Tax (%)') . '*' }}</label>
                    <input type="number" step="0.01" name="tax" class="form-control"
                      value="{{ old('tax', $data->tax) }}">
                    <p id="err_tax" class="mb-0 text-danger em"></p>
                  </div>
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
                  <div class="col-6 form-group">
                    <label>{{ __('Room Booking Cancellation') . '*' }}</label>
                    <div class="selectgroup w-100">
                      <label class="selectgroup-item">
                        <input type="radio" name="room_booking_cancellation" value="active"
                          class="selectgroup-input" {{ $data->room_booking_cancellation == 'active' ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Active') }}</span>
                      </label>

                      <label class="selectgroup-item">
                        <input type="radio" name="room_booking_cancellation" value="deactive"
                          class="selectgroup-input"
                          {{ $data->room_booking_cancellation == 'deactive' ? 'checked' : '' }}>
                        <span class="selectgroup-button">{{ __('Deactive') }}</span>
                      </label>
                    </div>
                    <p id="err_room_booking_cancellation" class="mb-0 text-danger em"></p>
                  </div>

                  <div class="col-6 form-group mt-3">
                    <label for="cancellation_time_limit_hours">
                      {{ __('Cancellation Time Limit Before Check-in (in hours)') }}
                    </label>
                    <input type="number" name="cancellation_time_limit_hours" id="cancellation_time_limit_hours"
                      class="form-control" value="{{ $data->cancellation_time_limit_hours }}">
                    <p id="err_cancellation_time_limit_hours" class="mb-0 text-danger em"></p>
                  </div>

                  <div class="col-6 form-group mt-3">
                    <label for="cancellation_refund_percentage">{{ __('Refund Percentage (%)') }}</label>
                    <input type="number" name="cancellation_refund_percentage" id="cancellation_refund_percentage"
                      class="form-control" value="{{ $data->cancellation_refund_percentage }}" min="0"
                      max="100">
                    <p id="err_cancellation_refund_percentage" class="mb-0 text-danger em"></p>
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
