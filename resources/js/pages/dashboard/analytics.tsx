import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Nav } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface AnalyticsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Analytics({ user }: AnalyticsProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { title: 'Visiteurs uniques', value: '12,847', change: '+23%', positive: true, color: '#5FA145', icon: 'bi-person-check' },
        { title: 'Pages vues', value: '45,230', change: '+18%', positive: true, color: '#667eea', icon: 'bi-eye' },
        { title: 'Taux de conversion', value: '3.2%', change: '+0.8%', positive: true, color: '#E4518C', icon: 'bi-graph-up' },
        { title: 'Engagement moyen', value: '4m 32s', change: '+15%', positive: true, color: '#C69438', icon: 'bi-clock' }
    ];

    return (
        <DashboardLayout title="Analytics" user={user}>
            <div className="analytics-page">
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Analytics</h2>
                    <p className="text-muted mb-0">Analysez les performances de votre fondation</p>
                </div>

                <Row className="g-4 mb-4">
                    {stats.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>{stat.value}</h3>
                                            <p className="text-muted mb-2 small">{stat.title}</p>
                                        </div>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                                             style={{ width: '48px', height: '48px', backgroundColor: stat.color, color: 'white' }}>
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                    <Badge bg="success" className="rounded-pill">{stat.change}</Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="mb-4">
                    <Nav variant="pills" className="nav-fill">
                        {[
                            { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-graph-up' },
                            { key: 'audience', label: 'Audience', icon: 'bi-people' },
                            { key: 'engagement', label: 'Engagement', icon: 'bi-heart' },
                            { key: 'reports', label: 'Rapports', icon: 'bi-file-text' }
                        ].map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}
                                         style={{ backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent' }}>
                                    <i className={`${tab.icon} me-2`}></i>{tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-5 text-center" style={{ minHeight: '400px' }}>
                        <i className="bi bi-bar-chart-line mb-4" style={{ fontSize: '4rem', color: '#5FA145' }}></i>
                        <h3 className="fw-bold mb-3" style={{ color: '#1F2937' }}>Analytics Avancés</h3>
                        <p className="text-muted mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Les tableaux de bord analytics détaillés avec graphiques interactifs, 
                            rapports de performance et métriques avancées seront disponibles prochainement.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                                <i className="bi bi-download me-2"></i>
                                Exporter les données
                            </Button>
                            <Button variant="outline-secondary">
                                <i className="bi bi-gear me-2"></i>
                                Configurer
                            </Button>
                        </div>
                        <div className="mt-4 pt-4 border-top">
                            <small className="text-muted">
                                Intégration prévue avec Google Analytics, Facebook Insights et d'autres outils de mesure
                            </small>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </DashboardLayout>
    );
}