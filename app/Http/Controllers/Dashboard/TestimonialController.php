<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/testimonials', [
            'testimonials' => Testimonial::orderBy('order')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'role'       => 'nullable|string|max:100',
            'city'       => 'nullable|string|max:100',
            'content'    => 'required|string|max:600',
            'rating'     => 'required|integer|min:1|max:5',
            'icon'       => 'nullable|string|max:60',
            'icon_color' => 'nullable|string|max:20',
            'icon_bg'    => 'nullable|string|max:20',
            'is_active'  => 'boolean',
            'order'      => 'integer',
        ]);

        Testimonial::create($data);

        return back()->with('success', 'Témoignage ajouté.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'role'       => 'nullable|string|max:100',
            'city'       => 'nullable|string|max:100',
            'content'    => 'required|string|max:600',
            'rating'     => 'required|integer|min:1|max:5',
            'icon'       => 'nullable|string|max:60',
            'icon_color' => 'nullable|string|max:20',
            'icon_bg'    => 'nullable|string|max:20',
            'is_active'  => 'boolean',
            'order'      => 'integer',
        ]);

        $testimonial->update($data);

        return back()->with('success', 'Témoignage mis à jour.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return back()->with('success', 'Témoignage supprimé.');
    }
}
