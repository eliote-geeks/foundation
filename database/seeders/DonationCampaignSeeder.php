<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DonationCampaign;
use App\Models\User;

class DonationCampaignSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des campagnes réalistes pour le Cameroun
        $campaigns = [
            [
                'title' => 'Éducation pour Tous - Construction École Rurale',
                'description' => 'Construire une école primaire dans le village de Ndop pour permettre à 300 enfants d\'accéder à l\'éducation. Le projet inclut la construction de 6 salles de classe, d\'une bibliothèque et de latrines.',
                'short_description' => 'Construction d\'une école primaire pour 300 enfants à Ndop.',
                'category' => 'education',
                'type' => 'project_specific',
                'status' => 'active',
                'start_date' => now()->subMonths(2),
                'end_date' => now()->addMonths(4),
                'target_amount' => 15000000, // 15M XAF
                'current_amount' => 8500000,
                'min_amount' => 5000,
                'target_donors' => 150,
                'suggested_amounts' => [10000, 25000, 50000, 100000, 250000],
                'allow_anonymous' => true,
                'allow_recurring' => false,
                'show_donors' => true,
                'published_at' => now()->subMonths(2),
                'impact_metrics' => [
                    'children_beneficiaries' => 300,
                    'teachers_jobs' => 8,
                    'communities_impacted' => 5
                ]
            ],
            [
                'title' => 'Eau Potable pour Bafoussam',
                'description' => 'Installation de 10 forages équipés de pompes manuelles dans les quartiers défavorisés de Bafoussam pour fournir l\'accès à l\'eau potable à plus de 2000 personnes.',
                'short_description' => 'Installation de forages pour l\'eau potable à Bafoussam.',
                'category' => 'infrastructure',
                'type' => 'project_specific',
                'status' => 'active',
                'start_date' => now()->subMonth(),
                'end_date' => now()->addMonths(6),
                'target_amount' => 25000000, // 25M XAF
                'current_amount' => 4200000,
                'min_amount' => 10000,
                'target_donors' => 200,
                'suggested_amounts' => [15000, 30000, 75000, 150000, 500000],
                'allow_anonymous' => true,
                'allow_recurring' => true,
                'show_donors' => true,
                'published_at' => now()->subMonth(),
                'impact_metrics' => [
                    'people_beneficiaries' => 2000,
                    'water_points' => 10,
                    'daily_water_liters' => 50000
                ]
            ],
            [
                'title' => 'Urgence Inondations Nord Cameroun',
                'description' => 'Aide d\'urgence pour les victimes des inondations dans la région du Nord : distribution de vivres, médicaments, abris temporaires et kits d\'hygiène pour 500 familles sinistrées.',
                'short_description' => 'Aide d\'urgence pour les victimes d\'inondations.',
                'category' => 'emergency',
                'type' => 'emergency',
                'status' => 'active',
                'start_date' => now()->subWeeks(3),
                'end_date' => now()->addMonth(),
                'target_amount' => 8000000, // 8M XAF
                'current_amount' => 6800000,
                'min_amount' => 5000,
                'target_donors' => 300,
                'suggested_amounts' => [5000, 15000, 30000, 50000, 100000],
                'allow_anonymous' => true,
                'allow_recurring' => false,
                'show_donors' => true,
                'published_at' => now()->subWeeks(3),
                'impact_metrics' => [
                    'families_helped' => 500,
                    'food_packages' => 1500,
                    'medical_kits' => 800
                ]
            ],
            [
                'title' => 'Formation Professionnelle Jeunes Douala',
                'description' => 'Programme de formation en mécanique automobile, électricité et couture pour 100 jeunes déscolarisés de Douala. Incluant équipement d\'ateliers et suivi post-formation.',
                'short_description' => 'Formation professionnelle pour 100 jeunes de Douala.',
                'category' => 'education',
                'type' => 'project_specific',
                'status' => 'active',
                'start_date' => now()->addWeek(),
                'end_date' => now()->addYear(),
                'target_amount' => 12000000, // 12M XAF
                'current_amount' => 2100000,
                'min_amount' => 10000,
                'target_donors' => 120,
                'suggested_amounts' => [20000, 50000, 100000, 200000, 500000],
                'allow_anonymous' => true,
                'allow_recurring' => true,
                'show_donors' => true,
                'published_at' => now(),
                'impact_metrics' => [
                    'youth_trained' => 100,
                    'job_placement_rate' => 80,
                    'workshops_equipped' => 3
                ]
            ],
            [
                'title' => 'Campagne Santé Maternelle Yaoundé',
                'description' => 'Amélioration des soins de santé maternelle dans 5 centres de santé de Yaoundé : équipement médical, formation des sages-femmes, et consultations gratuites pour 1000 femmes.',
                'short_description' => 'Amélioration des soins de santé maternelle à Yaoundé.',
                'category' => 'health',
                'type' => 'project_specific',
                'status' => 'completed',
                'start_date' => now()->subMonths(8),
                'end_date' => now()->subMonth(),
                'target_amount' => 18000000, // 18M XAF
                'current_amount' => 19200000, // Dépassé l'objectif
                'min_amount' => 15000,
                'target_donors' => 180,
                'suggested_amounts' => [25000, 50000, 100000, 250000, 500000],
                'allow_anonymous' => true,
                'allow_recurring' => false,
                'show_donors' => true,
                'published_at' => now()->subMonths(8),
                'completed_at' => now()->subMonth(),
                'impact_metrics' => [
                    'women_treated' => 1250,
                    'health_centers' => 5,
                    'equipment_donated' => 15
                ]
            ],
            [
                'title' => 'Reforestation Mont Cameroun',
                'description' => 'Plantation de 50,000 arbres sur les flancs du Mont Cameroun pour lutter contre l\'érosion et préserver la biodiversité. Implication des communautés locales dans la gestion durable.',
                'short_description' => 'Plantation de 50,000 arbres au Mont Cameroun.',
                'category' => 'environment',
                'type' => 'project_specific',
                'status' => 'active',
                'start_date' => now()->subWeeks(6),
                'end_date' => now()->addMonths(8),
                'target_amount' => 6000000, // 6M XAF
                'current_amount' => 3400000,
                'min_amount' => 5000,
                'target_donors' => 250,
                'suggested_amounts' => [5000, 15000, 25000, 50000, 100000],
                'allow_anonymous' => true,
                'allow_recurring' => true,
                'show_donors' => true,
                'published_at' => now()->subWeeks(6),
                'impact_metrics' => [
                    'trees_planted' => 28000,
                    'hectares_reforested' => 100,
                    'communities_involved' => 8
                ]
            ],
            [
                'title' => 'Soutien Entrepreneurs Femmes Bamenda',
                'description' => 'Microcrédits et formation en gestion pour 50 femmes entrepreneures de Bamenda. Accompagnement sur 2 ans pour développer leurs activités génératrices de revenus.',
                'short_description' => 'Microcrédits pour femmes entrepreneures de Bamenda.',
                'category' => 'poverty',
                'type' => 'general',
                'status' => 'draft',
                'start_date' => now()->addMonth(),
                'end_date' => now()->addMonths(18),
                'target_amount' => 10000000, // 10M XAF
                'current_amount' => 0,
                'min_amount' => 10000,
                'target_donors' => 100,
                'suggested_amounts' => [25000, 50000, 100000, 200000, 500000],
                'allow_anonymous' => true,
                'allow_recurring' => true,
                'show_donors' => true,
                'impact_metrics' => [
                    'women_supported' => 50,
                    'businesses_created' => 35,
                    'jobs_created' => 150
                ]
            ],
            [
                'title' => 'Bibliothèque Numérique Universités',
                'description' => 'Création d\'une bibliothèque numérique accessible aux étudiants de 3 universités camerounaises : 10,000 livres numériques, plateforme e-learning et formation aux outils numériques.',
                'short_description' => 'Bibliothèque numérique pour universités camerounaises.',
                'category' => 'technology',
                'type' => 'project_specific',
                'status' => 'paused',
                'start_date' => now()->subMonths(3),
                'end_date' => now()->addMonths(9),
                'target_amount' => 20000000, // 20M XAF
                'current_amount' => 5600000,
                'min_amount' => 20000,
                'target_donors' => 150,
                'suggested_amounts' => [30000, 75000, 150000, 300000, 1000000],
                'allow_anonymous' => true,
                'allow_recurring' => false,
                'show_donors' => true,
                'published_at' => now()->subMonths(3),
                'impact_metrics' => [
                    'students_beneficiaries' => 15000,
                    'universities_connected' => 3,
                    'digital_books' => 10000
                ]
            ]
        ];

        // Récupérer le premier utilisateur comme créateur par défaut
        $creator = User::first();
        if (!$creator) {
            $creator = User::create([
                'name' => 'Admin Foundation',
                'email' => 'admin@foundation.cm',
                'password' => bcrypt('password'),
            ]);
        }

        foreach ($campaigns as $campaignData) {
            $campaignData['slug'] = \Str::slug($campaignData['title']) . '-' . time() . '-' . rand(100, 999);
            $campaignData['created_by'] = $creator->id;
            $campaignData['currency'] = 'XAF';
            
            // Calculer les statistiques
            if ($campaignData['current_amount'] > 0) {
                $campaignData['completion_percentage'] = min(100, ($campaignData['current_amount'] / $campaignData['target_amount']) * 100);
                $campaignData['donor_count'] = rand(15, 150);
                $campaignData['donation_count'] = rand($campaignData['donor_count'], $campaignData['donor_count'] * 3);
                $campaignData['average_donation'] = $campaignData['current_amount'] / $campaignData['donation_count'];
            } else {
                $campaignData['completion_percentage'] = 0;
                $campaignData['donor_count'] = 0;
                $campaignData['donation_count'] = 0;
                $campaignData['average_donation'] = 0;
            }

            DonationCampaign::create($campaignData);
        }

        $this->command->info('✅ Campagnes de dons créées avec succès !');
    }
}