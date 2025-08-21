import React, { useState } from 'react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Button, Row, Col, Badge, Modal, Form, Table, Container, ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { router } from '@inertiajs/react';

interface Campaign {
    id: number;
    title: string;
    description: string;
    short_description?: string;
    category: string;
    category_display: string;
    type: string;
    type_display: string;
    status: string;
    status_display: string;
    image?: string;
    start_date: string;
    end_date?: string;
    target_amount: number;
    current_amount: number;
    formatted_target_amount: string;
    formatted_current_amount: string;
    completion_percentage: number;
    donor_count: number;
    donation_count: number;
    average_donation: number;
    formatted_average_donation: string;
    days_remaining?: number;
    is_expired: boolean;
    is_ongoing: boolean;
    creator_name: string;
    can_receive_donations: boolean;
    performance_score: number;
    impact_metrics?: any;
    updates?: any[];
    faq?: any[];
    created_at: string;
    updated_at: string;
}

interface Donation {
    id: number;
    donation_number: string;
    amount: number;
    formatted_amount: string;
    currency: string;
    type: string;
    type_display: string;
    donor_name: string;
    donor_email?: string;
    donor_city?: string;
    is_anonymous: boolean;
    payment_method: string;
    payment_status: string;
    payment_status_display: string;
    donated_at: string;
    public_message?: string;
    is_tribute: boolean;
    tribute_message?: string;
}

interface CampaignDetailProps {
    campaign: Campaign;
    donations?: {
        data: Donation[];
        links: any[];
        meta: any;
    };
    stats?: any[];
    topDonors?: any[];
    donationsByDay?: any[];
    donationsByMethod?: any[];
}

