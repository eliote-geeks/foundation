<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Contest;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContestController extends Controller
{
    /**
     * Vue d'ensemble des concours
     */
    public function index(Request $request): Response
    {
        $status = $request->get('status', 'all');
        
        // Statistiques générales
        $stats = [
            [
                'title' => 'Total Concours',
                'value' => Contest::count(),
                'change' => '+' . Contest::whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-trophy'
            ],
            [
                'title' => 'Concours Actifs',
                'value' => Contest::active()->count(),
                'change' => '+' . Contest::active()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-play-circle'
            ],
            [
                'title' => 'Votes Reçus',
                'value' => Vote::paid()->count(),
                'change' => '+' . Vote::paid()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#E4518C',
                'icon' => 'bi-hand-thumbs-up'
            ],
            [
                'title' => 'Revenus Votes (XAF)',
                'value' => number_format(Contest::sum('total_revenue'), 0, ',', ' '),
                'change' => '+' . number_format(Contest::whereDate('updated_at', '>=', now()->subWeek())->sum('total_revenue'), 0, ',', ' '),
                'positive' => true,
                'color' => '#667eea',
                'icon' => 'bi-currency-exchange'
            ]
        ];

        // Requête des concours avec filtres
        $contestsQuery = Contest::with(['creator', 'votes'])
            ->latest()
            ->withCount(['votes as total_votes' => function($query) {
                $query->where('payment_status', 'paid');
            }]);

        if ($status !== 'all') {
            $contestsQuery->where('status', $status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $contestsQuery->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('category', 'LIKE', "%{$search}%")
                  ->orWhere('type', 'LIKE', "%{$search}%");
            });
        }

        $contests = $contestsQuery->paginate(12)->through(function ($contest) {
            return [
                'id' => $contest->id,
                'title' => $contest->title,
                'description' => $contest->short_description ?: substr($contest->description, 0, 150) . '...',
                'category' => $contest->category,
                'category_display' => $contest->category_display,
                'type' => $contest->type,
                'type_display' => $contest->type_display,
                'status' => $contest->status,
                'status_display' => $contest->status_display,
                'image' => $contest->image,
                'start_date' => $contest->start_date->format('d/m/Y H:i'),
                'end_date' => $contest->end_date->format('d/m/Y H:i'),
                'voting_start' => $contest->voting_start?->format('d/m/Y H:i'),
                'voting_end' => $contest->voting_end?->format('d/m/Y H:i'),
                'entry_fee' => $contest->entry_fee,
                'vote_price' => $contest->vote_price,
                'formatted_entry_fee' => $contest->formattedEntryFee(),
                'formatted_vote_price' => $contest->formattedVotePrice(),
                'is_free' => $contest->is_free,
                'max_participants' => $contest->max_participants,
                'total_participants' => $contest->total_participants,
                'total_votes' => $contest->total_votes ?? 0,
                'total_revenue' => $contest->total_revenue,
                'created_at' => $contest->created_at->diffForHumans(),
                'creator_name' => $contest->creator->name,
                'is_active' => $contest->isActive(),
                'is_voting_open' => $contest->isVotingOpen(),
                'is_completed' => $contest->isCompleted(),
                'can_accept_participants' => $contest->canAcceptParticipants()
            ];
        });

        // Concours récents
        $recentContests = Contest::with('creator')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($contest) {
                return [
                    'id' => $contest->id,
                    'title' => $contest->title,
                    'category' => $contest->category_display,
                    'start_date' => $contest->start_date->format('d/m/Y'),
                    'status' => $contest->status_display,
                    'creator' => $contest->creator->name,
                    'total_votes' => $contest->total_votes
                ];
            });

        // Analytics par catégorie et type
        $contestsByCategory = Contest::selectRaw('category, COUNT(*) as count, SUM(total_revenue) as revenue')
            ->groupBy('category')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category => [
                    'count' => $item->count,
                    'revenue' => $item->revenue
                ]];
            });

        $contestsByType = Contest::selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->type => $item->count];
            });

        return Inertia::render('dashboard/contests', [
            'stats' => $stats,
            'contests' => $contests,
            'recentContests' => $recentContests,
            'contestsByCategory' => $contestsByCategory,
            'contestsByType' => $contestsByType,
            'status' => $status,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Afficher un concours spécifique
     */
    public function show(Contest $contest): Response
    {
        $contest->load(['creator', 'votes.user']);

        $contestData = [
            'id' => $contest->id,
            'title' => $contest->title,
            'description' => $contest->description,
            'short_description' => $contest->short_description,
            'category' => $contest->category,
            'category_display' => $contest->category_display,
            'type' => $contest->type,
            'type_display' => $contest->type_display,
            'status' => $contest->status,
            'status_display' => $contest->status_display,
            'image' => $contest->image,
            'gallery' => $contest->gallery ?? [],
            'start_date' => $contest->start_date,
            'end_date' => $contest->end_date,
            'voting_start' => $contest->voting_start,
            'voting_end' => $contest->voting_end,
            'entry_fee' => $contest->entry_fee,
            'vote_price' => $contest->vote_price,
            'formatted_entry_fee' => $contest->formattedEntryFee(),
            'formatted_vote_price' => $contest->formattedVotePrice(),
            'is_free' => $contest->is_free,
            'max_participants' => $contest->max_participants,
            'max_votes_per_user' => $contest->max_votes_per_user,
            'total_participants' => $contest->total_participants,
            'total_votes' => $contest->total_votes,
            'total_revenue' => $contest->total_revenue,
            'prizes' => $contest->prizes ?? [],
            'rules' => $contest->rules ?? [],
            'criteria' => $contest->criteria ?? [],
            'sponsors' => $contest->sponsors ?? [],
            'judges' => $contest->judges ?? [],
            'created_at' => $contest->created_at->format('d/m/Y H:i'),
            'creator' => $contest->creator->name,
            'votes' => $contest->votes->map(function ($vote) {
                return [
                    'id' => $vote->id,
                    'participant_name' => $vote->participant_name,
                    'amount_paid' => $vote->formattedAmount(),
                    'payment_status' => $vote->payment_status_display,
                    'comment' => $vote->comment,
                    'voted_at' => $vote->voted_at?->format('d/m/Y H:i'),
                    'voter_name' => $vote->user->name
                ];
            })
        ];

        return Inertia::render('dashboard/contest-detail', [
            'contest' => $contestData
        ]);
    }

    /**
     * Créer un nouveau concours
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string|in:innovation,technology,entrepreneurship,education,arts,environment,social',
            'type' => 'required|string|in:voting,submission,quiz,challenge',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'voting_start' => 'nullable|date|after_or_equal:start_date',
            'voting_end' => 'nullable|date|after:voting_start|before_or_equal:end_date',
            'entry_fee' => 'required|numeric|min:0',
            'vote_price' => 'required|numeric|min:0',
            'is_free' => 'boolean',
            'max_participants' => 'nullable|integer|min:1',
            'max_votes_per_user' => 'required|integer|min:1|max:10',
            'prizes' => 'nullable|array',
            'rules' => 'nullable|array',
            'criteria' => 'nullable|array',
            'sponsors' => 'nullable|array',
            'judges' => 'nullable|array'
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'draft';
        $validated['currency'] = 'XAF';

        if ($validated['is_free']) {
            $validated['entry_fee'] = 0;
            $validated['vote_price'] = 0;
        }

        $contest = Contest::create($validated);

        return redirect()->back()->with('success', "Concours '{$contest->title}' créé avec succès !");
    }

    /**
     * Mettre à jour un concours
     */
    public function update(Request $request, Contest $contest): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'voting_start' => 'nullable|date|after_or_equal:start_date',
            'voting_end' => 'nullable|date|after:voting_start|before_or_equal:end_date',
            'entry_fee' => 'required|numeric|min:0',
            'vote_price' => 'required|numeric|min:0',
            'is_free' => 'boolean',
            'max_participants' => 'nullable|integer|min:1',
            'max_votes_per_user' => 'required|integer|min:1|max:10',
            'prizes' => 'nullable|array',
            'rules' => 'nullable|array',
            'criteria' => 'nullable|array',
            'sponsors' => 'nullable|array',
            'judges' => 'nullable|array',
            'status' => 'required|in:draft,active,voting,closed,completed'
        ]);

        if ($validated['is_free']) {
            $validated['entry_fee'] = 0;
            $validated['vote_price'] = 0;
        }

        if ($validated['status'] === 'active' && $contest->status === 'draft') {
            $validated['published_at'] = now();
        }

        $contest->update($validated);

        return redirect()->back()->with('success', "Concours '{$contest->title}' mis à jour avec succès !");
    }

    /**
     * Supprimer un concours
     */
    public function destroy(Contest $contest): RedirectResponse
    {
        $title = $contest->title;
        
        if ($contest->votes()->count() > 0) {
            return redirect()->back()->with('error', 'Impossible de supprimer un concours qui a des votes.');
        }

        $contest->delete();

        return redirect()->back()->with('success', "Concours '{$title}' supprimé avec succès !");
    }

    /**
     * Changer le statut d'un concours
     */
    public function updateStatus(Request $request, Contest $contest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,active,voting,closed,completed'
        ]);

        $updateData = ['status' => $validated['status']];
        
        if ($validated['status'] === 'active' && $contest->status === 'draft') {
            $updateData['published_at'] = now();
        }

        $contest->update($updateData);

        return redirect()->back()->with('success', "Statut du concours mis à jour: {$contest->fresh()->status_display}");
    }

    /**
     * Traitement d'un vote
     */
    public function processVote(Request $request, Contest $contest): RedirectResponse
    {
        $validated = $request->validate([
            'participant_name' => 'required|string|max:255',
            'participant_id' => 'nullable|integer',
            'amount_paid' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'transaction_id' => 'nullable|string',
            'comment' => 'nullable|string|max:500'
        ]);

        if (!$contest->isVotingOpen()) {
            return redirect()->back()->withErrors(['error' => 'Le vote n\'est pas ouvert pour ce concours']);
        }

        // Vérifier le nombre maximum de votes par utilisateur
        $userVotesCount = Vote::where('contest_id', $contest->id)
                             ->where('user_id', auth()->id())
                             ->where('payment_status', 'paid')
                             ->count();

        if ($userVotesCount >= $contest->max_votes_per_user) {
            return redirect()->back()->withErrors(['error' => 'Vous avez atteint le nombre maximum de votes pour ce concours']);
        }

        $validated['contest_id'] = $contest->id;
        $validated['user_id'] = auth()->id();
        $validated['currency'] = 'XAF';
        $validated['payment_status'] = 'paid'; // Simuler un paiement réussi
        $validated['voted_at'] = now();

        $vote = Vote::create($validated);

        // Mettre à jour les statistiques du concours
        $contest->increment('total_votes');
        $contest->increment('total_revenue', $validated['amount_paid']);

        return redirect()->back()->with('success', 'Vote enregistré avec succès pour ' . $vote->participant_name . ' !');
    }

    /**
     * Export des concours
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $status = $request->get('status', 'all');
        
        $query = Contest::with('creator');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $contests = $query->get();
        
        $fileName = 'concours_' . ($status === 'all' ? 'tous' : $status) . '_' . now()->format('Y-m-d_H-i') . '.csv';
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($contests) {
            $handle = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($handle, [
                'ID', 'Titre', 'Catégorie', 'Type', 'Date début', 'Date fin', 'Prix entrée', 'Prix vote',
                'Participants', 'Total votes', 'Revenus', 'Statut', 'Créateur', 'Date création'
            ]);

            // Données
            foreach ($contests as $contest) {
                fputcsv($handle, [
                    $contest->id,
                    $contest->title,
                    $contest->category_display,
                    $contest->type_display,
                    $contest->start_date->format('d/m/Y H:i'),
                    $contest->end_date->format('d/m/Y H:i'),
                    $contest->formattedEntryFee(),
                    $contest->formattedVotePrice(),
                    $contest->total_participants,
                    $contest->total_votes,
                    $contest->total_revenue,
                    $contest->status_display,
                    $contest->creator->name,
                    $contest->created_at->format('d/m/Y H:i')
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Analytics des votes
     */
    public function votesAnalytics(Contest $contest): Response
    {
        $contest->load(['votes.user']);

        // Statistiques des votes
        $votesStats = [
            'total_votes' => $contest->votes()->paid()->count(),
            'total_revenue' => $contest->votes()->paid()->sum('amount_paid'),
            'average_amount' => $contest->votes()->paid()->avg('amount_paid'),
            'votes_today' => $contest->votes()->paid()->whereDate('created_at', today())->count(),
            'votes_this_week' => $contest->votes()->paid()->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ];

        // Votes par jour (derniers 30 jours)
        $votesByDay = $contest->votes()->paid()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(amount_paid) as revenue')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top participants par votes reçus
        $topParticipants = $contest->votes()->paid()
            ->selectRaw('participant_name, COUNT(*) as votes_count, SUM(amount_paid) as total_amount')
            ->groupBy('participant_name')
            ->orderByDesc('votes_count')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard/ContestVotesAnalytics', [
            'contest' => [
                'id' => $contest->id,
                'title' => $contest->title,
                'status_display' => $contest->status_display
            ],
            'votesStats' => $votesStats,
            'votesByDay' => $votesByDay,
            'topParticipants' => $topParticipants
        ]);
    }
}