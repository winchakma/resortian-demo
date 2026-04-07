    {{-- bootstrap css --}}
    <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/tinymce-content.css') }}">
    @if ($websiteInfo->theme_version == 'theme_one' || $websiteInfo->theme_version == 'theme_two')
        {{-- jQuery-ui css --}}
        <link rel="stylesheet" href="{{ asset('assets/css/jquery-ui.min.css') }}">
        {{-- plugins css --}}
        <link rel="stylesheet" href="{{ asset('assets/css/plugins.min.css') }}">
        {{-- default css --}}
        <link rel="stylesheet" href="{{ asset('assets/css/default.css') }}">
        {{-- main css --}}
        <link rel="stylesheet" href="{{ asset('assets/css/main.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/main-common.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/vendor.css') }}">
        {{-- responsive css --}}
        <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
    @endif

    @if (in_array($websiteInfo->theme_version, ['theme_three', 'theme_four', 'theme_five']))
        @if (\Illuminate\Support\Facades\Route::currentRouteName() == 'index')
            <!-- Fontawesome Icon CSS -->
            <link rel="stylesheet" href="{{ asset('assets/front/fonts/fontawesome/css/all.min.css') }}">
            <!-- Icomoon Icon CSS -->
            <link rel="stylesheet" href="{{ asset('assets/front/fonts/icomoon/style.css') }}">
            <!-- Date-range Picker -->
            <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/daterangepicker.css') }}">
            <!-- Magnific Popup CSS -->
            <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/magnific-popup.min.css') }}">
            <!-- Swiper Slider -->
            <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/swiper-bundle.min.css') }}">
            <!-- Nice Select -->
            <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/nice-select.css') }}">
            <!-- AOS Animation CSS -->
            <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/aos.min.css') }}">
            <!-- Animate CSS -->
            <link rel="stylesheet" href="{{ asset('assets/front/css/vendors/animate.min.css') }}">
            <!-- Main Style CSS -->
            <link rel="stylesheet" href="{{ asset('assets/css/plugins.min.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/css/main-common.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/base.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/header.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/footer.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/style.css') }}">
        @else
            {{-- jQuery-ui css --}}
            <link rel="stylesheet" href="{{ asset('assets/css/jquery-ui.min.css') }}">
            {{-- plugins css --}}
            <link rel="stylesheet" href="{{ asset('assets/css/plugins.min.css') }}">
            {{-- default css --}}
            <link rel="stylesheet" href="{{ asset('assets/css/default.css') }}">
            <!-- Main Style CSS -->
            <link rel="stylesheet" href="{{ asset('assets/css/main.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/css/main-common.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/css/vendor.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/base.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/header.css') }}">
            <link rel="stylesheet" href="{{ asset('assets/front/css/footer.css') }}">
            <!-- Responsive CSS -->
            <link rel="stylesheet" href="{{ asset('assets/css/responsive.css') }}">
        @endif
        <!-- Responsive CSS -->
        <link rel="stylesheet" href="{{ asset('assets/front/css/responsive.css') }}">
        <!-- Left to Right CSS -->
        @if ($currentLanguageInfo->direction == 1)
            <link rel="stylesheet" href="{{ asset('assets/front/css/rtl.css') }}">
        @endif
    @endif

    <!-- Left to Right CSS -->
    @if ($currentLanguageInfo->direction == 1)
        <link rel="stylesheet" href="{{ asset('assets/css/rtl.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/vendor_rtl.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/rtl-responsive.css') }}">
    @endif
    {{-- base-color css using a php file --}}
    <link rel="stylesheet"
        href="{{ asset('assets/css/base-color.php?color1=' . $websiteInfo->primary_color . '&color2=' . $websiteInfo->secondary_color) }}">
    <style>
        .breadcrumb-area::after {
            background-color: #{{ $websiteInfo->breadcrumb_overlay_color }};
            opacity: {{ $websiteInfo->breadcrumb_overlay_opacity }};
        }
    </style>
    @yield('custom-style')
