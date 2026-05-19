import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';
import { MediaUploader, type UploadedMedia } from '../../components/ui/MediaUploader';

interface MediaItem {
    id: number; url: string; filename: string;
    mime_type: string; size: number; size_fmt: string;
    is_image: boolean; width?: number | null; height?: number | null;
}

interface Project {
    id: number;
    title: string;
    category: string | null;
    short_description: string | null;
    description: string;
    project_url: string | null;
    team_size: number;
    team_members: string[] | null;
    budget_formatted: string;
    status: string;
    featured: boolean;
    submitted_at: string | null;
    author_name: string;
    media: MediaItem[];
}

interface Props {
    user?: { name: string; email: string; is_admin?: boolean };
    projects: Project[];
    stats: { total: number; pending: number; featured: number };
}

const CATEGORIES = [
    'Agriculture & Alimentation',
    'Éducation & Formation',
    'Santé & Bien-être',
    'Technologie & Innovation',
    'Environnement & Énergie',
    'Arts & Culture',
    'Entrepreneuriat & Business',
    'Social & Humanitaire',
    'Sport & Loisirs',
    'Autre',
];

const STEPS = [
    { num: '01', icon: 'bi-person-plus', color: '#5FA145', label: 'Inscrivez-vous', desc: 'Créez votre compte sur notre plateforme' },
    { num: '02', icon: 'bi-pencil-square', color: '#C69438', label: 'Soumettez votre projet', desc: 'Présentez votre idée avec tous les détails' },
    { num: '03', icon: 'bi-hand-thumbs-up', color: '#1A56DB', label: 'Vote du public', desc: 'La communauté vote pour les meilleurs projets' },
    { num: '04', icon: 'bi-trophy', color: '#D97706', label: 'Remportez le prix', desc: 'Les gagnants reçoivent financement et accompagnement' },
];

