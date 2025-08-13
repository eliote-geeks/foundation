import { Container, Row, Col } from 'react-bootstrap';
import { FoundationNavbar } from '../components/foundation/foundation-navbar';

interface FoundationLayoutProps {
    children: React.ReactNode;
    user?: {
        name: string;
        email: string;
    };
}

export function FoundationLayout({ children, user }: FoundationLayoutProps) {
    return (
        <div className="min-vh-100 d-flex flex-column" style={{ 
            background: 'var(--background)',
            position: 'relative'
        }}>
            {/* Background Pattern */}
            <div 
                className="position-fixed w-100 h-100"
                style={{
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236b7280' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat`,
                    zIndex: -1
                }}
            />
            
            <FoundationNavbar user={user} />
            
            <main className="flex-grow-1" style={{ paddingTop: '80px' }}>
                <Container fluid className="py-4 px-4">
                    {children}
                </Container>
            </main>
            
            <footer className="mt-5" style={{ 
                background: 'linear-gradient(135deg, var(--sidebar) 0%, var(--card) 100%)',
                color: 'var(--foreground)'
            }}>
                <Container>
                    <div className="py-5">
                        <Row>
                            <Col lg={4} className="mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div 
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                                        }}
                                    >
                                        <i className="bi bi-heart-fill text-white"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-white mb-0 fw-bold">Fondation Titi</h6>
                                        <small className="text-white opacity-75">Ensemble pour l'avenir</small>
                                    </div>
                                </div>
                                <p className="text-white opacity-75 mb-4" style={{ fontSize: '14px' }}>
                                    Nous construisons un monde plus juste et durable à travers 
                                    l'engagement citoyen et l'innovation sociale.
                                </p>
                                <div className="d-flex gap-3">
                                    <div 
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="bi bi-linkedin text-white"></i>
                                    </div>
                                    <div 
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="bi bi-twitter text-white"></i>
                                    </div>
                                    <div 
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="bi bi-instagram text-white"></i>
                                    </div>
                                </div>
                            </Col>
                            
                            
                            <Col lg={2} md={6} className="mb-4">
                                <h6 className="text-white fw-semibold mb-3">Communauté</h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">Ambassadeurs</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">Témoignages</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">Blog</a>
                                    </li>
                                </ul>
                            </Col>
                            
                            <Col lg={2} md={6} className="mb-4">
                                <h6 className="text-white fw-semibold mb-3">Support</h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">Centre d'aide</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">Contact</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">FAQ</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-white opacity-75 text-decoration-none small">Conditions</a>
                                    </li>
                                </ul>
                            </Col>
                            
                            <Col lg={2} md={6} className="mb-4">
                                <h6 className="text-white fw-semibold mb-3">Impact</h6>
                                <div className="mb-2">
                                    <small className="text-white opacity-75">Membres actifs</small>
                                    <div className="text-white fw-semibold">2,850+</div>
                                </div>
                                <div className="mb-2">
                                    <small className="text-white opacity-75">Fonds collectés</small>
                                    <div className="text-white fw-semibold">600M FCFA</div>
                                </div>
                                <div className="mb-2">
                                    <small className="text-white opacity-75">Projets soutenus</small>
                                    <div className="text-white fw-semibold">45</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    
                    <div className="border-top border-white border-opacity-25 py-4 text-center">
                        <small className="text-white opacity-75">
                            © 2024 Fondation Titi. Tous droits réservés. 
                            <span className="mx-2">|</span>
                            ONG certifiée • Transparence financière
                        </small>
                    </div>
                </Container>
            </footer>
        </div>
    );
}