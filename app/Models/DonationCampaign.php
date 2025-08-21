<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class DonationCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'short_description',
        'slug',
        'category',
        'type',
        'image',
        'gallery',
        'start_date',
        'end_date',
        'is_active',
        'status',
        'target_amount',
        'current_amount',
        'min_amount',
        'max_amount',
        'currency',
        'donor_count',
        'donation_count',
        'average_donation',
        'target_donors',
        'completion_percentage',
        'full_content',
        'impact_metrics',
        'updates',
        'faq',
        'suggested_amounts',
        'allow_anonymous',
        'allow_recurring',
        'show_donors',
        'send_thank_you',
        'target_regions',
        'beneficiary_info',
        'meta_title',
        'meta_description',
        'social_sharing',
        'tracking_code',
        'created_by',
        'responsible_by',
        'team_members',
        'published_at',
        'completed_at'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'published_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_active' => 'boolean',
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'average_donation' => 'decimal:2',
        'completion_percentage' => 'decimal:2',
        'gallery' => 'array',
        'impact_metrics' => 'array',
        'updates' => 'array',
        'faq' => 'array',
        'suggested_amounts' => 'array',
        'allow_anonymous' => 'boolean',
        'allow_recurring' => 'boolean',
        'show_donors' => 'boolean',
        'send_thank_you' => 'boolean',
        'target_regions' => 'array',
        'beneficiary_info' => 'array',
        'social_sharing' => 'array',
        'team_members' => 'array',
    ];

    // Relations
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function responsible(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_by');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class, 'campaign_id');
    }

    public function activeDonations(): HasMany
    {
        return $this->donations()->where('payment_status', 'completed');
    }

    public function donors()
    {
        return $this->belongsToMany(User::class, 'donations', 'campaign_id', 'donor_id')
                    ->withPivot(['amount', 'donated_at', 'is_anonymous'])
                    ->withTimestamps();
    }

    public function uniqueDonors()
    {
        return $this->donations()
                    ->where('payment_status', 'completed')
                    ->distinct('donor_id')
                    ->with('donor');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('status', 'active');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'active')->whereNotNull('published_at');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'active')
                    ->where('start_date', '<=', now())
                    ->where(function($q) {
                        $q->whereNull('end_date')->orWhere('end_date', '>=', now());
                    });
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed')->orWhere('completion_percentage', '>=', 100);
    }

    public function scopeNearTarget($query, float $percentage = 80)
    {
        return $query->where('completion_percentage', '>=', $percentage);
    }

    public function scopePopular($query, int $minDonors = 10)
    {
        return $query->where('donor_count', '>=', $minDonors);
    }

    public function scopeFeatured($query)
    {
        return $query->where('type', 'project_specific')
                    ->where('target_amount', '>=', 100000)
                    ->orderByDesc('current_amount');
    }

    // Accessors
    public function getCategoryDisplayAttribute(): string
    {
        return match($this->category) {
            'education' => 'Éducation',
            'health' => 'Santé',
            'environment' => 'Environnement',
            'poverty' => 'Lutte contre la pauvreté',
            'emergency' => 'Urgence humanitaire',
            'infrastructure' => 'Infrastructure',
            'technology' => 'Technologie',
            'culture' => 'Culture & Arts',
            'sport' => 'Sport',
            'other' => 'Autre',
            default => 'Non défini'
        };
    }

    public function getTypeDisplayAttribute(): string
    {
        return match($this->type) {
            'general' => 'Campagne générale',
            'project_specific' => 'Projet spécifique',
            'emergency' => 'Urgence',
            'recurring' => 'Don récurrent',
            'crowdfunding' => 'Financement participatif',
            'memorial' => 'Don commémoratif',
            'tribute' => 'Don hommage',
            'corporate' => 'Don d\'entreprise',
            default => 'Non défini'
        };
    }

    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            'draft' => 'Brouillon',
            'active' => 'Active',
            'paused' => 'Suspendue',
            'completed' => 'Terminée',
            'cancelled' => 'Annulée',
            default => 'Non défini'
        };
    }

    public function getFormattedTargetAmountAttribute(): string
    {
        return number_format($this->target_amount, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function getFormattedCurrentAmountAttribute(): string
    {
        return number_format($this->current_amount, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function getRemainingAmountAttribute(): float
    {
        return max(0, $this->target_amount - $this->current_amount);
    }

    public function getFormattedRemainingAmountAttribute(): string
    {
        return number_format($this->remaining_amount, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function getDaysRemainingAttribute(): ?int
    {
        if (!$this->end_date) return null;
        return max(0, now()->diffInDays($this->end_date, false));
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date && $this->end_date->isPast();
    }

    public function getIsOngoingAttribute(): bool
    {
        return $this->status === 'active' && 
               $this->start_date <= now() && 
               (!$this->end_date || $this->end_date >= now());
    }

    public function getPerformanceScoreAttribute(): float
    {
        $factors = [
            'completion' => $this->completion_percentage / 100 * 0.4,
            'donors' => min(1, $this->donor_count / max($this->target_donors ?: 100, 1)) * 0.3,
            'time' => $this->getTimeProgressScore() * 0.2,
            'engagement' => $this->getEngagementScore() * 0.1
        ];

        return array_sum($factors);
    }

    // Mutators
    public function setTitleAttribute(string $value): void
    {
        $this->attributes['title'] = $value;
        if (empty($this->attributes['slug'])) {
            $this->attributes['slug'] = Str::slug($value) . '-' . time();
        }
    }

    // Méthodes utilitaires
    public function updateStats(): void
    {
        $completedDonations = $this->donations()->where('payment_status', 'completed');
        
        $this->update([
            'current_amount' => $completedDonations->sum('amount'),
            'donor_count' => $completedDonations->distinct('donor_id')->count(),
            'donation_count' => $completedDonations->count(),
            'average_donation' => $completedDonations->avg('amount') ?: 0,
            'completion_percentage' => min(100, ($this->current_amount / $this->target_amount) * 100)
        ]);
    }

    public function addDonation(User $donor, float $amount, array $data = []): Donation
    {
        $donation = $this->donations()->create([
            'donation_number' => $this->generateDonationNumber(),
            'donor_id' => $donor->id,
            'amount' => $amount,
            'currency' => $this->currency,
            'donated_at' => now(),
            'payment_status' => 'pending',
            ...$data
        ]);

        $this->updateStats();
        
        return $donation;
    }

    public function generateDonationNumber(): string
    {
        return 'DON-' . $this->id . '-' . str_pad($this->donation_count + 1, 4, '0', STR_PAD_LEFT);
    }

    public function canReceiveDonations(): bool
    {
        return $this->status === 'active' && 
               $this->is_active && 
               $this->start_date <= now() && 
               (!$this->end_date || $this->end_date >= now()) &&
               $this->completion_percentage < 100;
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completion_percentage' => min(100, ($this->current_amount / $this->target_amount) * 100)
        ]);
    }

    public function addUpdate(string $title, string $content, User $author): void
    {
        $updates = $this->updates ?: [];
        $updates[] = [
            'id' => Str::uuid(),
            'title' => $title,
            'content' => $content,
            'author' => $author->name,
            'author_id' => $author->id,
            'created_at' => now()->toISOString(),
        ];

        $this->update(['updates' => $updates]);
    }

    protected function getTimeProgressScore(): float
    {
        if (!$this->end_date) return 0.5;
        
        $totalDuration = $this->start_date->diffInDays($this->end_date);
        $elapsed = $this->start_date->diffInDays(now());
        
        return min(1, $elapsed / max($totalDuration, 1));
    }

    protected function getEngagementScore(): float
    {
        $avgDonationSize = $this->average_donation;
        $donorParticipation = $this->donor_count / max($this->donation_count, 1);
        
        return min(1, ($avgDonationSize / 50000) * 0.6 + $donorParticipation * 0.4);
    }
}