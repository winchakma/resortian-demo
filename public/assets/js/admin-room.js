(function ($) {
  'use strict';

  let selected_dates;
  let num_of_nights;
  let subtotal;
  let discount;
  let total;

  $(window).on('load', function () {
    if ($('#date-range').length > 0) {
      selected_dates = $('#date-range').val();
    }

    if ($('#night').length > 0) {
      num_of_nights = $('#night').val();
    }

    if ($('#subtotal').length > 0) {
      subtotal = $('#subtotal').val();
    }

    if ($('#discount').length > 0) {
      discount = $('#discount').val();
    }

    if ($('#total').length > 0) {
      total = $('#total').val();
    }
  });


  $('#roomForm').on('submit', function (e) {
    $('.request-loader').addClass('show');
    e.preventDefault();

    let action = $('#roomForm').attr('action');
    let fd = new FormData(document.querySelector('#roomForm'));

    $.ajax({
      url: action,
      method: 'POST',
      data: fd,
      contentType: false,
      processData: false,
      success: function (data) {
        $('.request-loader').removeClass('show');

        if (data == 'success') {
          location.reload(true);
        }
      },
      error: function (error) {
        $('#roomErrors').show();
        let errors = ``;

        for (let x in error.responseJSON.errors) {
          errors += `<li>
                <p class="text-danger mb-0">${error.responseJSON.errors[x][0]}</p>
              </li>`;
        }

        $('#roomErrors ul').html(errors);

        $('.request-loader').removeClass('show');

        $('html, body').animate({
          scrollTop: $('#roomErrors').offset().top - 100
        }, 1000);
      }
    });
  });

  $(document).on('submit', '#bookingForm', function (e) {
    e.preventDefault(); // prevent default form submit

    $(".request-loader").addClass("show");
    $(e.target).find('button[type="submit"]').attr('disabled', true);
    $(this).find('.dynamic-room-input').remove();

    let selectedRooms = [];

    $('.room-btn.btn-success').each(function () {
      selectedRooms.push({
        room_number: $(this).data('room_number'),
        date: $(this).data('date'),
        room_id: $(this).data('room_id')
      });
    });

    selectedRooms.forEach(function (room, index) {
      $('#bookingForm').append(`
        <input type="hidden" name="rooms[${index}][room_number]" value="${room.room_number}" class="dynamic-room-input">
        <input type="hidden" name="rooms[${index}][date]" value="${room.date}" class="dynamic-room-input">
        <input type="hidden" name="rooms[${index}][room_id]" value="${room.room_id}" class="dynamic-room-input">
      `);
    });

    let fd = new FormData(this);
    let url = $(this).attr('action');
    let method = $(this).attr('method');

    if ($(this).find(".summernote").length > 0) {
      $(this).find(".summernote").each(function () {
        let content = $(this).summernote('code');
        fd.set($(this).attr('name'), content);
      });
    }

    $.ajax({
      url: url,
      method: method,
      data: fd,
      contentType: false,
      processData: false,
      success: function (data) {
        $('.request-loader').removeClass('show');
        $('#bookingForm button[type="submit"]').attr('disabled', false);

        $('.em').each(function () {
          $(this).html('');
        });

        if (data === 'success') {
          location.reload();
        }
      },
      error: function (error) {
        $('.request-loader').removeClass('show');
        $('#bookingForm button[type="submit"]').attr('disabled', false);
        $('.em').each(function () {
          $(this).html('');
        });

        for (let x in error.responseJSON.errors) {
          $('#err_' + x).html(error.responseJSON.errors[x][0]);
        }
      }

    });
  });


  /*******************************************************
  ==========Room Booking with AJAX Request Start==========
  *******************************************************/
  $('#roomBookingNextBtn').on('click', function (e) {
    $(e.target).attr('disabled', true);
    $('.request-loader').addClass('show');

    let action = $('#roomSelectForm').attr('action');
    let roomId = $('#selected-room').val();
    let dates = $('#date-range').val();

    $.get(action, {
      room_category_id: roomId,
      dates: dates
    }, function (response) {
      if ('success' in response) {
        $('.request-loader').removeClass('show');
        $(e.target).attr('disabled', false);

        $('.em').each(function () {
          $(this).html('');
        });

        let url = response.success;

        window.location = url;
      } else if ('error' in response) {
        $('.em').each(function () {
          $(this).html('');
        });

        let errMsg = response.error.room_category_id ? response.error.room_category_id[0] : '';
        let errMsg2 = response.error.dates ? response.error.dates[0] : '';

        $('#err_room_category_id').text(errMsg);
        $('#err_dates').text(errMsg2);

        $('.request-loader').removeClass('show');
        $(e.target).attr('disabled', false);
      }
    });
  });
  /*****************************************************
  ==========Room Booking with AJAX Request End==========
  *****************************************************/


  // initialize date range picker
  let dateArray;

  if (typeof bookedDates != 'undefined') {
    dateArray = bookedDates;
  } else {
    dateArray = [];
  }

  $('#date-range').daterangepicker({
    opens: 'left',
    autoUpdateInput: false,
    locale: {
      format: 'YYYY-MM-DD'
    },
    isInvalidDate: function (date) {
      for (let index = 0; index < dateArray.length; index++) {
        if (date.format('YYYY-MM-DD') == dateArray[index]) {
          return true;
        }
      }
    }
  });

  // show the dates and number of nights in input field when user select a date range
  $('#date-range').on('apply.daterangepicker', function (event, picker) {
    $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));

    // get the difference of two dates, date should be in 'YYYY-MM-DD' format
    let dates = $(this).val();

    // first, slice the string and get the arrival_date & departure_date
    let arrOfDate = dates.split(' ');
    let arrival_date = arrOfDate[0];
    let departure_date = arrOfDate[2];

    // parse the strings into date using Date constructor
    arrival_date = new Date(arrival_date);
    departure_date = new Date(departure_date);

    // get the time difference (in millisecond) of two dates
    let difference_in_time = departure_date.getTime() - arrival_date.getTime();

    // finally, get the night difference of two dates (convert time to night)
    let difference_in_night = difference_in_time / (1000 * 60 * 60 * 24);

    $('#night').val(difference_in_night);

    sendRoomData();
  });

  // remove the dates and number of nights when user click on cancel button
  $('#date-range').on('cancel.daterangepicker', function (event, picker) {
    $(this).val(selected_dates);
    $('#night').val(num_of_nights);
    $('#subtotal').val(subtotal);
    $('#discount').val(discount);
    $('#total').val(total);
  });
})(jQuery);


