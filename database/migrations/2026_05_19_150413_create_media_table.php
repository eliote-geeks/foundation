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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('mediable'); // mediable_type + mediable_id
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('filename');          // original filename
            $table->string('path');              // storage path (relative to disk)
            $table->string('disk')->default('public');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');  // bytes
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->boolean('is_image')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
