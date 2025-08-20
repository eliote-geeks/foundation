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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->text('description');
            $table->string('website')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('contact_person');
            $table->string('contact_position')->nullable();
            $table->string('category'); // Technologie, Finance, Éducation, etc.
            $table->string('partnership_type'); // Financier, Technique, Académique, etc.
            $table->enum('status', ['active', 'pending', 'suspended', 'inactive'])->default('pending');
            $table->decimal('contribution_amount', 15, 2)->nullable();
            $table->string('contribution_currency', 10)->default('FCFA');
            $table->date('partnership_start_date')->nullable();
            $table->date('partnership_end_date')->nullable();
            $table->text('partnership_details')->nullable();
            $table->string('budget_range')->nullable(); // < 1M FCFA, 1-5M FCFA, etc.
            $table->json('sectors_of_interest')->nullable(); // Secteurs d'intérêt du partenaire
            $table->boolean('is_featured')->default(false);
            $table->integer('priority')->default(0);
            $table->text('internal_notes')->nullable();
            $table->timestamp('last_contact_date')->nullable();
            $table->string('contract_reference')->nullable();
            $table->timestamps();
            
            // Index pour améliorer les performances
            $table->index(['status', 'category']);
            $table->index(['partnership_start_date', 'partnership_end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};