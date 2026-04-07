@extends('vendors.layout')

@section('content')
  <div class="page-header">
    <h4 class="page-title">{{ __('Rooms') }}</h4>
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
        <a href="#">{{ __('Rooms') }}</a>
      </li>
    </ul>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-6">
              <div class="card-title d-inline-block">{{ __('Rooms') }}</div>
            </div>

            <div class="col-lg-6">
              <a href="#" data-toggle="modal" data-target="#createModal"
                class="btn btn-primary btn-sm float-lg-right float-left"><i class="fas fa-plus"></i>
                {{ __('Add') }}</a>

              <button class="btn btn-danger btn-sm float-right mr-2 d-none bulk-delete"
                data-href="{{ route('vendor.rooms_management.room.bulk_delete') }}"><i class="flaticon-interface-5"></i>
                {{ __('Delete') }}</button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-lg-12">
              @if (count($rooms) == 0)
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
                        <th scope="col">{{ __('Status') }}</th>
                        <th scope="col">{{ __('Actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach ($rooms as $room)
                        <tr>
                          <td>
                            <input type="checkbox" class="bulk-check" data-val="{{ $room->id }}">
                          </td>
                          <td>{{ $room->room_number }}</td>
                          <td>{{ $room->categoryContents->first()->title ?? 'N/A' }}</td>
                          <td>
                            @if ($room->status)
                              <span class="badge badge-success">{{ __('Active') }}</span>
                            @else
                              <span class="badge badge-danger">{{ __('Deactive') }}</span>
                            @endif
                          </td>
                          <td>
                            <a class="btn btn-secondary btn-sm mr-1 editBtn" href="#" data-toggle="modal"
                              data-target="#editModal" data-id="{{ $room->id }}"
                              data-room_category_id="{{ $room->room_category_id }}" data-status="{{ $room->status }}"
                              data-room_number="{{ $room->room_number }}">
                              <span class="btn-label">
                                <i class="fas fa-edit"></i>
                              </span>
                              {{ __('Edit') }}
                            </a>

                            <form class="deleteForm d-inline-block"
                              action="{{ route('vendor.rooms_management.room.delete') }}" method="post">
                              @csrf
                              <input type="hidden" name="room_id" value="{{ $room->id }}">

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
  @include('vendors.rooms.create')

  {{-- edit modal --}}
  @include('vendors.rooms.edit')
@endsection
