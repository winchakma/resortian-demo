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
            $table->renameColumn('room_id', 'room_category_id');

            // Add new column
            $table->integer('room_number_id')->nullable();
            $table->json('reserved_dates_info')->nullable();
            $table->integer('booking_status')->nullable()->after('payment_status');

            $table->double('total_rent', 8, 2)->nullable()->after('guests');
            $table->double('service_charge', 8, 2)->nullable()->after('total_rent');
            $table->double('tax_percentage', 8, 2)->nullable()->after('service_charge');
            $table->double('tax', 8, 2)->nullable()->after('tax_percentage');
            $table->json('paid_services')->nullable()->after('grand_total');

            $table->double('paying_amount', 8, 2)->nullable()->after('grand_total');
            $table->double('due', 8, 2)->nullable()->after('paying_amount');

            $table->integer('total_rooms')->default(1);
            $table->string('stay_status')->default('Upcoming')->after('booking_status');

            $table->integer('adult')->nullable()->after('departure_date');
            $table->integer('child')->nullable()->after('adult');
        });

        if (Schema::hasColumn('room_bookings', 'guests')) {
            Schema::table('room_bookings', function (Blueprint $table) {
                $table->dropColumn('guests');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
