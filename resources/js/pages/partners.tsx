import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';
import { type SharedData } from '@/types';

interface Partner {
    id: number;
    name: string;
    logo: string;
    description: string;
    website: string;
    category: string;
    partnership: string;
    since: number;
    color?: string;
}

interface PartnerStats {
    total_partners: number;
    categories_count: number;
    years_experience: number;
    total_contribution: number;
}

interface PartnersProps {
    user?: { name: string; email: string };
    partners?: Partner[];
    stats?: PartnerStats;
}

const CATEGORY_COLORS: Record<string, string> = {
    Technologie: '#2563EB',
    Finance: '#D97706',
    Éducation: '#7C3AED',
    Télécommunications: '#0891B2',
    Énergie: '#16A34A',
    Agroalimentaire: '#15803D',
    Transport: '#6B7280',
};

const ADVANTAGES = [
    { icon: 'bi-bullseye',        title: 'Impact Social Mesurable',  desc: "Contribuez concrètement à des projets qui transforment des vies." },
    { icon: 'bi-globe-africa',    title: 'Visibilité Régionale',      desc: "Bénéficiez d'une exposition dans tout l'écosystème camerounais." },
    { icon: 'bi-people-fill',     title: 'Réseau Étendu',             desc: "Accédez à notre réseau de partenaires, experts et leaders." },
    { icon: 'bi-bar-chart-line-fill', title: 'Reporting Transparent', desc: "Recevez des rapports détaillés sur l'impact de votre partenariat." },
];

const CATEGORIES    = ['Technologie', 'Finance', 'Éducation', 'Télécommunications', 'Énergie', 'Agroalimentaire', 'Transport'];
const PARTNERSHIP_TYPES = ['Financier', 'Technique', 'Académique', 'Environnemental', 'Social', 'Innovation'];

