<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'member_type',
        'first_name',
        'last_name',
        'phone',
        'birth_date',
        'gender',
        'address',
        'city',
        'postal_code',
        'country',
        'profession',
        'company',
        'bio',
        'interests',
        'skills',
        'preferred_language',
        'type_specific_data',
        'is_active',
        'joined_at',
        'engagement_score',
        'last_activity_at',
        'accepts_newsletter',
        'accepts_sms',
        'accepts_phone_calls',
        'notification_preferences',
        'linkedin_url',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'avatar_path',
        'documents',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'joined_at' => 'date',
        'last_activity_at' => 'datetime',
        'interests' => 'array',
        'skills' => 'array',
        'type_specific_data' => 'array',
        'notification_preferences' => 'array',
        'documents' => 'array',
        'is_active' => 'boolean',
        'accepts_newsletter' => 'boolean',
        'accepts_sms' => 'boolean',
        'accepts_phone_calls' => 'boolean',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(MemberActivity::class, 'user_id', 'user_id');
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getAgeAttribute(): ?int
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }

    public function getMemberTypeDisplayAttribute(): string
    {
        return match($this->member_type) {
            'adherent' => 'Adhérent Fondation',
            'ambassador' => 'Ambassadeur',
            'former_challenger' => 'Ancien Challenger',
            'partner' => 'Partenaire',
            'volunteer' => 'Bénévole',
            'beneficiary' => 'Bénéficiaire',
            default => 'Membre'
        };
    }

    public function getEngagementLevelAttribute(): string
    {
        return match(true) {
            $this->engagement_score >= 1000 => 'Très élevé',
            $this->engagement_score >= 500 => 'Élevé',
            $this->engagement_score >= 200 => 'Moyen',
            $this->engagement_score >= 50 => 'Faible',
            default => 'Très faible'
        };
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByMemberType($query, string $type)
    {
        return $query->where('member_type', $type);
    }

    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    public function scopeByCountry($query, string $country)
    {
        return $query->where('country', $country);
    }

    public function scopeHighEngagement($query, int $minScore = 500)
    {
        return $query->where('engagement_score', '>=', $minScore);
    }

    public function scopeRecentlyActive($query, int $days = 30)
    {
        return $query->where('last_activity_at', '>=', now()->subDays($days));
    }

    public function scopeAcceptsNewsletter($query)
    {
        return $query->where('accepts_newsletter', true);
    }

    public function scopeWithInterests($query, array $interests)
    {
        return $query->whereJsonOverlaps('interests', $interests);
    }

    public function scopeWithSkills($query, array $skills)
    {
        return $query->whereJsonOverlaps('skills', $skills);
    }

    // Méthodes utilitaires
    public function updateEngagementScore(int $points): void
    {
        $this->increment('engagement_score', $points);
        $this->update(['last_activity_at' => now()]);
    }

    public function addActivity(string $type, string $title, array $data = [], int $points = 0): MemberActivity
    {
        $activity = $this->activities()->create([
            'activity_type' => $type,
            'activity_title' => $title,
            'activity_data' => $data,
            'points_earned' => $points,
        ]);

        if ($points > 0) {
            $this->updateEngagementScore($points);
        }

        return $activity;
    }

    public function hasInterest(string $interest): bool
    {
        return in_array($interest, $this->interests ?? []);
    }

    public function hasSkill(string $skill): bool
    {
        return in_array($skill, $this->skills ?? []);
    }

    public function addInterest(string $interest): void
    {
        $interests = $this->interests ?? [];
        if (!in_array($interest, $interests)) {
            $interests[] = $interest;
            $this->update(['interests' => $interests]);
        }
    }

    public function removeInterest(string $interest): void
    {
        $interests = $this->interests ?? [];
        $interests = array_filter($interests, fn($i) => $i !== $interest);
        $this->update(['interests' => array_values($interests)]);
    }

    public function addSkill(string $skill): void
    {
        $skills = $this->skills ?? [];
        if (!in_array($skill, $skills)) {
            $skills[] = $skill;
            $this->update(['skills' => $skills]);
        }
    }

    public function removeSkill(string $skill): void
    {
        $skills = $this->skills ?? [];
        $skills = array_filter($skills, fn($s) => $s !== $skill);
        $this->update(['skills' => array_values($skills)]);
    }

    public function getTypeSpecificData(string $key, $default = null)
    {
        return data_get($this->type_specific_data, $key, $default);
    }

    public function setTypeSpecificData(string $key, $value): void
    {
        $data = $this->type_specific_data ?? [];
        data_set($data, $key, $value);
        $this->update(['type_specific_data' => $data]);
    }

    public function canReceiveNotification(string $channel): bool
    {
        return match($channel) {
            'email' => $this->accepts_newsletter,
            'sms' => $this->accepts_sms,
            'phone' => $this->accepts_phone_calls,
            default => false
        };
    }
}