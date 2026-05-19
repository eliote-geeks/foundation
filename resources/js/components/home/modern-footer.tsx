import { Link } from '@inertiajs/react';

export function ModernFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ background: '#111827', color: '#D1D5DB' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40 }} className="footer-grid">

                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <img
                                src="/logo foundation.jpg"
                                alt="Logo Fondation TITI"
                                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ color: '#F9FAFB', fontWeight: 600, fontSize: '1rem' }}>Fondation TITI</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#9CA3AF', marginBottom: 20, maxWidth: 260 }}>
                            Engagement citoyen, innovation sociale et événements qui transforment nos communautés.
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[
                                { icon: 'bi-linkedin', name: 'LinkedIn' },
                                { icon: 'bi-facebook', name: 'Facebook' },
                                { icon: 'bi-instagram', name: 'Instagram' },
                                { icon: 'bi-twitter-x', name: 'Twitter/X' },
                                { icon: 'bi-youtube', name: 'YouTube' },
                            ].map(s => (
                                <a
                                    key={s.icon}
                                    href="#"
                                    title={s.name}
                                    style={{
                                        width: 32, height: 32, borderRadius: 6,
                                        background: '#1F2937', border: '1px solid #374151',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem',
                                        transition: 'background 0.15s, color 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#16A34A'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#9CA3AF'; }}
                                >
                                    <i className={`bi ${s.icon}`} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Plateforme */}
                    <div>
                        <p style={{ color: '#F9FAFB', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Plateforme</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Événements', href: '/events' },
                                { label: 'Concours', href: '/contests' },
                                { label: 'Partenaires', href: '/partners' },
                                { label: 'S\'inscrire', href: '/register' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#F9FAFB')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Communauté */}
                    <div>
                        <p style={{ color: '#F9FAFB', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Communauté</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Devenir membre', href: '/register' },
                                { label: 'Tableau de bord', href: '/dashboard' },
                                { label: 'Mon profil', href: '/profile' },
                                { label: 'Se connecter', href: '/login' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#F9FAFB')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p style={{ color: '#F9FAFB', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Contact</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <li>
                                <a href="mailto:info@fondation-titi.org" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#F9FAFB')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                                >
                                    <i className="bi bi-envelope me-1" />info@fondation-titi.org
                                </a>
                            </li>
                            <li style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                                <i className="bi bi-telephone me-1" />+237 6XX XXX XXX
                            </li>
                            <li style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                                <i className="bi bi-geo-alt me-1" />Yaoundé, Cameroun
                            </li>
                        </ul>
                    </div>

                    {/* Légal */}
                    <div>
                        <p style={{ color: '#F9FAFB', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Légal</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Mentions légales', href: '/legal/mentions' },
                                { label: 'CGU', href: '/legal/cgu' },
                                { label: 'Confidentialité', href: '/legal/privacy' },
                                { label: 'Cookies', href: '/legal/cookies' },
                                { label: 'RGPD', href: '/legal/rgpd' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#F9FAFB')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid #1F2937', marginTop: 40, padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        © {currentYear} Fondation TITI. Tous droits réservés.
                    </span>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {[
                            { label: 'Mentions légales', href: '/legal/mentions' },
                            { label: 'Confidentialité', href: '/legal/privacy' },
                            { label: 'Cookies', href: '/legal/cookies' },
                        ].map(l => (
                            <Link key={l.href} href={l.href} style={{ fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#9CA3AF')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                            >{l.label}</Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (max-width: 480px) {
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </footer>
    );
}
