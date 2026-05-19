<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRegistration extends Model
{
    protected $fillable = [
        'event_id',
        'full_name',
        'email',
        'phone',
        'quantity',
        'status',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}

