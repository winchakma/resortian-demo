@extends('admin.layout')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Refunds') }}</h4>
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
                <a href="#">{{ __('Vendor\'s Room Bookings') }}</a>
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
                    <div class="row justify-content-between">
                        <div class="col-lg-6">
                            <div class="card-title d-inline-block">{{ __('Refunds') }}</div>
                        </div>
                        <div class="col-lg-3">
                            <form action="{{ route('admin.vendor_room_bookings.refunds') }}" method="GET">
                                <select name="vendor_id" class="form-control mb-2 select2" onchange="this.form.submit()">
                                    <option value="">{{ __('All Vendors') }}</option>
                                    @foreach ($vendors as $vendor)
                                        <option value="{{ $vendor->id }}"
                                            {{ (string) request()->input('vendor_id') === (string) $vendor->id ? 'selected' : '' }}>
                                            {{ $vendor->username }}
                                        </option>
                                    @endforeach
                                </select>
                            </form>
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
                                    <table class="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th scope="col">{{ __('#SL') }}</th>
                                                <th scope="col">{{ __('Vendor') }}</th>
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
                                                @php
                                                    $status = (int) $refund->status;
                                                    $vendorId = (int) ($refund->vendor_id ?? 0);

                                                    // Admin can take action only when:
                                                    // - vendor room & vendor already approved (status=1)
                                                    // - admin room (vendor_id=0) & pending (status=0)  [as per your rule]
                                                    $adminCanAct =
                                                        ($vendorId !== 0 && $status === 1) ||
                                                        ($vendorId === 0 && $status === 0);
                                                @endphp

                                                <tr>
                                                    <td>{{ ($refunds->firstItem() ?? 0) + $key }}</td>
                                                    <td>
                                                        @php
                                                            $vendorName = $vendorNames->get((int) $refund->vendor_id);
                                                        @endphp
                                                        @if (!empty($vendorName))
                                                            <a
                                                                href="{{ route('admin.vendor_management.vendor_details', ['id' => $refund->vendor_id, 'language' => $defaultLanguageCode]) }}">
                                                                {{ $vendorName }}
                                                            </a>
                                                        @else
                                                            {{ __('N/A') }}
                                                        @endif
                                                    </td>
                                                    <td>{{ $refund->customer_name }}</td>
                                                    <td>{{ $refund->customer_email }}</td>
                                                    <td>{{ $refund->customer_phone }}</td>
                                                    <td>{{ $refund->paying_amount }}</td>
                                                    <td>{{ $refund->refund_amount }}</td>

                                                    {{-- Status Badge --}}
                                                    <td>
                                                        @if ($status === 0)
                                                            <span class="badge badge-warning">{{ __('Pending') }}</span>
                                                        @elseif ($status === 1)
                                                            <span
                                                                class="badge badge-info">{{ __('Vendor Approved (Waiting Admin)') }}</span>
                                                        @elseif ($status === 2)
                                                            <span
                                                                class="badge badge-danger">{{ __('Vendor Rejected (Waiting User/Dispute)') }}</span>
                                                        @elseif ($status === 3)
                                                            <span
                                                                class="badge badge-primary">{{ __('Dispute Raised') }}</span>
                                                        @elseif ($status === 4)
                                                            <span class="badge badge-success">{{ __('Refunded') }}</span>
                                                        @elseif ($status === 5)
                                                            <span class="badge badge-secondary">{{ __('Canceled') }}</span>
                                                        @else
                                                            <span class="badge badge-secondary">{{ __('N/A') }}</span>
                                                        @endif
                                                    </td>

                                                    {{-- Actions --}}
                                                    <td>
                                                        {{-- Admin Approve/Reject dropdown --}}
                                                        @if ($adminCanAct)
                                                            <form id="refundStatusForm{{ $refund->id }}"
                                                                class="d-inline-block"
                                                                action="{{ route('admin.vendor_room_bookings.update_refund_status') }}"
                                                                method="post">
                                                                @csrf
                                                                <input type="hidden" name="refund_id"
                                                                    value="{{ $refund->id }}">

                                                                <select class="form-control form-control-sm bg-warning"
                                                                    name="status"
                                                                    onchange="document.getElementById('refundStatusForm{{ $refund->id }}').submit();">
                                                                    <option value="" selected disabled>
                                                                        {{ __('Select Action') }}</option>
                                                                    <option value="4">{{ __('Approve (Refund)') }}
                                                                    </option>
                                                                    <option value="5">{{ __('Reject') }}</option>
                                                                </select>
                                                            </form>
                                                        @else
                                                            <span>--</span>
                                                        @endif

                                                        {{-- View Refund Reason --}}
                                                        @if (!empty($refund->refund_reason))
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
                                                                                {{ __('Refund Reason') }}
                                                                            </h5>
                                                                            <button type="button" class="close"
                                                                                data-dismiss="modal" aria-label="Close">
                                                                                <span>&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div class="modal-body">
                                                                            {{ $refund->refund_reason }}
                                                                        </div>
                                                                        <div class="modal-footer">
                                                                            <button type="button" class="btn btn-secondary"
                                                                                data-dismiss="modal">{{ __('Close') }}</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        @endif

                                                        {{-- Delete only when case closed --}}
                                                        @if (in_array($status, [4, 5], true))
                                                            <form class="deleteForm d-inline-block ml-1"
                                                                action="{{ route('admin.vendor_room_bookings.refund.delete') }}"
                                                                method="post">
                                                                @csrf
                                                                <input type="hidden" name="refund_id"
                                                                    value="{{ $refund->id }}">
                                                                <button type="submit"
                                                                    class="btn btn-danger btn-sm deleteBtn">
                                                                    <span class="btn-label"><i
                                                                            class="fas fa-trash"></i></span>
                                                                    {{ __('Delete') }}
                                                                </button>
                                                            </form>
                                                        @endif
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

                <div class="card-footer">
                    <div class="row">
                        <div class="d-inline-block mx-auto">
                            {{ $refunds->appends(request()->query())->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
