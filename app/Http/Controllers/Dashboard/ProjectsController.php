<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    public function index(): Response
    {
        $projects = Project::with(['user', 'media'])
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id'                => $p->id,
                'title'             => $p->title,
                'category'          => $p->category,
                'short_description' => $p->short_description,
                'status'            => $p->status,
                'status_label'      => $p->status_label,
                'featured'          => $p->featured,
                'submitted_at'      => $p->submitted_at?->toDateString(),
                'author_name'       => $p->user->name,
                'author_email'      => $p->user->email,
                'team_size'         => $p->team_size,
                'budget_formatted'  => $p->budget_formatted,
                'media_count'       => $p->media->count(),
                'media'             => $p->media->map(fn($m) => $m->toApiArray())->values(),
                'description'       => $p->description,
                'project_url'       => $p->project_url,
                'admin_notes'       => $p->admin_notes,
            ]);

        return Inertia::render('dashboard/projects', [
            'projects' => $projects,
            'stats'    => [
                'pending'  => Project::pending()->count(),
                'approved' => Project::approved()->count(),
                'total'    => Project::count(),
            ],
        ]);
    }

    public function approve(Request $request, Project $project): RedirectResponse
    {
        $project->update([
            'status'      => 'approved',
            'admin_notes' => $request->input('notes'),
            'featured'    => $request->boolean('featured'),
        ]);

        return back()->with('success', "Projet « {$project->title} » approuvé.");
    }

    public function reject(Request $request, Project $project): RedirectResponse
    {
        $request->validate(['notes' => 'required|string|min:10']);

        $project->update([
            'status'      => 'rejected',
            'admin_notes' => $request->input('notes'),
        ]);

        return back()->with('success', "Projet « {$project->title} » rejeté.");
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->media->each(function ($m) {
            \Illuminate\Support\Facades\Storage::disk($m->disk)->delete($m->path);
            $m->delete();
        });
        $project->delete();

        return back()->with('success', 'Projet supprimé.');
    }
}
