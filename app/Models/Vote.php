<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Vote extends Model
{
    protected $fillable = [
        'contest_id',
        'user_id',
        'participant_name',
        'participant_id',
        'amount_paid',
        'currency',
        'payment_status',
        'payment_method',
        'transaction_id',
        'comment',
        'metadata',
        'voted_at'
    ];

    protected $casts = [
        'voted_at' => 'datetime',
        'metadata' => 'array',
        'amount_paid' => 'decimal:2',
    ];

    public function contest(): BelongsTo
    {
        return $this->belongsTo(Contest::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function formattedAmount(): string
    {
        return number_format($this->amount_paid, 0, ',', ' ') . ' ' . $this->currency;
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

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeByContest($query, $contestId)
    {
        return $query->where('contest_id', $contestId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
