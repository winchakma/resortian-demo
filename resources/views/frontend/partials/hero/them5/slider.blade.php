 <section class="hero-banner hero-banner-3">
   <div class="container-fluid">
     <div class="swiper home-slider" id="home-slider-3">
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
       <div class="banner-filter-form mt-40 mx-auto" data-aos="fade-up" data-aos-delay="100">
         <div class="form-wrapper banner-filter-form-style2 p-30 radius-lg">
           <form action="{{ route('rooms') }}" method="GET">
             <div class="grid">
               <div class="item date">
                 <div class="input-wrap">
                   <label for="guest" class="font-sm">{{ __('Check In / Out Date') }}</label>
                   <div class="form-block">
                     <div class="icon color-white"><i class="fas fa-calendar-alt"></i></div>
                     <input type="text" placeholder="{{ __('Check In / Out Date') }}" class="form-control"
                       name="dates" id="date-range" autocomplete="off">
                   </div>
                 </div>
               </div>
               <div class="item">
                 <div class="input-wrap">
                   <label for="guest" class="font-sm">{{ __('Baths') }}</label>
                   <div class="input-wrap">
                     <select name="baths" class="niceselect">
                       <option selected value="">{{ __('Baths') }}</option>
                       @for ($i = 1; $i <= $numOfBath; $i++)
                         <option value="{{ $i }}">{{ $i }}</option>
                       @endfor
                     </select>
                   </div>
                 </div>
               </div>
               <div class="item">
                 <div class="input-wrap">
                   <label for="guest" class="font-sm">{{ __('Beds') }}</label>
                   <div class="input-wrap">
                     <select name="beds" class="niceselect">
                       <option selected>{{ __('Beds') }}</option>
                       @for ($i = 1; $i <= $numOfBed; $i++)
                         <option value="{{ $i }}">{{ $i }}</option>
                       @endfor
                     </select>
                   </div>
                 </div>
               </div>
               <div class="item">
                 <div class="input-wrap">
                   <label for="Adults" class="font-sm">{{ __('Adults') }}</label>
                   <select name="adult" class="nice-select niceselect">
                     <option selected>{{ __('Adults') }}</option>

                     @for ($i = 1; $i <= $numOfAdult; $i++)
                       <option value="{{ $i }}">{{ $i }}</option>
                     @endfor
                   </select>
                 </div>
               </div>
               <div class="item">
                 <div class="input-wrap">
                   <label for="Children" class="font-sm">{{ __('Children') }}</label>
                   <select name="child" class="nice-select niceselect">
                     <option selected>{{ __('Children') }}</option>

                     @for ($i = 1; $i <= $numOfChild; $i++)
                       <option value="{{ $i }}">{{ $i }}</option>
                     @endfor
                   </select>
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
   </div>
   @if (count($sliders) != 0)
     <div class="swiper home-img-slider" id="home-img-slider-3">
       <div class="swiper-wrapper">
         @foreach ($sliders as $slider)
           <div class="swiper-slide">
             <div class="lazyload bg-img" data-bg-image="{{ asset('assets/img/hero_slider/' . $slider->img) }}"></div>
           </div>
         @endforeach
       </div>
     </div>
   @endif
   <div class="bg-shape">
     <img src="{{ asset('assets/front/images/bg-shape-1.png') }}" alt="Shape">
   </div>
 </section>
