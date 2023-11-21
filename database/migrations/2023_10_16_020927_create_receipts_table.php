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
        Schema::create('receipts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->string('status');
            $table->string('userId');
            $table->string('couponId')->nullable(true);
            $table->string('total');
            $table->string('name');
            $table->string('phoneNumber');
            $table->string('address');
            $table->text('note')->nullable(true);
            $table->string('createdBy');
            $table->string('updatedBy')->nullable(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
