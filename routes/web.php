<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;

Route::get('/', function () {
    $totalRaised = \App\Models\Donation::where('payment_status', 'completed')->sum('amount')
        + \App\Models\Ticket::where('payment_status', 'paid')->sum('price_paid');

    $heroSlide = \App\Models\HeroSlide::activeFirst();

    return Inertia::render('home', [
        'user' => auth()->user(),
        'stats' => [
            'totalEvents'  => \App\Models\Event::published()->count(),
            'totalMembers' => \App\Models\User::count(),
            'ticketsSold'  => \App\Models\Ticket::where('payment_status', 'paid')->count(),
            'totalRaised'  => $totalRaised >= 1_000_000
                ? number_format($totalRaised / 1_000_000, 1) . 'M'
                : number_format($totalRaised / 1_000, 0) . 'K',
        ],
        'partners' => \App\Models\Partner::active()
            ->limit(8)
            ->get(['id', 'name', 'logo', 'website', 'is_featured'])
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'logo' => $p->logo,
                'website_url' => $p->website,
            ])->values(),
        'upcomingEvents' => Event::query()
            ->published()
            ->upcoming()
            ->orderBy('start_date')
            ->limit(6)
            ->get()
            ->map(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'short_description' => $event->short_description,
                'location' => $event->location,
                'start_date_display' => $event->start_date->translatedFormat('d M Y • H:i'),
                'category_display' => $event->category_display,
                'image' => $event->image,
                'formatted_price' => $event->formattedPrice(),
                'requires_approval' => $event->requires_approval,
            ])
            ->values(),
        'heroSlide' => $heroSlide ? [
            'headline'            => $heroSlide->headline,
            'headline_accent'     => $heroSlide->headline_accent,
            'tagline'             => $heroSlide->tagline,
            'badge_text'          => $heroSlide->badge_text,
            'cta_primary_label'   => $heroSlide->cta_primary_label,
            'cta_primary_url'     => $heroSlide->cta_primary_url,
            'cta_secondary_label' => $heroSlide->cta_secondary_label,
            'cta_secondary_url'   => $heroSlide->cta_secondary_url,
        ] : null,
        'testimonials' => \App\Models\Testimonial::active()->get()->map(fn ($t) => [
            'id'         => $t->id,
            'name'       => $t->name,
            'role'       => $t->role,
            'city'       => $t->city,
            'content'    => $t->content,
            'rating'     => $t->rating,
            'icon'       => $t->icon,
            'icon_color' => $t->icon_color,
            'icon_bg'    => $t->icon_bg,
        ])->values(),
    ]);
})->name('home');

Route::get('/contests', function () {
    $contests = \App\Models\Contest::whereIn('status', ['active', 'voting', 'upcoming', 'completed'])
        ->orderBy('end_date', 'asc')
        ->get()
        ->map(fn (\App\Models\Contest $c) => [
            'id'          => $c->id,
            'title'       => $c->title,
            'description' => $c->short_description ?: substr($c->description ?? '', 0, 160),
            'icon'        => 'bi-trophy',
            'category'    => $c->category,
            'endDate'     => $c->end_date?->toDateString(),
            'votes'       => $c->votes()->where('payment_status', 'paid')->count(),
            'status'      => $c->isActive() ? 'active' : ($c->isCompleted() ? 'ended' : 'upcoming'),
            'prize'       => $c->prizes ? (collect($c->prizes)->first()['value'] ?? null) : null,
        ]);

    return Inertia::render('contests', [
        'user'     => auth()->user(),
        'contests' => $contests,
    ]);
})->name('contests');

Route::get('/contests/{contest}', [App\Http\Controllers\ContestController::class, 'show'])->name('contests.show');
Route::post('/contests/{contest}/entries', [App\Http\Controllers\ContestController::class, 'submitEntry'])->name('contests.entries.store')->middleware('auth');
Route::post('/contests/{contest}/vote', [App\Http\Controllers\ContestController::class, 'submitVote'])->name('contests.vote')->middleware('auth');

// Media upload (auth required, returns JSON)
Route::post('/media/upload', [App\Http\Controllers\MediaController::class, 'store'])->name('media.upload')->middleware('auth');
Route::delete('/media/{media}', [App\Http\Controllers\MediaController::class, 'destroy'])->name('media.destroy')->middleware('auth');

