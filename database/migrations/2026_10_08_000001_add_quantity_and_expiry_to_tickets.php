<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->unsignedInteger('quantity')->default(1)->after('ticket_type');
            $table->timestamp('reservation_expires_at')->nullable()->after('payment_status');
            $table->index(['status', 'payment_status', 'reservation_expires_at'], 'tickets_reservation_status_idx');
        });

        DB::table('tickets')
            ->select(['id', 'metadata'])
            ->orderBy('id')
            ->chunkById(100, function ($tickets): void {
                foreach ($tickets as $ticket) {
                    $metadata = json_decode($ticket->metadata ?? '{}', true);
                    $quantity = max(1, (int) ($metadata['quantity'] ?? 1));

                    DB::table('tickets')->where('id', $ticket->id)->update(['quantity' => $quantity]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex('tickets_reservation_status_idx');
            $table->dropColumn(['quantity', 'reservation_expires_at']);
        });
    }
};
