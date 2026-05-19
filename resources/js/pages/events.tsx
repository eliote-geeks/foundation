import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

type PublicEvent = {
    id: number;
    title: string;
    short_description: string | null;
    location: string;
    start_date_iso: string;
    end_date_iso: string;
    start_date_display: string;
    category: string;
    category_display: string;
    status: string;
    status_display: string;
    image: string | null;
    is_free: boolean;
    formatted_price: string;
    capacity: number | null;
    available_tickets: number;
};

interface EventsPageProps {
    user?: { name: string; email: string };
    events: PublicEvent[];
    categories: string[];
    filters: { search: string; category: string };
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    published: { label: 'Ouvert',   color: '#15803D', bg: '#F0FDF4' },
    cancelled:  { label: 'Annulé',  color: '#DC2626', bg: '#FEF2F2' },
    completed:  { label: 'Terminé', color: '#6B7280', bg: '#F9FAFB' },
};

export default function EventsPage({ user, events, categories, filters }: EventsPageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return events.filter(e => {
            const matchCat = category ? e.category === category : true;
            const matchQ   = q ? `${e.title} ${e.location} ${e.short_description ?? ''}`.toLowerCase().includes(q) : true;
            return matchCat && matchQ;
        });
    }, [events, search, category]);

    return (
        <>
            <Head>
                <title>Événements — TITI EVENTS</title>
                <meta name="description" content="Découvrez les événements à venir de la TITI EVENTS." />
                <link rel="canonical" href="/events" />
            </Head>

            <ModernHeader user={user} />

            <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 66 }}>
                {/* Page header */}
                <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '32px 0' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                                    <i className="bi bi-calendar-event me-2" />Agenda
                                </p>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Événements à venir</h1>
                                <p style={{ color: '#6B7280', marginTop: 6, marginBottom: 0, fontSize: '0.9375rem' }}>
                                    Réservez votre place ou demandez une invitation.
                                </p>
                            </div>
                            {/* Filters */}
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
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    style={{ height: 36, padding: '0 10px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.875rem', background: '#fff' }}
                                >
                                    <option value="">Toutes catégories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10 }}>
                            <i className="bi bi-calendar-x" style={{ fontSize: '2rem', color: '#D1D5DB' }} />
                            <p style={{ marginTop: 12, color: '#6B7280', fontWeight: 500 }}>Aucun événement trouvé.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                            {filtered.map(event => {
                                const st = STATUS_MAP[event.status] ?? STATUS_MAP.completed;
                                return (
                                    <div key={event.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        {/* Image */}
                                        <div style={{
                                            height: 160,
                                            background: event.image ? `url(${event.image}) center/cover` : '#F3F4F6',
                                            display: event.image ? undefined : 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {!event.image && <i className="bi bi-calendar-event" style={{ fontSize: '2rem', color: '#D1D5DB' }} />}
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {/* Badges */}
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: st.bg, color: st.color }}>
                                                    {st.label}
                                                </span>
                                                <span style={{ fontSize: '0.6875rem', fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: '#F3F4F6', color: '#374151' }}>
                                                    {event.category_display}
                                                </span>
                                            </div>

                                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.4 }}>{event.title}</h3>

                                            {event.short_description && (
                                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                                                    {event.short_description}
                                                </p>
                                            )}

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.8125rem', color: '#374151' }}>
                                                <span><i className="bi bi-calendar me-2" style={{ color: '#16A34A' }} />{event.start_date_display}</span>
                                                <span><i className="bi bi-geo-alt me-2" style={{ color: '#16A34A' }} />{event.location}</span>
                                                <span><i className="bi bi-ticket-perforated me-2" style={{ color: '#16A34A' }} />{event.formatted_price}</span>
                                            </div>

                                            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                                                <a
                                                    href={`/events/${event.id}`}
                                                    style={{
                                                        display: 'block', textAlign: 'center', height: 34,
                                                        lineHeight: '34px', background: '#16A34A', color: '#fff',
                                                        borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500,
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    Voir & Réserver
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* CTA partenaire */}
                    <div style={{ marginTop: 40, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>Vous organisez un événement avec la Fondation ?</p>
                            <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: '0.875rem' }}>Devenez partenaire ou proposez un événement.</p>
                        </div>
                        <a href="/partners" style={{ height: 34, padding: '0 14px', lineHeight: '34px', border: '1px solid #16A34A', color: '#16A34A', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            Devenir partenaire
                        </a>
                    </div>
                </div>
            </div>

            <ModernFooter />
        </>
    );
}
