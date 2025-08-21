<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;

class EventSeeder extends Seeder
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

        $events = [
            [
                'title' => 'Conférence Innovation Technologique 2024',
                'description' => 'Une conférence majeure sur les dernières innovations technologiques en Afrique. Découvrez les startups prometteuses, les nouvelles technologies et les opportunités d\'investissement. Des experts internationaux partageront leurs connaissances sur l\'IA, la blockchain, l\'IoT et bien plus encore.',
                'short_description' => 'Conférence sur les innovations technologiques africaines avec des experts internationaux.',
                'location' => 'Palais des Congrès de Yaoundé',
                'address' => 'Boulevard du 20 Mai, Yaoundé, Cameroun',
                'start_date' => Carbon::now()->addWeeks(2),
                'end_date' => Carbon::now()->addWeeks(2)->addDays(2),
                'category' => 'conference',
                'status' => 'published',
                'price' => 25000,
                'currency' => 'XAF',
                'is_free' => false,
                'capacity' => 500,
                'tickets_sold' => 287,
                'total_revenue' => 7175000,
                'published_at' => Carbon::now()->subDays(10),
                'contact_info' => [
                    'email' => 'contact@techconf.cm',
                    'phone' => '+237 6XX XX XX XX',
                    'website' => 'https://techconf2024.cm'
                ],
                'speakers' => [
                    ['name' => 'Dr. Marie Fotso', 'title' => 'Expert en IA', 'company' => 'Google Africa'],
                    ['name' => 'Jean-Claude Brou', 'title' => 'CEO TechStart', 'company' => 'TechStart CM'],
                    ['name' => 'Sarah Kamdem', 'title' => 'Blockchain Specialist', 'company' => 'BlockChain Africa']
                ],
                'agenda' => [
                    ['time' => '09:00', 'title' => 'Accueil et registration', 'speaker' => ''],
                    ['time' => '10:00', 'title' => 'IA et Machine Learning en Afrique', 'speaker' => 'Dr. Marie Fotso'],
                    ['time' => '11:30', 'title' => 'Blockchain pour le développement', 'speaker' => 'Sarah Kamdem'],
                    ['time' => '14:00', 'title' => 'Entrepreneuriat tech au Cameroun', 'speaker' => 'Jean-Claude Brou']
                ]
            ],
            [
                'title' => 'Atelier Formation en Entrepreneuriat Féminin',
                'description' => 'Un atelier pratique destiné aux femmes entrepreneures du Cameroun. Formation complète sur la création d\'entreprise, le financement, le marketing digital et la gestion. Avec des témoignages inspirants et des sessions de coaching personnalisé.',
                'short_description' => 'Formation pratique pour femmes entrepreneures avec coaching personnalisé.',
                'location' => 'Centre de Formation GICAM',
                'address' => 'Rue Joss, Douala, Cameroun',
                'start_date' => Carbon::now()->addDays(10),
                'end_date' => Carbon::now()->addDays(12),
                'category' => 'workshop',
                'status' => 'published',
                'price' => 15000,
                'currency' => 'XAF',
                'is_free' => false,
                'capacity' => 80,
                'tickets_sold' => 67,
                'total_revenue' => 1005000,
                'published_at' => Carbon::now()->subDays(15),
                'contact_info' => [
                    'email' => 'formation@femmesentrepreneurs.cm',
                    'phone' => '+237 6XX XX XX XX'
                ],
                'speakers' => [
                    ['name' => 'Mme Aissatou Diallo', 'title' => 'Coach Business', 'company' => 'Women in Business'],
                    ['name' => 'Dr. Fatou Sow', 'title' => 'Expert Finance', 'company' => 'BICEC']
                ]
            ],
            [
                'title' => 'Séminaire Développement Durable et Environnement',
                'description' => 'Séminaire sur les enjeux environnementaux au Cameroun et en Afrique centrale. Focus sur les solutions durables, l\'économie verte, la gestion des déchets et les énergies renouvelables. Avec la participation d\'ONG internationales et d\'experts locaux.',
                'short_description' => 'Séminaire sur le développement durable et les solutions environnementales.',
                'location' => 'Université de Yaoundé I',
                'address' => 'Campus principal, Ngoa-Ekellé, Yaoundé',
                'start_date' => Carbon::now()->addMonths(1),
                'end_date' => Carbon::now()->addMonths(1)->addDay(),
                'category' => 'seminar',
                'status' => 'published',
                'price' => 0,
                'currency' => 'XAF',
                'is_free' => true,
                'capacity' => 200,
                'tickets_sold' => 156,
                'total_revenue' => 0,
                'published_at' => Carbon::now()->subDays(5),
                'contact_info' => [
                    'email' => 'environnement@uy1.cm',
                    'phone' => '+237 6XX XX XX XX'
                ]
            ],
            [
                'title' => 'Networking Night - Tech & Innovation',
                'description' => 'Soirée de networking dédiée aux professionnels de la tech et de l\'innovation. Rencontrez des entrepreneurs, des investisseurs, des développeurs et des innovateurs dans une ambiance décontractée. Avec démonstrations de startups et pitchs express.',
                'short_description' => 'Soirée networking pour professionnels de la tech et de l\'innovation.',
                'location' => 'Hôtel Hilton Yaoundé',
                'address' => 'Boulevard du 20 Mai, Yaoundé',
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(5)->addHours(4),
                'category' => 'networking',
                'status' => 'published',
                'price' => 10000,
                'currency' => 'XAF',
                'is_free' => false,
                'capacity' => 150,
                'tickets_sold' => 89,
                'total_revenue' => 890000,
                'published_at' => Carbon::now()->subDays(20)
            ],
            [
                'title' => 'Formation Leadership et Management',
                'description' => 'Programme de formation intensive sur le leadership et le management moderne. Destiné aux cadres, managers et futurs dirigeants. Méthodes interactives, études de cas et simulations pratiques.',
                'short_description' => 'Formation intensive en leadership et management avec méthodes interactives.',
                'location' => 'Institut Supérieur de Management',
                'address' => 'Quartier Essos, Yaoundé',
                'start_date' => Carbon::now()->addWeeks(3),
                'end_date' => Carbon::now()->addWeeks(3)->addDays(3),
                'category' => 'training',
                'status' => 'draft',
                'price' => 50000,
                'currency' => 'XAF',
                'is_free' => false,
                'capacity' => 50,
                'tickets_sold' => 0,
                'total_revenue' => 0,
                'published_at' => null
            ],
            [
                'title' => 'Webinaire : Fintech et Inclusion Financière',
                'description' => 'Webinaire en ligne sur les technologies financières et leur impact sur l\'inclusion financière en Afrique. Présentation des dernières innovations, discussion sur les défis et opportunités.',
                'short_description' => 'Webinaire sur les fintech et l\'inclusion financière en Afrique.',
                'location' => 'En ligne (Zoom)',
                'address' => 'Événement virtuel',
                'start_date' => Carbon::now()->addDays(7),
                'end_date' => Carbon::now()->addDays(7)->addHours(2),
                'category' => 'webinar',
                'status' => 'published',
                'price' => 0,
                'currency' => 'XAF',
                'is_free' => true,
                'capacity' => 1000,
                'tickets_sold' => 432,
                'total_revenue' => 0,
                'published_at' => Carbon::now()->subDays(12)
            ],
            [
                'title' => 'Meetup Développeurs JavaScript Cameroun',
                'description' => 'Rencontre mensuelle de la communauté des développeurs JavaScript du Cameroun. Présentations techniques, partage d\'expériences et networking. Thème du mois : React vs Vue.js.',
                'short_description' => 'Meetup mensuel des développeurs JavaScript avec présentations techniques.',
                'location' => 'ActivSpaces Douala',
                'address' => 'Rue Joss, Bonanjo, Douala',
                'start_date' => Carbon::now()->addDays(14),
                'end_date' => Carbon::now()->addDays(14)->addHours(3),
                'category' => 'meetup',
                'status' => 'published',
                'price' => 5000,
                'currency' => 'XAF',
                'is_free' => false,
                'capacity' => 60,
                'tickets_sold' => 45,
                'total_revenue' => 225000,
                'published_at' => Carbon::now()->subDays(8)
            ],
            [
                'title' => 'Forum Jeunesse et Emploi 2024',
                'description' => 'Forum annuel dédié à l\'emploi des jeunes au Cameroun. Rencontres avec des recruteurs, ateliers de préparation aux entretiens, formations sur les compétences digitales.',
                'short_description' => 'Forum annuel pour l\'emploi des jeunes avec recruteurs et formations.',
                'location' => 'Palais des Sports de Yaoundé',
                'address' => 'Yaoundé, Cameroun',
                'start_date' => Carbon::now()->subWeeks(2),
                'end_date' => Carbon::now()->subWeeks(2)->addDays(1),
                'category' => 'conference',
                'status' => 'completed',
                'price' => 0,
                'currency' => 'XAF',
                'is_free' => true,
                'capacity' => 2000,
                'tickets_sold' => 1850,
                'total_revenue' => 0,
                'published_at' => Carbon::now()->subMonths(2)
            ]
        ];

        foreach ($events as $eventData) {
            $eventData['created_by'] = $user->id;
            $event = Event::create($eventData);

            // Créer des billets pour les événements qui en ont vendus
            if ($event->tickets_sold > 0) {
                $this->createTicketsForEvent($event, $event->tickets_sold);
            }
        }
    }

    /**
     * Créer des billets pour un événement
     */
    private function createTicketsForEvent(Event $event, int $count): void
    {
        $users = User::all();
        if ($users->isEmpty()) return;

        $ticketTypes = ['standard', 'vip', 'premium', 'student'];
        $paymentMethods = ['mobile_money', 'bank_transfer', 'card', 'cash'];
        
        for ($i = 0; $i < $count; $i++) {
            $user = $users->random();
            $ticketType = $ticketTypes[array_rand($ticketTypes)];
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            
            // Ajuster le prix selon le type de billet
            $price = $event->price;
            switch ($ticketType) {
                case 'vip':
                    $price *= 2;
                    break;
                case 'premium':
                    $price *= 1.5;
                    break;
                case 'student':
                    $price *= 0.5;
                    break;
            }

            Ticket::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'ticket_number' => 'TK-' . strtoupper(substr(md5(uniqid()), 0, 10)),
                'attendee_name' => $user->name,
                'attendee_email' => $user->email,
                'attendee_phone' => '+237 6' . rand(70000000, 99999999),
                'ticket_type' => $ticketType,
                'price_paid' => $price,
                'currency' => 'XAF',
                'status' => rand(1, 10) > 2 ? 'confirmed' : 'pending',
                'payment_status' => rand(1, 10) > 1 ? 'paid' : 'pending',
                'payment_method' => $paymentMethod,
                'transaction_id' => 'TXN-' . strtoupper(substr(md5(uniqid()), 0, 12)),
                'purchased_at' => Carbon::now()->subDays(rand(1, 30)),
                'checked_in_at' => $event->isCompleted() && rand(1, 10) > 3 ? Carbon::now()->subDays(rand(1, 14)) : null
            ]);
        }
    }
}