<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $fillable = [
        'user_id', 'mediable_type', 'mediable_id',
        'filename', 'path', 'disk', 'mime_type',
        'size', 'width', 'height', 'is_image',
    ];

    protected $casts = [
        'is_image' => 'boolean',
        'size'     => 'integer',
        'width'    => 'integer',
        'height'   => 'integer',
    ];

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getSizeFormattedAttribute(): string
    {
        $bytes = $this->size;
        if ($bytes >= 1048576) return round($bytes / 1048576, 1) . ' MB';
        if ($bytes >= 1024)    return round($bytes / 1024, 0) . ' KB';
        return $bytes . ' B';
    }

    public function toApiArray(): array
    {
        return [
            'id'         => $this->id,
            'url'        => $this->url,
            'filename'   => $this->filename,
            'mime_type'  => $this->mime_type,
            'size'       => $this->size,
            'size_fmt'   => $this->size_formatted,
            'is_image'   => $this->is_image,
            'width'      => $this->width,
            'height'     => $this->height,
        ];
    }
}
