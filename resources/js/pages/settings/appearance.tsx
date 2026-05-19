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
            <div style={{ marginBottom: 8, padding: '0 8px 12px', borderBottom: '1px solid var(--titi-border)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-text)' }}>{auth.user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginTop: 1 }}>{auth.user?.email}</div>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {navItems.map(item => {
                    const isActive = item.href === active;
                    return (
                        <Link key={item.href} href={item.href}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: '0.8125rem', fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--titi-text)' : 'var(--titi-sub)', background: isActive ? 'var(--titi-surface)' : 'transparent', textDecoration: 'none', transition: 'background 0.1s ease' }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--titi-surface)'; e.currentTarget.style.color = 'var(--titi-text)'; } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--titi-sub)'; } }}
                        >
                            <i className={`bi ${item.icon}`} style={{ fontSize: '0.875rem', width: 16, textAlign: 'center' }}></i>
                            {item.label}
                        </Link>
                    );
                })}
                {auth.user?.is_admin && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--titi-border)' }}>
                        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: '0.75rem', color: 'var(--titi-muted)', textDecoration: 'none' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--titi-sub)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--titi-muted)'; }}>
                            <i className="bi bi-speedometer2" style={{ fontSize: '0.75rem' }}></i>
                            Tableau de bord
                        </Link>
                    </div>
                )}
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
            <Head title="Apparence — TITI EVENTS" />
            <ModernHeader user={auth.user ?? undefined} />

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
                                                        border: `1px solid ${isSelected ? '#16A34A' : 'var(--titi-border)'}`,
                                                        borderRadius: 8,
                                                        background: isSelected ? '#F0FDF4' : 'var(--titi-white)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                        outline: 'none',
                                                    }}
                                                >
                                                    <i
                                                        className={`bi ${theme.icon}`}
                                                        style={{ fontSize: '1.25rem', color: isSelected ? '#16A34A' : 'var(--titi-sub)' }}
                                                    ></i>
                                                    <div>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: isSelected ? '#14532D' : 'var(--titi-text)' }}>
                                                            {theme.label}
                                                            {isSelected && <i className="bi bi-check-circle-fill ms-1" style={{ color: '#16A34A', fontSize: '0.75rem' }}></i>}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginTop: 1 }}>{theme.desc}</div>
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
