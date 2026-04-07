!(function ($) {
    "use strict";

    /*============================================
        Sliders
    ============================================*/
    // Home Slider 1
    var homeSlider1 = new Swiper("#home-slider-1", {
        loop: true,
        speed: 2000,
        grabCursor: true,
        parallax: true,
        slidesPerView: 1,
        autoplay: true,

        pagination: {
            el: '#home-slider-1-pagination',
            clickable: true
        },
    });
    var homeImageSlider1 = new Swiper("#home-img-slider-1", {
        loop: true,
        speed: 1500,
        grabCursor: true,
        slidesPerView: 1
    });
    // Sync both slider
    homeImageSlider1.controller.control = homeSlider1;
    homeSlider1.controller.control = homeImageSlider1;

})(jQuery);