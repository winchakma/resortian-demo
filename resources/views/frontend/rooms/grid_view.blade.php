<div class="col-lg-8">
  @if (count($roomInfos) == 0)
    <div class="row text-center">
      <div class="col bg-white py-5">
        <h3>{{ __('No Room Found!') }}</h3>
      </div>
    </div>
  @else
    <div class="row">
      @foreach ($roomInfos as $roomInfo)
        <div class="col-md-6">
          <!-- Single Room -->
          <div class="single-room">
            <a class="room-thumb d-block" href="{{ route('room_details', [$roomInfo->room_id, $roomInfo->slug]) }}">
              <img class="lazy" data-src="{{ asset('assets/img/rooms/' . $roomInfo->featured_img) }}" alt="room">
              <div class="room-price">
                <p>
                  {{ $currencyInfo->base_currency_symbol_position == 'left' ? $currencyInfo->base_currency_symbol : '' }}
                  {{ $roomInfo->rent }}
                  {{ $currencyInfo->base_currency_symbol_position == 'right' ? $currencyInfo->base_currency_symbol : '' }}
                  / {{ __('Night') }}</p>
              </div>
            </a>

            <div class="room-desc">
              <h4>
                <a
                  href="{{ route('room_details', ['id' => $roomInfo->room_id, 'slug' => $roomInfo->slug]) }}">{{ strlen($roomInfo->title) > 45 ? mb_substr($roomInfo->title, 0, 45, 'utf-8') . '...' : $roomInfo->title }}</a>
              </h4>
              <h6>
                @if ($roomInfo->vendor_id != 0)
                  @php
                    $vendor = App\Models\Vendor::where('id', $roomInfo->vendor_id)->first();
                  @endphp
                  <a href="{{ route('frontend.vendor.details', $vendor->username) }}">{{ __('By') }}
                    {{ $vendor->username }}</a>
                @else
                  @php
                    $admin = App\Models\Admin::first();
                  @endphp
                  <a href="{{ route('frontend.vendor.details', [$admin->username, 'admin' => 'true']) }}">{{ __('By') }}
                    {{ $admin->username }}</a>
                @endif

              </h6>
              <p>{{ $roomInfo->summary }}</p>
              <ul class="room-info">
                <li><i class="far fa-bed"></i>{{ $roomInfo->bed }} {{ $roomInfo->bed == 1 ? __('Bed') : __('Beds') }}
                </li>
                <li><i class="far fa-bath"></i>{{ $roomInfo->bath }}
                  {{ $roomInfo->bath == 1 ? __('Bath') : __('Baths') }}</li>
                @if (!empty($roomInfo->room->adult))
                  <li><i class="far fa-users"></i>{{ $roomInfo->room->adult }}
                    {{ $roomInfo->room->adult == 1 ? __('Adult') : __('Adults') }}</li>
                @endif
                @if (!empty($roomInfo->room->child))
                  <li><i class="far fa-users"></i>{{ $roomInfo->room->child }}
                    {{ $roomInfo->room->child == 1 ? __('Child') : __('Children') }}</li>
                @endif
              </ul>
              @if ($roomRating->room_rating_status == 1)
                @php
                  $avgRating = \App\Models\RoomManagement\RoomReview::where('room_id', $roomInfo->room_id)->avg(
                      'rating',
                  );
                @endphp
                <div class="rate-wrap">
                  <div class="rate">
                    <div class="rating" style="width:{{ $avgRating * 20 }}%"></div>
                  </div>
                </div>

              @endif
            </div>

          </div>
        </div>
      @endforeach
    </div>
  @endif
  <div class="row">
    <div class="col-12">
      {{ $roomInfos->appends(['category' => request()->input('category'), 'dates' => request()->input('dates'), 'beds' => request()->input('beds'), 'baths' => request()->input('baths'), 'guests' => request()->input('guests'), 'sort_by' => request()->input('sort_by'), 'rents' => request()->input('rents'), 'ammenities' => request()->input('ammenities')])->links() }}
    </div>
  </div>
</div>
