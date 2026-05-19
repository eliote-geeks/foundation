<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    protected $fillable = [
        'title', 'description', 'amount', 'currency',
        'category', 'expense_date', 'payment_method',
        'status', 'reference', 'notes', 'created_by',
    ];

    protected $casts = [
        'expense_date' => 'date',
        'amount'       => 'decimal:2',
    ];

    public static array $categories = [
        'events'      => 'Événements',
        'admin'       => 'Administration',
        'marketing'   => 'Communication',
        'operations'  => 'Opérations',
        'grants'      => 'Subventions',
        'other'       => 'Autre',
    ];

    public static array $statuses = [
        'pending'   => 'En attente',
        'paid'      => 'Payée',
        'cancelled' => 'Annulée',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function getCategoryLabelAttribute(): string
    {
        return self::$categories[$this->category] ?? ucfirst($this->category);
    }

    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 0, ',', ' ') . ' ' . $this->currency;
    }
}
