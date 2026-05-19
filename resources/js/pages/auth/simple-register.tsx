import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

type Form = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    member_type: string;
    phone: string;
    city: string;
};

interface Props {
    memberTypes?: Record<string, { label: string; description: string; icon: string }>;
}

const DEFAULT_TYPES = {
    adherent:         { label: 'Adhérent',         description: 'Membre de la communauté',      icon: 'bi-person-fill' },
    ambassador:       { label: 'Ambassadeur',       description: 'Représentant de la fondation', icon: 'bi-star-fill' },
    former_challenger:{ label: 'Ancien challenger', description: 'Participant aux défis',         icon: 'bi-trophy-fill' },
    volunteer:        { label: 'Bénévole',          description: 'Contributeur bénévole',        icon: 'bi-heart-fill' },
    beneficiary:      { label: 'Bénéficiaire',      description: "Bénéficiaire des programmes",  icon: 'bi-bullseye' },
    partner:          { label: 'Partenaire',        description: 'Partenaire institutionnel',    icon: 'bi-handshake' },
};

export default function SimpleRegister({ memberTypes }: Props) {
    const types = (memberTypes && Object.keys(memberTypes).length > 0) ? memberTypes : DEFAULT_TYPES;
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Form>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        member_type: 'adherent',
        phone: '',
        city: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const labelStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 };
    const inputStyle = (hasError: boolean): React.CSSProperties => ({
        width: '100%', height: 44, padding: '0 13px',
        border: `1.5px solid ${hasError ? '#DC2626' : '#D1D5DB'}`,
        borderRadius: 8, fontSize: '0.9375rem', outline: 'none',
        boxSizing: 'border-box', background: '#fff',
    });

    return (
        <>
            <Head title="Inscription — TITI EVENTS" />
            <ModernHeader />

            <div style={{ background: '#F9FAFB', minHeight: '100vh', paddingTop: 66, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
                <div style={{ width: '100%', maxWidth: 540 }}>

                    {/* Logo + heading */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <img
                            src="/logo foundation.jpg"
                            alt="TITI EVENTS"
                            className="rounded-circle mb-3"
                            style={{ width: 58, height: 58, objectFit: 'cover' }}
                        />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                            Créer un compte
                        </h1>
                        <p style={{ fontSize: '0.9375rem', color: '#6B7280', margin: 0 }}>
                            Rejoignez la communauté TITI EVENTS
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 28 }}>
                        <form onSubmit={submit}>

                            {/* Type de membre */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Type de membre</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {Object.entries(types).map(([key, t]) => {
                                        const selected = data.member_type === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setData('member_type', key)}
                                                style={{
                                                    padding: '10px 6px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                                    border: selected ? '2px solid #16A34A' : '1.5px solid #E5E7EB',
                                                    background: selected ? '#F0FDF4' : '#fff',
                                                    transition: 'all 0.1s',
                                                }}
                                            >
                                                <i className={`bi ${t.icon}`} style={{ fontSize: '1.25rem', color: selected ? '#16A34A' : '#9CA3AF', display: 'block', marginBottom: 5 }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: selected ? 700 : 400, color: selected ? '#15803D' : '#374151', lineHeight: 1.2, display: 'block' }}>
                                                    {t.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.member_type && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.member_type}</span>}
                            </div>

                            {/* Nom + Email */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div>
                                    <label style={labelStyle} htmlFor="name">Nom complet *</label>
                                    <input
                                        id="name" type="text" required autoFocus
                                        value={data.name} onChange={e => setData('name', e.target.value)}
                                        placeholder="Votre nom"
                                        style={inputStyle(!!errors.name)}
                                    />
                                    {errors.name && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.name}</span>}
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="email">Email *</label>
                                    <input
                                        id="email" type="email" required
                                        value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="vous@email.com"
                                        style={inputStyle(!!errors.email)}
                                    />
                                    {errors.email && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.email}</span>}
                                </div>
                            </div>

                            {/* Téléphone + Ville */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div>
                                    <label style={labelStyle} htmlFor="phone">Téléphone</label>
                                    <input
                                        id="phone" type="tel"
                                        value={data.phone} onChange={e => setData('phone', e.target.value)}
                                        placeholder="+237 6XX XXX XXX"
                                        style={inputStyle(false)}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="city">Ville</label>
                                    <input
                                        id="city" type="text"
                                        value={data.city} onChange={e => setData('city', e.target.value)}
                                        placeholder="Yaoundé"
                                        style={inputStyle(false)}
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div style={{ marginBottom: 12 }}>
                                <label style={labelStyle} htmlFor="password">Mot de passe *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password" type={showPwd ? 'text' : 'password'} required
                                        value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        style={{ ...inputStyle(!!errors.password), paddingRight: 36 }}
                                    />
                                    <button type="button" onClick={() => setShowPwd(s => !s)} tabIndex={-1}
                                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}>
                                        <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '0.875rem' }} />
                                    </button>
                                </div>
                                {errors.password && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.password}</span>}
                            </div>

                            {/* Confirmation */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle} htmlFor="password_confirmation">Confirmer le mot de passe *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password_confirmation" type={showPwd2 ? 'text' : 'password'} required
                                        value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        style={{ ...inputStyle(!!errors.password_confirmation), paddingRight: 36 }}
                                    />
                                    <button type="button" onClick={() => setShowPwd2(s => !s)} tabIndex={-1}
                                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}>
                                        <i className={`bi ${showPwd2 ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '0.875rem' }} />
                                    </button>
                                </div>
                                {errors.password_confirmation && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{errors.password_confirmation}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                style={{ width: '100%', height: 48, background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1, marginTop: 4 }}
                            >
                                {processing
                                    ? <><span className="spinner-border spinner-border-sm me-2" style={{ width: 12, height: 12, borderWidth: 2 }} />Création…</>
                                    : <><i className="bi bi-person-plus me-2" />Créer mon compte</>
                                }
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p style={{ textAlign: 'center', fontSize: '0.9375rem', color: '#6B7280', marginTop: 18 }}>
                        Déjà membre ?{' '}
                        <Link href={route('login')} style={{ color: '#16A34A', fontWeight: 600, textDecoration: 'none' }}>
                            Se connecter
                        </Link>
                    </p>
                    <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9CA3AF', marginTop: 6 }}>
                        En créant votre compte, vous acceptez nos{' '}
                        <Link href="/legal/cgu" style={{ color: '#9CA3AF' }}>conditions d'utilisation</Link>
                    </p>
                </div>
            </div>

            <ModernFooter />
        </>
    );
}