function applyDiscount(event) {
  let roomSubtotal = $('#subtotal').val();

  let newDiscount = $('#discount').val();

  let newTotal = parseFloat(roomSubtotal) - parseFloat(newDiscount);

  if (isNaN(newTotal)) {
    $('#total').val('0.00');
  } else {
    $('#total').val(newTotal.toFixed(2));
  }
}

function sendRoomData() {
  const totalRooms = document.querySelector('input[name="total_rooms"]').value;
  const roomCategoryId = document.querySelector('input[name="room_category_id"]').value;
  const dates = document.querySelector('input[name="dates"]').value;
  const discount = parseFloat(document.querySelector('input[name="discount"]').value) || 0;
  const bookingInput = document.querySelector('input[name="booking_id"]');
  const bookingId = bookingInput ? parseFloat(bookingInput.value) || 0 : 0;



  $('.search-container').html('');

  $.ajax({
    type: 'GET',
    url: roomUpdateUrl,
    data: {
      totalRooms: totalRooms,
      roomCategoryId: roomCategoryId,
      dates: dates,
      discount: discount,
      bookingId: bookingId
    },
    success: function (response) {
      $('.request-loader').removeClass('show');
      $('.search-container').html(response);

      let totalRent = $('.totalRent').data('amount');
      $('#total').val(parseFloat(totalRent).toFixed(2));

    },
    error: function (xhr) {
      console.log('🔴 AJAX Error');
    }
  });
}

