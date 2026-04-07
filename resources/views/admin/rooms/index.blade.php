@extends('admin.layout')

{{-- this style will be applied when the direction of language is right-to-left --}}
@includeIf('admin.partials.rtl_style')

@section('content')
    <div class="page-header">
        <h4 class="page-title">{{ __('Rooms') }}</h4>
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
                <a href="#">{{ __('Rooms') }}</a>
            </li>
        </ul>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="card-title d-inline-block">{{ __('Rooms') }}</div>
                        </div>
                        <div class="col-lg-6">
                            <form action="" method="get" id="Form">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <select name="vendor_id" class="form-control select2"
                                            onchange="document.getElementById('Form').submit()">
                                            <option value="" selected>{{ __('All') }}</option>
                                            <option value="admin" @selected(request()->input('vendor_id') == 'admin')>{{ __('Admin') }}</option>
                                            @foreach ($vendors as $vendor)
                                                <option @selected(request()->input('vendor_id') == $vendor->id) value="{{ $vendor->id }}">
                                                    {{ $vendor->username }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="col-lg-3">
                            <a href="#" data-toggle="modal" data-target="#createModal"
                                class="btn btn-primary btn-sm float-lg-right float-left"><i class="fas fa-plus"></i>
                                {{ __('Add') }}</a>

                            <button class="btn btn-danger btn-sm float-right mr-2 d-none bulk-delete"
                                data-href="{{ route('admin.rooms_management.room.bulk_delete') }}"><i
                                    class="flaticon-interface-5"></i>
                                {{ __('Delete') }}</button>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12">
                            @if ($rooms->isEmpty())
                                <h3 class="text-center">{{ __('NO ROOM FOUND!') }}</h3>
                            @else
                                <div class="table-responsive">
                                    <table class="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th scope="col">
                                                    <input type="checkbox" class="bulk-check" data-val="all">
                                                </th>
                                                <th scope="col">{{ __('Room Number') }}</th>
                                                <th scope="col">{{ __('Category') }}</th>
                                                <th scope="col">{{ __('Vendor') }}</th>
                                                <th scope="col">{{ __('Status') }}</th>
                                                <th scope="col">{{ __('Actions') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach ($rooms as $room)
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" class="bulk-check"
                                                            data-val="{{ $room->id }}">
                                                    </td>
                                                    <td>{{ $room->room_number }}</td>
                                                    <td>{{ $room->categoryContents->first()->title ?? 'N/A' }}</td>
                                                    <td>
                                                        @if ((int) ($room->vendor_id ?? 0) === 0)
                                                            <span class="badge badge-success">{{ __('Admin') }}</span>
                                                        @elseif (!empty($room->vendor))
                                                            <a
                                                                href="{{ route('admin.vendor_management.vendor_details', ['id' => $room->vendor->id, 'language' => $defaultLanguageCode]) }}">
                                                                {{ $room->vendor->username }}
                                                            </a>
                                                        @else
                                                            {{ __('N/A') }}
                                                        @endif
                                                    </td>
                                                    <td>
                                                        @if ($room->status)
                                                            <span class="badge badge-success">{{ __('Active') }}</span>
                                                        @else
                                                            <span class="badge badge-danger">{{ __('Deactive') }}</span>
                                                        @endif
                                                    </td>
                                                    <td>
                                                        <a class="btn btn-secondary btn-sm mr-1 editBtn" href="#"
                                                            data-toggle="modal" data-target="#editModal"
                                                            data-id="{{ $room->id }}"
                                                            data-room_category_id="{{ $room->room_category_id }}"
                                                            data-status="{{ $room->status }}"
                                                            data-room_number="{{ $room->room_number }}">
                                                            <span class="btn-label">
                                                                <i class="fas fa-edit"></i>
                                                            </span>
                                                            {{ __('Edit') }}
                                                        </a>

                                                        <form class="deleteForm d-inline-block"
                                                            action="{{ route('admin.rooms_management.room.delete') }}"
                                                            method="post">
                                                            @csrf
                                                            <input type="hidden" name="room_id"
                                                                value="{{ $room->id }}">

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

                @if (!$rooms->isEmpty())
                    <div class="card-footer">
                        <div class="row">
                            <div class="d-inline-block mx-auto">
                                {{ $rooms->appends(request()->query())->links() }}
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    {{-- create modal --}}
    @include('admin.rooms.create')

    {{-- edit modal --}}
    @include('admin.rooms.edit')
@endsection

@section('script')
    <script>
        $(function() {
            const initModalSelect2 = function(selector, modalSelector) {
                const $select = $(selector);
                if (!$select.length || !$.fn.select2) {
                    return;
                }

                if ($select.hasClass('select2-hidden-accessible')) {
                    $select.select2('destroy');
                }

                $select.select2({
                    width: '100%',
                    dropdownParent: $(modalSelector)
                });
            };

            $('#createModal').on('shown.bs.modal', function() {
                initModalSelect2('#language', '#createModal');
            });

            $('#editModal').on('shown.bs.modal', function() {
                initModalSelect2('#in_room_category_id', '#editModal');
            });
        });
    </script>
@endsection
