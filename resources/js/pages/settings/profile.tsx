import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { useForm as inertiaDeleteForm } from '@inertiajs/react';
import { ModernHeader } from '@/components/home/modern-header';
import { ModernFooter } from '@/components/home/modern-footer';

interface ProfileData {
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    bio?: string | null;
    profession?: string | null;
    company?: string | null;
    linkedin_url?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    avatar_path?: string | null;
}

function SettingsSidebar({ active }: { active: string }) {
    const { auth } = usePage<SharedData>().props;
    const navItems = [
        { href: '/settings/profile',    icon: 'bi-person',       label: 'Profil' },
        { href: '/settings/password',   icon: 'bi-shield-lock',  label: 'Mot de passe' },
        { href: '/settings/appearance', icon: 'bi-palette',      label: 'Apparence' },
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
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '7px 8px', borderRadius: 6,
                                fontSize: '0.8125rem', fontWeight: isActive ? 500 : 400,
                                color: isActive ? 'var(--titi-text)' : 'var(--titi-sub)',
                                background: isActive ? 'var(--titi-surface)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'background 0.1s ease, color 0.1s ease',
                            }}
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
                        <Link
                            href="/dashboard"
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, fontSize: '0.75rem', color: 'var(--titi-muted)', textDecoration: 'none' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--titi-sub)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--titi-muted)'; }}
                        >
                            <i className="bi bi-speedometer2" style={{ fontSize: '0.75rem' }}></i>
                            Tableau de bord
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default function Profile({
    mustVerifyEmail,
    status,
    profileData,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    profileData?: ProfileData;
}) {
    const { auth } = usePage<SharedData>().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profileData?.avatar_path ? `/storage/${profileData.avatar_path}` : null);
    const deletePasswordRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: 'PATCH',
        name:          auth.user?.name  ?? '',
        email:         auth.user?.email ?? '',
        phone:         profileData?.phone        ?? '',
        city:          profileData?.city         ?? '',
        country:       profileData?.country      ?? '',
        bio:           profileData?.bio          ?? '',
        profession:    profileData?.profession   ?? '',
        company:       profileData?.company      ?? '',
        linkedin_url:  profileData?.linkedin_url  ?? '',
        facebook_url:  profileData?.facebook_url  ?? '',
        instagram_url: profileData?.instagram_url ?? '',
        twitter_url:   profileData?.twitter_url   ?? '',
        avatar:        null as File | null,
    });

    const deleteForm = inertiaDeleteForm({ password: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update.post'), { forceFormData: true, preserveScroll: true });
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

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('avatar', file);
        const reader = new FileReader();
        reader.onload = ev => setAvatarPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const inp: React.CSSProperties = { width: '100%', border: '1px solid var(--titi-border)', borderRadius: 6, padding: '7px 10px', fontSize: '0.875rem', outline: 'none', background: 'var(--titi-white)', color: 'var(--titi-text)' };
    const lbl: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 500, color: 'var(--titi-sub)', display: 'block', marginBottom: 4 };
    const section: React.CSSProperties = { background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 10, padding: 24, marginBottom: 16 };

    return (
        <>
            <Head title="Profil — TITI EVENTS" />
            <ModernHeader user={auth.user ?? undefined} />

            <div className="titi-page">
                <div className="titi-content-wide">
                    <div style={{ marginBottom: 24 }}>
                        <h1 className="page-title">Paramètres</h1>
                        <p className="page-sub">Gérez votre profil et vos préférences.</p>
                    </div>

                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                        <SettingsSidebar active="/settings/profile" />

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <form onSubmit={submit} encType="multipart/form-data">

                                {/* Success */}
                                {(recentlySuccessful || status === 'profile-updated') && (
                                    <div style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: '#15803D' }}>
                                        <i className="bi bi-check-circle-fill" />
                                        Profil mis à jour avec succès.
                                    </div>
                                )}

                                {/* ── Avatar ── */}
                                <div style={section}>
                                    <p style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 4, fontSize: '0.9375rem' }}>Photo de profil</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginBottom: 16 }}>JPG ou PNG, max 2 Mo.</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div
                                            onClick={() => fileRef.current?.click()}
                                            style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--titi-surface)', border: '2px dashed var(--titi-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}
                                        >
                                            {avatarPreview
                                                ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <i className="bi bi-person-fill" style={{ fontSize: '2rem', color: 'var(--titi-muted)' }} />
                                            }
                                        </div>
                                        <div>
                                            <button type="button" onClick={() => fileRef.current?.click()}
                                                style={{ background: 'var(--titi-surface)', border: '1px solid var(--titi-border)', borderRadius: 6, padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', marginBottom: 6, color: 'var(--titi-text)' }}>
                                                <i className="bi bi-upload me-2" />Choisir une photo
                                            </button>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--titi-muted)', margin: 0 }}>Cliquez sur l'avatar ou le bouton pour changer la photo</p>
                                        </div>
                                        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
                                    </div>
                                </div>

                                {/* ── Identité ── */}
                                <div style={section}>
                                    <p style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 4, fontSize: '0.9375rem' }}>Informations d'identité</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginBottom: 16 }}>Nom public, email et contact.</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                        <div>
                                            <label style={lbl}>Nom complet *</label>
                                            <input type="text" required style={inp} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Votre nom" />
                                            {errors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.name}</span>}
                                        </div>
                                        <div>
                                            <label style={lbl}>Adresse email *</label>
                                            <input type="email" required style={inp} value={data.email} onChange={e => setData('email', e.target.value)} placeholder="vous@email.com" />
                                            {errors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.email}</span>}
                                        </div>
                                    </div>
                                    {mustVerifyEmail && auth.user?.email_verified_at === null && (
                                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: '0.8125rem', color: '#92400E' }}>
                                            <i className="bi bi-exclamation-triangle me-2" />
                                            Email non vérifié.{' '}
                                            <Link href={route('verification.send')} method="post" as="button"
                                                style={{ color: '#92400E', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                                                Renvoyer le lien
                                            </Link>
                                        </div>
                                    )}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label style={lbl}>Téléphone</label>
                                            <input type="tel" style={inp} value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+237 6XX XXX XXX" />
                                        </div>
                                        <div>
                                            <label style={lbl}>Ville</label>
                                            <input type="text" style={inp} value={data.city} onChange={e => setData('city', e.target.value)} placeholder="Yaoundé" />
                                        </div>
                                    </div>
                                </div>

                                {/* ── Profil professionnel ── */}
                                <div style={section}>
                                    <p style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 4, fontSize: '0.9375rem' }}>Profil professionnel</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginBottom: 16 }}>Informations sur votre activité.</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                        <div>
                                            <label style={lbl}>Profession</label>
                                            <input type="text" style={inp} value={data.profession} onChange={e => setData('profession', e.target.value)} placeholder="Entrepreneur, Ingénieur…" />
                                        </div>
                                        <div>
                                            <label style={lbl}>Entreprise / Organisation</label>
                                            <input type="text" style={inp} value={data.company} onChange={e => setData('company', e.target.value)} placeholder="Nom de l'entreprise" />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={lbl}>Bio</label>
                                        <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={data.bio} onChange={e => setData('bio', e.target.value)} placeholder="Quelques mots sur vous…" />
                                    </div>
                                </div>

                                {/* ── Réseaux sociaux ── */}
                                <div style={section}>
                                    <p style={{ fontWeight: 600, color: 'var(--titi-text)', marginBottom: 4, fontSize: '0.9375rem' }}>Réseaux sociaux</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginBottom: 16 }}>Liens vers vos profils publics.</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        {[
                                            { key: 'linkedin_url', icon: 'bi-linkedin', label: 'LinkedIn', ph: 'https://linkedin.com/in/…' },
                                            { key: 'facebook_url', icon: 'bi-facebook', label: 'Facebook', ph: 'https://facebook.com/…' },
                                            { key: 'instagram_url', icon: 'bi-instagram', label: 'Instagram', ph: 'https://instagram.com/…' },
                                            { key: 'twitter_url', icon: 'bi-twitter-x', label: 'Twitter / X', ph: 'https://x.com/…' },
                                        ].map(({ key, icon, label, ph }) => (
                                            <div key={key}>
                                                <label style={lbl}>
                                                    <i className={`bi ${icon} me-1`} style={{ color: '#6B7280' }} />{label}
                                                </label>
                                                <input type="url" style={inp}
                                                    value={(data as any)[key]}
                                                    onChange={e => setData(key as any, e.target.value)}
                                                    placeholder={ph} />
                                                {(errors as any)[key] && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{(errors as any)[key]}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Save button */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                                    <button type="submit" disabled={processing} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        height: 36, padding: '0 16px',
                                        background: processing ? '#6B7280' : '#16A34A',
                                        color: '#fff', border: 'none', borderRadius: 6,
                                        fontSize: '0.875rem', fontWeight: 500, cursor: processing ? 'not-allowed' : 'pointer',
                                    }}>
                                        {processing
                                            ? <><span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10, borderWidth: 2 }} /> Enregistrement…</>
                                            : <><i className="bi bi-check-lg" /> Enregistrer les modifications</>
                                        }
                                    </button>
                                </div>
                            </form>

                            {/* Danger zone */}
                            <div className="titi-card" style={{ borderColor: '#FECACA' }}>
                                <div className="titi-section" style={{ borderBottom: 'none' }}>
                                    <div className="titi-section-header">
                                        <p className="titi-section-title" style={{ color: '#DC2626' }}>Zone de danger</p>
                                        <p className="titi-section-desc">La suppression de votre compte est irréversible.</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--titi-text)' }}>Supprimer mon compte</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>Toutes vos données seront définitivement effacées.</div>
                                        </div>
                                        <button type="button" className="btn-titi-secondary"
                                            style={{ borderColor: '#FECACA', color: '#DC2626', flexShrink: 0 }}
                                            onClick={() => setShowDeleteModal(true)}>
                                            Supprimer le compte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setShowDeleteModal(false)}>
                    <div className="titi-card" style={{ width: '100%', maxWidth: 400, padding: 24, margin: 16 }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: '0 0 6px' }}>Supprimer le compte</h3>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5 }}>
                            Cette action est <strong style={{ color: '#111827' }}>irréversible</strong>. Entrez votre mot de passe pour confirmer.
                        </p>
                        <form onSubmit={handleDelete}>
                            <div className="titi-field" style={{ marginBottom: 20 }}>
                                <label className="titi-label" htmlFor="delete-password">Mot de passe</label>
                                <input id="delete-password" type="password" ref={deletePasswordRef}
                                    className={`titi-input${deleteForm.errors.password ? ' error' : ''}`}
                                    value={deleteForm.data.password}
                                    onChange={e => deleteForm.setData('password', e.target.value)}
                                    placeholder="••••••••" autoComplete="current-password" />
                                {deleteForm.errors.password && <span className="titi-error">{deleteForm.errors.password}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn-titi-secondary" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                                <button type="submit" className="btn-titi-danger" disabled={deleteForm.processing}>
                                    {deleteForm.processing
                                        ? <><span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10, borderWidth: 2 }} /> Suppression…</>
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
