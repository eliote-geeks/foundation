<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\MemberActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Enregistrer l'activité de connexion
        MemberActivity::create([
            'user_id' => $user->id,
            'activity_type' => 'login',
            'activity_title' => 'Connexion utilisateur',
            'activity_data' => [
                'login_time' => now()->toISOString(),
                'device_type' => $this->getDeviceType($request),
                'browser' => $this->getBrowser($request)
            ],
            'points_earned' => 5,
            'source' => 'web',
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        // Mettre à jour la dernière activité du profil
        if ($user->profile) {
            $user->profile->update(['last_activity_at' => now()]);
        }

        // Redirection basée sur le profil utilisateur
        $redirectRoute = $this->getRedirectRoute($user);

        return redirect()->intended(route($redirectRoute, absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Déterminer la route de redirection après connexion.
     */
    private function getRedirectRoute($user): string
    {
        // Si l'utilisateur n'a pas de profil, rediriger vers la création de profil
        if (!$user->hasProfile()) {
            return 'profile.edit';
        }

        // Redirection basée sur le type de membre
        return match($user->member_type) {
            'partner' => 'partners',
            'ambassador' => 'home', // Tableau de bord ambassadeur à créer
            'former_challenger' => 'home',
            default => 'home'
        };
    }

    /**
     * Détecter le type d'appareil.
     */
    private function getDeviceType(Request $request): string
    {
        $userAgent = $request->header('User-Agent', '');
        
        if (preg_match('/Mobile|Android|iPhone|iPad/', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/Tablet/', $userAgent)) {
            return 'tablet';
        }
        
        return 'desktop';
    }

    /**
     * Détecter le navigateur.
     */
    private function getBrowser(Request $request): string
    {
        $userAgent = $request->header('User-Agent', '');
        
        if (preg_match('/Chrome/i', $userAgent)) {
            return 'Chrome';
        } elseif (preg_match('/Firefox/i', $userAgent)) {
            return 'Firefox';
        } elseif (preg_match('/Safari/i', $userAgent)) {
            return 'Safari';
        } elseif (preg_match('/Edge/i', $userAgent)) {
            return 'Edge';
        }
        
        return 'Other';
    }
}
