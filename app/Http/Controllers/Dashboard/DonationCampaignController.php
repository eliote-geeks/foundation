<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DonationCampaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DonationCampaignController extends Controller
{
    /**
     * Vue d'ensemble des campagnes de dons
     */
    public function index(Request $request): Response
    {
        $status = $request->get('status', 'all');
        
        // Statistiques générales
        $stats = [
            [
                'title' => 'Total Campagnes',
                'value' => DonationCampaign::count(),
                'change' => '+' . DonationCampaign::whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color' => '#E4518C',
                'icon' => 'bi-heart'
            ],
            [
                'title' => 'Campagnes Actives',
                'value' => DonationCampaign::active()->count(),
                'change' => '+' . DonationCampaign::active()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-play-circle'
            ],
            [
                'title' => 'Fonds Collectés (XAF)',
                'value' => number_format(DonationCampaign::sum('current_amount'), 0, ',', ' '),
                'change' => '+' . number_format(DonationCampaign::whereDate('updated_at', '>=', now()->subWeek())->sum('current_amount'), 0, ',', ' '),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-currency-exchange'
            ],
            [
                'title' => 'Total Donateurs',
                'value' => Donation::where('payment_status', 'completed')->distinct('donor_id')->count(),
                'change' => '+' . Donation::where('payment_status', 'completed')->whereDate('donated_at', '>=', now()->subWeek())->distinct('donor_id')->count(),
                'positive' => true,
                'color' => '#667eea',
                'icon' => 'bi-people'
            ]
        ];

        // Requête des campagnes avec filtres
        $campaignsQuery = DonationCampaign::with(['creator', 'donations'])
            ->latest()
            ->withCount(['donations as total_donations' => function($query) {
                $query->where('payment_status', 'completed');
            }]);

        if ($status !== 'all') {
            $campaignsQuery->where('status', $status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $campaignsQuery->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('category', 'LIKE', "%{$search}%")
                  ->orWhere('type', 'LIKE', "%{$search}%");
            });
        }

        $campaigns = $campaignsQuery->paginate(12)->through(function ($campaign) {
            return [
                'id' => $campaign->id,
                'title' => $campaign->title,
                'description' => $campaign->short_description ?: substr($campaign->description, 0, 150) . '...',
                'slug' => $campaign->slug,
                'category' => $campaign->category,
                'category_display' => $campaign->category_display,
                'type' => $campaign->type,
                'type_display' => $campaign->type_display,
                'status' => $campaign->status,
                'status_display' => $campaign->status_display,
                'image' => $campaign->image,
                'start_date' => $campaign->start_date->format('d/m/Y H:i'),
                'end_date' => $campaign->end_date?->format('d/m/Y H:i'),
                'target_amount' => $campaign->target_amount,
                'current_amount' => $campaign->current_amount,
                'formatted_target_amount' => $campaign->formatted_target_amount,
                'formatted_current_amount' => $campaign->formatted_current_amount,
                'completion_percentage' => $campaign->completion_percentage,
                'donor_count' => $campaign->donor_count,
                'donation_count' => $campaign->donation_count,
                'total_donations' => $campaign->total_donations ?? 0,
                'average_donation' => $campaign->average_donation,
                'days_remaining' => $campaign->days_remaining,
                'is_expired' => $campaign->is_expired,
                'is_ongoing' => $campaign->is_ongoing,
                'created_at' => $campaign->created_at->diffForHumans(),
                'creator_name' => $campaign->creator->name,
                'can_receive_donations' => $campaign->canReceiveDonations(),
                'performance_score' => $campaign->performance_score
            ];
        });

        // Campagnes récentes
        $recentCampaigns = DonationCampaign::with('creator')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'category' => $campaign->category_display,
                    'start_date' => $campaign->start_date->format('d/m/Y'),
                    'status' => $campaign->status_display,
                    'creator' => $campaign->creator->name,
                    'completion_percentage' => $campaign->completion_percentage,
                    'formatted_current_amount' => $campaign->formatted_current_amount
                ];
            });

        // Analytics par catégorie et type
        $campaignsByCategory = DonationCampaign::selectRaw('category, COUNT(*) as count, SUM(current_amount) as total_raised')
            ->groupBy('category')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category => [
                    'count' => $item->count,
                    'total_raised' => $item->total_raised
                ]];
            });

        $campaignsByType = DonationCampaign::selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->type => $item->count];
            });

        // Top performing campaigns
        $topCampaigns = DonationCampaign::where('status', 'active')
            ->orderByDesc('completion_percentage')
            ->limit(5)
            ->get()
            ->map(function ($campaign) {
                return [
                    'title' => $campaign->title,
                    'completion_percentage' => $campaign->completion_percentage,
                    'formatted_current_amount' => $campaign->formatted_current_amount,
                    'donor_count' => $campaign->donor_count
                ];
            });

        return Inertia::render('dashboard/donation-campaigns', [
            'stats' => $stats,
            'campaigns' => $campaigns,
            'recentCampaigns' => $recentCampaigns,
            'campaignsByCategory' => $campaignsByCategory,
            'campaignsByType' => $campaignsByType,
            'topCampaigns' => $topCampaigns,
            'status' => $status,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Afficher une campagne spécifique
     */
    public function show(DonationCampaign $campaign): Response
    {
        $campaign->load(['creator', 'donations.donor']);

        $campaignData = [
            'id' => $campaign->id,
            'title' => $campaign->title,
            'description' => $campaign->description,
            'short_description' => $campaign->short_description,
            'slug' => $campaign->slug,
            'category' => $campaign->category,
            'category_display' => $campaign->category_display,
            'type' => $campaign->type,
            'type_display' => $campaign->type_display,
            'status' => $campaign->status,
            'status_display' => $campaign->status_display,
            'image' => $campaign->image,
            'gallery' => $campaign->gallery ?? [],
            'start_date' => $campaign->start_date,
            'end_date' => $campaign->end_date,
            'target_amount' => $campaign->target_amount,
            'current_amount' => $campaign->current_amount,
            'formatted_target_amount' => $campaign->formatted_target_amount,
            'formatted_current_amount' => $campaign->formatted_current_amount,
            'remaining_amount' => $campaign->remaining_amount,
            'formatted_remaining_amount' => $campaign->formatted_remaining_amount,
            'completion_percentage' => $campaign->completion_percentage,
            'donor_count' => $campaign->donor_count,
            'donation_count' => $campaign->donation_count,
            'average_donation' => $campaign->average_donation,
            'target_donors' => $campaign->target_donors,
            'days_remaining' => $campaign->days_remaining,
            'is_expired' => $campaign->is_expired,
            'is_ongoing' => $campaign->is_ongoing,
            'full_content' => $campaign->full_content,
            'impact_metrics' => $campaign->impact_metrics ?? [],
            'updates' => $campaign->updates ?? [],
            'faq' => $campaign->faq ?? [],
            'suggested_amounts' => $campaign->suggested_amounts ?? [],
            'allow_anonymous' => $campaign->allow_anonymous,
            'allow_recurring' => $campaign->allow_recurring,
            'show_donors' => $campaign->show_donors,
            'beneficiary_info' => $campaign->beneficiary_info ?? [],
            'created_at' => $campaign->created_at->format('d/m/Y H:i'),
            'creator' => $campaign->creator->name,
            'can_receive_donations' => $campaign->canReceiveDonations(),
            'performance_score' => $campaign->performance_score,
            'donations' => $campaign->donations->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'donation_number' => $donation->donation_number,
                    'amount' => $donation->amount,
                    'formatted_amount' => $donation->formatted_amount,
                    'currency' => $donation->currency,
                    'type_display' => $donation->type_display,
                    'payment_status_display' => $donation->payment_status_display,
                    'payment_method_display' => $donation->payment_method_display,
                    'is_anonymous' => $donation->is_anonymous,
                    'donor_display_name' => $donation->donor_display_name,
                    'donated_at' => $donation->donated_at?->format('d/m/Y H:i'),
                    'public_message' => $donation->public_message
                ];
            })
        ];

        return Inertia::render('dashboard/donation-campaign-detail', [
            'campaign' => $campaignData
        ]);
    }

    /**
     * Créer une nouvelle campagne de dons
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string|in:education,health,environment,poverty,emergency,infrastructure,technology,culture,sport,other',
            'type' => 'required|string|in:general,project_specific,emergency,recurring,crowdfunding,memorial,tribute,corporate',
            'start_date' => 'required|date|after:now',
            'end_date' => 'nullable|date|after:start_date',
            'target_amount' => 'required|numeric|min:1000',
            'min_amount' => 'nullable|numeric|min:100',
            'max_amount' => 'nullable|numeric|gt:min_amount',
            'target_donors' => 'nullable|integer|min:1',
            'full_content' => 'nullable|string',
            'impact_metrics' => 'nullable|array',
            'suggested_amounts' => 'nullable|array',
            'allow_anonymous' => 'boolean',
            'allow_recurring' => 'boolean',
            'show_donors' => 'boolean',
            'send_thank_you' => 'boolean',
            'target_regions' => 'nullable|array',
            'beneficiary_info' => 'nullable|array'
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'draft';
        $validated['currency'] = 'XAF';
        $validated['slug'] = \Str::slug($validated['title']) . '-' . time();

        $campaign = DonationCampaign::create($validated);

        return redirect()->back()->with('success', "Campagne '{$campaign->title}' créée avec succès !");
    }

    /**
     * Mettre à jour une campagne
     */
    public function update(Request $request, DonationCampaign $campaign): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'target_amount' => 'required|numeric|min:1000',
            'min_amount' => 'nullable|numeric|min:100',
            'max_amount' => 'nullable|numeric',
            'target_donors' => 'nullable|integer|min:1',
            'full_content' => 'nullable|string',
            'impact_metrics' => 'nullable|array',
            'suggested_amounts' => 'nullable|array',
            'allow_anonymous' => 'boolean',
            'allow_recurring' => 'boolean',
            'show_donors' => 'boolean',
            'send_thank_you' => 'boolean',
            'target_regions' => 'nullable|array',
            'beneficiary_info' => 'nullable|array',
            'status' => 'required|in:draft,active,paused,completed,cancelled'
        ]);

        if ($validated['status'] === 'active' && $campaign->status === 'draft') {
            $validated['published_at'] = now();
        }

        $campaign->update($validated);

        return redirect()->back()->with('success', "Campagne '{$campaign->title}' mise à jour avec succès !");
    }

    /**
     * Supprimer une campagne
     */
    public function destroy(DonationCampaign $campaign): RedirectResponse
    {
        $title = $campaign->title;
        
        if ($campaign->donations()->where('payment_status', 'completed')->count() > 0) {
            return redirect()->back()->with('error', 'Impossible de supprimer une campagne qui a des dons confirmés.');
        }

        $campaign->delete();

        return redirect()->back()->with('success', "Campagne '{$title}' supprimée avec succès !");
    }

    /**
     * Changer le statut d'une campagne
     */
    public function updateStatus(Request $request, DonationCampaign $campaign): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,active,paused,completed,cancelled'
        ]);

        $updateData = ['status' => $validated['status']];
        
        if ($validated['status'] === 'active' && $campaign->status === 'draft') {
            $updateData['published_at'] = now();
        }

        if ($validated['status'] === 'completed') {
            $updateData['completed_at'] = now();
        }

        $campaign->update($updateData);

        return redirect()->back()->with('success', "Statut de la campagne mis à jour: {$campaign->fresh()->status_display}");
    }

    /**
     * Ajouter une mise à jour à la campagne
     */
    public function addUpdate(Request $request, DonationCampaign $campaign): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $campaign->addUpdate($validated['title'], $validated['content'], auth()->user());

        return redirect()->back()->with('success', 'Mise à jour ajoutée avec succès !');
    }

    /**
     * Export des campagnes
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $status = $request->get('status', 'all');
        
        $query = DonationCampaign::with('creator');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $campaigns = $query->get();
        
        $fileName = 'campagnes_dons_' . ($status === 'all' ? 'toutes' : $status) . '_' . now()->format('Y-m-d_H-i') . '.csv';
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($campaigns) {
            $handle = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($handle, [
                'ID', 'Titre', 'Catégorie', 'Type', 'Date début', 'Date fin', 'Objectif', 'Collecté',
                '% Complété', 'Donateurs', 'Dons', 'Moyenne', 'Statut', 'Créateur', 'Date création'
            ]);

            // Données
            foreach ($campaigns as $campaign) {
                fputcsv($handle, [
                    $campaign->id,
                    $campaign->title,
                    $campaign->category_display,
                    $campaign->type_display,
                    $campaign->start_date->format('d/m/Y H:i'),
                    $campaign->end_date?->format('d/m/Y H:i') ?? 'Aucune',
                    $campaign->formatted_target_amount,
                    $campaign->formatted_current_amount,
                    $campaign->completion_percentage . '%',
                    $campaign->donor_count,
                    $campaign->donation_count,
                    number_format($campaign->average_donation, 0, ',', ' ') . ' XAF',
                    $campaign->status_display,
                    $campaign->creator->name,
                    $campaign->created_at->format('d/m/Y H:i')
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}