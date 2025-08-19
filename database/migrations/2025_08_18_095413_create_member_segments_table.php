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
        Schema::create('member_segments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            
            // Critères de segmentation
            $table->json('criteria'); // Critères de filtrage complexes
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            
            // Métadonnées
            $table->integer('member_count')->default(0); // Cache du nombre de membres
            $table->timestamp('last_calculated_at')->nullable();
            $table->boolean('auto_update')->default(true); // Mise à jour automatique
            
            // Audit
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            
            $table->timestamps();
            
            $table->index(['status', 'auto_update']);
            $table->index('last_calculated_at');
        });

        // Table pivot pour les membres dans les segments
        Schema::create('member_segment_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_segment_id')->constrained()->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->boolean('is_manual')->default(false); // Si assigné manuellement
            
            $table->unique(['user_id', 'member_segment_id']);
            $table->index(['member_segment_id', 'assigned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_segment_assignments');
        Schema::dropIfExists('member_segments');
    }
};