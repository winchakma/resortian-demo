@if ($insufficientDate)
  <p class="text-danger">{{ __('We regret to inform you that there are no available rooms on your selected date.') }}
  </p>
  <input type="hidden" name="total_room_avaiable" value="0" hidden>

  <small id="err_rooms" class="text-danger em"></small>
@else
  <p class="text-primary">
    {{ __('You can book a maximum of') }} {{ $availableCount }} {{ __('rooms at a time.') }}
  </p>
  <input type="hidden" name="total_room_avaiable" value="{{ old('total_room_avaiable', $availableCount) }}">

  <small id="err_rooms" class="text-danger em"></small>
@endif
   