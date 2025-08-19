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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Type de membre
            $table->enum('member_type', [
                'adherent', 
                'ambassador', 
                'former_challenger', 
                'partner',
                'volunteer',
                'beneficiary'
            ])->default('adherent');
            
            // Informations personnelles
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            
            // Adresse
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('Cameroon');
            
            // Informations professionnelles
            $table->string('profession')->nullable();
            $table->string('company')->nullable();
            $table->text('bio')->nullable();
            
            // Préférences et intérêts
            $table->json('interests')->nullable(); // Education, Santé, Environnement, etc.
            $table->json('skills')->nullable(); // Compétences spécifiques
            $table->string('preferred_language', 2)->default('fr');
            
            // Informations spécifiques par type
            $table->json('type_specific_data')->nullable(); // Données flexibles selon le type
            
            // Statut et engagement
            $table->boolean('is_active')->default(true);
            $table->date('joined_at')->nullable();
            $table->integer('engagement_score')->default(0); // Score d'engagement
            $table->timestamp('last_activity_at')->nullable();
            
            // Communication
            $table->boolean('accepts_newsletter')->default(true);
            $table->boolean('accepts_sms')->default(false);
            $table->boolean('accepts_phone_calls')->default(false);
            $table->json('notification_preferences')->nullable();
            
            // Réseaux sociaux
            $table->string('linkedin_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('twitter_url')->nullable();
            
            // Avatar et documents
            $table->string('avatar_path')->nullable();
            $table->json('documents')->nullable(); // CV, certifications, etc.
            
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['member_type', 'is_active']);
            $table->index(['city', 'country']);
            $table->index('engagement_score');
            $table->index('last_activity_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};