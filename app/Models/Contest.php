<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Contest extends Model
{
    protected $fillable = [
        'title',
        'description',
        'short_description',
        'category',
        'type',
        'status',
        'image',
        'gallery',
        'start_date',
        'end_date',
        'voting_start',
        'voting_end',
        'entry_fee',
        'vote_price',
        'currency',
        'is_free',
        'max_participants',
        'max_votes_per_user',
        'prizes',
        'rules',
        'criteria',
        'sponsors',
        'judges',
        'metadata',
        'created_by',
        'published_at'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'voting_start' => 'datetime',
        'voting_end' => 'datetime',
        'published_at' => 'datetime',
        'gallery' => 'array',
        'prizes' => 'array',
        'rules' => 'array',
        'criteria' => 'array',
        'sponsors' => 'array',
        'judges' => 'array',
        'metadata' => 'array',
        'is_free' => 'boolean',
        'entry_fee' => 'decimal:2',
        'vote_price' => 'decimal:2',
        'total_revenue' => 'decimal:2',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }

    public function isVotingOpen(): bool
    {
        if (!$this->voting_start || !$this->voting_end) {
            return $this->isActive();
        }
        
        return $this->status === 'voting' && 
               $this->voting_start <= now() && 
               $this->voting_end >= now();
    }

    public function isCompleted(): bool
    {
        return $this->end_date < now() || $this->status === 'completed';
    }

    public function canAcceptParticipants(): bool
    {
        if (!$this->max_participants) return true;
        return $this->total_participants < $this->max_participants;
    }

    public function formattedEntryFee(): string
    {
        if ($this->is_free || $this->entry_fee == 0) return 'Gratuit';
        return number_format($this->entry_fee, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function formattedVotePrice(): string
    {
        if ($this->vote_price == 0) return 'Gratuit';
        return number_format($this->vote_price, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function statusDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->status) {
                'draft' => 'Brouillon',
                'active' => 'Actif',
                'voting' => 'Vote en cours',
                'closed' => 'Fermé',
                'completed' => 'Terminé',
                default => $this->status
            }
        );
    }

    public function typeDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->type) {
                'voting' => 'Concours avec vote',
                'submission' => 'Soumission',
                'quiz' => 'Quiz',
                'challenge' => 'Défi',
                default => ucfirst($this->type)
            }
        );
    }

    public function categoryDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->category) {
                'innovation' => 'Innovation',
                'technology' => 'Technologie',
                'entrepreneurship' => 'Entrepreneuriat',
                'education' => 'Éducation',
                'arts' => 'Arts & Culture',
                'environment' => 'Environnement',
                'social' => 'Social',
                default => ucfirst($this->category)
            }
        );
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
    }

    public function scopeVoting($query)
    {
        return $query->where('status', 'voting')
                    ->where('voting_start', '<=', now())
                    ->where('voting_end', '>=', now());
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
