<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur admin pour tester le dashboard
        User::create([
            'name' => 'Admin Dashboard',
            'email' => 'admin@fondation-titi.org',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Créer quelques utilisateurs de test
        User::create([
            'name' => 'Jean Mbong',
            'email' => 'jean.mbong@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Marie Nkomo',
            'email' => 'marie.nkomo@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('👥 Utilisateurs créés avec succès !');
        $this->command->info('📧 Email: admin@fondation-titi.org');
        $this->command->info('🔐 Mot de passe: password123');
    }
}