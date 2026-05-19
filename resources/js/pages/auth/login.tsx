import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

type LoginForm = { email: string; password: string; remember: boolean };

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '', password: '', remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Connexion — Fondation TITI" />
            <ModernHeader />

            <div className="titi-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div style={{ width: '100%', maxWidth: 380, padding: '0 16px' }}>

                    {/* Logo + heading */}
                    <div className="text-center mb-6" style={{ marginBottom: 28 }}>
                        <img
                            src="/logo foundation.jpg"
                            alt="Fondation TITI"
                            className="rounded-circle mb-3"
                            style={{ width: 48, height: 48, objectFit: 'cover' }}
                        />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                            Bon retour
                        </h1>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>
                            Connectez-vous à votre espace membre
                        </p>
                    </div>

                    {/* Card */}
                    <div className="titi-card" style={{ padding: 24 }}>
                        {status && (
                            <div className="titi-notice success mb-4" style={{ marginBottom: 16 }}>
                                <i className="bi bi-check-circle" style={{ flexShrink: 0 }}></i>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            {/* Email */}
                            <div className="titi-field">
                                <label className="titi-label" htmlFor="email">
                                    Adresse email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`titi-input${errors.email ? ' error' : ''}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="vous@email.com"
                                    autoFocus
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && <span className="titi-error">{errors.email}</span>}
                            </div>

                            {/* Password */}
                            <div className="titi-field">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <label className="titi-label" htmlFor="password" style={{ margin: 0 }}>
                                        Mot de passe
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            style={{ fontSize: '0.75rem', color: '#16A34A', textDecoration: 'none', fontWeight: 500 }}
                                        >
                                            Oublié ?
                                        </Link>
                                    )}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`titi-input${errors.password ? ' error' : ''}`}
                                        style={{ paddingRight: 36 }}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(s => !s)}
                                        style={{
                                            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                                        }}
                                        tabIndex={-1}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '0.875rem' }}></i>
                                    </button>
                                </div>
                                {errors.password && <span className="titi-error">{errors.password}</span>}
                            </div>

                            {/* Remember */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    style={{ width: 14, height: 14, accentColor: '#16A34A', cursor: 'pointer' }}
                                />
                                <label htmlFor="remember" style={{ fontSize: '0.8125rem', color: '#6B7280', cursor: 'pointer', margin: 0 }}>
                                    Se souvenir de moi
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-titi-primary w-full"
                                style={{ width: '100%' }}
                            >
                                {processing
                                    ? <><span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12, borderWidth: 2 }}></span> Connexion…</>
                                    : 'Se connecter'
                                }
                            </button>
                        </form>
                    </div>

                    {/* Footer link */}
                    <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6B7280', marginTop: 16 }}>
                        Pas encore membre ?{' '}
                        <Link href={route('register')} style={{ color: '#16A34A', fontWeight: 500, textDecoration: 'none' }}>
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>

            <ModernFooter />
        </>
    );
}
