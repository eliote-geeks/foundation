<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContestEntry extends Model
{
    protected $fillable = [
        'contest_id', 'user_id', 'entry_number', 'title', 'description',
        'category', 'project_url', 'document_path', 'team_members',
        'status', 'admin_notes', 'votes_count', 'submitted_at',
    ];

    protected $casts = [
        'team_members' => 'array',
        'submitted_at' => 'datetime',
    ];

    public function contest(): BelongsTo
    {
        return $this->belongsTo(Contest::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class, 'participant_id');
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
            'pending'  => 'En attente',
            'approved' => 'Approuvé',
            'rejected' => 'Rejeté',
            default    => $this->status,
        };
    }

    public static function generateEntryNumber(int $contestId): string
    {
        $count = self::where('contest_id', $contestId)->count() + 1;
        return 'CE-' . $contestId . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
