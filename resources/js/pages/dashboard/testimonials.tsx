import DashboardLayout from '../../layouts/dashboard-layout';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    city: string | null;
    content: string;
    rating: number;
    icon: string;
    icon_color: string;
    icon_bg: string;
    is_active: boolean;
    order: number;
}

interface Props {
    testimonials: Testimonial[];
}

const ICONS = [
    'bi-person-fill','bi-heart-fill','bi-briefcase-fill','bi-star-fill',
    'bi-hand-thumbs-up-fill','bi-people-fill','bi-trophy-fill',
];
const COLORS = ['#5FA145','#C69438','#1A56DB','#E1306C','#6366F1','#F97316'];

const BLANK = { name: '', role: '', city: '', content: '', rating: 5, icon: 'bi-person-fill', icon_color: '#5FA145', icon_bg: '#EAF5E5', is_active: true, order: 0 };

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
            <div style={{ position: 'relative', background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', padding: 28 }}>
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

export default function Testimonials({ testimonials }: Props) {
    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({ ...BLANK });

    function openCreate() {
        reset();
        Object.assign(data, BLANK);
        setData({ ...BLANK });
        setModalMode('create');
    }

    function openEdit(t: Testimonial) {
        setEditing(t);
        setData({ name: t.name, role: t.role ?? '', city: t.city ?? '', content: t.content, rating: t.rating, icon: t.icon, icon_color: t.icon_color, icon_bg: t.icon_bg, is_active: t.is_active, order: t.order });
        setModalMode('edit');
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('dashboard.testimonials.store'), { onSuccess: () => setModalMode(null) });
        } else if (editing) {
            put(route('dashboard.testimonials.update', editing.id), { onSuccess: () => setModalMode(null) });
        }
    }

    function doDelete() {
        if (!deleteId) return;
        router.delete(route('dashboard.testimonials.destroy', deleteId), { onSuccess: () => setDeleteId(null) });
    }

    const inp: React.CSSProperties = { width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', outline: 'none', background: '#fff' };
    const lbl: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 };

    return (
        <DashboardLayout title="Témoignages">
            <div style={{ padding: '0 0 32px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 700, color: '#111827' }}>Témoignages</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
                            Gérez les témoignages affichés sur la page d'accueil.
                        </p>
                    </div>
                    <button onClick={openCreate} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="bi bi-plus-lg" /> Ajouter
                    </button>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {testimonials.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#F9FAFB', borderRadius: 12, border: '1px dashed #D1D5DB', color: '#9CA3AF' }}>
                            <i className="bi bi-chat-quote" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
                            Aucun témoignage. Ajoutez-en un pour commencer.
                        </div>
                    )}
                    {testimonials.map(t => (
                        <div key={t.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: t.icon_bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className={t.icon} style={{ color: t.icon_color, fontSize: '1.3rem' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, color: '#111827' }}>{t.name}</span>
                                    {t.role && <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{t.role}</span>}
                                    {t.city && <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>· {t.city}</span>}
                                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: t.is_active ? '#DCFCE7' : '#F3F4F6', color: t.is_active ? '#15803D' : '#9CA3AF', fontWeight: 600 }}>
                                        {t.is_active ? 'Actif' : 'Masqué'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                                    {Array.from({ length: t.rating }).map((_, i) => <i key={i} className="bi bi-star-fill" style={{ color: '#C69438', fontSize: '0.75rem' }} />)}
                                </div>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.6 }}>"{t.content}"</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <button onClick={() => openEdit(t)} style={{ background: '#F3F4F6', border: 'none', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', color: '#374151' }}>
                                    <i className="bi bi-pencil" />
                                </button>
                                <button onClick={() => setDeleteId(t.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', color: '#DC2626' }}>
                                    <i className="bi bi-trash" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create / Edit modal */}
            {modalMode && (
                <Modal title={modalMode === 'create' ? 'Ajouter un témoignage' : 'Modifier le témoignage'} onClose={() => setModalMode(null)}>
                    <form onSubmit={submit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                            <div>
                                <label style={lbl}>Nom *</label>
                                <input style={inp} value={data.name} onChange={e => setData('name', e.target.value)} required />
                                {errors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.name}</span>}
                            </div>
                            <div>
                                <label style={lbl}>Rôle</label>
                                <input style={inp} value={data.role} onChange={e => setData('role', e.target.value)} placeholder="Adhérent, Bénévole…" />
                            </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={lbl}>Ville</label>
                            <input style={inp} value={data.city} onChange={e => setData('city', e.target.value)} placeholder="Yaoundé" />
                        </div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={lbl}>Témoignage *</label>
                            <textarea style={{ ...inp, minHeight: 96, resize: 'vertical' }} value={data.content} onChange={e => setData('content', e.target.value)} required />
                            {errors.content && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.content}</span>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                            <div>
                                <label style={lbl}>Note (1–5)</label>
                                <select style={inp} value={data.rating} onChange={e => setData('rating', parseInt(e.target.value))}>
                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>Ordre d'affichage</label>
                                <input type="number" style={inp} value={data.order} onChange={e => setData('order', parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                            <label style={lbl}>Icône</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {ICONS.map(ic => (
                                    <button type="button" key={ic} onClick={() => setData('icon', ic)}
                                        style={{ width: 40, height: 40, borderRadius: 8, border: data.icon === ic ? '2px solid #16A34A' : '1px solid #E5E7EB', background: data.icon === ic ? '#DCFCE7' : '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className={ic} style={{ color: data.icon_color, fontSize: '1.1rem' }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                            <div>
                                <label style={lbl}>Couleur icône</label>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {COLORS.map(c => (
                                        <button type="button" key={c} onClick={() => setData('icon_color', c)}
                                            style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: data.icon_color === c ? '3px solid #111827' : '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', cursor: 'pointer' }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={lbl}>Couleur fond icône</label>
                                <input type="color" value={data.icon_bg} onChange={e => setData('icon_bg', e.target.value)}
                                    style={{ width: 44, height: 36, border: '1px solid #D1D5DB', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} style={{ width: 16, height: 16 }} />
                                Afficher sur la page d'accueil
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setModalMode(null)} style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 600 }}>
                                Annuler
                            </button>
                            <button type="submit" disabled={processing} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', fontWeight: 600 }}>
                                {processing ? 'Enregistrement…' : modalMode === 'create' ? 'Ajouter' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete confirm */}
            {deleteId && (
                <Modal title="Supprimer ce témoignage ?" onClose={() => setDeleteId(null)}>
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
