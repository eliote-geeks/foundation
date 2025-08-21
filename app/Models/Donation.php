<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'donation_number',
        'campaign_id',
        'donor_id',
        'amount',
        'currency',
        'amount_usd',
        'exchange_rate',
        'type',
        'is_anonymous',
        'is_tribute',
        'tribute_message',
        'tribute_person',
        'donor_email',
        'donor_phone',
        'donor_name',
        'donor_address',
        'donor_city',
        'donor_country',
        'donor_company',
        'payment_method',
        'payment_status',
        'transaction_id',
        'payment_reference',
        'payment_provider',
        'payment_data',
        'donated_at',
        'payment_confirmed_at',
        'receipt_sent_at',
        'thank_you_sent_at',
        'parent_donation_id',
        'recurrence_count',
        'next_donation_at',
        'is_active_subscription',
        'is_tax_deductible',
        'tax_deduction_amount',
        'receipt_number',
        'receipt_data',
        'donor_message',
        'public_message',
        'allow_contact',
        'communication_preferences',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'referrer_url',
        'landing_page',
        'ip_address',
        'user_agent',
        'device_info',
        'motivation',
        'satisfaction_rating',
        'feedback',
        'impact_tracking',
        'custom_fields',
        'internal_notes',
        'is_verified',
        'verified_by',
        'verified_at',
        'is_suspicious',
        'suspicious_reason'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'amount_usd' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'tax_deduction_amount' => 'decimal:2',
        'donated_at' => 'datetime',
        'payment_confirmed_at' => 'datetime',
        'receipt_sent_at' => 'datetime',
        'thank_you_sent_at' => 'datetime',
        'next_donation_at' => 'datetime',
        'verified_at' => 'datetime',
        'is_anonymous' => 'boolean',
        'is_tribute' => 'boolean',
        'is_active_subscription' => 'boolean',
        'is_tax_deductible' => 'boolean',
        'allow_contact' => 'boolean',
        'is_verified' => 'boolean',
        'is_suspicious' => 'boolean',
        'payment_data' => 'array',
        'receipt_data' => 'array',
        'communication_preferences' => 'array',
        'device_info' => 'array',
        'impact_tracking' => 'array',
        'custom_fields' => 'array',
    ];

    // Relations
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(DonationCampaign::class, 'campaign_id');
    }

    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function parentDonation(): BelongsTo
    {
        return $this->belongsTo(Donation::class, 'parent_donation_id');
    }

    public function recurringDonations(): HasMany
    {
        return $this->hasMany(Donation::class, 'parent_donation_id');
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', 'failed');
    }

    public function scopeRecurring($query)
    {
        return $query->where('type', '!=', 'one_time');
    }

    public function scopeOneTime($query)
    {
        return $query->where('type', 'one_time');
    }

    public function scopeAnonymous($query)
    {
        return $query->where('is_anonymous', true);
    }

    public function scopePublic($query)
    {
        return $query->where('is_anonymous', false);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    public function scopeByPaymentMethod($query, string $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeByAmount($query, float $min = null, float $max = null)
    {
        if ($min) $query->where('amount', '>=', $min);
        if ($max) $query->where('amount', '<=', $max);
        return $query;
    }

    public function scopeThisMonth($query)
    {
        return $query->whereBetween('donated_at', [now()->startOfMonth(), now()->endOfMonth()]);
    }

    public function scopeThisYear($query)
    {
        return $query->whereBetween('donated_at', [now()->startOfYear(), now()->endOfYear()]);
    }

    public function scopeByDonor($query, User $donor)
    {
        return $query->where('donor_id', $donor->id);
    }

    public function scopeByCampaign($query, DonationCampaign $campaign)
    {
        return $query->where('campaign_id', $campaign->id);
    }

    public function scopeByLocation($query, string $city = null, string $country = null)
    {
        if ($city) $query->where('donor_city', $city);
        if ($country) $query->where('donor_country', $country);
        return $query;
    }

    public function scopeLarge($query, float $amount = 100000)
    {
        return $query->where('amount', '>=', $amount);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('donated_at', '>=', now()->subDays($days));
    }

    // Accessors
    public function getTypeDisplayAttribute(): string
    {
        return match($this->type) {
            'one_time' => 'Don unique',
            'recurring_monthly' => 'Don mensuel',
            'recurring_quarterly' => 'Don trimestriel',
            'recurring_annually' => 'Don annuel',
            'pledge' => 'Promesse de don',
            default => 'Non défini'
        };
    }

    public function getPaymentStatusDisplayAttribute(): string
    {
        return match($this->payment_status) {
            'pending' => 'En attente',
            'processing' => 'En traitement',
            'completed' => 'Confirmé',
            'failed' => 'Échec',
            'cancelled' => 'Annulé',
            'refunded' => 'Remboursé',
            'partially_refunded' => 'Partiellement remboursé',
            default => 'Non défini'
        };
    }

    public function getPaymentMethodDisplayAttribute(): string
    {
        return match($this->payment_method) {
            'mobile_money' => 'Mobile Money',
            'bank_transfer' => 'Virement bancaire',
            'credit_card' => 'Carte de crédit',
            'paypal' => 'PayPal',
            'crypto' => 'Cryptomonnaie',
            'cash' => 'Espèces',
            'check' => 'Chèque',
            'other' => 'Autre',
            default => 'Non défini'
        };
    }

    public function getMotivationDisplayAttribute(): string
    {
        return match($this->motivation) {
            'personal_cause' => 'Cause personnelle',
            'corporate_social_responsibility' => 'Responsabilité sociale',
            'tax_benefit' => 'Avantage fiscal',
            'friend_family_request' => 'Demande proche',
            'social_media_influence' => 'Influence réseaux sociaux',
            'emergency_response' => 'Réponse d\'urgence',
            'religious_beliefs' => 'Convictions religieuses',
            'community_impact' => 'Impact communautaire',
            'other' => 'Autre',
            default => 'Non spécifié'
        };
    }

    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function getDonorDisplayNameAttribute(): string
    {
        if ($this->is_anonymous) {
            return 'Donateur anonyme';
        }

        if ($this->donor_name) {
            return $this->donor_name;
        }

        if ($this->donor && $this->donor->profile) {
            return $this->donor->profile->full_name;
        }

        return $this->donor ? $this->donor->name : 'Donateur inconnu';
    }

    public function getIsLargeDonationAttribute(): bool
    {
        return $this->amount >= 100000; // 100k XAF
    }

    public function getIsRecentAttribute(): bool
    {
        return $this->donated_at->isAfter(now()->subDays(7));
    }

    public function getIsRecurringAttribute(): bool
    {
        return $this->type !== 'one_time';
    }

    public function getHasReceiptAttribute(): bool
    {
        return !empty($this->receipt_number);
    }

    public function getThankYouStatusAttribute(): string
    {
        if ($this->thank_you_sent_at) {
            return 'Envoyé le ' . $this->thank_you_sent_at->format('d/m/Y');
        }
        
        if ($this->payment_status === 'completed') {
            return 'À envoyer';
        }
        
        return 'En attente de confirmation';
    }

    public function getReceiptStatusAttribute(): string
    {
        if ($this->receipt_sent_at) {
            return 'Envoyé le ' . $this->receipt_sent_at->format('d/m/Y');
        }
        
        if ($this->is_tax_deductible && $this->payment_status === 'completed') {
            return 'À générer';
        }
        
        return 'Non applicable';
    }

    // Méthodes utilitaires
    public function generateReceiptNumber(): string
    {
        if ($this->receipt_number) {
            return $this->receipt_number;
        }

        $year = $this->donated_at->year;
        $number = Donation::where('is_tax_deductible', true)
                         ->whereYear('donated_at', $year)
                         ->whereNotNull('receipt_number')
                         ->count() + 1;

        $receiptNumber = "RECU-{$year}-" . str_pad($number, 6, '0', STR_PAD_LEFT);
        
        $this->update(['receipt_number' => $receiptNumber]);
        
        return $receiptNumber;
    }

    public function markAsCompleted(string $transactionId = null): void
    {
        $this->update([
            'payment_status' => 'completed',
            'payment_confirmed_at' => now(),
            'transaction_id' => $transactionId ?: $this->transaction_id,
        ]);

        // Mettre à jour les stats de la campagne
        $this->campaign->updateStats();

        // Marquer l'activité pour le donateur
        if ($this->donor) {
            $this->donor->addActivity(
                'donation',
                "Don de {$this->formatted_amount} pour {$this->campaign->title}",
                [
                    'campaign_id' => $this->campaign_id,
                    'donation_id' => $this->id,
                    'amount' => $this->amount,
                    'currency' => $this->currency
                ],
                $this->amount >= 50000 ? 100 : 50 // Points selon le montant
            );
        }
    }

    public function markAsFailed(string $reason = null): void
    {
        $this->update([
            'payment_status' => 'failed',
            'suspicious_reason' => $reason,
        ]);
    }

    public function markAsSuspicious(string $reason): void
    {
        $this->update([
            'is_suspicious' => true,
            'suspicious_reason' => $reason,
        ]);
    }

    public function verify(User $verifier): void
    {
        $this->update([
            'is_verified' => true,
            'verified_by' => $verifier->id,
            'verified_at' => now(),
            'is_suspicious' => false,
            'suspicious_reason' => null,
        ]);
    }

    public function sendThankYou(): void
    {
        // Logique d'envoi de remerciement
        $this->update(['thank_you_sent_at' => now()]);
    }

    public function generateReceipt(): void
    {
        if (!$this->is_tax_deductible) return;
        
        $this->generateReceiptNumber();
        $this->update(['receipt_sent_at' => now()]);
    }

    public function createRecurringDonation(): ?Donation
    {
        if (!$this->is_recurring || !$this->is_active_subscription || !$this->next_donation_at) {
            return null;
        }

        if ($this->next_donation_at->isFuture()) {
            return null;
        }

        $nextDonation = $this->replicate([
            'donation_number',
            'transaction_id',
            'payment_reference',
            'payment_confirmed_at',
            'receipt_sent_at',
            'thank_you_sent_at',
            'receipt_number'
        ]);

        $nextDonation->parent_donation_id = $this->id;
        $nextDonation->recurrence_count = $this->recurrence_count + 1;
        $nextDonation->donated_at = $this->next_donation_at;
        $nextDonation->payment_status = 'pending';
        $nextDonation->donation_number = $this->campaign->generateDonationNumber();
        
        // Calculer la prochaine date de don
        $nextDonation->next_donation_at = $this->calculateNextDonationDate($this->next_donation_at);
        
        $nextDonation->save();

        // Mettre à jour la prochaine date pour le don actuel
        $this->update(['next_donation_at' => $nextDonation->next_donation_at]);

        return $nextDonation;
    }

    public function cancelRecurringDonations(): void
    {
        $this->update(['is_active_subscription' => false]);
        
        // Annuler aussi tous les dons futurs
        $this->recurringDonations()
             ->where('payment_status', 'pending')
             ->update(['payment_status' => 'cancelled']);
    }

    protected function calculateNextDonationDate(\Carbon\Carbon $currentDate): \Carbon\Carbon
    {
        return match($this->type) {
            'recurring_monthly' => $currentDate->addMonth(),
            'recurring_quarterly' => $currentDate->addQuarter(),
            'recurring_annually' => $currentDate->addYear(),
            default => $currentDate->addMonth()
        };
    }
}