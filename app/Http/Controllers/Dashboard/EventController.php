<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Vue d'ensemble des événements
     */
    public function index(Request $request): Response
    {
        $status = $request->get('status', 'all');
        
        // Statistiques générales
        $stats = [
            [
                'title' => 'Total Événements',
                'value' => Event::count(),
                'change' => '+' . Event::whereDate('created_at', '>=', now()->subMonth())->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-calendar-event'
            ],
            [
                'title' => 'Événements Actifs',
                'value' => Event::published()->upcoming()->count(),
                'change' => '+' . Event::published()->upcoming()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#667eea',
                'icon' => 'bi-calendar-check'
            ],
            [
                'title' => 'Billets Vendus',
                'value' => Ticket::confirmed()->count(),
                'change' => '+' . Ticket::confirmed()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#E4518C',
                'icon' => 'bi-ticket-perforated'
            ],
            [
                'title' => 'Revenus (XAF)',
                'value' => number_format(Event::sum('total_revenue'), 0, ',', ' '),
                'change' => '+' . number_format(Event::whereDate('updated_at', '>=', now()->subWeek())->sum('total_revenue'), 0, ',', ' '),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-currency-exchange'
            ]
        ];

        // Requête des événements avec filtres
        $eventsQuery = Event::with(['creator', 'tickets'])
            ->latest()
            ->withCount(['tickets as tickets_sold' => function($query) {
                $query->where('status', 'confirmed');
            }]);

        if ($status !== 'all') {
            $eventsQuery->where('status', $status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $eventsQuery->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('location', 'LIKE', "%{$search}%")
                  ->orWhere('category', 'LIKE', "%{$search}%");
            });
        }

        $events = $eventsQuery->paginate(12)->through(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->short_description ?: substr($event->description, 0, 150) . '...',
                'location' => $event->location,
                'start_date' => $event->start_date->format('d/m/Y H:i'),
                'end_date' => $event->end_date->format('d/m/Y H:i'),
                'category' => $event->category,
                'category_display' => $event->category_display,
                'status' => $event->status,
                'status_display' => $event->status_display,
                'image' => $event->image,
                'price' => $event->price,
                'formatted_price' => $event->formattedPrice(),
                'is_free' => $event->is_free,
                'capacity' => $event->capacity,
                'tickets_sold' => $event->tickets_sold ?? 0,
                'available_tickets' => $event->availableTickets(),
                'total_revenue' => $event->total_revenue,
                'created_at' => $event->created_at->diffForHumans(),
                'creator_name' => $event->creator->name,
                'is_active' => $event->isActive(),
                'is_ongoing' => $event->isOngoing(),
                'is_completed' => $event->isCompleted()
            ];
        });

        // Événements récents
        $recentEvents = Event::with('creator')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'location' => $event->location,
                    'start_date' => $event->start_date->format('d/m/Y'),
                    'status' => $event->status_display,
                    'creator' => $event->creator->name,
                    'tickets_sold' => $event->tickets_sold
                ];
            });

        // Analytics par catégorie
        $eventsByCategory = Event::selectRaw('category, COUNT(*) as count, SUM(total_revenue) as revenue')
            ->groupBy('category')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category => [
                    'count' => $item->count,
                    'revenue' => $item->revenue
                ]];
            });

        return Inertia::render('dashboard/events', [
            'stats' => $stats,
            'events' => $events,
            'recentEvents' => $recentEvents,
            'eventsByCategory' => $eventsByCategory,
            'status' => $status,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Vue billetterie - gestion des tickets
     */
    public function tickets(Request $request): Response
    {
        // Statistiques des tickets
        $stats = [
            [
                'title' => 'Total Billets',
                'value' => Ticket::count(),
                'change' => '+' . Ticket::whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#5FA145',
                'icon' => 'bi-ticket-perforated'
            ],
            [
                'title' => 'Billets Confirmés',
                'value' => Ticket::confirmed()->count(),
                'change' => '+' . Ticket::confirmed()->whereDate('created_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#667eea',
                'icon' => 'bi-check-circle'
            ],
            [
                'title' => 'Billets Check-in',
                'value' => Ticket::whereNotNull('checked_in_at')->count(),
                'change' => '+' . Ticket::whereNotNull('checked_in_at')->whereDate('checked_in_at', '>=', now()->subWeek())->count(),
                'positive' => true,
                'color' => '#E4518C',
                'icon' => 'bi-person-check'
            ],
            [
                'title' => 'Revenus Tickets (XAF)',
                'value' => number_format(Ticket::paid()->sum('price_paid'), 0, ',', ' '),
                'change' => '+' . number_format(Ticket::paid()->whereDate('created_at', '>=', now()->subWeek())->sum('price_paid'), 0, ',', ' '),
                'positive' => true,
                'color' => '#C69438',
                'icon' => 'bi-currency-exchange'
            ]
        ];

        // Récupérer les tickets avec filtres
        $ticketsQuery = Ticket::with(['event', 'user'])
            ->latest();

        if ($request->filled('event')) {
            $ticketsQuery->where('event_id', $request->event);
        }

        if ($request->filled('status')) {
            $ticketsQuery->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $ticketsQuery->where(function($q) use ($search) {
                $q->where('ticket_number', 'LIKE', "%{$search}%")
                  ->orWhere('attendee_name', 'LIKE', "%{$search}%")
                  ->orWhere('attendee_email', 'LIKE', "%{$search}%");
            });
        }

        $tickets = $ticketsQuery->paginate(20)->through(function ($ticket) {
            return [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'event_title' => $ticket->event->title,
                'event_date' => $ticket->event->start_date->format('d/m/Y H:i'),
                'attendee_name' => $ticket->attendee_name,
                'attendee_email' => $ticket->attendee_email,
                'attendee_phone' => $ticket->attendee_phone,
                'ticket_type' => $ticket->ticket_type,
                'price_paid' => $ticket->price_paid,
                'currency' => $ticket->currency,
                'status' => $ticket->status,
                'payment_status' => $ticket->payment_status,
                'payment_method' => $ticket->payment_method,
                'purchased_at' => $ticket->purchased_at?->diffForHumans(),
                'checked_in_at' => $ticket->checked_in_at?->diffForHumans(),
                'can_checkin' => $ticket->status === 'confirmed' && !$ticket->checked_in_at
            ];
        });

        // Événements pour le filtre
        $events = Event::published()
            ->orderBy('start_date', 'desc')
            ->get(['id', 'title', 'start_date'])
            ->map(function($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'date' => $event->start_date->format('d/m/Y')
                ];
            });

        return Inertia::render('dashboard/tickets', [
            'stats' => $stats,
            'tickets' => $tickets,
            'events' => $events,
            'filters' => $request->only(['search', 'event', 'status'])
        ]);
    }

    /**
     * Afficher un événement spécifique
     */
    public function show(Event $event): Response
    {
        $event->load(['creator', 'tickets.user']);

        $eventData = [
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'short_description' => $event->short_description,
            'location' => $event->location,
            'address' => $event->address,
            'start_date' => $event->start_date,
            'end_date' => $event->end_date,
            'category' => $event->category,
            'category_display' => $event->category_display,
            'status' => $event->status,
            'status_display' => $event->status_display,
            'image' => $event->image,
            'gallery' => $event->gallery ?? [],
            'price' => $event->price,
            'formatted_price' => $event->formattedPrice(),
            'is_free' => $event->is_free,
            'capacity' => $event->capacity,
            'tickets_sold' => $event->tickets_sold,
            'available_tickets' => $event->availableTickets(),
            'total_revenue' => $event->total_revenue,
            'contact_info' => $event->contact_info ?? [],
            'sponsors' => $event->sponsors ?? [],
            'agenda' => $event->agenda ?? [],
            'speakers' => $event->speakers ?? [],
            'requires_approval' => $event->requires_approval,
            'terms_conditions' => $event->terms_conditions,
            'created_at' => $event->created_at->format('d/m/Y H:i'),
            'creator' => $event->creator->name,
            'tickets' => $event->tickets->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'attendee_name' => $ticket->attendee_name,
                    'attendee_email' => $ticket->attendee_email,
                    'ticket_type' => $ticket->ticket_type_display,
                    'price_paid' => $ticket->formattedPrice(),
                    'status' => $ticket->status_display,
                    'payment_status' => $ticket->payment_status_display,
                    'purchased_at' => $ticket->purchased_at?->format('d/m/Y H:i'),
                    'checked_in_at' => $ticket->checked_in_at?->format('d/m/Y H:i'),
                    'buyer_name' => $ticket->user->name
                ];
            })
        ];

        // Statistiques des billets
        $ticketStats = [
            'total' => $event->tickets()->count(),
            'confirmed' => $event->tickets()->confirmed()->count(),
            'checked_in' => $event->tickets()->whereNotNull('checked_in_at')->count(),
            'revenue' => $event->tickets()->paid()->sum('price_paid')
        ];

        // Billets récents
        $recentTickets = $event->tickets()
            ->with('user')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'attendee_name' => $ticket->attendee_name,
                    'attendee_email' => $ticket->attendee_email,
                    'ticket_type' => $ticket->ticket_type,
                    'price_paid' => $ticket->price_paid,
                    'status' => $ticket->status,
                    'payment_status' => $ticket->payment_status,
                    'purchased_at' => $ticket->purchased_at?->diffForHumans(),
                    'checked_in_at' => $ticket->checked_in_at?->diffForHumans(),
                ];
            });

        return Inertia::render('dashboard/event-detail', [
            'event' => $eventData,
            'tickets' => $event->tickets()->with('user')->paginate(20),
            'ticketStats' => $ticketStats,
            'recentTickets' => $recentTickets
        ]);
    }

    /**
     * Créer un nouvel événement
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'category' => 'required|string|in:conference,workshop,seminar,networking,training,webinar,meetup',
            'price' => 'required|numeric|min:0',
            'is_free' => 'boolean',
            'capacity' => 'nullable|integer|min:1',
            'requires_approval' => 'boolean',
            'terms_conditions' => 'nullable|string',
            'contact_info' => 'nullable|array',
            'speakers' => 'nullable|array',
            'agenda' => 'nullable|array'
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'draft';
        $validated['currency'] = 'XAF';

        if ($validated['is_free']) {
            $validated['price'] = 0;
        }

        $event = Event::create($validated);

        return redirect()->back()->with('success', "Événement '{$event->title}' créé avec succès !");
    }

    /**
     * Mettre à jour un événement
     */
    public function update(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_free' => 'boolean',
            'capacity' => 'nullable|integer|min:1',
            'requires_approval' => 'boolean',
            'terms_conditions' => 'nullable|string',
            'contact_info' => 'nullable|array',
            'speakers' => 'nullable|array',
            'agenda' => 'nullable|array',
            'status' => 'required|in:draft,published,cancelled,completed'
        ]);

        if ($validated['is_free']) {
            $validated['price'] = 0;
        }

        if ($validated['status'] === 'published' && $event->status !== 'published') {
            $validated['published_at'] = now();
        }

        $event->update($validated);

        return redirect()->back()->with('success', "Événement '{$event->title}' mis à jour avec succès !");
    }

    /**
     * Supprimer un événement
     */
    public function destroy(Event $event): RedirectResponse
    {
        $title = $event->title;
        
        if ($event->tickets()->count() > 0) {
            return redirect()->back()->with('error', 'Impossible de supprimer un événement qui a des billets vendus.');
        }

        $event->delete();

        return redirect()->back()->with('success', "Événement '{$title}' supprimé avec succès !");
    }

    /**
     * Publier/dépublier un événement
     */
    public function toggleStatus(Event $event): JsonResponse
    {
        $newStatus = $event->status === 'published' ? 'draft' : 'published';
        
        $updateData = ['status' => $newStatus];
        
        if ($newStatus === 'published' && !$event->published_at) {
            $updateData['published_at'] = now();
        }

        $event->update($updateData);

        return response()->json([
            'message' => $newStatus === 'published' ? 'Événement publié !' : 'Événement dépublié !',
            'status' => $newStatus,
            'status_display' => $event->fresh()->status_display
        ]);
    }

    /**
     * Check-in d'un participant
     */
    public function checkinTicket(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'ticket_number' => 'required|string'
        ]);

        $ticket = Ticket::where('ticket_number', $validated['ticket_number'])
                       ->where('event_id', $event->id)
                       ->first();

        if (!$ticket) {
            return response()->json(['error' => 'Billet non trouvé'], 404);
        }

        if (!$ticket->canCheckIn()) {
            return response()->json(['error' => 'Ce billet ne peut pas être utilisé'], 400);
        }

        $ticket->update([
            'checked_in_at' => now(),
            'checked_in_by' => auth()->id(),
            'status' => 'used'
        ]);

        return response()->json([
            'message' => 'Check-in effectué avec succès !',
            'ticket' => [
                'attendee_name' => $ticket->attendee_name,
                'ticket_type' => $ticket->ticket_type_display,
                'checked_in_at' => $ticket->checked_in_at->format('d/m/Y H:i')
            ]
        ]);
    }

    /**
     * Export des événements
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $status = $request->get('status', 'all');
        
        $query = Event::with('creator');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $events = $query->get();
        
        $fileName = 'evenements_' . ($status === 'all' ? 'tous' : $status) . '_' . now()->format('Y-m-d_H-i') . '.csv';
        
        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        return response()->stream(function () use ($events) {
            $handle = fopen('php://output', 'w');
            
            // En-têtes CSV
            fputcsv($handle, [
                'ID', 'Titre', 'Catégorie', 'Lieu', 'Date début', 'Date fin', 'Prix', 'Capacité',
                'Billets vendus', 'Revenus', 'Statut', 'Créateur', 'Date création'
            ]);

            // Données
            foreach ($events as $event) {
                fputcsv($handle, [
                    $event->id,
                    $event->title,
                    $event->category_display,
                    $event->location,
                    $event->start_date->format('d/m/Y H:i'),
                    $event->end_date->format('d/m/Y H:i'),
                    $event->formattedPrice(),
                    $event->capacity,
                    $event->tickets_sold,
                    $event->total_revenue,
                    $event->status_display,
                    $event->creator->name,
                    $event->created_at->format('d/m/Y H:i')
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}