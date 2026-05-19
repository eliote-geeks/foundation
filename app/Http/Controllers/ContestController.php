<?php

namespace App\Http\Controllers;

use App\Models\Contest;
use App\Models\ContestEntry;
use App\Models\SiteSetting;
use App\Models\Vote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContestController extends Controller
{
    public function show(Contest $contest): Response
    {
        $user = auth()->user();

        $entries = $contest->entries()
            ->with('user')
            ->approved()
            ->orderByDesc('votes_count')
            ->get()
            ->map(fn ($e) => [
                'id'          => $e->id,
                'title'       => $e->title,
                'description' => $e->description,
                'category'    => $e->category,
                'project_url' => $e->project_url,
                'team_members'=> $e->team_members,
                'votes_count' => $e->votes_count,
                'author_name' => $e->user->name,
                'submitted_at'=> $e->submitted_at?->toDateString(),
            ]);

        $userEntry = $user
            ? $contest->entries()->where('user_id', $user->id)->first()
            : null;

        $userHasVoted = $user
            ? Vote::where('contest_id', $contest->id)->where('user_id', $user->id)->where('payment_status', 'paid')->exists()
            : false;

        $settings = SiteSetting::group('donations');

        return Inertia::render('contests/show', [
            'contest' => [
                'id'               => $contest->id,
                'title'            => $contest->title,
                'description'      => $contest->description,
                'short_description'=> $contest->short_description,
                'category'         => $contest->category,
                'status'           => $contest->status,
                'start_date'       => $contest->start_date?->toDateString(),
                'end_date'         => $contest->end_date?->toDateString(),
                'voting_start'     => $contest->voting_start?->toDateString(),
                'voting_end'       => $contest->voting_end?->toDateString(),
                'vote_price'       => (float) $contest->vote_price,
                'vote_price_fmt'   => $contest->formattedVotePrice(),
                'currency'         => $contest->currency,
                'is_free'          => $contest->is_free,
                'entry_fee'        => (float) $contest->entry_fee,
                'prizes'           => $contest->prizes,
                'rules'            => $contest->rules,
                'image'            => $contest->image,
                'is_voting_open'   => $contest->isVotingOpen(),
                'is_active'        => $contest->isActive(),
                'total_votes'      => Vote::where('contest_id', $contest->id)->where('payment_status', 'paid')->count(),
            ],
            'entries'      => $entries,
            'userEntry'    => $userEntry ? [
                'id'     => $userEntry->id,
                'title'  => $userEntry->title,
                'status' => $userEntry->status,
                'status_label' => $userEntry->status_label,
            ] : null,
            'userHasVoted' => $userHasVoted,
            'user'         => $user,
            'settings'     => [
                'mtn_number'    => $settings['donation_mtn_number'] ?? '+237 6XX XXX XXX',
                'orange_number' => $settings['donation_orange_number'] ?? '+237 6XX XXX XXX',
            ],
        ]);
    }

    public function submitEntry(Request $request, Contest $contest): RedirectResponse
    {
        if (!auth()->check()) {
            return redirect('/login')->with('error', 'Connectez-vous pour soumettre un projet.');
        }

        if (!$contest->isActive()) {
            return back()->with('error', 'Les soumissions sont fermées pour ce concours.');
        }

        if ($contest->entries()->where('user_id', auth()->id())->exists()) {
            return back()->with('error', 'Vous avez déjà soumis un projet pour ce concours.');
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'category'    => 'nullable|string|max:100',
            'project_url' => 'nullable|url',
            'team_members'=> 'nullable|array',
        ]);

        $data['contest_id']    = $contest->id;
        $data['user_id']       = auth()->id();
        $data['entry_number']  = ContestEntry::generateEntryNumber($contest->id);
        $data['status']        = 'pending';
        $data['submitted_at']  = now();

        ContestEntry::create($data);

        return back()->with('success', 'Votre projet a été soumis avec succès ! Il sera examiné par notre équipe.');
    }

    public function submitVote(Request $request, Contest $contest): RedirectResponse
    {
        if (!auth()->check()) {
            return redirect('/login')->with('error', 'Connectez-vous pour voter.');
        }

        if (!$contest->isVotingOpen()) {
            return back()->with('error', 'Les votes ne sont pas ouverts pour ce concours.');
        }

        if (Vote::where('contest_id', $contest->id)->where('user_id', auth()->id())->where('payment_status', 'paid')->exists()) {
            return back()->with('error', 'Vous avez déjà voté pour ce concours.');
        }

        $data = $request->validate([
            'entry_id'         => 'required|exists:contest_entries,id',
            'payment_method'   => 'required|in:mtn,orange',
            'transaction_ref'  => 'required|string|max:100',
            'voter_phone'      => 'required|string|max:20',
        ]);

        $entry = ContestEntry::findOrFail($data['entry_id']);

        Vote::create([
            'contest_id'      => $contest->id,
            'user_id'         => auth()->id(),
            'participant_id'  => $entry->id,
            'participant_name'=> $entry->title,
            'amount_paid'     => $contest->vote_price,
            'currency'        => $contest->currency,
            'payment_status'  => 'pending',
            'payment_method'  => $data['payment_method'] === 'mtn' ? 'MTN Mobile Money' : 'Orange Money',
            'transaction_id'  => $data['transaction_ref'],
            'metadata'        => ['voter_phone' => $data['voter_phone']],
        ]);

        return back()->with('success', 'Vote enregistré ! Il sera confirmé après vérification du paiement.');
    }
}
