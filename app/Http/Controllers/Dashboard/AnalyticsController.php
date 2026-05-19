<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\DonationCampaign;
use App\Models\Event;
use App\Models\MemberActivity;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Vote;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        // ── KPI globaux ─────────────────────────────────────────────────────
        $totalMembers = User::count();
        $activeMembers = UserProfile::active()->count();
        $newMembersThisMonth = User::where('created_at', '>=', $startOfMonth)->count();
        $newMembersLastMonth = User::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
        $memberGrowth = $newMembersLastMonth > 0
            ? round((($newMembersThisMonth - $newMembersLastMonth) / $newMembersLastMonth) * 100)
            : 0;

        $totalDonors = Donation::completed()->distinct('donor_id')->count('donor_id');
        $conversionRate = $totalMembers > 0
            ? round(($totalDonors / $totalMembers) * 100, 1)
            : 0;

        $avgEngagement = round(UserProfile::whereNotNull('engagement_score')->avg('engagement_score') ?? 0);

        $totalActivities = MemberActivity::where('created_at', '>=', $startOfMonth)->count();
        $lastMonthActivities = MemberActivity::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
        $activitiesGrowth = $lastMonthActivities > 0
            ? round((($totalActivities - $lastMonthActivities) / $lastMonthActivities) * 100)
            : 0;

        $stats = [
            [
                'title'    => 'Membres totaux',
                'value'    => number_format($totalMembers, 0, ',', ' '),
                'change'   => '+' . $newMembersThisMonth . ' ce mois',
                'positive' => true,
                'color'    => '#5FA145',
                'icon'     => 'bi-people-fill',
            ],
            [
                'title'    => 'Membres actifs',
                'value'    => number_format($activeMembers, 0, ',', ' '),
                'change'   => $totalMembers > 0
                    ? round(($activeMembers / $totalMembers) * 100) . '% du total'
                    : '0%',
                'positive' => true,
                'color'    => '#4A8A2A',
                'icon'     => 'bi-person-check-fill',
            ],
            [
                'title'    => 'Taux de conversion don',
                'value'    => $conversionRate . '%',
                'change'   => $totalDonors . ' donateurs',
                'positive' => $conversionRate > 0,
                'color'    => '#C69438',
                'icon'     => 'bi-heart-fill',
            ],
            [
                'title'    => 'Score engagement moyen',
                'value'    => $avgEngagement,
                'change'   => ($activitiesGrowth >= 0 ? '+' : '') . $activitiesGrowth . '% activités',
                'positive' => $activitiesGrowth >= 0,
                'color'    => '#C69438',
                'icon'     => 'bi-lightning-charge-fill',
            ],
        ];

        // ── Croissance membres — 12 mois ────────────────────────────────────
        $memberGrowthData = collect();
        for ($i = 11; $i >= 0; $i--) {
            $start = $now->copy()->subMonths($i)->startOfMonth();
            $end   = $now->copy()->subMonths($i)->endOfMonth();
            $memberGrowthData->push([
                'month'    => $start->locale('fr')->isoFormat('MMM YYYY'),
                'nouveaux' => User::whereBetween('created_at', [$start, $end])->count(),
                'cumul'    => User::where('created_at', '<=', $end)->count(),
            ]);
        }

        // ── Répartition par type de membre ──────────────────────────────────
        $membersByType = UserProfile::selectRaw('member_type, COUNT(*) as count')
            ->groupBy('member_type')
            ->get()
            ->map(fn ($row) => [
                'type'    => $row->member_type,
                'label'   => match($row->member_type) {
                    'adherent'         => 'Adhérents',
                    'ambassador'       => 'Ambassadeurs',
                    'former_challenger' => 'Anciens Challengers',
                    'partner'          => 'Partenaires',
                    'volunteer'        => 'Bénévoles',
                    'beneficiary'      => 'Bénéficiaires',
                    default            => 'Autres',
                },
                'count'   => $row->count,
            ])
            ->sortByDesc('count')
            ->values();

        // ── Activités par type — ce mois ────────────────────────────────────
        $activitiesByType = MemberActivity::selectRaw('activity_type, COUNT(*) as count, SUM(points_earned) as total_points')
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->groupBy('activity_type')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(fn ($row) => [
                'type'         => $row->activity_type,
                'label'        => match($row->activity_type) {
                    'login'                    => 'Connexions',
                    'profile_update'           => 'Profils mis à jour',
                    'contest_participation'    => 'Participations concours',
                    'event_attendance'         => 'Présences événements',
                    'donation'                 => 'Dons effectués',
                    'volunteer_work'           => 'Travail bénévole',
                    'ambassador_action'        => 'Actions ambassadeurs',
                    'challenge_completion'     => 'Défis complétés',
                    'social_share'             => 'Partages réseaux sociaux',
                    'newsletter_engagement'    => 'Engagements newsletter',
                    'referral'                 => 'Parrainages',
                    default                    => $row->activity_type,
                },
                'count'        => $row->count,
                'total_points' => $row->total_points,
            ]);

        // ── Top membres par engagement ───────────────────────────────────────
        $topMembers = UserProfile::with('user')
            ->where('engagement_score', '>', 0)
            ->orderByDesc('engagement_score')
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'name'             => $p->full_name ?: $p->user?->name,
                'member_type'      => $p->member_type_display,
                'engagement_score' => $p->engagement_score,
                'engagement_level' => $p->engagement_level,
                'last_active'      => $p->last_activity_at?->diffForHumans(),
            ]);

        // ── Dons — évolution 12 mois ────────────────────────────────────────
        $donationTrend = collect();
        for ($i = 11; $i >= 0; $i--) {
            $start = $now->copy()->subMonths($i)->startOfMonth();
            $end   = $now->copy()->subMonths($i)->endOfMonth();
            $donationTrend->push([
                'month'   => $start->locale('fr')->isoFormat('MMM YYYY'),
                'montant' => Donation::completed()->whereBetween('donated_at', [$start, $end])->sum('amount'),
                'nombre'  => Donation::completed()->whereBetween('donated_at', [$start, $end])->count(),
            ]);
        }

        // ── Événements & concours — synthèse ────────────────────────────────
        $eventStats = [
            'total'     => Event::count(),
            'published' => Event::where('status', 'published')->count(),
            'upcoming'  => Event::where('status', 'published')->where('start_date', '>=', $now)->count(),
            'tickets_sold' => Ticket::paid()->count(),
            'revenue'   => Ticket::paid()->sum('price_paid'),
        ];

        $contestStats = [
            'total'   => \App\Models\Contest::count(),
            'active'  => \App\Models\Contest::where('status', 'active')->count(),
            'votes'   => Vote::paid()->count(),
            'revenue' => Vote::paid()->sum('amount_paid'),
        ];

        return Inertia::render('dashboard/analytics', [
            'stats'            => $stats,
            'memberGrowthData' => $memberGrowthData,
            'membersByType'    => $membersByType,
            'activitiesByType' => $activitiesByType,
            'topMembers'       => $topMembers,
            'donationTrend'    => $donationTrend,
            'eventStats'       => $eventStats,
            'contestStats'     => $contestStats,
        ]);
    }
}
