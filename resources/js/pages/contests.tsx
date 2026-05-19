import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface Contest {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
    endDate: string | null;
    votes: number;
    status: 'active' | 'ended' | 'upcoming';
    prize: string | null;
}

interface ContestsProps {
    user?: { name: string; email: string };
    contests?: Contest[];
}

const STATUS_STYLES: Record<Contest['status'], { label: string; color: string; bg: string }> = {
    active:   { label: 'Actif',    color: '#15803D', bg: '#F0FDF4' },
    ended:    { label: 'Terminé',  color: '#6B7280', bg: '#F9FAFB' },
    upcoming: { label: 'À venir',  color: '#92400E', bg: '#FFFBEB' },
};

const CATEGORY_COLORS: Record<string, string> = {
    innovation:    '#16A34A',
    environnement: '#0D9488',
    education:     '#2563EB',
    sante:         '#DC2626',
    culture:       '#7C3AED',
};

const STEPS = [
    { icon: 'bi-pencil-square', title: 'Inscrivez-vous',       desc: 'Créez votre compte sur notre plateforme' },
    { icon: 'bi-lightbulb',     title: 'Soumettez votre projet', desc: 'Présentez votre idée avec tous les détails' },
    { icon: 'bi-hand-thumbs-up', title: 'Vote du public',       desc: 'La communauté vote pour les meilleurs projets' },
    { icon: 'bi-trophy',         title: 'Remportez le prix',    desc: 'Les gagnants reçoivent financement et accompagnement' },
];

export default function Contests({ user, contests: dbContests = [] }: ContestsProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [voted, setVoted] = useState<number[]>([]);

    const categories = [
        { value: 'all',           label: 'Toutes les catégories' },
        { value: 'innovation',    label: 'Innovation' },
        { value: 'environnement', label: 'Environnement' },
        { value: 'education',     label: 'Éducation' },
        { value: 'sante',         label: 'Santé' },
        { value: 'culture',       label: 'Culture' },
    ];

    const filtered = dbContests.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
        const matchCat    = selectedCategory === 'all' || c.category === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <>
            <Head>
                <title>Concours — TITI EVENTS</title>
                <meta name="description" content="Participez aux concours de la TITI EVENTS et votez pour les projets innovants." />
            </Head>

            <ModernHeader user={user} />

            <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 66 }}>
                {/* Page header */}
                <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '32px 0' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                                    <i className="bi bi-trophy me-2" />Concours
                                </p>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Concours & Innovation</h1>
                                <p style={{ color: '#6B7280', marginTop: 6, marginBottom: 0, fontSize: '0.9375rem' }}>
                                    Découvrez les projets innovants et votez pour ceux qui vous inspirent.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative' }}>
                                    <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.875rem' }} />
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Rechercher…"
                                        style={{ height: 36, paddingLeft: 30, paddingRight: 10, border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.875rem', width: 200, outline: 'none', background: '#fff' }}
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    style={{ height: 36, padding: '0 10px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.875rem', background: '#fff' }}
                                >
                                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                    {/* Grid des concours */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10 }}>
                            <i className="bi bi-trophy" style={{ fontSize: '2rem', color: '#D1D5DB' }} />
                            <p style={{ marginTop: 12, color: '#6B7280', fontWeight: 500 }}>
                                {dbContests.length === 0 ? 'Aucun concours disponible pour le moment.' : 'Aucun concours ne correspond à votre recherche.'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                            {filtered.map(contest => {
                                const st = STATUS_STYLES[contest.status];
                                const catColor = CATEGORY_COLORS[contest.category] ?? '#6B7280';
                                const hasVoted = voted.includes(contest.id);
                                return (
                                    <div key={contest.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        {/* Colored accent bar */}
                                        <div style={{ height: 4, background: catColor }} />

                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {/* Icon + status */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className={`bi ${contest.icon}`} style={{ fontSize: '1.25rem', color: catColor }} />
                                                </div>
                                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: st.bg, color: st.color }}>
                                                    {st.label}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>{contest.title}</h3>
                                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{contest.description}</p>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#6B7280' }}>
                                                <span><i className="bi bi-calendar me-1" />Fin : {contest.endDate ? new Date(contest.endDate).toLocaleDateString('fr-FR') : '—'}</span>
                                                <span><i className="bi bi-hand-thumbs-up me-1" />{contest.votes} votes</span>
                                            </div>

                                            {contest.prize && (
                                                <div style={{ fontSize: '0.8125rem', color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '6px 10px' }}>
                                                    <i className="bi bi-award me-1" />Prix : {contest.prize}
                                                </div>
                                            )}

                                            <div style={{ marginTop: 'auto', paddingTop: 4, display: 'flex', gap: 6 }}>
                                                <Link
                                                    href={`/contests/${contest.id}`}
                                                    style={{
                                                        flex: 1, height: 34, lineHeight: '34px', textAlign: 'center', borderRadius: 6,
                                                        fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none',
                                                        border: '1px solid #D1D5DB', color: '#374151', background: '#fff', display: 'block',
                                                    }}
                                                >
                                                    <i className="bi bi-eye me-1" />Voir
                                                </Link>
                                                {contest.status === 'active' && (
                                                    <Link
                                                        href={`/contests/${contest.id}`}
                                                        style={{
                                                            flex: 2, height: 34, lineHeight: '34px', textAlign: 'center', borderRadius: 6,
                                                            fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none',
                                                            background: '#16A34A', color: '#fff', display: 'block',
                                                        }}
                                                    >
                                                        <i className="bi bi-lightbulb me-1" />Participer
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Comment participer */}
                    <div style={{ marginTop: 48 }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Comment participer ?</h2>
                        <p style={{ color: '#6B7280', marginBottom: 24, fontSize: '0.9375rem' }}>Suivez ces 4 étapes pour donner vie à vos projets.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                            {STEPS.map((step, i) => (
                                <div key={i} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderRadius: '50%', background: '#16A34A', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                                    <i className={`bi ${step.icon}`} style={{ fontSize: '1.5rem', color: '#16A34A', display: 'block', marginBottom: 12 }} />
                                    <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 6px', fontSize: '0.9375rem' }}>{step.title}</p>
                                    <p style={{ color: '#6B7280', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 32, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>Prêt à soumettre votre projet ?</p>
                            <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: '0.875rem' }}>Créez un compte et participez à notre prochain concours.</p>
                        </div>
                        <a href="/register" style={{ height: 34, padding: '0 14px', lineHeight: '34px', background: '#16A34A', color: '#fff', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            <i className="bi bi-rocket-takeoff me-1" />Commencer maintenant
                        </a>
                    </div>
                </div>
            </div>

            <ModernFooter />
        </>
    );
}
