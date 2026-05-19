import React, { useState } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Dropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin-layout';
import { useTranslation } from '../../hooks/useTranslation';

interface Content {
    id: string;
    title: string;
    type: 'article' | 'page' | 'event' | 'announcement';
    status: 'published' | 'draft' | 'review' | 'archived';
    author: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    featured: boolean;
}

interface AdminContentProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    contents?: Content[];
}

export default function AdminContent({ user }: AdminContentProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showContentModal, setShowContentModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Données d'exemple
    const contentsData: Content[] = [
        {
            id: '1',
            title: 'Lancement du nouveau programme d\'entrepreneuriat social',
            type: 'article',
            status: 'published',
            author: 'Marie Dubois',
            category: 'Programmes',
            createdAt: '2024-12-15',
            updatedAt: '2024-12-15',
            views: 1250,
            featured: true
        },
        {
            id: '2',
            title: 'Conférence Impact Social 2025',
            type: 'event',
            status: 'published',
            author: 'Jean-Claude Kamgang',
            category: 'Événements',
            createdAt: '2024-12-10',
            updatedAt: '2024-12-12',
            views: 850,
            featured: false
        },
        {
            id: '3',
            title: 'Guide des bonnes pratiques environnementales',
            type: 'page',
            status: 'draft',
            author: 'Paul Njiki',
            category: 'Guides',
            createdAt: '2024-12-18',
            updatedAt: '2024-12-19',
            views: 45,
            featured: false
        },
        {
            id: '4',
            title: 'Résultats du concours Innovation Tech',
            type: 'announcement',
            status: 'review',
            author: 'Aminata Traoré',
            category: 'Concours',
            createdAt: '2024-12-20',
            updatedAt: '2024-12-20',
            views: 320,
            featured: true
        },
        {
            id: '5',
            title: 'Histoire et mission de la TITI EVENTS',
            type: 'page',
            status: 'archived',
            author: 'Sarah Martin',
            category: 'Institutionnel',
            createdAt: '2024-01-15',
            updatedAt: '2024-06-10',
            views: 2850,
            featured: false
        }
    ];

    const getStatusColor = (status: Content['status']) => {
        switch (status) {
            case 'published': return '#10B981';
            case 'draft': return '#6B7280';
            case 'review': return '#F59E0B';
            case 'archived': return '#9CA3AF';
            default: return '#6B7280';
        }
    };

    const getStatusLabel = (status: Content['status']) => {
        switch (status) {
            case 'published': return 'Publié';
            case 'draft': return 'Brouillon';
            case 'review': return 'En révision';
            case 'archived': return 'Archivé';
            default: return status;
        }
    };

    const getTypeColor = (type: Content['type']) => {
        switch (type) {
            case 'article': return '#5FA145';
            case 'page': return '#4D8A3C';
            case 'event': return '#C69438';
            case 'announcement': return '#C69438';
            default: return '#6B7280';
        }
    };

    const getTypeLabel = (type: Content['type']) => {
        switch (type) {
            case 'article': return 'Article';
            case 'page': return 'Page';
            case 'event': return 'Événement';
            case 'announcement': return 'Annonce';
            default: return type;
        }
    };

    const getTypeIcon = (type: Content['type']) => {
        switch (type) {
            case 'article': return 'bi-newspaper';
            case 'page': return 'bi-file-earmark';
            case 'event': return 'bi-calendar-event';
            case 'announcement': return 'bi-megaphone';
            default: return 'bi-file-text';
        }
    };

    const filteredContents = contentsData.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            content.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
        const matchesType = typeFilter === 'all' || content.type === typeFilter;
        const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });

    const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContents = filteredContents.slice(startIndex, startIndex + itemsPerPage);

    const handleContentAction = (content: Content, action: string) => {
        console.log(`Action ${action} sur le contenu:`, content);
        // Ici vous intégreriez avec votre API
    };

    const ContentModal = () => (
        <Modal show={showContentModal} onHide={() => setShowContentModal(false)} size="lg" centered>
            <Modal.Header closeButton style={{ borderBottom: '1px solid #F3F4F6' }}>
                <Modal.Title className="fw-bold" style={{ color: '#1F2937' }}>
                    <i className={`${getTypeIcon(selectedContent?.type || 'article')} me-2`} style={{ color: '#5FA145' }}></i>
                    Détails du contenu
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedContent && (
                    <Tabs defaultActiveKey="details" className="mb-3">
                        <Tab eventKey="details" title="Détails">
                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                    Titre
                                </label>
                                <div className="form-control-plaintext fw-semibold">
                                    {selectedContent.title}
                                    {selectedContent.featured && (
                                        <Badge className="ms-2" style={{ backgroundColor: '#C69438' }}>
                                            <i className="bi bi-star me-1"></i>
                                            À la une
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Type
                                        </label>
                                        <div>
                                            <Badge 
                                                style={{ 
                                                    backgroundColor: `${getTypeColor(selectedContent.type)}20`,
                                                    color: getTypeColor(selectedContent.type),
                                                    border: `1px solid ${getTypeColor(selectedContent.type)}30`
                                                }}
                                            >
                                                <i className={`${getTypeIcon(selectedContent.type)} me-1`}></i>
                                                {getTypeLabel(selectedContent.type)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Status
                                        </label>
                                        <div>
                                            <Badge style={{ backgroundColor: getStatusColor(selectedContent.status) }}>
                                                {getStatusLabel(selectedContent.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Auteur
                                        </label>
                                        <div className="form-control-plaintext">
                                            {selectedContent.author}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Catégorie
                                        </label>
                                        <div className="form-control-plaintext">
                                            {selectedContent.category}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Date de création
                                        </label>
                                        <div className="form-control-plaintext">
                                            {new Date(selectedContent.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Dernière modification
                                        </label>
                                        <div className="form-control-plaintext">
                                            {new Date(selectedContent.updatedAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                    Nombre de vues
                                </label>
                                <div className="form-control-plaintext">
                                    <span className="fw-bold" style={{ color: '#5FA145' }}>
                                        {selectedContent.views.toLocaleString()}
                                    </span> vues
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="preview" title="Aperçu">
                            <div className="text-center py-4">
                                <i className="bi bi-eye" style={{ fontSize: '3rem', color: '#D1D5DB' }}></i>
                                <p className="mt-3 text-muted">Aperçu du contenu</p>
                                <small className="text-muted">Fonctionnalité à implémenter</small>
                            </div>
                        </Tab>
                        <Tab eventKey="analytics" title="Statistiques">
                            <div className="text-center py-4">
                                <i className="bi bi-graph-up" style={{ fontSize: '3rem', color: '#D1D5DB' }}></i>
                                <p className="mt-3 text-muted">Statistiques de performance</p>
                                <small className="text-muted">Fonctionnalité à implémenter</small>
                            </div>
                        </Tab>
                    </Tabs>
                )}
            </Modal.Body>
            <Modal.Footer style={{ borderTop: '1px solid #F3F4F6' }}>
                <Button variant="outline-secondary" onClick={() => setShowContentModal(false)}>
                    Fermer
                </Button>
                <Button 
                    variant="outline-primary"
                    style={{ 
                        borderColor: '#C69438',
                        color: '#C69438'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#C69438';
                        e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#C69438';
                    }}
                    onClick={() => {
                        console.log('Prévisualiser contenu:', selectedContent);
                        setShowContentModal(false);
                    }}
                >
                    Prévisualiser
                </Button>
                <Button 
                    style={{ 
                        backgroundColor: '#5FA145',
                        borderColor: '#5FA145'
                    }}
                    onClick={() => {
                        console.log('Modifier contenu:', selectedContent);
                        setShowContentModal(false);
                    }}
                >
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <AdminLayout title={t('contentManagement', 'Gestion du Contenu')} user={user}>
            {/* En-tête avec statistiques */}
            <Row className="mb-4">
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-file-text-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {contentsData.length}
                                    </h3>
                                    <p className="text-muted mb-0 small">Total Contenus</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {contentsData.filter(c => c.status === 'published').length}
                                    </h3>
                                    <p className="text-muted mb-0 small">Publiés</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-pencil-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {contentsData.filter(c => c.status === 'draft' || c.status === 'review').length}
                                    </h3>
                                    <p className="text-muted mb-0 small">Brouillons</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #C69438 0%, #B8832F 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-eye-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {contentsData.reduce((total, content) => total + content.views, 0).toLocaleString()}
                                    </h3>
                                    <p className="text-muted mb-0 small">Vues Total</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Table des contenus */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <Card.Header className="bg-white border-0 px-4 py-3" style={{ borderRadius: '16px 16px 0 0' }}>
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                <i className="bi bi-folder me-2" style={{ color: '#5FA145' }}></i>
                                Bibliothèque de Contenus
                            </h5>
                        </Col>
                        <Col xs="auto">
                            <div className="d-flex gap-2">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="outline-secondary"
                                        size="sm"
                                        id="dropdown-content-type"
                                    >
                                        <i className="bi bi-plus me-2"></i>
                                        Nouveau
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <i className="bi bi-newspaper me-2"></i>
                                            Article
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <i className="bi bi-file-earmark me-2"></i>
                                            Page
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <i className="bi bi-calendar-event me-2"></i>
                                            Événement
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <i className="bi bi-megaphone me-2"></i>
                                            Annonce
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button 
                                    size="sm"
                                    variant="outline-primary"
                                    style={{ 
                                        borderColor: '#C69438',
                                        color: '#C69438'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#C69438';
                                        e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#C69438';
                                    }}
                                >
                                    <i className="bi bi-upload me-2"></i>
                                    Importer
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="px-0 py-0">
                    {/* Filtres */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <Row className="align-items-center">
                            <Col lg={3} md={6} sm={12} className="mb-3 mb-lg-0">
                                <InputGroup>
                                    <InputGroup.Text style={{ backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB' }}>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ border: '1px solid #D1D5DB' }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={2} md={6} sm={12} className="mb-3 mb-lg-0">
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ border: '1px solid #D1D5DB' }}
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="published">Publié</option>
                                    <option value="draft">Brouillon</option>
                                    <option value="review">En révision</option>
                                    <option value="archived">Archivé</option>
                                </Form.Select>
                            </Col>
                            <Col lg={2} md={6} sm={12} className="mb-3 mb-lg-0">
                                <Form.Select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    style={{ border: '1px solid #D1D5DB' }}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="article">Article</option>
                                    <option value="page">Page</option>
                                    <option value="event">Événement</option>
                                    <option value="announcement">Annonce</option>
                                </Form.Select>
                            </Col>
                            <Col lg={2} md={6} sm={12} className="mb-3 mb-lg-0">
                                <Form.Select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    style={{ border: '1px solid #D1D5DB' }}
                                >
                                    <option value="all">Toutes les catégories</option>
                                    <option value="Programmes">Programmes</option>
                                    <option value="Événements">Événements</option>
                                    <option value="Guides">Guides</option>
                                    <option value="Concours">Concours</option>
                                    <option value="Institutionnel">Institutionnel</option>
                                </Form.Select>
                            </Col>
                            <Col lg={3} md={6} sm={12}>
                                <div className="text-muted small">
                                    {filteredContents.length} résultat(s)
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <Table className="mb-0" style={{ fontSize: '0.9rem' }}>
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Contenu
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Type
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Status
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Auteur
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Vues
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Modifié
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedContents.map((content, index) => (
                                    <tr key={content.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded d-flex align-items-center justify-content-center me-3"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: `${getTypeColor(content.type)}20`,
                                                        color: getTypeColor(content.type)
                                                    }}
                                                >
                                                    <i className={getTypeIcon(content.type)}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                        {content.title}
                                                        {content.featured && (
                                                            <i className="bi bi-star-fill ms-2" style={{ color: '#C69438', fontSize: '0.8rem' }}></i>
                                                        )}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {content.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge 
                                                style={{ 
                                                    backgroundColor: `${getTypeColor(content.type)}20`,
                                                    color: getTypeColor(content.type),
                                                    border: `1px solid ${getTypeColor(content.type)}30`
                                                }}
                                            >
                                                {getTypeLabel(content.type)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge style={{ backgroundColor: getStatusColor(content.status) }}>
                                                {getStatusLabel(content.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {content.author}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-eye me-1 text-muted" style={{ fontSize: '0.8rem' }}></i>
                                                <span className="fw-medium" style={{ color: '#5FA145' }}>
                                                    {content.views.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {new Date(content.updatedAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="border-0"
                                                    style={{ backgroundColor: 'transparent' }}
                                                >
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            setSelectedContent(content);
                                                            setShowContentModal(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-eye me-2"></i>
                                                        Voir détails
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleContentAction(content, 'edit')}>
                                                        <i className="bi bi-pencil me-2"></i>
                                                        Modifier
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleContentAction(content, 'preview')}>
                                                        <i className="bi bi-eye-slash me-2"></i>
                                                        Prévisualiser
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleContentAction(content, 'duplicate')}>
                                                        <i className="bi bi-copy me-2"></i>
                                                        Dupliquer
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    {content.status === 'published' ? (
                                                        <Dropdown.Item 
                                                            className="text-warning"
                                                            onClick={() => handleContentAction(content, 'unpublish')}
                                                        >
                                                            <i className="bi bi-archive me-2"></i>
                                                            Dépublier
                                                        </Dropdown.Item>
                                                    ) : (
                                                        <Dropdown.Item 
                                                            className="text-success"
                                                            onClick={() => handleContentAction(content, 'publish')}
                                                        >
                                                            <i className="bi bi-check-circle me-2"></i>
                                                            Publier
                                                        </Dropdown.Item>
                                                    )}
                                                    <Dropdown.Item 
                                                        className="text-danger"
                                                        onClick={() => handleContentAction(content, 'delete')}
                                                    >
                                                        <i className="bi bi-trash me-2"></i>
                                                        Supprimer
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid #F3F4F6' }}>
                            <div className="text-muted small">
                                Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredContents.length)} sur {filteredContents.length} résultats
                            </div>
                            <div className="d-flex gap-1">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "primary" : "outline-secondary"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        style={page === currentPage ? {
                                            backgroundColor: '#5FA145',
                                            borderColor: '#5FA145'
                                        } : {}}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <ContentModal />
        </AdminLayout>
    );
}