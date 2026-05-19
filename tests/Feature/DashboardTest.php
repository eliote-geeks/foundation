<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated admins can visit the dashboard', function () {
    $this->actingAs(User::factory()->create(['is_admin' => true]));

    $this->get('/dashboard')->assertOk();
});

test('non admin users can not visit the dashboard', function () {
    $this->actingAs(User::factory()->create(['is_admin' => false]));

    $this->get('/dashboard')->assertForbidden();
});
