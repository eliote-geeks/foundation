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
        Schema::create('contests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('category')->default('innovation');
            $table->enum('type', ['voting', 'submission', 'quiz', 'challenge'])->default('voting');
            $table->enum('status', ['draft', 'active', 'voting', 'closed', 'completed'])->default('draft');
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->dateTime('voting_start')->nullable();
            $table->dateTime('voting_end')->nullable();
            $table->decimal('entry_fee', 10, 2)->default(0);
            $table->decimal('vote_price', 10, 2)->default(0);
            $table->string('currency', 3)->default('XAF');
            $table->boolean('is_free')->default(true);
            $table->integer('max_participants')->nullable();
            $table->integer('max_votes_per_user')->default(1);
            $table->json('prizes')->nullable();
            $table->json('rules')->nullable();
            $table->json('criteria')->nullable();
            $table->json('sponsors')->nullable();
            $table->json('judges')->nullable();
            $table->json('metadata')->nullable();
            $table->integer('total_participants')->default(0);
            $table->integer('total_votes')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'start_date']);
            $table->index(['category', 'type']);
            $table->index(['voting_start', 'voting_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contests');
    }
};
