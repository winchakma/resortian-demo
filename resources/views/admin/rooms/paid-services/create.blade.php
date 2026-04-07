<div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Add Service') }}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="modal-body">
        <form id="ajaxForm" class="modal-form" action="{{ route('admin.rooms_management.paid_service.store') }}"
          method="post">
          @csrf

          <div class="form-group">
            <label>{{ __('Vendor') }} *</label>
            <select class="form-control select2" name="vendor_id">
              <option value="">{{ __('Please Select') }}</option>
              <option value="0">{{ __('Admin') }}</option>
              @foreach ($vendors as $item)
                <option value="{{ $item->id }}"> {{ $item->username }}</option>
              @endforeach
            </select>
            <p id="err_vendor_id" class="mt-1 mb-0 text-danger em"></p>
          </div>

          <div class="form-group">
            <label for="">{{ __('Name') . '*' }}</label>
            <input type="text" class="form-control" name="name" placeholder="{{ __('Enter Name') }}">
            <p id="err_name" class="mt-1 mb-0 text-danger em"></p>
          </div>
          <div class="form-group">
            <label>{{ __('Price') . ' (' . $currencyInfo->base_currency_text . ')' . '*' }}</label>
            <input type="text" class="form-control" name="price" placeholder="{{ __('Enter Name') }}">
            <p id="err_price" class="mt-1 mb-0 text-danger em"></p>
          </div>
          <div class="form-group">
            <label for="status">{{ __('Status') . '*' }}</label>
            <select id="status" name="status" class="form-control">
              <option selected disabled>{{ __('Select Status') }}</option>
              <option value="1">{{ __('Active') }}</option>
              <option value="0">{{ __('Dective') }}</option>
            </select>
            <p id="err_status" class="mt-1 mb-0 text-danger em"></p>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          {{ __('Close') }}
        </button>
        <button id="submitBtn" type="button" class="btn btn-primary">
          {{ __('Save') }}
        </button>
      </div>
    </div>
  </div>
</div>
