import DashboardLayout from '../../layouts/dashboard-layout';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

interface HeroSlide {
    id: number;
    headline: string;
    headline_accent: string | null;
    tagline: string | null;
    badge_text: string | null;
    cta_primary_label: string | null;
    cta_primary_url: string | null;
    cta_secondary_label: string | null;
    cta_secondary_url: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    slides: HeroSlide[];
}

const BLANK = {
    headline: '', headline_accent: '', tagline: '',
    badge_text: '🌿 TITI EVENTS · Cameroun',
    cta_primary_label: 'Rejoindre gratuitement', cta_primary_url: '/register',
    cta_secondary_label: 'Voir les événements', cta_secondary_url: '/events',
    is_active: true, order: 0,
};

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
            <div style={{ position: 'relative', background: '#fff', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h5 style={{ margin: 0, fontWeight: 700, color: '#111827' }}>{title}</h5>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6B7280' }}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function HeroDashboard({ slides }: Props) {
    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<HeroSlide | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({ ...BLANK });

    function openCreate() {
        setData({ ...BLANK });
        setModalMode('create');
    }

    function openEdit(s: HeroSlide) {
        setEditing(s);
        setData({
            headline: s.headline,
            headline_accent: s.headline_accent ?? '',
            tagline: s.tagline ?? '',
            badge_text: s.badge_text ?? '',
            cta_primary_label: s.cta_primary_label ?? '',
            cta_primary_url: s.cta_primary_url ?? '',
            cta_secondary_label: s.cta_secondary_label ?? '',
            cta_secondary_url: s.cta_secondary_url ?? '',
            is_active: s.is_active,
            order: s.order,
        });
        setModalMode('edit');
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('dashboard.hero.store'), { onSuccess: () => setModalMode(null) });
        } else if (editing) {
            put(route('dashboard.hero.update', editing.id), { onSuccess: () => setModalMode(null) });
        }
    }

    function doDelete() {
        if (!deleteId) return;
        router.delete(route('dashboard.hero.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
    }

    const inp: React.CSSProperties = { width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', outline: 'none', background: '#fff' };
    const lbl: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 };
    const hint: React.CSSProperties = { fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 };

    return (
        <DashboardLayout title="Hero — Page d'accueil">
            <div style={{ padding: '0 0 32px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Hero — Page d'accueil</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
                            Gérez le contenu de la bannière principale du site. Le premier slide actif est utilisé.
                        </p>
                    </div>
                    <button onClick={openCreate} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="bi bi-plus-lg" /> Ajouter
                    </button>
                </div>

                {/* Notice */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <i className="bi bi-info-circle" style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.875rem', color: '#92400E' }}>
                        Seul le premier slide <strong>actif</strong> (par ordre croissant) est affiché sur la page d'accueil.
                    </span>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {slides.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F9FAFB', borderRadius: 12, border: '1px dashed #D1D5DB', color: '#9CA3AF' }}>
                            <i className="bi bi-layout-text-window" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
                            Aucun slide. Ajoutez-en un pour personnaliser le hero.
                        </div>
                    )}
                    {slides.map(s => (
                        <div key={s.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#15803D' }}>
                                            {s.badge_text || '—'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: s.is_active ? '#DCFCE7' : '#F3F4F6', color: s.is_active ? '#15803D' : '#9CA3AF', fontWeight: 600, marginLeft: 'auto' }}>
                                            {s.is_active ? '● Actif' : '○ Masqué'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Ordre : {s.order}</span>
                                    </div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                                        {s.headline}
                                        {s.headline_accent && <span style={{ color: '#16A34A' }}> {s.headline_accent}</span>}
                                    </div>
                                    {s.tagline && (
                                        <p style={{ margin: '8px 0 10px', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>{s.tagline}</p>
                                    )}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {s.cta_primary_label && (
                                            <span style={{ background: '#DCFCE7', color: '#15803D', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                <i className="bi bi-arrow-right-circle me-1" />{s.cta_primary_label} → {s.cta_primary_url}
                                            </span>
                                        )}
                                        {s.cta_secondary_label && (
                                            <span style={{ background: '#F3F4F6', color: '#374151', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                {s.cta_secondary_label} → {s.cta_secondary_url}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => openEdit(s)} style={{ background: '#F3F4F6', border: 'none', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', color: '#374151' }}>
                                        <i className="bi bi-pencil" />
                                    </button>
                                    <button onClick={() => setDeleteId(s.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', color: '#DC2626' }}>
                                        <i className="bi bi-trash" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create / Edit modal */}
            {modalMode && (
                <Modal title={modalMode === 'create' ? 'Ajouter un hero' : 'Modifier le hero'} onClose={() => setModalMode(null)}>
                    <form onSubmit={submit}>
                        <div style={{ marginBottom: 14 }}>
                            <label style={lbl}>Badge <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(texte de la pilule en haut)</span></label>
                            <input style={inp} value={data.badge_text} onChange={e => setData('badge_text', e.target.value)} placeholder="🌿 TITI EVENTS · Cameroun" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                            <div>
                                <label style={lbl}>Titre principal *</label>
                                <input style={inp} value={data.headline} onChange={e => setData('headline', e.target.value)} required placeholder="Engagez, contribuez," />
                                {errors.headline && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.headline}</span>}
                            </div>
                            <div>
                                <label style={lbl}>Titre accentué <span style={{ color: '#16A34A' }}>(vert + soulignement)</span></label>
                                <input style={inp} value={data.headline_accent} onChange={e => setData('headline_accent', e.target.value)} placeholder="transformez." />
                            </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={lbl}>Sous-titre / description</label>
                            <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={data.tagline} onChange={e => setData('tagline', e.target.value)} />
                        </div>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Boutons d'action
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                                <div>
                                    <label style={lbl}>Label bouton principal</label>
                                    <input style={inp} value={data.cta_primary_label} onChange={e => setData('cta_primary_label', e.target.value)} placeholder="Rejoindre gratuitement" />
                                </div>
                                <div>
                                    <label style={lbl}>URL bouton principal</label>
                                    <input style={inp} value={data.cta_primary_url} onChange={e => setData('cta_primary_url', e.target.value)} placeholder="/register" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div>
                                    <label style={lbl}>Label bouton secondaire</label>
                                    <input style={inp} value={data.cta_secondary_label} onChange={e => setData('cta_secondary_label', e.target.value)} placeholder="Voir les événements" />
                                </div>
                                <div>
                                    <label style={lbl}>URL bouton secondaire</label>
                                    <input style={inp} value={data.cta_secondary_url} onChange={e => setData('cta_secondary_url', e.target.value)} placeholder="/events" />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                            <div>
                                <label style={lbl}>Ordre</label>
                                <input type="number" style={inp} value={data.order} onChange={e => setData('order', parseInt(e.target.value) || 0)} />
                                <p style={hint}>Les slides actifs sont triés par ordre croissant.</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                                    <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ width: 16, height: 16 }} />
                                    Activer ce slide
                                </label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setModalMode(null)} style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                            <button type="submit" disabled={processing} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', fontWeight: 600 }}>
                                {processing ? 'Enregistrement…' : modalMode === 'create' ? 'Ajouter' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete confirm */}
            {deleteId && (
                <Modal title="Supprimer ce slide ?" onClose={() => setDeleteId(null)}>
                    <p style={{ color: '#4B5563', marginBottom: 24 }}>Cette action est irréversible.</p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                        <button onClick={() => setDeleteId(null)} style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
                        <button onClick={doDelete} style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 600 }}>Supprimer</button>
                    </div>
                </Modal>
            )}
        </DashboardLayout>
    );
}
