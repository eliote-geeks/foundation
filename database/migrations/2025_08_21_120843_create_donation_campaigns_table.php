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
        Schema::create('donation_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('slug')->unique();
            
            // Catégorie et type de campagne
            $table->enum('category', [
                'education',
                'health',
                'environment',
                'poverty',
                'emergency',
                'infrastructure',
                'technology',
                'culture',
                'sport',
                'other'
            ])->default('other');
            
            $table->enum('type', [
                'general',
                'project_specific',
                'emergency',
                'recurring',
                'crowdfunding',
                'memorial',
                'tribute',
                'corporate'
            ])->default('general');
            
            // Image et galerie
            $table->string('image')->nullable();
            $table->json('gallery')->nullable(); // Array d'images
            
            // Dates et durée
            $table->datetime('start_date');
            $table->datetime('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled'])->default('draft');
            
            // Objectifs financiers
            $table->decimal('target_amount', 15, 2); // Objectif de collecte
            $table->decimal('current_amount', 15, 2)->default(0); // Montant collecté
            $table->decimal('min_amount', 10, 2)->nullable(); // Don minimum
            $table->decimal('max_amount', 15, 2)->nullable(); // Don maximum
            $table->string('currency', 3)->default('XAF');
            
            // Métriques de performance
            $table->integer('donor_count')->default(0);
            $table->integer('donation_count')->default(0);
            $table->decimal('average_donation', 10, 2)->default(0);
            $table->integer('target_donors')->nullable(); // Nombre de donateurs cible
            $table->decimal('completion_percentage', 5, 2)->default(0);
            
            // Contenu détaillé
            $table->longText('full_content')->nullable(); // Contenu détaillé en markdown
            $table->json('impact_metrics')->nullable(); // Métriques d'impact espérées
            $table->json('updates')->nullable(); // Mises à jour de la campagne
            $table->json('faq')->nullable(); // Questions fréquentes
            
            // Configuration des dons
            $table->json('suggested_amounts')->nullable(); // Montants suggérés
            $table->boolean('allow_anonymous')->default(true);
            $table->boolean('allow_recurring')->default(false);
            $table->boolean('show_donors')->default(true);
            $table->boolean('send_thank_you')->default(true);
            
            // Localisation et ciblage
            $table->json('target_regions')->nullable(); // Régions ciblées
            $table->json('beneficiary_info')->nullable(); // Informations sur les bénéficiaires
            
            // SEO et marketing
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('social_sharing')->nullable(); // Config partage réseaux sociaux
            $table->string('tracking_code')->nullable(); // Code de suivi analytics
            
            // Relations
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('responsible_by')->nullable()->constrained('users');
            $table->json('team_members')->nullable(); // Équipe de la campagne
            
            // Audit et timestamps
            $table->timestamp('published_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            // Index pour performance
            $table->index(['status', 'is_active']);
            $table->index(['category', 'type']);
            $table->index(['start_date', 'end_date']);
            $table->index(['target_amount', 'current_amount']);
            $table->index('completion_percentage');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_campaigns');
    }
};