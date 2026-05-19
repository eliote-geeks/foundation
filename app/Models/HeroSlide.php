<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'headline', 'headline_accent', 'tagline', 'badge_text',
        'cta_primary_label', 'cta_primary_url',
        'cta_secondary_label', 'cta_secondary_url',
        'is_active', 'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order'     => 'integer',
        ];
    }

    public static function activeFirst(): ?self
    {
        return self::where('is_active', true)->orderBy('order')->first();
    }
}
