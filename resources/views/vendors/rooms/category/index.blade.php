@extends('vendors.layout')

@section('content')
  <div class="page-header">
    <h4 class="page-title">{{ __('Categories') }}</h4>
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
        <a href="#">{{ __('Categories') }}</a>
      </li>
    </ul>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-3">
              <div class="card-title d-inline-block">{{ __('Categories') }}</div>
            </div>
            <div class="col-lg-6">
              <form action="" method="get" id="Form">
                <div class="row">

                  <div class="col-lg-12">
                    <input type="text" name="title" placeholder="Title" value="{{ request()->input('title') }}"
                      class="form-control">
                  </div>
                </div>
              </form>
            </div>

            <div class="col-lg-3 mt-2 mt-lg-0">
              <a href="{{ route('vendor.rooms_management.room_category.create') }}"
                class="btn btn-primary btn-sm float-lg-right float-left"><i class="fas fa-plus"></i>
                {{ __('Add Category') }}</a>

              <button class="btn btn-danger btn-sm float-right  mr-2 d-none bulk-delete"
                data-href="{{ route('vendor.rooms_management.bulk_delete_room') }}"><i class="flaticon-interface-5"></i>
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
                        <th scope="col">{{ __('Title') }}</th>
                        <th scope="col">{{ __('Featured') }}</th>
                        <th scope="col">{{ __('Rent') }}</th>
                        <th scope="col">{{ __('Actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach ($rooms as $room)
                        <tr>
                          <td>
                            <input type="checkbox" class="bulk-check" data-val="{{ $room->id }}">
                          </td>
                          <td>
                            @if ($room->room_content)
                              <a target="blank"
                                href="{{ route('room_details', ['id' => $room->id, 'slug' => $room->room_content->slug]) }}">{{ strlen($room->room_content->title) > 40 ? mb_substr($room->room_content->title, 0, 40, 'utf-8') . '...' : $room->room_content->title }}</a>
                            @endif
                          </td>
                          <td>
                            @if ($room->is_featured == 1)
                              <span class="badge badge-success">{{ __('Yes') }}</span>
                            @else
                              <span class="badge badge-danger">{{ __('No') }}</span>
                            @endif
                          </td>
                          <td>
                            {{ $currencyInfo->base_currency_symbol_position == 'left' ? $currencyInfo->base_currency_symbol : '' }}
                            {{ $room->rent }}
                            {{ $currencyInfo->base_currency_symbol_position == 'right' ? $currencyInfo->base_currency_symbol : '' }}
                          </td>
                          <td>
                            <a class="btn btn-secondary btn-sm mr-1 mb-1"
                              href="{{ route('vendor.rooms_management.room_category.edit', $room->id) }}">
                              <i class="fas fa-edit"></i>
                            </a>

                            <form class="deleteForm d-inline-block mb-1"
                              action="{{ route('vendor.rooms_management.delete_room') }}" method="post">
                              @csrf
                              <input type="hidden" name="room_id" value="{{ $room->id }}">

                              <button type="submit" class="btn btn-danger btn-sm deleteBtn">
                                <i class="fas fa-trash"></i>
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

        <div class="card-footer">
          {{ $rooms->appends([
                  'vendor_id' => request()->input('vendor_id'),
              ])->links() }}
        </div>
      </div>
    </div>
  </div>
@endsection
