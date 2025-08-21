import React, { useState } from 'react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Button, Row, Col, Badge, Modal, Form, Dropdown, ProgressBar, Container, Nav } from 'react-bootstrap';
import { router } from '@inertiajs/react';

interface Campaign {
    id: number;
    title: string;
    description: string;
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
    days_remaining?: number;
    is_expired: boolean;
    is_ongoing: boolean;
    creator_name: string;
    can_receive_donations: boolean;
    performance_score: number;
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

interface CampaignsProps {
    stats: Stats[];
    campaigns: {
        data: Campaign[];
        links: any[];
        meta: any;
    };
    recentCampaigns: any[];
    campaignsByCategory: Record<string, any>;
    campaignsByType: Record<string, any>;
    topCampaigns: any[];
    status: string;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function DonationCampaigns({ stats, campaigns, recentCampaigns, campaignsByCategory, campaignsByType, topCampaigns, status, filters }: CampaignsProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        short_description: '',
        category: 'other',
        type: 'general',
        start_date: '',
        end_date: '',
        target_amount: '',
        min_amount: '',
        max_amount: '',
        target_donors: '',
        full_content: '',
        suggested_amounts: [] as number[],
        allow_anonymous: true,
        allow_recurring: false,
        show_donors: true,
        send_thank_you: true,
        target_regions: [] as string[],
        beneficiary_info: [] as any[]
    });

    const campaignCategories = [
        { value: 'education', label: 'Éducation', color: '#5FA145', icon: 'bi-book' },
        { value: 'health', label: 'Santé', color: '#DC3545', icon: 'bi-heart-pulse' },
        { value: 'environment', label: 'Environnement', color: '#28A745', icon: 'bi-tree' },
        { value: 'poverty', label: 'Lutte contre la pauvreté', color: '#FFC107', icon: 'bi-house-heart' },
        { value: 'emergency', label: 'Urgence humanitaire', color: '#DC3545', icon: 'bi-exclamation-triangle' },
        { value: 'infrastructure', label: 'Infrastructure', color: '#6C757D', icon: 'bi-building' },
        { value: 'technology', label: 'Technologie', color: '#007BFF', icon: 'bi-cpu' },
        { value: 'culture', label: 'Culture & Arts', color: '#E83E8C', icon: 'bi-palette' },
        { value: 'sport', label: 'Sport', color: '#FD7E14', icon: 'bi-trophy' },
        { value: 'other', label: 'Autre', color: '#6B7280', icon: 'bi-three-dots' }
    ];

