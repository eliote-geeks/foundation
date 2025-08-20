import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface User {
    name: string;
    email: string;
}

interface ProfessionalHeroProps {
    user?: User;
}

export function ProfessionalHeroSection({ user }: ProfessionalHeroProps) {
    const { t } = useTranslation();
    const [currentMetric, setCurrentMetric] = useState(0);
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
    
    const keyMetrics = [
        {
            icon: 'bi-people-fill',
            number: '2,850+',
            label: 'Membres Actifs',
            description: 'Professionnels engagés',
            color: '#5FA145',
            trend: '+15%'
        },
        {
            icon: 'bi-trophy-fill',
            number: '147',
            label: 'Projets Financés',
            description: 'Impact mesurable',
            color: '#C69438',
            trend: '+23%'
        },
        {
            icon: 'bi-graph-up-arrow',
            number: '1.2B FCFA',
            label: 'Fonds Distribués',
            description: 'Depuis 2020',
            color: '#E4518C',
            trend: '+67%'
        },
        {
            icon: 'bi-award-fill',
            number: '4.9/5',
            label: 'Note de Satisfaction',
            description: 'Par nos membres',
            color: '#4D8A3C',
            trend: 'Excellent'
        }
    ];

    const recentMilestones = [
        {
            title: 'Nouveau Partenariat',
            description: 'Accord signé avec le Gouvernement Camerounais',
            time: '2 jours',
            type: 'partnership',
            importance: 'high'
        },
        {
            title: 'Programme Lancé',
            description: 'Initiative Entrepreneuriat Féminin 2025',
            time: '1 semaine',
            type: 'program',
            importance: 'medium'
        },
        {
            title: 'Financement Accordé',
            description: '30M FCFA pour 3 startups camerounaises',
            time: '2 semaines',
            type: 'funding',
            importance: 'high'
        },
        {
            title: 'Formation Certifiante',
            description: 'Lancement du programme Leadership Avancé',
            time: '3 semaines',
            type: 'program',
            importance: 'medium'
        },
        {
            title: 'Partenariat International',
            description: 'Collaboration avec l\'ONG Global Impact',
            time: '1 mois',
            type: 'partnership',
            importance: 'high'
        },
        {
            title: 'Subvention Européenne',
            description: '100M FCFA pour le développement rural',
            time: '6 semaines',
            type: 'funding',
            importance: 'high'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMetric((prev) => (prev + 1) % keyMetrics.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [keyMetrics.length]);

    // Animation pour les milestones
    useEffect(() => {
        const milestoneInterval = setInterval(() => {
            setCurrentMilestoneIndex((prev) => (prev + 1) % recentMilestones.length);
        }, 4000);
        return () => clearInterval(milestoneInterval);
    }, [recentMilestones.length]);

    return (
        <section 
            className="professional-hero position-relative overflow-hidden"
            style={{
                minHeight: '75vh',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
                paddingTop: '120px',
                paddingBottom: '80px'
            }}
        >
            {/* Subtle Background Pattern */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1, opacity: 0.08 }}>
                <div 
                    className="position-absolute"
                    style={{
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, #5FA145 0%, transparent 70%)',
                        top: '15%',
                        right: '10%',
                        borderRadius: '50%'
                    }}
                />
                <div 
                    className="position-absolute"
                    style={{
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, #E4518C 0%, transparent 70%)',
                        bottom: '20%',
                        left: '5%',
                        borderRadius: '50%'
                    }}
                />
            </div>

            <Container className="position-relative" style={{ zIndex: 2 }}>
                <Row className="align-items-center">
                    {/* Main Content */}
                    <Col lg={7} className="mb-5 mb-lg-0">
                        <div className="hero-content">
                            {/* Professional Status Badge */}
                            <div 
                                className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(232, 245, 232, 0.15) 0%, rgba(95, 161, 69, 0.1) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(232, 245, 232, 0.25)'
                                }}
                            >
                                <div 
                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        background: '#5FA145'
                                    }}
                                >
                                    <i className="bi bi-shield-check" style={{ color: '#FFF', fontSize: '0.7rem' }}></i>
                                </div>
                                <span style={{ color: '#5FA145', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Plateforme Certifiée ISO 26000 - Impact Social
                                </span>
                            </div>

                            {/* Main Headlines */}
                            <h1 
                                className="display-3 fw-bold mb-4"
                                style={{ 
                                    color: '#334E15',
                                    lineHeight: '1.1',
                                    textShadow: 'none',
                                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
                                }}
                            >
                                {user ? (
                                    <>
                                        Bienvenue, <br />
                                        <span style={{ color: '#C69438' }}>{user?.name?.split(' ')[0] || 'Utilisateur'}</span>
                                    </>
                                ) : (
                                    <>
                                        L'Écosystème Professionnel<br />
                                        de <span style={{ color: '#C69438' }}>l'Impact Social</span>
                                    </>
                                )}
                            </h1>
                            
                            <p 
                                className="lead mb-5"
                                style={{ 
                                    color: '#6B7280',
                                    fontSize: '1.2rem',
                                    maxWidth: '550px',
                                    lineHeight: '1.6',
                                    fontWeight: '400'
                                }}
                            >
                                {user ? (
                                    'Découvrez les dernières opportunités, connectez-vous avec des professionnels de l\'impact et suivez vos projets en temps réel.'
                                ) : (
                                    'Rejoignez le réseau professionnel qui transforme l\'engagement citoyen en projets concrets et durables. Financements, mentorat, partenariats.'
                                )}
                            </p>

                            {/* Professional CTA Buttons */}
                            <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                                {user ? (
                                    <>
                                        <Button
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                border: 'none',
                                                color: '#FFF',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                borderRadius: '12px',
                                                boxShadow: '0 8px 25px rgba(95, 161, 69, 0.25)',
                                                transition: 'all 0.3s ease',
                                                minWidth: '200px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(95, 161, 69, 0.35)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.25)';
                                            }}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Nouveau Projet
                                        </Button>
                                        <Button
                                            variant="outline-light"
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                borderColor: 'rgba(232, 245, 232, 0.4)',
                                                color: '#5FA145',
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                borderRadius: '12px',
                                                borderWidth: '1.5px',
                                                background: 'rgba(232, 245, 232, 0.05)',
                                                minWidth: '200px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(232, 245, 232, 0.1)';
                                                e.currentTarget.style.borderColor = '#E8F5E8';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(232, 245, 232, 0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.4)';
                                            }}
                                        >
                                            <i className="bi bi-graph-up me-2"></i>
                                            Tableau de Bord
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            href="/simple-register"
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                border: 'none',
                                                color: '#FFF',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                borderRadius: '12px',
                                                boxShadow: '0 8px 25px rgba(95, 161, 69, 0.25)',
                                                transition: 'all 0.3s ease',
                                                minWidth: '220px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(95, 161, 69, 0.35)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.25)';
                                            }}
                                        >
                                            <i className="bi bi-person-plus me-2"></i>
                                            Rejoindre la Communauté
                                        </Button>
                                        <Button
                                            href="/login"
                                            variant="outline-light"
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                borderColor: 'rgba(232, 245, 232, 0.4)',
                                                color: '#5FA145',
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                borderRadius: '12px',
                                                borderWidth: '1.5px',
                                                background: 'rgba(232, 245, 232, 0.05)',
                                                minWidth: '160px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(232, 245, 232, 0.1)';
                                                e.currentTarget.style.borderColor = '#E8F5E8';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(232, 245, 232, 0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.4)';
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Se Connecter
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Trust Indicators */}
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-shield-check" style={{ color: '#5FA145', fontSize: '1.1rem' }}></i>
                                    <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                        Certifié B-Corp
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-award" style={{ color: '#C69438', fontSize: '1.1rem' }}></i>
                                    <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                        Prix Impact 2024
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-people" style={{ color: '#E4518C', fontSize: '1.1rem' }}></i>
                                    <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                        +2850 Membres
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Metrics Dashboard */}
                    <Col lg={5}>
                        <Row className="g-4">
                            {/* Live Metrics Card */}
                            <Col md={12}>
                                <Card 
                                    className="border-0"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <h5 className="mb-0 fw-bold" style={{ color: '#334E15' }}>
                                                Impact en Temps Réel
                                            </h5>
                                            <div 
                                                className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                                                style={{ background: 'rgba(95, 161, 69, 0.1)' }}
                                            >
                                                <div 
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        background: '#5FA145',
                                                        borderRadius: '50%',
                                                        animation: 'pulse 2s infinite'
                                                    }}
                                                />
                                                <span style={{ color: '#5FA145', fontSize: '0.7rem', fontWeight: '600' }}>
                                                    LIVE
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <Row className="g-3">
                                            {keyMetrics.map((metric, index) => (
                                                <Col xs={6} key={index}>
                                                    <div 
                                                        className="text-center p-3 rounded-3"
                                                        style={{
                                                            background: index === currentMetric 
                                                                ? `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}10 100%)` 
                                                                : '#F8F9FA',
                                                            border: index === currentMetric 
                                                                ? `1px solid ${metric.color}30` 
                                                                : '1px solid #E9ECEF',
                                                            transition: 'all 0.4s ease'
                                                        }}
                                                    >
                                                        <i 
                                                            className={`${metric.icon} mb-2`}
                                                            style={{ 
                                                                color: metric.color,
                                                                fontSize: '1.5rem'
                                                            }}
                                                        ></i>
                                                        <div 
                                                            className="fw-bold"
                                                            style={{ 
                                                                color: '#334E15',
                                                                fontSize: '1.3rem'
                                                            }}
                                                        >
                                                            {metric.number}
                                                        </div>
                                                        <div 
                                                            style={{ 
                                                                color: '#6B7280',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {metric.label}
                                                        </div>
                                                        <div 
                                                            className="mt-1"
                                                            style={{ 
                                                                color: metric.color,
                                                                fontSize: '0.65rem',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            {metric.trend}
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Recent Milestones */}
                            <Col md={12}>
                                <Card 
                                    className="border-0"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                            <i className="bi bi-clock-history me-2" style={{ color: '#5FA145' }}></i>
                                            Actualités Récentes
                                        </h6>
                                        <div 
                                            className="milestone-list"
                                            style={{
                                                height: '220px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    transform: `translateY(-${currentMilestoneIndex * 73}px)`,
                                                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    willChange: 'transform'
                                                }}
                                            >
                                                {[...recentMilestones, ...recentMilestones.slice(0, 3)].map((milestone, index) => (
                                                    <div 
                                                        key={`milestone-${index}`} 
                                                        className="d-flex align-items-start mb-3"
                                                        style={{
                                                            height: '73px',
                                                            opacity: Math.abs(index - currentMilestoneIndex) <= 2 ? 1 : 0.4,
                                                            transition: 'opacity 1s ease',
                                                            paddingRight: '8px'
                                                        }}
                                                    >
                                                        <div 
                                                            className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                background: milestone.importance === 'high' 
                                                                    ? 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
                                                                    : 'linear-gradient(135deg, #E4518C 0%, #C69438 100%)'
                                                            }}
                                                        >
                                                            {milestone.type === 'partnership' && <i className="bi bi-handshake text-white" style={{ fontSize: '0.8rem' }}></i>}
                                                            {milestone.type === 'program' && <i className="bi bi-rocket text-white" style={{ fontSize: '0.8rem' }}></i>}
                                                            {milestone.type === 'funding' && <i className="bi bi-currency-euro text-white" style={{ fontSize: '0.8rem' }}></i>}
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div 
                                                                className="fw-semibold mb-1"
                                                                style={{ color: '#334E15', fontSize: '0.9rem' }}
                                                            >
                                                                {milestone.title}
                                                            </div>
                                                            <div 
                                                                className="mb-1"
                                                                style={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: '1.3' }}
                                                            >
                                                                {milestone.description}
                                                            </div>
                                                            <div style={{ color: '#9CA3AF', fontSize: '0.7rem' }}>
                                                                Il y a {milestone.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-center mt-3">
                                            <Button
                                                size="sm"
                                                className="rounded-pill px-3"
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #5FA145',
                                                    color: '#5FA145',
                                                    fontSize: '0.8rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)';
                                                    e.currentTarget.style.color = '#FFFFFF';
                                                    e.currentTarget.style.borderColor = '#5FA145';
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#5FA145';
                                                    e.currentTarget.style.borderColor = '#5FA145';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                Voir plus
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}