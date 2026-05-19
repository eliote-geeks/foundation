<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('profile');

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profileData' => [
                'phone'         => $user->profile?->phone,
                'city'          => $user->profile?->city,
                'country'       => $user->profile?->country,
                'bio'           => $user->profile?->bio,
                'profession'    => $user->profile?->profession,
                'company'       => $user->profile?->company,
                'linkedin_url'  => $user->profile?->linkedin_url,
                'facebook_url'  => $user->profile?->facebook_url,
                'instagram_url' => $user->profile?->instagram_url,
                'twitter_url'   => $user->profile?->twitter_url,
                'avatar_path'   => $user->profile?->avatar_path,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'phone'         => ['nullable', 'string', 'max:30'],
            'city'          => ['nullable', 'string', 'max:100'],
            'country'       => ['nullable', 'string', 'max:100'],
            'bio'           => ['nullable', 'string', 'max:600'],
            'profession'    => ['nullable', 'string', 'max:100'],
            'company'       => ['nullable', 'string', 'max:150'],
            'linkedin_url'  => ['nullable', 'url', 'max:255'],
            'facebook_url'  => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'twitter_url'   => ['nullable', 'url', 'max:255'],
            'avatar'        => ['nullable', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        $emailChanged = $user->email !== $validated['email'];
        $nameParts = preg_split('/\s+/', trim($validated['name']), 2);

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->name  = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        // Avatar upload
        $avatarPath = $user->profile?->avatar_path;
        if ($request->hasFile('avatar')) {
            if ($avatarPath) {
                Storage::disk('public')->delete($avatarPath);
            }
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // Profile upsert
        $profileFields = [
            'first_name'    => $nameParts[0] ?? $validated['name'],
            'last_name'     => $nameParts[1] ?? '',
            'phone'         => $validated['phone'] ?? null,
            'city'          => $validated['city'] ?? null,
            'country'       => $validated['country'] ?? 'Cameroon',
            'bio'           => $validated['bio'] ?? null,
            'profession'    => $validated['profession'] ?? null,
            'company'       => $validated['company'] ?? null,
            'linkedin_url'  => $validated['linkedin_url'] ?? null,
            'facebook_url'  => $validated['facebook_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'twitter_url'   => $validated['twitter_url'] ?? null,
            'avatar_path'   => $avatarPath,
        ];

        if ($user->profile) {
            $user->profile->update($profileFields);
        } else {
            $user->profile()->create(array_merge($profileFields, ['member_type' => 'adherent']));
        }

        return to_route('profile.edit')->with('status', 'profile-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
