<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartnerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'website',
        'category',
        'partnership_type',
        'description',
        'budget_range',
        'status',
        'admin_notes',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    // Relations
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Scopes
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnderReview(Builder $query): Builder
    {
        return $query->where('status', 'under_review');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }

    // Accesseurs
    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'under_review' => 'info',
            'approved' => 'success',
            'rejected' => 'danger',
            default => 'secondary'
        };
    }

    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'pending' => 'En attente',
            'under_review' => 'En cours d\'examen',
            'approved' => 'Approuvée',
            'rejected' => 'Rejetée',
            default => 'Inconnu'
        };
    }

    // Méthodes
    public function markAsUnderReview(User $reviewer): void
    {
        $this->update([
            'status' => 'under_review',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now()
        ]);
    }

    public function approve(User $reviewer, ?string $notes = null): Partner
    {
        // Marquer la demande comme approuvée
        $this->update([
            'status' => 'approved',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'admin_notes' => $notes
        ]);

        // Créer le partenaire
        return Partner::create([
            'name' => $this->company_name,
            'description' => $this->description,
            'website' => $this->website,
            'email' => $this->email,
            'phone' => $this->phone,
            'contact_person' => $this->contact_name,
            'category' => $this->category,
            'partnership_type' => $this->partnership_type,
            'budget_range' => $this->budget_range,
            'status' => 'active',
            'partnership_start_date' => now(),
            'internal_notes' => "Créé depuis la demande #{$this->id} - {$notes}"
        ]);
    }

    public function reject(User $reviewer, string $reason): void
    {
        $this->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'admin_notes' => $reason
        ]);
    }

    // Convertir en partenaire (méthode utilitaire)
    public function toPartnerArray(): array
    {
        return [
            'name' => $this->company_name,
            'description' => $this->description,
            'website' => $this->website,
            'email' => $this->email,
            'phone' => $this->phone,
            'contact_person' => $this->contact_name,
            'category' => $this->category,
            'partnership_type' => $this->partnership_type,
            'budget_range' => $this->budget_range,
            'status' => 'pending',
            'internal_notes' => "Demande reçue le {$this->created_at->format('d/m/Y')}"
        ];
    }
}