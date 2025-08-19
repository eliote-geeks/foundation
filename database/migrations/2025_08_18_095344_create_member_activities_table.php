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
        Schema::create('member_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Type d'activité
            $table->enum('activity_type', [
                'login',
                'profile_update',
                'contest_participation',
                'event_attendance',
                'donation',
                'volunteer_work',
                'ambassador_action',
                'challenge_completion',
                'partnership_activity',
                'newsletter_engagement',
                'social_share',
                'referral',
                'feedback_submission',
                'training_completion',
                'other'
            ]);
            
            // Détails de l'activité
            $table->string('activity_title');
            $table->text('activity_description')->nullable();
            $table->json('activity_data')->nullable(); // Données spécifiques à l'activité
            
            // Métadonnées
            $table->integer('points_earned')->default(0); // Points d'engagement
            $table->string('category')->nullable(); // Catégorie de l'activité
            $table->string('subcategory')->nullable();
            
            // Contexte
            $table->string('source')->nullable(); // Web, mobile, email, etc.
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            
            // Géolocalisation
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Statut
            $table->boolean('is_verified')->default(false); // Si l'activité est vérifiée
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['user_id', 'activity_type']);
            $table->index(['activity_type', 'created_at']);
            $table->index(['category', 'subcategory']);
            $table->index('points_earned');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_activities');
    }
};