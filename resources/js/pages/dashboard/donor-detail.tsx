import React, { useState } from 'react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Button, Row, Col, Badge, Modal, Form, Table, Container, Tab, Tabs } from 'react-bootstrap';
import { router } from '@inertiajs/react';

interface Donor {
    id: number;
    name: string;
    email: string;
    profile?: {
        full_name: string;
        city?: string;
        country?: string;
        member_type: string;
        member_type_display: string;
        phone?: string;
        company?: string;
        bio?: string;
        social_links?: any;
    };
    total_donations: number;
    total_amount: number;
    average_donation: number;
    formatted_total_amount: string;
    formatted_average_donation: string;
    is_regular_donor: boolean;
    is_major_donor: boolean;
    last_donation_date?: string;
    last_donation_amount?: string;
    last_donation_campaign?: string;
    first_donation_date?: string;
    largest_donation?: string;
    created_at: string;
}

interface Donation {
    id: number;
    donation_number: string;
    campaign_title: string;
    amount: number;
    formatted_amount: string;
    currency: string;
    type: string;
    type_display: string;
    payment_method: string;
    payment_status: string;
    payment_status_display: string;
    donated_at: string;
    public_message?: string;
    is_tribute: boolean;
    tribute_message?: string;
    is_anonymous: boolean;
    receipt_number?: string;
}

interface DonorDetailProps {
    donor: Donor;
    donations?: {
        data: Donation[];
        links: any[];
        meta: any;
    };
    stats?: any[];
    donationsByMonth?: any[];
    donationsByCampaign?: any[];
    similarDonors?: any[];
}

