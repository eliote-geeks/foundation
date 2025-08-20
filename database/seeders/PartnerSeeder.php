<?php

namespace Database\Seeders;

use App\Models\Partner;
use App\Models\PartnerRequest;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des partenaires actifs
        $partners = [
            [
                'name' => 'Orange Cameroun',
                'description' => 'Leader des télécommunications au Cameroun, Orange soutient nos initiatives de transformation digitale et d\'inclusion numérique.',
                'website' => 'https://orange.cm',
                'email' => 'partenariat@orange.cm',
                'phone' => '+237 123 456 789',
                'contact_person' => 'Marie Kouam',
                'contact_position' => 'Directrice RSE',
                'category' => 'Technologie',
                'partnership_type' => 'Technique',
                'status' => 'active',
                'contribution_amount' => 25000000,
                'contribution_currency' => 'FCFA',
                'partnership_start_date' => Carbon::now()->subYear(),
                'partnership_end_date' => Carbon::now()->addYear(),
                'partnership_details' => 'Partenariat pour la digitalisation des processus et la formation numérique des jeunes.',
                'budget_range' => '10-50M FCFA',
                'sectors_of_interest' => ['Education', 'Digital', 'Jeunesse'],
                'is_featured' => true,
                'priority' => 90,
                'internal_notes' => 'Partenaire stratégique - Renouvellement automatique',
                'last_contact_date' => Carbon::now()->subWeek(),
                'contract_reference' => 'OC-2024-001'
            ],
            [
                'name' => 'Banque Atlantique',
                'description' => 'Institution financière de référence qui accompagne nos projets d\'entrepreneuriat et de microfinance communautaire.',
                'website' => 'https://banqueatlantique.net',
                'email' => 'fondation@banqueatlantique.net',
                'phone' => '+237 987 654 321',
                'contact_person' => 'Jean-Paul Mvondo',
                'contact_position' => 'Directeur Développement Durable',
                'category' => 'Finance',
                'partnership_type' => 'Financier',
                'status' => 'active',
                'contribution_amount' => 15000000,
                'contribution_currency' => 'FCFA',
                'partnership_start_date' => Carbon::now()->subMonths(8),
                'partnership_end_date' => Carbon::now()->addMonths(16),
                'partnership_details' => 'Financement de projets d\'entrepreneuriat social et accompagnement des startups.',
                'budget_range' => '10-50M FCFA',
                'sectors_of_interest' => ['Entrepreneuriat', 'Microfinance', 'Innovation'],
                'is_featured' => true,
                'priority' => 85,
                'internal_notes' => 'Excellent partenaire - Toujours ponctuel dans les versements',
                'last_contact_date' => Carbon::now()->subDays(3),
                'contract_reference' => 'BA-2024-002'
            ],
            [
                'name' => 'Université de Yaoundé I',
                'description' => 'Partenariat académique pour la recherche, l\'innovation et la formation des jeunes talents camerounais.',
                'website' => 'https://uy1.uninet.cm',
                'email' => 'cooperation@uy1.uninet.cm',
                'phone' => '+237 555 123 456',
                'contact_person' => 'Prof. Diane Nkomo',
                'contact_position' => 'Vice-Rectrice Coopération',
                'category' => 'Éducation',
                'partnership_type' => 'Académique',
                'status' => 'active',
                'contribution_amount' => 5000000,
                'contribution_currency' => 'FCFA',
                'partnership_start_date' => Carbon::now()->subYear(2),
                'partnership_details' => 'Échange d\'étudiants, recherche collaborative, formation continue.',
                'budget_range' => '1-5M FCFA',
                'sectors_of_interest' => ['Recherche', 'Formation', 'Innovation'],
                'is_featured' => false,
                'priority' => 70,
                'internal_notes' => 'Partenariat académique de long terme - Très bon rapport qualité/prix',
                'last_contact_date' => Carbon::now()->subWeek(2),
                'contract_reference' => 'UY1-2022-001'
            ],
            [
                'name' => 'Total Énergies Cameroun',
                'description' => 'Partenaire énergétique pour nos projets d\'électrification rurale et d\'énergies renouvelables.',
                'website' => 'https://totalenergies.cm',
                'email' => 'rse@totalenergies.cm',
                'phone' => '+237 444 777 888',
                'contact_person' => 'Antoine Bello',
                'contact_position' => 'Responsable RSE',
                'category' => 'Énergie',
                'partnership_type' => 'Environnemental',
                'status' => 'active',
                'contribution_amount' => 35000000,
                'contribution_currency' => 'FCFA',
                'partnership_start_date' => Carbon::now()->subMonths(6),
                'partnership_end_date' => Carbon::now()->addYear(3),
                'partnership_details' => 'Projets d\'énergie solaire dans les villages, formation en énergies renouvelables.',
                'budget_range' => '> 50M FCFA',
                'sectors_of_interest' => ['Environnement', 'Énergie', 'Développement rural'],
                'is_featured' => true,
                'priority' => 95,
                'internal_notes' => 'Partenaire majeur - Projets d\'envergure internationale',
                'last_contact_date' => Carbon::now()->subDays(1),
                'contract_reference' => 'TE-2024-003'
            ],
            [
                'name' => 'Microsoft Afrique de l\'Ouest',
                'description' => 'Partenaire technologique pour la digitalisation de nos processus et la formation numérique.',
                'website' => 'https://microsoft.com',
                'email' => 'africa.partnerships@microsoft.com',
                'phone' => '+237 611 222 333',
                'contact_person' => 'Sarah Chen',
                'contact_position' => 'Partnership Manager',
                'category' => 'Technologie',
                'partnership_type' => 'Innovation',
                'status' => 'pending',
                'contribution_amount' => 20000000,
                'contribution_currency' => 'FCFA',
                'partnership_start_date' => Carbon::now()->addMonth(),
                'partnership_details' => 'Formation Azure, licences Office 365, développement d\'applications.',
                'budget_range' => '10-50M FCFA',
                'sectors_of_interest' => ['Technology', 'Education', 'Innovation'],
                'is_featured' => false,
                'priority' => 80,
                'internal_notes' => 'En cours de signature - Partenariat très prometteur',
                'contract_reference' => 'MS-2024-004'
            ]
        ];

        foreach ($partners as $partnerData) {
            Partner::create($partnerData);
        }

        // Créer quelques demandes de partenariat
        $requests = [
            [
                'company_name' => 'Startup Tech Solutions',
                'contact_name' => 'Kevin Mbarga',
                'email' => 'kevin@techsolutions.cm',
                'phone' => '+237 655 443 221',
                'website' => 'https://techsolutions.cm',
                'category' => 'Technologie',
                'partnership_type' => 'Innovation',
                'description' => 'Nous souhaitons collaborer sur des projets d\'innovation technologique pour l\'éducation. Notre startup développe des solutions e-learning adaptées au contexte africain.',
                'budget_range' => '1-5M FCFA',
                'status' => 'pending'
            ],
            [
                'company_name' => 'Green Energy Cameroon',
                'contact_name' => 'Amina Bakari',
                'email' => 'amina@greenenergy.cm',
                'phone' => '+237 699 887 665',
                'website' => 'https://greenenergy.cm',
                'category' => 'Énergie',
                'partnership_type' => 'Environnemental',
                'description' => 'Entreprise spécialisée dans les énergies renouvelables. Nous proposons un partenariat pour électrifier les zones rurales avec des solutions solaires durables.',
                'budget_range' => '10-50M FCFA',
                'status' => 'under_review'
            ],
            [
                'company_name' => 'Fondation Éducation Plus',
                'contact_name' => 'Dr. Pierre Ngako',
                'email' => 'contact@educationplus.org',
                'phone' => '+237 677 554 332',
                'website' => 'https://educationplus.org',
                'category' => 'Éducation',
                'partnership_type' => 'Social',
                'description' => 'Fondation dédiée à l\'amélioration de l\'accès à l\'éducation de qualité. Nous cherchons à mutualiser nos efforts pour maximiser notre impact.',
                'budget_range' => '5-10M FCFA',
                'status' => 'approved'
            ]
        ];

        foreach ($requests as $requestData) {
            PartnerRequest::create($requestData);
        }

        $this->command->info('✅ Partenaires et demandes créés avec succès !');
        $this->command->info('📊 ' . Partner::count() . ' partenaires créés');
        $this->command->info('📝 ' . PartnerRequest::count() . ' demandes de partenariat créées');
    }
}