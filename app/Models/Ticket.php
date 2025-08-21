<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Ticket extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'ticket_number',
        'attendee_name',
        'attendee_email',
        'attendee_phone',
        'ticket_type',
        'price_paid',
        'currency',
        'status',
        'payment_status',
        'payment_method',
        'transaction_id',
        'notes',
        'metadata',
        'qr_code',
        'purchased_at',
        'checked_in_at',
        'checked_in_by'
    ];

    protected $casts = [
        'purchased_at' => 'datetime',
        'checked_in_at' => 'datetime',
        'metadata' => 'array',
        'price_paid' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($ticket) {
            if (empty($ticket->ticket_number)) {
                $ticket->ticket_number = 'TK-' . strtoupper(Str::random(10));
            }
        });
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    public function isCheckedIn(): bool
    {
        return $this->checked_in_at !== null;
    }

    public function canCheckIn(): bool
    {
        return $this->status === 'confirmed' && 
               $this->payment_status === 'paid' && 
               !$this->isCheckedIn();
    }

    public function formattedPrice(): string
    {
        return number_format($this->price_paid, 0, ',', ' ') . ' ' . $this->currency;
    }

    public function statusDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->status) {
                'pending' => 'En attente',
                'confirmed' => 'Confirmé',
                'cancelled' => 'Annulé',
                'used' => 'Utilisé',
                'refunded' => 'Remboursé',
                default => $this->status
            }
        );
    }

    public function paymentStatusDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->payment_status) {
                'pending' => 'En attente',
                'paid' => 'Payé',
                'failed' => 'Échec',
                'refunded' => 'Remboursé',
                default => $this->payment_status
            }
        );
    }

    public function ticketTypeDisplay(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->ticket_type) {
                'standard' => 'Standard',
                'vip' => 'VIP',
                'premium' => 'Premium',
                'student' => 'Étudiant',
                'group' => 'Groupe',
                default => ucfirst($this->ticket_type)
            }
        );
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeCheckedIn($query)
    {
        return $query->whereNotNull('checked_in_at');
    }

    public function scopeByEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }
}
