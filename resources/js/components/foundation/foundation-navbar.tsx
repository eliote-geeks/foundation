import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
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
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            animation: 'float 3s ease-in-out infinite'
                        }}
                    >
                        <i className="bi bi-heart-fill text-white fs-5"></i>
                    </div>
                    <span className="fw-bold fs-4" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                        <Nav.Link 
                            as={Link} 
                            href="/dashboard" 
                            className="fw-medium px-3 py-2 mx-1 rounded-pill position-relative overflow-hidden hover-reveal"
                            style={{ color: '#4a5568', transition: 'all 0.3s ease' }}
                        >
                            <i className="bi bi-house me-2 icon-bounce"></i>
                            Accueil
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            href="/contests" 
                            className="fw-medium px-3 py-2 mx-1 rounded-pill position-relative overflow-hidden hover-reveal"
                            style={{ color: '#4a5568', transition: 'all 0.3s ease' }}
                        >
                            <i className="bi bi-trophy me-2 icon-bounce"></i>
                            {t('contests')}
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            href="/events" 
                            className="fw-medium px-3 py-2 mx-1 rounded-pill position-relative overflow-hidden hover-reveal"
                            style={{ color: '#4a5568', transition: 'all 0.3s ease' }}
                        >
                            <i className="bi bi-calendar-event me-2 icon-bounce"></i>
                            {t('events')}
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            href="/programs" 
                            className="fw-medium px-3 py-2 mx-1 rounded-pill position-relative overflow-hidden hover-reveal"
                            style={{ color: '#4a5568', transition: 'all 0.3s ease' }}
                        >
                            <i className="bi bi-journal-bookmark me-2 icon-bounce"></i>
                            {t('programs')}
                        </Nav.Link>
                        
                        <Nav.Link 
                            as={Link} 
                            href="/partners" 
                            className="fw-medium px-3 py-2 mx-1 rounded-pill position-relative overflow-hidden hover-reveal"
                            style={{ color: '#4a5568', transition: 'all 0.3s ease' }}
                        >
                            <i className="bi bi-building me-2 icon-bounce"></i>
                            {t('partners')}
                        </Nav.Link>
                    </Nav>
                    
                    <Nav className="align-items-center">
                        <LanguageSwitcher />
                        
                        {user ? (
                            <NavDropdown 
                                title={
                                    <>
                                        <i className="bi bi-person-circle me-1"></i>
                                        {user.name}
                                    </>
                                } 
                                id="user-dropdown"
                                className="ms-2"
                            >
                                <NavDropdown.Item as={Link} href="/members/profile">
                                    <i className="bi bi-person me-2"></i>
                                    Profil
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
                                <Nav.Link as={Link} href="/member-register" className="ms-2">
                                    <i className="bi bi-person-plus me-1"></i>
                                    Rejoindre
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