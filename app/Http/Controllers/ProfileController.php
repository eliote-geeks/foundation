<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\MemberActivity;
use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(): Response
    {
        $user = Auth::user()->load('profile');
        $profile = $user->profile;

        $donationsCompleted = Donation::completed()->where('donor_id', $user->id);
        $donationStats = [
            'count' => $donationsCompleted->count(),
            'total' => $donationsCompleted->sum('amount'),
            'formatted_total' => number_format($donationsCompleted->sum('amount'), 0, ',', ' ') . ' XAF',
            'avg' => (int) $donationsCompleted->avg('amount'),
        ];

        $ticketsCount = Ticket::paid()->where('user_id', $user->id)->count();

        $recentActivities = MemberActivity::where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($a) => [
                'id'           => $a->id,
                'type'         => $a->activity_type,
                'label'        => $a->activity_type_display,
                'title'        => $a->activity_title,
                'points'       => $a->points_earned,
                'date'         => $a->created_at->toDateString(),
                'date_human'   => $a->created_at->diffForHumans(),
                'icon'         => match($a->activity_type) {
                    'donation'              => 'bi-heart-fill',
                    'event_attendance'      => 'bi-calendar-event',
                    'contest_participation' => 'bi-trophy',
                    'volunteer_work'        => 'bi-hand-thumbs-up',
                    'ambassador_action'     => 'bi-megaphone',
                    'social_share'          => 'bi-share',
                    'referral'              => 'bi-people',
                    default                 => 'bi-activity',
                },
                'color'        => match($a->activity_type) {
                    'donation'              => '#C69438',
                    'event_attendance'      => '#5FA145',
                    'contest_participation' => '#C69438',
                    'volunteer_work'        => '#4A8A2A',
                    default                 => '#6c757d',
                },
            ]);

        $recentDonations = Donation::completed()
            ->with('campaign')
            ->where('donor_id', $user->id)
            ->latest('donated_at')
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'id'        => $d->id,
                'title'     => $d->campaign?->title ?? 'Don libre',
                'amount'    => $d->formatted_amount,
                'date'      => $d->donated_at?->toDateString(),
                'date_fr'   => $d->donated_at?->locale('fr')->isoFormat('D MMM YYYY'),
            ]);

        return Inertia::render('profile', [
            'user'    => [
                'name'       => $user->name,
                'email'      => $user->email,
                'joined_at'  => $user->created_at->toDateString(),
                'member_type' => $profile?->member_type ?? 'adherent',
                'member_type_display' => $profile?->member_type_display ?? 'Adhérent',
                'phone'      => $profile?->phone,
                'city'       => $profile?->city,
                'country'    => $profile?->country,
                'bio'        => $profile?->bio,
                'profession' => $profile?->profession,
                'company'    => $profile?->company,
                'interests'  => $profile?->interests ?? [],
                'skills'     => $profile?->skills ?? [],
                'engagement_score'  => $profile?->engagement_score ?? 0,
                'engagement_level'  => $profile?->engagement_level ?? 'Faible',
                'avatar'     => $profile?->avatar_path,
                'accepts_newsletter' => $profile?->accepts_newsletter ?? true,
                'accepts_sms'        => $profile?->accepts_sms ?? false,
                'linkedin_url'   => $profile?->linkedin_url,
                'facebook_url'   => $profile?->facebook_url,
                'instagram_url'  => $profile?->instagram_url,
                'twitter_url'    => $profile?->twitter_url,
            ],
            'stats' => [
                'donations'     => $donationStats,
                'tickets_count' => $ticketsCount,
                'activities_count' => MemberActivity::where('user_id', $user->id)->count(),
            ],
            'recentActivities' => $recentActivities,
            'recentDonations'  => $recentDonations,
        ]);
    }
}
