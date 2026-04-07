!(function ($) {
    "use strict";

    /*============================================
        Sliders
    ============================================*/
    // Home Slider 1
    var homeSlider = new Swiper("#home-slider-2", {
        loop: true,
        speed: 2000,
        grabCursor: true,
        parallax: true,
        slidesPerView: 1,
        effect: 'fade',
        autoplay: true,

        pagination: {
            el: '#home-slider-2-pagination',
            clickable: true
        },

        on: {
            slideChange: function () {
                var doAnimations = function (elements) {
                    var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    elements.each(function () {
                        var animationDelay = $(this).data('delay');
                        var animationType = 'animate__animated ' + $(this).data('animation');
                        $(this).css({
                            'animation-delay': animationDelay,
                            '-webkit-animation-delay': animationDelay
                        });
                        $(this).addClass(animationType).one(animationEndEvents, function () {
                            $(this).removeClass(animationType);
                        });
                    });
                }
                var firstAnimatingElements = $('.swiper-slide').find('[data-animation]');
                doAnimations(firstAnimatingElements);
            },
        },
    });
    var homeImageSlider1 = new Swiper("#home-img-slider-2", {
        loop: true,
        speed: 1500,
        grabCursor: true,
        slidesPerView: 1,
        effect: 'fade'
    });
    // Sync both slider
    homeImageSlider1.controller.control = homeSlider;
    homeSlider.controller.control = homeImageSlider1;

})(jQuery);
