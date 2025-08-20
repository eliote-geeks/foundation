<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'description',
        'website',
        'email',
        'phone',
        'contact_person',
        'contact_position',
        'category',
        'partnership_type',
        'status',
        'contribution_amount',
        'contribution_currency',
        'partnership_start_date',
        'partnership_end_date',
        'partnership_details',
        'budget_range',
        'sectors_of_interest',
        'is_featured',
        'priority',
        'internal_notes',
        'last_contact_date',
        'contract_reference',
    ];

    protected $casts = [
        'sectors_of_interest' => 'array',
        'partnership_start_date' => 'date',
        'partnership_end_date' => 'date',
        'last_contact_date' => 'datetime',
        'contribution_amount' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    // Scopes pour faciliter les requêtes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeByPartnershipType(Builder $query, string $type): Builder
    {
        return $query->where('partnership_type', $type);
    }

    // Accesseurs
    public function getFormattedContributionAttribute(): string
    {
        if (!$this->contribution_amount) {
            return 'Non spécifié';
        }
        
        return number_format($this->contribution_amount, 0, ',', '.') . ' ' . $this->contribution_currency;
    }

    public function getPartnershipDurationAttribute(): string
    {
        if (!$this->partnership_start_date) {
            return 'Non définie';
        }

        $start = $this->partnership_start_date;
        $end = $this->partnership_end_date ?? now();
        
        return $start->diffInYears($end) . ' an(s)';
    }

    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'active' => 'success',
            'pending' => 'warning',
            'suspended' => 'danger',
            'inactive' => 'secondary',
            default => 'secondary'
        };
    }

    public function getCategoryColorAttribute(): string
    {
        return match($this->category) {
            'Technologie' => '#5FA145',
            'Finance' => '#C69438',
            'Éducation' => '#E4518C',
            'Télécommunications' => '#4D8A3C',
            'Énergie' => '#F5B4C6',
            'Agroalimentaire' => '#334E15',
            'Transport' => '#6B7280',
            default => '#6B7280'
        };
    }

    // Méthodes
    public function markAsActive(): void
    {
        $this->update([
            'status' => 'active',
            'partnership_start_date' => $this->partnership_start_date ?? now()
        ]);
    }

    public function suspend(?string $reason = null): void
    {
        $this->update([
            'status' => 'suspended',
            'internal_notes' => $reason ? $this->internal_notes . "\n[Suspension] " . $reason : $this->internal_notes
        ]);
    }

    public function updateLastContact(): void
    {
        $this->update(['last_contact_date' => now()]);
    }

    // Relations potentielles pour l'avenir
    // public function projects()
    // {
    //     return $this->belongsToMany(Project::class, 'partner_projects');
    // }

    // public function contacts()
    // {
    //     return $this->hasMany(PartnerContact::class);
    // }

    // public function contracts()
    // {
    //     return $this->hasMany(PartnerContract::class);
    // }
}