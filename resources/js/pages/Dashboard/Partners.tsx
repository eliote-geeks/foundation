import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import DashboardLayout from '../../layouts/dashboard-layout';

interface Partner {
    id: number;
    name: string;
    logo_url: string | null;
    category: string;
    partnership_type: string;
    status: string;
    status_badge: string;
    contribution: string;
    contact_person: string;
    website: string | null;
    email: string | null;
    phone: string | null;
    description: string | null;
    is_featured: boolean;
    since: string;
    last_contact: string;
}

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface Props {
    stats: Stat[];
    partners: Partner[];
    recentRequests: { id: number; company_name: string; contact_name: string; category: string; status: string; submitted_at: string }[];
    flash?: { success?: string; error?: string };
}

const BLANK_FORM = {
    name: '', description: '', email: '', website: '', phone: '',
    contact_person: '', contact_position: '', category: '', partnership_type: '',
    contribution_amount: '', is_featured: false, priority: 50, status: 'active',
};

const CATEGORIES = ['Technologie', 'Finance', 'Education', 'Télécommunications', 'Energie', 'Agroalimentaire', 'Cosmétique', 'Transport', 'Médias', 'Autre'];
const TYPES = ['Financier', 'Technique', 'Académique', 'Environnemental', 'Social', 'Innovation', 'Médias'];

const statusColors: Record<string, string> = {
    active: '#5FA145', pending: '#C69438', suspended: '#DC2626', inactive: '#6B7280',
};
const statusLabels: Record<string, string> = {
    active: 'Actif', pending: 'En attente', suspended: 'Suspendu', inactive: 'Inactif',
};

