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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, boolean, integer
            $table->string('group')->default('general');
            $table->string('label')->nullable();
            $table->timestamps();
        });

        // Default settings
        DB::table('site_settings')->insert([
            ['key' => 'donation_mtn_number',    'value' => '+237 6XX XXX XXX', 'type' => 'string', 'group' => 'donations', 'label' => 'Numéro MTN Mobile Money',    'created_at' => now(), 'updated_at' => now()],
            ['key' => 'donation_orange_number', 'value' => '+237 6XX XXX XXX', 'type' => 'string', 'group' => 'donations', 'label' => 'Numéro Orange Money',         'created_at' => now(), 'updated_at' => now()],
            ['key' => 'donation_contact_name',  'value' => 'TITI EVENTS',      'type' => 'string', 'group' => 'donations', 'label' => 'Nom du bénéficiaire',         'created_at' => now(), 'updated_at' => now()],
            ['key' => 'org_phone',              'value' => '+237 6XX XXX XXX', 'type' => 'string', 'group' => 'general',   'label' => 'Téléphone de contact',       'created_at' => now(), 'updated_at' => now()],
            ['key' => 'org_email',              'value' => 'info@titi-events.org', 'type' => 'string', 'group' => 'general', 'label' => 'Email de contact',         'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
