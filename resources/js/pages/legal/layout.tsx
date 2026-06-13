import { Link } from '@inertiajs/react';
import { ModernHeader } from '@/components/home/modern-header';
import { ModernFooter } from '@/components/home/modern-footer';

const LEGAL_NAV = [
    { href: '/legal/mentions',  label: 'Mentions légales' },
    { href: '/legal/cgu',       label: "Conditions d'utilisation" },
    { href: '/legal/privacy',   label: 'Politique de confidentialité' },
    { href: '/legal/cookies',   label: 'Cookies' },
    { href: '/legal/rgpd',      label: 'RGPD' },
];

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
    const current = typeof window !== 'undefined' ? window.location.pathname : '';
    return (
        <>
            <ModernHeader />
            <div className="titi-page">
                <div className="legal-layout-container">

                    {/* Sidebar */}
                    <div className="legal-sidebar">
                        <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                            Pages légales
                        </p>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {LEGAL_NAV.map(item => {
                                const isActive = current === item.href;
                                return (
                                    <Link key={item.href} href={item.href} style={{
                                        display: 'block', padding: '7px 8px', borderRadius: 6,
                                        fontSize: '0.8125rem', fontWeight: isActive ? 500 : 400,
                                        color: isActive ? '#111827' : '#6B7280',
                                        background: isActive ? '#F3F4F6' : 'transparent',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#111827'; } }}
                                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = isActive ? '#F3F4F6' : 'transparent'; e.currentTarget.style.color = isActive ? '#111827' : '#6B7280'; } }}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="titi-card legal-content-card" style={{ padding: '32px 36px' }}>
                            <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
                                <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{title}</h1>
                                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
                                    Dernière mise à jour : {lastUpdated}
                                </p>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModernFooter />
        </>
    );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 10px' }}>{title}</h2>
            {children}
        </section>
    );
}

export function LegalP({ children }: { children: React.ReactNode }) {
    return <p style={{ margin: '0 0 10px', color: '#4B5563' }}>{children}</p>;
}

export function LegalList({ items }: { items: string[] }) {
    return (
        <ul style={{ margin: '0 0 10px', paddingLeft: 20, color: '#4B5563' }}>
            {items.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
        </ul>
    );
}
