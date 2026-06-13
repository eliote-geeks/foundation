<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Ticket;
use App\Services\SharePayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function success(Request $request): Response
    {
        $reference = $request->query('reference');
        $item      = null;
        $type      = null;

        if ($reference) {
            $donation = Donation::where('payment_reference', $reference)->first();
            if ($donation) {
                $type = 'donation';
                $item = [
                    'amount'   => $donation->formatted_amount,
                    'label'    => $donation->campaign?->title ?? 'Don libre',
                    'name'     => $donation->is_anonymous ? 'Donateur anonyme' : $donation->donor_name,
                    'status'   => $donation->payment_status,
                ];
            } else {
                $ticket = Ticket::where('transaction_id', $reference)->with('event')->first();
                if ($ticket) {
                    $type = 'ticket';
                    $qty  = $ticket->metadata['quantity'] ?? 1;
                    $item = [
                        'amount' => $ticket->formattedPrice(),
                        'label'  => $ticket->event?->title ?? 'Événement',
                        'name'   => $ticket->attendee_name,
                        'status' => $ticket->payment_status,
                        'ticket_number' => $ticket->ticket_number,
                        'quantity' => $qty,
                    ];
                }
            }
        }

        return Inertia::render('payment/success', [
            'reference' => $reference,
            'type'      => $type,
            'item'      => $item,
        ]);
    }

    public function cancel(Request $request): Response
    {
        $reference = $request->query('reference');

        if ($reference) {
            Donation::where('payment_reference', $reference)
                ->where('payment_status', 'pending')
                ->update(['payment_status' => 'cancelled']);

            Ticket::where('transaction_id', $reference)
                ->where('payment_status', 'pending')
                ->update(['payment_status' => 'failed', 'status' => 'cancelled']);
        }

        return Inertia::render('payment/cancel', [
            'reference' => $reference,
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $rawPayload = $request->getContent();
        $signature  = $request->header('X-Sharepay-Signature', '');

        $sharepay = app(SharePayService::class);

        if (!$sharepay->verifyWebhookSignature($rawPayload, $signature)) {
            Log::warning('SharePay webhook: signature invalide');
            return response()->json(['error' => 'Signature invalide'], 401);
        }

        $payload = json_decode($rawPayload, true);
        $event   = $payload['event'] ?? null;
        $data    = $payload['data'] ?? [];
        $ref     = $data['reference'] ?? null;

        Log::info('SharePay webhook reçu', ['event' => $event, 'reference' => $ref]);

        if (!$ref) {
            return response()->json(['ok' => true]);
        }

        // Try donation first (payment_reference = SharePay ref)
        $donation = Donation::where('payment_reference', $ref)->first();
        if ($donation) {
            match ($event) {
                'payment.success'   => $donation->markAsCompleted($ref),
                'payment.failed'    => $donation->markAsFailed('Échec SharePay'),
                'payment.cancelled' => $donation->update(['payment_status' => 'cancelled']),
                default             => null,
            };
            return response()->json(['ok' => true]);
        }

        // Try ticket (transaction_id = SharePay ref)
        $ticket = Ticket::where('transaction_id', $ref)->first();
        if ($ticket) {
            match ($event) {
                'payment.success' => $ticket->update([
                    'payment_status' => 'paid',
                    'status'         => 'confirmed',
                ]),
                'payment.failed'    => $ticket->update(['payment_status' => 'failed', 'status' => 'cancelled']),
                'payment.cancelled' => $ticket->update(['payment_status' => 'failed', 'status' => 'cancelled']),
                default             => null,
            };
            return response()->json(['ok' => true]);
        }

        Log::warning('SharePay webhook: aucune transaction trouvée pour référence ' . $ref);

        return response()->json(['ok' => true]);
    }
}
