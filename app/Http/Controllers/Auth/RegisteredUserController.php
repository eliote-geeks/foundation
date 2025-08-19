<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\MemberActivity;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'memberTypes' => $this->getMemberTypes(),
            'availableInterests' => $this->getAvailableInterests(),
            'availableSkills' => $this->getAvailableSkills(),
            'countries' => $this->getCountries()
        ]);
    }

    /**
     * Show the simple registration page with member type selection.
     */
    public function createSimple(): Response
    {
        return Inertia::render('auth/simple-register', [
            'memberTypes' => $this->getMemberTypes()
        ]);
    }

    /**
     * Show the member registration page with full profile creation.
     */
    public function createMember(): Response
    {
        return Inertia::render('auth/member-register', [
            'memberTypes' => $this->getMemberTypes(),
            'availableInterests' => $this->getAvailableInterests(),
            'availableSkills' => $this->getAvailableSkills(),
            'countries' => $this->getCountries()
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            
            // Champs optionnels pour l'inscription rapide
            'member_type' => 'sometimes|string|in:adherent,ambassador,former_challenger,partner,volunteer,beneficiary',
            'phone' => 'sometimes|string|max:20',
            'city' => 'sometimes|string|max:255',
            'accepts_newsletter' => 'sometimes|boolean',
        ]);

        DB::beginTransaction();
        
        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Créer le profil de base si des données supplémentaires sont fournies
            if (isset($validated['member_type']) || isset($validated['phone'])) {
                $this->createBasicProfile($user, $validated);
            }

            // Enregistrer l'activité d'inscription
            MemberActivity::create([
                'user_id' => $user->id,
                'activity_type' => 'profile_update',
                'activity_title' => 'Inscription utilisateur',
                'activity_data' => [
                    'registration_type' => 'basic',
                    'member_type' => $validated['member_type'] ?? 'adherent'
                ],
                'points_earned' => 20,
                'source' => 'web',
                'ip_address' => $request->ip(),
            ]);

            event(new Registered($user));
            Auth::login($user);
            
            DB::commit();

            return redirect()->intended(route('home', absolute: false));
            
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Handle member registration with full profile.
     */
    public function storeMember(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Compte utilisateur
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            
            // Profil membre
            'member_type' => 'required|string|in:adherent,ambassador,former_challenger,partner,volunteer,beneficiary',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date|before:today',
            'gender' => 'nullable|string|in:male,female,other,prefer_not_to_say',
            
            // Localisation
            'address' => 'nullable|string|max:500',
            'city' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'required|string|max:100',
            
            // Professionnel
            'profession' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            
            // Préférences
            'interests' => 'nullable|array',
            'interests.*' => 'string|max:100',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:100',
            'preferred_language' => 'required|string|in:fr,en',
            
            // Communication
            'accepts_newsletter' => 'boolean',
            'accepts_sms' => 'boolean',
            'accepts_phone_calls' => 'boolean',
            
            // Réseaux sociaux
            'linkedin_url' => 'nullable|url|max:255',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            
            // Données spécifiques par type
            'type_specific_data' => 'nullable|array',
        ]);

        DB::beginTransaction();
        
        try {
            // Créer l'utilisateur
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Créer le profil complet
            $profileData = array_merge($validated, [
                'user_id' => $user->id,
                'joined_at' => now()->toDateString(),
                'engagement_score' => 50, // Bonus d'inscription complète
                'last_activity_at' => now(),
            ]);
            
            unset($profileData['email'], $profileData['password'], $profileData['password_confirmation']);
            
            $user->profile()->create($profileData);

            // Enregistrer l'activité d'inscription
            MemberActivity::create([
                'user_id' => $user->id,
                'activity_type' => 'profile_update',
                'activity_title' => 'Inscription membre complète',
                'activity_data' => [
                    'registration_type' => 'complete',
                    'member_type' => $validated['member_type'],
                    'profile_completion' => 100
                ],
                'points_earned' => 50,
                'source' => 'web',
                'ip_address' => $request->ip(),
            ]);

            event(new Registered($user));
            Auth::login($user);
            
            DB::commit();

            return redirect()->route('home')->with('success', 
                'Votre inscription a été complétée avec succès ! Bienvenue dans la communauté de la Fondation Titi.'
            );
            
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Créer un profil de base lors de l'inscription rapide.
     */
    private function createBasicProfile(User $user, array $data): UserProfile
    {
        return $user->profile()->create([
            'member_type' => $data['member_type'] ?? 'adherent',
            'first_name' => explode(' ', $user->name)[0] ?? $user->name,
            'last_name' => explode(' ', $user->name)[1] ?? '',
            'phone' => $data['phone'] ?? null,
            'city' => $data['city'] ?? 'Non renseigné',
            'country' => 'Cameroon',
            'preferred_language' => 'fr',
            'accepts_newsletter' => $data['accepts_newsletter'] ?? true,
            'accepts_sms' => false,
            'accepts_phone_calls' => false,
            'joined_at' => now()->toDateString(),
            'engagement_score' => 20,
            'last_activity_at' => now(),
        ]);
    }

    /**
     * Obtenir les types de membres disponibles.
     */
    private function getMemberTypes(): array
    {
        return [
            'adherent' => [
                'label' => 'Adhérent Fondation',
                'description' => 'Membre standard soutenant les missions de la fondation',
                'icon' => '👤',
                'color' => 'blue'
            ],
            'ambassador' => [
                'label' => 'Ambassadeur',
                'description' => 'Porte-parole et représentant de la fondation',
                'icon' => '🌟',
                'color' => 'gold'
            ],
            'former_challenger' => [
                'label' => 'Ancien Challenger',
                'description' => 'Ancien participant aux défis et programmes',
                'icon' => '🏆',
                'color' => 'green'
            ],
            'partner' => [
                'label' => 'Partenaire',
                'description' => 'Organisation ou entreprise partenaire',
                'icon' => '🤝',
                'color' => 'purple'
            ],
            'volunteer' => [
                'label' => 'Bénévole',
                'description' => 'Volontaire actif dans les projets',
                'icon' => '❤️',
                'color' => 'red'
            ],
            'beneficiary' => [
                'label' => 'Bénéficiaire',
                'description' => 'Personne bénéficiant des programmes',
                'icon' => '🎯',
                'color' => 'cyan'
            ]
        ];
    }

    /**
     * Obtenir les intérêts disponibles.
     */
    private function getAvailableInterests(): array
    {
        return [
            'Education', 'Santé', 'Environnement', 'Entrepreneuriat',
            'Technologies', 'Arts & Culture', 'Sport', 'Agriculture',
            'Développement communautaire', 'Formation professionnelle',
            'Microfinance', 'Droits humains', 'Genre et égalité',
            'Jeunesse', 'Femmes', 'Enfants', 'Personnes âgées'
        ];
    }

    /**
     * Obtenir les compétences disponibles.
     */
    private function getAvailableSkills(): array
    {
        return [
            'Communication', 'Marketing', 'Gestion de projet', 'Finance',
            'Informatique', 'Design', 'Rédaction', 'Traduction',
            'Formation', 'Conseil', 'Événementiel', 'Fundraising',
            'Comptabilité', 'Juridique', 'Photographie', 'Vidéo',
            'Réseaux sociaux', 'Développement web', 'Agriculture',
            'Santé', 'Education', 'Artisanat'
        ];
    }

    /**
     * Obtenir la liste des pays.
     */
    private function getCountries(): array
    {
        return [
            'Cameroon' => 'Cameroun',
            'France' => 'France',
            'Chad' => 'Tchad',
            'Central African Republic' => 'République Centrafricaine',
            'Equatorial Guinea' => 'Guinée Équatoriale',
            'Gabon' => 'Gabon',
            'Nigeria' => 'Nigeria',
            'Congo' => 'Congo',
            'Democratic Republic of Congo' => 'République Démocratique du Congo',
            'Belgium' => 'Belgique',
            'Canada' => 'Canada',
            'United States' => 'États-Unis',
            'Other' => 'Autre'
        ];
    }
}
