@extends('admin.layout')

{{-- this style will be applied when the direction of language is right-to-left --}}
@includeIf('admin.partials.rtl_style')

@section('content')
  <div class="page-header">
    <h4 class="page-title">{{ __('Room Category Section') }}</h4>
    <ul class="breadcrumbs">
      <li class="nav-home">
        <a href="{{route('admin.dashboard')}}">
          <i class="flaticon-home"></i>
        </a>
      </li>
      <li class="separator">
        <i class="flaticon-right-arrow"></i>
      </li>
      <li class="nav-item">
        <a href="#">{{ __('Home Page') }}</a>
      </li>
      <li class="separator">
        <i class="flaticon-right-arrow"></i>
      </li>
      <li class="nav-item">
        <a href="#">{{ __('Room Category Section') }}</a>
      </li>
    </ul>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-10">
              <div class="card-title">{{ __('Update Room Category Section') }}</div>
            </div>

            <div class="col-lg-2">
              @includeIf('admin.partials.languages')
            </div>
          </div>
        </div>

        <div class="card-body pt-5 pb-5">
          <div class="row">
            <div class="col-lg-6 offset-lg-3">
              <form
                id="ajaxForm"
                action="{{ route('admin.home_page.update_room_category_section', ['language' => request()->input('language')]) }}"
                method="post"
              >
                @csrf
                <div class="form-group">
                  <label for="">{{ __('Room Category Section Title*') }}</label>
                  <input
                    type="text"
                    class="form-control"
                    name="room_feature_category_title"
                    value="{{ $data != null ? $data->room_feature_category_title : '' }}"
                  >
                  <p id="err_room_feature_category_title" class="em text-danger mt-1 mb-0"></p>
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
