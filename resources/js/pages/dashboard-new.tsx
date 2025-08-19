import DashboardLayout from '../layouts/dashboard-layout';
import { Card, Row, Col, Badge, ProgressBar, Button } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';
import { useState, useEffect } from 'react';

interface DashboardProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function DashboardNew({ user }: DashboardProps) {
    const { t } = useTranslation();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const stats = [
        {
            title: t('totalMembers', 'Membres totaux'),
            value: '1,342',
            change: '+12%',
            positive: true,
            icon: 'bi-people',
            color: '#5FA145'
        },
        {
            title: t('activeEvents', 'Événements actifs'),
            value: '24',
            change: '+8%',
            positive: true,
            icon: 'bi-calendar-event',
            color: '#667eea'
        },
        {
            title: t('monthlyDonations', 'Dons du mois'),
            value: '8.150.000 FCFA',
            change: '+25%',
            positive: true,
            icon: 'bi-heart',
            color: '#E4518C'
        },
        {
            title: t('activeProjects', 'Projets actifs'),
            value: '18',
            change: '-2%',
            positive: false,
            icon: 'bi-diagram-3',
            color: '#C69438'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            type: 'member',
            message: 'Marie Dubois a rejoint la fondation',
            time: 'Il y a 2 heures',
            icon: 'bi-person-plus',
            color: '#5FA145'
        },
        {
            id: 2,
            type: 'donation',
            message: 'Nouveau don de 325.000 FCFA reçu',
            time: 'Il y a 3 heures',
            icon: 'bi-heart-fill',
            color: '#E4518C'
        },
        {
            id: 3,
            type: 'event',
            message: 'Événement "Collecte alimentaire" créé',
            time: 'Il y a 5 heures',
            icon: 'bi-calendar-plus',
            color: '#667eea'
        },
        {
            id: 4,
            type: 'project',
            message: 'Projet "Aide aux sans-abris" mis à jour',
            time: 'Il y a 1 jour',
            icon: 'bi-file-text',
            color: '#C69438'
        }
    ];

    const quickActions = [
        {
            title: 'Ajouter un membre',
            description: 'Enregistrer un nouveau membre',
            icon: 'bi-person-plus',
            href: '/dashboard/members/add',
            color: '#5FA145'
        },
        {
            title: 'Créer un événement',
            description: 'Organiser un nouvel événement',
            icon: 'bi-calendar-plus',
            href: '/dashboard/events/create',
            color: '#667eea'
        },
        {
            title: 'Nouveau projet',
            description: 'Lancer un nouveau projet',
            icon: 'bi-plus-circle',
            href: '/dashboard/projects/create',
            color: '#E4518C'
        },
        {
            title: 'Envoyer newsletter',
            description: 'Communiquer avec les membres',
            icon: 'bi-envelope-paper',
            href: '/dashboard/communications/newsletter',
            color: '#C69438'
        }
    ];

    return (
        <DashboardLayout title="Dashboard" user={user}>
            <div className="dashboard-home">
                {/* Header Section */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                {t('welcome', 'Bienvenue')}, {user?.name || 'Utilisateur'} !
                            </h2>
                            <p className="text-muted mb-0">
                                {t('dashboardWelcome', 'Voici un aperçu de l\'activité de votre fondation.')}
                            </p>
                        </div>
                        <div 
                            className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                            style={{
                                background: 'rgba(95, 161, 69, 0.1)',
                                border: '1px solid rgba(95, 161, 69, 0.2)'
                            }}
                        >
                            <div 
                                className="d-flex align-items-center justify-content-center rounded-circle me-2"
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    background: '#5FA145'
                                }}
                            />
                            <span style={{ color: '#5FA145', fontSize: '0.9rem', fontWeight: '500' }}>
                                {currentTime.toLocaleTimeString('fr-FR')} • En temps réel
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>
                                                {stat.value}
                                            </h3>
                                            <p className="text-muted mb-2 small">
                                                {stat.title}
                                            </p>
                                        </div>
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: stat.color,
                                                color: 'white'
                                            }}
                                        >
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                    <Badge 
                                        bg={stat.positive ? 'success' : 'danger'}
                                        className="rounded-pill"
                                    >
                                        {stat.change}
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row className="g-4 mb-4">
                    <Col lg={8}>
                        <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    {t('recentActivities', 'Activités récentes')}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="activity-feed">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: activity.color,
                                                    color: 'white'
                                                }}
                                            >
                                                <i className={activity.icon}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-1 fw-medium" style={{ color: '#1F2937' }}>
                                                    {activity.message}
                                                </p>
                                                <p className="text-muted small mb-0">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    className="w-100"
                                    style={{
                                        borderColor: '#5FA145',
                                        color: '#5FA145'
                                    }}
                                >
                                    {t('viewAllActivities', 'Voir toutes les activités')}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    {t('quickActions', 'Actions rapides')}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-grid gap-3">
                                    {quickActions.map((action, index) => (
                                        <Button
                                            key={index}
                                            variant="outline-secondary"
                                            className="text-start p-3 border-0"
                                            style={{ 
                                                backgroundColor: '#F8F9FA',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#E9ECEF';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#F8F9FA';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        backgroundColor: action.color,
                                                        color: 'white'
                                                    }}
                                                >
                                                    <i className={action.icon}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-medium mb-0" style={{ color: '#1F2937' }}>
                                                        {action.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {action.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={6}>
                        <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    {t('membershipGrowth', 'Évolution des membres')}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small text-muted">Adhérents</span>
                                        <span className="fw-medium">890 / 1000</span>
                                    </div>
                                    <ProgressBar now={89} style={{ height: '8px' }} />
                                </div>
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small text-muted">Ambassadeurs</span>
                                        <span className="fw-medium">234 / 300</span>
                                    </div>
                                    <ProgressBar now={78} variant="success" style={{ height: '8px' }} />
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small text-muted">Bénévoles</span>
                                        <span className="fw-medium">218 / 250</span>
                                    </div>
                                    <ProgressBar now={87} variant="warning" style={{ height: '8px' }} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    {t('upcomingEvents', 'Événements à venir')}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="upcoming-events">
                                    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                        <div className="text-center me-3" style={{ width: '60px' }}>
                                            <div className="fw-bold" style={{ color: '#5FA145', fontSize: '1.2rem' }}>
                                                25
                                            </div>
                                            <div className="text-muted small">AOÛT</div>
                                        </div>
                                        <div>
                                            <div className="fw-medium mb-1">Collecte alimentaire</div>
                                            <div className="text-muted small">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                Centre-ville, 14h00
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                        <div className="text-center me-3" style={{ width: '60px' }}>
                                            <div className="fw-bold" style={{ color: '#5FA145', fontSize: '1.2rem' }}>
                                                30
                                            </div>
                                            <div className="text-muted small">AOÛT</div>
                                        </div>
                                        <div>
                                            <div className="fw-medium mb-1">Gala de charité</div>
                                            <div className="text-muted small">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                Hôtel de ville, 19h00
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex align-items-center">
                                        <div className="text-center me-3" style={{ width: '60px' }}>
                                            <div className="fw-bold" style={{ color: '#5FA145', fontSize: '1.2rem' }}>
                                                05
                                            </div>
                                            <div className="text-muted small">SEPT</div>
                                        </div>
                                        <div>
                                            <div className="fw-medium mb-1">Formation bénévoles</div>
                                            <div className="text-muted small">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                Siège social, 10h00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </DashboardLayout>
    );
}