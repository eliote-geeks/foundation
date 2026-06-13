<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Ticket;
use App\Services\SharePayService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicEventController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->string('category')->toString();
        $search = $request->string('search')->toString();

        $eventsQuery = Event::query()
            ->published()
            ->upcoming()
            ->orderBy('start_date');

        if ($category !== '') {
            $eventsQuery->byCategory($category);
        }

        if ($search !== '') {
            $eventsQuery->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('location', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $events = $eventsQuery
            ->limit(24)
            ->get()
            ->map(function (Event $event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'short_description' => $event->short_description,
                    'location' => $event->location,
                    'start_date_iso' => $event->start_date->toISOString(),
                    'end_date_iso' => $event->end_date->toISOString(),
                    'start_date_display' => $event->start_date->translatedFormat('d M Y • H:i'),
                    'category' => $event->category,
                    'category_display' => $event->category_display,
                    'status' => $event->status,
                    'status_display' => $event->status_display,
                    'image' => $event->image,
                    'is_free' => $event->is_free,
                    'formatted_price' => $event->formattedPrice(),
                    'capacity' => $event->capacity,
                    'available_tickets' => $event->availableTickets(),
                ];
            })
            ->values();

        $categories = Event::query()
            ->published()
            ->upcoming()
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return Inertia::render('events', [
            'user' => auth()->user(),
            'events' => $events,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function show(Event $event): Response
    {
        abort_unless($event->status === 'published' && $event->published_at !== null, 404);

        return Inertia::render('events-detail', [
            'user' => auth()->user(),
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'short_description' => $event->short_description,
                'location' => $event->location,
                'address' => $event->address,
                'latitude' => $event->latitude,
                'longitude' => $event->longitude,
                'start_date_iso' => $event->start_date->toISOString(),
                'end_date_iso' => $event->end_date->toISOString(),
                'start_date_display' => $event->start_date->translatedFormat('l d M Y • H:i'),
                'end_date_display' => $event->end_date->translatedFormat('l d M Y • H:i'),
                'category' => $event->category,
                'category_display' => $event->category_display,
                'status' => $event->status,
                'status_display' => $event->status_display,
                'image' => $event->image,
                'gallery' => $event->gallery,
                'agenda' => $event->agenda,
                'speakers' => $event->speakers,
                'sponsors' => $event->sponsors,
                'is_free' => $event->is_free,
                'price'   => $event->is_free ? null : (float) $event->price,
                'requires_approval' => $event->requires_approval,
                'formatted_price' => $event->formattedPrice(),
                'capacity' => $event->capacity,
                'available_tickets' => $event->availableTickets(),
                'terms_conditions' => $event->terms_conditions,
                'contact_info' => $event->contact_info,
            ],
        ]);
    }

    public function reserve(Request $request, Event $event)
    {
        abort_unless($event->status === 'published' && $event->published_at !== null, 404);

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255'],
            'phone'     => ['nullable', 'string', 'max:50'],
            'quantity'  => ['required', 'integer', 'min:1', 'max:10'],
            'notes'     => ['nullable', 'string', 'max:2000'],
        ]);

        // ── Événement payant ────────────────────────────────────────────────
        if (!$event->is_free) {
            if (!auth()->check()) {
                return redirect()->route('login')
                    ->with('error', 'Connectez-vous pour acheter vos billets.');
            }

            $quantity   = (int) $validated['quantity'];
            $unitPrice  = (float) $event->price;
            $total      = (int) round($unitPrice * $quantity);

            $ticket = Ticket::create([
                'event_id'        => $event->id,
                'user_id'         => auth()->id(),
                'attendee_name'   => $validated['full_name'],
                'attendee_email'  => $validated['email'],
                'attendee_phone'  => $validated['phone'] ?? null,
                'ticket_type'     => 'standard',
                'price_paid'      => $total,
                'currency'        => $event->currency ?? 'XAF',
                'status'          => 'pending',
                'payment_status'  => 'pending',
                'payment_method'  => 'mobile_money',
                'notes'           => $validated['notes'] ?? null,
                'metadata'        => ['quantity' => $quantity, 'unit_price' => $unitPrice],
                'purchased_at'    => now(),
            ]);

            try {
                $sharepay = app(SharePayService::class);
                $session  = $sharepay->createCheckout([
                    'amount'            => $total,
                    'currency'          => $ticket->currency,
                    'merchantReference' => $ticket->ticket_number,
                    'description'       => "Billet{$quantity} × {$event->title}",
                    'successUrl'        => route('payment.success'),
                    'cancelUrl'         => route('payment.cancel'),
                ]);

                $ticket->update(['transaction_id' => $session['reference']]);

                return Inertia::location($session['paymentUrl']);

            } catch (\Exception $e) {
                $ticket->delete();
                return back()->withErrors(['full_name' => 'Erreur de paiement : ' . $e->getMessage()]);
            }
        }

        // ── Événement gratuit ────────────────────────────────────────────────
        $status = $event->requires_approval ? 'pending' : 'confirmed';

        $registration = EventRegistration::create([
            'event_id'  => $event->id,
            'full_name' => $validated['full_name'],
            'email'     => $validated['email'],
            'phone'     => $validated['phone'] ?? null,
            'quantity'  => $validated['quantity'],
            'notes'     => $validated['notes'] ?? null,
            'status'    => $status,
        ]);

        return Inertia::render('events-confirmation', [
            'user'  => auth()->user(),
            'event' => [
                'id'                 => $event->id,
                'title'              => $event->title,
                'start_date_display' => $event->start_date->translatedFormat('l d M Y • H:i'),
                'location'           => $event->location,
                'requires_approval'  => $event->requires_approval,
            ],
            'registration' => [
                'id'        => $registration->id,
                'full_name' => $registration->full_name,
                'email'     => $registration->email,
                'phone'     => $registration->phone,
                'quantity'  => $registration->quantity,
                'status'    => $registration->status,
            ],
        ]);
    }
}