export default function Partners({ partners: dbPartners = [], stats: dbStats }: PartnersProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const [visiblePartners, setVisiblePartners] = useState<number[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '', contactName: '', email: '', phone: '',
        website: '', category: '', partnershipType: '', description: '', budget: '',
    });
    const partnersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = parseInt(entry.target.getAttribute('data-partner-id') || '0');
                    setVisiblePartners(prev => prev.includes(id) ? prev : [...prev, id]);
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('[data-partner-id]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/partners/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowSuccess(true);
                setFormData({ companyName: '', contactName: '', email: '', phone: '', website: '', category: '', partnershipType: '', description: '', budget: '' });
                setTimeout(() => setShowSuccess(false), 5000);
            }
        } catch { /* silent */ }
    };

    const labelStyle: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 };
    const inputStyle: React.CSSProperties = { width: '100%', height: 36, padding: '0 10px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: '#fff' };
    const selectStyle: React.CSSProperties = { ...inputStyle };
    const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

    return (
        <>
            <Head>
                <title>Partenaires — TITI EVENTS</title>
                <meta name="description" content="Découvrez nos partenaires et rejoignez notre écosystème d'impact social." />
            </Head>

            <ModernHeader user={user ?? undefined} />

            <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 66 }}>
                {/* Page header */}
                <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '32px 0' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                            <i className="bi bi-handshake me-2" />Partenariat
                        </p>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Nos Partenaires</h1>
                        <p style={{ color: '#6B7280', margin: 0, fontSize: '0.9375rem' }}>
                            Ensemble, nous construisons un écosystème d'innovation et d'impact social.
                        </p>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
                            {[
                                { value: dbStats?.total_partners ?? dbPartners.length, label: 'Partenaires actifs' },
                                { value: dbStats?.categories_count ?? CATEGORIES.length, label: "Secteurs d'activité" },
                                { value: dbStats?.years_experience ?? 5, label: "Années d'expérience" },
                            ].map(s => (
                                <div key={s.label}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16A34A', margin: 0 }}>{s.value}</p>
                                    <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                    {/* Grille partenaires */}
                    <div ref={partnersRef}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: 16 }}>Ils nous font confiance</h2>

                        {dbPartners.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10 }}>
                                <i className="bi bi-buildings" style={{ fontSize: '2rem', color: '#D1D5DB' }} />
                                <p style={{ marginTop: 12, color: '#6B7280' }}>Aucun partenaire enregistré pour le moment.</p>
                                <a href="#become-partner" style={{ display: 'inline-block', marginTop: 8, height: 34, lineHeight: '34px', padding: '0 14px', border: '1px solid #16A34A', color: '#16A34A', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>
                                    Devenir partenaire
                                </a>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                                {dbPartners.map((partner, index) => {
                                    const catColor = CATEGORY_COLORS[partner.category] ?? '#6B7280';
                                    const isVisible = visiblePartners.includes(partner.id);
                                    return (
                                        <div
                                            key={partner.id}
                                            data-partner-id={partner.id}
                                            style={{
                                                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
                                                overflow: 'hidden',
                                                opacity: isVisible ? 1 : 0,
                                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                                transition: `opacity 0.5s ${index * 0.05}s, transform 0.5s ${index * 0.05}s`,
                                            }}
                                        >
                                            <div style={{ height: 4, background: catColor }} />
                                            <div style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <i className={`bi ${partner.logo}`} style={{ fontSize: '1.25rem', color: catColor }} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '0.9375rem' }}>{partner.name}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{partner.partnership}</p>
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>{partner.description}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#6B7280', borderTop: '1px solid #F3F4F6', paddingTop: 12 }}>
                                                    <span><i className="bi bi-tag me-1" />{partner.category}</span>
                                                    <span><i className="bi bi-calendar me-1" />Depuis {partner.since}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Pourquoi devenir partenaire */}
                    <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="partners-why-grid">
                        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '28px' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: 20 }}>Pourquoi devenir partenaire ?</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {ADVANTAGES.map((a, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <i className={`bi ${a.icon}`} style={{ color: '#16A34A', fontSize: '1rem' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 2px', fontSize: '0.9375rem' }}>{a.title}</p>
                                            <p style={{ color: '#6B7280', margin: 0, fontSize: '0.875rem' }}>{a.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '28px' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: 20 }}>Notre Impact Collectif</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                {[
                                    { value: '150K+', label: 'Bénéficiaires touchés' },
                                    { value: '2.5B',  label: 'FCFA mobilisés' },
                                    { value: '85',    label: 'Projets financés' },
                                    { value: '12',    label: 'Régions couvertes' },
                                ].map(s => (
                                    <div key={s.label} style={{ padding: '16px', background: '#F9FAFB', borderRadius: 8, textAlign: 'center' }}>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16A34A', margin: 0 }}>{s.value}</p>
                                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '4px 0 0' }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Formulaire partenariat */}
                    <div id="become-partner" style={{ marginTop: 48 }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Rejoignez-nous !</h2>
                        <p style={{ color: '#6B7280', marginBottom: 24, fontSize: '0.9375rem' }}>
                            Vous partagez notre vision ? Devenons partenaires pour créer un impact durable ensemble.
                        </p>

                        {showSuccess && (
                            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#15803D', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <i className="bi bi-check-circle" />
                                Votre demande a été envoyée. Nous vous recontacterons sous 48h.
                            </div>
                        )}

                        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '28px' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div style={grid2} className="form-grid-2">
                                        <div>
                                            <label style={labelStyle}>Nom de l'entreprise *</label>
                                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Nom du contact *</label>
                                            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={grid2} className="form-grid-2">
                                        <div>
                                            <label style={labelStyle}>Email *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Téléphone</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={grid2} className="form-grid-2">
                                        <div>
                                            <label style={labelStyle}>Site web</label>
                                            <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Secteur d'activité *</label>
                                            <select name="category" value={formData.category} onChange={handleChange} required style={selectStyle}>
                                                <option value="">Sélectionnez…</option>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                <option value="Autre">Autre</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={grid2} className="form-grid-2">
                                        <div>
                                            <label style={labelStyle}>Type de partenariat *</label>
                                            <select name="partnershipType" value={formData.partnershipType} onChange={handleChange} required style={selectStyle}>
                                                <option value="">Sélectionnez…</option>
                                                {PARTNERSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Budget approximatif</label>
                                            <select name="budget" value={formData.budget} onChange={handleChange} style={selectStyle}>
                                                <option value="">Non spécifié</option>
                                                <option value="< 1M FCFA">Moins de 1M FCFA</option>
                                                <option value="1-5M FCFA">1 – 5M FCFA</option>
                                                <option value="5-10M FCFA">5 – 10M FCFA</option>
                                                <option value="10-50M FCFA">10 – 50M FCFA</option>
                                                <option value="> 50M FCFA">Plus de 50M FCFA</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Description du projet de partenariat *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            placeholder="Décrivez vos objectifs et comment vous souhaitez contribuer à notre mission…"
                                            style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                        <button type="submit" style={{ height: 36, padding: '0 18px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                                            <i className="bi bi-send me-2" />Envoyer ma demande
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.8125rem', marginTop: 12 }}>
                            Nous étudierons votre demande et vous recontacterons sous 48h.
                        </p>
                    </div>
                </div>
            </div>

            <ModernFooter />

            <style>{`
                @media (max-width: 640px) {
                    .partners-why-grid { grid-template-columns: 1fr !important; }
                    .form-grid-2 { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}
