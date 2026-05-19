<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $approved = Project::approved()
            ->with(['user', 'media'])
            ->latest()
            ->get()
            ->map(fn($p) => $this->formatProject($p));

        $stats = [
            'total'    => Project::approved()->count(),
            'pending'  => Project::pending()->count(),
            'featured' => Project::approved()->where('featured', true)->count(),
        ];

        return Inertia::render('projects/index', [
            'user'     => auth()->user(),
            'projects' => $approved,
            'stats'    => $stats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'             => 'required|string|max:255',
            'category'          => 'required|string|max:100',
            'short_description' => 'required|string|max:300',
            'description'       => 'required|string|min:100',
            'project_url'       => 'nullable|url',
            'team_size'         => 'required|integer|min:1|max:50',
            'team_members'      => 'nullable|array',
            'budget_needed'     => 'nullable|integer|min:0',
            'media_ids'         => 'nullable|array',
            'media_ids.*'       => 'integer|exists:media,id',
        ]);

        $mediaIds = $data['media_ids'] ?? [];
        unset($data['media_ids']);

        $data['user_id']      = auth()->id();
        $data['status']       = 'pending';
        $data['submitted_at'] = now();

        $project = Project::create($data);

        if (!empty($mediaIds)) {
            Media::whereIn('id', $mediaIds)
                ->where('user_id', auth()->id())
                ->update(['mediable_type' => Project::class, 'mediable_id' => $project->id]);
        }

        return redirect('/projects')
            ->with('success', 'Votre projet a été soumis avec succès ! Il sera examiné par notre équipe dans les 48 h.');
    }

    private function formatProject(Project $p): array
    {
        return [
            'id'                => $p->id,
            'title'             => $p->title,
            'category'          => $p->category,
            'short_description' => $p->short_description,
            'description'       => $p->description,
            'project_url'       => $p->project_url,
            'team_size'         => $p->team_size,
            'team_members'      => $p->team_members,
            'budget_needed'     => $p->budget_needed,
            'budget_formatted'  => $p->budget_formatted,
            'status'            => $p->status,
            'status_label'      => $p->status_label,
            'featured'          => $p->featured,
            'submitted_at'      => $p->submitted_at?->toDateString(),
            'author_name'       => $p->user->name,
            'media'             => $p->media->map(fn($m) => $m->toApiArray())->values(),
        ];
    }
}
