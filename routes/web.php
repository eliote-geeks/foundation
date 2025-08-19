<?php

use Illuminate\Support\Facades\Route;
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

Route::get('/partners', function () {
    return Inertia::render('partners', [
        'user' => auth()->user()
    ]);
})->name('partners');

// Dashboard routes
Route::middleware(['auth'])->prefix('dashboard')->name('dashboard.')->group(function () {

    Route::get('/members', function () {
        return Inertia::render('dashboard/members', [
            'user' => auth()->user()
        ]);
    })->name('members');

    Route::get('/events', function () {
        return Inertia::render('dashboard/events', [
            'user' => auth()->user()
        ]);
    })->name('events');

    Route::get('/donations', function () {
        return Inertia::render('dashboard/donations', [
            'user' => auth()->user()
        ]);
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

    Route::get('/partners', function () {
        return Inertia::render('dashboard/partners', [
            'user' => auth()->user()
        ]);
    })->name('partners');

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

    // Member submenu routes
    Route::get('/members/adherents', function () {
        return Inertia::render('dashboard/members', [
            'user' => auth()->user(),
            'filter' => 'adherents'
        ]);
    })->name('members.adherents');

    Route::get('/members/ambassadors', function () {
        return Inertia::render('dashboard/members', [
            'user' => auth()->user(),
            'filter' => 'ambassadors'
        ]);
    })->name('members.ambassadors');

    Route::get('/members/volunteers', function () {
        return Inertia::render('dashboard/members', [
            'user' => auth()->user(),
            'filter' => 'volunteers'
        ]);
    })->name('members.volunteers');

    // Donations submenu routes
    Route::get('/donations/campaigns', function () {
        return Inertia::render('dashboard/donations', [
            'user' => auth()->user(),
            'tab' => 'campaigns'
        ]);
    })->name('donations.campaigns');

    Route::get('/donations/donors', function () {
        return Inertia::render('dashboard/donations', [
            'user' => auth()->user(),
            'tab' => 'donors'
        ]);
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
