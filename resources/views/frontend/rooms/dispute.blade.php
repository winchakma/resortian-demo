@extends('frontend.layout')

@section('pageHeading')
    {{ __('Create Dispute') }}
@endsection

@section('content')
    <main>
        <!-- Breadcrumb Section Start -->
        <section class="breadcrumb-area d-flex align-items-center position-relative bg-img-center"
            style="background-image: url({{ asset('assets/img/' . $breadcrumbInfo->breadcrumb) }});">
            <div class="container">
                <div class="breadcrumb-content text-center">
                    <h1>{{ __('Dispute') }}</h1>
                </div>
            </div>
        </section>
        <!-- Breadcrumb Section End -->

        {{-- dispute create form start --}}
        <div class="purchase-message dispute-message">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="purchase-success">
                            <div class="icon text-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>

                            <h2>{{ __('Create Dispute') }}</h2>

                            <p class="mb-4">
                                {{ __('Your refund request was rejected by the vendor. Please write your message below so the admin team can review your dispute.') }}
                            </p>

                            {{-- success flash --}}
                            @if (session('success'))
                                <div class="alert alert-success">
                                    {{ session('success') }}
                                </div>
                            @endif

                            {{-- error list --}}
                            @if ($errors->any())
                                <div class="alert alert-danger">
                                    <ul class="mb-0">
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif

                            <form action="{{ route('frontend.room_booking.cancel.dispute.store') }}" method="POST">
                                @csrf

                                <input type="hidden" name="refund_id" value="{{ $refund->id }}">
                                <input type="hidden" name="booking_id" value="{{ $booking->id }}">

                                <div class="form-group">
                                    <label>{{ __('Room') }}</label>
                                    <input type="text" class="form-control" value="{{ $roomTitle ?? '' }}" readonly>
                                </div>

                                <div class="form-group">
                                    <label>{{ __('Booking Number') }}</label>
                                    <input type="text" class="form-control"
                                        value="{{ $booking->booking_number ?? $booking->id }}" readonly>
                                </div>

                                <div class="form-group">
                                    <label>{{ __('Reason') . '*' }}</label>
                                    <textarea name="reason" class="form-control" rows="5"
                                        placeholder="{{ __('Write why you disagree with the refund rejection...') }}">{{ old('reason') }}</textarea>

                                    @error('reason')
                                        <p class="mt-1 mb-0 text-danger">{{ $message }}</p>
                                    @enderror
                                </div>


                                <div class="form-group mt-4 d-flex justify-content-center gap-2">
                                    <button type="submit" class="btn btn-primary">
                                        {{ __('Submit Dispute') }}
                                    </button>

                                    <a href="{{ route('index') }}" class="btn btn-secondary ml-2">
                                        {{ __('Home') }}
                                    </a>
                                </div>
                            </form>

                            <p class="mt-4">
                                {{ __('Thank you. Our team will review your dispute and contact you via email.') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {{-- dispute create form end --}}
    </main>
@endsection
