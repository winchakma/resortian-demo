<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('room_bookings', function (Blueprint $table) {
      $table->decimal('admin_paid_commission', 10, 2)->default(0);
      $table->decimal('admin_due_commission', 10, 2)->default(0);

      $table->decimal('vendor_paid_amount', 10, 2)->default(0);
      $table->decimal('vendor_due_amount', 10, 2)->default(0);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('room_bookings', function (Blueprint $table) {
      //
    });
  }
};