// Public projects
Route::get('/projects', [App\Http\Controllers\ProjectController::class, 'index'])->name('projects');
Route::post('/projects', [App\Http\Controllers\ProjectController::class, 'store'])->name('projects.store')->middleware('auth');

Route::get('/donate', [App\Http\Controllers\DonationController::class, 'index'])->name('donate');
Route::post('/donate', [App\Http\Controllers\DonationController::class, 'store'])->name('donate.store');

// /tickets redirige vers /events (même contenu, évite la duplication)
Route::get('/tickets', fn() => redirect('/events'))->name('tickets');

// Routes événements (public)
Route::controller(App\Http\Controllers\PublicEventController::class)->group(function () {
    Route::get('/events', 'index')->name('events.index');
    Route::get('/events/{event}', 'show')->name('events.show');
    Route::post('/events/{event}/reserve', 'reserve')->name('events.reserve');
});

// Routes partenaires
Route::controller(App\Http\Controllers\PartnerController::class)->group(function () {
    Route::get('/partners', 'index')->name('partners');
    Route::post('/partners/request', 'submitRequest')->name('partners.request');
    Route::get('/api/partners', 'apiIndex')->name('api.partners.index');
    Route::get('/api/partners/stats', 'stats')->name('api.partners.stats');
    Route::get('/api/partners/{partner}', 'show')->name('api.partners.show');
});

