<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Donation;
use App\Models\DonationCampaign;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DonorController extends Controller
{
    /**
     * Vue d'ensemble des donateurs
     */
    public function index(Request $request): Response
    {
        $type = $request->get('type', 'all');
        
        // Statistiques générales
        $stats = [
            [
                'title' => 'Total Donateurs',
                'value' => User::whereHas('completedDonations')->count(),
                'change' => '+' . User::whereHas('completedDonations', function($q) {
                    $q->where('donated_at', '>=', now()->subMonth());
                })->count(),
                'positive' => true,
                'color' => '#667eea',
                'icon' => 'bi-people'
            ],
            [
                'title' => 'Donateurs Réguliers',
                'value' => User::whereHas('completedDonations', function($q) {}, '>=', 3)->count(),
                'change' => '+' . User::whereHas('completedDonations', function($q) {
                    $q->where('donated_at', '>=', now()->subMonth());
                }, '>=', 3)->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-arrow-repeat'
            ],
            [
                'title' => 'Donateurs Majeurs',
                'value' => User::withSum('completedDonations', 'amount')
                              ->having('completed_donations_sum_amount', '>=', 500000)
                              ->count(),
                'change' => '+' . User::withSum(['completedDonations' => function($q) {
                    $q->where('donated_at', '>=', now()->subMonth());
                }], 'amount')
                              ->having('completed_donations_sum_amount', '>=', 500000)
                              ->count(),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-star'
            ],
            [
                'title' => 'Don Moyen (XAF)',
                'value' => number_format(Donation::where('payment_status', 'completed')->avg('amount'), 0, ',', ' '),
                'change' => number_format(
                    Donation::where('payment_status', 'completed')
                           ->where('donated_at', '>=', now()->subWeek())
                           ->avg('amount') - 
                    Donation::where('payment_status', 'completed')
                           ->where('donated_at', '<', now()->subWeek())
                           ->avg('amount'), 0, ',', ' '
                ),
                'positive' => true,
                'color' => '#E4518C',
                'icon' => 'bi-graph-up-arrow'
            ]
        ];

        // Requête des donateurs avec filtres
        $donorsQuery = User::whereHas('completedDonations')
            ->with(['profile', 'completedDonations'])
            ->withCount('completedDonations as total_donations')
            ->withSum('completedDonations as total_amount', 'amount')
            ->withAvg('completedDonations as average_donation', 'amount');

        // Filtres par type de donateur
        if ($type === 'regular') {
            $donorsQuery->having('total_donations', '>=', 3);
        } elseif ($type === 'major') {
            $donorsQuery->having('total_amount', '>=', 500000);
        } elseif ($type === 'recent') {
            $donorsQuery->whereHas('completedDonations', function($q) {
                $q->where('donated_at', '>=', now()->subMonth());
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $donorsQuery->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhereHas('profile', function($pq) use ($search) {
                      $pq->where('first_name', 'LIKE', "%{$search}%")
                        ->orWhere('last_name', 'LIKE', "%{$search}%")
                        ->orWhere('city', 'LIKE', "%{$search}%");
                  });
            });
        }

        $donors = $donorsQuery->paginate(15)->through(function ($donor) {
            $lastDonation = $donor->completedDonations()->latest('donated_at')->first();
            
            return [
                'id' => $donor->id,
                'name' => $donor->name,
                'email' => $donor->email,
                'profile' => $donor->profile ? [
                    'full_name' => $donor->profile->full_name,
                    'city' => $donor->profile->city,
                    'country' => $donor->profile->country,
                    'member_type' => $donor->profile->member_type,
                    'member_type_display' => $donor->profile->member_type_display,
                    'phone' => $donor->profile->phone,
                    'company' => $donor->profile->company
                ] : null,
                'total_donations' => $donor->total_donations,
                'total_amount' => $donor->total_amount,
                'average_donation' => $donor->average_donation,
                'formatted_total_amount' => number_format($donor->total_amount, 0, ',', ' ') . ' XAF',
                'formatted_average_donation' => number_format($donor->average_donation, 0, ',', ' ') . ' XAF',
                'is_regular_donor' => $donor->total_donations >= 3,
                'is_major_donor' => $donor->total_amount >= 500000,
                'last_donation_date' => $lastDonation ? $lastDonation->donated_at->format('d/m/Y') : null,
                'last_donation_amount' => $lastDonation ? $lastDonation->formatted_amount : null,
                'last_donation_campaign' => $lastDonation ? $lastDonation->campaign->title : null,
                'created_at' => $donor->created_at->diffForHumans()
            ];
        });

        // Top donateurs
        $topDonors = User::whereHas('completedDonations')
            ->withSum('completedDonations as total_amount', 'amount')
            ->withCount('completedDonations as total_donations')
            ->orderByDesc('total_amount')
            ->limit(10)
            ->get()
            ->map(function ($donor) {
                return [
                    'name' => $donor->profile ? $donor->profile->full_name : $donor->name,
                    'total_amount' => $donor->total_amount,
                    'formatted_total_amount' => number_format($donor->total_amount, 0, ',', ' ') . ' XAF',
                    'total_donations' => $donor->total_donations,
                    'is_major_donor' => $donor->total_amount >= 500000
                ];
            });

        // Statistiques par ville/pays
        $donorsByLocation = User::whereHas('completedDonations')
            ->whereHas('profile')
            ->with('profile')
            ->withSum('completedDonations as total_amount', 'amount')
            ->get()
            ->groupBy(function($donor) {
                return $donor->profile->city ?: 'Non spécifiée';
            })
            ->map(function($donors, $city) {
                return [
                    'city' => $city,
                    'count' => $donors->count(),
                    'total_amount' => $donors->sum('total_amount'),
                    'formatted_total_amount' => number_format($donors->sum('total_amount'), 0, ',', ' ') . ' XAF'
                ];
            })
            ->sortByDesc('total_amount')
            ->values()
            ->take(10);

        // Evolution des donateurs par mois
        $donorEvolution = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthDonors = User::whereHas('completedDonations', function($q) use ($date) {
                $q->whereBetween('donated_at', [
                    $date->startOfMonth()->copy(),
                    $date->endOfMonth()->copy()
                ]);
            })->distinct()->count();
            
            $donorEvolution->push([
                'month' => $date->format('M Y'),
                'donors' => $monthDonors
            ]);
        }

        return Inertia::render('dashboard/donors', [
            'stats' => $stats,
            'donors' => $donors,
            'topDonors' => $topDonors,
            'donorsByLocation' => $donorsByLocation,
            'donorEvolution' => $donorEvolution,
            'type' => $type,
            'filters' => $request->only(['search', 'type'])
        ]);
    }

    /**
     * Afficher un donateur spécifique
     */
    public function show(User $donor): Response
    {
        if (!$donor->isDonor()) {
            abort(404, 'Cette personne n\'est pas un donateur');
        }

        $donor->load(['profile', 'completedDonations.campaign']);

        $donorData = [
            'id' => $donor->id,
            'name' => $donor->name,
            'email' => $donor->email,
            'profile' => $donor->profile ? [
                'full_name' => $donor->profile->full_name,
                'first_name' => $donor->profile->first_name,
                'last_name' => $donor->profile->last_name,
                'phone' => $donor->profile->phone,
                'city' => $donor->profile->city,
                'country' => $donor->profile->country,
                'company' => $donor->profile->company,
                'member_type_display' => $donor->profile->member_type_display,
                'engagement_score' => $donor->profile->engagement_score,
                'joined_at' => $donor->profile->joined_at?->format('d/m/Y')
            ] : null,
            'total_donations' => $donor->donation_count,
            'total_amount' => $donor->total_donations,
            'average_donation' => $donor->average_donation,
            'formatted_total_amount' => number_format($donor->total_donations, 0, ',', ' ') . ' XAF',
            'formatted_average_donation' => number_format($donor->average_donation, 0, ',', ' ') . ' XAF',
            'is_regular_donor' => $donor->isRegularDonor(),
            'is_major_donor' => $donor->isMajorDonor(),
            'last_donation' => $donor->last_donation ? [
                'amount' => $donor->last_donation->formatted_amount,
                'campaign' => $donor->last_donation->campaign->title,
                'date' => $donor->last_donation->donated_at->format('d/m/Y H:i')
            ] : null,
            'created_at' => $donor->created_at->format('d/m/Y H:i'),
            'donations' => $donor->completedDonations->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'donation_number' => $donation->donation_number,
                    'campaign_title' => $donation->campaign->title,
                    'campaign_id' => $donation->campaign_id,
                    'amount' => $donation->amount,
                    'formatted_amount' => $donation->formatted_amount,
                    'type_display' => $donation->type_display,
                    'payment_method_display' => $donation->payment_method_display,
                    'donated_at' => $donation->donated_at->format('d/m/Y H:i'),
                    'is_recurring' => $donation->is_recurring,
                    'has_receipt' => $donation->has_receipt,
                    'thank_you_status' => $donation->thank_you_status,
                    'public_message' => $donation->public_message
                ];
            })
        ];

        // Statistiques du donateur par mois
        $monthlyStats = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthDonations = $donor->completedDonations()
                ->whereBetween('donated_at', [
                    $date->startOfMonth()->copy(),
                    $date->endOfMonth()->copy()
                ]);
            
            $monthlyStats->push([
                'month' => $date->format('M Y'),
                'donations' => $monthDonations->count(),
                'amount' => $monthDonations->sum('amount')
            ]);
        }

        // Campagnes soutenues
        $supportedCampaigns = $donor->completedDonations()
            ->with('campaign')
            ->get()
            ->groupBy('campaign_id')
            ->map(function ($donations, $campaignId) {
                $campaign = $donations->first()->campaign;
                return [
                    'campaign_title' => $campaign->title,
                    'campaign_id' => $campaign->id,
                    'donations_count' => $donations->count(),
                    'total_amount' => $donations->sum('amount'),
                    'formatted_total_amount' => number_format($donations->sum('amount'), 0, ',', ' ') . ' XAF',
                    'first_donation' => $donations->sortBy('donated_at')->first()->donated_at->format('d/m/Y'),
                    'last_donation' => $donations->sortByDesc('donated_at')->first()->donated_at->format('d/m/Y')
                ];
            })
            ->sortByDesc('total_amount')
            ->values();

        return Inertia::render('dashboard/donor-detail', [
            'donor' => $donorData,
            'monthlyStats' => $monthlyStats,
            'supportedCampaigns' => $supportedCampaigns
        ]);
    }

    /**
     * Export des donateurs
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $type = $request->get('type', 'all');
        
        $query = User::whereHas('completedDonations')
            ->with(['profile', 'completedDonations'])
            ->withCount('completedDonations as total_donations')
            ->withSum('completedDonations as total_amount', 'amount')
            ->withAvg('completedDonations as average_donation', 'amount');

        if ($type === 'regular') {
            $query->having('total_donations', '>=', 3);
        } elseif ($type === 'major') {
            $query->having('total_amount', '>=', 500000);
        }
        
        $donors = $query->get();
        
        $fileName = 'donateurs_' . ($type === 'all' ? 'tous' : $type) . '_' . now()->format('Y-m-d_H-i') . '.csv';
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($donors) {
            $handle = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($handle, [
                'ID', 'Nom', 'Email', 'Téléphone', 'Ville', 'Pays', 'Entreprise',
                'Nb Dons', 'Total Donné', 'Don Moyen', 'Dernier Don', 'Type Membre', 'Date Inscription'
            ]);

            // Données
            foreach ($donors as $donor) {
                $lastDonation = $donor->completedDonations()->latest('donated_at')->first();
                
                fputcsv($handle, [
                    $donor->id,
                    $donor->profile ? $donor->profile->full_name : $donor->name,
                    $donor->email,
                    $donor->profile ? $donor->profile->phone : '',
                    $donor->profile ? $donor->profile->city : '',
                    $donor->profile ? $donor->profile->country : '',
                    $donor->profile ? $donor->profile->company : '',
                    $donor->total_donations,
                    number_format($donor->total_amount, 0, ',', ' ') . ' XAF',
                    number_format($donor->average_donation, 0, ',', ' ') . ' XAF',
                    $lastDonation ? $lastDonation->donated_at->format('d/m/Y') : '',
                    $donor->profile ? $donor->profile->member_type_display : '',
                    $donor->created_at->format('d/m/Y H:i')
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Envoyer un message de remerciement
     */
    public function sendThankYou(Request $request, User $donor): RedirectResponse
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'donation_ids' => 'nullable|array',
            'donation_ids.*' => 'exists:donations,id'
        ]);

        if ($request->filled('donation_ids')) {
            // Envoyer pour des dons spécifiques
            $donations = Donation::whereIn('id', $validated['donation_ids'])
                                ->where('donor_id', $donor->id)
                                ->get();
            
            foreach ($donations as $donation) {
                $donation->sendThankYou();
            }
            
            $message = 'Remerciements envoyés pour ' . $donations->count() . ' don(s)';
        } else {
            // Envoyer un remerciement général
            // Logique d'envoi d'email général
            $message = 'Remerciement général envoyé';
        }

        return redirect()->back()->with('success', $message);
    }
}