export default function DonationCampaignDetail({ 
    campaign, 
    donations = { data: [], links: [], meta: {} }, 
    stats = [], 
    topDonors = [], 
    donationsByDay = [], 
    donationsByMethod = [] 
}: CampaignDetailProps) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateContent, setUpdateContent] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const handleStatusChange = (newStatus: string) => {
        router.post(`/dashboard/donations/campaigns/${campaign.id}/status`, { status: newStatus });
    };

    const handleAddUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/dashboard/donations/campaigns/${campaign.id}/update`, {
            content: updateContent
        }, {
            onSuccess: () => {
                setShowUpdateModal(false);
                setUpdateContent('');
            }
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'active': return '#28A745';
            case 'draft': return '#6C757D';
            case 'paused': return '#FFC107';
            case 'completed': return '#007BFF';
            case 'cancelled': return '#DC3545';
            default: return '#6B7280';
        }
    };

    const getCategoryIcon = (category: string): string => {
        const icons: Record<string, string> = {
            'education': 'bi-book',
            'health': 'bi-heart-pulse',
            'environment': 'bi-tree',
            'poverty': 'bi-house-heart',
            'emergency': 'bi-exclamation-triangle',
            'infrastructure': 'bi-building',
            'technology': 'bi-cpu',
            'culture': 'bi-palette',
            'sport': 'bi-trophy',
            'other': 'bi-three-dots'
        };
        return icons[category] || 'bi-three-dots';
    };

    return (
        <DashboardLayout title={`Campagne: ${campaign.title}`}>
            <Container fluid>
                {/* En-tête de la campagne */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="flex-grow-1">
                        <nav aria-label="breadcrumb" className="mb-2">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard/donations/campaigns" className="text-decoration-none">
                                        Campagnes
                                    </a>
                                </li>
                                <li className="breadcrumb-item active">{campaign.title}</li>
                            </ol>
                        </nav>
                        <h2 className="fw-bold mb-2" style={{ color: '#334E15' }}>
                            <i className={`${getCategoryIcon(campaign.category)} me-2`}></i>
                            {campaign.title}
                        </h2>
                        <div className="d-flex gap-2 mb-3">
                            <Badge
                                style={{
                                    backgroundColor: getStatusColor(campaign.status),
                                    fontSize: '0.8rem'
                                }}
                            >
                                {campaign.status_display}
                            </Badge>
                            <Badge bg="secondary">{campaign.category_display}</Badge>
                            <Badge bg="info">{campaign.type_display}</Badge>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => setShowUpdateModal(true)}
                            style={{ borderRadius: '12px' }}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Ajouter une mise à jour
                        </Button>
                        {campaign.status !== 'active' && (
                            <Button
                                onClick={() => handleStatusChange('active')}
                                style={{
                                    background: '#28A745',
                                    border: 'none',
                                    borderRadius: '12px'
                                }}
                            >
                                <i className="bi bi-play me-2"></i>
                                Activer
                            </Button>
                        )}
                        {campaign.status === 'active' && (
                            <Button
                                variant="warning"
                                onClick={() => handleStatusChange('paused')}
                                style={{ borderRadius: '12px' }}
                            >
                                <i className="bi bi-pause me-2"></i>
                                Suspendre
                            </Button>
                        )}
                    </div>
                </div>

                {/* Statistiques de la campagne */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <Card className="border-0 h-100" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>{stat.title}</p>
                                            <h3 className="fw-bold mb-1" style={{ color: stat.color }}>
                                                {stat.value}
                                            </h3>
                                            <small className="text-success">
                                                <i className="bi bi-arrow-up me-1"></i>
                                                {stat.change}
                                            </small>
                                        </div>
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: `${stat.color}15`,
                                                color: stat.color
                                            }}
                                        >
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Onglets de contenu */}
                <Card className="border-0" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <Card.Header className="bg-transparent border-0 p-4">
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k || 'overview')}
                            className="border-0"
                        >
                            <Tab eventKey="overview" title="Vue d'ensemble">
                            </Tab>
                            <Tab eventKey="donations" title="Dons">
                            </Tab>
                            <Tab eventKey="analytics" title="Analytiques">
                            </Tab>
                            <Tab eventKey="updates" title="Mises à jour">
                            </Tab>
                        </Tabs>
                    </Card.Header>
                    
                    <Card.Body className="p-4">
                        {activeTab === 'overview' && (
                            <Row className="g-4">
                                <Col lg={8}>
                                    {/* Progression de la campagne */}
                                    <Card className="border-0 mb-4" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                Progression de la Campagne
                                            </h5>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                                                        {campaign.formatted_current_amount} collectés
                                                    </span>
                                                    <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                                                        {campaign.completion_percentage}%
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    now={campaign.completion_percentage}
                                                    style={{ height: '12px', borderRadius: '10px' }}
                                                />
                                                <div className="d-flex justify-content-between mt-2">
                                                    <small className="text-muted">
                                                        Objectif: {campaign.formatted_target_amount}
                                                    </small>
                                                    <small className="text-muted">
                                                        {campaign.donor_count} donateurs
                                                    </small>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Description */}
                                    <Card className="border-0 mb-4" style={{ borderRadius: '15px' }}>
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                Description
                                            </h5>
                                            <p className="text-muted lh-lg">
                                                {campaign.description}
                                            </p>
                                        </Card.Body>
                                    </Card>

                                    {/* Métriques d'impact */}
                                    {campaign.impact_metrics && (
                                        <Card className="border-0" style={{ borderRadius: '15px' }}>
                                            <Card.Body className="p-4">
                                                <h5 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                    Impact Prévu
                                                </h5>
                                                <Row className="g-3">
                                                    {Object.entries(campaign.impact_metrics).map(([key, value]) => (
                                                        <Col md={6} key={key}>
                                                            <div className="d-flex align-items-center">
                                                                <div
                                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        background: '#5FA14515',
                                                                        color: '#5FA145'
                                                                    }}
                                                                >
                                                                    <i className="bi bi-check-circle"></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                        {value as string}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </Col>

                                <Col lg={4}>
                                    {/* Top donateurs */}
                                    <Card className="border-0 mb-4" style={{ borderRadius: '15px' }}>
                                        <Card.Body className="p-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                <i className="bi bi-trophy me-2"></i>
                                                Top Donateurs
                                            </h6>
                                            {topDonors.map((donor, index) => (
                                                <div key={index} className="d-flex align-items-center mb-3">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                        style={{
                                                            width: '35px',
                                                            height: '35px',
                                                            background: index < 3 ? '#C6943815' : '#667eea15',
                                                            color: index < 3 ? '#C69438' : '#667eea'
                                                        }}
                                                    >
                                                        {index < 3 ? (
                                                            <i className="bi bi-trophy-fill"></i>
                                                        ) : (
                                                            <span className="fw-bold">{index + 1}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold" style={{ fontSize: '0.9rem', color: '#334E15' }}>
                                                            {donor.name}
                                                        </div>
                                                        <small style={{ color: '#C69438' }}>
                                                            {donor.formatted_amount}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Card>

                                    {/* Informations de la campagne */}
                                    <Card className="border-0" style={{ borderRadius: '15px' }}>
                                        <Card.Body className="p-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                <i className="bi bi-info-circle me-2"></i>
                                                Informations
                                            </h6>
                                            <div className="mb-3">
                                                <small className="text-muted">Créé par</small>
                                                <div className="fw-semibold">{campaign.creator_name}</div>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-muted">Date de début</small>
                                                <div className="fw-semibold">{campaign.start_date}</div>
                                            </div>
                                            {campaign.end_date && (
                                                <div className="mb-3">
                                                    <small className="text-muted">Date de fin</small>
                                                    <div className="fw-semibold">{campaign.end_date}</div>
                                                </div>
                                            )}
                                            <div className="mb-3">
                                                <small className="text-muted">Don moyen</small>
                                                <div className="fw-semibold">{campaign.formatted_average_donation}</div>
                                            </div>
                                            <div>
                                                <small className="text-muted">Score de performance</small>
                                                <div className="fw-semibold">{campaign.performance_score}/100</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {activeTab === 'donations' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                        Liste des Dons
                                    </h5>
                                    <Button
                                        variant="outline-primary"
                                        href={`/dashboard/donations/campaigns/${campaign.id}/export`}
                                        style={{ borderRadius: '12px' }}
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Exporter
                                    </Button>
                                </div>

                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead style={{ backgroundColor: '#F8F9FA' }}>
                                            <tr>
                                                <th className="border-0 py-3 px-4" style={{ color: '#6B7280' }}>Donateur</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Montant</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Type</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Statut</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donations.data.map((donation) => (
                                                <tr key={donation.id}>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                {donation.is_anonymous ? 'Anonyme' : donation.donor_name}
                                                            </div>
                                                            {donation.donor_city && (
                                                                <small className="text-muted">
                                                                    <i className="bi bi-geo-alt me-1"></i>
                                                                    {donation.donor_city}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                            {donation.formatted_amount}
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg="info" style={{ fontSize: '0.75rem' }}>
                                                            {donation.type_display}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge
                                                            bg={donation.payment_status === 'completed' ? 'success' : 'warning'}
                                                            style={{ fontSize: '0.75rem' }}
                                                        >
                                                            {donation.payment_status_display}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <small className="text-muted">
                                                            {donation.donated_at}
                                                        </small>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {donations.data.length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="bi bi-coin" style={{ fontSize: '3rem', color: '#6B7280', opacity: 0.5 }}></i>
                                        <h6 className="fw-bold mb-2 mt-3" style={{ color: '#6B7280' }}>
                                            Aucun don enregistré
                                        </h6>
                                        <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                                            Cette campagne n'a pas encore reçu de dons.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div>
                                <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    Analytiques de la Campagne
                                </h5>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Card className="border-0" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-3">Dons par jour</h6>
                                                <div className="text-center py-4">
                                                    <i className="bi bi-graph-up" style={{ fontSize: '2rem', color: '#6B7280' }}></i>
                                                    <p className="text-muted mt-2">Graphique à venir</p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="border-0" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-3">Méthodes de paiement</h6>
                                                <div className="text-center py-4">
                                                    <i className="bi bi-pie-chart" style={{ fontSize: '2rem', color: '#6B7280' }}></i>
                                                    <p className="text-muted mt-2">Graphique à venir</p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {activeTab === 'updates' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                        Mises à jour de la Campagne
                                    </h5>
                                    <Button
                                        onClick={() => setShowUpdateModal(true)}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Nouvelle mise à jour
                                    </Button>
                                </div>

                                {campaign.updates && campaign.updates.length > 0 ? (
                                    <div className="space-y-4">
                                        {campaign.updates.map((update, index) => (
                                            <Card key={index} className="border-0" style={{ borderRadius: '15px' }}>
                                                <Card.Body className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="fw-bold" style={{ color: '#334E15' }}>
                                                            Mise à jour #{index + 1}
                                                        </h6>
                                                        <small className="text-muted">
                                                            {update.date || 'Date non disponible'}
                                                        </small>
                                                    </div>
                                                    <p className="text-muted mb-0">
                                                        {update.content || 'Contenu non disponible'}
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="bi bi-journal-text" style={{ fontSize: '3rem', color: '#6B7280', opacity: 0.5 }}></i>
                                        <h6 className="fw-bold mb-2 mt-3" style={{ color: '#6B7280' }}>
                                            Aucune mise à jour
                                        </h6>
                                        <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                                            Ajoutez des mises à jour pour tenir vos donateurs informés.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Modal d'ajout de mise à jour */}
                <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#334E15' }}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouvelle Mise à jour
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form onSubmit={handleAddUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Contenu de la mise à jour</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={updateContent}
                                    onChange={(e) => setUpdateContent(e.target.value)}
                                    placeholder="Décrivez les progrès, les défis ou les nouvelles concernant cette campagne..."
                                    style={{ borderRadius: '8px' }}
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowUpdateModal(false)}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Publier
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </DashboardLayout>
    );
}