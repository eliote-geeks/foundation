<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relations
    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function activities()
    {
        return $this->hasMany(MemberActivity::class);
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return $this->profile ? $this->profile->full_name : $this->name;
    }

    public function getMemberTypeAttribute(): string
    {
        return $this->profile ? $this->profile->member_type : 'adherent';
    }

    public function getEngagementScoreAttribute(): int
    {
        return $this->profile ? $this->profile->engagement_score : 0;
    }

    // Méthodes utilitaires
    public function hasProfile(): bool
    {
        return $this->profile !== null;
    }

    public function createProfile(array $data): UserProfile
    {
        return $this->profile()->create($data);
    }

    public function addActivity(string $type, string $title, array $data = [], int $points = 0): MemberActivity
    {
        return $this->activities()->create([
            'activity_type' => $type,
            'activity_title' => $title,
            'activity_data' => $data,
            'points_earned' => $points,
            'source' => 'web',
            'ip_address' => request()->ip(),
        ]);
    }

    public function updateEngagementScore(int $points): void
    {
        if ($this->profile) {
            $this->profile->updateEngagementScore($points);
        }
    }

    public function canReceiveNotification(string $channel): bool
    {
        return $this->profile ? $this->profile->canReceiveNotification($channel) : false;
    }
}
