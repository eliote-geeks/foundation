<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DonationCampaign;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
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

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'campaign_id'     => 'required|exists:donation_campaigns,id',
            'amount'          => 'required|numeric|min:1000',
            'payment_method'  => 'required|in:mtn,orange,bank_transfer,other',
            'transaction_ref' => 'required|string|max:100',
            'donor_name'      => 'required|string|max:100',
            'donor_phone'     => 'required|string|max:20',
            'donor_email'     => 'nullable|email',
            'donor_message'   => 'nullable|string|max:500',
            'is_anonymous'    => 'boolean',
        ]);

        $campaign = DonationCampaign::findOrFail($data['campaign_id']);

        $donationNumber = 'DON-' . strtoupper(substr(md5(uniqid()), 0, 8));

        $methodMap = [
            'mtn'           => 'mobile_money',
            'orange'        => 'mobile_money',
            'bank_transfer' => 'bank_transfer',
            'other'         => 'other',
        ];

        $providerMap = [
            'mtn'    => 'MTN Mobile Money',
            'orange' => 'Orange Money',
        ];

        Donation::create([
            'donation_number'  => $donationNumber,
            'campaign_id'      => $campaign->id,
            'donor_id'         => auth()->id() ?? null,
            'amount'           => $data['amount'],
            'currency'         => 'XAF',
            'payment_method'   => $methodMap[$data['payment_method']],
            'payment_status'   => 'pending',
            'payment_reference'=> $data['transaction_ref'],
            'payment_provider' => $providerMap[$data['payment_method']] ?? null,
            'donor_name'       => $data['donor_name'],
            'donor_phone'      => $data['donor_phone'],
            'donor_email'      => $data['donor_email'] ?? null,
            'donor_message'    => $data['donor_message'] ?? null,
            'is_anonymous'     => $data['is_anonymous'] ?? false,
            'donated_at'       => now(),
            'source'           => 'web',
            'ip_address'       => $request->ip(),
        ]);

        return back()->with('success', "Merci {$data['donor_name']} ! Votre don de " . number_format($data['amount'], 0, ',', ' ') . " XAF a été enregistré et sera confirmé après vérification. Référence : {$donationNumber}");
    }
}
