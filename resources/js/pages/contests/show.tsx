import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';
import { Modal, Form, Button } from 'react-bootstrap';
import { MediaUploader, type UploadedMedia } from '../../components/ui/MediaUploader';

interface MediaItem {
    id: number;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    size_fmt: string;
    is_image: boolean;
    width?: number | null;
    height?: number | null;
}

interface Entry {
    id: number;
    title: string;
    description: string;
    category: string | null;
    project_url: string | null;
    team_members: string[] | null;
    votes_count: number;
    author_name: string;
    submitted_at: string | null;
    media: MediaItem[];
}

interface ContestDetail {
    id: number;
    title: string;
    description: string;
    short_description: string | null;
    category: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    voting_start: string | null;
    voting_end: string | null;
    vote_price: number;
    vote_price_fmt: string;
    currency: string;
    is_free: boolean;
    entry_fee: number;
    prizes: { label: string; value: string }[] | null;
    rules: string[] | null;
    image: string | null;
    is_voting_open: boolean;
    is_active: boolean;
    total_votes: number;
}

interface ShowProps {
    user?: { name: string; email: string; is_admin?: boolean };
    contest: ContestDetail;
    entries: Entry[];
    userEntry: { id: number; title: string; status: string; status_label: string } | null;
    userHasVoted: boolean;
    settings: { mtn_number: string; orange_number: string };
}

