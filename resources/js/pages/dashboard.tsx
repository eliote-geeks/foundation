import DashboardLayout from '../layouts/dashboard-layout';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Nav } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface DashboardProps {
    user?: {
        name: string;
        email: string;
        member_type?: string;
    };
}

interface DashboardMetric {
    id: string;
    title: string;
    value: string | number;
    change: string;
    trend: 'up' | 'down' | 'stable';
    icon: string;
    color: string;
    gradient: string;
}

interface Activity {
    id: string;
    type: 'contest' | 'ticket' | 'partner' | 'program' | 'achievement';
    title: string;
    description: string;
    timestamp: string;
    status: 'success' | 'pending' | 'info';
    icon: string;
}

interface Module {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'coming-soon' | 'beta';
    progress: number;
    icon: string;
    color: string;
    metrics: {
        primary: string;
        secondary: string;
    };
    quickActions: Array<{
        label: string;
        href: string;
        icon: string;
    }>;
}

export default function Dashboard({ user }: DashboardProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const dashboardMetrics: DashboardMetric[] = [
        {
            id: 'impact-score',
            title: 'Score d\'Impact',
            value: '2,847',
            change: '+12%',
            trend: 'up',
            icon: 'bi-graph-up-arrow',
            color: '#5FA145',
            gradient: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
        },
        {
            id: 'projects',
            title: 'Projets Actifs',
            value: 23,
            change: '+5',
            trend: 'up',
            icon: 'bi-collection-fill',
            color: '#C69438',
            gradient: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)'
        },
        {
            id: 'community',
            title: 'Membres Communauté',
            value: '8.2K',
            change: '+847',
            trend: 'up',
            icon: 'bi-people-fill',
            color: '#E4518C',
            gradient: 'linear-gradient(135deg, #E4518C 0%, #D63384 100%)'
        },
        {
            id: 'funds',
            title: 'Fonds Distribués',
            value: '1.2B FCFA',
            change: '+340M',
            trend: 'up',
            icon: 'bi-currency-exchange',
            color: '#4D8A3C',
            gradient: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)'
        }
    ];

    const modules: Module[] = [
        {
            id: 'contests',
            name: 'Concours & Votes',
            description: 'Gérez vos concours avec vote payant',
            status: 'active',
            progress: 85,
            icon: 'bi-trophy-fill',
            color: '#C69438',
            metrics: {
                primary: '12 Concours actifs',
                secondary: '2,847 Votes'
            },
            quickActions: [
                { label: 'Nouveau Concours', href: '/contests/create', icon: 'bi-plus-circle' },
                { label: 'Voir Résultats', href: '/contests/results', icon: 'bi-bar-chart' },
                { label: 'Gérer Votes', href: '/contests/votes', icon: 'bi-hand-thumbs-up' }
            ]
        },
        {
            id: 'ticketing',
            name: 'Billetterie',
            description: 'Vente de billets et gestion événements',
            status: 'active',
            progress: 92,
            icon: 'bi-ticket-perforated-fill',
            color: '#5FA145',
            metrics: {
                primary: '8 Événements',
                secondary: '1,234 Billets vendus'
            },
            quickActions: [
                { label: 'Nouvel Événement', href: '/tickets/create', icon: 'bi-calendar-plus' },
                { label: 'Statistiques', href: '/tickets/stats', icon: 'bi-graph-up' },
                { label: 'Check-in', href: '/tickets/checkin', icon: 'bi-qr-code-scan' }
            ]
        },
        {
            id: 'members',
            name: 'Espace Membres',
            description: 'Communauté et segmentation',
            status: 'active',
            progress: 78,
            icon: 'bi-people-fill',
            color: '#E4518C',
            metrics: {
                primary: '2,850+ Membres',
                secondary: '6 Catégories'
            },
            quickActions: [
                { label: 'Ajouter Membre', href: '/dashboard/members', icon: 'bi-person-plus' },
                { label: 'Adhérents', href: '/dashboard/members/adherents', icon: 'bi-person-check' },
                { label: 'Ambassadeurs', href: '/dashboard/members/ambassadors', icon: 'bi-star' }
            ]
        },
        {
            id: 'programs',
            name: 'Programmes',
            description: 'Inscriptions et formations',
            status: 'beta',
            progress: 65,
            icon: 'bi-mortarboard-fill',
            color: '#4D8A3C',
            metrics: {
                primary: '12 Programmes',
                secondary: '456 Inscrits'
            },
            quickActions: [
                { label: 'Nouveau Programme', href: '/programs/create', icon: 'bi-plus-square' },
                { label: 'Candidatures', href: '/programs/applications', icon: 'bi-file-text' },
                { label: 'Certifications', href: '/programs/certificates', icon: 'bi-award' }
            ]
        },
        {
            id: 'partners',
            name: 'Partenaires',
            description: 'Gestion des partenariats',
            status: 'active',
            progress: 88,
            icon: 'bi-handshake-fill',
            color: '#334E15',
            metrics: {
                primary: '45 Partenaires',
                secondary: '7 Secteurs'
            },
            quickActions: [
                { label: 'Nouveau Partenaire', href: '/dashboard/partners', icon: 'bi-building-plus' },
                { label: 'Demandes', href: '/dashboard/partners', icon: 'bi-inbox' },
                { label: 'Rapports', href: '/dashboard/partners', icon: 'bi-file-earmark-bar-graph' }
            ]
        },
        {
            id: 'multilingual',
            name: 'Multilingue',
            description: 'Gestion des langues',
            status: 'active',
            progress: 95,
            icon: 'bi-globe-americas',
            color: '#6366F1',
            metrics: {
                primary: '2 Langues',
                secondary: '98% Traduit'
            },
            quickActions: [
                { label: 'Traductions', href: '/languages/translations', icon: 'bi-translate' },
                { label: 'Localisation', href: '/languages/localization', icon: 'bi-globe' },
                { label: 'Maintenance', href: '/languages/maintenance', icon: 'bi-tools' }
            ]
        }
    ];

    const recentActivities: Activity[] = [
        {
            id: '1',
            type: 'contest',
            title: 'Nouveau vote reçu',
            description: 'Concours Innovation Tech - Vote de Marie Dubois',
            timestamp: '2 minutes',
            status: 'success',
            icon: 'bi-hand-thumbs-up-fill'
        },
        {
            id: '2',
            type: 'ticket',
            title: 'Billet vendu',
            description: 'Conférence Innovation Sociale - 1 billet VIP',
            timestamp: '5 minutes',
            status: 'success',
            icon: 'bi-ticket-fill'
        },
        {
            id: '3',
            type: 'program',
            title: 'Nouvelle candidature',
            description: 'Programme Entrepreneuriat Féminin - Jean Mbong',
            timestamp: '12 minutes',
            status: 'pending',
            icon: 'bi-person-check'
        },
        {
            id: '4',
            type: 'partner',
            title: 'Demande partenariat',
            description: 'Orange Cameroun - Partenariat technologique',
            timestamp: '1 heure',
            status: 'info',
            icon: 'bi-building'
        },
        {
            id: '5',
            type: 'achievement',
            title: 'Objectif atteint !',
            description: '1000 membres actifs ce mois',
            timestamp: '2 heures',
            status: 'success',
            icon: 'bi-trophy-fill'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#5FA145';
            case 'beta': return '#C69438';
            case 'coming-soon': return '#E4518C';
            default: return '#6B7280';
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            active: { text: 'Actif', bg: '#5FA145' },
            beta: { text: 'Bêta', bg: '#C69438' },
            'coming-soon': { text: 'Bientôt', bg: '#E4518C' }
        };
        const { text, bg } = config[status as keyof typeof config] || { text: status, bg: '#6B7280' };
        
        return (
            <Badge style={{ backgroundColor: bg, fontSize: '0.7rem' }}>
                {text}
            </Badge>
        );
    };

    const getActivityStatusColor = (status: string) => {
        switch (status) {
            case 'success': return '#5FA145';
            case 'pending': return '#C69438';
            case 'info': return '#6366F1';
            default: return '#6B7280';
        }
    };

    return (
        <DashboardLayout title="Dashboard" user={user}>
                
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

            {/* Navigation Tabs */}
            <div className="mb-4">
                <Nav variant="pills" className="nav-fill">
                    {[
                        { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-house' },
                        { key: 'modules', label: 'Modules', icon: 'bi-grid-3x3' },
                        { key: 'analytics', label: 'Analytics', icon: 'bi-graph-up' },
                        { key: 'activities', label: 'Activités', icon: 'bi-clock-history' }
                    ].map(tab => (
                        <Nav.Item key={tab.key}>
                            <Nav.Link
                                active={activeTab === tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="px-4 py-2 rounded-pill"
                                style={{
                                    background: activeTab === tab.key 
                                        ? 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
                                        : 'transparent',
                                    color: activeTab === tab.key ? '#FFF' : '#6B7280',
                                    border: activeTab === tab.key ? 'none' : '1px solid #D1D5DB',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className={`${tab.icon} me-2`}></i>
                                {tab.label}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </div>

            {/* Dashboard Content */}
            {activeTab === 'overview' && (
                            <>
                                {/* Metrics Cards */}
                                <Row className="g-4 mb-5">
                                    {dashboardMetrics.map(metric => (
                                        <Col lg={3} md={6} key={metric.id}>
                                            <Card 
                                                className="border-0 h-100"
                                                style={{
                                                    background: metric.gradient,
                                                    borderRadius: '20px',
                                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                    transition: 'transform 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <Card.Body className="p-4 text-white">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h6 className="fw-semibold mb-2 opacity-90">
                                                                {metric.title}
                                                            </h6>
                                                            <h3 className="fw-bold mb-0">
                                                                {metric.value}
                                                            </h3>
                                                        </div>
                                                        <div 
                                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                background: 'rgba(255,255,255,0.2)',
                                                                backdropFilter: 'blur(10px)'
                                                            }}
                                                        >
                                                            <i className={`${metric.icon}`} style={{ fontSize: '1.5rem' }}></i>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <i className={`bi bi-arrow-${metric.trend === 'up' ? 'up' : 'down'} me-2`}></i>
                                                        <span className="fw-semibold">
                                                            {metric.change}
                                                        </span>
                                                        <span className="ms-2 opacity-75">ce mois</span>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Quick Stats */}
                                <Row className="g-4">
                                    <Col lg={8}>
                                        <Card 
                                            className="border-0 h-100"
                                            style={{
                                                borderRadius: '20px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <Card.Body className="p-4">
                                                <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                                    <i className="bi bi-graph-up me-2"></i>
                                                    Performance des Modules
                                                </h5>
                                                <Row className="g-3">
                                                    {modules.map(module => (
                                                        <Col md={6} key={module.id}>
                                                            <div 
                                                                className="p-3 rounded-3 border"
                                                                style={{ 
                                                                    borderColor: `${module.color}30`,
                                                                    background: `${module.color}05`
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i 
                                                                        className={`${module.icon} me-3`}
                                                                        style={{ 
                                                                            color: module.color,
                                                                            fontSize: '1.2rem'
                                                                        }}
                                                                    ></i>
                                                                    <div className="flex-grow-1">
                                                                        <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                                                            {module.name}
                                                                        </h6>
                                                                    </div>
                                                                    {getStatusBadge(module.status)}
                                                                </div>
                                                                <div className="mb-2">
                                                                    <div 
                                                                        className="d-flex justify-content-between align-items-center mb-1"
                                                                    >
                                                                        <small style={{ color: '#6B7280' }}>
                                                                            {module.metrics.primary}
                                                                        </small>
                                                                        <small style={{ color: module.color, fontWeight: '600' }}>
                                                                            {module.progress}%
                                                                        </small>
                                                                    </div>
                                                                    <ProgressBar 
                                                                        now={module.progress}
                                                                        style={{ 
                                                                            height: '4px',
                                                                            background: `${module.color}20`
                                                                        }}
                                                                        className="rounded-pill"
                                                                    />
                                                                </div>
                                                                <small style={{ color: '#6B7280' }}>
                                                                    {module.metrics.secondary}
                                                                </small>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col lg={4}>
                                        <Card 
                                            className="border-0 h-100"
                                            style={{
                                                borderRadius: '20px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                                    <i className="bi bi-clock-history me-2"></i>
                                                    Activités Récentes
                                                </h6>
                                                <div className="activities-list">
                                                    {recentActivities.slice(0, 5).map(activity => (
                                                        <div key={activity.id} className="d-flex align-items-start mb-3">
                                                            <div 
                                                                className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    background: `${getActivityStatusColor(activity.status)}15`,
                                                                    color: getActivityStatusColor(activity.status)
                                                                }}
                                                            >
                                                                <i className={activity.icon} style={{ fontSize: '0.8rem' }}></i>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div 
                                                                    className="fw-semibold mb-1"
                                                                    style={{ fontSize: '0.9rem', color: '#334E15' }}
                                                                >
                                                                    {activity.title}
                                                                </div>
                                                                <div 
                                                                    style={{ 
                                                                        fontSize: '0.8rem', 
                                                                        color: '#6B7280',
                                                                        lineHeight: '1.3'
                                                                    }}
                                                                >
                                                                    {activity.description}
                                                                </div>
                                                                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                                                    Il y a {activity.timestamp}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="w-100 mt-2"
                                                    style={{
                                                        borderColor: '#5FA145',
                                                        color: '#5FA145',
                                                        borderRadius: '10px'
                                                    }}
                                                >
                                                    Voir toutes les activités
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {/* Modules Tab */}
                        {activeTab === 'modules' && (
                            <Row className="g-4">
                                {modules.map(module => (
                                    <Col lg={6} key={module.id}>
                                        <Card 
                                            className="border-0 h-100"
                                            style={{
                                                borderRadius: '20px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div 
                                                className="p-4"
                                                style={{
                                                    background: `linear-gradient(135deg, ${module.color} 0%, ${module.color}80 100%)`
                                                }}
                                            >
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div 
                                                            className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                background: 'rgba(255,255,255,0.2)',
                                                                backdropFilter: 'blur(10px)'
                                                            }}
                                                        >
                                                            <i 
                                                                className={`${module.icon} text-white`}
                                                                style={{ fontSize: '1.5rem' }}
                                                            ></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="fw-bold mb-1 text-white">
                                                                {module.name}
                                                            </h5>
                                                            <p className="mb-0 text-white opacity-75" style={{ fontSize: '0.9rem' }}>
                                                                {module.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(module.status)}
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="text-white opacity-90" style={{ fontSize: '0.9rem' }}>
                                                            Progression
                                                        </span>
                                                        <span className="text-white fw-bold">
                                                            {module.progress}%
                                                        </span>
                                                    </div>
                                                    <ProgressBar 
                                                        now={module.progress}
                                                        style={{ 
                                                            height: '6px',
                                                            background: 'rgba(255,255,255,0.2)'
                                                        }}
                                                        className="rounded-pill"
                                                    />
                                                </div>
                                                
                                                <Row className="g-3">
                                                    <Col xs={6}>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>
                                                                {module.metrics.primary.split(' ')[0]}
                                                            </div>
                                                            <div className="text-white opacity-75" style={{ fontSize: '0.8rem' }}>
                                                                {module.metrics.primary.split(' ').slice(1).join(' ')}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-white" style={{ fontSize: '1.1rem' }}>
                                                                {module.metrics.secondary.split(' ')[0]}
                                                            </div>
                                                            <div className="text-white opacity-75" style={{ fontSize: '0.8rem' }}>
                                                                {module.metrics.secondary.split(' ').slice(1).join(' ')}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                    Actions Rapides
                                                </h6>
                                                <Row className="g-2">
                                                    {module.quickActions.map((action, index) => (
                                                        <Col xs={12} key={index}>
                                                            <a
                                                                href={action.href}
                                                                className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-start text-decoration-none"
                                                                style={{
                                                                    borderColor: `${module.color}30`,
                                                                    color: module.color,
                                                                    borderRadius: '10px',
                                                                    padding: '8px 12px'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = `${module.color}10`;
                                                                    e.currentTarget.style.borderColor = module.color;
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background = 'transparent';
                                                                    e.currentTarget.style.borderColor = `${module.color}30`;
                                                                }}
                                                            >
                                                                <i className={`${action.icon} me-2`}></i>
                                                                {action.label}
                                                            </a>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <Row className="g-4">
                                <Col xs={12}>
                                    <Card 
                                        className="border-0 text-center"
                                        style={{
                                            borderRadius: '20px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            minHeight: '400px'
                                        }}
                                    >
                                        <Card.Body className="d-flex align-items-center justify-content-center">
                                            <div>
                                                <i 
                                                    className="bi bi-graph-up-arrow mb-4"
                                                    style={{ 
                                                        fontSize: '4rem',
                                                        color: '#5FA145',
                                                        opacity: 0.7
                                                    }}
                                                ></i>
                                                <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                    Analytics Avancés
                                                </h4>
                                                <p className="text-muted mb-4">
                                                    Les graphiques détaillés et rapports analytics seront disponibles ici.
                                                    Intégration avec des outils de BI en cours de développement.
                                                </p>
                                                <Button
                                                    style={{
                                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                        border: 'none',
                                                        borderRadius: '50px',
                                                        padding: '12px 30px'
                                                    }}
                                                >
                                                    <i className="bi bi-bar-chart me-2"></i>
                                                    Voir les rapports
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {/* Activities Tab */}
                        {activeTab === 'activities' && (
                            <Row className="g-4">
                                <Col xs={12}>
                                    <Card 
                                        className="border-0"
                                        style={{
                                            borderRadius: '20px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                                <i className="bi bi-clock-history me-2"></i>
                                                Journal d'Activités Complètes
                                            </h5>
                                            <div className="activities-list">
                                                {recentActivities.map(activity => (
                                                    <div 
                                                        key={activity.id} 
                                                        className="d-flex align-items-start p-3 rounded-3 mb-3"
                                                        style={{
                                                            background: `${getActivityStatusColor(activity.status)}05`,
                                                            border: `1px solid ${getActivityStatusColor(activity.status)}20`
                                                        }}
                                                    >
                                                        <div 
                                                            className="d-flex align-items-center justify-content-center rounded-circle me-4 flex-shrink-0"
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                background: `${getActivityStatusColor(activity.status)}15`,
                                                                color: getActivityStatusColor(activity.status)
                                                            }}
                                                        >
                                                            <i className={activity.icon} style={{ fontSize: '1rem' }}></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                                <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                                                    {activity.title}
                                                                </h6>
                                                                <Badge 
                                                                    style={{ 
                                                                        background: getActivityStatusColor(activity.status),
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                >
                                                                    {activity.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="mb-2" style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                                                                {activity.description}
                                                            </p>
                                                            <div 
                                                                className="d-flex align-items-center"
                                                                style={{ fontSize: '0.8rem', color: '#9CA3AF' }}
                                                            >
                                                                <i className="bi bi-clock me-1"></i>
                                                                Il y a {activity.timestamp}
                                                                <span className="mx-2">•</span>
                                                                <i className="bi bi-tag me-1"></i>
                                                                {activity.type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
        </DashboardLayout>
    );
}