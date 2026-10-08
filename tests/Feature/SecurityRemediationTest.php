<?php

use App\Models\Contest;
use App\Models\ContestEntry;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Partner;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function remediationEvent(User $creator, array $overrides = []): Event
{
    return Event::create(array_merge([
        'title' => 'Événement de test',
        'description' => 'Description de l’événement de test.',
        'location' => 'Yaoundé',
        'start_date' => now()->addWeek(),
        'end_date' => now()->addWeek()->addHours(2),
        'status' => 'published',
        'published_at' => now(),
        'capacity' => 10,
        'price' => 0,
        'currency' => 'XAF',
        'is_free' => true,
        'created_by' => $creator->id,
    ], $overrides));
}

function remediationContest(User $creator, array $overrides = []): Contest
{
    return Contest::create(array_merge([
        'title' => 'Concours de test',
        'description' => 'Description du concours de test.',
        'status' => 'voting',
        'start_date' => now()->subDay(),
        'end_date' => now()->addWeek(),
        'voting_start' => now()->subHour(),
        'voting_end' => now()->addDay(),
        'vote_price' => 0,
        'currency' => 'XAF',
        'is_free' => true,
        'created_by' => $creator->id,
    ], $overrides));
}

test('an executable upload is rejected while a supported image is accepted', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('media.upload'), [
            'file' => UploadedFile::fake()->create('payload.php', 1, 'application/x-php'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');

    $this->actingAs($user)
        ->postJson(route('media.upload'), [
            'file' => UploadedFile::fake()->image('photo.jpg'),
        ])
        ->assertCreated()
        ->assertJsonPath('mime_type', 'image/jpeg');

    expect(Storage::disk('public')->allFiles())->toHaveCount(1);
});

test('the payment cancel return page does not mutate a pending ticket', function () {
    $user = User::factory()->create();
    $event = remediationEvent($user, ['is_free' => false, 'price' => 1000]);
    $ticket = Ticket::create([
        'event_id' => $event->id,
        'user_id' => $user->id,
        'attendee_name' => 'Test User',
        'attendee_email' => 'test@example.com',
        'price_paid' => 1000,
        'currency' => 'XAF',
        'status' => 'pending',
        'payment_status' => 'pending',
        'transaction_id' => 'ref-cancel-test',
        'quantity' => 1,
    ]);

    $this->get(route('payment.cancel', ['reference' => 'ref-cancel-test']))->assertOk();

    expect($ticket->fresh()->payment_status)->toBe('pending')
        ->and($ticket->fresh()->status)->toBe('pending');
});

test('signed payment webhooks are idempotent and cannot downgrade a paid ticket', function () {
    config([
        'services.sharepay.api_key' => null,
        'services.sharepay.base_url' => null,
        'services.sharepay.webhook_secret' => 'test-webhook-secret',
    ]);

    $user = User::factory()->create();
    $event = remediationEvent($user, ['is_free' => false, 'price' => 1000]);
    $ticket = Ticket::create([
        'event_id' => $event->id,
        'user_id' => $user->id,
        'attendee_name' => 'Test User',
        'attendee_email' => 'test@example.com',
        'price_paid' => 1000,
        'currency' => 'XAF',
        'status' => 'pending',
        'payment_status' => 'pending',
        'transaction_id' => 'ref-webhook-test',
        'quantity' => 1,
    ]);

    $sendWebhook = function (string $event): void {
        $payload = json_encode([
            'event' => $event,
            'data' => ['reference' => 'ref-webhook-test'],
        ], JSON_THROW_ON_ERROR);

        $this->call('POST', route('webhook.sharepay'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_SHAREPAY_SIGNATURE' => hash_hmac('sha256', $payload, 'test-webhook-secret'),
        ], $payload)->assertOk();
    };

    $sendWebhook('payment.success');
    $sendWebhook('payment.failed');

    expect($ticket->fresh()->payment_status)->toBe('paid')
        ->and($ticket->fresh()->status)->toBe('confirmed');
});

test('public partner endpoints expose only active public fields', function () {
    Partner::factory()->active()->create([
        'name' => 'Partenaire public',
        'email' => 'private@example.com',
        'internal_notes' => 'Confidentiel',
        'contribution_amount' => 5000000,
    ]);
    $pending = Partner::factory()->pending()->create(['name' => 'Partenaire privé']);

    $response = $this->getJson(route('api.partners.index'))
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Partenaire public');

    expect($response->json('data.0'))->not->toHaveKeys([
        'email',
        'phone',
        'contact_person',
        'internal_notes',
        'contribution_amount',
    ]);

    $this->getJson(route('api.partners.show', $pending))->assertNotFound();
});

test('marking a vote as paid is idempotent and increments the correct entry once', function () {
    $admin = User::factory()->create();
    $voter = User::factory()->create();
    $contest = remediationContest($admin);
    $entry = ContestEntry::create([
        'contest_id' => $contest->id,
        'user_id' => $admin->id,
        'entry_number' => 'CE-IDEMPOTENT',
        'title' => 'Projet test',
        'description' => 'Une description suffisamment longue pour ce projet.',
        'status' => 'approved',
    ]);
    $vote = Vote::create([
        'contest_id' => $contest->id,
        'user_id' => $voter->id,
        'participant_id' => $entry->id,
        'participant_name' => $entry->title,
        'amount_paid' => 0,
        'currency' => 'XAF',
        'payment_status' => 'pending',
    ]);

    expect($vote->markAsPaid())->toBeTrue()
        ->and($vote->markAsPaid())->toBeFalse()
        ->and($entry->fresh()->votes_count)->toBe(1);
});

test('a vote cannot target an entry from another contest', function () {
    $admin = User::factory()->create();
    $voter = User::factory()->create();
    $contest = remediationContest($admin, ['title' => 'Concours A']);
    $otherContest = remediationContest($admin, ['title' => 'Concours B']);
    $foreignEntry = ContestEntry::create([
        'contest_id' => $otherContest->id,
        'user_id' => $admin->id,
        'entry_number' => 'CE-FOREIGN',
        'title' => 'Projet étranger',
        'description' => 'Une description suffisamment longue pour ce projet.',
        'status' => 'approved',
    ]);

    $this->actingAs($voter)
        ->post(route('contests.vote', $contest), [
            'entry_id' => $foreignEntry->id,
            'voter_phone' => '+237600000000',
        ])
        ->assertNotFound();

    expect(Vote::count())->toBe(0);
});

test('event reservations cannot exceed remaining capacity', function () {
    $admin = User::factory()->create();
    $event = remediationEvent($admin, ['capacity' => 2]);
    EventRegistration::create([
        'event_id' => $event->id,
        'full_name' => 'Première réservation',
        'email' => 'first@example.com',
        'quantity' => 2,
        'status' => 'confirmed',
    ]);

    $this->from(route('events.show', $event))
        ->post(route('events.reserve', $event), [
            'full_name' => 'Deuxième réservation',
            'email' => 'second@example.com',
            'quantity' => 1,
        ])
        ->assertRedirect(route('events.show', $event))
        ->assertSessionHasErrors('quantity');

    expect(EventRegistration::count())->toBe(1)
        ->and($event->availableTickets())->toBe(0);
});
