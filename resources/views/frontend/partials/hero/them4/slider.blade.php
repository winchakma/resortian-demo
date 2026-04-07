 <section class="hero-banner hero-banner-2">
   <div class="container-fluid">
     <div class="swiper home-slider" id="home-slider-2">
       <div class="swiper-wrapper">
         @if (count($sliders) != 0)
           @foreach ($sliders as $slider)
             <div class="swiper-slide text-center" data-aos="fade-up">
               <div class="banner-content">
                 <h1 class="title color-white mb-25" data-animation="animate__fadeInUp" data-delay=".1s">
                   {{ convertUtf8($slider->title) }}</h1>
                 <p class="text" data-animation="animate__fadeInUp" data-delay=".2s">
                   {{ convertUtf8($slider->subtitle) }}</p>
               </div>
             </div>
           @endforeach
         @else
           <div class="bg-light pt-70 pb-130 text-center">
             <h3>{{ __('No Slider Found!') }}</h4>
           </div>
         @endif
       </div>
     </div>
     @if ($sections?->search_section == 1)
       <div class="banner-filter-form banner-filter-form-style2 mt-40 mx-auto" data-aos="fade-up" data-aos-delay="100">
         <div class="form-wrapper p-30 radius-lg">
           <form action="{{ route('packages') }}" method="GET">
             <div class="grid">
                <div class="item">
                  <div class="input-wrap ">
                    <label for="location" class="font-sm">{{ __('Location') }}</label>
                    <div class="form-block">
                      <div class="icon color-white"><i class="fas fa-map-marker-alt"></i></div>
                      <select class="niceselect" id="location" name="locationName">
                        <option selected value="">{{ __('Choose Location') }}</option>
                        @foreach ($package_locations as $locations)
                          <option value="{{ $locations->name }}">{{ $locations->name }}</option>
                        @endforeach
                      </select>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="input-wrap">
                    <label for="guest" class="font-sm">{{ __('Days') }}</label>
                    <div class="form-block">
                      <div class="icon color-white"><i class="fas fa-calendar"></i></div>
                      <select id="days" class="niceselect">
                        <option selected value="">{{ __('Choose Day') }}</option>
                        @for ($i = 0; $i < $maxDays; $i++)
                          <option value="{{ $i + 1 }}"
                            {{ request()->input('daysValue') == $i + 1 ? 'selected' : '' }}>{{ __('Up to') }}
                            {{ $i + 1 }} {{ $i + 1 == 1 ? __('Day') : __('Days') }}</option>
                        @endfor
                      </select>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="input-wrap">
                    <label for="guest" class="font-sm">{{ __('Person') }}</label>
                    <div class="form-block">
                      <div class="icon color-white"><i class="fas fa-user-friends"></i></div>
                      <select class="niceselect" id="guest" name="personsValue">
                        <option selected value="">{{ __('Choose Person') }}</option>
                        @for ($i = 1; $i <= $numOfAdult; $i++)
                          <option value="{{ $i }}">{{ $i }}</option>
                        @endfor
                      </select>
                    </div>
                  </div>
                </div>
                
                <div class="item button">
                  <button type="submit" class="btn btn-icon bg-primary color-white radius-md" aria-label="Search">
                    <i class="fal fa-search"></i>
                  </button>
                </div>
             </div>

           </form>
         </div>
       </div>
     @endif
     <div class="swiper-pagination position-static mt-40" id="home-slider-2-pagination" data-aos="fade-up"
       data-aos-delay="100"></div>
   </div>
   @if (count($sliders) != 0)
     <div class="swiper home-img-slider" id="home-img-slider-2">
       <div class="swiper-wrapper">
         @foreach ($sliders as $slider)
           <div class="swiper-slide">
             <div class="lazyload bg-img" data-bg-image="{{ asset('assets/img/hero_slider/' . $slider->img) }}"></div>
           </div>
         @endforeach
       </div>
     </div>
   @endif
 </section>
