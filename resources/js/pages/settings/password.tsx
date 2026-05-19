import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { ModernHeader } from '@/components/home/modern-header';
import { ModernFooter } from '@/components/home/modern-footer';

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

export default function Password() {
    const { auth } = usePage<SharedData>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) { reset('password', 'password_confirmation'); passwordInput.current?.focus(); }
                if (errs.current_password) { reset('current_password'); currentPasswordInput.current?.focus(); }
            },
        });
    };

    return (
        <>
            <Head title="Mot de passe — TITI EVENTS" />
            <ModernHeader user={auth.user ?? undefined} />

            <div className="titi-page">
                <div className="titi-content-wide">
                    <div style={{ marginBottom: 24 }}>
                        <h1 className="page-title">Paramètres</h1>
                        <p className="page-sub">Gérez votre profil et vos préférences.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                        <SettingsSidebar active="/settings/password" />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="titi-card">
                                <div className="titi-section" style={{ borderBottom: 'none' }}>
                                    <div className="titi-section-header">
                                        <p className="titi-section-title">Modifier le mot de passe</p>
                                        <p className="titi-section-desc">Utilisez un mot de passe long et unique (minimum 8 caractères).</p>
                                    </div>

                                    {recentlySuccessful && (
                                        <div className="titi-notice success" style={{ marginBottom: 20 }}>
                                            <i className="bi bi-check-circle" style={{ flexShrink: 0 }}></i>
                                            Mot de passe mis à jour.
                                        </div>
                                    )}

                                    <form onSubmit={updatePassword}>
                                        <div className="titi-field">
                                            <label className="titi-label" htmlFor="current_password">
                                                Mot de passe actuel
                                            </label>
                                            <input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                type="password"
                                                className={`titi-input${errors.current_password ? ' error' : ''}`}
                                                value={data.current_password}
                                                onChange={(e) => setData('current_password', e.target.value)}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                style={{ maxWidth: 320 }}
                                            />
                                            {errors.current_password && <span className="titi-error">{errors.current_password}</span>}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                                            <div className="titi-field" style={{ marginBottom: 0 }}>
                                                <label className="titi-label" htmlFor="password">Nouveau mot de passe</label>
                                                <input
                                                    id="password"
                                                    ref={passwordInput}
                                                    type="password"
                                                    className={`titi-input${errors.password ? ' error' : ''}`}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                />
                                                {errors.password && <span className="titi-error">{errors.password}</span>}
                                            </div>
                                            <div className="titi-field" style={{ marginBottom: 0 }}>
                                                <label className="titi-label" htmlFor="password_confirmation">Confirmer</label>
                                                <input
                                                    id="password_confirmation"
                                                    type="password"
                                                    className={`titi-input${errors.password_confirmation ? ' error' : ''}`}
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                />
                                                {errors.password_confirmation && <span className="titi-error">{errors.password_confirmation}</span>}
                                            </div>
                                        </div>

                                        <div className="titi-notice info" style={{ marginBottom: 20 }}>
                                            <i className="bi bi-info-circle" style={{ flexShrink: 0 }}></i>
                                            Minimum 8 caractères. Mélangez lettres, chiffres et symboles pour plus de sécurité.
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button type="submit" disabled={processing} className="btn-titi-primary">
                                                {processing
                                                    ? <><span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10, borderWidth: 2 }}></span> Enregistrement…</>
                                                    : 'Mettre à jour'
                                                }
                                            </button>
                                        </div>
                                    </form>
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
