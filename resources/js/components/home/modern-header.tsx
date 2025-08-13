import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

interface ModernHeaderProps {
    user?: {
        name: string;
        email: string;
    };
}

export function ModernHeader({ user }: ModernHeaderProps) {
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
                    href="#" 
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
                            Accueil
                        </Nav.Link>
                        <Nav.Link 
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
                            Concours
                        </Nav.Link>
                        <Nav.Link 
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
                            Billetterie
                        </Nav.Link>
                        <Nav.Link 
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
                            Partenaires
                        </Nav.Link>
                    </Nav>

                    {/* Boutons utilisateur */}
                    <div className="d-flex gap-2 align-items-center">
                        {user ? (
                            <div className="d-flex align-items-center gap-2">
                                <Button
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
                                    {user.name}
                                </Button>
                                
                                <form method="POST" action="/logout" style={{ display: 'inline' }}>
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                    <Button
                                        type="submit"
                                        variant="outline-secondary"
                                        size="sm"
                                        className="px-2 py-2 rounded"
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
                                        title="Déconnexion"
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <a href="/login" className="text-decoration-none">
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
                                        Connexion
                                    </Button>
                                </a>
                                
                                <a href="/register" className="text-decoration-none">
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
                                        Rejoindre
                                    </Button>
                                </a>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}