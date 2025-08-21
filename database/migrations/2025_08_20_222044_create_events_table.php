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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('location');
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('category')->default('conference');
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('draft');
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->integer('capacity')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 3)->default('XAF');
            $table->boolean('is_free')->default(false);
            $table->boolean('requires_approval')->default(false);
            $table->text('terms_conditions')->nullable();
            $table->json('contact_info')->nullable();
            $table->json('sponsors')->nullable();
            $table->json('agenda')->nullable();
            $table->json('speakers')->nullable();
            $table->json('metadata')->nullable();
            $table->integer('tickets_sold')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'start_date']);
            $table->index(['category', 'published_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
