<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\MemberActivity;
use Illuminate\Support\Facades\Hash;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Création des membres de test...');

        // Données réalistes de membres camerounais
        $membersData = [
            // Adhérents
            [
                'user' => [
                    'name' => 'Jean-Baptiste Ngom',
                    'email' => 'jean.ngom@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'adherent',
                    'first_name' => 'Jean-Baptiste',
                    'last_name' => 'Ngom',
                    'phone' => '+237 691 234 567',
                    'birth_date' => '1990-03-15',
                    'gender' => 'male',
                    'city' => 'Douala',
                    'country' => 'Cameroun',
                    'profession' => 'Ingénieur Informatique',
                    'company' => 'Orange Cameroun',
                    'interests' => ['Technologie', 'Innovation', 'Entrepreneuriat'],
                    'skills' => ['Programmation', 'Gestion de projet', 'Leadership'],
                    'engagement_score' => 750
                ]
            ],
            [
                'user' => [
                    'name' => 'Marie-Claire Ebanda',
                    'email' => 'marie.ebanda@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'adherent',
                    'first_name' => 'Marie-Claire',
                    'last_name' => 'Ebanda',
                    'phone' => '+237 655 123 789',
                    'birth_date' => '1985-07-22',
                    'gender' => 'female',
                    'city' => 'Yaoundé',
                    'country' => 'Cameroun',
                    'profession' => 'Directrice Marketing',
                    'company' => 'MTN Cameroun',
                    'interests' => ['Marketing', 'Communication', 'Développement Durable'],
                    'skills' => ['Communication', 'Marketing Digital', 'Stratégie'],
                    'engagement_score' => 620
                ]
            ],
            [
                'user' => [
                    'name' => 'Paul Biya Mendomo',
                    'email' => 'paul.mendomo@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'adherent',
                    'first_name' => 'Paul Biya',
                    'last_name' => 'Mendomo',
                    'phone' => '+237 677 456 123',
                    'birth_date' => '1992-11-08',
                    'gender' => 'male',
                    'city' => 'Bamenda',
                    'country' => 'Cameroun',
                    'profession' => 'Enseignant',
                    'interests' => ['Éducation', 'Jeunesse', 'Culture'],
                    'skills' => ['Enseignement', 'Animation', 'Organisation'],
                    'engagement_score' => 450
                ]
            ],

            // Ambassadeurs
            [
                'user' => [
                    'name' => 'Sandrine Ngo Malla',
                    'email' => 'sandrine.ngomalla@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'ambassador',
                    'first_name' => 'Sandrine',
                    'last_name' => 'Ngo Malla',
                    'phone' => '+237 698 765 432',
                    'birth_date' => '1988-05-14',
                    'gender' => 'female',
                    'city' => 'Douala',
                    'country' => 'Cameroun',
                    'profession' => 'Entrepreneuse',
                    'company' => 'Tech4Dev Cameroun',
                    'interests' => ['Entrepreneuriat', 'Technologie', 'Formation'],
                    'skills' => ['Leadership', 'Innovation', 'Coaching', 'Communication'],
                    'engagement_score' => 1250
                ]
            ],
            [
                'user' => [
                    'name' => 'Emmanuel Kotto',
                    'email' => 'emmanuel.kotto@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'ambassador',
                    'first_name' => 'Emmanuel',
                    'last_name' => 'Kotto',
                    'phone' => '+237 654 321 098',
                    'birth_date' => '1983-09-30',
                    'gender' => 'male',
                    'city' => 'Yaoundé',
                    'country' => 'Cameroun',
                    'profession' => 'Consultant en Développement',
                    'interests' => ['Développement Durable', 'Agriculture', 'Innovation'],
                    'skills' => ['Stratégie', 'Développement Rural', 'Gestion de projet'],
                    'engagement_score' => 1100
                ]
            ],

            // Bénévoles
            [
                'user' => [
                    'name' => 'Fatima Moussa',
                    'email' => 'fatima.moussa@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'volunteer',
                    'first_name' => 'Fatima',
                    'last_name' => 'Moussa',
                    'phone' => '+237 690 111 222',
                    'birth_date' => '1995-12-03',
                    'gender' => 'female',
                    'city' => 'Garoua',
                    'country' => 'Cameroun',
                    'profession' => 'Étudiante en Médecine',
                    'interests' => ['Santé', 'Solidarité', 'Éducation'],
                    'skills' => ['Soins de santé', 'Organisation', 'Empathie'],
                    'engagement_score' => 380
                ]
            ],
            [
                'user' => [
                    'name' => 'Pierre Manga',
                    'email' => 'pierre.manga@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'volunteer',
                    'first_name' => 'Pierre',
                    'last_name' => 'Manga',
                    'phone' => '+237 676 888 999',
                    'birth_date' => '1991-04-18',
                    'gender' => 'male',
                    'city' => 'Buea',
                    'country' => 'Cameroun',
                    'profession' => 'Agriculteur',
                    'interests' => ['Agriculture', 'Environnement', 'Développement Durable'],
                    'skills' => ['Agriculture', 'Environnement', 'Travail d\'équipe'],
                    'engagement_score' => 290
                ]
            ],

            // Anciens Challengers
            [
                'user' => [
                    'name' => 'Diane Tchounga',
                    'email' => 'diane.tchounga@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'former_challenger',
                    'first_name' => 'Diane',
                    'last_name' => 'Tchounga',
                    'phone' => '+237 693 555 777',
                    'birth_date' => '1993-08-27',
                    'gender' => 'female',
                    'city' => 'Douala',
                    'country' => 'Cameroun',
                    'profession' => 'Designer Graphique',
                    'company' => 'Creative Studio Cameroun',
                    'interests' => ['Design', 'Arts', 'Innovation'],
                    'skills' => ['Design Graphique', 'Créativité', 'Communication Visuelle'],
                    'engagement_score' => 950
                ]
            ],

            // Bénéficiaires
            [
                'user' => [
                    'name' => 'Joseph Ntamack',
                    'email' => 'joseph.ntamack@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'beneficiary',
                    'first_name' => 'Joseph',
                    'last_name' => 'Ntamack',
                    'phone' => '+237 679 333 444',
                    'birth_date' => '1987-01-12',
                    'gender' => 'male',
                    'city' => 'Maroua',
                    'country' => 'Cameroun',
                    'profession' => 'Petit Commerce',
                    'interests' => ['Commerce', 'Développement Personnel'],
                    'skills' => ['Commerce', 'Relations Clients'],
                    'engagement_score' => 180
                ]
            ],

            [
                'user' => [
                    'name' => 'Grace Mboua',
                    'email' => 'grace.mboua@example.com',
                    'password' => Hash::make('password123')
                ],
                'profile' => [
                    'member_type' => 'beneficiary',
                    'first_name' => 'Grace',
                    'last_name' => 'Mboua',
                    'phone' => '+237 681 222 333',
                    'birth_date' => '1989-06-25',
                    'gender' => 'female',
                    'city' => 'Ebolowa',
                    'country' => 'Cameroun',
                    'profession' => 'Couturière',
                    'interests' => ['Artisanat', 'Mode', 'Entrepreneuriat'],
                    'skills' => ['Couture', 'Créativité', 'Artisanat'],
                    'engagement_score' => 200
                ]
            ]
        ];

        foreach ($membersData as $memberData) {
            // Créer l'utilisateur
            $user = User::create($memberData['user']);

            // Créer le profil
            $profileData = $memberData['profile'];
            $profileData['user_id'] = $user->id;
            $profileData['joined_at'] = now()->subDays(rand(1, 365));
            $profileData['last_activity_at'] = now()->subDays(rand(0, 30));
            $profileData['is_active'] = true;
            $profileData['accepts_newsletter'] = true;
            $profileData['accepts_sms'] = rand(0, 1) == 1;
            $profileData['preferred_language'] = 'fr';

            $profile = UserProfile::create($profileData);

            // Créer quelques activités pour chaque membre
            $this->createActivitiesForMember($user, $profile);
        }

        $this->command->info('✅ Membres créés avec succès !');
        $this->command->info('📊 ' . count($membersData) . ' profils créés');
        $this->command->info('🎯 Répartition :');
        $this->command->info('   • Adhérents : 3');
        $this->command->info('   • Ambassadeurs : 2');
        $this->command->info('   • Bénévoles : 2');
        $this->command->info('   • Anciens Challengers : 1');
        $this->command->info('   • Bénéficiaires : 2');
    }

    /**
     * Créer des activités pour un membre
     */
    private function createActivitiesForMember(User $user, UserProfile $profile): void
    {
        $activities = [
            ['type' => 'profile_update', 'title' => 'Inscription à la fondation', 'points' => 50],
            ['type' => 'profile_update', 'title' => 'Profil complété', 'points' => 25],
            ['type' => 'event_attendance', 'title' => 'Participation à un événement', 'points' => 75],
            ['type' => 'volunteer_work', 'title' => 'Travail bénévole', 'points' => 100],
            ['type' => 'referral', 'title' => 'Parrainage d\'un nouveau membre', 'points' => 50],
            ['type' => 'training_completion', 'title' => 'Formation complétée', 'points' => 80],
            ['type' => 'partnership_activity', 'title' => 'Contribution communautaire', 'points' => 60]
        ];

        // Créer 3-6 activités aléatoires pour chaque membre
        $numActivities = rand(3, 6);
        $selectedActivities = array_rand($activities, $numActivities);
        
        if (!is_array($selectedActivities)) {
            $selectedActivities = [$selectedActivities];
        }

        foreach ($selectedActivities as $activityIndex) {
            $activity = $activities[$activityIndex];
            
            MemberActivity::create([
                'user_id' => $user->id,
                'activity_type' => $activity['type'],
                'activity_title' => $activity['title'],
                'activity_data' => [
                    'source' => 'system',
                    'auto_generated' => true
                ],
                'points_earned' => $activity['points'],
                'source' => 'web',
                'ip_address' => '127.0.0.1',
                'created_at' => now()->subDays(rand(0, 90))
            ]);
        }
    }
}