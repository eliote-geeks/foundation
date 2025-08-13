import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';

interface Service {
    icon: string;
    title: string;
    description: string;
    features: string[];
    color: string;
    gradient: string;
}

export function ServicesSection() {
    const [hoveredService, setHoveredService] = useState<number | null>(null);

    const services: Service[] = [
        {
            icon: 'bi bi-trophy',
            title: 'Concours & Défis',
            description: 'Participez à des concours stimulants qui récompensent l\'innovation et l\'engagement citoyen.',
            features: ['Défis créatifs', 'Récompenses attractives', 'Reconnaissance publique', 'Réseau professionnel'],
            color: '#5FA145',
            gradient: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
        },
        {
            icon: 'bi bi-ticket-perforated',
            title: 'Billetterie',
            description: 'Système de billetterie moderne pour tous nos événements avec gestion simplifiée.',
            features: ['Réservation en ligne', 'Paiement sécurisé', 'QR Code digital', 'Support 24/7'],
            color: '#C69438',
            gradient: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)'
        },
        {
            icon: 'bi bi-people-fill',
            title: 'Espace Membres',
            description: 'Rejoignez une communauté active et accédez à des avantages exclusifs.',
            features: ['Profil personnalisé', 'Avantages exclusifs', 'Réseau communautaire', 'Suivi des activités'],
            color: '#E4518C',
            gradient: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)'
        },
        {
            icon: 'bi bi-calendar-event',
            title: 'Programmes',
            description: 'Découvrez nos programmes de développement et de formation continue.',
            features: ['Formation certifiante', 'Mentorat personnalisé', 'Ateliers pratiques', 'Networking events'],
            color: '#4D8A3C',
            gradient: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)'
        },
        {
            icon: 'bi bi-handshake',
            title: 'Partenaires',
            description: 'Collaborez avec nous pour créer un impact durable dans la société.',
            features: ['Partenariats stratégiques', 'Visibilité accrue', 'Impact mesurable', 'ROI social'],
            color: '#E8F5E8',
            gradient: 'linear-gradient(135deg, #F5B4C6 0%, #E4518C 100%)'
        },
        {
            icon: 'bi bi-graph-up-arrow',
            title: 'Impact Social',
            description: 'Mesurez et amplifiez votre impact social grâce à nos outils innovants.',
            features: ['Métriques d\'impact', 'Rapports détaillés', 'Transparence totale', 'Suivi en temps réel'],
            color: '#334E15',
            gradient: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 100%)'
        }
    ];

    return (
        <section 
            id="services"
            className="py-5"
            style={{
                background: 'linear-gradient(180deg, #334E15 0%, rgba(51, 78, 21, 0.95) 100%)',
                minHeight: '100vh',
                position: 'relative'
            }}
        >
            {/* Background decorations */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1, opacity: 0.1 }}>
                <div 
                    className="position-absolute"
                    style={{
                        top: '10%',
                        right: '5%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, #5FA145 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 4s ease-in-out infinite'
                    }}
                />
                <div 
                    className="position-absolute"
                    style={{
                        bottom: '15%',
                        left: '3%',
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle, #E4518C 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'pulse 3s ease-in-out infinite reverse'
                    }}
                />
            </div>

            <Container className="position-relative" style={{ zIndex: 2 }}>
                <div className="text-center mb-5 pb-4">
                    <div 
                        className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-4"
                        style={{
                            background: 'rgba(95, 161, 69, 0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(95, 161, 69, 0.3)'
                        }}
                    >
                        <i className="bi bi-stars me-2" style={{ color: '#5FA145' }}></i>
                        <span style={{ color: '#E8F5E8', fontSize: '0.95rem', fontWeight: '500' }}>
                            Nos Services
                        </span>
                    </div>
                    
                    <h2 
                        className="display-4 fw-bold mb-4"
                        style={{ 
                            color: '#E8F5E8',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Des solutions complètes
                        <br />
                        <span style={{ color: '#5FA145' }}>pour votre engagement</span>
                    </h2>
                    
                    <p 
                        className="lead mx-auto"
                        style={{ 
                            color: 'rgba(232, 245, 232, 0.8)',
                            maxWidth: '600px',
                            fontSize: '1.2rem'
                        }}
                    >
                        Découvrez notre écosystème complet d'outils et services 
                        conçus pour maximiser votre impact social et citoyen.
                    </p>
                </div>

                <Row className="g-4">
                    {services.map((service, index) => (
                        <Col lg={4} md={6} key={index}>
                            <Card 
                                className="service-card h-100 border-0 shadow-lg"
                                style={{
                                    background: hoveredService === index 
                                        ? service.gradient 
                                        : 'rgba(232, 245, 232, 0.05)',
                                    backdropFilter: 'blur(15px)',
                                    border: `1px solid ${hoveredService === index ? 'transparent' : 'rgba(232, 245, 232, 0.1)'}`,
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: hoveredService === index ? 'translateY(-10px)' : 'translateY(0)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => setHoveredService(index)}
                                onMouseLeave={() => setHoveredService(null)}
                            >
                                <Card.Body className="p-4">
                                    <div className="text-center mb-4">
                                        <div 
                                            className="service-icon-container d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                background: hoveredService === index 
                                                    ? 'rgba(255, 255, 255, 0.2)' 
                                                    : service.gradient,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <i 
                                                className={`${service.icon} display-6`}
                                                style={{ 
                                                    color: hoveredService === index ? '#FFF' : '#F5B4C6' 
                                                }}
                                            ></i>
                                        </div>
                                        
                                        <h4 
                                            className="fw-bold mb-3"
                                            style={{ 
                                                color: hoveredService === index ? '#FFF' : '#F5B4C6' 
                                            }}
                                        >
                                            {service.title}
                                        </h4>
                                        
                                        <p 
                                            className="mb-4"
                                            style={{ 
                                                color: hoveredService === index 
                                                    ? 'rgba(255, 255, 255, 0.9)' 
                                                    : 'rgba(232, 245, 232, 0.8)',
                                                lineHeight: '1.6'
                                            }}
                                        >
                                            {service.description}
                                        </p>
                                    </div>

                                    <ul className="list-unstyled mb-4">
                                        {service.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="d-flex align-items-center mb-2">
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        background: hoveredService === index 
                                                            ? 'rgba(255, 255, 255, 0.2)' 
                                                            : 'rgba(95, 161, 69, 0.2)',
                                                        minWidth: '20px'
                                                    }}
                                                >
                                                    <i 
                                                        className="bi bi-check-lg"
                                                        style={{ 
                                                            color: hoveredService === index ? '#FFF' : '#5FA145',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    ></i>
                                                </div>
                                                <span 
                                                    style={{ 
                                                        color: hoveredService === index 
                                                            ? 'rgba(255, 255, 255, 0.9)' 
                                                            : 'rgba(232, 245, 232, 0.8)',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="text-center">
                                        <div 
                                            className="btn btn-sm learn-more-btn px-4 py-2"
                                            style={{
                                                background: hoveredService === index 
                                                    ? 'rgba(255, 255, 255, 0.2)' 
                                                    : 'transparent',
                                                border: hoveredService === index 
                                                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                                                    : '1px solid rgba(95, 161, 69, 0.3)',
                                                color: hoveredService === index ? '#FFF' : '#5FA145',
                                                borderRadius: '25px',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            En savoir plus
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* CTA Section */}
                <div className="text-center mt-5 pt-4">
                    <div 
                        className="cta-container p-5 rounded-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(95, 161, 69, 0.1) 0%, rgba(228, 81, 140, 0.1) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(232, 245, 232, 0.2)'
                        }}
                    >
                        <h3 className="fw-bold mb-3" style={{ color: '#E8F5E8' }}>
                            Prêt à commencer votre parcours d'engagement ?
                        </h3>
                        <p className="mb-4" style={{ color: 'rgba(232, 245, 232, 0.8)' }}>
                            Rejoignez des milliers de membres qui transforment déjà leurs communautés.
                        </p>
                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                            <div 
                                className="btn btn-primary btn-lg px-5 py-3"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                    border: 'none',
                                    color: '#334E15',
                                    borderRadius: '50px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="bi bi-person-plus me-2"></i>
                                Devenir membre
                            </div>
                            <div 
                                className="btn btn-outline-light btn-lg px-5 py-3"
                                style={{
                                    borderColor: '#F5B4C6',
                                    color: '#E8F5E8',
                                    borderRadius: '50px',
                                    fontWeight: '500',
                                    borderWidth: '2px'
                                }}
                            >
                                <i className="bi bi-calendar-check me-2"></i>
                                Explorer les événements
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}