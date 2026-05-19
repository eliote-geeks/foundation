<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'role', 'city', 'content', 'rating',
        'icon', 'icon_color', 'icon_bg', 'is_active', 'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'rating'    => 'integer',
            'order'     => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order')->orderBy('id');
    }
}