export default function DonorDetail({ 
    donor, 
    donations = { data: [], links: [], meta: {} }, 
    stats = [], 
    donationsByMonth = [], 
    donationsByCampaign = [], 
    similarDonors = [] 
}: DonorDetailProps) {
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [thankYouMessage, setThankYouMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const handleSendThankYou = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/dashboard/donations/donors/${donor.id}/thank-you`, {
            message: thankYouMessage
        }, {
            onSuccess: () => {
                setShowThankYouModal(false);
                setThankYouMessage('');
            }
        });
    };

    const getDonorTypeInfo = () => {
        if (donor.is_major_donor) return { icon: 'bi-star-fill', color: '#C69438', label: 'Donateur majeur' };
        if (donor.is_regular_donor) return { icon: 'bi-arrow-repeat', color: '#5FA145', label: 'Donateur régulier' };
        return { icon: 'bi-person', color: '#4A8A2A', label: 'Donateur' };
    };

    const typeInfo = getDonorTypeInfo();

    return (
        <DashboardLayout title={`Donateur: ${donor.profile?.full_name || donor.name}`}>
            <Container fluid>
                {/* En-tête du donateur */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="flex-grow-1">
                        <nav aria-label="breadcrumb" className="mb-2">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <a href="/dashboard/donations/donors" className="text-decoration-none">
                                        Donateurs
                                    </a>
                                </li>
                                <li className="breadcrumb-item active">{donor.profile?.full_name || donor.name}</li>
                            </ol>
                        </nav>
                        <div className="d-flex align-items-center mb-3">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: `${typeInfo.color}15`,
                                    color: typeInfo.color
                                }}
                            >
                                <i className={`${typeInfo.icon} fs-4`}></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                    {donor.profile?.full_name || donor.name}
                                </h2>
                                <p className="mb-0 text-muted">{donor.email}</p>
                                <div className="d-flex gap-2 mt-2">
                                    <Badge
                                        style={{
                                            backgroundColor: typeInfo.color,
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {typeInfo.label}
                                    </Badge>
                                    {donor.profile?.member_type_display && (
                                        <Badge bg="secondary">{donor.profile.member_type_display}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => setShowThankYouModal(true)}
                            style={{ borderRadius: '12px' }}
                        >
                            <i className="bi bi-envelope-heart me-2"></i>
                            Remercier
                        </Button>
                        <Button
                            variant="outline-secondary"
                            href={`mailto:${donor.email}`}
                            style={{ borderRadius: '12px' }}
                        >
                            <i className="bi bi-envelope me-2"></i>
                            Contacter
                        </Button>
                    </div>
                </div>

                {/* Statistiques du donateur */}
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
                            <Tab eventKey="donations" title="Historique des dons">
                            </Tab>
                            <Tab eventKey="profile" title="Profil">
                            </Tab>
                            <Tab eventKey="analytics" title="Analytiques">
                            </Tab>
                        </Tabs>
                    </Card.Header>
                    
                    <Card.Body className="p-4">
                        {activeTab === 'overview' && (
                            <Row className="g-4">
                                <Col lg={8}>
                                    {/* Résumé des dons */}
                                    <Card className="border-0 mb-4" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                Résumé des Contributions
                                            </h5>
                                            <Row className="g-3">
                                                <Col md={4}>
                                                    <div className="text-center">
                                                        <div className="fw-bold h4" style={{ color: '#C69438' }}>
                                                            {donor.formatted_total_amount}
                                                        </div>
                                                        <small className="text-muted">Total donné</small>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="text-center">
                                                        <div className="fw-bold h4" style={{ color: '#4A8A2A' }}>
                                                            {donor.total_donations}
                                                        </div>
                                                        <small className="text-muted">Nombre de dons</small>
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="text-center">
                                                        <div className="fw-bold h4" style={{ color: '#5FA145' }}>
                                                            {donor.formatted_average_donation}
                                                        </div>
                                                        <small className="text-muted">Don moyen</small>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    {/* Derniers dons */}
                                    <Card className="border-0" style={{ borderRadius: '15px' }}>
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                Derniers Dons
                                            </h5>
                                            <div className="table-responsive">
                                                <Table hover className="mb-0">
                                                    <thead style={{ backgroundColor: '#F8F9FA' }}>
                                                        <tr>
                                                            <th className="border-0 py-3 px-4" style={{ color: '#6B7280' }}>Campagne</th>
                                                            <th className="border-0 py-3" style={{ color: '#6B7280' }}>Montant</th>
                                                            <th className="border-0 py-3" style={{ color: '#6B7280' }}>Date</th>
                                                            <th className="border-0 py-3" style={{ color: '#6B7280' }}>Statut</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {donations.data.slice(0, 5).map((donation) => (
                                                            <tr key={donation.id}>
                                                                <td className="py-3 px-4">
                                                                    <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                        {donation.campaign_title}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        #{donation.donation_number}
                                                                    </small>
                                                                </td>
                                                                <td className="py-3">
                                                                    <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                        {donation.formatted_amount}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3">
                                                                    <small className="text-muted">
                                                                        {donation.donated_at}
                                                                    </small>
                                                                </td>
                                                                <td className="py-3">
                                                                    <Badge
                                                                        bg={donation.payment_status === 'completed' ? 'success' : 'warning'}
                                                                        style={{ fontSize: '0.75rem' }}
                                                                    >
                                                                        {donation.payment_status_display}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg={4}>
                                    {/* Informations du donateur */}
                                    <Card className="border-0 mb-4" style={{ borderRadius: '15px' }}>
                                        <Card.Body className="p-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                <i className="bi bi-info-circle me-2"></i>
                                                Informations
                                            </h6>
                                            {donor.profile?.city && (
                                                <div className="mb-3">
                                                    <small className="text-muted">Ville</small>
                                                    <div className="fw-semibold">
                                                        <i className="bi bi-geo-alt me-2"></i>
                                                        {donor.profile.city}
                                                    </div>
                                                </div>
                                            )}
                                            {donor.profile?.company && (
                                                <div className="mb-3">
                                                    <small className="text-muted">Entreprise</small>
                                                    <div className="fw-semibold">
                                                        <i className="bi bi-building me-2"></i>
                                                        {donor.profile.company}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="mb-3">
                                                <small className="text-muted">Premier don</small>
                                                <div className="fw-semibold">{donor.first_donation_date || 'N/A'}</div>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-muted">Dernier don</small>
                                                <div className="fw-semibold">{donor.last_donation_date || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <small className="text-muted">Plus gros don</small>
                                                <div className="fw-semibold">{donor.largest_donation || 'N/A'}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Donateurs similaires */}
                                    <Card className="border-0" style={{ borderRadius: '15px' }}>
                                        <Card.Body className="p-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                                <i className="bi bi-people me-2"></i>
                                                Donateurs Similaires
                                            </h6>
                                            {similarDonors.map((similar, index) => (
                                                <div key={index} className="d-flex align-items-center mb-3">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                        style={{
                                                            width: '35px',
                                                            height: '35px',
                                                            background: '#4A8A2A15',
                                                            color: '#4A8A2A'
                                                        }}
                                                    >
                                                        <i className="bi bi-person"></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-semibold" style={{ fontSize: '0.9rem', color: '#334E15' }}>
                                                            {similar.name}
                                                        </div>
                                                        <small className="text-muted">
                                                            {similar.formatted_total_amount}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {activeTab === 'donations' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                        Historique Complet des Dons
                                    </h5>
                                    <Button
                                        variant="outline-primary"
                                        href={`/dashboard/donations/donors/${donor.id}/export`}
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
                                                <th className="border-0 py-3 px-4" style={{ color: '#6B7280' }}>Campagne</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Montant</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Type</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Méthode</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Date</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donations.data.map((donation) => (
                                                <tr key={donation.id}>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                {donation.campaign_title}
                                                            </div>
                                                            <small className="text-muted">
                                                                #{donation.donation_number}
                                                            </small>
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
                                                        <small className="text-muted">
                                                            {donation.payment_method}
                                                        </small>
                                                    </td>
                                                    <td className="py-3">
                                                        <small className="text-muted">
                                                            {donation.donated_at}
                                                        </small>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge
                                                            bg={donation.payment_status === 'completed' ? 'success' : 'warning'}
                                                            style={{ fontSize: '0.75rem' }}
                                                        >
                                                            {donation.payment_status_display}
                                                        </Badge>
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
                                            Ce donateur n'a pas encore effectué de dons.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    Profil du Donateur
                                </h5>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Card className="border-0" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-3">Informations personnelles</h6>
                                                <div className="mb-3">
                                                    <small className="text-muted">Nom complet</small>
                                                    <div className="fw-semibold">{donor.profile?.full_name || donor.name}</div>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-muted">Email</small>
                                                    <div className="fw-semibold">{donor.email}</div>
                                                </div>
                                                {donor.profile?.phone && (
                                                    <div className="mb-3">
                                                        <small className="text-muted">Téléphone</small>
                                                        <div className="fw-semibold">{donor.profile.phone}</div>
                                                    </div>
                                                )}
                                                {donor.profile?.city && (
                                                    <div className="mb-3">
                                                        <small className="text-muted">Ville</small>
                                                        <div className="fw-semibold">{donor.profile.city}</div>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="border-0" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-3">Informations supplémentaires</h6>
                                                {donor.profile?.company && (
                                                    <div className="mb-3">
                                                        <small className="text-muted">Entreprise</small>
                                                        <div className="fw-semibold">{donor.profile.company}</div>
                                                    </div>
                                                )}
                                                <div className="mb-3">
                                                    <small className="text-muted">Type de membre</small>
                                                    <div className="fw-semibold">{donor.profile?.member_type_display || 'N/A'}</div>
                                                </div>
                                                <div className="mb-3">
                                                    <small className="text-muted">Membre depuis</small>
                                                    <div className="fw-semibold">{donor.created_at}</div>
                                                </div>
                                                {donor.profile?.bio && (
                                                    <div>
                                                        <small className="text-muted">Biographie</small>
                                                        <div className="fw-semibold">{donor.profile.bio}</div>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div>
                                <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    Analytiques du Donateur
                                </h5>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Card className="border-0" style={{ borderRadius: '15px', backgroundColor: '#F8F9FA' }}>
                                            <Card.Body className="p-4">
                                                <h6 className="fw-bold mb-3">Évolution des dons</h6>
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
                                                <h6 className="fw-bold mb-3">Répartition par campagne</h6>
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
                    </Card.Body>
                </Card>

                {/* Modal de remerciement */}
                <Modal show={showThankYouModal} onHide={() => setShowThankYouModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#334E15' }}>
                            <i className="bi bi-envelope-heart me-2"></i>
                            Envoyer un Remerciement
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    background: '#4A8A2A15',
                                    color: '#4A8A2A'
                                }}
                            >
                                <i className="bi bi-person"></i>
                            </div>
                            <div>
                                <h6 className="mb-1" style={{ color: '#334E15' }}>
                                    {donor.profile?.full_name || donor.name}
                                </h6>
                                <small className="text-muted">
                                    {donor.formatted_total_amount} donnés • {donor.total_donations} dons
                                </small>
                            </div>
                        </div>

                        <Form onSubmit={handleSendThankYou}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Message de remerciement</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={thankYouMessage}
                                    onChange={(e) => setThankYouMessage(e.target.value)}
                                    placeholder="Rédigez un message personnalisé..."
                                    style={{ borderRadius: '8px' }}
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowThankYouModal(false)}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #4A8A2A 0%, #2D5016 100%)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <i className="bi bi-send me-2"></i>
                                    Envoyer
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </DashboardLayout>
    );
}