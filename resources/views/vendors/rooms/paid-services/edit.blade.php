<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
  aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Update Service') }}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="modal-body">
        <form id="ajaxEditForm" class="modal-form" action="{{ route('vendor.rooms_management.paid_service.update') }}"
          method="post">
          @csrf
          <input type="hidden" name="service_id" id="in_id">

          <div class="form-group">
            <label for="">{{ __('Name') . '*' }}</label>
            <input type="text" class="form-control" name="name" placeholder="{{ __('Enter Name') }}"id="in_name">
            <p id="editErr_name" class="mt-1 mb-0 text-danger em"></p>
          </div>
          <div class="form-group">
            <label>{{ __('Price') . ' (' . $currencyInfo->base_currency_text . ')' . '*' }}</label>
            <input type="text" class="form-control" name="price"
              placeholder="{{ __('Enter Price') }}"id="in_price">
            <p id="editErr_price" class="mt-1 mb-0 text-danger em"></p>
          </div>

          <div class="form-group">
            <label for="status">{{ __('Status') . '*' }}</label>
            <select name="status" class="form-control" id="in_status">
              <option selected disabled>{{ __('Select Status') }}</option>
              <option value="1">{{ __('Active') }}</option>
              <option value="0">{{ __('Dective') }}</option>
            </select>
            <p id="editErr_status" class="mt-1 mb-0 text-danger em"></p>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          {{ __('Close') }}
        </button>
        <button id="updateBtn" type="button" class="btn btn-primary">
          {{ __('Update') }}
        </button>
      </div>
    </div>
  </div>
</div>
