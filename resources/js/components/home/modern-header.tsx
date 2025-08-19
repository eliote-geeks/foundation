import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { LanguageSwitcher } from '../foundation/language-switcher';
import { useTranslation } from '../../hooks/useTranslation';

interface ModernHeaderProps {
    user?: {
        name: string;
        email: string;
    };
}

export function ModernHeader({ user }: ModernHeaderProps) {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Navbar 
            expand="lg" 
            fixed="top"
            style={{
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #E5E7EB',
                boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                padding: '12px 0'
            }}
        >
            <Container>
                {/* Logo et nom */}
                <Navbar.Brand 
                    as={Link} 
                    href="/" 
                    className="d-flex align-items-center"
                >
                    <img 
                        src="/logo foundation.jpg"
                        alt="Logo Fondation TITI"
                        className="me-3 rounded-circle"
                        style={{
                            width: '42px',
                            height: '42px',
                            objectFit: 'cover'
                        }}
                    />
                    <div>
                        <div 
                            className="fw-bold mb-0" 
                            style={{ 
                                fontSize: '1.25rem', 
                                color: '#1F2937',
                                lineHeight: '1.2'
                            }}
                        >
                            Fondation TITI
                        </div>
                        <div 
                            style={{ 
                                fontSize: '0.75rem', 
                                color: '#6B7280',
                                lineHeight: '1'
                            }}
                        >
                            Événements & Impact
                        </div>
                    </div>
                </Navbar.Brand>

                {/* Menu toggle */}
                <Navbar.Toggle 
                    aria-controls="navbar-nav"
                    style={{ 
                        borderColor: '#D1D5DB',
                        padding: '4px 8px'
                    }}
                >
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>

                <Navbar.Collapse id="navbar-nav">
                    {/* Menu principal */}
                    <Nav className="mx-auto">
                        <Nav.Link 
                            as={Link}
                            href="/"
                            style={{
                                color: '#374151',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                padding: '8px 16px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >
                            {t('home', 'Accueil')}
                        </Nav.Link>
                        <Nav.Link 
                            as={Link}
                            href="/contests"
                            style={{
                                color: '#374151',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                padding: '8px 16px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >
                            {t('contests', 'Concours')}
                        </Nav.Link>
                        <Nav.Link 
                            as={Link}
                            href="/tickets"
                            style={{
                                color: '#374151',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                padding: '8px 16px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >
                            {t('tickets', 'Billetterie')}
                        </Nav.Link>
                        <Nav.Link 
                            as={Link}
                            href="/partners"
                            style={{
                                color: '#374151',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                padding: '8px 16px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >
                            {t('partners', 'Partenaires')}
                        </Nav.Link>
                        <Nav.Link 
                            as={Link}
                            href={user ? "/profile" : "/profiles"}
                            style={{
                                color: '#374151',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                padding: '8px 16px',
                                transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >
                            <i className="bi bi-person-circle me-2"></i>
                            {t('profile', user ? 'Profil' : 'Profils')}
                        </Nav.Link>
                        {user && (
                            <Nav.Link 
                                as={Link}
                                href="/dashboard"
                                style={{
                                    color: '#374151',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    padding: '8px 16px',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                            >
                                <i className="bi bi-speedometer2 me-2"></i>
                                {t('dashboard', 'Dashboard')}
                            </Nav.Link>
                        )}
                    </Nav>

                    {/* Sélecteur de langue et boutons utilisateur */}
                    <div className="d-flex gap-3 align-items-center">
                        <LanguageSwitcher variant="icon-only" />
                        
                        {user ? (
                            <div className="d-flex align-items-center gap-2">
                                <Button
                                    as={Link}
                                    href="/dashboard"
                                    variant="outline-primary"
                                    size="sm"
                                    className="px-3 py-2 rounded fw-medium"
                                    style={{
                                        borderColor: '#059669',
                                        color: '#059669',
                                        fontSize: '0.875rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#059669';
                                        e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#059669';
                                    }}
                                >
                                    <i className="bi bi-person me-1"></i>
                                    {user?.name || 'Profil'}
                                </Button>
                                
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="btn btn-outline-secondary btn-sm px-2 py-2 rounded"
                                    style={{
                                        borderColor: '#6B7280',
                                        color: '#6B7280',
                                        fontSize: '0.875rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#6B7280';
                                        e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#6B7280';
                                    }}
                                    title={t('logout', 'Déconnexion')}
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-decoration-none">
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="px-3 py-2 rounded fw-medium me-2"
                                        style={{
                                            borderColor: '#6B7280',
                                            color: '#6B7280',
                                            fontSize: '0.875rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#6B7280';
                                            e.currentTarget.style.color = '#FFFFFF';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#6B7280';
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        {t('login', 'Connexion')}
                                    </Button>
                                </Link>
                                
                                <Link href="/simple-register" className="text-decoration-none">
                                    <Button
                                        size="sm"
                                        className="px-3 py-2 rounded fw-medium"
                                        style={{
                                            backgroundColor: '#059669',
                                            borderColor: '#059669',
                                            color: '#FFFFFF',
                                            fontSize: '0.875rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#047857';
                                            e.currentTarget.style.borderColor = '#047857';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#059669';
                                            e.currentTarget.style.borderColor = '#059669';
                                        }}
                                    >
                                        <i className="bi bi-person-plus me-1"></i>
                                        {t('join', 'Rejoindre')}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}