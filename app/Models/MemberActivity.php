<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'activity_type',
        'activity_title',
        'activity_description',
        'activity_data',
        'points_earned',
        'category',
        'subcategory',
        'source',
        'ip_address',
        'user_agent',
        'location',
        'latitude',
        'longitude',
        'is_verified',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'activity_data' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // Accessors
    public function getActivityTypeDisplayAttribute(): string
    {
        return match($this->activity_type) {
            'login' => 'Connexion',
            'profile_update' => 'Mise à jour du profil',
            'contest_participation' => 'Participation à un concours',
            'event_attendance' => 'Participation à un événement',
            'donation' => 'Don',
            'volunteer_work' => 'Travail bénévole',
            'ambassador_action' => 'Action d\'ambassadeur',
            'challenge_completion' => 'Défi terminé',
            'partnership_activity' => 'Activité de partenariat',
            'newsletter_engagement' => 'Engagement newsletter',
            'social_share' => 'Partage sur les réseaux sociaux',
            'referral' => 'Parrainage',
            'feedback_submission' => 'Soumission de feedback',
            'training_completion' => 'Formation terminée',
            default => 'Autre activité'
        };
    }

    public function getActivityDataValue(string $key, $default = null)
    {
        return data_get($this->activity_data, $key, $default);
    }

    // Scopes
    public function scopeByType($query, string $type)
    {
        return $query->where('activity_type', $type);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeUnverified($query)
    {
        return $query->where('is_verified', false);
    }

    public function scopeWithPoints($query, int $minPoints = 1)
    {
        return $query->where('points_earned', '>=', $minPoints);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeByLocation($query, string $location)
    {
        return $query->where('location', 'like', '%' . $location . '%');
    }

    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }

    // Méthodes utilitaires
    public function verify(User $verifier): void
    {
        $this->update([
            'is_verified' => true,
            'verified_at' => now(),
            'verified_by' => $verifier->id,
        ]);
    }

    public function unverify(): void
    {
        $this->update([
            'is_verified' => false,
            'verified_at' => null,
            'verified_by' => null,
        ]);
    }

    public function setActivityData(string $key, $value): void
    {
        $data = $this->activity_data ?? [];
        data_set($data, $key, $value);
        $this->update(['activity_data' => $data]);
    }

    public function addActivityData(array $data): void
    {
        $existingData = $this->activity_data ?? [];
        $this->update(['activity_data' => array_merge($existingData, $data)]);
    }

    // Méthodes statiques pour la création rapide d'activités
    public static function createLogin(User $user, array $data = []): self
    {
        return self::create([
            'user_id' => $user->id,
            'activity_type' => 'login',
            'activity_title' => 'Connexion utilisateur',
            'activity_data' => $data,
            'points_earned' => 5,
            'source' => request()->header('User-Agent') ? 'web' : 'unknown',
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);
    }

    public static function createProfileUpdate(User $user, array $changes = []): self
    {
        return self::create([
            'user_id' => $user->id,
            'activity_type' => 'profile_update',
            'activity_title' => 'Mise à jour du profil',
            'activity_data' => ['changes' => $changes],
            'points_earned' => 10,
            'source' => 'web',
            'ip_address' => request()->ip(),
        ]);
    }

    public static function createContestParticipation(User $user, string $contestName, array $data = []): self
    {
        return self::create([
            'user_id' => $user->id,
            'activity_type' => 'contest_participation',
            'activity_title' => 'Participation au concours: ' . $contestName,
            'activity_data' => $data,
            'points_earned' => 50,
            'category' => 'engagement',
            'subcategory' => 'contest',
            'source' => 'web',
            'ip_address' => request()->ip(),
        ]);
    }

    public static function createDonation(User $user, float $amount, string $currency = 'XAF'): self
    {
        return self::create([
            'user_id' => $user->id,
            'activity_type' => 'donation',
            'activity_title' => "Don de {$amount} {$currency}",
            'activity_data' => [
                'amount' => $amount,
                'currency' => $currency,
                'payment_method' => 'unknown'
            ],
            'points_earned' => (int)($amount / 1000 * 10), // 10 points par 1000 XAF
            'category' => 'financial',
            'subcategory' => 'donation',
            'source' => 'web',
            'ip_address' => request()->ip(),
        ]);
    }

    public static function createSocialShare(User $user, string $platform, string $content): self
    {
        return self::create([
            'user_id' => $user->id,
            'activity_type' => 'social_share',
            'activity_title' => "Partage sur {$platform}",
            'activity_data' => [
                'platform' => $platform,
                'content' => $content
            ],
            'points_earned' => 15,
            'category' => 'marketing',
            'subcategory' => 'social_media',
            'source' => $platform,
            'ip_address' => request()->ip(),
        ]);
    }
}