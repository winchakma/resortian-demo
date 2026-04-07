<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{ $websiteInfo->website_title }}</title>
  <link rel="shortcut icon" type="image/png" href="{{ asset('assets/img/' . $websiteInfo->favicon) }}">
</head>

<body>
  <button class="btn btn-primary" id="pay-button" style="display: none">{{ __('Pay Now') }}</button>

  <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
  @if ($is_production == 0)
    <script src="https://app.midtrans.com/snap/snap.js" data-client-key="{{ $client_key }}"></script>
  @else
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="{{ $client_key }}"></script>
  @endif

  <script>
    var success_url = "{{ $success_url }}";
    var _cancel_url = "{{ $_cancel_url }}";
    $(document).ready(function() {
      $('#pay-button').trigger('click');
    })

    const payButton = document.querySelector('#pay-button');
    payButton.addEventListener('click', function(e) {
      e.preventDefault();

      snap.pay('{{ $snapToken }}', {
        // Optional
        onSuccess: function(result) {
          let orderId = result.order_id;
          let status_code = result.status_code;
          window.location.href = success_url + "/?order_id=" + orderId + '&status_code=' + status_code;
        },
        // Optional
        onPending: function(result) {
          window.location.href = _cancel_url;
        },
        // Optional
        onError: function(result) {
          window.location.href = _cancel_url;
        }
      });
    });
  </script>
</body>

</html>
