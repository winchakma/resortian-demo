@extends('frontend.layout')

@section('pageHeading')
  {{ __('Home') }}
@endsection

@php
  $metaKeywords = !empty($seo->meta_keyword_home) ? $seo->meta_keyword_home : '';
  $metaDescription = !empty($seo->meta_description_home) ? $seo->meta_description_home : '';
@endphp
@section('meta-keywords', "{{ $metaKeywords }}")
@section('meta-description', "$metaDescription")
@section('content')
  @php
    if (!empty($hero)) {
        $img = $hero->img;
        $title = $hero->title;
        $subtitle = $hero->subtitle;
        $btnUrl = $hero->btn_url;
        $btnName = $hero->btn_name;
    } else {
        $img = '';
        $title = '';
        $subtitle = '';
        $btnUrl = '';
        $btnName = '';
    }
  @endphp
  <!-- Home-area start-->
  @includeIf('frontend.partials.hero.them3.slider')
  <!-- Home-area end -->

  <!-- About-area start -->
  @if ($sections?->intro_section == 1)
    <section class="about-area about-1 pt-100 pb-60">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6" data-aos="fade-up">
            <div class="image mb-40">
              <div class="img-1">
                <img class="blur-up lazyload" data-src="{{ asset('assets/img/intro_section/' . $intro->intro_img) }}"
                  alt="Image">
              </div>
            </div>
            
          </div>
          <div class="col-lg-6" data-aos="fade-up">
            <div class="content-title mb-40">
              @if (!is_null($intro))
                <h2 class="title mb-20">
                  {{ $intro->intro_primary_title }}
                </h2>
                <p>
                  {{ $intro->intro_text }}
                </p>
              @endif

              <div class="info-list mt-40">
                <div class="row align-items-center">
                  @if (count($counterInfos) > 0)
                    @foreach ($counterInfos as $counterInfo)
                      <div class="col-md-6 col-lg-12 col-xxl-6">
                        <div class="card mb-30">
                          <div class="card-icon rounded-pill">
                            <i class="{{ $counterInfo->icon }}"></i>
                          </div>
                          <div class="card-content">
                            <h6 class="mb-2">{{ $counterInfo->title }}</h6>

                          </div>
                        </div>
                      </div>
                    @endforeach
                  @endif
                </div>
              </div>
              <div class="d-flex align-items-center flex-wrap gap-3 mt-10" data-aos="fade-up">
                @if ($intro->button_text && $intro->url)
                  <a href="{{ $intro->url }}" class="btn btn-lg btn-primary"
                    target="_self">{{ $intro->button_text }}</a>
                @endif
                @if (!empty($intro->member_image))
                  <div class="clients-avatar">
                    <img src="{{ asset('assets/img/intro_section/member_image/' . $intro->member_image) }}"
                      alt="">
                  </div>
                @endif
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  @endif
  <!-- About-area end -->



  <!-- Product-area start -->
  @if ($sections?->featured_rooms_section == 1)
    <!-- Product-area start -->
    <section class="product-area ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-12" data-aos="fade-up">
            <div class="section-title title-inline mb-50" data-aos="fade-up">
              @if (!empty($secHeading))
                <h2 class="title">{{ convertUtf8($secHeading->room_section_title) }}</h2>
              @endif
              <a href="{{ route('rooms') }}" class="btn btn-lg btn-primary" target="_self"
                title="Show More">{{ __('Show More') }}</a>
            </div>
          </div>
          <div class="col-12">
            <div class="swiper product-inline-slider" id="product-inline-slider-1" data-slides-per-view="2">
              <div class="swiper-wrapper" aria-live="off">
                @foreach ($roomInfos as $roomInfo)
                  @if (!empty($roomInfo->room))
                    <div class="swiper-slide" data-aos="fade-up">
                      <div class="row g-0 product-default product-column border radius-md mb-25 align-items-center">
                        <figure class="product-img col-sm-12 col-md-5">
                          <a href="{{ route('room_details', ['id' => $roomInfo->room_id, 'slug' => $roomInfo->slug]) }}"
                            class="lazy-container ratio ratio-5-4" target="_self" title="Link">
                            <img class="lazyload"
                              data-src="{{ asset('assets/img/rooms/' . $roomInfo->room->featured_img) }}" alt="Product">
                          </a>
                        </figure>
                        <div class="product-details col-sm-12 col-md-7">
                          <div class="d-flex align-items-center gap-3">
                            {{-- <span class="product-tag border radius-sm">
                              {{ $roomInfo->roomCategory->name }}
                            </span> --}}

                            <div class="product-price">
                              <span class="h6 new-price color-primary">
                                {{ $currencyInfo->base_currency_symbol_position == 'left' ? $currencyInfo->base_currency_symbol : '' }}
                                {{ $roomInfo->room->rent }}
                                {{ $currencyInfo->base_currency_symbol_position == 'right' ? $currencyInfo->base_currency_symbol : '' }}
                                / {{ __('Night') }}
                              </span>
                            </div>
                          </div>
                          <h5 class="product-title lc-2 mt-2 mb-15">
                            <a href="{{ route('room_details', ['id' => $roomInfo->room_id, 'slug' => $roomInfo->slug]) }}"
                              target="_self"
                              title="Link">{{ strlen($roomInfo->title) > 50 ? mb_substr($roomInfo->title, 0, 150, 'utf-8') . '...' : $roomInfo->title }}</a>
                          </h5>
                          <div class="author mb-15 font-sm">
                            <span>
                              @if ($roomInfo->room->vendor_id != 0)
                                @php
                                  $vendor = App\Models\Vendor::where('id', $roomInfo->room->vendor_id)->first();
                                @endphp
                                <a href="{{ route('frontend.vendor.details', $vendor->username) }}">{{ __('By') }}
                                  {{ $vendor->username }}</a>
                              @else
                                @php
                                  $admin = App\Models\Admin::first();
                                @endphp
                                <a href="{{ route('frontend.vendor.details', [$admin->username, 'admin' => 'true']) }}">{{ __('By') }}

                                  {{ $admin->username }}</a>
                              @endif
                            </span>
                          </div>
                          <ul class="product-icon-list list-unstyled d-flex align-items-center">
                            <li class="icon-start">
                              <i class="fal fa-bed"></i>
                              <span>
                                {{ $roomInfo->room->bed }}
                                {{ $roomInfo->room->bed == 1 ? __('Bed') : __('Beds') }}
                              </span>
                            </li>

                            <li class="icon-start">
                              <i class="fal fa-bath"></i>
                              <span> {{ $roomInfo->room->bath }}
                                {{ $roomInfo->room->bath == 1 ? __('Bath') : __('Baths') }}</span>
                            </li>
                            @if (!empty($roomInfo->room->adult))
                              <li><i class="far fa-users"></i>{{ $roomInfo->room->adult }}
                                {{ $roomInfo->room->adult == 1 ? __('Adult') : __('Adults') }}</li>
                            @endif
                            @if (!empty($roomInfo->room->child))
                              <li><i class="far fa-users"></i>{{ $roomInfo->room->child }}
                                {{ $roomInfo->room->child == 1 ? __('Child') : __('Children') }}</li>
                            @endif
                          </ul>
                        </div>
                      </div>
                    </div>
                  @endif
                @endforeach
              </div>
              <div
                class="swiper-pagination position-static swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"
                id="product-inline-slider-1-pagination"><span
                  class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button"
                  aria-label="Go to slide 1" aria-current="true"></span><span class="swiper-pagination-bullet"
                  tabindex="0" role="button" aria-label="Go to slide 2"></span></div>
              <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  @endif
  <!-- Product-area end -->

  <!-- Product-area start -->
  @if ($sections?->featured_package_section == 1)
    <!-- Room latest Section Start -->
    <section class="product-area pb-100">
      <div class="container">
        <div class="row">
          <div class="col-12" data-aos="fade-up">
            <div class="section-title title-center mb-50" data-aos="fade-up">
              @if (!empty($secHeading))
                <h2 class="title mb-30">
                  {{ $secHeading->package_section_title }}
                </h2>
              @endif
              <div class="tabs-navigation-area ">
                <ul class="nav nav-tabs" data-hover="fancyHover" role="tablist">
                  <li class="nav-item active" role="presentation">
                    <button class="nav-link hover-effect active btn-md radius-sm" data-bs-toggle="tab"
                      data-bs-target="#tab1" type="button" aria-selected="true"
                      role="tab">{{ __('All Rooms') }}</button>
                  </li>
                  @foreach ($package_categories as $package_category)
                    <li class="nav-item" role="presentation">
                      <button class="nav-link hover-effect  btn-md radius-sm" data-bs-toggle="tab"
                        data-bs-target="#tab{{ $package_category->id }}" type="button" aria-selected="true"
                        role="tab">{{ $package_category->name }}</button>
                    </li>
                  @endforeach
                  {{-- <span class="target"
                    style="width: 141px; height: 43px; left: 715px; top: 3572px; transform: none; border-radius: 5px;"></span> --}}
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="tab-content">

              <div class="tab-pane slide show active" id="tab1" role="tabpanel">
                <div class="row">
                  @foreach ($packageInfos as $packageInfo)
                    @if (!empty($packageInfo->package))
                      <div class="col-xl-3 col-lg-4 col-sm-6" data-aos="fade-up">
                        <div class="product-default mb-25">
                          <figure class="product-img">
                            <a href="{{ route('package_details', ['id' => $packageInfo->package_id, 'slug' => $packageInfo->slug]) }}"
                              class="lazy-container radius-md ratio ratio-3-4" target="_self" title="Link">
                              <img class="lazyload"
                                data-src="{{ asset('assets/img/package/' . $packageInfo->package->featured_img) }}"
                                alt="Product">
                            </a>
                          </figure>
                          <div class="product-details p-20 border radius-md mx-auto">
                            <div class="d-flex align-items-center gap-3 justify-content-between">
                              <span
                                class="product-tag border radius-sm">{{ $packageInfo->packageCategory->name }}</span>
                              <div class="product-price">
                                @if ($packageInfo->package->pricing_type != 'negotiable')
                                  <span class="h6 new-price color-primary"></strong>
                                    {{ $currencyInfo->base_currency_symbol_position == 'left' ? $currencyInfo->base_currency_symbol : '' }}
                                    {{ $packageInfo->package->package_price }}
                                    {{ $currencyInfo->base_currency_symbol_position == 'right' ? $currencyInfo->base_currency_symbol : '' }}
                                    {{ '(' . strtoupper($packageInfo->package->pricing_type) . ')' }}</span>
                                @else
                                  <span
                                    class="h6 new-price color-primary"></strong>{{ __('Negotiable') }}</strong></span>
                                @endif
                              </div>
                            </div>
                            <h6 class="product-title lc-1 mt-2">
                              <a href="{{ route('package_details', ['id' => $packageInfo->package_id, 'slug' => $packageInfo->slug]) }}"
                                target="_self"
                                title="Link">{{ strlen($packageInfo->title) > 50 ? mb_substr($packageInfo->title, 0, 150, 'utf-8') . '...' : $packageInfo->title }}</a>
                            </h6>
                            <div class="author mb-15 font-sm">
                              <span>
                                @if ($packageInfo->package->vendor_id != null)
                                  @php
                                    $vendor = App\Models\Vendor::where('id', $packageInfo->package->vendor_id)->first();
                                  @endphp
                                  <a href="{{ route('frontend.vendor.details', $vendor->username) }}">{{ __('By') }}
                                    {{ $vendor->username }}</a>
                                @else
                                  @php
                                    $admin = App\Models\Admin::first();
                                  @endphp
                                  <a
                                    href="{{ route('frontend.vendor.details', [$admin->username, 'admin' => 'true']) }}">{{ __('By') }}
                                    {{ $admin->username }}</a>
                                @endif
                              </span>
                            </div>
                            <ul class="product-icon-list list-unstyled d-flex align-items-center">
                              <li class="icon-start">
                                <i class="fal fa-calendar-check"></i>
                                <span> {{ $packageInfo->package->number_of_days }}
                                  {{ __('Days') }}</span>
                              </li>
                              <li class="icon-start">
                                <i class="fal fa-user-friends"></i>
                                <span>
                                  {{ $packageInfo->package?->max_persons != null ? $packageInfo->package?->max_persons : '-' }}
                                  {{ $packageInfo->package?->max_persons == 1 ? __('Person') : __('Persons') }}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div><!-- product-default -->
                      </div>
                    @endif
                  @endforeach
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-20" data-aos="fade-up">
            <a href="{{ route('rooms') }}" class="btn btn-lg btn-primary fancy">{{ __('View All Rooms') }}</a>
          </div>
        </div>
      </div>
    </section>
    <!-- Room latest Section End -->
  @endif
  <!-- Product-area end -->

  <!-- Choose-area start -->
  @if ($sections?->featured_services_section == 1)
    <section class="choose-area pb-60">
      <div class="container">
        <div class="row gx-xl-4 align-items-center">
          <div class="col-lg-6">
            <div class="content mb-40" data-aos="fade-right">
              @if (!is_null($secHeading))
                <div class="content-title">
                  <h2 class="title mb-30">{{ $secHeading->service_section_title }}</h2>
                </div>
                <div class="w-75 w-sm-100">
                  <p class="text">{{ $secHeading->service_section_subtitle }}</p>
                </div>
              @endif
              <div class="choose-grid mt-40">
                @foreach ($serviceInfos as $serviceInfo)
                  @if ($serviceInfo->service)
                    <div class="grid-item border radius-md p-20">
                      <div class="icon mb-20">
                        @if ($serviceInfo->service->details_page_status == 0)
                          <i class="{{ $serviceInfo->service->service_icon }}"></i>
                        @else
                          <a
                            href="{{ route('service_details', ['id' => $serviceInfo->service_id, 'slug' => $serviceInfo->slug]) }}">
                            <i class="{{ $serviceInfo->service->service_icon }}"></i></a>
                        @endif
                      </div>
                      <h6 class="mb-0 lc-1">{{ $serviceInfo->title }}</h6>
                    </div>
                  @endif
                @endforeach
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="image mb-40 img-right" data-aos="fade-left">
              <div class="img-1">
                <img class="lazyload blur-up" src="{{ asset('assets/front/images/video-image2.png') }}"
                  data-src="{{ asset('assets/front/images/video-image2.png') }}" alt="Image">
              </div>
              @if ($sections?->video_section == 1)
                <div class="img-2">
                  <img class="lazyload blur-up" src="{{ asset('assets/front/images/video-image1.png') }}"
                    data-src="{{ asset('assets/front/images/video-image1.png') }}" alt="Image">
                  <a href="{{ $secHeading->booking_section_button_url }}" class="video-btn youtube-popup p-absolute"
                    title="Play Video">
                    <i class="fas fa-play"></i>
                  </a>
                </div>
              @endif
            </div>
          </div>
        </div>
      </div>
    </section>
  @endif
  <!-- Choose-area end -->

  <!-- Counter-area start -->
  @if ($sections?->intro_section == 1)
    <div class="counter-area pt-60 pb-30 bg-img lazyload"
      data-bg-image="{{ asset('assets/img/intro_section/background_image/' . $intro->background_image) }}">
      <div class="overlay opacity-75"></div>
      <div class="container">
        <div class="d-flex justify-content-center align-items-center">
          @if ($sections->statistics_section == 1)
            @if (count($counterInfos) > 0)
              @foreach ($counterInfos as $counterInfo)
                <div class="col-sm-6 col-lg-3" data-aos="fade-up">
                  <div class="card text-center mb-30">
                    <div class="card-icon color-primary mb-10">
                      <i class="{{ $counterInfo->icon }}"></i>
                    </div>
                    <div class="card-content">
                      <span class="h2 mb-1 color-white"><span class="counter">{{ $counterInfo->amount }}</span></span>
                      <p class="card-text font-lg color-medium lh-1">{{ $counterInfo->title }}</p>
                    </div>
                  </div>
                </div>
              @endforeach
            @endif
          @endif
        </div>
      </div>
    </div>
  @endif
  <!-- Counter-area end -->

  <!-- Testimonial-area start -->
  @if ($sections?->testimonials_section == 1)
    <section class="testimonial-area testimonial-1 ptb-100">
      <div class="container">
        <div class="section-title title-inline mb-50" data-aos="fade-up">
          <h2 class="title">{{ $secHeading->testimonial_section_title }}</h2>
          <!-- Slider navigation buttons -->
          <div class="slider-navigation text-end">
            <button type="button" title="Slide prev" class="slider-btn" id="testimonial-slider-btn-prev">
              <i class="fal fa-angle-left"></i>
            </button>
            <button type="button" title="Slide next" class="slider-btn" id="testimonial-slider-btn-next">
              <i class="fal fa-angle-right"></i>
            </button>
          </div>
        </div>
        <div class="swiper testimonial-slider swiper-initialized swiper-horizontal swiper-pointer-events"
          id="testimonial-slider-1" data-slides-per-view="4">
          <div class="swiper-wrapper" id="swiper-wrapper-fae86b5b0937c48c" aria-live="off"
            style="transform: translate3d(-2311.75px, 0px, 0px); transition-duration: 0ms;">

            @if (count($testimonials) == 0)
              <div class="row text-center">
                <div class="col">
                  <h3 class="text-white">{{ __('No Testimonial Found!') }}</h3>
                </div>
              </div>
            @else
              @foreach ($testimonials as $testimonial)
                <div class="swiper-slide pb-25" data-aos="fade-up" data-swiper-slide-index="1" role="group"
                  aria-label="2 / 4" style="width: 305.25px; margin-right: 25px;">
                  <style>
                    .testimonial-area .swiper-slide .slider-item.test-item{{ $loop->iteration }}::before {
                      background-color: #{{ $testimonial->border_color }}
                    }
                  </style>
                  <div class="slider-item test-item{{ $loop->iteration }} radius-md mt-15">
                    <div class="client p-25">
                      <div class="client-img">
                        <div class="lazy-container rounded-pill ratio ratio-1-1">
                          <img class="lazyload"
                            data-src="{{ asset('assets/img/testimonial_section/' . $testimonial->client_image) }}"
                            alt="Person Image">
                        </div>
                      </div>
                      <div class="content">
                        <h6 class="name mb-1">{{ $testimonial->client_name }}</h6>
                        <span class="designation font-sm">{{ $testimonial->client_designation }}</span>
                      </div>
                    </div>
                    <div class="quote p-25">
                      <span class="icon">
                        <i class="fal fa-quote-right"></i>
                      </span>
                      <p class="text mb-0">
                        {{ $testimonial->comment }}
                      </p>
                    </div>
                  </div>
                </div>
              @endforeach
            @endif

          </div>
          <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
        </div>
      </div>
    </section>
  @endif
  <!-- Testimonial-area end -->

@endsection
@section('script')
  <script src="{{ asset('assets/js/home.js') }}"></script>
@endsection
