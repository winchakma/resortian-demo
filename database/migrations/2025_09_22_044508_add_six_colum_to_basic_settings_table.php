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
        Schema::table('basic_settings', function (Blueprint $table) {
            $table->boolean('room_auto_approval')->nullable()->default(1);
            $table->time('checkin_time')->nullable()->default('11:00:00');
            $table->time('checkout_time')->nullable()->default('10:00:00');
            $table->decimal('tax', 8, 2)->nullable()->default(0.00);
            $table->string('timezone')->default('Asia/Dhaka');
            $table->string('room_booking_cancellation')->default('active');
            $table->integer('cancellation_time_limit_hours')->default(6);
            $table->unsignedTinyInteger('cancellation_refund_percentage')->default(80);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('basic_settings', function (Blueprint $table) {
            $table->dropColumn(['room_auto_approval', 'checkin_time', 'checkout_time', 'tax']);
            $table->dropColumn('timezone');
            $table->dropColumn([
                'room_booking_cancellation',
                'cancellation_time_limit_hours',
                'cancellation_refund_percentage',
            ]);
        });
    }
};
