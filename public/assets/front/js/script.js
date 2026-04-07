!(function ($) {
    "use strict";

    /*============================================
        Sticky header
    ============================================*/
    $(window).on("scroll", function () {
        var header = $(".header-area");
        // If window scroll down .is-sticky class will added to header
        if ($(window).scrollTop() >= 100) {
            header.addClass("is-sticky");
        } else {
            header.removeClass("is-sticky");
        }
    });

    /*============================================
            Mobile menu
        ============================================*/
    var mobileMenu = function () {
        // Variables
        var body = $("body"),
            mainNavbar = $(".main-navbar"),
            mobileNavbar = $(".mobile-menu"),
            cloneInto = $(".mobile-menu-wrapper"),
            cloneItem = $(".mobile-item"),
            menuToggler = $(".menu-toggler"),
            offCanvasMenu = $("#offcanvasMenu")

        menuToggler.on("click", function () {
            $(this).toggleClass("active");
            body.toggleClass("mobile-menu-active")
        })

        mainNavbar.find(cloneItem).clone(!0).appendTo(cloneInto);

        if (offCanvasMenu) {
            body.find(offCanvasMenu).clone(!0).appendTo(cloneInto);
        }

        mobileNavbar.find("li").each(function (index) {
            var toggleBtn = $(this).children(".toggle")
            toggleBtn.on("click", function (e) {
                $(this)
                    .parent("li")
                    .children("ul")
                    .stop(true, true)
                    .slideToggle(350);
                $(this).parent("li").toggleClass("show");
            })
        })

        // check browser width in real-time
        var checkBreakpoint = function () {
            var winWidth = window.innerWidth;
            if (winWidth <= 1199) {
                mainNavbar.hide();
                mobileNavbar.show()
            } else {
                mainNavbar.show();
                mobileNavbar.hide();
            }
        }
        checkBreakpoint();

        $(window).on('resize', function () {
            checkBreakpoint();
        });
    }
    mobileMenu();


    /*============================================
            Navlink active class
        ============================================*/
    var a = $("#mainMenu .nav-link"),
        c = window.location;

    for (var i = 0; i < a.length; i++) {
        const el = a[i];

        if (el.href == c) {
            el.classList.add("active");
        }
    }


    /*============================================
        Image to background image
    ============================================*/
    var bgImage = $(".bg-img")
    bgImage.each(function () {
        var el = $(this),
            src = el.attr("data-bg-image");

        el.css({
            "background-image": "url(" + src + ")",
            "background-size": "cover",
            "background-position": "center",
            "display": "block"
        });
    });


    /*============================================
        Sliders
    ============================================*/

    // Product Slider
    $(".product-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var slidePerView = $(this).attr("data-slides-per-view");

        var swiper = new Swiper(sliderId, {
            speed: 800,
            spaceBetween: 25,
            loop: true,
            slidesPerView: slidePerView,
            pagination: true,
            autoplay: true,

            pagination: {
                el: sliderId + "-pagination",
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: sliderId + "-next",
                prevEl: sliderId + "-prev",
            },

            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1
                },
                // when window width is >= 768px
                768: {
                    slidesPerView: 2
                },
                // when window width is >= 768px
                992: {
                    slidesPerView: slidePerView
                },
            }
        })
    })
    // Product inline Slider
    $(".product-inline-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var slidePerView = $(this).attr("data-slides-per-view");

        var swiper = new Swiper(sliderId, {
            speed: 800,
            spaceBetween: 25,
            loop: true,
            slidesPerView: slidePerView,
            pagination: true,
            autoplay: true,

            pagination: {
                el: sliderId + "-pagination",
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: sliderId + "-next",
                prevEl: sliderId + "-prev",
            },

            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1
                },
                // when window width is >= 768px
                992: {
                    slidesPerView: 2
                },
                // when window width is >= 768px
                992: {
                    slidesPerView: slidePerView
                },
            }
        })
    })
    // Testimonial slider
    $(".testimonial-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var slidePerView = $(this).attr("data-slides-per-view");

        var swiper = new Swiper(sliderId, {
            speed: 800,
            spaceBetween: 25,
            loop: true,
            slidesPerView: slidePerView,
            pagination: true,
            autoplay: true,

            autoplay: {
                delay: 5000,
            },

            pagination: {
                el: sliderId + "-pagination",
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: sliderId + "-next",
                prevEl: sliderId + "-prev",
            },

            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1
                },
                // when window width is >= 576px
                768: {
                    slidesPerView: 2
                },
                // when window width is >= 768px
                992: {
                    slidesPerView: 3
                },
                1200: {
                    slidesPerView: slidePerView
                },
            }
        })
    })
    // Category Slider
    $(".category-slider").each(function () {
        var id = $(this).attr("id");
        var sliderId = "#" + id;
        var slidePerView = $(this).attr("data-slides-per-view");

        var swiper = new Swiper(sliderId, {
            speed: 800,
            spaceBetween: 25,
            loop: true,
            slidesPerView: slidePerView,
            pagination: true,
            autoplay: true,

            pagination: {
                el: sliderId + "-pagination",
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: sliderId + "-next",
                prevEl: sliderId + "-prev",
            },

            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1
                },
                // when window width is >= 576px
                576: {
                    slidesPerView: 2
                },
                // when window width is >= 768px
                992: {
                    slidesPerView: slidePerView
                },
            }
        })
    })


    /*============================================
        Go to top
    ============================================*/
    $(window).on("scroll", function () {
        // If window scroll down .active class will added to go-top
        var goTop = $(".go-top");

        if ($(window).scrollTop() >= 200) {
            goTop.addClass("active");
        } else {
            goTop.removeClass("active")
        }
    })
    $(".go-top").on("click", function (e) {
        $("html, body").animate({
            scrollTop: 0,
        }, 0);
    });


    /*============================================
        Lazyload image
    ============================================*/
    var lazyLoad = function () {
        window.lazySizesConfig = window.lazySizesConfig || {};
        window.lazySizesConfig.loadMode = 2;
        lazySizesConfig.preloadAfterLoad = true;
    }


    /*============================================
        Odometer
    ============================================*/
    $(".counter").counterUp({
        delay: 10,
        time: 1000
    });


    /*============================================
        Tabs mouse hover animation
    ============================================*/
    if ($("[data-hover='fancyHover']").length > 0) {
        $("[data-hover='fancyHover']").mouseHover();
    }


    /*============================================
        Nice select
    ============================================*/
    $(".niceselect").niceSelect();

    var selectList = $(".nice-select .list")
    $(".nice-select .list").each(function () {
        var list = $(this).children();
        if (list.length > 5) {
            $(this).css({
                "height": "160px",
                "overflow-y": "scroll"
            })
        }
    })


    /*============================================
        Youtube popup
    ============================================*/
    $(".youtube-popup").magnificPopup({
        disableOn: 300,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
    })


    /*============================================
        Cookiebar
    ============================================*/
    window.setTimeout(function () {
        $(".cookie-bar").addClass("show")
    }, 1000);
    $(".cookie-bar .btn").on("click", function () {
        $(".cookie-bar").removeClass("show")
    });


    /*============================================
        Tooltip
    ============================================*/
    var tooltipTriggerList = [].slice.call($('[data-tooltip="tooltip"]'))

    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })


    /*============================================
        Footer date
    ============================================*/
    var date = new Date().getFullYear();
    $("#footerDate").text(date);


    /*============================================
        Document on ready
    ============================================*/
    $(document).ready(function () {
        lazyLoad()
    })

    /*============================================
        Date-range Picker
    ============================================*/
    $('input[name="checkIn"]').daterangepicker({
        opens: 'left',
        "timePicker": true,
        "singleDatePicker": true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    })
    $('input[name="checkOut"]').daterangepicker({
        opens: 'left',
        "timePicker": true,
        "singleDatePicker": true,
        locale: {
            format: 'YYYY-MM-DD'
        }
    })

    // lazyload init
    new LazyLoad();

})(jQuery);


/*============================================
    Window onload functions
============================================*/
$(window).on("load", function () {
    const delay = 350;
    /*============================================
    Preloader
    ============================================*/
    $("#preLoader").delay(delay).fadeOut('slow');

    /*============================================
        Aos animation
    ============================================*/
    var aosAnimation = function () {
        AOS.init({
            easing: "ease",
            duration: 1500,
            once: true,
            offset: 60,
            disable: 'mobile'
        });
    }
    if ($("#preLoader").length > 0) {
        setTimeout(() => {
            aosAnimation()
        }, delay);
    } else {
        aosAnimation();
    }
})
