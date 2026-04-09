<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->unsignedBigInteger('district_id')->index();
            $table->string('name');
            $table->string('short_description')->nullable();
            $table->text('long_description')->nullable();
            $table->json('images')->nullable();
            $table->string('location')->index();
            $table->float('rating')->default(0);
            $table->integer('reviews_count')->default(0);
            $table->integer('price')->nullable();
            $table->json('amenities')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
