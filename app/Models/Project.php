<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Project extends Model
{
    protected $fillable = [
        'user_id', 'title', 'category', 'short_description', 'description',
        'project_url', 'team_size', 'team_members', 'budget_needed',
        'status', 'admin_notes', 'featured', 'submitted_at',
    ];

    protected $casts = [
        'team_members'  => 'array',
        'featured'      => 'boolean',
        'submitted_at'  => 'datetime',
        'budget_needed' => 'integer',
        'team_size'     => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'draft'    => 'Brouillon',
            'pending'  => 'En attente de validation',
            'approved' => 'Approuvé',
            'rejected' => 'Rejeté',
            default    => $this->status,
        };
    }

    public function getBudgetFormattedAttribute(): string
    {
        if (!$this->budget_needed) return 'Non précisé';
        return number_format($this->budget_needed, 0, ',', ' ') . ' XAF';
    }
}
