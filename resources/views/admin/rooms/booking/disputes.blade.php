@extends('admin.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Dispute Requests') }}</h4>
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
                <a href="#">{{ __('Admin\'s Room Bookings') }}</a>
            </li>
            <li class="separator">
                <i class="flaticon-right-arrow"></i>
            </li>
            <li class="nav-item">
                <a href="#">{{ __('Disputes') }}</a>
            </li>
        </ul>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="card-title d-inline-block">{{ __('Dispute Requests') }}</div>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">
                            @if (count($refunds) == 0)
                                <h3 class="text-center">{{ __('NO DISPUTE FOUND!') }}</h3>
                            @else
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3" id="basic-datatables">
                                        <thead>
                                            <tr>
                                                <th>{{ __('#SL') }}</th>
                                                <th>{{ __('Name') }}</th>
                                                <th>{{ __('Email') }}</th>
                                                <th>{{ __('Phone') }}</th>
                                                <th>{{ __('Paying Amount') }} ({{ $currencyInfo->base_currency_text }})
                                                </th>
                                                <th>{{ __('Refund Amount') }} ({{ $currencyInfo->base_currency_text }})
                                                </th>
                                                <th>{{ __('Status') }}</th>
                                                <th>{{ __('Actions') }}</th>
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
                                                        <span class="badge badge-primary">
                                                            {{ __('Dispute Raised') }}
                                                        </span>
                                                    </td>

                                                    {{-- Actions --}}
                                                    <td>
                                                        {{-- Admin decision --}}
                                                        <form id="disputeStatusForm{{ $refund->id }}"
                                                            class="d-inline-block"
                                                            action="{{ route('admin.room_bookings.update_refund_status') }}"
                                                            method="post">
                                                            @csrf
                                                            <input type="hidden" name="refund_id"
                                                                value="{{ $refund->id }}">

                                                            <select class="form-control form-control-sm bg-warning"
                                                                name="status"
                                                                onchange="document.getElementById('disputeStatusForm{{ $refund->id }}').submit();">
                                                                <option value="" selected disabled>
                                                                    {{ __('Select Action') }}
                                                                </option>
                                                                <option value="4">{{ __('Approve (Refund)') }}
                                                                </option>
                                                                <option value="5">{{ __('Reject') }}</option>
                                                            </select>
                                                        </form>

                                                        {{-- View Dispute Reason --}}
                                                        @if (!empty($refund->dispute_message))
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
                                                                                {{ __('Dispute Message') }}
                                                                            </h5>
                                                                            <button type="button" class="close"
                                                                                data-dismiss="modal" aria-label="Close">
                                                                                <span>&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div class="modal-body">
                                                                            {{ $refund->dispute_message }}
                                                                        </div>
                                                                        <div class="modal-footer">
                                                                            <button type="button" class="btn btn-secondary"
                                                                                data-dismiss="modal">
                                                                                {{ __('Close') }}
                                                                            </button>
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
                                            {{ __('Note: Disputes are raised by customers after vendor rejection. Admin decision here is final.') }}
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
