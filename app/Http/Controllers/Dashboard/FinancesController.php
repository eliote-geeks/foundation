<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Ticket;
use App\Models\Vote;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class FinancesController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        // ── Revenus par source ──────────────────────────────────────────────
        $totalDonations = Donation::completed()->sum('amount');
        $totalTickets   = Ticket::paid()->sum('price_paid');
        $totalVotes     = Vote::paid()->sum('amount_paid');
        $totalRevenue   = $totalDonations + $totalTickets + $totalVotes;

        $monthDonations = Donation::completed()->where('donated_at', '>=', $startOfMonth)->sum('amount');
        $monthTickets   = Ticket::paid()->where('created_at', '>=', $startOfMonth)->sum('price_paid');
        $monthVotes     = Vote::paid()->where('voted_at', '>=', $startOfMonth)->sum('amount_paid');
        $monthRevenue   = $monthDonations + $monthTickets + $monthVotes;

        $lastMonthDonations = Donation::completed()->whereBetween('donated_at', [$lastMonthStart, $lastMonthEnd])->sum('amount');
        $lastMonthTickets   = Ticket::paid()->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->sum('price_paid');
        $lastMonthVotes     = Vote::paid()->whereBetween('voted_at', [$lastMonthStart, $lastMonthEnd])->sum('amount_paid');
        $lastMonthRevenue   = $lastMonthDonations + $lastMonthTickets + $lastMonthVotes;

        $monthChange = $lastMonthRevenue > 0
            ? round((($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100)
            : 0;

        $fmt = fn ($n) => number_format($n, 0, ',', ' ') . ' XAF';

        $stats = [
            [
                'title'    => 'Revenus totaux',
                'value'    => $fmt($totalRevenue),
                'change'   => ($monthChange >= 0 ? '+' : '') . $monthChange . '%',
                'positive' => $monthChange >= 0,
                'color'    => '#5FA145',
                'icon'     => 'bi-arrow-up-circle',
            ],
            [
                'title'    => 'Revenus ce mois',
                'value'    => $fmt($monthRevenue),
                'change'   => ($monthChange >= 0 ? '+' : '') . $monthChange . '%',
                'positive' => $monthChange >= 0,
                'color'    => '#4A8A2A',
                'icon'     => 'bi-calendar-month',
            ],
            [
                'title'    => 'Dons reçus',
                'value'    => $fmt($totalDonations),
                'change'   => number_format(Donation::completed()->count(), 0, ',', ' ') . ' dons',
                'positive' => true,
                'color'    => '#C69438',
                'icon'     => 'bi-heart-fill',
            ],
            [
                'title'    => 'Billets & Votes',
                'value'    => $fmt($totalTickets + $totalVotes),
                'change'   => (Ticket::paid()->count() + Vote::paid()->count()) . ' opérations',
                'positive' => true,
                'color'    => '#C69438',
                'icon'     => 'bi-ticket-perforated-fill',
            ],
        ];

        // ── Transactions récentes (donations + billets + votes) ─────────────
        $donations = Donation::completed()
            ->with('campaign')
            ->latest('donated_at')
            ->limit(30)
            ->get()
            ->map(fn ($d) => [
                'id'          => 'd-' . $d->id,
                'type'        => 'Recette',
                'source'      => 'Don',
                'description' => 'Don' . ($d->campaign ? ' — ' . $d->campaign->title : ''),
                'amount'      => $d->amount,
                'formatted'   => $d->formatted_amount,
                'date'        => $d->donated_at?->toDateString(),
                'status'      => 'Confirmé',
            ]);

        $tickets = Ticket::paid()
            ->with('event')
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn ($t) => [
                'id'          => 't-' . $t->id,
                'type'        => 'Recette',
                'source'      => 'Billet',
                'description' => 'Billet' . ($t->event ? ' — ' . $t->event->title : ''),
                'amount'      => $t->price_paid,
                'formatted'   => number_format($t->price_paid, 0, ',', ' ') . ' ' . $t->currency,
                'date'        => $t->created_at->toDateString(),
                'status'      => 'Confirmé',
            ]);

        $votes = Vote::paid()
            ->with('contest')
            ->latest('voted_at')
            ->limit(30)
            ->get()
            ->map(fn ($v) => [
                'id'          => 'v-' . $v->id,
                'type'        => 'Recette',
                'source'      => 'Vote',
                'description' => 'Vote' . ($v->contest ? ' — ' . $v->contest->title : ''),
                'amount'      => $v->amount_paid,
                'formatted'   => number_format($v->amount_paid, 0, ',', ' ') . ' ' . $v->currency,
                'date'        => $v->voted_at?->toDateString() ?? $v->created_at->toDateString(),
                'status'      => 'Confirmé',
            ]);

        $transactions = $donations
            ->concat($tickets)
            ->concat($votes)
            ->sortByDesc('date')
            ->values()
            ->take(40);

        // ── Répartition des revenus par source ──────────────────────────────
        $revenueBySource = [
            ['name' => 'Dons', 'amount' => $totalDonations, 'formatted' => $fmt($totalDonations), 'color' => '#5FA145'],
            ['name' => 'Billets', 'amount' => $totalTickets, 'formatted' => $fmt($totalTickets), 'color' => '#4A8A2A'],
            ['name' => 'Votes', 'amount' => $totalVotes, 'formatted' => $fmt($totalVotes), 'color' => '#C69438'],
        ];

        // ── Évolution mensuelle (12 derniers mois) ──────────────────────────
        $monthlyRevenue = collect();
        for ($i = 11; $i >= 0; $i--) {
            $start = $now->copy()->subMonths($i)->startOfMonth();
            $end   = $now->copy()->subMonths($i)->endOfMonth();
            $d = Donation::completed()->whereBetween('donated_at', [$start, $end])->sum('amount');
            $t = Ticket::paid()->whereBetween('created_at', [$start, $end])->sum('price_paid');
            $v = Vote::paid()->whereBetween('voted_at', [$start, $end])->sum('amount_paid');
            $monthlyRevenue->push([
                'month'   => $start->locale('fr')->isoFormat('MMM YYYY'),
                'total'   => $d + $t + $v,
                'dons'    => $d,
                'billets' => $t,
                'votes'   => $v,
            ]);
        }

        return Inertia::render('dashboard/finances', [
            'stats'          => $stats,
            'transactions'   => $transactions,
            'revenueBySource' => $revenueBySource,
            'monthlyRevenue' => $monthlyRevenue,
            'totals' => [
                'donations' => $totalDonations,
                'tickets'   => $totalTickets,
                'votes'     => $totalVotes,
                'total'     => $totalRevenue,
            ],
        ]);
    }
}
