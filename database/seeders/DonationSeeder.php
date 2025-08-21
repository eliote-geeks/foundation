<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DonationCampaign;
use App\Models\Donation;
use App\Models\User;

class DonationSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer toutes les campagnes
        $campaigns = DonationCampaign::all();
        
        if ($campaigns->isEmpty()) {
            $this->command->warn('⚠️  Aucune campagne trouvée. Exécutez DonationCampaignSeeder d\'abord.');
            return;
        }

        // Récupérer tous les utilisateurs ou en créer
        $users = User::all();
        if ($users->count() < 20) {
            // Créer des utilisateurs donateurs
            $donors = [
                ['name' => 'Marie Nkoulou', 'email' => 'marie.nkoulou@example.cm'],
                ['name' => 'Jean Baptiste Fouda', 'email' => 'jb.fouda@example.cm'],
                ['name' => 'Aminata Diallo', 'email' => 'aminata.diallo@example.cm'],
                ['name' => 'Pierre Kamga', 'email' => 'pierre.kamga@example.cm'],
                ['name' => 'Fatou Bello', 'email' => 'fatou.bello@example.cm'],
                ['name' => 'Emmanuel Mbarga', 'email' => 'emmanuel.mbarga@example.cm'],
                ['name' => 'Grace Tchoumi', 'email' => 'grace.tchoumi@example.cm'],
                ['name' => 'Robert Nguini', 'email' => 'robert.nguini@example.cm'],
                ['name' => 'Awa Soh', 'email' => 'awa.soh@example.cm'],
                ['name' => 'Samuel Kouam', 'email' => 'samuel.kouam@example.cm'],
                ['name' => 'Célestine Njoya', 'email' => 'celestine.njoya@example.cm'],
                ['name' => 'Daniel Muna', 'email' => 'daniel.muna@example.cm'],
                ['name' => 'Raissa Manga', 'email' => 'raissa.manga@example.cm'],
                ['name' => 'François Etoundi', 'email' => 'francois.etoundi@example.cm'],
                ['name' => 'Brigitte Essomba', 'email' => 'brigitte.essomba@example.cm']
            ];

            foreach ($donors as $donorData) {
                User::create([
                    'name' => $donorData['name'],
                    'email' => $donorData['email'],
                    'password' => bcrypt('password'),
                ]);
            }
            
            $users = User::all();
        }

        $cities = ['Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Garoua', 'Ngaoundéré', 'Maroua', 'Limbé'];
        $companies = [
            'MTN Cameroon', 'Orange Cameroun', 'Société Générale Cameroun', 'BGFI Bank',
            'Guinness Cameroun', 'Brasseries du Cameroun', 'SODECOTON', 'CAMTEL',
            'Independant', 'CIC', 'BICEC', 'UBA Cameroun'
        ];
        $motivations = [
            'personal_cause', 'community_impact', 'corporate_social_responsibility', 
            'friend_family_request', 'religious_beliefs', 'emergency_response'
        ];

        $paymentMethods = ['mobile_money', 'bank_transfer', 'cash'];
        $providers = [
            'mobile_money' => ['Orange Money', 'MTN Mobile Money', 'Express Union Mobile'],
            'bank_transfer' => ['BICEC', 'Société Générale', 'UBA', 'BGFI Bank'],
            'cash' => ['Espèces']
        ];

        $donationCount = 0;

        foreach ($campaigns as $campaign) {
            if ($campaign->current_amount <= 0) continue;

            $targetDonations = $campaign->donation_count;
            $totalAmount = $campaign->current_amount;
            $averageAmount = $campaign->average_donation;

            // Générer des dons réalistes
            for ($i = 0; $i < $targetDonations; $i++) {
                $donor = $users->random();
                $paymentMethod = collect($paymentMethods)->random();
                $provider = collect($providers[$paymentMethod])->random();
                
                // Variation autour du montant moyen
                $variance = $averageAmount * 0.8; // 80% de variation
                $minAmount = max(1000, $averageAmount - $variance);
                $maxAmount = $averageAmount + $variance;
                $amount = rand($minAmount, $maxAmount);
                
                // Quelques gros donateurs
                if (rand(1, 10) === 1) {
                    $amount *= rand(3, 10);
                }

                $donatedAt = $this->getRandomDateBetween(
                    $campaign->start_date, 
                    $campaign->end_date ?? now()
                );

                $donation = Donation::create([
                    'donation_number' => 'DON-' . $campaign->id . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'campaign_id' => $campaign->id,
                    'donor_id' => $donor->id,
                    'amount' => $amount,
                    'currency' => 'XAF',
                    'type' => rand(1, 10) > 8 ? 'recurring_monthly' : 'one_time',
                    'is_anonymous' => rand(1, 10) === 1, // 10% anonymes
                    'is_tribute' => rand(1, 50) === 1, // 2% en hommage
                    'tribute_message' => rand(1, 50) === 1 ? 'En mémoire de ma grand-mère' : null,
                    'donor_city' => collect($cities)->random(),
                    'donor_country' => 'Cameroun',
                    'donor_company' => rand(1, 3) === 1 ? collect($companies)->random() : null,
                    'payment_method' => $paymentMethod,
                    'payment_status' => 'completed',
                    'payment_provider' => $provider,
                    'transaction_id' => 'TXN-' . time() . '-' . rand(1000, 9999),
                    'donated_at' => $donatedAt,
                    'payment_confirmed_at' => $donatedAt->addMinutes(rand(1, 60)),
                    'is_tax_deductible' => $amount >= 10000,
                    'receipt_number' => $amount >= 10000 ? 'RECU-' . date('Y') . '-' . str_pad(rand(1, 10000), 6, '0', STR_PAD_LEFT) : null,
                    'public_message' => rand(1, 5) === 1 ? $this->getRandomMessage() : null,
                    'motivation' => collect($motivations)->random(),
                    'source' => collect(['website', 'social_media', 'email_campaign', 'word_of_mouth'])->random(),
                    'ip_address' => $this->getRandomCameroonIP(),
                    'is_verified' => true,
                    'verified_at' => $donatedAt->addHours(rand(1, 24)),
                    'receipt_sent_at' => $amount >= 10000 ? $donatedAt->addDays(rand(1, 3)) : null,
                    'thank_you_sent_at' => $donatedAt->addDays(rand(1, 7))
                ]);

                $donationCount++;
            }
        }

        // Créer quelques dons récurrents
        $recurringDonors = $users->random(10);
        foreach ($recurringDonors as $donor) {
            $activeCampaigns = $campaigns->where('status', 'active')->where('allow_recurring', true);
            if ($activeCampaigns->isNotEmpty()) {
                $campaign = $activeCampaigns->random();
                
                for ($month = 1; $month <= 6; $month++) {
                    $donatedAt = now()->subMonths($month);
                    if ($donatedAt < $campaign->start_date) continue;

                    Donation::create([
                        'donation_number' => 'DON-' . $campaign->id . '-REC-' . $donor->id . '-' . $month,
                        'campaign_id' => $campaign->id,
                        'donor_id' => $donor->id,
                        'amount' => rand(10000, 50000),
                        'currency' => 'XAF',
                        'type' => 'recurring_monthly',
                        'is_anonymous' => false,
                        'payment_method' => 'mobile_money',
                        'payment_status' => 'completed',
                        'payment_provider' => 'Orange Money',
                        'donated_at' => $donatedAt,
                        'payment_confirmed_at' => $donatedAt->addMinutes(5),
                        'is_active_subscription' => $month === 1,
                        'next_donation_at' => $month === 1 ? now()->addMonth() : null,
                        'recurrence_count' => $month,
                        'is_tax_deductible' => true,
                        'is_verified' => true,
                        'verified_at' => $donatedAt->addHours(1),
                        'thank_you_sent_at' => $donatedAt->addDays(1)
                    ]);
                    
                    $donationCount++;
                }
            }
        }

        // Mettre à jour les statistiques des campagnes
        foreach ($campaigns as $campaign) {
            $campaign->updateStats();
        }

        $this->command->info("✅ {$donationCount} dons créés avec succès !");
    }

    private function getRandomDateBetween($start, $end)
    {
        $startTime = $start->timestamp;
        $endTime = $end->timestamp;
        $randomTime = rand($startTime, $endTime);
        return now()->setTimestamp($randomTime);
    }

    private function getRandomMessage(): string
    {
        $messages = [
            'Bravo pour cette belle initiative !',
            'Que Dieu bénisse ce projet.',
            'Ensemble nous pouvons faire la différence.',
            'Un petit geste pour une grande cause.',
            'Continuez ce beau travail.',
            'Pour l\'avenir de nos enfants.',
            'Solidarité camerounaise !',
            'Merci de servir notre communauté.',
            'Que ce projet porte ses fruits.',
            'En espérant que cela aide vraiment.'
        ];

        return collect($messages)->random();
    }

    private function getRandomCameroonIP(): string
    {
        // Quelques plages IP du Cameroun
        $cameroonRanges = [
            ['41.202.0.0', '41.202.255.255'],
            ['41.207.0.0', '41.207.255.255'],
            ['154.0.0.0', '154.127.255.255'],
            ['196.1.0.0', '196.1.255.255']
        ];

        $range = collect($cameroonRanges)->random();
        $ip1 = ip2long($range[0]);
        $ip2 = ip2long($range[1]);
        
        return long2ip(rand($ip1, $ip2));
    }
}