$(document).ready(function () {

  // 1️⃣ Load pre-selected buttons (green)
  $(".room-btn.btn-success").each(function () {
    const $btn = $(this);
    const roomNumber = $btn.data("room_number");
    const roomId = $btn.data("room_id");
    const unitRent = parseFloat($btn.data("rent"));
    const selectedCount = $(`.room-btn.btn-success.selected[data-room_number="${roomNumber}"]`).length;

    if (!$(`.orderItem li[data-room_number="${roomNumber}"]`).length) {
      const subtotal = unitRent * selectedCount;

      const newItem = `
        <li class="list-group-item" data-room_number="${roomNumber}" data-room_id="${roomId}">   
          <span>
            <span class="removeItem btn btn-sm btn-danger">
              <i class="fa fa-times"></i>
            </span>
            ${roomNumber}
          </span>
          <span class="totalDays">${selectedCount}</span>
          <span class="unitRent">${unitRent} ${currency}</span>
          <span class="subTotal" sub_total="${subtotal}">${subtotal.toFixed(2)} ${currency}</span>
        </li>
      `;
      $(".orderItem").append(newItem);
    }
  });

  updateTotals(); // Update totals on load

  // 2️⃣ Room select/deselect
  $(document).on("click", ".room-btn", function () {

    const $btn = $(this);
    if ($btn.attr("data-booked_status") === "1") return;

    const totalRooms = document.querySelector('input[name="total_rooms"]').value;

    const date = $btn.data("date");
    const roomNumber = $btn.data("room_number");
    const roomId = $btn.data("room_id");
    const unitRent = parseFloat($btn.data("rent"));

    const isSelected = $btn.hasClass("btn-success");

    // Count selected rooms for this date (excluding this button if it's already selected)
    const selectedCount = $(`.room-btn.btn-success[data-date="${date}"]`).length;

    if (!isSelected && selectedCount >= totalRooms) {
      alert("You can't select more than " + totalRooms + " rooms for the same date.");
      return;
    }

    // Toggle button class
    if ($btn.hasClass('btn-success')) {
      $btn.removeClass('btn-success').addClass('btn-primary');
    } else {
      $btn.removeClass('btn-primary').addClass('btn-success');
    }

    const selectedCountForRoom = $(`.room-btn.btn-success[data-room_number="${roomNumber}"]`).length;
    const $existingItem = $(`.orderItem li[data-room_number="${roomNumber}"]`);

    if ($btn.hasClass("btn-success")) {
      if (!$existingItem.length) {
        const subtotal = unitRent * selectedCountForRoom;
        const newItem = `
          <li class="list-group-item" data-room_number="${roomNumber}" data-room_id="${roomId}">
            <span>
              <span class="removeItem btn btn-sm btn-danger">
                <i class="fa fa-times"></i>
              </span>
              ${roomNumber}
            </span>
            <span class="totalDays">${selectedCountForRoom}</span>
            <span class="unitRent">${unitRent} ${currency}</span>
            <span class="subTotal" sub_total="${subtotal}">${subtotal.toFixed(2)} ${currency}</span>
          </li>
        `;
        $(".orderItem").append(newItem);
      } else {
        const subtotal = unitRent * selectedCountForRoom;
        $existingItem.find(".totalDays").text(selectedCountForRoom);
        $existingItem.find(".subTotal").text(`${subtotal.toFixed(2)} ${currency}`).attr("sub_total", subtotal);
      }
    } else {
      if (!selectedCountForRoom) {
        $existingItem.remove();
      } else {
        const subtotal = unitRent * selectedCountForRoom;
        $existingItem.find(".totalDays").text(selectedCountForRoom);
        $existingItem.find(".subTotal").text(`${subtotal.toFixed(2)} ${currency}`).attr("sub_total", subtotal);
      }
    }

    updateTotals();
  });


  // 3️⃣ Remove from order
  $(document).on("click", ".removeItem", function () {
    const $li = $(this).closest("li");
    const roomNumber = $li.data("room_number");

    $li.remove();

    $(`.room-btn[data-room_number="${roomNumber}"]`).removeClass("btn-success").addClass("btn-primary");

    updateTotals();
  });

  // 4️⃣ Update totals
  function updateTotals() {
    let grandTotal = 0;
    const discount = parseFloat(document.querySelector('input[name="discount"]').value) || 0;

    $(".orderItem .subTotal").each(function () {
      grandTotal += parseFloat($(this).attr("sub_total"));
    });

    const taxAmount = ((grandTotal - discount) * taxRate) / 100;
    const finalTotal = (grandTotal - discount) + taxAmount;

    $(".totalRent").text(`${grandTotal.toFixed(2)} ${currency}`).attr("data-amount", grandTotal);
    $(".taxCharge").text(`${taxAmount.toFixed(2)}`);
    $(".grandTotalRent").text(`${finalTotal.toFixed(2)} ${currency}`);
    $("input[name='tax_charge']").val(taxAmount.toFixed(2));

    $('#total').val(parseFloat(grandTotal).toFixed(2));
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const paymentSystem = document.getElementById('payment_system');
  const amountField = document.getElementById('amount_field');

  function toggleAmountField() {
    if (paymentSystem.value === 'advance') {
      amountField.style.display = 'block';
    } else {
      amountField.style.display = 'none';
    }
  }

  // Page load check (edit form support)
  toggleAmountField();

  // Change event
  paymentSystem.addEventListener('change', toggleAmountField);
});
document.addEventListener('DOMContentLoaded', function () {
  const paymentStatus = document.getElementById('payment_status');
  const payingAmount = document.getElementById('paying_amount');

  function toggleAmountField() {
    if (paymentStatus.value === '3') { // Assuming '3' is the value for 'Partial Paid'
      payingAmount.style.display = 'block';
    } else {
      payingAmount.style.display = 'none';
    }
  }

  // Page load check (edit form support)
  toggleAmountField();

  // Change event
  paymentStatus.addEventListener('change', toggleAmountField);
});
