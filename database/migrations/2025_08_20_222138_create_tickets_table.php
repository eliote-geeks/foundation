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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('ticket_number')->unique();
            $table->string('attendee_name');
            $table->string('attendee_email');
            $table->string('attendee_phone')->nullable();
            $table->enum('ticket_type', ['standard', 'vip', 'premium', 'student', 'group'])->default('standard');
            $table->decimal('price_paid', 10, 2);
            $table->string('currency', 3)->default('XAF');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'used', 'refunded'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->string('qr_code')->nullable();
            $table->timestamp('purchased_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['event_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('ticket_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
