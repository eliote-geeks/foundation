import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
    href: string;
    badge?: string;
}

export function QuickActionsSection() {
    const { t } = useTranslation();

    const quickActions: QuickAction[] = [
        {
            id: 'contests',
            title: 'Concours Actifs',
            description: 'Participez aux défis en cours et gagnez des prix',
            icon: 'bi-trophy',
            color: '#C69438',
            gradient: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)',
            href: '/contests',
            badge: '3 nouveaux'
        },
        {
            id: 'events',
            title: 'Événements',
            description: 'Découvrez nos prochains événements et formations',
            icon: 'bi-calendar-event',
            color: '#5FA145',
            gradient: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
            href: '/events',
            badge: 'Cette semaine'
        },
        {
            id: 'community',
            title: 'Rejoindre',
            description: 'Devenez membre et accédez à tous les avantages',
            icon: 'bi-people-fill',
            color: '#E4518C',
            gradient: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
            href: '/simple-register',
            badge: 'Gratuit'
        },
        {
            id: 'partner',
            title: 'Partenariats',
            description: 'Collaborez avec nous pour un impact durable',
            icon: 'bi-handshake',
            color: '#4D8A3C',
            gradient: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)',
            href: '/partners'
        }
    ];

    return (
        <section 
            className="quick-actions py-5"
            style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
                position: 'relative'
            }}
        >
            {/* Background decorations */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1, opacity: 0.15 }}>
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, #5FA145 0%, transparent 70%)',
                        top: '20%',
                        right: '10%',
                        animation: 'pulse 4s ease-in-out infinite'
                    }}
                />
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle, #E4518C 0%, transparent 70%)',
                        bottom: '30%',
                        left: '5%',
                        animation: 'pulse 3s ease-in-out infinite reverse'
                    }}
                />
            </div>

            <Container className="position-relative" style={{ zIndex: 2 }}>
                {/* Header */}
                <Row className="mb-5">
                    <Col className="text-center">
                        <div 
                            className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-4"
                            style={{
                                background: 'rgba(95, 161, 69, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(95, 161, 69, 0.2)'
                            }}
                        >
                            <i className="bi bi-lightning me-2" style={{ color: '#C69438' }}></i>
                            <span style={{ color: '#5FA145', fontSize: '0.95rem', fontWeight: '500' }}>
                                Actions Rapides
                            </span>
                        </div>
                        
                        <h2 
                            className="display-4 fw-bold mb-4"
                            style={{ 
                                color: '#334E15',
                                textShadow: 'none'
                            }}
                        >
                            Commencez Votre Parcours
                        </h2>
                        
                        <p 
                            className="lead"
                            style={{ 
                                color: '#6B7280',
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontSize: '1.2rem'
                            }}
                        >
                            Découvrez toutes les opportunités qui vous attendent dans notre écosystème d'impact social.
                        </p>
                    </Col>
                </Row>

                {/* Quick Actions Grid */}
                <Row className="g-4">
                    {quickActions.map((action, index) => (
                        <Col lg={3} md={6} key={action.id}>
                            <Card 
                                className="action-card h-100 border-0 text-white position-relative overflow-hidden"
                                style={{
                                    background: action.gradient,
                                    borderRadius: '20px',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                {/* Background Pattern */}
                                <div 
                                    className="position-absolute"
                                    style={{
                                        top: '-20px',
                                        right: '-20px',
                                        width: '80px',
                                        height: '80px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '50%'
                                    }}
                                />
                                
                                {action.badge && (
                                    <div 
                                        className="position-absolute top-0 end-0 m-3"
                                    >
                                        <span 
                                            className="badge rounded-pill px-2 py-1"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)',
                                                color: '#FFF',
                                                fontSize: '0.7rem',
                                                border: '1px solid rgba(255, 255, 255, 0.3)'
                                            }}
                                        >
                                            {action.badge}
                                        </span>
                                    </div>
                                )}

                                <Card.Body className="p-4 d-flex flex-column h-100">
                                    <div className="text-center mb-4">
                                        <div 
                                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <i 
                                                className={`${action.icon} display-6`}
                                                style={{ color: '#FFF' }}
                                            ></i>
                                        </div>
                                        
                                        <h4 className="fw-bold mb-2" style={{ color: '#FFF' }}>
                                            {action.title}
                                        </h4>
                                        
                                        <p 
                                            className="mb-3"
                                            style={{ 
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.5'
                                            }}
                                        >
                                            {action.description}
                                        </p>

                                    </div>

                                    <div className="mt-auto">
                                        <Button
                                            href={action.href}
                                            size="sm"
                                            className="w-100 fw-medium py-2"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                color: '#FFF',
                                                borderRadius: '8px',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s ease',
                                                fontSize: '0.85rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                                e.currentTarget.style.color = '#FFF';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                                e.currentTarget.style.color = '#FFF';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            {action.id === 'contests' && 'Voir'}
                                            {action.id === 'events' && 'Parcourir'}
                                            {action.id === 'community' && 'Rejoindre'}
                                            {action.id === 'partner' && 'Découvrir'}
                                            <i className="bi bi-arrow-right ms-1"></i>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* CTA Bottom */}
                <Row className="mt-5">
                    <Col className="text-center">
                        <div 
                            className="p-4 rounded-4"
                            style={{
                                background: 'rgba(232, 245, 232, 0.1)',
                                backdropFilter: 'blur(15px)',
                                border: '1px solid rgba(232, 245, 232, 0.2)',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}
                        >
                            <h5 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                🎯 Nouveau ici ?
                            </h5>
                            <p className="mb-4" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                Découvrez comment notre communauté transforme les défis en opportunités d'impact.
                            </p>
                            <Button
                                href="/about"
                                className="rounded-pill px-4 py-2 fw-semibold"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #5FA145',
                                    color: '#5FA145',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#5FA145';
                                    e.currentTarget.style.color = '#FFFFFF';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#5FA145';
                                }}
                            >
                                <i className="bi bi-info-circle me-2"></i>
                                En savoir plus sur nous
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}