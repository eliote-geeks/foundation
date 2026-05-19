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
        'is_admin',
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
            'is_admin' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
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

    // Relations pour les dons
    public function donations()
    {
        return $this->hasMany(Donation::class, 'donor_id');
    }

    public function campaignsCreated()
    {
        return $this->hasMany(DonationCampaign::class, 'created_by');
    }

    public function campaignsResponsible()
    {
        return $this->hasMany(DonationCampaign::class, 'responsible_by');
    }

    public function completedDonations()
    {
        return $this->donations()->where('payment_status', 'completed');
    }

    // Méthodes pour les donateurs
    public function getTotalDonationsAttribute(): float
    {
        return $this->completedDonations()->sum('amount');
    }

    public function getDonationCountAttribute(): int
    {
        return $this->completedDonations()->count();
    }

    public function getAverageDonationAttribute(): float
    {
        return $this->completedDonations()->avg('amount') ?: 0;
    }

    public function getLastDonationAttribute(): ?Donation
    {
        return $this->completedDonations()->latest('donated_at')->first();
    }

    public function isDonor(): bool
    {
        return $this->completedDonations()->exists();
    }

    public function isRegularDonor(): bool
    {
        return $this->getDonationCountAttribute() >= 3;
    }

    public function isMajorDonor(): bool
    {
        return $this->getTotalDonationsAttribute() >= 500000; // 500k XAF
    }
}
