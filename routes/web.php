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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
