<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\MemberActivity;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    /**
     * Vue d'ensemble des membres
     */
    public function index(Request $request): Response
    {
        $memberType = $request->get('filter', 'all');
        
        // Statistiques générales
        $stats = [
            [
                'title' => 'Total Membres',
                'value' => UserProfile::count(),
                'change' => '+' . UserProfile::whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-people-fill'
            ],
            [
                'title' => 'Adhérents',
                'value' => UserProfile::byMemberType('adherent')->count(),
                'change' => '+' . UserProfile::byMemberType('adherent')->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#4A8A2A',
                'icon' => 'bi-person-check'
            ],
            [
                'title' => 'Ambassadeurs',
                'value' => UserProfile::byMemberType('ambassador')->count(),
                'change' => '+' . UserProfile::byMemberType('ambassador')->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-star'
            ],
            [
                'title' => 'Bénévoles',
                'value' => UserProfile::byMemberType('volunteer')->count(),
                'change' => '+' . UserProfile::byMemberType('volunteer')->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-hand-thumbs-up'
            ]
        ];

        // Requête des membres avec filtres
        $membersQuery = UserProfile::with(['user', 'activities'])
            ->active()
            ->latest();

        if ($memberType !== 'all') {
            $membersQuery->byMemberType($memberType);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $membersQuery->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            })->orWhere('first_name', 'LIKE', "%{$search}%")
              ->orWhere('last_name', 'LIKE', "%{$search}%");
        }

        $members = $membersQuery->paginate(15)->through(function ($profile) {
            return [
                'id' => $profile->id,
                'user_id' => $profile->user_id,
                'name' => $profile->full_name,
                'email' => $profile->user->email,
                'member_type' => $profile->member_type,
                'member_type_display' => $profile->member_type_display,
                'city' => $profile->city,
                'country' => $profile->country,
                'engagement_score' => $profile->engagement_score,
                'engagement_level' => $profile->engagement_level,
                'last_activity' => $profile->last_activity_at?->diffForHumans(),
                'joined_at' => $profile->joined_at?->format('d/m/Y'),
                'avatar' => $profile->avatar_path,
                'is_active' => $profile->is_active,
                'skills_count' => count($profile->skills ?? []),
                'interests_count' => count($profile->interests ?? []),
                'activities_count' => $profile->activities()->count()
            ];
        });

        // Données pour les graphiques
        $engagementByType = UserProfile::selectRaw('member_type, AVG(engagement_score) as avg_score, COUNT(*) as count')
            ->groupBy('member_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->member_type => [
                    'avg_score' => round($item->avg_score),
                    'count' => $item->count
                ]];
            });

        $recentActivities = MemberActivity::with(['user.profile'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'member_name' => $activity->user->profile->full_name ?? $activity->user->name,
                    'member_type' => $activity->user->profile->member_type ?? 'adherent',
                    'activity_type' => $activity->activity_type,
                    'activity_title' => $activity->activity_title,
                    'points_earned' => $activity->points_earned,
                    'created_at' => $activity->created_at->diffForHumans()
                ];
            });

        return Inertia::render('Dashboard/Members', [
            'stats' => $stats,
            'members' => $members,
            'memberType' => $memberType,
            'engagementData' => $engagementByType,
            'recentActivities' => $recentActivities,
            'filters' => $request->only(['search', 'filter'])
        ]);
    }

    /**
     * Afficher un membre spécifique
     */
    public function show(UserProfile $member): Response
    {
        $member->load(['user', 'activities' => function ($q) {
            $q->latest()->limit(10);
        }]);

        $memberData = [
            'id' => $member->id,
            'user_id' => $member->user_id,
            'full_name' => $member->full_name,
            'email' => $member->user->email,
            'phone' => $member->phone,
            'member_type' => $member->member_type,
            'member_type_display' => $member->member_type_display,
            'birth_date' => $member->birth_date?->format('d/m/Y'),
            'age' => $member->age,
            'gender' => $member->gender,
            'address' => $member->address,
            'city' => $member->city,
            'country' => $member->country,
            'profession' => $member->profession,
            'company' => $member->company,
            'bio' => $member->bio,
            'interests' => $member->interests ?? [],
            'skills' => $member->skills ?? [],
            'engagement_score' => $member->engagement_score,
            'engagement_level' => $member->engagement_level,
            'joined_at' => $member->joined_at?->format('d/m/Y'),
            'last_activity_at' => $member->last_activity_at?->format('d/m/Y H:i'),
            'avatar_path' => $member->avatar_path,
            'social_links' => [
                'linkedin' => $member->linkedin_url,
                'facebook' => $member->facebook_url,
                'instagram' => $member->instagram_url,
                'twitter' => $member->twitter_url,
            ],
            'notification_preferences' => $member->notification_preferences ?? [],
            'type_specific_data' => $member->type_specific_data ?? [],
            'activities' => $member->activities->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->activity_type,
                    'title' => $activity->activity_title,
                    'points' => $activity->points_earned,
                    'date' => $activity->created_at->format('d/m/Y H:i')
                ];
            })
        ];

        return Inertia::render('Dashboard/MemberDetail', [
            'member' => $memberData
        ]);
    }

    /**
     * Créer un nouveau membre
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'member_type' => 'required|in:adherent,ambassador,volunteer,former_challenger,partner,beneficiary',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'city' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'profession' => 'nullable|string|max:255',
            'interests' => 'nullable|array',
            'skills' => 'nullable|array'
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt('temporary123'), // Mot de passe temporaire
        ]);

        // Créer le profil
        $profile = $user->profile()->create([
            'member_type' => $validated['member_type'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'city' => $validated['city'],
            'country' => $validated['country'],
            'profession' => $validated['profession'],
            'interests' => $validated['interests'] ?? [],
            'skills' => $validated['skills'] ?? [],
            'joined_at' => now(),
            'is_active' => true,
            'engagement_score' => 0
        ]);

        // Ajouter une activité initiale
        $profile->addActivity(
            'registration',
            'Inscription à la fondation',
            ['channel' => 'dashboard'],
            50
        );

        return redirect()->back()->with('success', "Membre {$profile->full_name} créé avec succès !");
    }

    /**
     * Mettre à jour un membre
     */
    public function update(Request $request, UserProfile $member): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'member_type' => 'required|in:adherent,ambassador,volunteer,former_challenger,partner,beneficiary',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
            'profession' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'interests' => 'nullable|array',
            'skills' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $member->update($validated);

        return redirect()->back()->with('success', "Membre {$member->full_name} mis à jour avec succès !");
    }

    /**
     * Supprimer un membre
     */
    public function destroy(UserProfile $member): RedirectResponse
    {
        $name = $member->full_name;
        
        // Supprimer l'utilisateur associé (cascade sur le profil)
        $member->user->delete();

        return redirect()->back()->with('success', "Membre {$name} supprimé avec succès !");
    }

    /**
     * Activer/désactiver un membre
     */
    public function toggleActive(UserProfile $member): JsonResponse
    {
        $member->update(['is_active' => !$member->is_active]);

        return response()->json([
            'message' => $member->is_active ? 'Membre activé !' : 'Membre désactivé !',
            'is_active' => $member->is_active
        ]);
    }

    /**
     * Ajouter des points d'engagement
     */
    public function addEngagementPoints(Request $request, UserProfile $member): JsonResponse
    {
        $validated = $request->validate([
            'points' => 'required|integer|min:1|max:1000',
            'activity_title' => 'required|string|max:255',
            'activity_type' => 'required|string|max:100'
        ]);

        $member->addActivity(
            $validated['activity_type'],
            $validated['activity_title'],
            ['added_by' => auth()->id()],
            $validated['points']
        );

        return response()->json([
            'message' => "{$validated['points']} points ajoutés !",
            'new_score' => $member->fresh()->engagement_score
        ]);
    }

    /**
     * Export des membres
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $memberType = $request->get('type', 'all');
        
        $query = UserProfile::with('user');
        
        if ($memberType !== 'all') {
            $query->byMemberType($memberType);
        }
        
        $members = $query->get();
        
        $fileName = 'membres_' . ($memberType === 'all' ? 'tous' : $memberType) . '_' . now()->format('Y-m-d_H-i') . '.csv';
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($members) {
            $handle = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($handle, [
                'ID', 'Nom complet', 'Email', 'Type de membre', 'Téléphone', 'Ville', 'Pays',
                'Profession', 'Score engagement', 'Date inscription', 'Dernière activité', 'Statut'
            ]);

            // Données
            foreach ($members as $member) {
                fputcsv($handle, [
                    $member->id,
                    $member->full_name,
                    $member->user->email,
                    $member->member_type_display,
                    $member->phone,
                    $member->city,
                    $member->country,
                    $member->profession,
                    $member->engagement_score,
                    $member->joined_at?->format('d/m/Y'),
                    $member->last_activity_at?->format('d/m/Y H:i'),
                    $member->is_active ? 'Actif' : 'Inactif'
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Statistiques avancées pour un type de membre
     */
    public function typeStats(string $memberType): JsonResponse
    {
        $members = UserProfile::byMemberType($memberType)->get();
        
        $stats = [
            'total' => $members->count(),
            'active' => $members->where('is_active', true)->count(),
            'avg_engagement' => round($members->avg('engagement_score')),
            'top_skills' => $this->getTopSkills($members, 5),
            'top_interests' => $this->getTopInterests($members, 5),
            'age_distribution' => $this->getAgeDistribution($members),
            'city_distribution' => $members->groupBy('city')->map->count()->sortDesc()->take(10),
            'recent_joins' => $members->where('joined_at', '>=', now()->subMonth())->count()
        ];

        return response()->json($stats);
    }

    /**
     * Obtenir les compétences les plus populaires
     */
    private function getTopSkills($members, int $limit = 10): array
    {
        $skillCounts = [];
        
        foreach ($members as $member) {
            foreach ($member->skills ?? [] as $skill) {
                $skillCounts[$skill] = ($skillCounts[$skill] ?? 0) + 1;
            }
        }
        
        arsort($skillCounts);
        
        return array_slice($skillCounts, 0, $limit, true);
    }

    /**
     * Obtenir les centres d'intérêt les plus populaires
     */
    private function getTopInterests($members, int $limit = 10): array
    {
        $interestCounts = [];
        
        foreach ($members as $member) {
            foreach ($member->interests ?? [] as $interest) {
                $interestCounts[$interest] = ($interestCounts[$interest] ?? 0) + 1;
            }
        }
        
        arsort($interestCounts);
        
        return array_slice($interestCounts, 0, $limit, true);
    }

    /**
     * Obtenir la distribution par âge
     */
    private function getAgeDistribution($members): array
    {
        $distribution = [
            '18-25' => 0,
            '26-35' => 0,
            '36-45' => 0,
            '46-55' => 0,
            '56+' => 0
        ];
        
        foreach ($members as $member) {
            if (!$member->age) continue;
            
            $age = $member->age;
            if ($age <= 25) $distribution['18-25']++;
            elseif ($age <= 35) $distribution['26-35']++;
            elseif ($age <= 45) $distribution['36-45']++;
            elseif ($age <= 55) $distribution['46-55']++;
            else $distribution['56+']++;
        }
        
        return $distribution;
    }

    /**
     * Page Analytics des membres
     */
    public function analytics(): Response
    {
        // Statistiques générales
        $totalMembers = UserProfile::count();
        $activeMembers = UserProfile::active()->count();
        $thisMonthMembers = UserProfile::whereDate('created_at', '>=', now()->subMonth())->count();
        
        // Répartition par type
        $membersByType = UserProfile::selectRaw('member_type, COUNT(*) as count')
            ->groupBy('member_type')
            ->get()
            ->mapWithKeys(function ($item) {
                $typeLabels = [
                    'adherent' => 'Adhérents',
                    'ambassador' => 'Ambassadeurs',
                    'volunteer' => 'Bénévoles',
                    'former_challenger' => 'Anciens Challengers',
                    'partner' => 'Partenaires',
                    'beneficiary' => 'Bénéficiaires'
                ];
                
                return [$typeLabels[$item->member_type] ?? $item->member_type => $item->count];
            });

        // Répartition par engagement
        $engagementDistribution = [
            'Très élevé (1000+)' => UserProfile::where('engagement_score', '>=', 1000)->count(),
            'Élevé (500-999)' => UserProfile::whereBetween('engagement_score', [500, 999])->count(),
            'Moyen (200-499)' => UserProfile::whereBetween('engagement_score', [200, 499])->count(),
            'Faible (50-199)' => UserProfile::whereBetween('engagement_score', [50, 199])->count(),
            'Très faible (0-49)' => UserProfile::where('engagement_score', '<', 50)->count(),
        ];

        // Répartition géographique
        $geoDistribution = UserProfile::selectRaw('city, COUNT(*) as count')
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->city => $item->count];
            });

        // Évolution mensuelle des inscriptions
        $monthlyGrowth = UserProfile::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                    'count' => $item->count
                ];
            });

        // Top activités récentes
        $recentActivities = MemberActivity::with(['user.profile'])
            ->select('activity_type', \DB::raw('COUNT(*) as count'), \DB::raw('SUM(points_earned) as total_points'))
            ->where('created_at', '>=', now()->subMonth())
            ->groupBy('activity_type')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($activity) {
                $typeLabels = [
                    'profile_update' => 'Mise à jour profil',
                    'event_attendance' => 'Participation événement',
                    'volunteer_work' => 'Travail bénévole',
                    'referral' => 'Parrainage',
                    'training_completion' => 'Formation complétée',
                    'partnership_activity' => 'Activité partenariat'
                ];
                
                return [
                    'type' => $typeLabels[$activity->activity_type] ?? $activity->activity_type,
                    'count' => $activity->count,
                    'total_points' => $activity->total_points
                ];
            });

        // Moyennes d'engagement par type
        $avgEngagementByType = UserProfile::selectRaw('member_type, AVG(engagement_score) as avg_score')
            ->groupBy('member_type')
            ->get()
            ->mapWithKeys(function ($item) {
                $typeLabels = [
                    'adherent' => 'Adhérents',
                    'ambassador' => 'Ambassadeurs', 
                    'volunteer' => 'Bénévoles',
                    'former_challenger' => 'Anciens Challengers',
                    'partner' => 'Partenaires',
                    'beneficiary' => 'Bénéficiaires'
                ];
                
                return [$typeLabels[$item->member_type] ?? $item->member_type => round($item->avg_score)];
            });

        // Top membres par engagement
        $topMembers = UserProfile::with('user')
            ->orderByDesc('engagement_score')
            ->limit(10)
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'name' => $profile->full_name,
                    'member_type' => $profile->member_type_display,
                    'engagement_score' => $profile->engagement_score,
                    'city' => $profile->city,
                    'joined_at' => $profile->joined_at?->format('d/m/Y')
                ];
            });

        return Inertia::render('Dashboard/MembersAnalytics', [
            'totalMembers' => $totalMembers,
            'activeMembers' => $activeMembers,
            'thisMonthMembers' => $thisMonthMembers,
            'membersByType' => $membersByType,
            'engagementDistribution' => $engagementDistribution,
            'geoDistribution' => $geoDistribution,
            'monthlyGrowth' => $monthlyGrowth,
            'recentActivities' => $recentActivities,
            'avgEngagementByType' => $avgEngagementByType,
            'topMembers' => $topMembers
        ]);
    }
}