const STATUS_COLORS: Record<string, { label: string; bg: string; color: string }> = {
    active:    { label: 'Actif',           bg: 'rgba(22,163,74,0.12)',   color: '#15803d' },
    voting:    { label: 'Vote en cours',   bg: 'rgba(29,78,216,0.12)',   color: '#1d4ed8' },
    upcoming:  { label: 'À venir',         bg: 'rgba(146,64,14,0.12)',   color: '#92400e' },
    completed: { label: 'Terminé',         bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
    closed:    { label: 'Fermé',           bg: 'rgba(185,28,28,0.12)',   color: '#b91c1c' },
};

export default function ContestShow({ user, contest, entries, userEntry, userHasVoted, settings }: ShowProps) {
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
    const [flash, setFlash] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [lightbox, setLightbox] = useState<string | null>(null);

    const st = STATUS_COLORS[contest.status] ?? STATUS_COLORS.upcoming;

    const submitForm = useForm({
        title: '',
        description: '',
        category: '',
        project_url: '',
        team_members: [] as string[],
        media_ids: [] as number[],
    });

    const voteForm = useForm({
        entry_id: '',
        voter_phone: '',
    });

    function handleSubmitEntry(e: React.FormEvent) {
        e.preventDefault();
        submitForm.post(`/contests/${contest.id}/entries`, {
            onSuccess: () => {
                setShowSubmitModal(false);
                setFlash({ type: 'success', msg: 'Projet soumis ! Il sera examiné par notre équipe.' });
                submitForm.reset();
            },
            onError: () => setFlash({ type: 'error', msg: 'Erreur lors de la soumission.' }),
        });
    }

    function openVote(entry: Entry) {
        setSelectedEntry(entry);
        voteForm.setData('entry_id', String(entry.id));
        setShowVoteModal(true);
    }

    function handleVote(e: React.FormEvent) {
        e.preventDefault();
        voteForm.post(`/contests/${contest.id}/vote`, {
            onError: () => setFlash({ type: 'error', msg: 'Erreur lors du vote.' }),
        });
    }

    return (
        <>
            <Head title={`${contest.title} — TITI EVENTS`} />
            <ModernHeader user={user} />

            <div style={{ background: 'var(--titi-surface)', minHeight: '100vh', paddingTop: 66 }}>

                {/* Flash message */}
                {flash && (
                    <div style={{
                        position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
                        zIndex: 2000, padding: '10px 20px', borderRadius: 8, fontWeight: 500,
                        background: flash.type === 'success' ? 'rgba(22,163,74,0.1)' : 'rgba(185,28,28,0.1)',
                        border: `1px solid ${flash.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                        color: flash.type === 'success' ? '#15803d' : '#b91c1c',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}>
                        <i className={`bi ${flash.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                        {flash.msg}
                        <button onClick={() => setFlash(null)} style={{ background: 'none', border: 'none', marginLeft: 12, cursor: 'pointer', opacity: 0.6 }}>✕</button>
                    </div>
                )}

                {/* Lightbox */}
                {lightbox && (
                    <div
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.88)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'zoom-out',
                        }}
                    >
                        <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
                        <button
                            onClick={() => setLightbox(null)}
                            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
                        >×</button>
                    </div>
                )}

                {/* Header */}
                <div style={{ background: 'var(--titi-white)', borderBottom: '1px solid var(--titi-border)', padding: '28px 0' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <Link href="/contests" style={{ color: 'var(--titi-sub)', fontSize: '0.875rem', textDecoration: 'none' }}>
                                        <i className="bi bi-arrow-left me-1"></i>Concours
                                    </Link>
                                    <span style={{ color: 'var(--titi-border)' }}>/</span>
                                    <span style={{ color: 'var(--titi-sub)', fontSize: '0.875rem' }}>{contest.title}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--titi-text)', margin: 0 }}>{contest.title}</h1>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color }}>
                                        {st.label}
                                    </span>
                                </div>
                                {contest.short_description && (
                                    <p style={{ color: 'var(--titi-sub)', marginTop: 8, marginBottom: 0 }}>{contest.short_description}</p>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                                {contest.is_active && !userEntry && user && (
                                    <button
                                        onClick={() => setShowSubmitModal(true)}
                                        style={{ height: 38, padding: '0 16px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                                    >
                                        <i className="bi bi-lightbulb me-2"></i>Soumettre un projet
                                    </button>
                                )}
                                {contest.is_active && !user && (
                                    <Link href="/register" style={{ height: 38, padding: '0 16px', lineHeight: '38px', background: '#16A34A', color: '#fff', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block' }}>
                                        <i className="bi bi-person-plus me-2"></i>Participer
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                            {contest.end_date && (
                                <span style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)' }}>
                                    <i className="bi bi-calendar-event me-1"></i>
                                    Fin des soumissions : {new Date(contest.end_date).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                            <span style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)' }}>
                                <i className="bi bi-people me-1"></i>{entries.length} projet{entries.length !== 1 ? 's' : ''}
                            </span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)' }}>
                                <i className="bi bi-hand-thumbs-up me-1"></i>{contest.total_votes} vote{contest.total_votes !== 1 ? 's' : ''}
                            </span>
                            {contest.vote_price > 0 && (
                                <span style={{ fontSize: '0.8125rem', color: '#c69438', fontWeight: 600 }}>
                                    <i className="bi bi-currency-exchange me-1"></i>Vote : {contest.vote_price_fmt}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

                        {/* Main */}
                        <div>
                            {userEntry && (
                                <div style={{
                                    padding: '14px 18px', borderRadius: 10, marginBottom: 20,
                                    background: userEntry.status === 'approved' ? 'rgba(22,163,74,0.1)' : userEntry.status === 'rejected' ? 'rgba(185,28,28,0.1)' : 'rgba(245,158,11,0.1)',
                                    border: `1px solid ${userEntry.status === 'approved' ? '#bbf7d0' : userEntry.status === 'rejected' ? '#fecaca' : '#fde68a'}`,
                                }}>
                                    <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--titi-text)' }}>
                                        <i className={`bi ${userEntry.status === 'approved' ? 'bi-check-circle-fill text-success' : userEntry.status === 'rejected' ? 'bi-x-circle-fill text-danger' : 'bi-clock-fill text-warning'} me-2`}></i>
                                        Votre projet : {userEntry.title}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--titi-sub)' }}>Statut : <strong>{userEntry.status_label}</strong></div>
                                </div>
                            )}

                            {userHasVoted && (
                                <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(22,163,74,0.1)', border: '1px solid #bbf7d0', marginBottom: 16, fontSize: '0.875rem', color: '#15803d', fontWeight: 500 }}>
                                    <i className="bi bi-check-circle-fill me-2"></i>Vous avez voté pour ce concours
                                </div>
                            )}

                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 16 }}>
                                Projets en compétition
                                <span style={{ fontWeight: 400, fontSize: '0.875rem', color: 'var(--titi-sub)', marginLeft: 8 }}>({entries.length})</span>
                            </h2>

                            {entries.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--titi-white)', borderRadius: 10, border: '1px solid var(--titi-border)' }}>
                                    <i className="bi bi-inbox" style={{ fontSize: '2rem', color: 'var(--titi-sub)', display: 'block', marginBottom: 12 }}></i>
                                    <p style={{ color: 'var(--titi-sub)', margin: 0 }}>
                                        {contest.is_active ? 'Soyez le premier à soumettre un projet !' : 'Aucun projet soumis.'}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {entries.map((entry, rank) => (
                                        <div key={entry.id} style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 12, overflow: 'hidden' }}>
                                            {/* Media strip */}
                                            {entry.media.length > 0 && (
                                                <div style={{ display: 'flex', gap: 2, height: 160, overflow: 'hidden' }}>
                                                    {entry.media.slice(0, 4).map((m, mi) => (
                                                        m.is_image ? (
                                                            <div
                                                                key={m.id}
                                                                onClick={() => setLightbox(m.url)}
                                                                style={{
                                                                    flex: mi === 0 && entry.media.length === 1 ? '1' : mi === 0 ? '2' : '1',
                                                                    minWidth: 0,
                                                                    position: 'relative',
                                                                    cursor: 'zoom-in',
                                                                    overflow: 'hidden',
                                                                }}
                                                            >
                                                                <img
                                                                    src={m.url}
                                                                    alt={m.filename}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                                                                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                                                                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                                                                />
                                                                {mi === 3 && entry.media.length > 4 && (
                                                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>
                                                                        +{entry.media.length - 4}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <a
                                                                key={m.id}
                                                                href={m.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    flex: 1, minWidth: 0,
                                                                    background: 'var(--titi-surface)',
                                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                                    textDecoration: 'none', color: 'var(--titi-sub)',
                                                                    padding: '12px 8px',
                                                                }}
                                                            >
                                                                <i className="bi bi-file-earmark-pdf" style={{ fontSize: '2rem', color: '#ef4444' }} />
                                                                <span style={{ fontSize: '0.7rem', textAlign: 'center', wordBreak: 'break-all' }}>{m.filename}</span>
                                                            </a>
                                                        )
                                                    ))}
                                                </div>
                                            )}

                                            {/* Entry content */}
                                            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                                    background: rank === 0 ? '#c69438' : rank === 1 ? '#9ca3af' : rank === 2 ? '#92400e' : 'var(--titi-border)',
                                                    color: rank < 3 ? '#fff' : 'var(--titi-sub)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem',
                                                }}>
                                                    {rank === 0 ? <i className="bi bi-trophy-fill"></i> : rank + 1}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 4 }}>{entry.title}</div>
                                                            <div style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginBottom: 6 }}>
                                                                Par {entry.author_name}
                                                                {entry.category && <span style={{ marginLeft: 8, padding: '1px 6px', background: 'var(--titi-surface)', borderRadius: 4, border: '1px solid var(--titi-border)' }}>{entry.category}</span>}
                                                            </div>
                                                            <p style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', margin: 0, lineHeight: 1.5 }}>
                                                                {entry.description.length > 180 ? entry.description.slice(0, 180) + '…' : entry.description}
                                                            </p>
                                                            {entry.project_url && (
                                                                <a href={entry.project_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#16A34A', textDecoration: 'none', marginTop: 6, display: 'inline-block' }}>
                                                                    <i className="bi bi-link-45deg me-1"></i>Voir le projet
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--titi-text)' }}>{entry.votes_count}</div>
                                                            <div style={{ fontSize: '0.6875rem', color: 'var(--titi-sub)' }}>votes</div>
                                                            {contest.is_voting_open && !userHasVoted && user && (
                                                                <button
                                                                    onClick={() => openVote(entry)}
                                                                    style={{ padding: '5px 12px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500 }}
                                                                >
                                                                    <i className="bi bi-hand-thumbs-up me-1"></i>Voter
                                                                    {contest.vote_price > 0 && <span style={{ marginLeft: 4, opacity: 0.85, fontSize: '0.75rem' }}>({contest.vote_price_fmt})</span>}
                                                                </button>
                                                            )}
                                                            {contest.is_voting_open && !user && (
                                                                <Link href="/login" style={{ padding: '5px 12px', background: '#16A34A', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 500 }}>
                                                                    Voter
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {contest.description && (
                                <div style={{ marginTop: 28, background: 'var(--titi-white)', borderRadius: 10, border: '1px solid var(--titi-border)', padding: '20px 24px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 12 }}>À propos du concours</h3>
                                    <p style={{ color: 'var(--titi-sub)', lineHeight: 1.7, margin: 0 }}>{contest.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {contest.prizes && contest.prizes.length > 0 && (
                                <div style={{ background: 'var(--titi-white)', borderRadius: 10, border: '1px solid var(--titi-border)', padding: '16px 18px' }}>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 12 }}>
                                        <i className="bi bi-trophy me-2 text-warning"></i>Prix
                                    </h3>
                                    {contest.prizes.map((prize, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < contest.prizes!.length - 1 ? '1px solid var(--titi-border)' : 'none' }}>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--titi-sub)' }}>{prize.label}</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--titi-text)' }}>{prize.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {contest.rules && contest.rules.length > 0 && (
                                <div style={{ background: 'var(--titi-white)', borderRadius: 10, border: '1px solid var(--titi-border)', padding: '16px 18px' }}>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 12 }}>
                                        <i className="bi bi-list-check me-2"></i>Règles
                                    </h3>
                                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                                        {contest.rules.map((rule, i) => (
                                            <li key={i} style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', marginBottom: 6 }}>{rule}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {contest.vote_price > 0 && (
                                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 16px' }}>
                                    <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 6, fontSize: '0.9375rem' }}>
                                        <i className="bi bi-info-circle me-2"></i>Vote payant
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', margin: 0, lineHeight: 1.6 }}>
                                        Chaque vote coûte <strong>{contest.vote_price_fmt}</strong>.<br />
                                        Payez via Mobile Money puis soumettez votre référence.
                                    </p>
                                </div>
                            )}

                            {contest.is_active && !userEntry && (
                                <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 10, padding: '16px 18px', textAlign: 'center' }}>
                                    <i className="bi bi-lightbulb" style={{ fontSize: '1.5rem', color: '#16A34A', display: 'block', marginBottom: 8 }}></i>
                                    <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 12px', fontWeight: 500 }}>Vous avez un projet innovant ?</p>
                                    {user ? (
                                        <button
                                            onClick={() => setShowSubmitModal(true)}
                                            style={{ width: '100%', padding: '8px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Soumettre mon projet
                                        </button>
                                    ) : (
                                        <Link href="/register" style={{ display: 'block', padding: '8px', background: '#16A34A', color: '#fff', borderRadius: 6, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                                            S'inscrire pour participer
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ModernFooter />

            {/* ── Submit entry modal ── */}
            <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                    <Modal.Title style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--titi-text)' }}>
                        <i className="bi bi-lightbulb me-2 text-success"></i>Soumettre un projet — {contest.title}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitEntry}>
                    <Modal.Body style={{ background: 'var(--titi-white)' }}>
                        <div className="d-flex flex-column gap-3">
                            <Form.Group>
                                <Form.Label className="small fw-semibold" style={{ color: 'var(--titi-sub)' }}>Titre du projet *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={submitForm.data.title}
                                    onChange={e => submitForm.setData('title', e.target.value)}
                                    isInvalid={!!submitForm.errors.title}
                                    placeholder="Ex: EcoTech Solutions"
                                    style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                />
                                <Form.Control.Feedback type="invalid">{submitForm.errors.title}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="small fw-semibold" style={{ color: 'var(--titi-sub)' }}>Description *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={submitForm.data.description}
                                    onChange={e => submitForm.setData('description', e.target.value)}
                                    isInvalid={!!submitForm.errors.description}
                                    placeholder="Décrivez votre projet, son impact, ses objectifs..."
                                    style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                />
                                <Form.Control.Feedback type="invalid">{submitForm.errors.description}</Form.Control.Feedback>
                            </Form.Group>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Form.Label className="small fw-semibold" style={{ color: 'var(--titi-sub)' }}>Catégorie</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={submitForm.data.category}
                                        onChange={e => submitForm.setData('category', e.target.value)}
                                        placeholder="Innovation, Environnement..."
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Form.Label className="small fw-semibold" style={{ color: 'var(--titi-sub)' }}>Lien du projet (optionnel)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        value={submitForm.data.project_url}
                                        onChange={e => submitForm.setData('project_url', e.target.value)}
                                        isInvalid={!!submitForm.errors.project_url}
                                        placeholder="https://..."
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{submitForm.errors.project_url}</Form.Control.Feedback>
                                </div>
                            </div>

                            {/* Media uploader */}
                            <div>
                                <div className="small fw-semibold mb-2" style={{ color: 'var(--titi-sub)' }}>
                                    Médias du projet (photos, documents)
                                </div>
                                <MediaUploader
                                    accept="image/*,application/pdf,video/*"
                                    multiple
                                    maxFiles={8}
                                    maxSizeMb={10}
                                    label="Glissez vos photos ou documents"
                                    hint="Images, PDF, vidéos · max 10 MB par fichier · 8 fichiers maximum"
                                    onChange={(media: UploadedMedia[]) => submitForm.setData('media_ids', media.map(m => m.id))}
                                />
                            </div>

                            {contest.entry_fee > 0 && (
                                <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.875rem', color: '#92400e' }}>
                                    <i className="bi bi-info-circle me-2"></i>
                                    Frais d'inscription : <strong>{contest.entry_fee.toLocaleString('fr-FR')} {contest.currency}</strong>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                        <Button variant="outline-secondary" onClick={() => setShowSubmitModal(false)}>Annuler</Button>
                        <Button type="submit" disabled={submitForm.processing} style={{ background: '#16A34A', borderColor: '#16A34A', color: '#fff' }}>
                            {submitForm.processing ? 'Envoi…' : 'Soumettre le projet'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── Vote modal ── */}
            <Modal show={showVoteModal} onHide={() => setShowVoteModal(false)} centered>
                <Modal.Header closeButton style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                    <Modal.Title style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--titi-text)' }}>
                        <i className="bi bi-hand-thumbs-up me-2 text-success"></i>
                        Voter — {selectedEntry?.title}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleVote}>
                    <Modal.Body style={{ background: 'var(--titi-white)' }}>
                        {contest.vote_price > 0 && (
                            <div style={{ padding: '12px 14px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <i className="bi bi-shield-lock-fill" style={{ color: '#16A34A', fontSize: '1.2rem', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#15803d', fontSize: '0.875rem' }}>Paiement sécurisé SharePay</div>
                                    <div style={{ fontSize: '0.8125rem', color: '#166534' }}>MTN MoMo &amp; Orange Money — {contest.vote_price_fmt}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 12, fontSize: '0.9375rem' }}>
                            <i className="bi bi-hand-thumbs-up me-2 text-success"></i>
                            Voter pour <strong>{selectedEntry?.title}</strong>
                        </div>

                        <Form.Group>
                            <Form.Label className="small fw-semibold" style={{ color: 'var(--titi-sub)' }}>Votre numéro de téléphone *</Form.Label>
                            <Form.Control
                                type="tel"
                                value={voteForm.data.voter_phone}
                                onChange={e => voteForm.setData('voter_phone', e.target.value)}
                                isInvalid={!!voteForm.errors.voter_phone}
                                placeholder="+237 6XX XXX XXX"
                                style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                            />
                            <Form.Control.Feedback type="invalid">{voteForm.errors.voter_phone}</Form.Control.Feedback>
                            <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginTop: 4 }}>Utilisé sur la page de paiement SharePay</div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                        <Button variant="outline-secondary" onClick={() => setShowVoteModal(false)}>Annuler</Button>
                        <Button type="submit" disabled={voteForm.processing} style={{ background: '#16A34A', borderColor: '#16A34A', color: '#fff' }}>
                            {voteForm.processing
                                ? <><i className="bi bi-hourglass-split me-1" />Redirection…</>
                                : <><i className="bi bi-lock-fill me-1" />{contest.vote_price > 0 ? `Payer ${contest.vote_price_fmt}` : 'Confirmer mon vote'}</>
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
