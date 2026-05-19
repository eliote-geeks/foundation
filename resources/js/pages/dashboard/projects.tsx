import DashboardLayout from '../../layouts/dashboard-layout';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Card, Row, Col, Button, Form, Modal } from 'react-bootstrap';

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

interface Project {
    id: number;
    title: string;
    category: string | null;
    short_description: string | null;
    status: string;
    status_label: string;
    featured: boolean;
    submitted_at: string | null;
    author_name: string;
    author_email: string;
    team_size: number;
    budget_formatted: string;
    media_count: number;
    media: MediaItem[];
    description: string;
    project_url: string | null;
    admin_notes: string | null;
}

interface Stats {
    pending: number;
    approved: number;
    total: number;
}

interface Props {
    user?: { name: string; email: string; is_admin?: boolean };
    projects: Project[];
    stats: Stats;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    pending:  { bg: 'rgba(245,158,11,0.12)',  text: '#D97706' },
    approved: { bg: 'rgba(22,163,74,0.12)',   text: '#16A34A' },
    rejected: { bg: 'rgba(220,38,38,0.12)',   text: '#DC2626' },
    draft:    { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' },
};

const TAB_LABELS: Record<string, string> = {
    pending: 'En attente', approved: 'Approuvés', rejected: 'Rejetés', all: 'Tous',
};

export default function DashboardProjects({ user, projects, stats }: Props) {
    const [tab, setTab]               = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [selected, setSelected]     = useState<Project | null>(null);
    const [lightbox, setLightbox]     = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

    const approveForm = useForm({ notes: '', featured: false as boolean });
    const rejectForm  = useForm({ notes: '' });

    const filtered = tab === 'all' ? projects : projects.filter(p => p.status === tab);

    const openPanel = (project: Project) => {
        setSelected(project);
        approveForm.setData({ notes: project.admin_notes ?? '', featured: project.featured });
        rejectForm.setData('notes', project.admin_notes ?? '');
    };

    const handleApprove = () => {
        if (!selected) return;
        approveForm.post(`/dashboard/projects/${selected.id}/approve`, {
            onSuccess: () => { approveForm.reset(); setSelected(null); },
        });
    };

    const handleReject = () => {
        if (!selected) return;
        rejectForm.post(`/dashboard/projects/${selected.id}/reject`, {
            onSuccess: () => { rejectForm.reset(); setSelected(null); },
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/dashboard/projects/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setSelected(null); },
        });
    };

    const sc = (status: string) => STATUS_COLORS[status] ?? STATUS_COLORS.draft;