// Dashboard routes (admin only)
Route::middleware(['auth', 'admin'])->prefix('dashboard')->name('dashboard.')->group(function () {

    // Routes dashboard membres
    Route::controller(App\Http\Controllers\Dashboard\MemberController::class)->prefix('members')->name('members.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        
        // Routes statiques AVANT les routes dynamiques
        Route::get('/export', 'export')->name('export');
        Route::get('/analytics', 'analytics')->name('analytics');
        Route::get('/adherent', function (Request $request) {
            return app(App\Http\Controllers\Dashboard\MemberController::class)->index(
                $request->merge(['filter' => 'adherent'])
            );
        })->name('adherent');
        Route::get('/ambassador', function (Request $request) {
            return app(App\Http\Controllers\Dashboard\MemberController::class)->index(
                $request->merge(['filter' => 'ambassador'])
            );
        })->name('ambassador');
        Route::get('/volunteer', function (Request $request) {
            return app(App\Http\Controllers\Dashboard\MemberController::class)->index(
                $request->merge(['filter' => 'volunteer'])
            );
        })->name('volunteer');
        Route::get('/former_challenger', function (Request $request) {
            return app(App\Http\Controllers\Dashboard\MemberController::class)->index(
                $request->merge(['filter' => 'former_challenger'])
            );
        })->name('former_challenger');
        Route::get('/beneficiary', function (Request $request) {
            return app(App\Http\Controllers\Dashboard\MemberController::class)->index(
                $request->merge(['filter' => 'beneficiary'])
            );
        })->name('beneficiary');
        Route::get('/{memberType}/stats', 'typeStats')->name('type-stats');
        
        // Routes dynamiques APRÈS les routes statiques
        Route::get('/{member}', 'show')->name('show')->where('member', '[0-9]+');
        Route::put('/{member}', 'update')->name('update')->where('member', '[0-9]+');
        Route::delete('/{member}', 'destroy')->name('destroy')->where('member', '[0-9]+');
        Route::post('/{member}/toggle-active', 'toggleActive')->name('toggle-active')->where('member', '[0-9]+');
        Route::post('/{member}/engagement-points', 'addEngagementPoints')->name('engagement-points')->where('member', '[0-9]+');
    });

    Route::get('/events', function () {
        return app(App\Http\Controllers\Dashboard\EventController::class)->index();
    })->name('events');

    // Routes dashboard dons
    Route::controller(App\Http\Controllers\Dashboard\DonationCampaignController::class)->prefix('donations')->name('donations.')->group(function () {
        Route::get('/campaigns', 'index')->name('campaigns.index');
        Route::post('/campaigns', 'store')->name('campaigns.store');
        Route::get('/campaigns/export', 'export')->name('campaigns.export');
        Route::get('/campaigns/{campaign}', 'show')->name('campaigns.show');
        Route::put('/campaigns/{campaign}', 'update')->name('campaigns.update');
        Route::delete('/campaigns/{campaign}', 'destroy')->name('campaigns.destroy');
        Route::post('/campaigns/{campaign}/status', 'updateStatus')->name('campaigns.update-status');
        Route::post('/campaigns/{campaign}/update', 'addUpdate')->name('campaigns.add-update');
    });

    Route::controller(App\Http\Controllers\Dashboard\DonorController::class)->prefix('donations')->name('donations.')->group(function () {
        Route::get('/donors', 'index')->name('donors.index');
        Route::get('/donors/export', 'export')->name('donors.export');
        Route::get('/donors/{donor}', 'show')->name('donors.show');
        Route::post('/donors/{donor}/thank-you', 'sendThankYou')->name('donors.thank-you');
    });

    Route::get('/donations', [App\Http\Controllers\Dashboard\DonationCampaignController::class, 'summary'])->name('donations');

    Route::get('/communications', function () {
        return Inertia::render('dashboard/communications', [
            'user' => auth()->user()
        ]);
    })->name('communications');

    Route::get('/finances', [App\Http\Controllers\Dashboard\FinancesController::class, 'index'])->name('finances');
    Route::post('/finances/expenses', [App\Http\Controllers\Dashboard\FinancesController::class, 'storeExpense'])->name('finances.expenses.store');
    Route::put('/finances/expenses/{expense}', [App\Http\Controllers\Dashboard\FinancesController::class, 'updateExpense'])->name('finances.expenses.update');
    Route::delete('/finances/expenses/{expense}', [App\Http\Controllers\Dashboard\FinancesController::class, 'destroyExpense'])->name('finances.expenses.destroy');

    // Routes dashboard partenaires
    Route::controller(App\Http\Controllers\Dashboard\PartnerController::class)->prefix('partners')->name('partners.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{partner}', 'update')->name('update');
        Route::delete('/{partner}', 'destroy')->name('destroy');
        Route::post('/{partner}/activate', 'activate')->name('activate');
        Route::post('/{partner}/suspend', 'suspend')->name('suspend');
        Route::post('/{partner}/contact', 'updateContact')->name('contact.update');
        Route::post('/requests/{partnerRequest}/process', 'processRequest')->name('requests.process');
        Route::get('/export', 'export')->name('export');
    });

    // Routes dashboard événements
    Route::controller(App\Http\Controllers\Dashboard\EventController::class)->prefix('events')->name('events.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/tickets', 'tickets')->name('tickets');
        Route::post('/', 'store')->name('store');
        Route::get('/export', 'export')->name('export');
        Route::get('/{event}', 'show')->name('show');
        Route::put('/{event}', 'update')->name('update');
        Route::delete('/{event}', 'destroy')->name('destroy');
        Route::post('/{event}/toggle-status', 'toggleStatus')->name('toggle-status');
        Route::post('/{event}/checkin', 'checkinTicket')->name('checkin');
    });

    // Routes dashboard concours
    Route::controller(App\Http\Controllers\Dashboard\ContestController::class)->prefix('contests')->name('contests.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::get('/{contest}', 'show')->name('show');
        Route::put('/{contest}', 'update')->name('update');
        Route::delete('/{contest}', 'destroy')->name('destroy');
        Route::post('/{contest}/status', 'updateStatus')->name('update-status');
        Route::post('/{contest}/vote', 'processVote')->name('vote');
        Route::get('/{contest}/votes-analytics', 'votesAnalytics')->name('votes-analytics');
        Route::get('/export', 'export')->name('export');
    });

    // Confirmation des votes/dons en attente
    Route::get('/pending-payments', function () {
        $pendingVotes = \App\Models\Vote::where('payment_status', 'pending')
            ->with(['contest', 'user'])
            ->latest()
            ->get()
            ->map(fn ($v) => [
                'id'           => $v->id,
                'type'         => 'vote',
                'contest'      => $v->contest?->title,
                'user_name'    => $v->user?->name,
                'participant'  => $v->participant_name,
                'amount'       => number_format($v->amount_paid, 0, ',', ' ') . ' ' . $v->currency,
                'method'       => $v->payment_method,
                'ref'          => $v->transaction_id,
                'date'         => $v->created_at->toDateString(),
            ]);
        $pendingDonations = \App\Models\Donation::where('payment_status', 'pending')
            ->with('campaign')
            ->latest('donated_at')
            ->get()
            ->map(fn ($d) => [
                'id'        => $d->id,
                'type'      => 'donation',
                'campaign'  => $d->campaign?->title,
                'user_name' => $d->donor_name,
                'amount'    => $d->formatted_amount,
                'method'    => $d->payment_provider ?? $d->payment_method,
                'ref'       => $d->payment_reference,
                'date'      => $d->donated_at->toDateString(),
            ]);
        return Inertia::render('dashboard/pending-payments', [
            'user'             => auth()->user(),
            'pendingVotes'     => $pendingVotes,
            'pendingDonations' => $pendingDonations,
        ]);
    })->name('pending-payments');

    Route::post('/pending-payments/votes/{vote}/confirm', function (\App\Models\Vote $vote) {
        $vote->update(['payment_status' => 'paid', 'voted_at' => now()]);
        // Increment entry votes_count
        if ($vote->participant_id) {
            \App\Models\ContestEntry::where('id', $vote->participant_id)->increment('votes_count');
        }
        return back()->with('success', 'Vote confirmé.');
    })->name('pending-payments.votes.confirm');

    Route::post('/pending-payments/votes/{vote}/reject', function (\App\Models\Vote $vote) {
        $vote->update(['payment_status' => 'failed']);
        return back()->with('success', 'Vote rejeté.');
    })->name('pending-payments.votes.reject');

    Route::post('/pending-payments/donations/{donation}/confirm', function (\App\Models\Donation $donation) {
        $donation->markAsCompleted();
        return back()->with('success', 'Don confirmé.');
    })->name('pending-payments.donations.confirm');

    Route::post('/pending-payments/donations/{donation}/reject', function (\App\Models\Donation $donation) {
        $donation->update(['payment_status' => 'failed']);
        return back()->with('success', 'Don rejeté.');
    })->name('pending-payments.donations.reject');

    // Routes dashboard projets
    Route::controller(App\Http\Controllers\Dashboard\ProjectsController::class)->prefix('projects')->name('projects.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/{project}/approve', 'approve')->name('approve');
        Route::post('/{project}/reject', 'reject')->name('reject');
        Route::delete('/{project}', 'destroy')->name('destroy');
    });

    Route::get('/content', function () {
        return Inertia::render('dashboard/content', [
            'user' => auth()->user()
        ]);
    })->name('content');

    // Routes dashboard hero
    Route::controller(App\Http\Controllers\Dashboard\HeroSlideController::class)->prefix('hero')->name('hero.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{heroSlide}', 'update')->name('update');
        Route::delete('/{heroSlide}', 'destroy')->name('destroy');
    });

    // Routes dashboard témoignages
    Route::controller(App\Http\Controllers\Dashboard\TestimonialController::class)->prefix('testimonials')->name('testimonials.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{testimonial}', 'update')->name('update');
        Route::delete('/{testimonial}', 'destroy')->name('destroy');
    });

    Route::get('/analytics', [App\Http\Controllers\Dashboard\AnalyticsController::class, 'index'])->name('analytics');

    Route::get('/settings', function () {
        $settings = \App\Models\SiteSetting::all()->pluck('value', 'key')->toArray();
        return Inertia::render('dashboard/settings', [
            'user' => auth()->user(),
            'siteSettings' => $settings,
        ]);
    })->name('settings');

    Route::post('/settings', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'donation_mtn_number'    => 'nullable|string|max:30',
            'donation_orange_number' => 'nullable|string|max:30',
            'donation_contact_name'  => 'nullable|string|max:100',
            'org_phone'              => 'nullable|string|max:30',
            'org_email'              => 'nullable|email|max:100',
        ]);
        foreach ($data as $key => $value) {
            \App\Models\SiteSetting::set($key, $value);
        }
        return back()->with('success', 'Paramètres sauvegardés.');
    })->name('settings.save');

    // Contest entries management
    Route::get('/contests/{contest}/entries', function (\App\Models\Contest $contest) {
        $entries = $contest->entries()->with('user')->latest()->get()->map(fn ($e) => [
            'id'           => $e->id,
            'entry_number' => $e->entry_number,
            'title'        => $e->title,
            'description'  => $e->description,
            'status'       => $e->status,
            'status_label' => $e->status_label,
            'author_name'  => $e->user->name,
            'submitted_at' => $e->submitted_at?->toDateString(),
            'votes_count'  => $e->votes_count,
        ]);
        return Inertia::render('dashboard/contest-entries', [
            'user'    => auth()->user(),
            'contest' => ['id' => $contest->id, 'title' => $contest->title],
            'entries' => $entries,
        ]);
    })->name('contests.entries');

    Route::post('/contests/{contest}/entries/{entry}/approve', function (\App\Models\Contest $contest, \App\Models\ContestEntry $entry) {
        $entry->update(['status' => 'approved']);
        return back()->with('success', 'Projet approuvé.');
    })->name('contests.entries.approve');

    Route::post('/contests/{contest}/entries/{entry}/reject', function (\App\Models\Contest $contest, \App\Models\ContestEntry $entry) {
        $entry->update(['status' => 'rejected']);
        return back()->with('success', 'Projet rejeté.');
    })->name('contests.entries.reject');

    // Routes des sous-menus membres (redirections vers le contrôleur principal)
    Route::get('/members/adherents', function () {
        return redirect('/dashboard/members?filter=adherent');
    })->name('members.adherents');

    Route::get('/members/ambassadors', function () {
        return redirect('/dashboard/members?filter=ambassador');
    })->name('members.ambassadors');

    Route::get('/members/volunteers', function () {
        return redirect('/dashboard/members?filter=volunteer');
    })->name('members.volunteers');

    // Donations submenu routes (redirections vers les contrôleurs)
    Route::get('/donations/campaigns', function () {
        return app(App\Http\Controllers\Dashboard\DonationCampaignController::class)->index(request());
    })->name('donations.campaigns');

    Route::get('/donations/donors', function () {
        return app(App\Http\Controllers\Dashboard\DonorController::class)->index(request());
    })->name('donations.donors');

    // Communications submenu routes
    Route::get('/communications/newsletters', function () {
        return Inertia::render('dashboard/communications', [
            'user' => auth()->user(),
            'tab' => 'newsletters'
        ]);
    })->name('communications.newsletters');

    Route::get('/communications/social-media', function () {
        return Inertia::render('dashboard/communications', [
            'user' => auth()->user(),
            'tab' => 'social-media'
        ]);
    })->name('communications.social-media');

    // Finances submenu routes (same controller, tab handled on frontend)
    Route::get('/finances/transactions', [App\Http\Controllers\Dashboard\FinancesController::class, 'index'])->name('finances.transactions');
    Route::get('/finances/reports', [App\Http\Controllers\Dashboard\FinancesController::class, 'index'])->name('finances.reports');

    // Content submenu routes
    Route::get('/content/articles', function () {
        return Inertia::render('dashboard/content', [
            'user' => auth()->user(),
            'tab' => 'articles'
        ]);
    })->name('content.articles');

    Route::get('/content/media', function () {
        return Inertia::render('dashboard/content', [
            'user' => auth()->user(),
            'tab' => 'media'
        ]);
    })->name('content.media');

    // Settings submenu routes
    Route::get('/settings/general', function () {
        return Inertia::render('dashboard/settings', [
            'user' => auth()->user(),
            'tab' => 'general'
        ]);
    })->name('settings.general');

    Route::get('/settings/notifications', function () {
        return Inertia::render('dashboard/settings', [
            'user' => auth()->user(),
            'tab' => 'notifications'
        ]);
    })->name('settings.notifications');

    Route::get('/settings/security', function () {
        return Inertia::render('dashboard/settings', [
            'user' => auth()->user(),
            'tab' => 'security'
        ]);
    })->name('settings.security');
});

// Main dashboard route (admin only)
Route::get('/dashboard', [App\Http\Controllers\Dashboard\DashboardController::class, 'index'])
    ->middleware(['auth', 'admin'])->name('dashboard');

Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'show'])
    ->middleware(['auth'])->name('profile');

// Page démo des types de profil (non connecté uniquement)
Route::get('/profiles', function () {
    return Inertia::render('profile-demo', [
        'user' => auth()->user(),
        'type' => ''
    ]);
})->name('profiles');

// ── Legal pages ──────────────────────────────────────────────────────
Route::prefix('legal')->name('legal.')->group(function () {
    Route::get('/mentions',  fn() => Inertia::render('legal/mentions'))->name('mentions');
    Route::get('/cgu',       fn() => Inertia::render('legal/cgu'))->name('cgu');
    Route::get('/privacy',   fn() => Inertia::render('legal/privacy'))->name('privacy');
    Route::get('/cookies',   fn() => Inertia::render('legal/cookies'))->name('cookies');
    Route::get('/rgpd',      fn() => Inertia::render('legal/rgpd'))->name('rgpd');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
