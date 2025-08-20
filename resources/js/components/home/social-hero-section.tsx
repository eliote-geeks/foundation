import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface User {
    name: string;
    email: string;
}

interface SocialHeroProps {
    user?: User;
}

export function SocialHeroSection({ user }: SocialHeroProps) {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    
    const highlights = [
        {
            icon: 'bi-people-fill',
            number: '2,850+',
            label: 'Membres Actifs',
            description: 'Communauté grandissante',
            color: '#5FA145'
        },
        {
            icon: 'bi-trophy-fill',
            number: '45',
            label: 'Projets Réalisés',
            description: 'Impact concret',
            color: '#C69438'
        },
        {
            icon: 'bi-globe-americas',
            number: '12',
            label: 'Pays Représentés',
            description: 'Portée internationale',
            color: '#E4518C'
        },
        {
            icon: 'bi-currency-euro',
            number: '250K€',
            label: 'Fonds Distribués',
            description: 'Soutien aux innovations',
            color: '#4D8A3C'
        }
    ];

    const recentActivities = [
        {
            user: 'Marie Dubois',
            action: 'a remporté le concours Innovation Tech',
            time: '2h',
            avatar: 'MD',
            type: 'success',
            role: 'Ambassadrice'
        },
        {
            user: 'Jean-Claude Kamgang',
            action: 'a publié un nouveau projet agricole',
            time: '4h',
            avatar: 'JK',
            type: 'post',
            role: 'Ancien Challenger'
        },
        {
            user: 'Aminata Traoré',
            action: 's\'est inscrite au programme mentorat',
            time: '6h',
            avatar: 'AT',
            type: 'join',
            role: 'Bénéficiaire'
        },
        {
            user: 'Paul Mengue',
            action: 'a finalisé sa formation en leadership',
            time: '8h',
            avatar: 'PM',
            type: 'success',
            role: 'Membre'
        },
        {
            user: 'Sarah Nkomo',
            action: 'a lancé son projet environnemental',
            time: '10h',
            avatar: 'SN',
            type: 'post',
            role: 'Ambassadrice'
        },
        {
            user: 'David Fomo',
            action: 'a rejoint l\'équipe des mentors',
            time: '12h',
            avatar: 'DF',
            type: 'join',
            role: 'Mentor'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % highlights.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [highlights.length]);

    // Animation pour les activités récentes
    useEffect(() => {
        const activityInterval = setInterval(() => {
            setCurrentActivityIndex((prev) => (prev + 1) % recentActivities.length);
        }, 3000);
        return () => clearInterval(activityInterval);
    }, [recentActivities.length]);

    return (
        <section 
            className="social-hero position-relative overflow-hidden"
            style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                paddingTop: '100px',
                paddingBottom: '60px'
            }}
        >
            {/* Animated Background Elements */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '250px',
                        height: '250px',
                        background: 'rgba(228, 81, 140, 0.1)',
                        top: '10%',
                        right: '5%',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '180px',
                        height: '180px',
                        background: 'rgba(198, 148, 56, 0.1)',
                        bottom: '15%',
                        left: '3%',
                        animation: 'float 4s ease-in-out infinite reverse'
                    }}
                />
                <div 
                    className="position-absolute"
                    style={{
                        width: '120px',
                        height: '120px',
                        background: 'rgba(232, 245, 232, 0.1)',
                        top: '50%',
                        right: '15%',
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        animation: 'morphing 8s ease-in-out infinite'
                    }}
                />
            </div>

            <Container className="position-relative" style={{ zIndex: 2 }}>
                <Row className="align-items-center">
                    {/* Main Content */}
                    <Col lg={6} className="mb-5 mb-lg-0">
                        <div className="hero-content">
                            {/* Welcome Badge */}
                            <div 
                                className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-4"
                                style={{
                                    background: 'rgba(232, 245, 232, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(232, 245, 232, 0.3)'
                                }}
                            >
                                <span 
                                    className="badge rounded-pill me-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
                                        color: '#334E15'
                                    }}
                                >
                                    🎉 Live
                                </span>
                                <span style={{ color: '#E8F5E8', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Communauté en ligne maintenant !
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 
                                className="display-3 fw-bold mb-4"
                                style={{ 
                                    color: '#E8F5E8',
                                    lineHeight: '1.2',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                {user ? (
                                    <>Bon retour, <span style={{ color: '#C69438' }}>{user?.name || 'Utilisateur'}</span> ! 👋</>
                                ) : (
                                    <>Rejoignez la <span style={{ color: '#C69438' }}>Révolution</span> de l'Impact Social</>
                                )}
                            </h1>
                            
                            <p 
                                className="lead mb-5"
                                style={{ 
                                    color: '#E8F5E8',
                                    opacity: 0.9,
                                    fontSize: '1.25rem',
                                    maxWidth: '500px'
                                }}
                            >
                                {user ? (
                                    'Découvrez les dernières actualités de votre communauté et les nouvelles opportunités qui vous attendent.'
                                ) : (
                                    'Connectez-vous avec des changemakers, participez à des défis innovants et créez un impact durable ensemble.'
                                )}
                            </p>

                            {/* Action Buttons */}
                            <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                                {user ? (
                                    <>
                                        <Button
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                                border: 'none',
                                                color: '#334E15',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                borderRadius: '50px',
                                                boxShadow: '0 10px 30px rgba(95, 161, 69, 0.3)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(95, 161, 69, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 161, 69, 0.3)';
                                            }}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Créer un Post
                                        </Button>
                                        <Button
                                            variant="outline-light"
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                borderColor: '#E8F5E8',
                                                color: '#E8F5E8',
                                                fontSize: '1.1rem',
                                                fontWeight: '500',
                                                borderRadius: '50px',
                                                borderWidth: '2px'
                                            }}
                                        >
                                            <i className="bi bi-compass me-2"></i>
                                            Explorer
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            href="/simple-register"
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                                border: 'none',
                                                color: '#334E15',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                borderRadius: '50px',
                                                boxShadow: '0 10px 30px rgba(95, 161, 69, 0.3)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(95, 161, 69, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 161, 69, 0.3)';
                                            }}
                                        >
                                            <i className="bi bi-rocket-takeoff me-2"></i>
                                            Rejoindre Maintenant
                                        </Button>
                                        <Button
                                            href="/login"
                                            variant="outline-light"
                                            size="lg"
                                            className="px-5 py-3"
                                            style={{
                                                borderColor: '#E8F5E8',
                                                color: '#E8F5E8',
                                                fontSize: '1.1rem',
                                                fontWeight: '500',
                                                borderRadius: '50px',
                                                borderWidth: '2px',
                                                background: 'transparent',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(95, 161, 69, 0.2)';
                                                e.currentTarget.style.borderColor = '#5FA145';
                                                e.currentTarget.style.color = '#5FA145';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.borderColor = '#E8F5E8';
                                                e.currentTarget.style.color = '#E8F5E8';
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Se Connecter
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center\"
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            background: 'rgba(95, 161, 69, 0.2)',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        🌟
                                    </div>
                                    <div>
                                        <div style={{ color: '#C69438', fontSize: '0.9rem', fontWeight: '600' }}>
                                            4.9/5
                                        </div>
                                        <div style={{ color: 'rgba(232, 245, 232, 0.8)', fontSize: '0.75rem' }}>
                                            Note communauté
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center\"
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            background: 'rgba(228, 81, 140, 0.2)',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        ⚡
                                    </div>
                                    <div>
                                        <div style={{ color: '#E4518C', fontSize: '0.9rem', fontWeight: '600' }}>
                                            24/7
                                        </div>
                                        <div style={{ color: 'rgba(232, 245, 232, 0.8)', fontSize: '0.75rem' }}>
                                            Support actif
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Side Content */}
                    <Col lg={6}>
                        <Row className="g-4">
                            {/* Live Stats Card */}
                            <Col md={12}>
                                <Card 
                                    className="border-0 h-100\"
                                    style={{
                                        background: 'rgba(51, 78, 21, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                            <h5 className="mb-0 fw-bold\" style={{ color: '#E8F5E8' }}>
                                                📊 Impact en Temps Réel
                                            </h5>
                                            <div 
                                                className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill\"
                                                style={{ background: 'rgba(95, 161, 69, 0.2)' }}
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
                                                <span style={{ color: '#5FA145', fontSize: '0.7rem', fontWeight: '500' }}>
                                                    LIVE
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="row g-3">
                                            {highlights.map((stat, index) => (
                                                <div key={index} className="col-6">
                                                    <div 
                                                        className="text-center p-3 rounded-3\"
                                                        style={{
                                                            background: index === currentSlide 
                                                                ? 'rgba(95, 161, 69, 0.2)' 
                                                                : 'rgba(232, 245, 232, 0.1)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                                            {stat.icon}
                                                        </div>
                                                        <div 
                                                            className="fw-bold\"
                                                            style={{ 
                                                                color: index === currentSlide ? '#C69438' : '#E8F5E8',
                                                                fontSize: '1.2rem'
                                                            }}
                                                        >
                                                            {stat.number}
                                                        </div>
                                                        <div 
                                                            style={{ 
                                                                color: 'rgba(232, 245, 232, 0.8)',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            {stat.label}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Recent Activity */}
                            <Col md={12}>
                                <Card 
                                    className="border-0 h-100\"
                                    style={{
                                        background: 'rgba(51, 78, 21, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        <h6 className="fw-bold mb-3\" style={{ color: '#E8F5E8' }}>
                                            🔥 Activité Récente
                                        </h6>
                                        <div 
                                            className="activity-list"
                                            style={{
                                                height: '200px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    transform: `translateY(-${currentActivityIndex * 66}px)`,
                                                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    willChange: 'transform'
                                                }}
                                            >
                                                {[...recentActivities, ...recentActivities.slice(0, 3)].map((activity, index) => (
                                                    <div 
                                                        key={`activity-${index}`} 
                                                        className="d-flex align-items-center mb-3"
                                                        style={{
                                                            height: '66px',
                                                            opacity: Math.abs(index - currentActivityIndex) <= 2 ? 1 : 0.3,
                                                            transition: 'opacity 0.8s ease'
                                                        }}
                                                    >
                                                        <div 
                                                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style={{
                                                                width: '35px',
                                                                height: '35px',
                                                                background: 'rgba(232, 245, 232, 0.1)',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            {activity.avatar}
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div style={{ color: '#E8F5E8', fontSize: '0.85rem' }}>
                                                                <span className="fw-semibold">{activity.user}</span>
                                                                <span> {activity.action}</span>
                                                            </div>
                                                            <div style={{ color: 'rgba(232, 245, 232, 0.6)', fontSize: '0.75rem' }}>
                                                                Il y a {activity.time} • {activity.role}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {activity.type === 'success' && <span style={{ color: '#5FA145' }}>🎉</span>}
                                                            {activity.type === 'post' && <span style={{ color: '#C69438' }}>📝</span>}
                                                            {activity.type === 'join' && <span style={{ color: '#E4518C' }}>👋</span>}
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
                                                    border: '1px solid rgba(232, 245, 232, 0.3)',
                                                    color: 'rgba(232, 245, 232, 0.8)',
                                                    fontSize: '0.8rem',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(232, 245, 232, 0.1)';
                                                    e.currentTarget.style.color = '#FFF';
                                                    e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'rgba(232, 245, 232, 0.8)';
                                                    e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.3)';
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