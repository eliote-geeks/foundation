import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Table, Badge, Button, Form, InputGroup, Modal, ProgressBar } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface DonationsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    tab?: string;
}

export default function Donations({ user, tab }: DonationsProps) {
    const { t } = useTranslation();
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [activeTab, setActiveTab] = useState(tab || 'donations'); // 'donations', 'campaigns', 'donors'

    const stats = [
        {
            title: 'Total des dons',
            value: '29.575.000 FCFA',
            change: '+18%',
            positive: true,
            color: '#5FA145',
            icon: 'bi-heart-fill'
        },
        {
            title: 'Dons ce mois',
            value: '8.150.000 FCFA',
            change: '+25%',
            positive: true,
            color: '#667eea',
            icon: 'bi-calendar-heart'
        },
        {
            title: 'Donateurs actifs',
            value: '342',
            change: '+12%',
            positive: true,
            color: '#E4518C',
            icon: 'bi-people-fill'
        },
        {
            title: 'Campagnes actives',
            value: '7',
            change: '+2',
            positive: true,
            color: '#C69438',
            icon: 'bi-megaphone-fill'
        }
    ];

    const donations = [
        {
            id: 1,
            donor: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            amount: 97500,
            campaign: 'Aide aux sans-abri',
            type: 'Ponctuel',
            method: 'Carte bancaire',
            status: 'Confirmé',
            date: '2024-08-19 14:30',
            receipt: true
        },
        {
            id: 2,
            donor: 'Jean Mbong',
            email: 'jean.mbong@email.com',
            amount: 32500,
            campaign: 'Éducation pour tous',
            type: 'Mensuel',
            method: 'Prélèvement',
            status: 'Confirmé',
            date: '2024-08-19 10:15',
            receipt: true
        },
        {
            id: 3,
            donor: 'Sophie Martin',
            email: 'sophie.martin@email.com',
            amount: 130000,
            campaign: 'Urgence humanitaire',
            type: 'Ponctuel',
            method: 'Virement',
            status: 'En attente',
            date: '2024-08-19 09:45',
            receipt: false
        }
    ];

    const campaigns = [
        {
            id: 1,
            title: 'Aide aux sans-abri',
            description: 'Campagne d\'aide d\'urgence pour les personnes sans domicile',
            goal: 9750000,
            raised: 5687500,
            donors: 87,
            endDate: '2024-12-31',
            status: 'Actif'
        },
        {
            id: 2,
            title: 'Éducation pour tous',
            description: 'Financement de bourses d\'études pour enfants défavorisés',
            goal: 16250000,
            raised: 11830000,
            donors: 124,
            endDate: '2024-11-30',
            status: 'Actif'
        },
        {
            id: 3,
            title: 'Urgence humanitaire',
            description: 'Aide d\'urgence suite aux catastrophes naturelles',
            goal: 6500000,
            raised: 2210000,
            donors: 45,
            endDate: '2024-10-15',
            status: 'Actif'
        }
    ];

    const topDonors = [
        { name: 'Entreprise ABC', totalAmount: 3250000, donations: 12 },
        { name: 'Marie Dubois', totalAmount: 2080000, donations: 24 },
        { name: 'Fondation XYZ', totalAmount: 1820000, donations: 8 },
        { name: 'Jean Mbong', totalAmount: 975000, donations: 30 },
        { name: 'Sophie Martin', totalAmount: 780000, donations: 15 }
    ];

    const getStatusBadge = (status: string) => {
        const variants: any = {
            'Confirmé': 'success',
            'En attente': 'warning',
            'Refusé': 'danger',
            'Remboursé': 'info'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getTypeBadge = (type: string) => {
        const colors: any = {
            'Ponctuel': 'primary',
            'Mensuel': 'success',
            'Annuel': 'info'
        };
        return <Badge bg={colors[type] || 'secondary'}>{type}</Badge>;
    };

    const getProgressPercentage = (raised: number, goal: number) => {
        return Math.min(Math.round((raised / goal) * 100), 100);
    };

    return (
        <DashboardLayout title="Gestion des Dons" user={user}>
            <div className="donations-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                Gestion des Dons
                            </h2>
                            <p className="text-muted mb-0">
                                Suivez et gérez toutes vos collectes de fonds
                            </p>
                        </div>
                        <Button 
                            style={{
                                backgroundColor: '#5FA145',
                                borderColor: '#5FA145'
                            }}
                            onClick={() => setShowCampaignModal(true)}
                        >
                            <i className="bi bi-megaphone me-2"></i>
                            Nouvelle campagne
                        </Button>
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

                {/* Navigation Tabs */}
                <div className="mb-4">
                    <nav className="nav nav-pills nav-fill">
                        {[
                            { key: 'donations', label: 'Dons récents', icon: 'bi-heart' },
                            { key: 'campaigns', label: 'Campagnes', icon: 'bi-megaphone' },
                            { key: 'donors', label: 'Top Donateurs', icon: 'bi-trophy' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                    borderColor: activeTab === tab.key ? '#5FA145' : '#dee2e6',
                                    color: activeTab === tab.key ? '#fff' : '#6c757d'
                                }}
                            >
                                <i className={`${tab.icon} me-2`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'donations' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    Dons récents
                                </h5>
                                <div className="d-flex gap-2">
                                    <InputGroup style={{ width: '300px' }}>
                                        <InputGroup.Text>
                                            <i className="bi bi-search"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Rechercher un don..."
                                        />
                                    </InputGroup>
                                    <Button variant="outline-secondary" size="sm">
                                        <i className="bi bi-download me-2"></i>
                                        Exporter
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4">Donateur</th>
                                        <th className="border-0 py-3">Montant</th>
                                        <th className="border-0 py-3">Campagne</th>
                                        <th className="border-0 py-3">Type</th>
                                        <th className="border-0 py-3">Méthode</th>
                                        <th className="border-0 py-3">Statut</th>
                                        <th className="border-0 py-3">Date</th>
                                        <th className="border-0 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map((donation) => (
                                        <tr key={donation.id}>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="fw-medium" style={{ color: '#1F2937' }}>
                                                        {donation.donor}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {donation.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="fw-bold" style={{ color: '#5FA145' }}>
                                                    {donation.amount.toLocaleString()} FCFA
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className="text-muted">{donation.campaign}</span>
                                            </td>
                                            <td className="py-3">
                                                {getTypeBadge(donation.type)}
                                            </td>
                                            <td className="py-3 text-muted">
                                                {donation.method}
                                            </td>
                                            <td className="py-3">
                                                {getStatusBadge(donation.status)}
                                            </td>
                                            <td className="py-3 text-muted small">
                                                {new Date(donation.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Button variant="outline-secondary" size="sm">
                                                        <i className="bi bi-eye"></i>
                                                    </Button>
                                                    <Button variant="outline-secondary" size="sm">
                                                        <i className="bi bi-receipt"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {activeTab === 'campaigns' && (
                    <Row className="g-4">
                        {campaigns.map((campaign) => (
                            <Col lg={6} key={campaign.id}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                                    {campaign.title}
                                                </h5>
                                                <p className="text-muted mb-0 small">
                                                    {campaign.description}
                                                </p>
                                            </div>
                                            <Badge bg="success">{campaign.status}</Badge>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-bold" style={{ color: '#5FA145', fontSize: '1.5rem' }}>
                                                    €{campaign.raised.toLocaleString()}
                                                </span>
                                                <span className="text-muted">
                                                    / €{campaign.goal.toLocaleString()}
                                                </span>
                                            </div>
                                            <ProgressBar 
                                                now={getProgressPercentage(campaign.raised, campaign.goal)}
                                                style={{ height: '8px' }}
                                            />
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <span className="small text-muted">
                                                    {getProgressPercentage(campaign.raised, campaign.goal)}% atteint
                                                </span>
                                                <span className="small text-muted">
                                                    {campaign.donors} donateurs
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted small">
                                                <i className="bi bi-calendar3 me-2"></i>
                                                Fin le {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" className="flex-fill">
                                                <i className="bi bi-eye me-2"></i>
                                                Voir détails
                                            </Button>
                                            <Button variant="outline-secondary" size="sm" className="flex-fill">
                                                <i className="bi bi-pencil me-2"></i>
                                                Modifier
                                            </Button>
                                            <Button variant="outline-secondary" size="sm">
                                                <i className="bi bi-share"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {activeTab === 'donors' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                Top Donateurs
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {topDonors.map((donor, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#5FA145',
                                                color: 'white'
                                            }}
                                        >
                                            {index < 3 ? (
                                                <i className="bi bi-trophy-fill"></i>
                                            ) : (
                                                donor.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <div className="fw-medium" style={{ color: '#1F2937' }}>
                                                {donor.name}
                                            </div>
                                            <div className="text-muted small">
                                                {donor.donations} donations
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold" style={{ color: '#5FA145' }}>
                                            €{donor.totalAmount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                )}

                {/* Create Campaign Modal */}
                <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Créer une nouvelle campagne</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Titre de la campagne</Form.Label>
                                <Form.Control type="text" placeholder="Ex: Aide aux sans-abri" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Description détaillée de la campagne..." />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Objectif (€)</Form.Label>
                                        <Form.Control type="number" placeholder="15000" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date de fin</Form.Label>
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Image de la campagne</Form.Label>
                                <Form.Control type="file" accept="image/*" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowCampaignModal(false)}>
                            Annuler
                        </Button>
                        <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                            Créer la campagne
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}