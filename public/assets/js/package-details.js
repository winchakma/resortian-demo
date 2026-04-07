var objOfData = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

(function ($) {
  "use strict";

  // show or hide the attachment input field for offline payment gateway
  $('#payment-gateways').on('change', function () {
    // get the selected offline payment gateway id
    var gatewayId = $(this).val();

    if (gatewayId == 'authorizenet') {
      $(".authorize-element").removeClass('d-none');
    } else {
      $(".authorize-element").addClass('d-none');
    }

    if (gatewayId == 'iyzico') {
      $(".iyzico-element").removeClass('d-none');
    } else {
      $(".iyzico-element").addClass('d-none');
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
            if (offlineGateways[key].attachment_status == 1) {
              $('#gateway-attachment').removeClass('d-none');
            } else {
              $('#gateway-attachment').addClass('d-none');
            }

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
      // Directly submit the form without triggering the event handler again
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


  if (pricingType == 'per-person') {
    $('input[name="visitors"]').on('input', function () {
      var visitors = parseInt($(this).val());

      var price = parseFloat($('#base-price').val());

      var newSubtotal = parseInt(visitors) * parseFloat(price);

      if (visitors) {
        $('#subtotal-amount').text(newSubtotal.toLocaleString(undefined, objOfData));
        $('#total-amount').text(newSubtotal.toLocaleString(undefined, objOfData));
      } else {
        $('#subtotal-amount').text(initialPrice);
        $('#total-amount').text(initialPrice);
      }
      let url = baseURL + '/package_booking/remove_coupon';
      $.get(url, function () { })
      $('#discount-amount').html('0.00');
    });
  }


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
  let id = $('#package-id').text();

  if (code) {
    let url = baseURL + '/package_booking/apply_coupon';

    let data = {
      coupon: code,
      initTotal: subtotal,
      packageId: id,
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
