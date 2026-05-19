<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HeroSlideController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/hero', [
            'slides' => HeroSlide::orderBy('order')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'headline'            => 'required|string|max:120',
            'headline_accent'     => 'nullable|string|max:120',
            'tagline'             => 'nullable|string|max:400',
            'badge_text'          => 'nullable|string|max:80',
            'cta_primary_label'   => 'nullable|string|max:60',
            'cta_primary_url'     => 'nullable|string|max:200',
            'cta_secondary_label' => 'nullable|string|max:60',
            'cta_secondary_url'   => 'nullable|string|max:200',
            'is_active'           => 'boolean',
            'order'               => 'integer',
        ]);

        HeroSlide::create($data);

        return back()->with('success', 'Slide hero ajouté.');
    }

    public function update(Request $request, HeroSlide $heroSlide)
    {
        $data = $request->validate([
            'headline'            => 'required|string|max:120',
            'headline_accent'     => 'nullable|string|max:120',
            'tagline'             => 'nullable|string|max:400',
            'badge_text'          => 'nullable|string|max:80',
            'cta_primary_label'   => 'nullable|string|max:60',
            'cta_primary_url'     => 'nullable|string|max:200',
            'cta_secondary_label' => 'nullable|string|max:60',
            'cta_secondary_url'   => 'nullable|string|max:200',
            'is_active'           => 'boolean',
            'order'               => 'integer',
        ]);

        $heroSlide->update($data);

        return back()->with('success', 'Slide hero mis à jour.');
    }

    public function destroy(HeroSlide $heroSlide)
    {
        $heroSlide->delete();
        return back()->with('success', 'Slide hero supprimé.');
    }
}
