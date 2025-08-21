<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'short_description',
        'location',
        'address',
        'latitude',
        'longitude',
        'start_date',
        'end_date',
        'category',
        'status',
        'image',
        'gallery',
        'capacity',
        'price',
        'currency',
        'is_free',
        'requires_approval',
        'terms_conditions',
        'contact_info',
        'sponsors',
        'agenda',
        'speakers',
        'metadata',
        'created_by',
        'published_at'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'published_at' => 'datetime',
        'gallery' => 'array',
        'contact_info' => 'array',
        'sponsors' => 'array',
        'agenda' => 'array',
        'speakers' => 'array',
        'metadata' => 'array',
        'is_free' => 'boolean',
        'requires_approval' => 'boolean',
        'price' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'published' && 
               $this->start_date > now() && 
               $this->published_at !== null;
    }

    public function isOngoing(): bool
    {
        return $this->status === 'published' && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }

    public function isCompleted(): bool
    {
        return $this->end_date < now() || $this->status === 'completed';
    }

    public function availableTickets(): int
    {
        if (!$this->capacity) return PHP_INT_MAX;
        return max(0, $this->capacity - $this->tickets_sold);
    }

    public function formattedPrice(): string
    {
        if ($this->is_free) return 'Gratuit';
        return number_format($this->price, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function statusDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->status) {
                'draft' => 'Brouillon',
                'published' => 'Publié',
                'cancelled' => 'Annulé',
                'completed' => 'Terminé',
                default => $this->status
            }
        );
    }

    public function categoryDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->category) {
                'conference' => 'Conférence',
                'workshop' => 'Atelier',
                'seminar' => 'Séminaire',
                'networking' => 'Networking',
                'training' => 'Formation',
                'webinar' => 'Webinaire',
                'meetup' => 'Meetup',
                default => ucfirst($this->category)
            }
        );
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now());
    }

    public function scopeOngoing($query)
    {
        return $query->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
