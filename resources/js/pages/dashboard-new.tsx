import DashboardLayout from '../layouts/dashboard-layout';
import { Head, router } from '@inertiajs/react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';
import { useState, useEffect } from 'react';

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    icon: string;
    color: string;
}

interface Activity {
    id: number;
    message: string;
    time: string;
    icon: string;
    color: string;
}

interface UpcomingEvent {
    id: number;
    title: string;
    date: string;
    location: string;
    category: string;
}

interface ModuleStat {
    label: string;
    value: string | number;
    total: number | null;
    icon: string;
    color: string;
    href: string;
}

interface DashboardProps {
    user?: { name: string; email: string; avatar?: string };
    stats: Stat[];
    moduleStats: ModuleStat[];
    recentActivities: Activity[];
    upcomingEvents: UpcomingEvent[];
}

const quickActions = [
    { title: 'Ajouter un membre', description: 'Enregistrer un nouveau membre', icon: 'bi-person-plus', href: '/dashboard/members', color: '#5FA145' },
    { title: 'Créer un événement', description: 'Organiser un nouvel événement', icon: 'bi-calendar-plus', href: '/dashboard/events', color: '#4A8A2A' },
    { title: 'Nouvelle campagne', description: 'Lancer une collecte de fonds', icon: 'bi-megaphone', href: '/dashboard/donations/campaigns', color: '#C69438' },
    { title: 'Voir les donations', description: 'Suivi des contributions', icon: 'bi-heart', href: '/dashboard/donations', color: '#C69438' },
];

export default function DashboardNew({ user, stats, moduleStats, recentActivities, upcomingEvents }: DashboardProps) {
    const { t } = useTranslation();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <DashboardLayout title="Dashboard" user={user}>
            <Head title="Dashboard" />
            <div className="dashboard-home">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                {t('welcome', 'Bienvenue')}, {user?.name || 'Utilisateur'} !
                            </h2>
                            <p className="text-muted mb-0">
                                {t('dashboardWelcome', "Voici un aperçu de l'activité de votre fondation.")}
                            </p>
                        </div>
                        <div
                            className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                            style={{ background: 'rgba(95,161,69,0.1)', border: '1px solid rgba(95,161,69,0.2)' }}
                        >
                            <div
                                className="rounded-circle me-2"
                                style={{ width: 12, height: 12, background: '#5FA145', display: 'inline-block' }}
                            />
                            <span style={{ color: '#5FA145', fontSize: '0.9rem', fontWeight: 500 }}>
                                {currentTime.toLocaleTimeString('fr-FR')} • En temps réel
                            </span>
                        </div>
                    </div>
                </div>

                {/* KPI Stats */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, i) => (
                        <Col lg={3} md={6} key={i}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>{stat.value}</h3>
                                            <p className="text-muted mb-2 small">{stat.title}</p>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 48, height: 48, backgroundColor: stat.color, color: 'white' }}
                                        >
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                    <Badge bg={stat.positive ? 'success' : 'danger'} className="rounded-pill">
                                        {stat.change}
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Module Stats */}
                <div className="mb-4">
                    <h6 className="fw-semibold mb-3" style={{ color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Statistiques par module
                    </h6>
                    <Row className="g-3">
                        {moduleStats.map((m, i) => (
                            <Col lg={2} md={4} sm={6} key={i}>
                                <div
                                    className="p-3 rounded-3 border-0 h-100"
                                    style={{ background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                                    onClick={() => router.visit(m.href)}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)'; }}
                                >
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: 32, height: 32, background: m.color + '1A', color: m.color }}>
                                            <i className={`bi ${m.icon}`} style={{ fontSize: '0.875rem' }}></i>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500, lineHeight: 1.2 }}>{m.label}</span>
                                    </div>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{m.value}</div>
                                    {m.total !== null && (
                                        <div style={{ fontSize: '0.6875rem', color: '#9CA3AF', marginTop: 2 }}>sur {m.total} total</div>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                <Row className="g-4 mb-4">
                    {/* Activités récentes */}
                    <Col lg={8}>
                        <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0 pt-4">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    {t('recentActivities', 'Activités récentes')}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                {recentActivities.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-activity fs-1 d-block mb-2"></i>
                                        Aucune activité récente
                                    </div>
                                ) : (
                                    <>
                                        {recentActivities.map(a => (
                                            <div key={a.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                    style={{ width: 40, height: 40, backgroundColor: a.color, color: 'white' }}
                                                >
                                                    <i className={a.icon}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <p className="mb-1 fw-medium" style={{ color: '#1F2937' }}>{a.message}</p>
                                                    <p className="text-muted small mb-0">{a.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="w-100"
                                            style={{ borderColor: '#5FA145', color: '#5FA145' }}
                                            onClick={() => router.visit('/dashboard/analytics')}
                                        >
                                            Voir toutes les activités
                                        </Button>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Actions rapides */}
                    <Col lg={4}>
                        <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0 pt-4">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>Actions rapides</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="d-grid gap-3">
                                    {quickActions.map((action, i) => (
                                        <Button
                                            key={i}
                                            variant="outline-secondary"
                                            className="text-start p-3 border-0"
                                            style={{ backgroundColor: '#F8F9FA' }}
                                            onClick={() => router.visit(action.href)}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{ width: 36, height: 36, backgroundColor: action.color, color: 'white' }}
                                                >
                                                    <i className={action.icon}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-medium mb-0" style={{ color: '#1F2937' }}>{action.title}</div>
                                                    <div className="text-muted small">{action.description}</div>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Événements à venir */}
                <Row className="g-4">
                    <Col xs={12}>
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Header className="bg-white border-0 pb-0 pt-4 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>Événements à venir</h5>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => router.visit('/dashboard/events')}
                                >
                                    Voir tous
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {upcomingEvents.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        <i className="bi bi-calendar fs-1 d-block mb-2"></i>
                                        Aucun événement à venir
                                    </div>
                                ) : (
                                    <Row className="g-3">
                                        {upcomingEvents.map(e => (
                                            <Col lg={4} key={e.id}>
                                                <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: '#F8F9FA' }}>
                                                    <div className="text-center me-3" style={{ width: 50, flexShrink: 0 }}>
                                                        <div className="fw-bold" style={{ color: '#5FA145', fontSize: '1.2rem' }}>
                                                            {new Date(e.date).getDate()}
                                                        </div>
                                                        <div className="text-muted small" style={{ fontSize: 10, textTransform: 'uppercase' }}>
                                                            {new Date(e.date).toLocaleString('fr-FR', { month: 'short' })}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 min-width-0">
                                                        <div className="fw-medium text-truncate" style={{ color: '#1F2937' }}>{e.title}</div>
                                                        <div className="text-muted small text-truncate">
                                                            <i className="bi bi-geo-alt me-1"></i>{e.location}
                                                        </div>
                                                        <Badge bg="light" text="dark" className="mt-1" style={{ fontSize: 10 }}>{e.category}</Badge>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </DashboardLayout>
    );
}
