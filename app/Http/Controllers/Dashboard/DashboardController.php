<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Event;
use App\Models\MemberActivity;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user()->load('profile');
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        $totalMembers = User::count();
        $lastMonthMembers = User::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
        $thisMonthMembers = User::where('created_at', '>=', $startOfMonth)->count();
        $memberGrowth = $lastMonthMembers > 0
            ? round((($thisMonthMembers - $lastMonthMembers) / $lastMonthMembers) * 100)
            : 0;

        $activeEvents = Event::where('status', 'published')
            ->where('start_date', '>=', $now)
            ->count();

        $monthDonations = Donation::completed()->where('donated_at', '>=', $startOfMonth)->sum('amount');
        $lastMonthDonations = Donation::completed()
            ->whereBetween('donated_at', [$lastMonthStart, $lastMonthEnd])
            ->sum('amount');
        $donationGrowth = $lastMonthDonations > 0
            ? round((($monthDonations - $lastMonthDonations) / $lastMonthDonations) * 100)
            : 0;

        $stats = [
            [
                'title'    => 'Membres totaux',
                'value'    => number_format($totalMembers, 0, ',', ' '),
                'change'   => ($memberGrowth >= 0 ? '+' : '') . $memberGrowth . '%',
                'positive' => $memberGrowth >= 0,
                'icon'     => 'bi-people',
                'color'    => '#5FA145',
            ],
            [
                'title'    => 'Événements actifs',
                'value'    => $activeEvents,
                'change'   => $activeEvents . ' à venir',
                'positive' => true,
                'icon'     => 'bi-calendar-event',
                'color'    => '#4A8A2A',
            ],
            [
                'title'    => 'Dons du mois',
                'value'    => number_format($monthDonations, 0, ',', ' ') . ' XAF',
                'change'   => ($donationGrowth >= 0 ? '+' : '') . $donationGrowth . '%',
                'positive' => $donationGrowth >= 0,
                'icon'     => 'bi-heart',
                'color'    => '#C69438',
            ],
            [
                'title'    => 'Membres actifs',
                'value'    => UserProfile::active()->count(),
                'change'   => '+' . $thisMonthMembers . ' ce mois',
                'positive' => true,
                'icon'     => 'bi-person-check',
                'color'    => '#C69438',
            ],
        ];

        $recentActivities = MemberActivity::with('user')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($a) => [
                'id'      => $a->id,
                'message' => ($a->user?->name ?? 'Un membre') . ' — ' . $a->activity_type_display,
                'time'    => $a->created_at->diffForHumans(),
                'icon'    => match($a->activity_type) {
                    'donation'              => 'bi-heart-fill',
                    'event_attendance'      => 'bi-calendar-event',
                    'contest_participation' => 'bi-trophy',
                    'volunteer_work'        => 'bi-hand-thumbs-up',
                    'login'                 => 'bi-person-plus',
                    default                 => 'bi-activity',
                },
                'color' => match($a->activity_type) {
                    'donation'  => '#C69438',
                    'login'     => '#5FA145',
                    default     => '#4A8A2A',
                },
            ]);

        $upcomingEvents = Event::where('status', 'published')
            ->where('start_date', '>=', $now)
            ->orderBy('start_date')
            ->limit(3)
            ->get()
            ->map(fn ($e) => [
                'id'       => $e->id,
                'title'    => $e->title,
                'date'     => $e->start_date->locale('fr')->isoFormat('D MMM YYYY'),
                'location' => $e->location,
                'category' => $e->category_display,
            ]);

        return Inertia::render('dashboard-new', [
            'user'             => $user,
            'stats'            => $stats,
            'recentActivities' => $recentActivities,
            'upcomingEvents'   => $upcomingEvents,
        ]);
    }
}
