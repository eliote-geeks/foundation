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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('donation_number')->unique(); // Numéro unique du don
            
            // Relations
            $table->foreignId('campaign_id')->constrained('donation_campaigns')->onDelete('cascade');
            $table->foreignId('donor_id')->constrained('users')->onDelete('cascade');
            
            // Informations du don
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('XAF');
            $table->decimal('amount_usd', 15, 2)->nullable(); // Équivalent USD pour les stats
            $table->decimal('exchange_rate', 8, 4)->nullable();
            
            // Type et récurrence
            $table->enum('type', [
                'one_time',
                'recurring_monthly',
                'recurring_quarterly',
                'recurring_annually',
                'pledge'
            ])->default('one_time');
            
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('is_tribute')->default(false); // Don en hommage
            $table->text('tribute_message')->nullable();
            $table->string('tribute_person')->nullable();
            
            // Informations du donateur (pour dons anonymes ou invités)
            $table->string('donor_email')->nullable();
            $table->string('donor_phone')->nullable();
            $table->string('donor_name')->nullable();
            $table->text('donor_address')->nullable();
            $table->string('donor_city')->nullable();
            $table->string('donor_country')->nullable();
            $table->string('donor_company')->nullable(); // Si don d'entreprise
            
            // Paiement et transaction
            $table->enum('payment_method', [
                'mobile_money',
                'bank_transfer',
                'credit_card',
                'paypal',
                'crypto',
                'cash',
                'check',
                'other'
            ])->default('mobile_money');
            
            $table->enum('payment_status', [
                'pending',
                'processing',
                'completed',
                'failed',
                'cancelled',
                'refunded',
                'partially_refunded'
            ])->default('pending');
            
            $table->string('transaction_id')->nullable();
            $table->string('payment_reference')->nullable();
            $table->string('payment_provider')->nullable(); // Orange Money, MTN, Visa, etc.
            $table->json('payment_data')->nullable(); // Données spécifiques au provider
            
            // Dates importantes
            $table->timestamp('donated_at');
            $table->timestamp('payment_confirmed_at')->nullable();
            $table->timestamp('receipt_sent_at')->nullable();
            $table->timestamp('thank_you_sent_at')->nullable();
            
            // Récurrence pour dons réguliers
            $table->foreignId('parent_donation_id')->nullable()->constrained('donations');
            $table->integer('recurrence_count')->default(1); // Nombre d'occurrences
            $table->timestamp('next_donation_at')->nullable();
            $table->boolean('is_active_subscription')->default(false);
            
            // Fiscal et reçu
            $table->boolean('is_tax_deductible')->default(true);
            $table->decimal('tax_deduction_amount', 15, 2)->nullable();
            $table->string('receipt_number')->nullable();
            $table->json('receipt_data')->nullable(); // Données pour le reçu fiscal
            
            // Communication et marketing
            $table->text('donor_message')->nullable(); // Message du donateur
            $table->text('public_message')->nullable(); // Message public visible
            $table->boolean('allow_contact')->default(true);
            $table->json('communication_preferences')->nullable();
            
            // Origine et attribution
            $table->string('source')->nullable(); // Site web, campagne email, etc.
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('referrer_url')->nullable();
            $table->string('landing_page')->nullable();
            
            // Données techniques
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->json('device_info')->nullable();
            
            // Motivation et feedback
            $table->enum('motivation', [
                'personal_cause',
                'corporate_social_responsibility',
                'tax_benefit',
                'friend_family_request',
                'social_media_influence',
                'emergency_response',
                'religious_beliefs',
                'community_impact',
                'other'
            ])->nullable();
            
            $table->integer('satisfaction_rating')->nullable(); // 1-5
            $table->text('feedback')->nullable();
            
            // Métadonnées et suivi
            $table->json('impact_tracking')->nullable(); // Suivi de l'impact du don
            $table->json('custom_fields')->nullable(); // Champs personnalisés
            $table->text('internal_notes')->nullable(); // Notes internes
            
            // Statut et validation
            $table->boolean('is_verified')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            
            $table->boolean('is_suspicious')->default(false);
            $table->text('suspicious_reason')->nullable();
            
            $table->timestamps();
            
            // Index pour performance et recherche
            $table->index(['campaign_id', 'payment_status']);
            $table->index(['donor_id', 'donated_at']);
            $table->index(['payment_status', 'payment_confirmed_at']);
            $table->index(['type', 'is_active_subscription']);
            $table->index(['donated_at', 'amount']);
            $table->index(['currency', 'amount']);
            $table->index('is_anonymous');
            $table->index('donation_number');
            $table->index('transaction_id');
            $table->index('next_donation_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};