<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Models\PartnerRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(): Response
    {
        $stats = [
            [
                'title'    => 'Partenaires actifs',
                'value'    => Partner::active()->count(),
                'change'   => '+' . Partner::active()->whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color'    => '#5FA145',
                'icon'     => 'bi-building-check',
            ],
            [
                'title'    => 'Demandes en attente',
                'value'    => PartnerRequest::pending()->count(),
                'change'   => '+' . PartnerRequest::pending()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color'    => '#C69438',
                'icon'     => 'bi-clock-history',
            ],
            [
                'title'    => 'Total partenaires',
                'value'    => Partner::count(),
                'change'   => '+' . Partner::whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color'    => '#C69438',
                'icon'     => 'bi-handshake',
            ],
            [
                'title'    => 'Contributions totales',
                'value'    => number_format(Partner::sum('contribution_amount'), 0, ',', '.') . ' FCFA',
                'change'   => '+18%',
                'positive' => true,
                'color'    => '#4D8A3C',
                'icon'     => 'bi-graph-up',
            ],
        ];

        $partners = Partner::latest()->get()->map(fn($p) => [
            'id'               => $p->id,
            'name'             => $p->name,
            'logo_url'         => $p->logo ? Storage::url($p->logo) : null,
            'category'         => $p->category,
            'partnership_type' => $p->partnership_type,
            'status'           => $p->status,
            'status_badge'     => $p->status_badge,
            'contribution'     => $p->formatted_contribution,
            'contact_person'   => $p->contact_person,
            'website'          => $p->website,
            'email'            => $p->email,
            'phone'            => $p->phone,
            'description'      => $p->description,
            'is_featured'      => $p->is_featured,
            'since'            => $p->partnership_start_date?->format('d/m/Y') ?? 'Non définie',
            'last_contact'     => $p->last_contact_date?->diffForHumans() ?? 'Jamais',
        ]);

        $recentRequests = PartnerRequest::with('reviewer')->latest()->take(10)->get()->map(fn($r) => [
            'id'           => $r->id,
            'company_name' => $r->company_name,
            'contact_name' => $r->contact_name,
            'category'     => $r->category,
            'status'       => $r->status,
            'status_badge' => $r->status_badge,
            'status_text'  => $r->status_text,
            'submitted_at' => $r->created_at->diffForHumans(),
            'reviewer'     => $r->reviewer?->name,
        ]);

        return Inertia::render('Dashboard/Partners', [
            'stats'          => $stats,
            'partners'       => $partners,
            'recentRequests' => $recentRequests,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'website'          => 'nullable|url',
            'email'            => 'nullable|email|unique:partners,email',
            'phone'            => 'nullable|string|max:20',
            'contact_person'   => 'nullable|string|max:255',
            'contact_position' => 'nullable|string|max:255',
            'category'         => 'nullable|string',
            'partnership_type' => 'nullable|string',
            'contribution_amount'    => 'nullable|numeric|min:0',
            'partnership_start_date' => 'nullable|date',
            'is_featured'      => 'boolean',
            'priority'         => 'integer|min:0|max:100',
            'logo'             => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        } else {
            unset($validated['logo']);
        }

        $validated['status'] = 'active';

        $partner = Partner::create($validated);

        return redirect()->back()->with('success', "Partenaire {$partner->name} créé avec succès !");
    }

    public function update(Request $request, Partner $partner): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'website'          => 'nullable|url',
            'email'            => 'nullable|email|unique:partners,email,' . $partner->id,
            'phone'            => 'nullable|string|max:20',
            'contact_person'   => 'nullable|string|max:255',
            'contact_position' => 'nullable|string|max:255',
            'category'         => 'nullable|string',
            'partnership_type' => 'nullable|string',
            'status'           => 'required|in:active,pending,suspended,inactive',
            'contribution_amount'    => 'nullable|numeric|min:0',
            'partnership_start_date' => 'nullable|date',
            'is_featured'      => 'boolean',
            'priority'         => 'integer|min:0|max:100',
            'logo'             => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($partner->logo) {
                Storage::disk('public')->delete($partner->logo);
            }
            $validated['logo'] = $request->file('logo')->store('partners', 'public');
        } else {
            unset($validated['logo']);
        }

        $partner->update($validated);

        return redirect()->back()->with('success', "Partenaire {$partner->name} mis à jour !");
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        if ($partner->logo) {
            Storage::disk('public')->delete($partner->logo);
        }

        $name = $partner->name;
        $partner->delete();

        return redirect()->back()->with('success', "Partenaire {$name} supprimé !");
    }

    public function toggleFeatured(Partner $partner): RedirectResponse
    {
        $partner->update(['is_featured' => !$partner->is_featured]);
        $label = $partner->is_featured ? 'mis en avant' : 'retiré de la vitrine';
        return redirect()->back()->with('success', "{$partner->name} {$label} !");
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $fileName = 'partenaires_' . now()->format('Y-m-d_H-i') . '.csv';
        $headers  = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nom', 'Email', 'Téléphone', 'Site web', 'Contact', 'Catégorie', 'Type', 'Statut', 'Contribution', 'Créé le']);
            foreach (Partner::all() as $p) {
                fputcsv($handle, [$p->id, $p->name, $p->email, $p->phone, $p->website, $p->contact_person, $p->category, $p->partnership_type, $p->status, $p->formatted_contribution, $p->created_at->format('d/m/Y')]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}
