<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\PartnerRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    /**
     * Afficher la page publique des partenaires
     */
    public function index(): Response
    {
        $partners = Partner::active()
            ->orderByDesc('is_featured')
            ->orderBy('priority', 'desc')
            ->orderBy('name')
            ->get()
            ->map(function ($partner) {
                return [
                    'id' => $partner->id,
                    'name' => $partner->name,
                    'logo' => $partner->logo ?: $this->getDefaultLogo($partner->category),
                    'description' => $partner->description,
                    'website' => $partner->website,
                    'category' => $partner->category,
                    'partnership' => $partner->partnership_type,
                    'since' => $partner->partnership_start_date?->year ?? date('Y'),
                    'color' => $partner->category_color
                ];
            });

        $stats = [
            'total_partners' => Partner::active()->count(),
            'categories_count' => Partner::active()->distinct('category')->count('category'),
            'years_experience' => now()->year - (Partner::active()->whereNotNull('partnership_start_date')->orderBy('partnership_start_date')->first()?->partnership_start_date?->year ?? now()->year),
            'total_contribution' => Partner::active()->sum('contribution_amount')
        ];

        return Inertia::render('partners', [
            'partners' => $partners,
            'stats' => $stats
        ]);
    }

    /**
     * Soumettre une demande de partenariat
     */
    public function submitRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'companyName' => 'required|string|max:255',
            'contactName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|url|max:255',
            'category' => 'required|string|in:Technologie,Finance,Éducation,Télécommunications,Énergie,Agroalimentaire,Transport,Autre',
            'partnershipType' => 'required|string|in:Financier,Technique,Académique,Environnemental,Social,Innovation',
            'description' => 'required|string|min:50',
            'budget' => 'nullable|string|in:< 1M FCFA,1-5M FCFA,5-10M FCFA,10-50M FCFA,> 50M FCFA'
        ]);

        $partnerRequest = PartnerRequest::create([
            'company_name' => $validated['companyName'],
            'contact_name' => $validated['contactName'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'website' => $validated['website'],
            'category' => $validated['category'],
            'partnership_type' => $validated['partnershipType'],
            'description' => $validated['description'],
            'budget_range' => $validated['budget'],
        ]);

        // Ici vous pourriez ajouter une notification email aux administrateurs
        // Mail::to(config('mail.admin_email'))->send(new NewPartnerRequestMail($partnerRequest));

        return response()->json([
            'message' => 'Votre demande de partenariat a été envoyée avec succès !',
            'request_id' => $partnerRequest->id
        ]);
    }

    /**
     * API pour récupérer les partenaires (utilisé par le dashboard)
     */
    public function apiIndex(Request $request): JsonResponse
    {
        $query = Partner::query();

        // Filtres
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        if ($request->filled('partnership_type')) {
            $query->byPartnershipType($request->partnership_type);
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('contact_person', 'LIKE', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $partners = $query->paginate($request->get('per_page', 15));

        return response()->json($partners);
    }

    /**
     * Afficher un partenaire spécifique
     */
    public function show(Partner $partner): JsonResponse
    {
        return response()->json([
            'partner' => $partner,
            'formatted_contribution' => $partner->formatted_contribution,
            'partnership_duration' => $partner->partnership_duration,
            'status_badge' => $partner->status_badge,
            'category_color' => $partner->category_color
        ]);
    }

    /**
     * Obtenir les statistiques des partenaires
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Partner::count(),
            'active' => Partner::where('status', 'active')->count(),
            'pending' => Partner::where('status', 'pending')->count(),
            'suspended' => Partner::where('status', 'suspended')->count(),
            'by_category' => Partner::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category'),
            'by_partnership_type' => Partner::selectRaw('partnership_type, COUNT(*) as count')
                ->groupBy('partnership_type')
                ->pluck('count', 'partnership_type'),
            'total_contribution' => Partner::sum('contribution_amount'),
            'average_partnership_duration' => Partner::whereNotNull('partnership_start_date')
                ->get()
                ->avg(function ($partner) {
                    return $partner->partnership_start_date->diffInMonths(
                        $partner->partnership_end_date ?? now()
                    );
                }),
            'recent_partners' => Partner::latest()
                ->limit(5)
                ->get(['id', 'name', 'status', 'created_at'])
        ];

        return response()->json($stats);
    }

    /**
     * Obtenir le logo par défaut selon la catégorie
     */
    private function getDefaultLogo(string $category): string
    {
        return match($category) {
            'Technologie' => '💻',
            'Finance' => '🏦',
            'Éducation' => '🎓',
            'Télécommunications' => '📱',
            'Énergie' => '⚡',
            'Agroalimentaire' => '🌾',
            'Transport' => '🚛',
            default => '🤝'
        };
    }
}