    const campaignTypes = [
        { value: 'general', label: 'Campagne générale' },
        { value: 'project_specific', label: 'Projet spécifique' },
        { value: 'emergency', label: 'Urgence' },
        { value: 'recurring', label: 'Don récurrent' },
        { value: 'crowdfunding', label: 'Financement participatif' },
        { value: 'memorial', label: 'Don commémoratif' },
        { value: 'tribute', label: 'Don hommage' },
        { value: 'corporate', label: 'Don d\'entreprise' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCreateCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        router.post('/dashboard/donations/campaigns', formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                resetFormData();
            },
            onError: () => {
                // Handle errors
            },
            onFinish: () => setIsLoading(false)
        });
    };

    const handleEditCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaign) return;
        
        setIsLoading(true);

        router.put(`/dashboard/donations/campaigns/${selectedCampaign.id}`, formData, {
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedCampaign(null);
                resetFormData();
            },
            onError: () => {
                // Handle errors
            },
            onFinish: () => setIsLoading(false)
        });
    };

    const resetFormData = () => {
        setFormData({
            title: '',
            description: '',
            short_description: '',
            category: 'other',
            type: 'general',
            start_date: '',
            end_date: '',
            target_amount: '',
            min_amount: '',
            max_amount: '',
            target_donors: '',
            full_content: '',
            suggested_amounts: [],
            allow_anonymous: true,
            allow_recurring: false,
            show_donors: true,
            send_thank_you: true,
            target_regions: [],
            beneficiary_info: []
        });
    };

    const handleSearch = () => {
        router.get('/dashboard/donations/campaigns', { search: searchQuery, status }, {
            preserveState: true
        });
    };

    const handleStatusFilter = (newStatus: string) => {
        router.get('/dashboard/donations/campaigns', { status: newStatus, search: searchQuery }, {
            preserveState: true
        });
    };

    const handleStatusChange = (campaign: Campaign, newStatus: string) => {
        router.post(`/dashboard/donations/campaigns/${campaign.id}/status`, { status: newStatus });
    };

    const openEditModal = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setFormData({
            title: campaign.title,
            description: campaign.description,
            short_description: '',
            category: campaign.category,
            type: campaign.type,
            start_date: campaign.start_date,
            end_date: campaign.end_date || '',
            target_amount: campaign.target_amount.toString(),
            min_amount: '',
            max_amount: '',
            target_donors: '',
            full_content: '',
            suggested_amounts: [],
            allow_anonymous: true,
            allow_recurring: false,
            show_donors: true,
            send_thank_you: true,
            target_regions: [],
            beneficiary_info: []
        });
        setShowEditModal(true);
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

    return (
        <DashboardLayout title="Campagnes de Dons">
            <Container fluid>
                {/* En-tête et statistiques */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold" style={{ color: '#334E15' }}>
                            <i className="bi bi-heart me-2"></i>
                            Campagnes de Dons
                        </h2>
                        <p className="mb-0 text-muted">Gérez vos campagnes de collecte de fonds</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #E4518C 0%, #C73E75 100%)',
                            border: 'none',
                            borderRadius: '12px'
                        }}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Nouvelle Campagne
                    </Button>
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

                {/* Filtres et recherche */}
                <Card className="border-0 mb-4" style={{ borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
                    <Card.Body className="p-4">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder="Rechercher une campagne..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        style={{ borderRadius: '12px 0 0 12px' }}
                                    />
                                    <Button
                                        onClick={handleSearch}
                                        style={{
                                            background: '#5FA145',
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
                                        { key: 'all', label: 'Toutes' },
                                        { key: 'active', label: 'Actives' },
                                        { key: 'draft', label: 'Brouillons' },
                                        { key: 'completed', label: 'Terminées' }
                                    ].map((item) => (
                                        <Nav.Item key={item.key}>
                                            <Nav.Link
                                                active={status === item.key}
                                                onClick={() => handleStatusFilter(item.key)}
                                                style={{
                                                    backgroundColor: status === item.key ? '#5FA145' : 'transparent',
                                                    color: status === item.key ? '#FFF' : '#6B7280',
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

                {/* Liste des campagnes */}
                <Row className="g-4">
                    {campaigns.data.map((campaign) => (
                        <Col lg={6} key={campaign.id}>
                            <Card
                                className="border-0 h-100"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    overflow: 'hidden'
                                }}
                            >
                                {campaign.image && (
                                    <div
                                        style={{
                                            height: '200px',
                                            backgroundImage: `url(${campaign.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                )}
                                
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex gap-2">
                                            <Badge
                                                style={{
                                                    backgroundColor: campaignCategories.find(c => c.value === campaign.category)?.color || '#6B7280',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {campaign.category_display}
                                            </Badge>
                                            <Badge
                                                style={{
                                                    backgroundColor: getStatusColor(campaign.status),
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {campaign.status_display}
                                            </Badge>
                                        </div>
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                variant="link"
                                                className="p-0 border-0 text-muted"
                                                style={{ boxShadow: 'none' }}
                                            >
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => openEditModal(campaign)}>
                                                    <i className="bi bi-pencil me-2"></i>
                                                    Modifier
                                                </Dropdown.Item>
                                                <Dropdown.Item href={`/dashboard/donations/campaigns/${campaign.id}`}>
                                                    <i className="bi bi-eye me-2"></i>
                                                    Voir les détails
                                                </Dropdown.Item>
                                                {campaign.status !== 'active' && (
                                                    <Dropdown.Item onClick={() => handleStatusChange(campaign, 'active')}>
                                                        <i className="bi bi-play me-2"></i>
                                                        Activer
                                                    </Dropdown.Item>
                                                )}
                                                {campaign.status === 'active' && (
                                                    <Dropdown.Item onClick={() => handleStatusChange(campaign, 'paused')}>
                                                        <i className="bi bi-pause me-2"></i>
                                                        Suspendre
                                                    </Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    <h5 className="fw-bold mb-2" style={{ color: '#334E15' }}>
                                        {campaign.title}
                                    </h5>
                                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                        {campaign.description}
                                    </p>

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
                                            style={{ height: '8px', borderRadius: '10px' }}
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

                                    <div className="d-flex align-items-center justify-content-between">
                                        <small className="text-muted">
                                            {campaign.days_remaining !== null ? (
                                                <>
                                                    <i className="bi bi-calendar me-1"></i>
                                                    {campaign.days_remaining > 0 
                                                        ? `${campaign.days_remaining} jours restants`
                                                        : campaign.is_expired 
                                                            ? 'Campagne expirée'
                                                            : 'Se termine bientôt'
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-infinity me-1"></i>
                                                    Durée illimitée
                                                </>
                                            )}
                                        </small>
                                        <small className="text-muted">
                                            Par {campaign.creator_name}
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Pagination */}
                {campaigns.links && campaigns.links.length > 3 && (
                    <div className="d-flex justify-content-center mt-4">
                        {/* Pagination buttons */}
                    </div>
                )}

                {/* Modal de création */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#334E15' }}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouvelle Campagne de Dons
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form onSubmit={handleCreateCampaign}>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Titre *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Catégorie *</Form.Label>
                                        <Form.Select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        >
                                            {campaignCategories.map(category => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Type *</Form.Label>
                                        <Form.Select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        >
                                            {campaignTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Description *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Date de début *</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Date de fin</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleInputChange}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Objectif de collecte (XAF) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="target_amount"
                                            value={formData.target_amount}
                                            onChange={handleInputChange}
                                            required
                                            min="1000"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Nombre de donateurs cible</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="target_donors"
                                            value={formData.target_donors}
                                            onChange={handleInputChange}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={isLoading}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        background: 'linear-gradient(135deg, #E4518C 0%, #C73E75 100%)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                >
                                    {isLoading ? 'Création...' : 'Créer la campagne'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Modal d'édition (similaire au modal de création) */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#334E15' }}>
                            <i className="bi bi-pencil me-2"></i>
                            Modifier la Campagne
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        {selectedCampaign && (
                            <Form onSubmit={handleEditCampaign}>
                                {/* Même formulaire que la création */}
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Titre *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {/* ... autres champs similaires */}
                                </Row>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowEditModal(false)}
                                        disabled={isLoading}
                                        style={{ borderRadius: '8px' }}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                                            border: 'none',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>
            </Container>
        </DashboardLayout>
    );
}