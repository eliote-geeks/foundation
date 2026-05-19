<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
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
     * Dashboard des partenaires
     */
    public function index(): Response
    {
        $stats = [
            [
                'title' => 'Partenaires actifs',
                'value' => Partner::active()->count(),
                'change' => '+' . Partner::active()->whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-building-check'
            ],
            [
                'title' => 'Demandes en attente',
                'value' => PartnerRequest::pending()->count(),
                'change' => '+' . PartnerRequest::pending()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-clock-history'
            ],
            [
                'title' => 'Collaborations actives',
                'value' => Partner::active()->where('status', 'active')->count(),
                'change' => '+12%',
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-handshake'
            ],
            [
                'title' => 'Contributions totales',
                'value' => number_format(Partner::sum('contribution_amount'), 0, ',', '.') . ' FCFA',
                'change' => '+18%',
                'positive' => true,
                'color' => '#4D8A3C',
                'icon' => 'bi-graph-up'
            ]
        ];

        $partners = Partner::latest()
            ->take(10)
            ->get()
            ->map(function ($partner) {
                return [
                    'id' => $partner->id,
                    'name' => $partner->name,
                    'category' => $partner->category,
                    'partnership_type' => $partner->partnership_type,
                    'status' => $partner->status,
                    'status_badge' => $partner->status_badge,
                    'contribution' => $partner->formatted_contribution,
                    'contact_person' => $partner->contact_person,
                    'since' => $partner->partnership_start_date?->format('d/m/Y') ?? 'Non définie',
                    'last_contact' => $partner->last_contact_date?->diffForHumans() ?? 'Jamais'
                ];
            });

        $recentRequests = PartnerRequest::with('reviewer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'company_name' => $request->company_name,
                    'contact_name' => $request->contact_name,
                    'category' => $request->category,
                    'status' => $request->status,
                    'status_badge' => $request->status_badge,
                    'status_text' => $request->status_text,
                    'submitted_at' => $request->created_at->diffForHumans(),
                    'reviewer' => $request->reviewer?->name
                ];
            });

        return Inertia::render('Dashboard/Partners', [
            'stats' => $stats,
            'partners' => $partners,
            'recentRequests' => $recentRequests
        ]);
    }

    /**
     * Créer un nouveau partenaire
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'website' => 'nullable|url',
            'email' => 'required|email|unique:partners,email',
            'phone' => 'nullable|string|max:20',
            'contact_person' => 'required|string|max:255',
            'contact_position' => 'nullable|string|max:255',
            'category' => 'required|string',
            'partnership_type' => 'required|string',
            'contribution_amount' => 'nullable|numeric|min:0',
            'partnership_start_date' => 'nullable|date',
            'partnership_end_date' => 'nullable|date|after:partnership_start_date',
            'partnership_details' => 'nullable|string',
            'budget_range' => 'nullable|string',
            'is_featured' => 'boolean',
            'priority' => 'integer|min:0|max:100'
        ]);

        $partner = Partner::create($validated);

        return redirect()->back()->with('success', "Partenaire {$partner->name} créé avec succès !");
    }

    /**
     * Mettre à jour un partenaire
     */
    public function update(Request $request, Partner $partner): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'website' => 'nullable|url',
            'email' => 'required|email|unique:partners,email,' . $partner->id,
            'phone' => 'nullable|string|max:20',
            'contact_person' => 'required|string|max:255',
            'contact_position' => 'nullable|string|max:255',
            'category' => 'required|string',
            'partnership_type' => 'required|string',
            'status' => 'required|in:active,pending,suspended,inactive',
            'contribution_amount' => 'nullable|numeric|min:0',
            'partnership_start_date' => 'nullable|date',
            'partnership_end_date' => 'nullable|date|after:partnership_start_date',
            'partnership_details' => 'nullable|string',
            'budget_range' => 'nullable|string',
            'is_featured' => 'boolean',
            'priority' => 'integer|min:0|max:100',
            'internal_notes' => 'nullable|string'
        ]);

        $partner->update($validated);

        return redirect()->back()->with('success', "Partenaire {$partner->name} mis à jour avec succès !");
    }

    /**
     * Supprimer un partenaire
     */
    public function destroy(Partner $partner): RedirectResponse
    {
        $partnerName = $partner->name;
        $partner->delete();

        return redirect()->back()->with('success', "Partenaire {$partnerName} supprimé avec succès !");
    }

    /**
     * Activer un partenaire
     */
    public function activate(Partner $partner): JsonResponse
    {
        $partner->markAsActive();

        return response()->json([
            'message' => "Partenaire {$partner->name} activé avec succès !",
            'partner' => $partner->refresh()
        ]);
    }

    /**
     * Suspendre un partenaire
     */
    public function suspend(Request $request, Partner $partner): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $partner->suspend($request->reason);

        return response()->json([
            'message' => "Partenaire {$partner->name} suspendu avec succès !",
            'partner' => $partner->refresh()
        ]);
    }

    /**
     * Mettre à jour la date de dernier contact
     */
    public function updateContact(Partner $partner): JsonResponse
    {
        $partner->updateLastContact();

        return response()->json([
            'message' => 'Date de dernier contact mise à jour !',
            'last_contact' => $partner->last_contact_date->diffForHumans()
        ]);
    }

    /**
     * Traiter les demandes de partenariat
     */
    public function processRequest(Request $request, PartnerRequest $partnerRequest): JsonResponse
    {
        $action = $request->validate([
            'action' => 'required|in:approve,reject,review',
            'notes' => 'nullable|string|max:1000'
        ])['action'];

        $user = $request->user();

        switch ($action) {
            case 'review':
                $partnerRequest->markAsUnderReview($user);
                $message = 'Demande mise en cours d\'examen';
                break;

            case 'approve':
                $partner = $partnerRequest->approve($user, $request->notes);
                $message = "Demande approuvée et partenaire {$partner->name} créé !";
                break;

            case 'reject':
                $partnerRequest->reject($user, $request->notes ?? 'Aucune raison spécifiée');
                $message = 'Demande rejetée';
                break;
        }

        return response()->json([
            'message' => $message,
            'request' => $partnerRequest->refresh()->load('reviewer')
        ]);
    }

    /**
     * Export des données partenaires
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $format = $request->get('format', 'csv');
        
        $partners = Partner::all();
        
        if ($format === 'csv') {
            return $this->exportToCsv($partners);
        }
        
        // Ici vous pourriez ajouter d'autres formats (PDF, Excel, etc.)
        abort(400, 'Format non supporté');
    }

    /**
     * Export CSV
     */
    private function exportToCsv($partners): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $fileName = 'partenaires_' . now()->format('Y-m-d_H-i') . '.csv';
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($partners) {
            $handle = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($handle, [
                'ID', 'Nom', 'Email', 'Téléphone', 'Site web', 'Contact',
                'Catégorie', 'Type partenariat', 'Statut', 'Contribution',
                'Date début', 'Date fin', 'Dernière contact', 'Créé le'
            ]);

            // Données
            foreach ($partners as $partner) {
                fputcsv($handle, [
                    $partner->id,
                    $partner->name,
                    $partner->email,
                    $partner->phone,
                    $partner->website,
                    $partner->contact_person,
                    $partner->category,
                    $partner->partnership_type,
                    $partner->status,
                    $partner->formatted_contribution,
                    $partner->partnership_start_date?->format('d/m/Y'),
                    $partner->partnership_end_date?->format('d/m/Y'),
                    $partner->last_contact_date?->format('d/m/Y H:i'),
                    $partner->created_at->format('d/m/Y H:i')
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}