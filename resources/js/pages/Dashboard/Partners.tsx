import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Form, Alert, Dropdown, ProgressBar } from 'react-bootstrap';
import DashboardLayout from '../../layouts/dashboard-layout';

interface Partner {
    id: number;
    name: string;
    category: string;
    partnership_type: string;
    status: string;
    status_badge: string;
    contribution: string;
    contact_person: string;
    since: string;
    last_contact: string;
}

interface PartnerRequest {
    id: number;
    company_name: string;
    contact_name: string;
    category: string;
    status: string;
    status_badge: string;
    status_text: string;
    submitted_at: string;
    reviewer?: string;
}

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface DashboardPartnersProps {
    user?: {
        name: string;
        email: string;
    };
    stats: Stat[];
    partners: Partner[];
    recentRequests: PartnerRequest[];
}

export default function DashboardPartners({ user, stats, partners, recentRequests }: DashboardPartnersProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'danger'>('success');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        website: '',
        phone: '',
        contact_person: '',
        contact_position: '',
        category: '',
        partnership_type: '',
        contribution_amount: '',
        partnership_details: '',
        is_featured: false,
        priority: 50
    });

    const categories = ['Technologie', 'Finance', 'Éducation', 'Télécommunications', 'Énergie', 'Agroalimentaire', 'Transport', 'Autre'];
    const partnershipTypes = ['Financier', 'Technique', 'Académique', 'Environnemental', 'Social', 'Innovation'];

    const getStatusBadgeStyle = (status: string) => {
        const styles = {
            active: { bg: '#5FA145', color: '#FFF' },
            pending: { bg: '#C69438', color: '#FFF' },
            suspended: { bg: '#C69438', color: '#FFF' },
            inactive: { bg: '#6B7280', color: '#FFF' }
        };
        return styles[status as keyof typeof styles] || styles.inactive;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCreatePartner = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for creating partner will be here
        setShowCreateModal(false);
        setAlertMessage('Partenaire créé avec succès !');
        setAlertType('success');
        setTimeout(() => setAlertMessage(''), 3000);
    };

    const handleProcessRequest = async (requestId: number, action: 'approve' | 'reject' | 'review', notes?: string) => {
        // Logic for processing partner requests will be here
        setShowRequestModal(false);
        setSelectedRequest(null);
        setAlertMessage(`Demande ${action === 'approve' ? 'approuvée' : action === 'reject' ? 'rejetée' : 'mise en examen'} !`);
        setAlertType('success');
        setTimeout(() => setAlertMessage(''), 3000);
    };

    return (
        <DashboardLayout title="Gestion des Partenaires" user={user}>
            <Head title="Dashboard - Partenaires" />

            {/* Alert Messages */}
            {alertMessage && (
                <Alert variant={alertType} className="mb-4" dismissible onClose={() => setAlertMessage('')}>
                    {alertMessage}
                </Alert>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1F2937' }}>
                        <i className="bi bi-handshake-fill me-2" style={{ color: '#334E15' }}></i>
                        Gestion des Partenaires
                    </h2>
                    <p className="text-muted mb-0">
                        Gérez vos partenariats, analysez les collaborations et traitez les nouvelles demandes.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={() => window.open('/partners/export?format=csv', '_blank')}
                        style={{
                            borderColor: '#5FA145',
                            color: '#5FA145',
                            borderRadius: '10px'
                        }}
                    >
                        <i className="bi bi-download me-2"></i>
                        Export CSV
                    </Button>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                            border: 'none',
                            borderRadius: '10px'
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nouveau Partenaire
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-5">
                {stats.map((stat, index) => (
                    <Col lg={3} md={6} key={index}>
                        <Card 
                            className="border-0 h-100"
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}90 100%)`
                            }}
                        >
                            <Card.Body className="p-4 text-white">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 opacity-90" style={{ fontSize: '0.9rem' }}>
                                            {stat.title}
                                        </p>
                                        <h3 className="fw-bold mb-0">
                                            {stat.value}
                                        </h3>
                                    </div>
                                    <div 
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            background: 'rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        <i className={stat.icon} style={{ fontSize: '1.3rem' }}></i>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className={`bi bi-arrow-${stat.positive ? 'up' : 'down'} me-2`}></i>
                                    <span className="fw-semibold">
                                        {stat.change}
                                    </span>
                                    <span className="ms-2 opacity-75">ce mois</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Navigation Tabs */}
            <div className="mb-4">
                <div className="nav nav-pills justify-content-center" style={{ background: '#F8F9FA', borderRadius: '15px', padding: '8px' }}>
                    {[
                        { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-house' },
                        { key: 'partners', label: 'Partenaires', icon: 'bi-building' },
                        { key: 'requests', label: 'Demandes', icon: 'bi-inbox', count: recentRequests.filter(r => r.status === 'pending').length },
                        { key: 'analytics', label: 'Analytics', icon: 'bi-graph-up' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                background: activeTab === tab.key 
                                    ? 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
                                    : 'transparent',
                                color: activeTab === tab.key ? '#FFF' : '#6B7280',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '500',
                                padding: '10px 20px',
                                position: 'relative'
                            }}
                        >
                            <i className={`${tab.icon} me-2`}></i>
                            {tab.label}
                            {tab.count && tab.count > 0 && (
                                <Badge 
                                    bg="danger" 
                                    className="ms-2"
                                    style={{ fontSize: '0.7rem' }}
                                >
                                    {tab.count}
                                </Badge>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <Row className="g-4">
                    <Col lg={8}>
                        <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    <i className="bi bi-building-check me-2"></i>
                                    Partenaires Récents
                                </h5>
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead style={{ background: '#F8F9FA' }}>
                                            <tr>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Partenaire</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Catégorie</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Statut</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Contribution</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {partners.slice(0, 5).map(partner => {
                                                const statusStyle = getStatusBadgeStyle(partner.status);
                                                return (
                                                    <tr key={partner.id}>
                                                        <td className="border-0">
                                                            <div>
                                                                <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                                    {partner.name}
                                                                </div>
                                                                <small style={{ color: '#6B7280' }}>
                                                                    Contact: {partner.contact_person}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td className="border-0">
                                                            <span style={{ color: '#6B7280' }}>
                                                                {partner.category}
                                                            </span>
                                                        </td>
                                                        <td className="border-0">
                                                            <Badge 
                                                                style={{ 
                                                                    background: statusStyle.bg, 
                                                                    color: statusStyle.color,
                                                                    fontSize: '0.75rem'
                                                                }}
                                                            >
                                                                {partner.status_badge}
                                                            </Badge>
                                                        </td>
                                                        <td className="border-0" style={{ color: '#5FA145', fontWeight: '600' }}>
                                                            {partner.contribution}
                                                        </td>
                                                        <td className="border-0">
                                                            <Dropdown>
                                                                <Dropdown.Toggle 
                                                                    variant="outline-secondary" 
                                                                    size="sm"
                                                                    style={{ border: 'none', background: 'none' }}
                                                                >
                                                                    <i className="bi bi-three-dots"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item href="#" style={{ fontSize: '0.9rem' }}>
                                                                        <i className="bi bi-eye me-2"></i>Voir détails
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href="#" style={{ fontSize: '0.9rem' }}>
                                                                        <i className="bi bi-pencil me-2"></i>Modifier
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href="#" style={{ fontSize: '0.9rem', color: '#C69438' }}>
                                                                        <i className="bi bi-pause me-2"></i>Suspendre
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
                                <div className="text-center mt-3">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setActiveTab('partners')}
                                        style={{ borderColor: '#5FA145', color: '#5FA145', borderRadius: '10px' }}
                                    >
                                        Voir tous les partenaires
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    <i className="bi bi-inbox me-2"></i>
                                    Demandes Récentes
                                </h6>
                                <div className="requests-list">
                                    {recentRequests.map(request => {
                                        const statusStyle = getStatusBadgeStyle(request.status);
                                        return (
                                            <div 
                                                key={request.id} 
                                                className="d-flex align-items-start p-3 rounded-3 mb-3"
                                                style={{ 
                                                    background: '#F8F9FA',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#E8F5E8'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#F8F9FA'}
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setShowRequestModal(true);
                                                }}
                                            >
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                    style={{
                                                        width: '35px',
                                                        height: '35px',
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    <i className="bi bi-building"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem', color: '#1F2937' }}>
                                                        {request.company_name}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                                        {request.contact_name} • {request.category}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                                        {request.submitted_at}
                                                    </div>
                                                </div>
                                                <Badge 
                                                    style={{ 
                                                        background: statusStyle.bg,
                                                        fontSize: '0.65rem'
                                                    }}
                                                >
                                                    {request.status_badge}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100 mt-2"
                                    onClick={() => setActiveTab('requests')}
                                    style={{ borderColor: '#5FA145', color: '#5FA145', borderRadius: '10px' }}
                                >
                                    Gérer les demandes
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {activeTab === 'partners' && (
                <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                    <Card.Body className="p-4">
                        <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                            <i className="bi bi-building me-2"></i>
                            Tous les Partenaires
                        </h5>
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead style={{ background: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Partenaire</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Type</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Statut</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Depuis</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Dernière contact</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partners.map(partner => {
                                        const statusStyle = getStatusBadgeStyle(partner.status);
                                        return (
                                            <tr key={partner.id}>
                                                <td className="border-0">
                                                    <div>
                                                        <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                            {partner.name}
                                                        </div>
                                                        <small style={{ color: '#6B7280' }}>
                                                            {partner.category} • {partner.contact_person}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td className="border-0" style={{ color: '#6B7280' }}>
                                                    {partner.partnership_type}
                                                </td>
                                                <td className="border-0">
                                                    <Badge 
                                                        style={{ 
                                                            background: statusStyle.bg, 
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {partner.status_badge}
                                                    </Badge>
                                                </td>
                                                <td className="border-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                    {partner.since}
                                                </td>
                                                <td className="border-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                    {partner.last_contact}
                                                </td>
                                                <td className="border-0">
                                                    <div className="d-flex gap-1">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            style={{ 
                                                                border: 'none', 
                                                                background: '#E8F5E8', 
                                                                color: '#5FA145' 
                                                            }}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            style={{ 
                                                                border: 'none', 
                                                                background: '#F3F4F6', 
                                                                color: '#6B7280' 
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        <Dropdown>
                                                            <Dropdown.Toggle 
                                                                variant="outline-secondary" 
                                                                size="sm"
                                                                style={{ 
                                                                    border: 'none', 
                                                                    background: '#F3F4F6', 
                                                                    color: '#6B7280' 
                                                                }}
                                                            >
                                                                <i className="bi bi-three-dots"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item href="#" style={{ fontSize: '0.9rem' }}>
                                                                    <i className="bi bi-telephone me-2"></i>Marquer contact
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item href="#" style={{ fontSize: '0.9rem', color: '#C69438' }}>
                                                                    <i className="bi bi-pause me-2"></i>Suspendre
                                                                </Dropdown.Item>
                                                                <Dropdown.Item href="#" style={{ fontSize: '0.9rem', color: '#DC2626' }}>
                                                                    <i className="bi bi-trash me-2"></i>Supprimer
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {activeTab === 'requests' && (
                <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                    <Card.Body className="p-4">
                        <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                            <i className="bi bi-inbox me-2"></i>
                            Demandes de Partenariat
                        </h5>
                        <Row className="g-3">
                            {recentRequests.map(request => {
                                const statusStyle = getStatusBadgeStyle(request.status);
                                return (
                                    <Col lg={6} key={request.id}>
                                        <Card 
                                            className="h-100"
                                            style={{ 
                                                borderRadius: '12px',
                                                border: `2px solid ${statusStyle.bg}20`,
                                                background: `${statusStyle.bg}05`
                                            }}
                                        >
                                            <Card.Body className="p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                                            {request.company_name}
                                                        </h6>
                                                        <p className="mb-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                            Contact: {request.contact_name}
                                                        </p>
                                                    </div>
                                                    <Badge 
                                                        style={{ 
                                                            background: statusStyle.bg,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {request.status_badge}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <small style={{ color: '#6B7280' }}>
                                                        <i className="bi bi-tag me-1"></i>
                                                        {request.category}
                                                        <span className="mx-2">•</span>
                                                        <i className="bi bi-clock me-1"></i>
                                                        {request.submitted_at}
                                                    </small>
                                                </div>

                                                {request.status === 'pending' && (
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => handleProcessRequest(request.id, 'approve')}
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Approuver
                                                        </Button>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowRequestModal(true);
                                                            }}
                                                            style={{ borderRadius: '8px', borderColor: '#5FA145', color: '#5FA145' }}
                                                        >
                                                            <i className="bi bi-eye me-1"></i>
                                                            Examiner
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleProcessRequest(request.id, 'reject')}
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            <i className="bi bi-x-circle me-1"></i>
                                                            Rejeter
                                                        </Button>
                                                    </div>
                                                )}

                                                {request.reviewer && (
                                                    <small style={{ color: '#6B7280' }}>
                                                        <i className="bi bi-person me-1"></i>
                                                        Examiné par: {request.reviewer}
                                                    </small>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {activeTab === 'analytics' && (
                <Card className="border-0 text-center" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', minHeight: '400px' }}>
                    <Card.Body className="d-flex align-items-center justify-content-center">
                        <div>
                            <i 
                                className="bi bi-graph-up-arrow mb-4"
                                style={{ fontSize: '4rem', color: '#5FA145', opacity: 0.7 }}
                            />
                            <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                Analytics des Partenariats
                            </h4>
                            <p className="text-muted mb-4">
                                Graphiques détaillés sur la performance des partenariats, 
                                évolution des contributions et analyse des secteurs.
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
                                Voir les rapports détaillés
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Create Partner Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Nouveau Partenaire
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleCreatePartner}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Nom de l'organisation *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Personne de contact *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contact_person"
                                        value={formData.contact_person}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Téléphone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
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
                                        <option value="">Sélectionnez...</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Type de partenariat *</Form.Label>
                                    <Form.Select
                                        name="partnership_type"
                                        value={formData.partnership_type}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <option value="">Sélectionnez...</option>
                                        {partnershipTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
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
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowCreateModal(false)}
                                style={{ borderRadius: '8px' }}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            >
                                Créer le partenaire
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Request Details Modal */}
            <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} size="lg" centered>
                {selectedRequest && (
                    <>
                        <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <Modal.Title style={{ color: '#334E15' }}>
                                <i className="bi bi-building me-2"></i>
                                Demande de {selectedRequest.company_name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Informations de l'entreprise</h6>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <small className="text-muted">Nom de l'entreprise</small>
                                        <div className="fw-semibold">{selectedRequest.company_name}</div>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Contact</small>
                                        <div className="fw-semibold">{selectedRequest.contact_name}</div>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Secteur</small>
                                        <div className="fw-semibold">{selectedRequest.category}</div>
                                    </Col>
                                    <Col md={6}>
                                        <small className="text-muted">Statut actuel</small>
                                        <div>
                                            <Badge style={{ background: getStatusBadgeStyle(selectedRequest.status).bg }}>
                                                {selectedRequest.status_badge}
                                            </Badge>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowRequestModal(false)}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Fermer
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => handleProcessRequest(selectedRequest.id, 'review')}
                                    style={{ borderRadius: '8px', borderColor: '#5FA145', color: '#5FA145' }}
                                >
                                    <i className="bi bi-search me-2"></i>
                                    Mettre en examen
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => handleProcessRequest(selectedRequest.id, 'approve')}
                                    style={{ borderRadius: '8px' }}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Approuver
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </DashboardLayout>
    );
}