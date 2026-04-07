"use strict";
/*============================================
    popup annoucement
    ============================================*/
function popupAnnouncement($this) {
    let closedPopups = [];
    if (sessionStorage.getItem('closedPopups')) {
        closedPopups = JSON.parse(sessionStorage.getItem('closedPopups'));
    }

    // if the popup is not in closedPopups Array
    if (closedPopups.indexOf($this.data('popup_id')) == -1) {
        $('#' + $this.attr('id')).show();
        let popupDelay = $this.data('popup_delay');

        setTimeout(function() {
            jQuery.magnificPopup.open({
                items: {
                    src: '#' + $this.attr('id')
                },
                type: 'inline',
                callbacks: {
                    afterClose: function() {
                        // after the popup is closed, store it in the sessionStorage & show next popup
                        closedPopups.push($this.data('popup_id'));
                        sessionStorage.setItem('closedPopups', JSON.stringify(closedPopups));


                        if ($this.next('.popup-wrapper').length > 0) {
                            popupAnnouncement($this.next('.popup-wrapper'));
                        }
                    }
                }
            }, 0);
        }, popupDelay);
    } else {
        if ($this.next('.popup-wrapper').length > 0) {
            popupAnnouncement($this.next('.popup-wrapper'));
        }
    }
}

// Preloader
$(window).on('load', function(event) {
    if ($(".popup-wrapper").length > 0) {
        let $firstPopup = $(".popup-wrapper").eq(0);
        popupAnnouncement($firstPopup);
    }

    $('#preLoader').fadeOut(500);
});

/*============================================
Nice select
============================================*/
$(".header-select").niceSelect();

var selectList = $(".nice-select .list")
$(".nice-select .list").each(function() {
    var list = $(this).children();
    if (list.length > 5) {
        $(this).css({
            "height": "160px",
            "overflow-y": "scroll"
        })
    }
})
