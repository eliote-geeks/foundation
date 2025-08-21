<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Contest;
use App\Models\Vote;
use App\Models\User;
use Carbon\Carbon;

class ContestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier qu'il y a au moins un utilisateur
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin Foundation',
                'email' => 'admin@foundation.cm',
                'password' => bcrypt('password'),
                'email_verified_at' => now()
            ]);
        }

        $contests = [
            [
                'title' => 'Concours Innovation Tech Cameroun 2024',
                'description' => 'Grand concours national d\'innovation technologique ouvert à tous les jeunes entrepreneurs camerounais. Présentez vos idées révolutionnaires dans les domaines de la fintech, healthtech, agritech et edtech. Les gagnants recevront un financement pour développer leur startup.',
                'short_description' => 'Concours d\'innovation tech pour jeunes entrepreneurs camerounais.',
                'category' => 'innovation',
                'type' => 'voting',
                'status' => 'voting',
                'start_date' => Carbon::now()->subWeeks(2),
                'end_date' => Carbon::now()->addWeeks(4),
                'voting_start' => Carbon::now()->subWeek(),
                'voting_end' => Carbon::now()->addWeeks(3),
                'entry_fee' => 0,
                'vote_price' => 500,
                'currency' => 'XAF',
                'is_free' => false,
                'max_participants' => 100,
                'max_votes_per_user' => 3,
                'total_participants' => 67,
                'total_votes' => 1234,
                'total_revenue' => 617000,
                'prizes' => [
                    ['position' => '1er Prix', 'amount' => '5,000,000 XAF', 'description' => 'Financement startup + incubation 6 mois'],
                    ['position' => '2ème Prix', 'amount' => '3,000,000 XAF', 'description' => 'Financement + mentorat 3 mois'],
                    ['position' => '3ème Prix', 'amount' => '1,500,000 XAF', 'description' => 'Financement + formation']
                ],
                'rules' => [
                    'Ouvert aux résidents camerounais âgés de 18 à 35 ans',
                    'Projets dans les domaines tech uniquement',
                    'Présentation en français ou anglais',
                    'Prototype fonctionnel requis',
                    'Équipe de maximum 4 personnes'
                ],
                'criteria' => [
                    ['name' => 'Innovation', 'weight' => 30, 'description' => 'Caractère novateur de la solution'],
                    ['name' => 'Impact social', 'weight' => 25, 'description' => 'Potentiel d\'impact sur la société'],
                    ['name' => 'Viabilité économique', 'weight' => 25, 'description' => 'Modèle économique et rentabilité'],
                    ['name' => 'Faisabilité technique', 'weight' => 20, 'description' => 'Réalisabilité technique du projet']
                ],
                'sponsors' => [
                    ['name' => 'Orange Cameroun', 'logo' => '', 'website' => 'https://orange.cm'],
                    ['name' => 'MTN Cameroon', 'logo' => '', 'website' => 'https://mtn.cm'],
                    ['name' => 'BICEC', 'logo' => '', 'website' => 'https://bicec.com']
                ],
                'judges' => [
                    ['name' => 'Dr. Alain Nteff', 'title' => 'CEO Gifted Mom', 'bio' => 'Expert en healthtech'],
                    ['name' => 'Mme Rebecca Enonchong', 'title' => 'CEO AppsTech', 'bio' => 'Entrepreneure tech'],
                    ['name' => 'M. Arthur Zang', 'title' => 'Inventeur CardiopadPad', 'bio' => 'Innovateur médical']
                ],
                'published_at' => Carbon::now()->subMonths(1)
            ],
            [
                'title' => 'Challenge Entrepreneuriat Féminin',
                'description' => 'Concours dédié aux femmes entrepreneures du Cameroun et de la région CEMAC. Mettez en avant votre projet d\'entreprise dans tous les secteurs d\'activité. Un accompagnement personnalisé et un financement sont à la clé pour les meilleures candidates.',
                'short_description' => 'Challenge pour femmes entrepreneures CEMAC avec accompagnement personnalisé.',
                'category' => 'entrepreneurship',
                'type' => 'submission',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->addMonths(2),
                'voting_start' => null,
                'voting_end' => null,
                'entry_fee' => 10000,
                'vote_price' => 0,
                'currency' => 'XAF',
                'is_free' => false,
                'max_participants' => 50,
                'max_votes_per_user' => 1,
                'total_participants' => 32,
                'total_votes' => 0,
                'total_revenue' => 320000,
                'prizes' => [
                    ['position' => 'Gagnante', 'amount' => '2,000,000 XAF', 'description' => 'Financement + coaching 1 an'],
                    ['position' => 'Finalistes (3)', 'amount' => '500,000 XAF', 'description' => 'Financement + formation']
                ],
                'rules' => [
                    'Ouvert aux femmes de 21 à 50 ans',
                    'Résidentes dans la zone CEMAC',
                    'Projet d\'entreprise dans tout secteur',
                    'Business plan détaillé requis',
                    'Présentation orale obligatoire'
                ],
                'sponsors' => [
                    ['name' => 'UN Women', 'logo' => '', 'website' => 'https://unwomen.org'],
                    ['name' => 'Afriland First Bank', 'logo' => '', 'website' => 'https://afrilandfirstbank.com']
                ],
                'published_at' => Carbon::now()->subDays(15)
            ],
            [
                'title' => 'Quiz Connaissances Environnementales',
                'description' => 'Quiz interactif sur les enjeux environnementaux et le développement durable au Cameroun et en Afrique. Testez vos connaissances sur le changement climatique, la biodiversité, les énergies renouvelables et les solutions durables.',
                'short_description' => 'Quiz sur l\'environnement et le développement durable en Afrique.',
                'category' => 'environment',
                'type' => 'quiz',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(5),
                'end_date' => Carbon::now()->addWeeks(2),
                'voting_start' => null,
                'voting_end' => null,
                'entry_fee' => 0,
                'vote_price' => 0,
                'currency' => 'XAF',
                'is_free' => true,
                'max_participants' => null,
                'max_votes_per_user' => 1,
                'total_participants' => 156,
                'total_votes' => 0,
                'total_revenue' => 0,
                'prizes' => [
                    ['position' => '1er', 'amount' => 'Tablette + livres', 'description' => 'Pack éducatif environnement'],
                    ['position' => '2ème-5ème', 'amount' => 'Livres spécialisés', 'description' => 'Ouvrages sur l\'environnement'],
                    ['position' => 'Participants', 'amount' => 'Certificat', 'description' => 'Certificat de participation']
                ],
                'rules' => [
                    'Ouvert à tous sans restriction d\'âge',
                    'Quiz en ligne de 50 questions',
                    'Durée limitée à 1 heure',
                    'Une seule tentative par participant',
                    'Classement selon le score et le temps'
                ],
                'published_at' => Carbon::now()->subDays(10)
            ],
            [
                'title' => 'Concours Arts et Culture Digitale',
                'description' => 'Compétition créative mettant en valeur les talents artistiques camerounais à travers le digital. Catégories : art numérique, musique, vidéo, photo, design graphique. Promotion de la culture camerounaise à l\'ère du numérique.',
                'short_description' => 'Compétition d\'arts numériques pour talents camerounais.',
                'category' => 'arts',
                'type' => 'voting',
                'status' => 'draft',
                'start_date' => Carbon::now()->addDays(15),
                'end_date' => Carbon::now()->addMonths(3),
                'voting_start' => Carbon::now()->addMonths(2),
                'voting_end' => Carbon::now()->addMonths(3)->subDays(3),
                'entry_fee' => 5000,
                'vote_price' => 200,
                'currency' => 'XAF',
                'is_free' => false,
                'max_participants' => 200,
                'max_votes_per_user' => 5,
                'total_participants' => 0,
                'total_votes' => 0,
                'total_revenue' => 0,
                'prizes' => [
                    ['position' => 'Grand Prix', 'amount' => '1,000,000 XAF', 'description' => 'Prix + résidence artistique'],
                    ['position' => 'Prix par catégorie', 'amount' => '200,000 XAF', 'description' => 'Prix spécialisé par domaine'],
                    ['position' => 'Prix du public', 'amount' => '300,000 XAF', 'description' => 'Œuvre la plus votée']
                ],
                'rules' => [
                    'Œuvres originales uniquement',
                    'Thème libre avec inspiration camerounaise',
                    'Formats numériques acceptés',
                    'Soumission d\'une œuvre par catégorie max',
                    'Respect des droits d\'auteur'
                ],
                'published_at' => null
            ],
            [
                'title' => 'Défi Solutions EdTech Africaines',
                'description' => 'Challenge pour identifier et développer des solutions éducatives technologiques adaptées au contexte africain. Focus sur l\'amélioration de l\'accès à l\'éducation de qualité, l\'apprentissage à distance et les outils pédagogiques innovants.',
                'short_description' => 'Défi de création de solutions éducatives tech pour l\'Afrique.',
                'category' => 'education',
                'type' => 'challenge',
                'status' => 'voting',
                'start_date' => Carbon::now()->subWeeks(3),
                'end_date' => Carbon::now()->addWeeks(3),
                'voting_start' => Carbon::now()->subDays(5),
                'voting_end' => Carbon::now()->addWeeks(2),
                'entry_fee' => 15000,
                'vote_price' => 1000,
                'currency' => 'XAF',
                'is_free' => false,
                'max_participants' => 30,
                'max_votes_per_user' => 2,
                'total_participants' => 24,
                'total_votes' => 456,
                'total_revenue' => 816000,
                'prizes' => [
                    ['position' => 'Équipe gagnante', 'amount' => '3,000,000 XAF', 'description' => 'Financement + incubation'],
                    ['position' => 'Finalistes', 'amount' => '800,000 XAF', 'description' => 'Financement développement'],
                    ['position' => 'Prix innovation', 'amount' => '500,000 XAF', 'description' => 'Solution la plus innovante']
                ],
                'rules' => [
                    'Équipes de 2 à 5 personnes',
                    'Solutions tech pour l\'éducation',
                    'Prototype fonctionnel requis',
                    'Présentation devant jury',
                    'Business model viable'
                ],
                'sponsors' => [
                    ['name' => 'UNESCO', 'logo' => '', 'website' => 'https://unesco.org'],
                    ['name' => 'Microsoft Africa', 'logo' => '', 'website' => 'https://microsoft.com/africa']
                ],
                'published_at' => Carbon::now()->subMonths(1)
            ],
            [
                'title' => 'Concours Startups Tech Finalisé 2023',
                'description' => 'Concours annuel des startups technologiques qui s\'est déroulé l\'année dernière. Célébration de l\'innovation et de l\'entrepreneuriat tech au Cameroun avec plus de 50 startups participantes.',
                'short_description' => 'Concours startups tech de l\'année dernière - Édition 2023.',
                'category' => 'technology',
                'type' => 'voting',
                'status' => 'completed',
                'start_date' => Carbon::now()->subMonths(8),
                'end_date' => Carbon::now()->subMonths(6),
                'voting_start' => Carbon::now()->subMonths(7),
                'voting_end' => Carbon::now()->subMonths(6)->addWeek(),
                'entry_fee' => 20000,
                'vote_price' => 750,
                'currency' => 'XAF',
                'is_free' => false,
                'max_participants' => 50,
                'max_votes_per_user' => 3,
                'total_participants' => 48,
                'total_votes' => 2847,
                'total_revenue' => 3095250,
                'prizes' => [
                    ['position' => 'Startup de l\'année', 'amount' => '10,000,000 XAF', 'description' => 'Grand prix + mentorat'],
                    ['position' => 'Finalistes', 'amount' => '2,000,000 XAF', 'description' => 'Prix d\'encouragement']
                ],
                'published_at' => Carbon::now()->subMonths(9)
            ],
            [
                'title' => 'Challenge Impact Social 2024',
                'description' => 'Concours pour projets à fort impact social au Cameroun. Recherche de solutions innovantes pour répondre aux défis sociaux : santé, éducation, emploi, inclusion, lutte contre la pauvreté. Accent sur la durabilité et la scalabilité.',
                'short_description' => 'Challenge pour projets à impact social durable au Cameroun.',
                'category' => 'social',
                'type' => 'submission',
                'status' => 'active',
                'start_date' => Carbon::now()->subWeeks(1),
                'end_date' => Carbon::now()->addMonths(3),
                'voting_start' => null,
                'voting_end' => null,
                'entry_fee' => 0,
                'vote_price' => 0,
                'currency' => 'XAF',
                'is_free' => true,
                'max_participants' => 75,
                'max_votes_per_user' => 1,
                'total_participants' => 12,
                'total_votes' => 0,
                'total_revenue' => 0,
                'prizes' => [
                    ['position' => 'Impact Award', 'amount' => '5,000,000 XAF', 'description' => 'Financement + accompagnement 2 ans'],
                    ['position' => 'Innovation sociale', 'amount' => '2,000,000 XAF', 'description' => 'Financement développement'],
                    ['position' => 'Mention spéciale', 'amount' => '1,000,000 XAF', 'description' => 'Prix d\'encouragement']
                ],
                'rules' => [
                    'Projets à impact social mesurable',
                    'Solutions innovantes et durables',
                    'Équipe locale ou internationale',
                    'Implémentation au Cameroun',
                    'Modèle de financement viable'
                ],
                'sponsors' => [
                    ['name' => 'Banque Mondiale', 'logo' => '', 'website' => 'https://worldbank.org'],
                    ['name' => 'USAID', 'logo' => '', 'website' => 'https://usaid.gov']
                ],
                'published_at' => Carbon::now()->subWeeks(2)
            ]
        ];

        foreach ($contests as $contestData) {
            $contestData['created_by'] = $user->id;
            $contest = Contest::create($contestData);

            // Créer des votes pour les concours qui en ont
            if ($contest->total_votes > 0) {
                $this->createVotesForContest($contest, $contest->total_votes);
            }
        }
    }

    /**
     * Créer des votes pour un concours
     */
    private function createVotesForContest(Contest $contest, int $count): void
    {
        $users = User::all();
        if ($users->isEmpty()) return;

        $participants = [
            'TechStart CM', 'InnoHealth', 'EduTech Solutions', 'GreenEnergy Pro', 'FinanceDigital',
            'AgriSmart', 'MedConnect', 'CodeAcademy CM', 'SolarTech', 'WaterSafe',
            'FoodChain', 'TransportSmart', 'EcommercePlus', 'CyberSecure', 'AIForGood',
            'BlockChain CM', 'IoT Solutions', 'CleanTech', 'HealthCare+', 'EduPlatform',
            'SmartCity CM', 'DigitalBank', 'FarmTech', 'ClimateAction', 'SocialImpact'
        ];

        $paymentMethods = ['mobile_money', 'bank_transfer', 'card', 'cash'];
        $comments = [
            'Excellent projet, très innovant !',
            'Solution très prometteuse pour notre contexte.',
            'J\'aime beaucoup cette approche.',
            'Bonne chance pour la suite !',
            'Projet avec un fort potentiel.',
            'Innovation remarquable.',
            'Continue comme ça !',
            'Très bonne présentation.',
            'Solution pratique et utile.',
            'Félicitations pour ce travail.',
            ''
        ];
        
        for ($i = 0; $i < $count; $i++) {
            $user = $users->random();
            $participant = $participants[array_rand($participants)];
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            $comment = $comments[array_rand($comments)];
            
            Vote::create([
                'contest_id' => $contest->id,
                'user_id' => $user->id,
                'participant_name' => $participant,
                'participant_id' => rand(1, 100),
                'amount_paid' => $contest->vote_price,
                'currency' => 'XAF',
                'payment_status' => rand(1, 10) > 1 ? 'paid' : 'pending',
                'payment_method' => $paymentMethod,
                'transaction_id' => 'VT-' . strtoupper(substr(md5(uniqid()), 0, 12)),
                'comment' => $comment,
                'voted_at' => Carbon::now()->subDays(rand(1, 30))->addHours(rand(0, 23))
            ]);
        }
    }
}