import React, { useState } from 'react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Button, Row, Col, Badge, Modal, Form, Dropdown, Table, Container, Nav } from 'react-bootstrap';
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
    created_at: string;
}

interface Stats {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface DonorsProps {
    stats: Stats[];
    donors: {
        data: Donor[];
        links: any[];
        meta: any;
    };
    topDonors: any[];
    donorsByLocation: any[];
    donorEvolution: any[];
    type: string;
    filters: {
        search?: string;
        type?: string;
    };
}

export default function Donors({ stats, donors, topDonors, donorsByLocation, donorEvolution, type, filters }: DonorsProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
    const [thankYouMessage, setThankYouMessage] = useState('');

    const handleSearch = () => {
        router.get('/dashboard/donations/donors', { search: searchQuery, type }, {
            preserveState: true
        });
    };

    const handleTypeFilter = (newType: string) => {
        router.get('/dashboard/donations/donors', { type: newType, search: searchQuery }, {
            preserveState: true
        });
    };

    const handleSendThankYou = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDonor) return;

        router.post(`/dashboard/donations/donors/${selectedDonor.id}/thank-you`, {
            message: thankYouMessage
        }, {
            onSuccess: () => {
                setShowThankYouModal(false);
                setSelectedDonor(null);
                setThankYouMessage('');
            }
        });
    };

    const exportDonors = () => {
        window.location.href = `/dashboard/donations/donors/export?type=${type}&search=${searchQuery}`;
    };

    const getDonorTypeIcon = (donor: Donor) => {
        if (donor.is_major_donor) return { icon: 'bi-star-fill', color: '#C69438', label: 'Donateur majeur' };
        if (donor.is_regular_donor) return { icon: 'bi-arrow-repeat', color: '#5FA145', label: 'Donateur régulier' };
        return { icon: 'bi-person', color: '#4A8A2A', label: 'Donateur' };
    };

    return (
        <DashboardLayout title="Donateurs">
            <Container fluid>
                {/* En-tête */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold" style={{ color: '#334E15' }}>
                            <i className="bi bi-people me-2"></i>
                            Donateurs
                        </h2>
                        <p className="mb-0 text-muted">Gérez vos donateurs et leurs contributions</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={exportDonors}
                            style={{ borderRadius: '12px' }}
                        >
                            <i className="bi bi-download me-2"></i>
                            Exporter
                        </Button>
                    </div>
                </div>

                {/* Statistiques */}
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

                <Row className="g-4">
                    <Col lg={8}>
                        {/* Filtres et recherche */}
                        <Card className="border-0 mb-4" style={{ borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
                            <Card.Body className="p-4">
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <div className="d-flex">
                                            <Form.Control
                                                type="text"
                                                placeholder="Rechercher un donateur..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                style={{ borderRadius: '12px 0 0 12px' }}
                                            />
                                            <Button
                                                onClick={handleSearch}
                                                style={{
                                                    background: '#4A8A2A',
                                                    border: 'none',
                                                    borderRadius: '0 12px 12px 0'
                                                }}
                                            >
                                                <i className="bi bi-search"></i>
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Nav variant="pills" className="justify-content-end">
                                            {[
                                                { key: 'all', label: 'Tous' },
                                                { key: 'regular', label: 'Réguliers' },
                                                { key: 'major', label: 'Majeurs' },
                                                { key: 'recent', label: 'Récents' }
                                            ].map((item) => (
                                                <Nav.Item key={item.key}>
                                                    <Nav.Link
                                                        active={type === item.key}
                                                        onClick={() => handleTypeFilter(item.key)}
                                                        style={{
                                                            backgroundColor: type === item.key ? '#4A8A2A' : 'transparent',
                                                            color: type === item.key ? '#FFF' : '#6B7280',
                                                            borderRadius: '10px'
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Liste des donateurs */}
                        <Card className="border-0" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <Card.Header className="bg-transparent border-0 p-4 pb-0">
                                <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                    Liste des Donateurs
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead style={{ backgroundColor: '#F8F9FA' }}>
                                            <tr>
                                                <th className="border-0 py-3 px-4" style={{ color: '#6B7280' }}>Donateur</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Type</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Total Donné</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Nb Dons</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Dernier Don</th>
                                                <th className="border-0 py-3" style={{ color: '#6B7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donors.data.map((donor) => {
                                                const typeInfo = getDonorTypeIcon(donor);
                                                return (
                                                    <tr key={donor.id}>
                                                        <td className="py-3 px-4">
                                                            <div className="d-flex align-items-center">
                                                                <div
                                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        background: `${typeInfo.color}15`,
                                                                        color: typeInfo.color
                                                                    }}
                                                                >
                                                                    <i className={typeInfo.icon}></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                        {donor.profile?.full_name || donor.name}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {donor.email}
                                                                    </small>
                                                                    {donor.profile?.city && (
                                                                        <div>
                                                                            <small className="text-muted">
                                                                                <i className="bi bi-geo-alt me-1"></i>
                                                                                {donor.profile.city}
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <Badge
                                                                style={{
                                                                    backgroundColor: typeInfo.color,
                                                                    fontSize: '0.75rem'
                                                                }}
                                                                title={typeInfo.label}
                                                            >
                                                                {donor.profile?.member_type_display || 'Membre'}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                                {donor.formatted_total_amount}
                                                            </div>
                                                            <small className="text-muted">
                                                                Moy: {donor.formatted_average_donation}
                                                            </small>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="fw-semibold" style={{ color: '#4A8A2A' }}>
                                                                {donor.total_donations}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            {donor.last_donation_date && (
                                                                <div>
                                                                    <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                                                                        {donor.last_donation_amount}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        {donor.last_donation_date}
                                                                    </small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-3">
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    variant="link"
                                                                    className="p-0 border-0 text-muted"
                                                                    style={{ boxShadow: 'none' }}
                                                                >
                                                                    <i className="bi bi-three-dots"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item href={`/dashboard/donations/donors/${donor.id}`}>
                                                                        <i className="bi bi-eye me-2"></i>
                                                                        Voir le profil
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item 
                                                                        onClick={() => {
                                                                            setSelectedDonor(donor);
                                                                            setShowThankYouModal(true);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-envelope-heart me-2"></i>
                                                                        Remercier
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href={`mailto:${donor.email}`}>
                                                                        <i className="bi bi-envelope me-2"></i>
                                                                        Contacter
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>

                                {donors.data.length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="bi bi-people" style={{ fontSize: '3rem', color: '#6B7280', opacity: 0.5 }}></i>
                                        <h6 className="fw-bold mb-2 mt-3" style={{ color: '#6B7280' }}>
                                            Aucun donateur trouvé
                                        </h6>
                                        <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                                            Aucun donateur ne correspond à vos critères de recherche.
                                        </p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Top donateurs */}
                        <Card className="border-0 mb-4" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <Card.Header className="bg-transparent border-0 p-4 pb-0">
                                <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                    <i className="bi bi-trophy me-2"></i>
                                    Top Donateurs
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4 pt-3">
                                {topDonors.map((donor, index) => (
                                    <div key={index} className="d-flex align-items-center mb-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                background: index < 3 ? '#C6943815' : '#4A8A2A15',
                                                color: index < 3 ? '#C69438' : '#4A8A2A'
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
                                            <div className="d-flex justify-content-between">
                                                <small style={{ color: '#C69438' }}>
                                                    {donor.formatted_total_amount}
                                                </small>
                                                <small className="text-muted">
                                                    {donor.total_donations} dons
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>

                        {/* Répartition par ville */}
                        <Card className="border-0" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <Card.Header className="bg-transparent border-0 p-4 pb-0">
                                <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                    <i className="bi bi-geo-alt me-2"></i>
                                    Répartition par Ville
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4 pt-3">
                                {donorsByLocation.slice(0, 8).map((location, index) => (
                                    <div key={index} className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    background: '#5FA14515',
                                                    color: '#5FA145'
                                                }}
                                            >
                                                <i className="bi bi-geo-alt" style={{ fontSize: '0.8rem' }}></i>
                                            </div>
                                            <div>
                                                <div className="fw-semibold" style={{ fontSize: '0.85rem', color: '#334E15' }}>
                                                    {location.city}
                                                </div>
                                                <small className="text-muted">
                                                    {location.count} donateurs
                                                </small>
                                            </div>
                                        </div>
                                        <small style={{ color: '#5FA145', fontSize: '0.8rem' }}>
                                            {location.formatted_total_amount}
                                        </small>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Modal de remerciement */}
                <Modal show={showThankYouModal} onHide={() => setShowThankYouModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#334E15' }}>
                            <i className="bi bi-envelope-heart me-2"></i>
                            Envoyer un Remerciement
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        {selectedDonor && (
                            <div className="mb-3">
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
                                            {selectedDonor.profile?.full_name || selectedDonor.name}
                                        </h6>
                                        <small className="text-muted">
                                            {selectedDonor.formatted_total_amount} donnés • {selectedDonor.total_donations} dons
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
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </Container>
        </DashboardLayout>
    );
}