import { Container, Row, Col } from 'react-bootstrap';

interface SocialLink {
    icon: string;
    url: string;
    name: string;
    color: string;
}

interface FooterLink {
    title: string;
    url: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

export function ModernFooter() {
    const currentYear = new Date().getFullYear();

    const socialLinks: SocialLink[] = [
        { icon: 'bi bi-linkedin', url: '#', name: 'LinkedIn', color: '#0077B5' },
        { icon: 'bi bi-twitter-x', url: '#', name: 'Twitter', color: '#000000' },
        { icon: 'bi bi-instagram', url: '#', name: 'Instagram', color: '#E4405F' },
        { icon: 'bi bi-facebook', url: '#', name: 'Facebook', color: '#1877F2' },
        { icon: 'bi bi-youtube', url: '#', name: 'YouTube', color: '#FF0000' },
        { icon: 'bi bi-whatsapp', url: '#', name: 'WhatsApp', color: '#25D366' }
    ];

    const footerSections: FooterSection[] = [
        {
            title: 'Plateforme',
            links: [
                { title: 'Événements', url: '#' },
                { title: 'Concours', url: '#' },
                { title: 'Billetterie', url: '#' },
                { title: 'Programmes', url: '#' },
                { title: 'Partenaires', url: '#' }
            ]
        },
        {
            title: 'Communauté',
            links: [
                { title: 'Devenir membre', url: '#' },
                { title: 'Ambassadeurs', url: '#' },
                { title: 'Témoignages', url: '#' },
                { title: 'Blog', url: '#' },
                { title: 'Newsletter', url: '#' }
            ]
        },
        {
            title: 'Support',
            links: [
                { title: 'Centre d\'aide', url: '#' },
                { title: 'Contact', url: '#' },
                { title: 'FAQ', url: '#' },
                { title: 'Signaler un problème', url: '#' },
                { title: 'Documentation', url: '#' }
            ]
        },
        {
            title: 'Légal',
            links: [
                { title: 'Conditions d\'utilisation', url: '#' },
                { title: 'Politique de confidentialité', url: '#' },
                { title: 'Mentions légales', url: '#' },
                { title: 'Cookies', url: '#' },
                { title: 'RGPD', url: '#' }
            ]
        }
    ];


    return (
        <footer 
            className="modern-footer mt-5"
            style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
                color: '#334E15',
                position: 'relative'
            }}
        >
            {/* Background decorations */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1, opacity: 0.08 }}>
                <div 
                    className="position-absolute"
                    style={{
                        top: '10%',
                        right: '5%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, #5FA145 0%, transparent 70%)',
                        borderRadius: '50%'
                    }}
                />
                <div 
                    className="position-absolute"
                    style={{
                        bottom: '20%',
                        left: '3%',
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle, #E4518C 0%, transparent 70%)',
                        borderRadius: '50%'
                    }}
                />
            </div>

            <Container className="position-relative" style={{ zIndex: 2 }}>
                {/* Main Footer Content */}
                <div className="py-5">
                    <Row className="g-4">
                        {/* Brand Section */}
                        <Col lg={4} className="mb-4">
                            <div className="d-flex align-items-center mb-4">
                                <img 
                                    src="/logo foundation.jpg"
                                    alt="Logo Fondation"
                                    className="me-3 rounded-circle"
                                    style={{
                                        width: '55px',
                                        height: '55px',
                                        objectFit: 'cover',
                                        border: '3px solid rgba(95, 161, 69, 0.3)',
                                        animation: 'pulse 2s infinite'
                                    }}
                                />
                                <div>
                                    <h4 className="mb-0 fw-bold" style={{ color: '#334E15' }}>Fondation TITI</h4>
                                    <div style={{ fontSize: '1rem', color: '#5FA145' }}>Événements & Impact</div>
                                </div>
                            </div>
                            
                            <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#6B7280' }}>
                                Nous construisons un monde plus juste et durable à travers 
                                l'engagement citoyen, l'innovation sociale et des événements 
                                qui rassemblent et transforment nos communautés.
                            </p>

                            {/* Social Links */}
                            <div className="d-flex flex-wrap gap-3 mb-4">
                                {socialLinks.map((social, index) => (
                                    <div
                                        key={index}
                                        className="social-link d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            background: 'rgba(95, 161, 69, 0.1)',
                                            border: '1px solid rgba(95, 161, 69, 0.2)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = social.color;
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = `0 8px 25px ${social.color}40`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(95, 161, 69, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                        title={social.name}
                                    >
                                        <i className={social.icon} style={{ color: '#5FA145' }}></i>
                                    </div>
                                ))}
                            </div>

                            {/* Newsletter */}
                            <div 
                                className="newsletter-signup p-4 rounded-3"
                                style={{
                                    background: 'rgba(95, 161, 69, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(95, 161, 69, 0.15)'
                                }}
                            >
                                <h6 className="fw-semibold mb-3" style={{ color: '#334E15', fontSize: '1.1rem' }}>📧 Restez informé</h6>
                                <p style={{ fontSize: '1rem', color: '#6B7280' }} className="mb-3">
                                    Recevez nos dernières actualités et opportunités d'engagement.
                                </p>
                                <div className="d-flex">
                                    <input
                                        type="email"
                                        placeholder="votre@email.com"
                                        className="form-control me-2"
                                        style={{
                                            background: '#ffffff',
                                            border: '1px solid rgba(95, 161, 69, 0.3)',
                                            color: '#334E15',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <div 
                                        className="btn btn-sm px-3"
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                            border: 'none',
                                            color: '#334E15',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <i className="bi bi-send"></i>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Links Sections */}
                        {footerSections.map((section, index) => (
                            <Col lg={2} md={6} key={index} className="mb-4">
                                <h6 className="fw-semibold mb-3 d-flex align-items-center" style={{ color: '#334E15' }}>
                                    <div 
                                        className="me-2 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            background: 'linear-gradient(135deg, #5FA145 0%, #E4518C 100%)'
                                        }}
                                    />
                                    {section.title}
                                </h6>
                                <ul className="list-unstyled">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex} className="mb-2">
                                            <a 
                                                href={link.url} 
                                                className="text-decoration-none footer-link"
                                                style={{ 
                                                    color: '#6B7280',
                                                    fontSize: '1rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = '#5FA145';
                                                    e.currentTarget.style.paddingLeft = '5px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = '#6B7280';
                                                    e.currentTarget.style.paddingLeft = '0';
                                                }}
                                            >
                                                {link.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                        ))}
                    </Row>

                </div>
                
                {/* Bottom Section */}
                <div 
                    className="py-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center"
                    style={{ borderColor: 'rgba(95, 161, 69, 0.2)' }}
                >
                    <div className="mb-3 mb-md-0">
                        <div style={{ fontSize: '1.1rem', color: '#334E15', fontWeight: '500' }}>
                            © {currentYear} Fondation TITI. Tous droits réservés.
                        </div>
                        <div className="d-flex flex-wrap align-items-center mt-2" style={{ fontSize: '1rem' }}>
                            <div className="me-4 mb-1" style={{ color: '#6B7280' }}>🏛️ ONG certifiée</div>
                            <div className="me-4 mb-1" style={{ color: '#6B7280' }}>🔒 Transparence financière</div>
                            <div className="mb-1" style={{ color: '#6B7280' }}>🌍 Impact social mesuré</div>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-center justify-content-md-end">
                        <div style={{ 
                            fontSize: '1.1rem', 
                            color: '#6B7280',
                            fontWeight: '400',
                            textAlign: 'center'
                        }}>
                            Plateforme développée avec passion pour l'engagement citoyen
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}