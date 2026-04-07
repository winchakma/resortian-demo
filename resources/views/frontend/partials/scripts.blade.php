<script>
  "use strict";

  var rtl = {{ $currentLanguageInfo->direction }};
  var baseURL = "{!! url('/') !!}";
  var vapid_public_key = "{!! env('VAPID_PUBLIC_KEY') !!}";
</script>
{{-- modernizr js --}}
<script src="{{ asset('assets/js/modernizr-3.6.0.min.js') }}"></script>
{{-- jQuery --}}
<script src="{{ asset('assets/js/jquery.min.js') }}"></script>
{{-- popper js --}}
<script src="{{ asset('assets/js/popper.min.js') }}"></script>
{{-- jQuery-ui js --}}
<script src="{{ asset('assets/js/jquery-ui.min.js') }}"></script>
{{-- bootstrap js --}}
<script src="{{ asset('assets/front/js/vendors/bootstrap.min.js') }}"></script>
@if ($websiteInfo->theme_version == 'theme_one' || $websiteInfo->theme_version == 'theme_two')
  {{-- Plugins js --}}
  <script src="{{ asset('assets/js/plugins.min.js') }}"></script>
@endif
@if (in_array($websiteInfo->theme_version, ['theme_three', 'theme_four', 'theme_five']))
  <!-- this work only index page -->
  @if (\Illuminate\Support\Facades\Route::currentRouteName() == 'index')
    <!-- Date-range Picker JS -->
    <script src="{{ asset('assets/front/js/vendors/moment.min.js') }}"></script>
    <script src="{{ asset('assets/front/js/vendors/daterangepicker.js') }}"></script>
    <!-- Counter JS -->
    <script src="{{ asset('assets/front/js/vendors/jquery.counterup.min.js') }}"></script>
    <!-- Nice Select JS -->
    <script src="{{ asset('assets/front/js/vendors/jquery.nice-select.min.js') }}"></script>
    <!-- Magnific Popup JS -->
    <script src="{{ asset('assets/front/js/vendors/jquery.magnific-popup.min.js') }}"></script>
    <!-- Swiper Slider JS -->
    <script src="{{ asset('assets/front/js/vendors/swiper-bundle.min.js') }}"></script>
    <!-- Lazysizes -->
    <script src="{{ asset('assets/front/js/vendors/vanilla-lazyload.min.js') }}"></script>
    <script src="{{ asset('assets/front/js/vendors/lazysizes.min.js') }}"></script>
    <!-- AOS JS -->
    <script src="{{ asset('assets/front/js/vendors/aos.min.js') }}"></script>
    <!-- Mouse Hover JS -->
    <script src="{{ asset('assets/front/js/vendors/mouse-hover-move.js') }}"></script>
    <!-- Script JS -->
    <script src="{{ asset('assets/front/js/script.js') }}"></script>
  @else
    {{-- main js --}}
    <script src="{{ asset('assets/js/main.js') }}"></script>
    <script src="{{ asset('assets/js/plugins.min.js') }}"></script>
    <!-- Script JS -->
    <script src="{{ asset('assets/front/js/script.js') }}"></script>
  @endif
@endif
<!-- Main Common JS -->
<script src="{{ asset('assets/js/main-common.js') }}"></script>
<!-- index page js for theme 3,4,5 -->
@if ($websiteInfo->theme_version == 'theme_three')
  <script src="{{ asset('assets/front/js/index-1.js') }}"></script>
@elseif ($websiteInfo->theme_version == 'theme_four')
  <script src="{{ asset('assets/front/js/index-2.js') }}"></script>
@elseif ($websiteInfo->theme_version == 'theme_five')
  <script src="{{ asset('assets/front/js/index-3.js') }}"></script>
@endif


@if (session()->has('success'))
  <script>
    "use strict";
    toastr['success']("{{ __(session('success')) }}");
  </script>
@endif

@if (session()->has('error'))
  <script>
    "use strict";
    toastr['error']("{{ __(session('error')) }}");
  </script>
@endif
<script src="{{ asset('assets/js/tinymce/js/tinymce/tinymce.min.js') }}"></script>
@if ($websiteInfo->theme_version == 'theme_one' || $websiteInfo->theme_version == 'theme_two')
  {{-- main js --}}
  <script src="{{ asset('assets/js/main.js') }}"></script>
  {{-- push-notification js --}}
  <script src="{{ asset('assets/js/push-notification.js') }}"></script>
  <script src="{{ asset('assets/js/vendor.js') }}"></script>
@endif


{{-- whatsapp init code --}}
@if ($websiteInfo->is_whatsapp == 1)
  <script type="text/javascript">
    var whatsapp_popup = {{ $websiteInfo->whatsapp_popup }};
    var whatsappImg = "{{ asset('assets/img/whatsapp.svg') }}";

    $(function() {
      $('#WAButton').floatingWhatsApp({
        phone: "{{ $websiteInfo->whatsapp_number }}", //WhatsApp Business phone number
        headerTitle: "{{ $websiteInfo->whatsapp_header_title }}", //Popup Title
        popupMessage: `{!! nl2br($websiteInfo->whatsapp_popup_message) !!}`, //Popup Message
        showPopup: whatsapp_popup == 1 ? true : false, //Enables popup display
        buttonImage: '<img src="' + whatsappImg + '" />', //Button Image
        position: "right" //Position: left | right
      });
    });
  </script>
@endif

<!--Start of Tawk.to Script-->
@if ($websiteInfo->is_tawkto == 1)
  <script type="text/javascript">
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();

    (function() {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/{{ $websiteInfo->tawkto_property_id }}/default';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  </script>
@endif
<!--End of Tawk.to Script-->
