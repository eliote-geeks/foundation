<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home', [
        'user' => auth()->user()
    ]);
})->name('home');

Route::get('/contests', function () {
    return Inertia::render('contests', [
        'user' => auth()->user()
    ]);
})->name('contests');

Route::get('/tickets', function () {
    return Inertia::render('tickets', [
        'user' => auth()->user()
    ]);
})->name('tickets');

// Routes partenaires
Route::controller(App\Http\Controllers\PartnerController::class)->group(function () {
    Route::get('/partners', 'index')->name('partners');
    Route::post('/partners/request', 'submitRequest')->name('partners.request');
    Route::get('/api/partners', 'apiIndex')->name('api.partners.index');
    Route::get('/api/partners/stats', 'stats')->name('api.partners.stats');
    Route::get('/api/partners/{partner}', 'show')->name('api.partners.show');
});

// Dashboard routes
Route::middleware(['auth'])->prefix('dashboard')->name('dashboard.')->group(function () {

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

    Route::get('/donations', function () {
        return app(App\Http\Controllers\Dashboard\DonationCampaignController::class)->index(request());
    })->name('donations');

    Route::get('/projects', function () {
        return Inertia::render('dashboard/projects', [
            'user' => auth()->user()
        ]);
    })->name('projects');

    Route::get('/communications', function () {
        return Inertia::render('dashboard/communications', [
            'user' => auth()->user()
        ]);
    })->name('communications');

    Route::get('/finances', function () {
        return Inertia::render('dashboard/finances', [
            'user' => auth()->user()
        ]);
    })->name('finances');

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

    // Route principale pour les concours
    Route::get('/contests', [App\Http\Controllers\Dashboard\ContestController::class, 'index'])->name('contests');

    Route::get('/content', function () {
        return Inertia::render('dashboard/content', [
            'user' => auth()->user()
        ]);
    })->name('content');

    Route::get('/analytics', function () {
        return Inertia::render('dashboard/analytics', [
            'user' => auth()->user()
        ]);
    })->name('analytics');

    Route::get('/settings', function () {
        return Inertia::render('dashboard/settings', [
            'user' => auth()->user()
        ]);
    })->name('settings');

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

    // Projects submenu routes
    Route::get('/projects/active', function () {
        return Inertia::render('dashboard/projects', [
            'user' => auth()->user(),
            'filter' => 'active'
        ]);
    })->name('projects.active');

    Route::get('/projects/completed', function () {
        return Inertia::render('dashboard/projects', [
            'user' => auth()->user(),
            'filter' => 'completed'
        ]);
    })->name('projects.completed');

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

    // Finances submenu routes
    Route::get('/finances/budget', function () {
        return Inertia::render('dashboard/finances', [
            'user' => auth()->user(),
            'tab' => 'budget'
        ]);
    })->name('finances.budget');

    Route::get('/finances/transactions', function () {
        return Inertia::render('dashboard/finances', [
            'user' => auth()->user(),
            'tab' => 'transactions'
        ]);
    })->name('finances.transactions');

    Route::get('/finances/reports', function () {
        return Inertia::render('dashboard/finances', [
            'user' => auth()->user(),
            'tab' => 'reports'
        ]);
    })->name('finances.reports');

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

// Main dashboard route (without trailing slash)
Route::get('/dashboard', function () {
    return Inertia::render('dashboard-new', [
        'user' => auth()->user()
    ]);
})->middleware(['auth'])->name('dashboard');

Route::get('/profile', function () {
    return Inertia::render('profile', [
        'user' => auth()->user()
    ]);
})->name('profile');

Route::get('/profile/{type}', function ($type) {
    return Inertia::render('profile-demo', [
        'user' => auth()->user(),
        'type' => $type
    ]);
})->name('profile.type');

Route::get('/profiles', function () {
    return Inertia::render('profile-demo', [
        'user' => auth()->user()
    ]);
})->name('profiles');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
