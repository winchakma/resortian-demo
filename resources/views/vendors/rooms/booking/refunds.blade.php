@extends('vendors.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Refunds') }}</h4>
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
                <a href="#">{{ __('Refunds') }}</a>
            </li>
        </ul>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="card-title d-inline-block">{{ __('Refunds') }}</div>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">
                            @if (count($refunds) == 0)
                                <h3 class="text-center">{{ __('NO REQUEST FOUND') . '!' }}</h3>
                            @else
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3" id="basic-datatables">
                                        <thead>
                                            <tr>
                                                <th scope="col">{{ __('#SL') }}</th>
                                                <th scope="col">{{ __('Name') }}</th>
                                                <th scope="col">{{ __('Email') }}</th>
                                                <th scope="col">{{ __('Phone') }}</th>
                                                <th scope="col">{{ __('Paying Amount') }}
                                                    ({{ $currencyInfo->base_currency_text }})</th>
                                                <th scope="col">{{ __('Refund Amount') }}
                                                    ({{ $currencyInfo->base_currency_text }})</th>
                                                <th scope="col">{{ __('Status') }}</th>
                                                <th scope="col">{{ __('Actions') }}</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            @foreach ($refunds as $key => $refund)
                                                <tr>
                                                    <td>{{ $key + 1 }}</td>
                                                    <td>{{ $refund->customer_name }}</td>
                                                    <td>{{ $refund->customer_email }}</td>
                                                    <td>{{ $refund->customer_phone }}</td>
                                                    <td>{{ $refund->paying_amount }}</td>
                                                    <td>{{ $refund->refund_amount }}</td>

                                                    {{-- Status --}}
                                                    <td>

                                                        @if ($refund->status == 0)
                                                            <span class="badge badge-warning">{{ __('Pending') }}</span>
                                                        @elseif ($refund->status == 1)
                                                            <span
                                                                class="badge badge-info">{{ __('Vendor Approved (Waiting Admin)') }}</span>
                                                        @elseif ($refund->status == 2)
                                                            <span
                                                                class="badge badge-danger">{{ __('Vendor Rejected (Waiting User/Dispute)') }}</span>
                                                        @elseif ($refund->status == 3)
                                                            <span
                                                                class="badge badge-primary">{{ __('Dispute Raised') }}</span>
                                                        @elseif ($refund->status == 4)
                                                            <span class="badge badge-success">{{ __('Refunded') }}</span>
                                                        @elseif ($refund->status == 5)
                                                            <span class="badge badge-secondary">{{ __('Canceled') }}</span>
                                                        @else
                                                            <span class="badge badge-secondary">{{ __('N/A') }}</span>
                                                        @endif
                                                    </td>

                                                    {{-- Actions --}}
                                                    <td>
                                                        {{-- Vendor action only when Pending (0) --}}
                                                        @if ((int) $refund->status === 0)
                                                            <form id="refundStatusForm{{ $refund->id }}"
                                                                class="d-inline-block"
                                                                action="{{ route('vendor.room_bookings.update_refund_status') }}"
                                                                method="post">
                                                                @csrf
                                                                <input type="hidden" name="refund_id"
                                                                    value="{{ $refund->id }}">

                                                                <select class="form-control form-control-sm bg-warning"
                                                                    name="status"
                                                                    onchange="document.getElementById('refundStatusForm{{ $refund->id }}').submit();">
                                                                    <option value="" selected disabled>
                                                                        {{ __('Select Action') }}
                                                                    </option>
                                                                    <option value="1">{{ __('Approve') }}</option>
                                                                    <option value="2">{{ __('Reject') }}</option>
                                                                </select>
                                                            </form>
                                                        @else
                                                            --
                                                        @endif

                                                        {{-- View Refund Reason (if any) --}}
                                                        @if ($refund->refund_reason)
                                                            <button type="button" class="btn btn-info btn-sm ml-1"
                                                                data-toggle="modal"
                                                                data-target="#refundMsgModal{{ $refund->id }}">
                                                                <i class="fas fa-eye"></i> {{ __('View') }}
                                                            </button>

                                                            <div class="modal fade" id="refundMsgModal{{ $refund->id }}"
                                                                tabindex="-1" role="dialog"
                                                                aria-labelledby="refundMsgModalLabel{{ $refund->id }}"
                                                                aria-hidden="true">
                                                                <div class="modal-dialog modal-dialog-centered"
                                                                    role="document">
                                                                    <div class="modal-content">
                                                                        <div class="modal-header">
                                                                            <h5 class="modal-title"
                                                                                id="refundMsgModalLabel{{ $refund->id }}">
                                                                                {{ __('Refund Reason') }}</h5>
                                                                            <button type="button" class="close"
                                                                                data-dismiss="modal" aria-label="Close">
                                                                                <span>&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div class="modal-body">
                                                                            {{ $refund->refund_reason ?? __('No message provided.') }}
                                                                        </div>
                                                                        <div class="modal-footer">
                                                                            <button type="button" class="btn btn-secondary"
                                                                                data-dismiss="modal">{{ __('Close') }}</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        @endif
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>

                                    <div class="mt-2">
                                        <small class="text-muted">
                                            {{ __('Note: Pending requests require your action. After approval, the request is sent to admin for final decision.') }}
                                        </small>
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
