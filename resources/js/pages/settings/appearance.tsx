import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ModernHeader } from '@/components/home/modern-header';
import { ModernFooter } from '@/components/home/modern-footer';
import { useAppearance } from '@/hooks/use-appearance';

function SettingsSidebar({ active }: { active: string }) {
    const { auth } = usePage<SharedData>().props;
    const navItems = [
        { href: '/settings/profile',    icon: 'bi-person',      label: 'Profil' },
        { href: '/settings/password',   icon: 'bi-shield-lock', label: 'Mot de passe' },
        { href: '/settings/appearance', icon: 'bi-palette',     label: 'Apparence' },
    ];
    return (
        <div style={{ width: 200, flexShrink: 0 }}>
            <div style={{ marginBottom: 8, padding: '0 8px 12px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{auth.user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 1 }}>{auth.user?.email}</div>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {navItems.map(item => {
                    const isActive = item.href === active;
                    return (
                        <Link key={item.href} href={item.href}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: '0.8125rem', fontWeight: isActive ? 500 : 400, color: isActive ? '#111827' : '#6B7280', background: isActive ? '#F3F4F6' : 'transparent', textDecoration: 'none', transition: 'background 0.1s ease' }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#111827'; } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
                        >
                            <i className={`bi ${item.icon}`} style={{ fontSize: '0.875rem', width: 16, textAlign: 'center' }}></i>
                            {item.label}
                        </Link>
                    );
                })}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#6B7280'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}>
                        <i className="bi bi-arrow-left" style={{ fontSize: '0.75rem' }}></i>
                        Tableau de bord
                    </Link>
                </div>
            </nav>
        </div>
    );
}

const themes = [
    { value: 'light'  as const, icon: 'bi-sun',         label: 'Clair',   desc: 'Interface lumineuse' },
    { value: 'dark'   as const, icon: 'bi-moon-stars',  label: 'Sombre',  desc: 'Interface sombre' },
    { value: 'system' as const, icon: 'bi-display',     label: 'Système', desc: "Suit votre OS" },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const { appearance, updateAppearance } = useAppearance();

    return (
        <>
            <Head title="Apparence — Fondation TITI" />
            <ModernHeader user={auth.user} />

            <div className="titi-page">
                <div className="titi-content-wide">
                    <div style={{ marginBottom: 24 }}>
                        <h1 className="page-title">Paramètres</h1>
                        <p className="page-sub">Gérez votre profil et vos préférences.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                        <SettingsSidebar active="/settings/appearance" />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="titi-card">
                                <div className="titi-section" style={{ borderBottom: 'none' }}>
                                    <div className="titi-section-header">
                                        <p className="titi-section-title">Apparence</p>
                                        <p className="titi-section-desc">Choisissez le thème d'affichage de l'interface.</p>
                                    </div>

                                    <div style={{ display: 'flex', gap: 10 }}>
                                        {themes.map((theme) => {
                                            const isSelected = appearance === theme.value;
                                            return (
                                                <button
                                                    key={theme.value}
                                                    type="button"
                                                    onClick={() => updateAppearance(theme.value)}
                                                    style={{
                                                        flex: 1,
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                        gap: 8, padding: '16px 12px',
                                                        border: `1px solid ${isSelected ? '#16A34A' : '#E5E7EB'}`,
                                                        borderRadius: 8,
                                                        background: isSelected ? '#F0FDF4' : '#FFFFFF',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                        outline: 'none',
                                                    }}
                                                >
                                                    <i
                                                        className={`bi ${theme.icon}`}
                                                        style={{ fontSize: '1.25rem', color: isSelected ? '#16A34A' : '#6B7280' }}
                                                    ></i>
                                                    <div>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: isSelected ? '#14532D' : '#111827' }}>
                                                            {theme.label}
                                                            {isSelected && <i className="bi bi-check-circle-fill ms-1" style={{ color: '#16A34A', fontSize: '0.75rem' }}></i>}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 1 }}>{theme.desc}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModernFooter />
        </>
    );
}
