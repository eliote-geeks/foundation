<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DonationCampaign;
use App\Models\SiteSetting;
use App\Services\SharePayService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::group('donations');

        $campaigns = DonationCampaign::where('status', 'active')
            ->where('is_active', true)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($c) => [
                'id'          => $c->id,
                'title'       => $c->title,
                'description' => $c->short_description ?? substr($c->description ?? '', 0, 120),
                'image'       => $c->image,
                'target'      => (float) $c->target_amount,
                'raised'      => (float) $c->current_amount,
                'percentage'  => $c->target_amount > 0 ? min(100, round(($c->current_amount / $c->target_amount) * 100)) : 0,
                'donor_count' => $c->donor_count ?? 0,
                'currency'    => $c->currency,
                'slug'        => $c->slug,
            ]);

        $recentDonations = Donation::completed()
            ->where('is_anonymous', false)
            ->with('campaign')
            ->latest('donated_at')
            ->limit(10)
            ->get()
            ->map(fn ($d) => [
                'name'     => $d->donor_display_name,
                'amount'   => $d->formatted_amount,
                'campaign' => $d->campaign?->title,
                'date'     => $d->donated_at->diffForHumans(),
            ]);

        $totalRaised = Donation::completed()->sum('amount');
        $donorCount  = Donation::completed()->distinct('donor_id')->count('donor_id');

        return Inertia::render('donate', [
            'user'            => auth()->user(),
            'campaigns'       => $campaigns,
            'recentDonations' => $recentDonations,
            'stats' => [
                'total_raised' => number_format($totalRaised, 0, ',', ' ') . ' XAF',
                'donor_count'  => $donorCount,
                'campaign_count' => $campaigns->count(),
            ],
            'settings' => [
                'mtn_number'         => $settings['donation_mtn_number'] ?? '+237 6XX XXX XXX',
                'orange_number'      => $settings['donation_orange_number'] ?? '+237 6XX XXX XXX',
                'contact_name'       => $settings['donation_contact_name'] ?? 'TITI EVENTS',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'campaign_id'   => 'required|exists:donation_campaigns,id',
            'amount'        => 'required|numeric|min:1000',
            'donor_name'    => 'required|string|max:100',
            'donor_phone'   => 'required|string|max:20',
            'donor_email'   => 'nullable|email',
            'donor_message' => 'nullable|string|max:500',
            'is_anonymous'  => 'boolean',
        ]);

        $campaign       = DonationCampaign::findOrFail($data['campaign_id']);
        $donationNumber = 'DON-' . strtoupper(substr(md5(uniqid()), 0, 8));

        $donation = Donation::create([
            'donation_number'  => $donationNumber,
            'campaign_id'      => $campaign->id,
            'donor_id'         => auth()->id() ?? null,
            'amount'           => $data['amount'],
            'currency'         => 'XAF',
            'payment_method'   => 'mobile_money',
            'payment_status'   => 'pending',
            'payment_provider' => 'SharePay',
            'donor_name'       => $data['donor_name'],
            'donor_phone'      => $data['donor_phone'],
            'donor_email'      => $data['donor_email'] ?? null,
            'donor_message'    => $data['donor_message'] ?? null,
            'is_anonymous'     => $data['is_anonymous'] ?? false,
            'donated_at'       => now(),
            'source'           => 'web',
            'ip_address'       => $request->ip(),
        ]);

        try {
            $sharepay = app(SharePayService::class);
            $session  = $sharepay->createCheckout([
                'amount'            => (int) $data['amount'],
                'currency'          => 'XAF',
                'merchantReference' => $donationNumber,
                'description'       => "Don pour : {$campaign->title}",
                'successUrl'        => route('payment.success'),
                'cancelUrl'         => route('payment.cancel'),
            ]);

            $donation->update(['payment_reference' => $session['reference']]);

            return Inertia::location($session['paymentUrl']);

        } catch (\Exception $e) {
            $donation->delete();
            return back()->withErrors(['amount' => 'Erreur de paiement : ' . $e->getMessage()]);
        }
    }
}
