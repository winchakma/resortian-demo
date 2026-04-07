!(function ($) {
    "use strict";

    /*============================================
        Sliders
    ============================================*/
    // Home Slider 1
    if ($('#home-slider-3').length > 0) {
        var homeSlider = new Swiper("#home-slider-3", {
            loop: true,
            speed: 2000,
            grabCursor: true,
            parallax: true,
            slidesPerView: 1,
            effect: 'fade',
            autoplay: true,

            pagination: {
                el: '#home-slider-3-pagination',
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
        // Sync both slider
        homeImageSlider3.controller.control = homeSlider;
    }
    if ($('#home-img-slider-3').length > 0) {
        var homeImageSlider3 = new Swiper("#home-img-slider-3", {
            loop: true,
            speed: 1500,
            grabCursor: true,
            slidesPerView: 1,
            effect: 'fade'
        });
        homeSlider.controller.control = homeImageSlider3;
    }

    if ($('.sponsor-slider').length > 0) {
        var sponsorSlider = new Swiper(".sponsor-slider", {
            speed: 400,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: "#sponsor-slider-pagination",
                clickable: true,
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is >= 400px
                400: {
                    slidesPerView: 2,
                    spaceBetween: 10
                },
                // when window width is >= 640px
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                // when window width is >= 640px
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            }
        });
    }

})(jQuery);