    return (
        <DashboardLayout title="Projets soumis" user={user}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Page header */}
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: 'var(--titi-text)' }}>Projets soumis</h2>
                    <p className="mb-0" style={{ color: 'var(--titi-sub)', fontSize: '0.9rem' }}>
                        Examinez et validez les projets soumis par les utilisateurs
                    </p>
                </div>

                {/* Stats */}
                <Row className="g-3">
                    {[
                        { label: 'En attente', value: stats.pending,  icon: 'bi-hourglass-split',  color: '#D97706', bg: 'rgba(245,158,11,0.12)' },
                        { label: 'Approuvés',  value: stats.approved, icon: 'bi-check-circle-fill', color: '#16A34A', bg: 'rgba(22,163,74,0.12)'  },
                        { label: 'Total',      value: stats.total,    icon: 'bi-folder2-open',      color: '#5FA145', bg: 'rgba(95,161,69,0.12)'   },
                    ].map(s => (
                        <Col key={s.label} md={4}>
                            <Card className="border-0 h-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: 'var(--titi-white)' }}>
                                <Card.Body className="p-4 d-flex align-items-center gap-3">
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className={`bi ${s.icon}`} style={{ fontSize: '1.4rem', color: s.color }} />
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ fontSize: '1.75rem', color: 'var(--titi-text)', lineHeight: 1 }}>{s.value}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--titi-sub)' }}>{s.label}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Tab list */}
                <Card className="border-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: 'var(--titi-white)' }}>
                    <div style={{ borderBottom: '1px solid var(--titi-border)', padding: '0 24px', display: 'flex', gap: 4 }}>
                        {(['pending', 'approved', 'rejected', 'all'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                border: 'none', background: 'none', padding: '14px 16px',
                                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                                color: tab === t ? '#5FA145' : 'var(--titi-sub)',
                                borderBottom: tab === t ? '2px solid #5FA145' : '2px solid transparent',
                                transition: 'color 0.15s',
                            }}>
                                {TAB_LABELS[t]}{' '}
                                <span style={{
                                    background: tab === t ? 'rgba(95,161,69,0.12)' : 'var(--titi-surface)',
                                    color: tab === t ? '#5FA145' : 'var(--titi-sub)',
                                    borderRadius: 20, padding: '1px 8px', fontSize: '0.75rem',
                                }}>
                                    {t === 'all' ? projects.length : projects.filter(p => p.status === t).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-5" style={{ color: 'var(--titi-sub)' }}>
                            <i className="bi bi-inbox" style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }} />
                            Aucun projet dans cette catégorie
                        </div>
                    ) : filtered.map((project, idx) => {
                        const cover = project.media.find(m => m.is_image);
                        const s = sc(project.status);
                        return (
                            <div
                                key={project.id}
                                style={{
                                    padding: '14px 24px',
                                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--titi-border)' : 'none',
                                    display: 'flex', alignItems: 'center', gap: 16, transition: 'background 0.15s', cursor: 'default',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--titi-surface)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Cover thumb */}
                                <div style={{ width: 52, height: 52, borderRadius: 8, flexShrink: 0, overflow: 'hidden', background: 'var(--titi-surface)', border: '1px solid var(--titi-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {cover
                                        ? <img src={cover.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <i className="bi bi-image" style={{ color: 'var(--titi-sub)', fontSize: '1.3rem' }} />
                                    }
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="fw-semibold" style={{ color: 'var(--titi-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {project.title}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginTop: 2 }}>
                                        {project.author_name} · {project.category ?? '—'} · {project.submitted_at ?? '—'}
                                    </div>
                                </div>

                                <span style={{ background: s.bg, color: s.text, borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 500, flexShrink: 0 }}>
                                    {project.status_label}
                                </span>

                                {project.media_count > 0 && (
                                    <span style={{ color: 'var(--titi-sub)', fontSize: '0.8125rem', flexShrink: 0 }}>
                                        <i className="bi bi-images me-1" />{project.media_count}
                                    </span>
                                )}

                                <Button size="sm" variant="outline-secondary" style={{ flexShrink: 0, fontSize: '0.8125rem' }}
                                    onClick={() => openPanel(project)}>
                                    Examiner <i className="bi bi-chevron-right ms-1" />
                                </Button>
                            </div>
                        );
                    })}
                </Card>
            </div>

            {/* ── Slide-out detail panel ── */}
            {selected && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.45)' }}
                    onClick={() => setSelected(null)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: 560, height: '100vh', overflowY: 'auto', background: 'var(--titi-white)', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Panel header (sticky) */}
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--titi-border)', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: 'var(--titi-white)', zIndex: 1 }}>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: 'var(--titi-sub)', borderRadius: 6 }}>
                                <i className="bi bi-x-lg" style={{ fontSize: '1rem' }} />
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="fw-bold" style={{ color: 'var(--titi-text)', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {selected.title}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--titi-sub)' }}>{selected.author_name} · {selected.author_email}</div>
                            </div>
                            {(() => { const s = sc(selected.status); return (
                                <span style={{ background: s.bg, color: s.text, borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 500 }}>
                                    {selected.status_label}
                                </span>
                            ); })()}
                        </div>

                        {/* Panel body */}
                        <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Media gallery */}
                            {selected.media.length > 0 && (
                                <div>
                                    <div className="fw-semibold mb-2" style={{ color: 'var(--titi-text)', fontSize: '0.875rem' }}>
                                        <i className="bi bi-images me-1" />Médias ({selected.media.length})
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                        {selected.media.map(m => m.is_image ? (
                                            <button key={m.id} onClick={() => setLightbox(m.url)} style={{
                                                border: 'none', padding: 0, borderRadius: 8, overflow: 'hidden',
                                                cursor: 'zoom-in', aspectRatio: '1', background: 'var(--titi-surface)', display: 'block',
                                            }}>
                                                <img src={m.url} alt={m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </button>
                                        ) : (
                                            <a key={m.id} href={m.url} target="_blank" rel="noreferrer" style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                aspectRatio: '1', background: 'var(--titi-surface)', borderRadius: 8,
                                                border: '1px solid var(--titi-border)', textDecoration: 'none',
                                                color: 'var(--titi-sub)', fontSize: '0.75rem', gap: 6, padding: 8,
                                            }}>
                                                <i className="bi bi-file-pdf" style={{ fontSize: '1.5rem', color: '#DC2626' }} />
                                                <span style={{ textAlign: 'center', wordBreak: 'break-all' }}>{m.filename}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Short description */}
                            {selected.short_description && (
                                <div style={{ background: 'var(--titi-surface)', borderRadius: 8, padding: '12px 16px', fontSize: '0.875rem', color: 'var(--titi-sub)', fontStyle: 'italic' }}>
                                    {selected.short_description}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <div className="fw-semibold mb-2" style={{ color: 'var(--titi-text)', fontSize: '0.875rem' }}>
                                    <i className="bi bi-text-paragraph me-1" />Description complète
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                    {selected.description}
                                </div>
                            </div>

                            {/* Meta grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {[
                                    { icon: 'bi-tag',       label: 'Catégorie',  value: selected.category ?? '—' },
                                    { icon: 'bi-people',    label: 'Équipe',     value: `${selected.team_size} membre${selected.team_size > 1 ? 's' : ''}` },
                                    { icon: 'bi-cash',      label: 'Budget',     value: selected.budget_formatted },
                                    { icon: 'bi-calendar3', label: 'Soumis le',  value: selected.submitted_at ?? '—' },
                                ].map(m => (
                                    <div key={m.label} style={{ background: 'var(--titi-surface)', borderRadius: 8, padding: '10px 14px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginBottom: 4 }}>
                                            <i className={`bi ${m.icon} me-1`} />{m.label}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--titi-text)', wordBreak: 'break-word' }}>
                                            {m.value}
                                        </div>
                                    </div>
                                ))}
                                {selected.project_url && (
                                    <div style={{ gridColumn: '1 / -1', background: 'var(--titi-surface)', borderRadius: 8, padding: '10px 14px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginBottom: 4 }}>
                                            <i className="bi bi-link-45deg me-1" />URL du projet
                                        </div>
                                        <a href={selected.project_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: '#5FA145', wordBreak: 'break-all' }}>
                                            {selected.project_url}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Previous admin notes */}
                            {selected.admin_notes && (
                                <div style={{ background: 'rgba(107,114,128,0.08)', border: '1px solid var(--titi-border)', borderRadius: 8, padding: '12px 16px' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginBottom: 6 }}>
                                        <i className="bi bi-sticky me-1" />Notes précédentes
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--titi-text)' }}>{selected.admin_notes}</div>
                                </div>
                            )}

                            {/* Approve */}
                            {selected.status !== 'approved' && (
                                <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 10, padding: 16 }}>
                                    <div className="fw-semibold mb-3" style={{ color: '#16A34A', fontSize: '0.875rem' }}>
                                        <i className="bi bi-check-circle me-1" />Approuver ce projet
                                    </div>
                                    <Form.Group className="mb-2">
                                        <Form.Control as="textarea" rows={2} size="sm"
                                            placeholder="Notes pour l'auteur (optionnel)"
                                            value={approveForm.data.notes}
                                            onChange={e => approveForm.setData('notes', e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Check type="checkbox" className="mb-3"
                                        label="Mettre en avant (featured)"
                                        id="featured-check"
                                        checked={approveForm.data.featured}
                                        onChange={e => approveForm.setData('featured', e.target.checked as false)}
                                    />
                                    <Button size="sm" style={{ background: '#16A34A', borderColor: '#16A34A' }}
                                        disabled={approveForm.processing}
                                        onClick={handleApprove}>
                                        {approveForm.processing ? 'En cours…' : 'Approuver le projet'}
                                    </Button>
                                </div>
                            )}

                            {/* Reject */}
                            {selected.status !== 'rejected' && (
                                <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, padding: 16 }}>
                                    <div className="fw-semibold mb-3" style={{ color: '#DC2626', fontSize: '0.875rem' }}>
                                        <i className="bi bi-x-circle me-1" />Rejeter ce projet
                                    </div>
                                    <Form.Group className="mb-3">
                                        <Form.Control as="textarea" rows={2} size="sm"
                                            placeholder="Motif du rejet (requis, min. 10 caractères)"
                                            value={rejectForm.data.notes}
                                            onChange={e => rejectForm.setData('notes', e.target.value)}
                                            isInvalid={!!rejectForm.errors.notes}
                                        />
                                        {rejectForm.errors.notes && (
                                            <Form.Control.Feedback type="invalid">{rejectForm.errors.notes}</Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Button size="sm" variant="danger"
                                        disabled={rejectForm.processing}
                                        onClick={handleReject}>
                                        {rejectForm.processing ? 'En cours…' : 'Rejeter le projet'}
                                    </Button>
                                </div>
                            )}

                            {/* Delete */}
                            <div style={{ borderTop: '1px solid var(--titi-border)', paddingTop: 16 }}>
                                <Button size="sm" variant="outline-danger"
                                    onClick={() => setDeleteTarget(selected)}>
                                    <i className="bi bi-trash me-1" />Supprimer définitivement
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div onClick={() => setLightbox(null)} style={{
                    position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
                }}>
                    <button onClick={() => setLightbox(null)} style={{
                        position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)',
                        border: 'none', borderRadius: '50%', width: 40, height: 40,
                        color: '#fff', fontSize: '1.1rem', cursor: 'pointer',
                    }}>
                        <i className="bi bi-x-lg" />
                    </button>
                    <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }} />
                </div>
            )}

            {/* Delete confirm */}
            <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '1rem' }}>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Supprimer <strong>«{deleteTarget?.title}»</strong> ? Cette action est irréversible et supprimera également les médias associés.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" size="sm" onClick={() => setDeleteTarget(null)}>Annuler</Button>
                    <Button variant="danger" size="sm" onClick={handleDelete}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </DashboardLayout>
    );
}
