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
    public function up(): void
    {
        if (Schema::hasColumn('room_categories', 'max_guests')) {
            Schema::table('room_categories', function (Blueprint $table) {
                $table->dropColumn('max_guests');
            });
        }

        $toDrop = ['latitude', 'longitude', 'address', 'phone', 'email', 'quantity'];
        $existing = array_values(array_filter($toDrop, fn($col) => Schema::hasColumn('room_categories', $col)));

        if (!empty($existing)) {
            Schema::table('room_categories', function (Blueprint $table) use ($existing) {
                $table->dropColumn($existing);
            });
        }

        Schema::table('room_categories', function (Blueprint $table) {
            $table->unsignedSmallInteger('adult')->default(1);
            $table->unsignedSmallInteger('child')->default(0);
        });

        Schema::table('room_categories', function (Blueprint $table) {
            $table->string('payment_system', 50)->nullable();
            $table->decimal('amount', 12, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('room_categories', function (Blueprint $table) {
            $table->dropColumn('payment_system');
            $table->dropColumn('amount');
        });
    }
};
