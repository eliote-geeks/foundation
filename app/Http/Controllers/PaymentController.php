<?php

namespace App\Http\Controllers;

use App\Models\Donation;
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
        $donation  = null;

        if ($reference) {
            $donation = Donation::where('payment_reference', $reference)->first();
        }

        return Inertia::render('payment/success', [
            'reference' => $reference,
            'donation'  => $donation ? [
                'amount'    => $donation->formatted_amount,
                'campaign'  => $donation->campaign?->title ?? 'Don libre',
                'donor'     => $donation->is_anonymous ? 'Donateur anonyme' : $donation->donor_name,
                'status'    => $donation->payment_status,
            ] : null,
        ]);
    }

    public function cancel(Request $request): Response
    {
        $reference = $request->query('reference');

        if ($reference) {
            Donation::where('payment_reference', $reference)
                ->where('payment_status', 'pending')
                ->update(['payment_status' => 'cancelled']);
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

        $donation = Donation::where('payment_reference', $ref)->first();

        if (!$donation) {
            Log::warning('SharePay webhook: donation introuvable pour référence ' . $ref);
            return response()->json(['ok' => true]);
        }

        match ($event) {
            'payment.success' => $donation->markAsCompleted($ref),
            'payment.failed'  => $donation->markAsFailed('Échec SharePay'),
            'payment.cancelled' => $donation->update(['payment_status' => 'cancelled']),
            default => null,
        };

        return response()->json(['ok' => true]);
    }
}
