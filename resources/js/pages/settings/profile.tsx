import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useForm as inertiaDeleteForm } from '@inertiajs/react';
import { ModernHeader } from '@/components/home/modern-header';
import { ModernFooter } from '@/components/home/modern-footer';

function SettingsSidebar({ active }: { active: string }) {
    const { auth } = usePage<SharedData>().props;
    const navItems = [
        { href: '/settings/profile',    icon: 'bi-person',       label: 'Profil' },
        { href: '/settings/password',   icon: 'bi-shield-lock',  label: 'Mot de passe' },
        { href: '/settings/appearance', icon: 'bi-palette',      label: 'Apparence' },
    ];
    return (
        <div style={{ width: 200, flexShrink: 0 }}>
            {/* User summary */}
            <div style={{ marginBottom: 8, padding: '0 8px 12px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{auth.user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 1 }}>{auth.user?.email}</div>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {navItems.map(item => {
                    const isActive = item.href === active;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '7px 8px', borderRadius: 6,
                                fontSize: '0.8125rem', fontWeight: isActive ? 500 : 400,
                                color: isActive ? '#111827' : '#6B7280',
                                background: isActive ? '#F3F4F6' : 'transparent',
                                textDecoration: 'none',
                                transition: 'background 0.1s ease, color 0.1s ease',
                            }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#111827'; } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
                        >
                            <i className={`bi ${item.icon}`} style={{ fontSize: '0.875rem', width: 16, textAlign: 'center' }}></i>
                            {item.label}
                        </Link>
                    );
                })}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
                    <Link
                        href="/dashboard"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#6B7280'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
                    >
                        <i className="bi bi-arrow-left" style={{ fontSize: '0.75rem' }}></i>
                        Tableau de bord
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const deletePasswordRef = useRef<HTMLInputElement>(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name:  auth.user?.name  || '',
        email: auth.user?.email || '',
    });

    const deleteForm = inertiaDeleteForm({ password: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        deleteForm.delete(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
            onError: () => deletePasswordRef.current?.focus(),
            onFinish: () => deleteForm.reset(),
        });
    };

    return (
        <>
            <Head title="Profil — Fondation TITI" />
            <ModernHeader user={auth.user} />

            <div className="titi-page">
                <div className="titi-content-wide">

                    {/* Page header */}
                    <div style={{ marginBottom: 24 }}>
                        <h1 className="page-title">Paramètres</h1>
                        <p className="page-sub">Gérez votre profil et vos préférences.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                        <SettingsSidebar active="/settings/profile" />

                        {/* Main content */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Profile section */}
                            <div className="titi-card">
                                <div className="titi-section">
                                    <div className="titi-section-header">
                                        <p className="titi-section-title">Informations du profil</p>
                                        <p className="titi-section-desc">Votre nom public et adresse email.</p>
                                    </div>

                                    {recentlySuccessful && (
                                        <div className="titi-notice success" style={{ marginBottom: 16 }}>
                                            <i className="bi bi-check-circle" style={{ flexShrink: 0 }}></i>
                                            Profil mis à jour avec succès.
                                        </div>
                                    )}

                                    <form onSubmit={submit}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                                            <div className="titi-field" style={{ marginBottom: 0 }}>
                                                <label className="titi-label" htmlFor="name">Nom complet</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    className={`titi-input${errors.name ? ' error' : ''}`}
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    autoComplete="name"
                                                    placeholder="Votre nom"
                                                    required
                                                />
                                                {errors.name && <span className="titi-error">{errors.name}</span>}
                                            </div>
                                            <div className="titi-field" style={{ marginBottom: 0 }}>
                                                <label className="titi-label" htmlFor="email">Adresse email</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    className={`titi-input${errors.email ? ' error' : ''}`}
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    autoComplete="email"
                                                    placeholder="vous@email.com"
                                                    required
                                                />
                                                {errors.email && <span className="titi-error">{errors.email}</span>}
                                            </div>
                                        </div>

                                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                                            <div className="titi-notice warning" style={{ marginBottom: 16 }}>
                                                <i className="bi bi-exclamation-triangle" style={{ flexShrink: 0 }}></i>
                                                <span>
                                                    Email non vérifié.{' '}
                                                    <Link href={route('verification.send')} method="post" as="button"
                                                        style={{ color: '#92400E', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                                                        Renvoyer le lien
                                                    </Link>
                                                    {status === 'verification-link-sent' && (
                                                        <span style={{ display: 'block', marginTop: 4, color: '#15803D', fontSize: '0.75rem' }}>
                                                            Lien de vérification envoyé.
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button type="submit" disabled={processing} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                height: 32, padding: '0 12px',
                                                background: processing ? '#6B7280' : '#16A34A',
                                                color: '#fff', border: 'none', borderRadius: 6,
                                                fontSize: '0.8125rem', fontWeight: 500, cursor: processing ? 'not-allowed' : 'pointer',
                                            }}>
                                                {processing
                                                    ? <><span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10, borderWidth: 2 }}></span> Enregistrement…</>
                                                    : 'Enregistrer les modifications'
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Danger zone */}
                            <div className="titi-card" style={{ borderColor: '#FECACA' }}>
                                <div className="titi-section" style={{ borderBottom: 'none' }}>
                                    <div className="titi-section-header">
                                        <p className="titi-section-title" style={{ color: '#DC2626' }}>Zone de danger</p>
                                        <p className="titi-section-desc">La suppression de votre compte est irréversible.</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#111827' }}>Supprimer mon compte</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>
                                                Toutes vos données seront définitivement effacées.
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-titi-secondary"
                                            style={{ borderColor: '#FECACA', color: '#DC2626', flexShrink: 0 }}
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            Supprimer le compte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete modal */}
            {showDeleteModal && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="titi-card"
                        style={{ width: '100%', maxWidth: 400, padding: 24, margin: 16 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>
                            Supprimer le compte
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5 }}>
                            Cette action est <strong style={{ color: '#111827' }}>irréversible</strong>. Entrez votre mot de passe pour confirmer.
                        </p>

                        <form onSubmit={handleDelete}>
                            <div className="titi-field" style={{ marginBottom: 20 }}>
                                <label className="titi-label" htmlFor="delete-password">Mot de passe</label>
                                <input
                                    id="delete-password"
                                    type="password"
                                    ref={deletePasswordRef}
                                    className={`titi-input${deleteForm.errors.password ? ' error' : ''}`}
                                    value={deleteForm.data.password}
                                    onChange={(e) => deleteForm.setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {deleteForm.errors.password && (
                                    <span className="titi-error">{deleteForm.errors.password}</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-titi-secondary" onClick={() => setShowDeleteModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-titi-danger" disabled={deleteForm.processing}>
                                    {deleteForm.processing
                                        ? <><span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10, borderWidth: 2 }}></span> Suppression…</>
                                        : 'Supprimer définitivement'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ModernFooter />
        </>
    );
}
