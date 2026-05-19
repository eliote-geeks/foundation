<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10 MB
        ]);

        $file    = $request->file('file');
        $mime    = $file->getMimeType() ?? 'application/octet-stream';
        $isImage = str_starts_with($mime, 'image/');
        $path    = $file->store('uploads/' . date('Y/m'), 'public');

        $width = $height = null;
        if ($isImage) {
            [$width, $height] = @getimagesize($file->getPathname()) ?: [null, null];
        }

        $media = Media::create([
            'user_id'   => auth()->id(),
            'filename'  => $file->getClientOriginalName(),
            'path'      => $path,
            'disk'      => 'public',
            'mime_type' => $mime,
            'size'      => $file->getSize(),
            'width'     => $width,
            'height'    => $height,
            'is_image'  => $isImage,
        ]);

        return response()->json($media->toApiArray(), 201);
    }

    public function destroy(Media $media): JsonResponse
    {
        abort_if(
            $media->user_id !== auth()->id() && ! auth()->user()->is_admin,
            403,
            'Accès refusé'
        );

        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return response()->json(['success' => true]);
    }
}
