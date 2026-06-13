<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SharePayService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey  = config('services.sharepay.api_key');
        $this->baseUrl = rtrim(config('services.sharepay.base_url'), '/');
    }

    public function createCheckout(array $params): array
    {
        $response = Http::withHeaders([
            'X-API-KEY'    => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept'       => 'application/json',
        ])->post("{$this->baseUrl}/api/v1/pay-in/checkout", $params);

        Log::info('SharePay checkout', ['status' => $response->status(), 'body' => $response->json()]);

        if (!$response->successful() || !($response->json('success'))) {
            throw new \RuntimeException($response->json('message', 'Erreur SharePay lors de la création du paiement.'));
        }

        return $response->json('data');
    }

    public function verifyWebhookSignature(string $rawPayload, string $signature): bool
    {
        $secret   = config('services.sharepay.webhook_secret');
        $expected = hash_hmac('sha256', $rawPayload, $secret);
        return hash_equals($expected, $signature);
    }
}
