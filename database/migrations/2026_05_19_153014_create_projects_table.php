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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('category')->nullable();
            $table->text('short_description')->nullable();
            $table->text('description');
            $table->string('project_url')->nullable();
            $table->unsignedTinyInteger('team_size')->default(1);
            $table->json('team_members')->nullable();
            $table->unsignedBigInteger('budget_needed')->nullable(); // in XAF
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