export default function ProjectsIndex({ user, projects, stats }: Props) {
    const { props } = usePage<any>();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    const [lightbox, setLightbox] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const form = useForm({
        title: '',
        category: '',
        short_description: '',
        description: '',
        project_url: '',
        team_size: 1,
        budget_needed: '' as string | number,
        media_ids: [] as number[],
    });

    function scrollToForm() {
        if (!user) {
            window.location.href = '/register';
            return;
        }
        setShowForm(true);
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/projects', {
            onSuccess: () => { form.reset(); setShowForm(false); },
        });
    }

    const filtered = selectedCategory
        ? projects.filter(p => p.category === selectedCategory)
        : projects;

    return (
        <>
            <Head title="Projets — TITI EVENTS" />
            <ModernHeader user={user} />

            {/* Lightbox */}
            {lightbox && (
                <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
                    <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }} />
                    <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>
            )}

            <div style={{ paddingTop: 66 }}>

                {/* Flash */}
                {flash?.success && (
                    <div style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid #bbf7d0', color: '#15803d', padding: '14px 20px', textAlign: 'center', fontWeight: 500 }}>
                        <i className="bi bi-check-circle me-2"></i>{flash.success}
                    </div>
                )}

                {/* ── Hero ── */}
                <section style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #16a34a 100%)', color: '#fff', padding: '72px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
                    <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
                        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 18, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Appel à projets
                        </span>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
                            Soumettez votre projet,<br />
                            <span style={{ color: '#86efac' }}>changez le monde</span>
                        </h1>
                        <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
                            Vous avez une idée qui peut impacter positivement votre communauté ?
                            Soumettez-la et bénéficiez du soutien de TITI EVENTS.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={scrollToForm}
                                style={{ padding: '12px 28px', background: '#fff', color: '#15803d', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                <i className="bi bi-rocket-takeoff"></i>{user ? 'Soumettre mon projet' : 'S\'inscrire pour soumettre'}
                            </button>
                            <a href="#gallery" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
                                Voir les projets
                            </a>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
                            {[
                                { value: stats.total, label: 'Projets approuvés' },
                                { value: stats.pending, label: 'En cours d\'examen' },
                                { value: stats.featured, label: 'Projets mis en avant' },
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#86efac' }}>{s.value}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Comment ça marche ── */}
                <section style={{ background: 'var(--titi-surface)', padding: '64px 24px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <span style={{ background: 'rgba(95,161,69,0.15)', color: 'var(--titi-green)', padding: '4px 14px', borderRadius: 20, fontSize: '0.8125rem', fontWeight: 600 }}>
                                Comment ça marche
                            </span>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--titi-text)', marginTop: 12, marginBottom: 0 }}>
                                De l'idée à la réalisation
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                            {STEPS.map((step, i) => (
                                <div key={i} style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 14, padding: '28px 22px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 14, right: 16, fontSize: '2.5rem', fontWeight: 900, color: 'var(--titi-border)', lineHeight: 1 }}>{step.num}</div>
                                    <div style={{ width: 52, height: 52, borderRadius: 12, background: `${step.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                        <i className={`bi ${step.icon}`} style={{ fontSize: '1.5rem', color: step.color }}></i>
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 8 }}>{step.label}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA inline */}
                        <div style={{ marginTop: 32, background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--titi-text)' }}>Prêt à soumettre votre projet ?</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', marginTop: 4 }}>
                                    {user ? 'Remplissez le formulaire ci-dessous pour soumettre votre projet.' : 'Créez un compte et soumettez votre projet en quelques minutes.'}
                                </div>
                            </div>
                            <button
                                onClick={scrollToForm}
                                style={{ padding: '10px 22px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
                            >
                                <i className="bi bi-rocket-takeoff"></i>{user ? 'Soumettre mon projet' : 'Commencer maintenant'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Projects gallery ── */}
                <section id="gallery" style={{ background: 'var(--titi-white)', padding: '64px 24px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--titi-text)', margin: 0 }}>
                                    Projets soumis
                                    <span style={{ fontWeight: 400, fontSize: '1rem', color: 'var(--titi-sub)', marginLeft: 10 }}>({filtered.length})</span>
                                </h2>
                            </div>
                            {/* Category filter */}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid var(--titi-border)', background: selectedCategory === null ? '#16A34A' : 'var(--titi-surface)', color: selectedCategory === null ? '#fff' : 'var(--titi-sub)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
                                >
                                    Tous
                                </button>
                                {Array.from(new Set(projects.map(p => p.category).filter(Boolean))).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat!)}
                                        style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid var(--titi-border)', background: selectedCategory === cat ? '#16A34A' : 'var(--titi-surface)', color: selectedCategory === cat ? '#fff' : 'var(--titi-sub)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--titi-surface)', borderRadius: 14, border: '1px solid var(--titi-border)' }}>
                                <i className="bi bi-folder2-open" style={{ fontSize: '3rem', color: 'var(--titi-muted)', display: 'block', marginBottom: 12 }}></i>
                                <p style={{ color: 'var(--titi-sub)', margin: 0, fontSize: '1rem' }}>Aucun projet approuvé pour le moment.</p>
                                <p style={{ color: 'var(--titi-muted)', margin: '8px 0 0', fontSize: '0.875rem' }}>Soyez le premier à soumettre le vôtre !</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                                {filtered.map(project => (
                                    <ProjectCard key={project.id} project={project} onImageClick={setLightbox} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Submission form ── */}
                <section ref={formRef} style={{ background: 'var(--titi-surface)', padding: '64px 24px' }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <span style={{ background: 'rgba(95,161,69,0.15)', color: 'var(--titi-green)', padding: '4px 14px', borderRadius: 20, fontSize: '0.8125rem', fontWeight: 600 }}>
                                Soumission
                            </span>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--titi-text)', marginTop: 12, marginBottom: 8 }}>
                                Présentez votre projet
                            </h2>
                            <p style={{ color: 'var(--titi-sub)', margin: 0 }}>
                                Remplissez le formulaire ci-dessous. Notre équipe examine chaque soumission dans les 48 h.
                            </p>
                        </div>

                        {!user ? (
                            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--titi-white)', borderRadius: 14, border: '1px solid var(--titi-border)' }}>
                                <i className="bi bi-person-lock" style={{ fontSize: '3rem', color: 'var(--titi-muted)', display: 'block', marginBottom: 16 }}></i>
                                <h3 style={{ color: 'var(--titi-text)', fontWeight: 700, marginBottom: 8 }}>Connexion requise</h3>
                                <p style={{ color: 'var(--titi-sub)', marginBottom: 24 }}>Vous devez être connecté pour soumettre un projet.</p>
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a href="/login" style={{ padding: '10px 24px', background: '#16A34A', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                                        <i className="bi bi-box-arrow-in-right me-2"></i>Se connecter
                                    </a>
                                    <a href="/register" style={{ padding: '10px 24px', background: 'var(--titi-surface)', color: 'var(--titi-text)', border: '1px solid var(--titi-border)', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                                        Créer un compte
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 14, overflow: 'hidden' }}>

                                    {/* Section 1: Basics */}
                                    <FormSection title="Informations générales" icon="bi-info-circle">
                                        <FormField label="Titre du projet *" error={form.errors.title}>
                                            <input
                                                type="text"
                                                value={form.data.title}
                                                onChange={e => form.setData('title', e.target.value)}
                                                placeholder="Ex: AgroConnect — Mise en relation agriculteurs & marchés"
                                                style={inputStyle}
                                            />
                                        </FormField>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <FormField label="Catégorie *" error={form.errors.category}>
                                                <select
                                                    value={form.data.category}
                                                    onChange={e => form.setData('category', e.target.value)}
                                                    style={inputStyle}
                                                >
                                                    <option value="">Choisir une catégorie</option>
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </FormField>
                                            <FormField label="Taille de l'équipe *" error={form.errors.team_size}>
                                                <input
                                                    type="number"
                                                    min={1} max={50}
                                                    value={form.data.team_size}
                                                    onChange={e => form.setData('team_size', Number(e.target.value))}
                                                    style={inputStyle}
                                                />
                                            </FormField>
                                        </div>

                                        <FormField label="Résumé court * (max 300 caractères)" error={form.errors.short_description}>
                                            <textarea
                                                value={form.data.short_description}
                                                onChange={e => form.setData('short_description', e.target.value)}
                                                rows={2}
                                                maxLength={300}
                                                placeholder="En 1-2 phrases, décrivez l'essence de votre projet..."
                                                style={inputStyle}
                                            />
                                            <div style={{ fontSize: '0.75rem', color: 'var(--titi-muted)', marginTop: 4, textAlign: 'right' }}>
                                                {form.data.short_description.length}/300
                                            </div>
                                        </FormField>
                                    </FormSection>

                                    {/* Section 2: Description */}
                                    <FormSection title="Description complète" icon="bi-file-text">
                                        <FormField label="Description détaillée * (min. 100 caractères)" error={form.errors.description}>
                                            <textarea
                                                value={form.data.description}
                                                onChange={e => form.setData('description', e.target.value)}
                                                rows={7}
                                                placeholder="Décrivez en détail votre projet : problème résolu, solution proposée, impact attendu, plan de mise en œuvre, ressources nécessaires..."
                                                style={inputStyle}
                                            />
                                        </FormField>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <FormField label="Lien du projet (optionnel)" error={form.errors.project_url}>
                                                <input
                                                    type="url"
                                                    value={form.data.project_url}
                                                    onChange={e => form.setData('project_url', e.target.value)}
                                                    placeholder="https://..."
                                                    style={inputStyle}
                                                />
                                            </FormField>
                                            <FormField label="Budget estimé (XAF, optionnel)" error={form.errors.budget_needed}>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={form.data.budget_needed}
                                                    onChange={e => form.setData('budget_needed', e.target.value)}
                                                    placeholder="Ex: 500000"
                                                    style={inputStyle}
                                                />
                                            </FormField>
                                        </div>
                                    </FormSection>

                                    {/* Section 3: Media */}
                                    <FormSection title="Médias & documents" icon="bi-images">
                                        <p style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', margin: '0 0 14px' }}>
                                            Ajoutez des photos, maquettes ou documents (pitch deck PDF) pour illustrer votre projet.
                                        </p>
                                        <MediaUploader
                                            accept="image/*,application/pdf"
                                            multiple
                                            maxFiles={8}
                                            maxSizeMb={10}
                                            label="Glissez vos fichiers ici"
                                            hint="Images et PDF · max 10 MB · 8 fichiers maximum"
                                            onChange={(media: UploadedMedia[]) => form.setData('media_ids', media.map(m => m.id))}
                                        />
                                    </FormSection>

                                    {/* Footer */}
                                    <div style={{ padding: '20px 28px', borderTop: '1px solid var(--titi-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--titi-muted)', margin: 0 }}>
                                            <i className="bi bi-shield-check me-1 text-success"></i>
                                            Votre projet sera examiné par notre équipe dans les 48 h.
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            style={{ padding: '11px 28px', background: form.processing ? '#9ca3af' : '#16A34A', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: form.processing ? 'not-allowed' : 'pointer', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}
                                        >
                                            <i className={`bi ${form.processing ? 'bi-hourglass-split' : 'bi-send'}`}></i>
                                            {form.processing ? 'Envoi en cours…' : 'Soumettre le projet'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </div>

            <ModernFooter />
        </>
    );
}

function ProjectCard({ project, onImageClick }: { project: Project; onImageClick: (url: string) => void }) {
    const cover = project.media.find(m => m.is_image);

    return (
        <div style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
            {/* Cover image */}
            {cover ? (
                <div onClick={() => onImageClick(cover.url)} style={{ height: 180, overflow: 'hidden', cursor: 'zoom-in', flexShrink: 0 }}>
                    <img src={cover.url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                        onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                    />
                </div>
            ) : (
                <div style={{ height: 100, background: 'var(--titi-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-folder2-open" style={{ fontSize: '2.5rem', color: 'var(--titi-muted)' }}></i>
                </div>
            )}

            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Category + featured */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    {project.category && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: 'rgba(95,161,69,0.12)', color: 'var(--titi-green)' }}>
                            {project.category}
                        </span>
                    )}
                    {project.featured && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: 'rgba(217,119,6,0.12)', color: '#D97706' }}>
                            <i className="bi bi-star-fill me-1" style={{ fontSize: '0.65rem' }}></i>En vedette
                        </span>
                    )}
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 8, lineHeight: 1.4 }}>{project.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--titi-sub)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {project.short_description ?? project.description.slice(0, 120) + '…'}
                </p>

                {/* Footer */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--titi-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)' }}>
                        <i className="bi bi-person me-1"></i>{project.author_name}
                        {project.team_size > 1 && <span style={{ marginLeft: 8 }}><i className="bi bi-people me-1"></i>{project.team_size} pers.</span>}
                    </div>
                    {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#16A34A', textDecoration: 'none' }}>
                            <i className="bi bi-link-45deg me-1"></i>Voir
                        </a>
                    )}
                </div>
            </div>

            {/* Media thumbnails strip */}
            {project.media.length > 1 && (
                <div style={{ padding: '0 14px 14px', display: 'flex', gap: 6 }}>
                    {project.media.filter(m => m.is_image).slice(1, 5).map(m => (
                        <div key={m.id} onClick={() => onImageClick(m.url)} style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', cursor: 'zoom-in', flexShrink: 0 }}>
                            <img src={m.url} alt={m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--titi-border)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className={`bi ${icon}`} style={{ color: 'var(--titi-green)' }}></i>{title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {children}
            </div>
        </div>
    );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', marginBottom: 6 }}>{label}</label>
            {children}
            {error && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{error}</div>}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--titi-surface)',
    border: '1px solid var(--titi-border)',
    borderRadius: 8,
    color: 'var(--titi-text)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
};
