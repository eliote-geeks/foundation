<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contest_entries', function (Blueprint $table) {
            $table->string('payment_status')->nullable()->after('submitted_at');
            $table->string('transaction_id')->nullable()->after('payment_status');
            $table->decimal('amount_paid', 10, 2)->nullable()->after('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::table('contest_entries', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'transaction_id', 'amount_paid']);
        });
    }
};
