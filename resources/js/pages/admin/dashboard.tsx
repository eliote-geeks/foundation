import React from 'react';
import { Row, Col, Card, Button, ProgressBar, Table, Badge } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin-layout';
import { useTranslation } from '../../hooks/useTranslation';

interface AdminDashboardProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    stats?: {
        totalUsers: number;
        totalMembers: number;
        activeContests: number;
        totalRevenue: number;
        monthlyGrowth: number;
        newUsersToday: number;
    };
}

interface DashboardWidget {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: string;
    color: string;
    gradient: string;
}

interface RecentActivity {
    id: string;
    type: 'user' | 'member' | 'contest' | 'event';
    title: string;
    description: string;
    time: string;
    status: 'success' | 'warning' | 'info' | 'danger';
}

interface TopMember {
    id: string;
    name: string;
    type: string;
    avatar?: string;
    score: number;
    badge: string;
}

export default function AdminDashboard({ user, stats }: AdminDashboardProps) {
    const { t } = useTranslation();

    // Données par défaut si stats n'est pas fourni
    const dashboardStats = stats || {
        totalUsers: 2847,
        totalMembers: 156,
        activeContests: 8,
        totalRevenue: 45250,
        monthlyGrowth: 12.5,
        newUsersToday: 23
    };

    const widgets: DashboardWidget[] = [
        {
            title: t('totalUsers', 'Utilisateurs Total'),
            value: dashboardStats.totalUsers.toLocaleString(),
            change: '+12%',
            changeType: 'positive',
            icon: 'bi-people-fill',
            color: '#5FA145',
            gradient: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
        },
        {
            title: t('activeMembers', 'Membres Actifs'),
            value: dashboardStats.totalMembers,
            change: '+8%',
            changeType: 'positive',
            icon: 'bi-person-badge-fill',
            color: '#C69438',
            gradient: 'linear-gradient(135deg, #C69438 0%, #B8832F 100%)'
        },
        {
            title: t('activeContests', 'Concours Actifs'),
            value: dashboardStats.activeContests,
            change: '+2',
            changeType: 'positive',
            icon: 'bi-trophy-fill',
            color: '#E4518C',
            gradient: 'linear-gradient(135deg, #E4518C 0%, #D6427A 100%)'
        },
        {
            title: t('monthlyRevenue', 'Revenus Mensuel'),
            value: `${dashboardStats.totalRevenue.toLocaleString()}€`,
            change: `+${dashboardStats.monthlyGrowth}%`,
            changeType: 'positive',
            icon: 'bi-currency-euro',
            color: '#4D8A3C',
            gradient: 'linear-gradient(135deg, #4D8A3C 0%, #3A6B2E 100%)'
        }
    ];

    const recentActivities: RecentActivity[] = [
        {
            id: '1',
            type: 'user',
            title: 'Nouvel utilisateur inscrit',
            description: 'Marie Dupont s\'est inscrite comme bénévole',
            time: '2 min',
            status: 'success'
        },
        {
            id: '2',
            type: 'contest',
            title: 'Concours Innovation Tech',
            description: 'Date limite de soumission dans 2 jours',
            time: '15 min',
            status: 'warning'
        },
        {
            id: '3',
            type: 'member',
            title: 'Nouveau partenaire',
            description: 'TechCorp a rejoint nos partenaires',
            time: '1h',
            status: 'info'
        },
        {
            id: '4',
            type: 'event',
            title: 'Événement programmé',
            description: 'Conférence Impact Social - 15 Jan 2025',
            time: '3h',
            status: 'info'
        },
        {
            id: '5',
            type: 'user',
            title: 'Utilisateur supprimé',
            description: 'Compte inactif depuis 6 mois supprimé',
            time: '5h',
            status: 'danger'
        }
    ];

    const topMembers: TopMember[] = [
        {
            id: '1',
            name: 'Jean-Claude Kamgang',
            type: 'Ancien Challenger',
            score: 2840,
            badge: 'Innovateur'
        },
        {
            id: '2',
            name: 'Marie Dubois',
            type: 'Ambassadrice',
            score: 2650,
            badge: 'Leader'
        },
        {
            id: '3',
            name: 'Aminata Traoré',
            type: 'Bénéficiaire',
            score: 2310,
            badge: 'Inspirante'
        },
        {
            id: '4',
            name: 'Paul Njiki',
            type: 'Bénévole',
            score: 1980,
            badge: 'Dévoué'
        }
    ];

    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'user': return 'bi-person-plus';
            case 'member': return 'bi-building';
            case 'contest': return 'bi-trophy';
            case 'event': return 'bi-calendar-event';
            default: return 'bi-info-circle';
        }
    };

    const getStatusColor = (status: RecentActivity['status']) => {
        switch (status) {
            case 'success': return '#5FA145';
            case 'warning': return '#C69438';
            case 'info': return '#4D8A3C';
            case 'danger': return '#E4518C';
            default: return '#6B7280';
        }
    };

    return (
        <AdminLayout title={t('dashboard', 'Dashboard')} user={user}>
            {/* Widgets Overview */}
            <Row className="mb-4">
                {widgets.map((widget, index) => (
                    <Col xl={3} lg={6} md={6} sm={12} key={index} className="mb-3">
                        <Card 
                            className="border-0 h-100 shadow-sm"
                            style={{ 
                                borderRadius: '16px',
                                overflow: 'hidden'
                            }}
                        >
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-2 small fw-medium">
                                            {widget.title}
                                        </p>
                                        <h3 className="mb-2 fw-bold" style={{ color: '#1F2937' }}>
                                            {widget.value}
                                        </h3>
                                        <div className="d-flex align-items-center">
                                            <span 
                                                className="small fw-semibold"
                                                style={{ 
                                                    color: widget.changeType === 'positive' ? '#10B981' : '#EF4444'
                                                }}
                                            >
                                                {widget.changeType === 'positive' ? '↗' : '↘'} {widget.change}
                                            </span>
                                            <span className="text-muted small ms-1">ce mois</span>
                                        </div>
                                    </div>
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            background: widget.gradient,
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        <i className={`${widget.icon}`} style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                {/* Graphiques et statistiques */}
                <Col lg={8} className="mb-4">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Header 
                            className="bg-white border-0 px-4 py-3"
                            style={{ borderRadius: '16px 16px 0 0' }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                    <i className="bi bi-graph-up me-2" style={{ color: '#5FA145' }}></i>
                                    Croissance des Utilisateurs
                                </h5>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-secondary" size="sm">7j</Button>
                                    <Button 
                                        size="sm"
                                        style={{ 
                                            backgroundColor: '#5FA145',
                                            borderColor: '#5FA145'
                                        }}
                                    >
                                        30j
                                    </Button>
                                    <Button variant="outline-secondary" size="sm">90j</Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="px-4 py-4">
                            <div className="text-center py-5" style={{ color: '#6B7280' }}>
                                <i className="bi bi-graph-up" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                                <p className="mt-3 mb-0">Graphique des statistiques</p>
                                <small className="text-muted">Integration Chart.js recommandée</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Membres */}
                <Col lg={4} className="mb-4">
                    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                        <Card.Header 
                            className="bg-white border-0 px-4 py-3"
                            style={{ borderRadius: '16px 16px 0 0' }}
                        >
                            <h5 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                <i className="bi bi-star me-2" style={{ color: '#C69438' }}></i>
                                Top Membres
                            </h5>
                        </Card.Header>
                        <Card.Body className="px-0 py-0">
                            {topMembers.map((member, index) => (
                                <div 
                                    key={member.id}
                                    className="d-flex align-items-center px-4 py-3"
                                    style={{ 
                                        borderBottom: index < topMembers.length - 1 ? '1px solid #F3F4F6' : 'none'
                                    }}
                                >
                                    <div className="me-3">
                                        <span 
                                            className="fw-bold"
                                            style={{ 
                                                color: index === 0 ? '#C69438' : '#6B7280',
                                                fontSize: '1.2rem',
                                                minWidth: '20px',
                                                display: 'inline-block'
                                            }}
                                        >
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: '#5FA145',
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        {member.avatar ? (
                                            <img 
                                                src={member.avatar} 
                                                alt={member.name}
                                                className="rounded-circle"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            member.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold" style={{ color: '#1F2937', fontSize: '0.9rem' }}>
                                            {member.name}
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <small className="text-muted me-2">{member.type}</small>
                                            <Badge 
                                                style={{ 
                                                    backgroundColor: '#C69438',
                                                    fontSize: '0.65rem'
                                                }}
                                            >
                                                {member.badge}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold" style={{ color: '#5FA145' }}>
                                            {member.score}
                                        </div>
                                        <small className="text-muted">pts</small>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Activité récente */}
                <Col lg={7} className="mb-4">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Header 
                            className="bg-white border-0 px-4 py-3"
                            style={{ borderRadius: '16px 16px 0 0' }}
                        >
                            <h5 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                <i className="bi bi-clock me-2" style={{ color: '#E4518C' }}></i>
                                Activité Récente
                            </h5>
                        </Card.Header>
                        <Card.Body className="px-0 py-0">
                            {recentActivities.map((activity, index) => (
                                <div 
                                    key={activity.id}
                                    className="d-flex align-items-start px-4 py-3"
                                    style={{ 
                                        borderBottom: index < recentActivities.length - 1 ? '1px solid #F3F4F6' : 'none'
                                    }}
                                >
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: `${getStatusColor(activity.status)}20`,
                                            color: getStatusColor(activity.status),
                                            flexShrink: 0
                                        }}
                                    >
                                        <i className={getActivityIcon(activity.type)}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold mb-1" style={{ color: '#1F2937', fontSize: '0.9rem' }}>
                                            {activity.title}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            {activity.description}
                                        </div>
                                    </div>
                                    <div className="text-muted small" style={{ flexShrink: 0 }}>
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                        <Card.Footer className="bg-white border-0 px-4 py-3">
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="w-100"
                                style={{ 
                                    borderColor: '#5FA145',
                                    color: '#5FA145'
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
                                Voir toute l'activité
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>

                {/* Actions rapides */}
                <Col lg={5} className="mb-4">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Header 
                            className="bg-white border-0 px-4 py-3"
                            style={{ borderRadius: '16px 16px 0 0' }}
                        >
                            <h5 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                <i className="bi bi-lightning me-2" style={{ color: '#4D8A3C' }}></i>
                                Actions Rapides
                            </h5>
                        </Card.Header>
                        <Card.Body className="px-4 py-4">
                            <Row className="g-3">
                                <Col sm={6}>
                                    <Button 
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            minHeight: '100px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="bi bi-person-plus mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <span className="fw-semibold">Ajouter Utilisateur</span>
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Button 
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #C69438 0%, #B8832F 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            minHeight: '100px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(198, 148, 56, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="bi bi-trophy mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <span className="fw-semibold">Créer Concours</span>
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Button 
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #E4518C 0%, #D6427A 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            minHeight: '100px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(228, 81, 140, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="bi bi-calendar-event mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <span className="fw-semibold">Planifier Événement</span>
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Button 
                                        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #4D8A3C 0%, #3A6B2E 100%)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            minHeight: '100px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 138, 60, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <i className="bi bi-file-text mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <span className="fw-semibold">Publier Article</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}