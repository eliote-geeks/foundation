<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

// Routes pour les concours
Route::get('/contests', function () {
    return Inertia::render('contests/index');
})->name('contests.index');

Route::get('/contests/{id}', function ($id) {
    return Inertia::render('contests/show', [
        'contest' => null // À remplacer par les données du concours
    ]);
})->name('contests.show');

// Routes pour les événements (billetterie)
Route::get('/events', function () {
    return Inertia::render('events/index');
})->name('events.index');

// Routes pour les membres
Route::get('/members', function () {
    return Inertia::render('members/index');
})->name('members.index');

// Routes pour les programmes
Route::get('/programs', function () {
    return Inertia::render('programs/index');
})->name('programs.index');

// Routes pour les partenaires
Route::get('/partners', function () {
    return Inertia::render('partners/index');
})->name('partners.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
