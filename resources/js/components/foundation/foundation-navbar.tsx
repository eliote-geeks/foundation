import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageSwitcher } from './language-switcher';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface FoundationNavbarProps {
    user?: {
        name: string;
        email: string;
    };
}

export function FoundationNavbar({ user }: FoundationNavbarProps) {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Navbar 
            expand="lg" 
            className={`modern-navbar fixed-top ${scrolled ? 'scrolled' : ''}`}
            style={{ 
                background: scrolled 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(255, 255, 255, 0.85)',
                transition: 'all 0.3s ease'
            }}
        >
            <Container>
                <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
                    <div 
                        className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #4A8A2A 0%, #2D5016 100%)',
                            animation: 'float 3s ease-in-out infinite'
                        }}
                    >
                        <i className="bi bi-heart-fill text-white fs-5"></i>
                    </div>
                    <span className="fw-bold fs-4" style={{
                        background: 'linear-gradient(135deg, #4A8A2A 0%, #2D5016 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Fondation Titi
                    </span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="foundation-navbar" />
                
                <Navbar.Collapse id="foundation-navbar">
                    <Nav className="me-auto">
                    </Nav>
                    
                    <Nav className="align-items-center">
                        <LanguageSwitcher variant="compact" />
                        
                        {user ? (
                            <NavDropdown 
                                title={
                                    <>
                                        <i className="bi bi-person-circle me-1"></i>
                                        {user?.name || 'Utilisateur'}
                                    </>
                                } 
                                id="user-dropdown"
                                className="ms-3"
                            >
                                <NavDropdown.Item as={Link} href="/dashboard">
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    {t('dashboard', 'Dashboard')}
                                </NavDropdown.Item>
                                
                                <NavDropdown.Item as={Link} href="/settings/profile">
                                    <i className="bi bi-person me-2"></i>
                                    {t('profile', 'Profil')}
                                </NavDropdown.Item>
                                
                                <NavDropdown.Item as={Link} href="/settings/language">
                                    <i className="bi bi-translate me-2"></i>
                                    {t('languageSettings', 'Paramètres de langue')}
                                </NavDropdown.Item>
                                
                                <NavDropdown.Item as={Link} href="/settings">
                                    <i className="bi bi-gear me-2"></i>
                                    {t('settings')}
                                </NavDropdown.Item>
                                
                                <NavDropdown.Divider />
                                
                                <NavDropdown.Item as={Link} href="/logout" method="post">
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    {t('logout')}
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} href="/member-register" className="ms-3">
                                    <i className="bi bi-person-plus me-1"></i>
                                    {t('join', 'Rejoindre')}
                                </Nav.Link>
                                <Nav.Link as={Link} href="/login" className="ms-2">
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    {t('login')}
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}