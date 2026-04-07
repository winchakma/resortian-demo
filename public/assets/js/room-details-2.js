var objOfData = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

(function ($) {
  'use strict';

  var dateArray = bookingDates;

  // initialize date range picker
  $('#date-range').daterangepicker({
    minDate: new Date(),
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
    },
    isCustomDate: function (date) {
      for (let index = 0; index < dateArray.length; index++) {
        if (date.format('YYYY-MM-DD') == dateArray[index]) {
          return ['room-booked-date'];
        }
      }
    }
  });


  // show the dates and number of nights in input field when user select a date range
  $('#date-range').on('apply.daterangepicker', function (event, picker) {
    $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));

    // get the difference of two dates, date should be in 'YYYY-MM-DD' format
    var dates = $(this).val();

    // first, slice the string and get the arrival_date & departure_date
    var arrOfDate = dates.split(' ');
    var arrival_date = arrOfDate[0];
    var departure_date = arrOfDate[2];

    // parse the strings into date using Date constructor
    arrival_date = new Date(arrival_date);
    departure_date = new Date(departure_date);

    // get the time difference (in millisecond) of two dates
    var difference_in_time = departure_date.getTime() - arrival_date.getTime();

    // finally, get the night difference of two dates (convert time to night)
    var difference_in_night = difference_in_time / (1000 * 60 * 60 * 24);

    $('#night').val(difference_in_night);

    // calculate room rent
    var totalRent = difference_in_night * parseFloat(roomRentPerNight);

    $('#subtotal-amount').text(totalRent.toLocaleString(undefined, objOfData));
    $('#total-amount').text(totalRent.toLocaleString(undefined, objOfData));

    let url = baseURL + '/room_booking/remove_coupon';

    $.get(url, function (response) {
      $('#discount-amount').text('0.00');
    })
  });

  // remove the dates and number of nights when user click on cancel button
  $('#date-range').on('cancel.daterangepicker', function (event, picker) {
    $(this).val('');
    $('#night').val('');
    $('#subtotal-amount').text('0.00');
    $('#total-amount').text('0.00');
  });


  // show or hide the attachment input field for offline payment gateway
  $('#payment-gateways').on('change', function () {
    // get the selected offline payment gateway id
    var gatewayId = $(this).val();

    if (gatewayId == 'iyzico') {
      $(".iyzico-element").removeClass('d-none');
    } else {
      $(".iyzico-element").addClass('d-none');
    }
    if (gatewayId == 'authorizenet') {
      $(".authorize-element").removeClass('d-none');
    } else {
      $(".authorize-element").addClass('d-none');
    }

    if (gatewayId == 'stripe') {
      $("#stripe-element").removeClass('d-none');

      $('#gateway-description').removeClass('d-block');
      $('#gateway-description').addClass('d-none');
      $('#gateway-instruction').removeClass('d-block');
      $('#gateway-instruction').addClass('d-none');
      $('#gateway-attachment').removeClass('d-block');
      $('#gateway-attachment').addClass('d-none');
    } else {
      $("#stripe-element").addClass('d-none');

      // change string type to integer type
      gatewayId = parseInt(gatewayId);

      // loop to check which element's id match with selected offline payment's id
      for (var key in offlineGateways) {
        if (Object.hasOwnProperty.call(offlineGateways, key)) {
          var elementId = offlineGateways[key].id;

          if (elementId == gatewayId) {
            if (offlineGateways[key].short_description.length > 0) {
              $('#gateway-description').removeClass('d-none');
              $('#gateway-description').html(offlineGateways[key].short_description);
            } else {
              $('#gateway-description').addClass('d-none');
            }

            if (offlineGateways[key].instructions.length > 0) {
              $('#gateway-instruction').removeClass('d-none');
              $('#gateway-instruction').html(offlineGateways[key].instructions);
            } else {
              $('#gateway-instruction').addClass('d-none');
            }

            if (offlineGateways[key].attachment_status == 1) {
              $('#gateway-attachment').removeClass('d-none');
            } else {
              $('#gateway-attachment').addClass('d-none');
            }
            break;
          } else {
            $('#gateway-description').addClass('d-none');
            $('#gateway-instruction').addClass('d-none');
            $('#gateway-attachment').addClass('d-none');
          }
        }
      }
    }
  });

  if (typeof stripe_key != 'undefined') {

    // Set your Stripe public key
    var stripe = Stripe(stripe_key);
    // Create a Stripe Element for the card field
    var elements = stripe.elements();

    var cardElement = elements.create('card', {
      style: {
        base: {
          iconColor: '#454545',
          color: '#454545',
          fontWeight: '500',
          lineHeight: '50px',
          fontSmoothing: 'antialiased',
          backgroundColor: '#f2f2f2',
          ':-webkit-autofill': {
            color: '#454545',
          },
          '::placeholder': {
            color: '#454545',
          },
        }
      },
    });

    // Add an instance of the card Element into the `card-element` div
    cardElement.mount('#stripe-element');
    // Send the token to your server
  }

  // Send the token to your server
  function stripeTokenHandler(token) {
    // Add the token to the form data before submitting to the server
    var form = document.getElementById('my-checkout-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    // Submit the form to your server
    form.submit();
  }

  $('#my-checkout-form').on('submit', function (event) {
    event.preventDefault();
    const slectedPaymentGateway = $('#payment-gateways').val();
    if (slectedPaymentGateway == 'stripe') {
      stripe.createToken(cardElement).then(function (result) {
        if (result.error) {
          // Display errors to the customer
          var errorElement = document.getElementById('stripe-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server
          stripeTokenHandler(result.token);
        }
      });
    } else if (slectedPaymentGateway == 'authorizenet') {
      sendPaymentDataToAnet();
    } else {
      document.getElementById('my-checkout-form').submit();
    }
  });

  function sendPaymentDataToAnet() {
    // Set up authorisation to access the gateway.
    var authData = {};
    authData.clientKey = anet_public_key;
    authData.apiLoginID = anet_login_id;

    var cardData = {};
    cardData.cardNumber = document.getElementById("anetCardNumber").value;
    cardData.month = document.getElementById("anetExpMonth").value;
    cardData.year = document.getElementById("anetExpYear").value;
    cardData.cardCode = document.getElementById("anetCardCode").value;

    // Now send the card data to the gateway for tokenisation.
    // The responseHandler function will handle the response.
    var secureData = {};
    secureData.authData = authData;
    secureData.cardData = cardData;
    Accept.dispatchData(secureData, responseHandler);
  }

  function responseHandler(response) {
    if (response.messages.resultCode === "Error") {
      var i = 0;
      let errorLists = ``;
      while (i < response.messages.message.length) {
        errorLists += `<li class="text-danger">${response.messages.message[i].text}</li>`;

        i = i + 1;
      }
      $("#anetErrors").show();
      $("#anetErrors").html(errorLists);
      buttonDisableFalse();
    } else {
      paymentFormUpdate(response.opaqueData);
    }
  }

  function paymentFormUpdate(opaqueData) {
    document.getElementById("opaqueDataDescriptor").value = opaqueData.dataDescriptor;
    document.getElementById("opaqueDataValue").value = opaqueData.dataValue;
    document.getElementById("my-checkout-form").submit();
  }


  // get the rating (star) value in integer
  $('.review-value li a').on('click', function () {
    var ratingValue = $(this).attr('data-ratingVal');

    // first, remove star color from all the 'review-value' class
    $('.review-value li a i').removeClass('text-warning');

    // second, add star color to the selected parent class
    var parentClass = 'review-' + ratingValue;
    $('.' + parentClass + ' li a i').addClass('text-warning');

    // finally, set the rating value to a hidden input field
    $('#ratingId').val(ratingValue);
  });


  $('#coupon-code').on('keypress', function (e) {
    let key = e.which;

    if (key == 13) {
      applyCoupon(e);
    }
  });
})(jQuery);

function applyCoupon(event) {
  event.preventDefault();

  let code = $('#coupon-code').val();
  let subtotal = $('#subtotal-amount').text();
  let id = $('#room-id').text();

  if (code) {
    let url = baseURL + '/room_booking/apply_coupon';

    let data = {
      coupon: code,
      initTotal: subtotal,
      roomId: id,
      _token: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    };

    $.post(url, data, function (response) {
      if ('success' in response) {
        $('#coupon-code').val('');

        var discount = response.discount;
        var total = response.total;

        $('#discount-amount').text(discount.toLocaleString(undefined, objOfData));
        $('#total-amount').text(total.toLocaleString(undefined, objOfData));

        toastr['success'](response.success);
      } else if ('error' in response) {
        toastr['error'](response.error);
      }
    });
  } else {
    alert('Please enter your coupon code.');
  }
}
