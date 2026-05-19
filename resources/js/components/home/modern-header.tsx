import { Container } from 'react-bootstrap';
import { useState, useEffect, type ElementType } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LanguageSwitcher } from '../foundation/language-switcher';
import { useTranslation } from '../../hooks/useTranslation';
import type { SharedData } from '../../types';

interface ModernHeaderProps {
    user?: {
        name: string;
        email: string;
        is_admin?: boolean;
    };
}

const NAV_LINKS = [
    { href: '/', labelKey: 'home', labelDefault: 'Accueil' },
    { href: '/contests', labelKey: 'contests', labelDefault: 'Concours' },
    { href: '/events', labelKey: 'events', labelDefault: 'Événements' },
    { href: '/partners', labelKey: 'partners', labelDefault: 'Partenaires' },
    { href: '/donate', labelKey: 'donate', labelDefault: 'Faire un don' },
];

export function ModernHeader({ user: userProp }: ModernHeaderProps) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user ?? userProp;
    const InertiaLink = Link as unknown as ElementType;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [typeof window !== 'undefined' ? window.location.pathname : '']);

    const navLinkStyle: React.CSSProperties = {
        color: '#374151',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: '5px 10px',
        textDecoration: 'none',
        borderRadius: 5,
        transition: 'color 0.15s ease, background 0.15s ease',
        display: 'inline-block',
    };

    return (
        <>
            <nav
                className="modern-header-nav"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E5E7EB',
                    boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.3s ease',
                }}
            >
                <Container>
                    <div style={{ display: 'flex', alignItems: 'center', height: 66, gap: 8 }}>

                        {/* ── Logo ── */}
                        <Link href="/" className="d-flex align-items-center text-decoration-none flex-shrink-0" style={{ marginRight: 16 }}>
                            <img
                                src="/logo foundation.jpg"
                                alt="Logo TITI EVENTS"
                                className="rounded-circle me-2"
                                style={{ width: 42, height: 42, objectFit: 'cover' }}
                            />
                            <div>
                                <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#1F2937', lineHeight: 1.2 }}>
                                    TITI EVENTS
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#6B7280', lineHeight: 1 }}>
                                    Événements & Impact
                                </div>
                            </div>
                        </Link>

                        {/* ── Desktop nav (hidden on mobile) ── */}
                        <div className="d-none d-lg-flex align-items-center" style={{ gap: 2, flex: 1, justifyContent: 'center' }}>
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={navLinkStyle}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#374151')}
                                >
                                    {t(link.labelKey, link.labelDefault)}
                                </Link>
                            ))}
                        </div>

                        {/* ── Auth + language (always visible, right) ── */}
                        <div className="d-flex align-items-center gap-2 ms-auto flex-shrink-0">
                            <LanguageSwitcher variant="icon-only" />

                            {user ? (
                                <div className="d-none d-lg-flex align-items-center gap-2">
                                    <Link href="/profile" as="button"
                                        className="btn-titi-secondary"
                                        style={{ fontSize: '0.8125rem' }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                                    >
                                        <i className="bi bi-person" style={{ fontSize: '0.8rem' }}></i>
                                        {user.name}
                                    </Link>
                                    {user.is_admin && (
                                        <Link href="/dashboard" as="button"
                                            className="btn-titi-ghost"
                                            title="Dashboard"
                                            style={{ fontSize: '0.8125rem', color: '#6B7280' }}
                                        >
                                            <i className="bi bi-speedometer2"></i>
                                        </Link>
                                    )}
                                    <Link href="/logout" method="post" as="button"
                                        className="btn-titi-ghost"
                                        title={t('logout', 'Déconnexion')}
                                        style={{ fontSize: '0.875rem', color: '#9CA3AF' }}
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                    </Link>
                                </div>
                            ) : (
                                <div className="d-none d-lg-flex align-items-center gap-2">
                                    <Link href="/login" as="button" className="btn-titi-ghost"
                                        style={{ textDecoration: 'none' }}>
                                        {t('login', 'Connexion')}
                                    </Link>
                                    <Link href="/register" as="button" className="btn-titi-primary"
                                        style={{ textDecoration: 'none' }}>
                                        {t('join', 'Rejoindre')}
                                    </Link>
                                </div>
                            )}

                            {/* ── Mobile hamburger ── */}
                            <button
                                className="d-lg-none btn btn-sm"
                                style={{ border: '1px solid #D1D5DB', borderRadius: 6, padding: '6px 10px', background: 'transparent' }}
                                onClick={() => setMobileOpen(o => !o)}
                                aria-label="Menu"
                            >
                                <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'}`} style={{ fontSize: '1.1rem', color: '#374151' }}></i>
                            </button>
                        </div>
                    </div>
                </Container>
            </nav>

            {/* ── Mobile dropdown menu ── */}
            {mobileOpen && (
                <div
                    className="d-lg-none"
                    style={{
                        position: 'fixed',
                        top: 66,
                        left: 0,
                        right: 0,
                        zIndex: 1049,
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid #E5E7EB',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '12px 0',
                    }}
                >
                    <Container>
                        <div className="d-flex flex-column gap-1">
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-decoration-none px-3 py-2 rounded"
                                    style={{ color: '#374151', fontSize: '0.95rem', fontWeight: 500 }}
                                    onClick={() => setMobileOpen(false)}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    {t(link.labelKey, link.labelDefault)}
                                </Link>
                            ))}
                            <hr className="my-2" />
                            {user ? (
                                <div className="d-flex gap-2 px-3 pb-1">
                                    <Link
                                        href="/profile"
                                        as="button"
                                        className="btn btn-sm flex-grow-1 fw-medium"
                                        style={{ border: '1px solid #059669', color: '#059669', borderRadius: 6, background: 'transparent' }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <i className="bi bi-person me-1"></i>Mon profil
                                    </Link>
                                    {user.is_admin && (
                                        <Link
                                            href="/dashboard"
                                            as="button"
                                            className="btn btn-sm fw-medium"
                                            style={{ border: '1px solid #6B7280', color: '#6B7280', borderRadius: 6, background: 'transparent' }}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <i className="bi bi-speedometer2"></i>
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="btn btn-sm"
                                        style={{ border: '1px solid #6B7280', color: '#6B7280', borderRadius: 6, background: 'transparent' }}
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                    </Link>
                                </div>
                            ) : (
                                <div className="d-flex gap-2 px-3 pb-1">
                                    <Link href="/login" className="text-decoration-none flex-grow-1">
                                        <button className="btn btn-sm w-100 fw-medium" style={{ border: '1px solid #6B7280', color: '#6B7280', borderRadius: 6, background: 'transparent' }}>
                                            <i className="bi bi-box-arrow-in-right me-1"></i>{t('login', 'Connexion')}
                                        </button>
                                    </Link>
                                    <Link href="/register" className="text-decoration-none flex-grow-1">
                                        <button className="btn btn-sm w-100 fw-medium" style={{ backgroundColor: '#059669', borderColor: '#059669', color: '#fff', borderRadius: 6 }}>
                                            <i className="bi bi-person-plus me-1"></i>{t('join', 'Rejoindre')}
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Container>
                </div>
            )}
        </>
    );
}
