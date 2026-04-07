@extends('admin.layout')

{{-- this style will be applied when the direction of language is right-to-left --}}
@includeIf('admin.partials.rtl_style')

@section('content')
  <div class="page-header">
    <h4 class="page-title">{{ __('Video Section') }}</h4>
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
        <a href="#">{{ __('Home Page') }}</a>
      </li>
      <li class="separator">
        <i class="flaticon-right-arrow"></i>
      </li>
      <li class="nav-item">
        <a href="#">{{ __('Video Section') }}</a>
      </li>
    </ul>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-10">
              <div class="card-title">{{ __('Update Video Section') }}</div>
            </div>

            <div class="col-lg-2">
              @includeIf('admin.partials.languages')
            </div>
          </div>
        </div>

        <div class="card-body pt-5 pb-5">
          <div class="row">
            <div class="col-lg-6 offset-lg-3">
              <form id="ajaxForm"
                action="{{ route('admin.home_page.update_booking_section', ['language' => request()->input('language')]) }}"
                method="post" enctype="multipart/form-data">
                @csrf
                @if ($settings->theme_version == 'theme_three' || $settings->theme_version == 'theme_four' || $settings->theme_version == 'theme_five')
                  <div class="form-group">
                    <label for="">{{ __('Background Image*') }}</label>
                    <br>
                    <div class="thumb-preview">
                      @if (!empty($data->video_img))
                        <img src="{{ asset('assets/img/video_section/' . $data->video_img) }}" alt="image"
                          class="uploaded-img">
                      @else
                        <img src="{{ asset('assets/img/noimage.jpg') }}" alt="..." class="uploaded-img">
                      @endif
                    </div>

                    <div class="mt-3">
                      <div role="button" class="btn btn-primary btn-sm upload-btn">
                        {{ __('Choose Image') }}
                        <input type="file" class="img-input" name="video_img">
                      </div>
                    </div>
                    <p id="err_video_img" class="em text-danger mt-1 mb-0"></p>
                  </div>
                @endif
                @if ($settings->theme_version == 'theme_one' || $settings->theme_version == 'theme_two')
                  <div class="form-group">
                    <label for="">{{ __('Title*') }}</label>
                    <input type="text" class="form-control" name="booking_section_title"
                      value="{{ $data != null ? $data->booking_section_title : '' }}">
                    <p id="err_booking_section_title" class="em text-danger mt-1 mb-0"></p>
                  </div>

                  <div class="form-group">
                    <label for="">{{ __('Subtitle*') }}</label>
                    <input type="text" class="form-control" name="booking_section_subtitle"
                      value="{{ $data != null ? $data->booking_section_subtitle : '' }}">
                    <p id="err_booking_section_subtitle" class="em text-danger mt-1 mb-0"></p>
                  </div>

                  <div class="form-group">
                    <label for="">{{ __('Button*') }}</label>
                    <input type="text" class="form-control" name="booking_section_button"
                      value="{{ $data != null ? $data->booking_section_button : '' }}">
                    <p id="err_booking_section_button" class="em text-danger mt-1 mb-0"></p>
                  </div>

                  <div class="form-group">
                    <label for="">{{ __('Button URL*') }}</label>
                    <input type="url" class="form-control ltr" name="booking_section_button_url"
                      value="{{ $data != null ? $data->booking_section_button_url : '' }}">
                    <p id="err_booking_section_button_url" class="em text-danger mt-1 mb-0"></p>
                  </div>
                @endif
                <div class="form-group">
                  <label for="">{{ __('Video URL*') }}</label>
                  <input type="url" class="form-control ltr" name="booking_section_video_url"
                    value="{{ $data != null ? $data->booking_section_video_url : '' }}">
                  <p id="err_booking_section_video_url" class="em text-danger mt-1 mb-0"></p>
                  <p class="text-warning mt-2 mb-0">
                    {{ __('Link will be formatted automatically after submitting the form.') }}</p>
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