export default function DashboardPartners({ stats, partners, flash }: Props) {
    const [tab, setTab] = useState<'partners' | 'requests'>('partners');
    const [showCreate, setShowCreate] = useState(false);
    const [editPartner, setEditPartner] = useState<Partner | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
    const [form, setForm] = useState({ ...BLANK_FORM });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);

    const openCreate = () => {
        setForm({ ...BLANK_FORM });
        setLogoFile(null);
        setLogoPreview(null);
        setShowCreate(true);
    };

    const openEdit = (p: Partner) => {
        setForm({
            name: p.name, description: p.description ?? '', email: p.email ?? '',
            website: p.website ?? '', phone: p.phone ?? '', contact_person: p.contact_person ?? '',
            contact_position: '', category: p.category ?? '', partnership_type: p.partnership_type ?? '',
            contribution_amount: '', is_featured: p.is_featured, priority: 50, status: p.status,
        });
        setLogoFile(null);
        setLogoPreview(p.logo_url);
        setEditPartner(p);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setLogoFile(file);
        if (file) setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
        if (logoFile) data.append('logo', logoFile);

        if (editPartner) {
            data.append('_method', 'POST');
            router.post(`/dashboard/partners/${editPartner.id}`, data, {
                forceFormData: true,
                onFinish: () => { setSubmitting(false); setEditPartner(null); },
            });
        } else {
            router.post('/dashboard/partners', data, {
                forceFormData: true,
                onFinish: () => { setSubmitting(false); setShowCreate(false); },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/dashboard/partners/${deleteTarget.id}`, {
            onFinish: () => setDeleteTarget(null),
        });
    };

    const handleToggleFeatured = (p: Partner) => {
        router.post(`/dashboard/partners/${p.id}/featured`, {});
    };

    const LogoAvatar = ({ p, size = 40 }: { p: Partner; size?: number }) => (
        p.logo_url
            ? <img src={p.logo_url} alt={p.name} style={{ width: size, height: size, objectFit: 'contain', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', padding: 2 }} />
            : <div style={{ width: size, height: size, borderRadius: 6, background: '#F3F4F6', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700, color: '#9CA3AF' }}>
                {p.name.slice(0, 2).toUpperCase()}
              </div>
    );

    const PartnerForm = () => (
        <Form onSubmit={handleSubmit}>
            {/* Logo upload */}
            <div className="text-center mb-4">
                <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                        width: 100, height: 100, margin: '0 auto 10px', borderRadius: 12, cursor: 'pointer',
                        border: '2px dashed #D1D5DB', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    }}
                >
                    {logoPreview
                        ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                        : <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                            <i className="bi bi-image" style={{ fontSize: '1.8rem' }} /><br />
                            <small>Logo</small>
                          </div>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                <small className="text-muted">Cliquez pour ajouter un logo (PNG, JPG — max 2 Mo)</small>
            </div>

            <Row className="g-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Nom du partenaire *</Form.Label>
                        <Form.Control size="sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Email</Form.Label>
                        <Form.Control size="sm" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Site web</Form.Label>
                        <Form.Control size="sm" type="url" placeholder="https://" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Téléphone</Form.Label>
                        <Form.Control size="sm" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Personne de contact</Form.Label>
                        <Form.Control size="sm" value={form.contact_person} onChange={e => setForm(f => ({ ...f, contact_person: e.target.value }))} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Catégorie</Form.Label>
                        <Form.Select size="sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                            <option value="">— Choisir —</option>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Type de partenariat</Form.Label>
                        <Form.Select size="sm" value={form.partnership_type} onChange={e => setForm(f => ({ ...f, partnership_type: e.target.value }))}>
                            <option value="">— Choisir —</option>
                            {TYPES.map(t => <option key={t}>{t}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>
                {editPartner && (
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="fw-semibold small">Statut</Form.Label>
                            <Form.Select size="sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                <option value="active">Actif</option>
                                <option value="pending">En attente</option>
                                <option value="suspended">Suspendu</option>
                                <option value="inactive">Inactif</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                )}
                <Col xs={12}>
                    <Form.Group>
                        <Form.Label className="fw-semibold small">Description</Form.Label>
                        <Form.Control as="textarea" rows={2} size="sm" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </Form.Group>
                </Col>
                <Col xs={12}>
                    <Form.Check
                        type="switch"
                        id="is_featured"
                        label="Mettre en avant sur la page d'accueil"
                        checked={form.is_featured}
                        onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                    />
                </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button size="sm" variant="outline-secondary" type="button" onClick={() => { setShowCreate(false); setEditPartner(null); }}>
                    Annuler
                </Button>
                <Button size="sm" type="submit" disabled={submitting} style={{ background: '#5FA145', border: 'none' }}>
                    {submitting ? 'Enregistrement...' : editPartner ? 'Mettre à jour' : 'Créer le partenaire'}
                </Button>
            </div>
        </Form>
    );

    return (
        <DashboardLayout title="Partenaires">
            <Head title="Dashboard — Partenaires" />

            {flash?.success && (
                <Alert variant="success" className="mb-4" dismissible>
                    <i className="bi bi-check-circle me-2" />{flash.success}
                </Alert>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                        <i className="bi bi-handshake-fill me-2" style={{ color: '#5FA145' }} />
                        Partenaires & Sponsors
                    </h4>
                    <p className="text-muted mb-0 small">Gérez les logos et informations des partenaires affichés sur le site.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => window.open('/dashboard/partners/export?format=csv', '_blank')}>
                        <i className="bi bi-download me-1" />Export
                    </Button>
                    <Button size="sm" onClick={openCreate} style={{ background: '#5FA145', border: 'none' }}>
                        <i className="bi bi-plus-lg me-1" />Ajouter un partenaire
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <Row className="g-3 mb-4">
                {stats.map((s, i) => (
                    <Col key={i} xs={6} lg={3}>
                        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small mb-1">{s.title}</div>
                                    <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#1F2937' }}>{s.value}</div>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: 8, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.1rem' }} />
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Partners table */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="fw-semibold" style={{ color: '#1F2937' }}>
                        <i className="bi bi-building me-2" style={{ color: '#5FA145' }} />
                        {partners.length} partenaire{partners.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {partners.length === 0 ? (
                    <div className="text-center py-5" style={{ color: '#9CA3AF' }}>
                        <i className="bi bi-building-add mb-3" style={{ fontSize: '2.5rem', display: 'block' }} />
                        Aucun partenaire. Cliquez sur "Ajouter un partenaire" pour commencer.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table hover className="mb-0" style={{ fontSize: '0.875rem' }}>
                            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                <tr>
                                    <th className="border-0 fw-semibold text-muted ps-4" style={{ width: 56 }}>Logo</th>
                                    <th className="border-0 fw-semibold text-muted">Partenaire</th>
                                    <th className="border-0 fw-semibold text-muted">Catégorie</th>
                                    <th className="border-0 fw-semibold text-muted">Statut</th>
                                    <th className="border-0 fw-semibold text-muted">Vitrine</th>
                                    <th className="border-0 fw-semibold text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map(p => (
                                    <tr key={p.id}>
                                        <td className="border-0 ps-4 align-middle">
                                            <LogoAvatar p={p} size={40} />
                                        </td>
                                        <td className="border-0 align-middle">
                                            <div className="fw-semibold" style={{ color: '#1F2937' }}>{p.name}</div>
                                            {p.email && <div className="text-muted small">{p.email}</div>}
                                            {p.website && (
                                                <a href={p.website} target="_blank" rel="noreferrer" className="small text-decoration-none" style={{ color: '#5FA145' }}>
                                                    <i className="bi bi-link-45deg me-1" />{p.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            )}
                                        </td>
                                        <td className="border-0 align-middle text-muted">
                                            {p.category || '—'}
                                            {p.partnership_type && <div className="small">{p.partnership_type}</div>}
                                        </td>
                                        <td className="border-0 align-middle">
                                            <Badge style={{ background: statusColors[p.status] ?? '#6B7280', fontSize: '0.7rem' }}>
                                                {statusLabels[p.status] ?? p.status}
                                            </Badge>
                                        </td>
                                        <td className="border-0 align-middle">
                                            <button
                                                onClick={() => handleToggleFeatured(p)}
                                                title={p.is_featured ? 'Retirer de la vitrine' : 'Mettre en avant'}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                                            >
                                                <i className={`bi bi-star${p.is_featured ? '-fill' : ''}`} style={{ fontSize: '1.1rem', color: p.is_featured ? '#F59E0B' : '#D1D5DB' }} />
                                            </button>
                                        </td>
                                        <td className="border-0 align-middle">
                                            <div className="d-flex gap-1">
                                                <Button size="sm" variant="outline-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={() => openEdit(p)}>
                                                    <i className="bi bi-pencil" />
                                                </Button>
                                                <Button size="sm" variant="outline-danger" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={() => setDeleteTarget(p)}>
                                                    <i className="bi bi-trash" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal show={showCreate} onHide={() => setShowCreate(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold" style={{ fontSize: '1rem', color: '#1F2937' }}>
                        <i className="bi bi-plus-circle me-2" style={{ color: '#5FA145' }} />Nouveau partenaire
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4"><PartnerForm /></Modal.Body>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editPartner} onHide={() => setEditPartner(null)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold" style={{ fontSize: '1rem', color: '#1F2937' }}>
                        <i className="bi bi-pencil me-2" style={{ color: '#5FA145' }} />Modifier — {editPartner?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4"><PartnerForm /></Modal.Body>
            </Modal>

            {/* Delete Confirm */}
            <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered size="sm">
                <Modal.Body className="p-4 text-center">
                    <i className="bi bi-exclamation-triangle-fill mb-3" style={{ fontSize: '2.5rem', color: '#DC2626', display: 'block' }} />
                    <h6 className="fw-bold mb-2">Supprimer ce partenaire ?</h6>
                    <p className="text-muted small mb-4">"{deleteTarget?.name}" sera définitivement supprimé, y compris son logo.</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button size="sm" variant="outline-secondary" onClick={() => setDeleteTarget(null)}>Annuler</Button>
                        <Button size="sm" variant="danger" onClick={handleDelete}>Supprimer</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
}
