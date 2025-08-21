import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    category: string;
    category_display: string;
    status: string;
    status_display: string;
    image?: string;
    price: number;
    formatted_price: string;
    is_free: boolean;
    capacity?: number;
    tickets_sold: number;
    available_tickets: number;
    total_revenue: number;
    created_at: string;
    creator_name: string;
    is_active: boolean;
    is_ongoing: boolean;
    is_completed: boolean;
}

interface EventsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    events: {
        data: Event[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: Array<{
        title: string;
        value: string | number;
        change: string;
        positive: boolean;
        color: string;
        icon: string;
    }>;
    recentEvents: any[];
    eventsByCategory: any;
    status: string;
    filters: any;
}

export default function Events({ user, events, stats, recentEvents, eventsByCategory, status, filters }: EventsProps) {
    const { t } = useTranslation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'calendar'

    // Utiliser les événements passés en props
    const eventsData = events?.data || [];

    const getStatusBadge = (status: string, statusDisplay: string) => {
        const variants: any = {
            'published': 'success',
            'draft': 'secondary',
            'completed': 'info',
            'cancelled': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{statusDisplay}</Badge>;
    };

    const getCategoryBadge = (category: string, categoryDisplay: string) => {
        const colors: any = {
            'conference': 'primary',
            'workshop': 'success',
            'seminar': 'info',
            'networking': 'warning',
            'training': 'secondary',
            'webinar': 'dark',
            'meetup': 'light'
        };
        return <Badge bg={colors[category] || 'secondary'}>{categoryDisplay}</Badge>;
    };

    const getOccupancyPercentage = (ticketsSold: number, capacity: number) => {
        if (!capacity) return 0;
        return Math.round((ticketsSold / capacity) * 100);
    };

    // Le contrôleur fournit déjà les dates formatées
    const parseFormattedDate = (formattedDate: string) => {
        // Format: "25/08/2024 14:00"
        const [datePart, timePart] = formattedDate.split(' ');
        return { date: datePart, time: timePart };
    };

    const handleCreateEvent = () => {
        setShowCreateModal(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setShowEditModal(true);
    };

    const handleViewEvent = (eventId: number) => {
        router.get(`/dashboard/events/${eventId}`);
    };

    const handleDeleteEvent = (eventId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            router.delete(`/dashboard/events/${eventId}`);
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        
        // Conversion des données
        data.is_free = data.is_free === 'on';
        data.requires_approval = data.requires_approval === 'on';
        
        router.post('/dashboard/events', data, {
            onSuccess: () => {
                setShowCreateModal(false);
            }
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        
        // Conversion des données
        data.is_free = data.is_free === 'on';
        data.requires_approval = data.requires_approval === 'on';
        data._method = 'PUT';
        
        router.post(`/dashboard/events/${editingEvent?.id}`, data, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingEvent(null);
            }
        });
    };

    return (
        <DashboardLayout title="Gestion des Événements" user={user}>
            <div className="events-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                Gestion des Événements
                            </h2>
                            <p className="text-muted mb-0">
                                Organisez et gérez tous vos événements
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <div className="btn-group" role="group">
                                <Button 
                                    variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <i className="bi bi-grid-3x3"></i>
                                </Button>
                                <Button 
                                    variant={viewMode === 'calendar' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setViewMode('calendar')}
                                >
                                    <i className="bi bi-calendar3"></i>
                                </Button>
                            </div>
                            <Button 
                                style={{
                                    backgroundColor: '#5FA145',
                                    borderColor: '#5FA145'
                                }}
                                onClick={handleCreateEvent}
                            >
                                <i className="bi bi-calendar-plus me-2"></i>
                                Créer un événement
                            </Button>
                        </div>
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

                {/* Filters */}
                <Card className="mb-4 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-4">
                        <Row className="align-items-center">
                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Rechercher un événement..."
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={2}>
                                <Form.Select>
                                    <option value="">Toutes catégories</option>
                                    <option value="solidarite">Solidarité</option>
                                    <option value="levee-fonds">Levée de fonds</option>
                                    <option value="formation">Formation</option>
                                    <option value="education">Éducation</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select>
                                    <option value="">Tous statuts</option>
                                    <option value="actif">Actifs</option>
                                    <option value="programme">Programmés</option>
                                    <option value="brouillon">Brouillons</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Control type="date" />
                            </Col>
                            <Col md={2}>
                                <Button variant="outline-secondary" className="w-100">
                                    <i className="bi bi-funnel me-2"></i>
                                    Filtres
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Events Grid/Calendar */}
                {viewMode === 'grid' ? (
                    <Row className="g-4">
                        {eventsData.map((event) => (
                            <Col lg={6} key={event.id}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                                    {event.title}
                                                </h5>
                                                <p className="text-muted mb-2 small">
                                                    {event.description}
                                                </p>
                                            </div>
                                            <div className="d-flex gap-2">
                                                {getStatusBadge(event.status, event.status_display)}
                                                {getCategoryBadge(event.category, event.category_display)}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-calendar3 me-2 text-muted"></i>
                                                <span className="small">
                                                    Début: {event.start_date}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-calendar-x me-2 text-muted"></i>
                                                <span className="small">
                                                    Fin: {event.end_date}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-geo-alt me-2 text-muted"></i>
                                                <span className="small">{event.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-person me-2 text-muted"></i>
                                                <span className="small">Créé par {event.creator_name}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-currency-euro me-2 text-muted"></i>
                                                <span className="small">{event.formatted_price}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="small text-muted">Billets vendus</span>
                                                <span className="small fw-medium">
                                                    {event.tickets_sold}/{event.capacity || 'Illimité'} places
                                                </span>
                                            </div>
                                            {event.capacity && (
                                                <div className="progress" style={{ height: '6px' }}>
                                                    <div 
                                                        className="progress-bar bg-success"
                                                        style={{ width: `${getOccupancyPercentage(event.tickets_sold, event.capacity)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                            {event.capacity && (
                                                <div className="small text-muted mt-1">
                                                    {getOccupancyPercentage(event.tickets_sold, event.capacity)}% de taux d'occupation
                                                </div>
                                            )}
                                            {event.total_revenue > 0 && (
                                                <div className="small fw-medium text-success mt-2">
                                                    Revenus: {event.total_revenue.toLocaleString()} XAF
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="flex-fill"
                                                onClick={() => handleViewEvent(event.id)}
                                            >
                                                <i className="bi bi-eye me-2"></i>
                                                Voir détails
                                            </Button>
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                className="flex-fill"
                                                onClick={() => handleEditEvent(event)}
                                            >
                                                <i className="bi bi-pencil me-2"></i>
                                                Modifier
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Body className="p-4 text-center" style={{ minHeight: '400px' }}>
                            <i className="bi bi-calendar3 mb-3" style={{ fontSize: '3rem', color: '#5FA145' }}></i>
                            <h4 className="fw-bold mb-3" style={{ color: '#1F2937' }}>
                                Vue Calendrier
                            </h4>
                            <p className="text-muted mb-4">
                                La vue calendrier sera disponible prochainement pour une meilleure visualisation de vos événements.
                            </p>
                            <Button variant="outline-primary" onClick={() => setViewMode('grid')}>
                                Retour à la vue grille
                            </Button>
                        </Card.Body>
                    </Card>
                )}

                {/* Create Event Modal */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Créer un nouvel événement</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleCreateSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titre de l'événement *</Form.Label>
                                        <Form.Control 
                                            name="title"
                                            type="text" 
                                            placeholder="Ex: Conférence Innovation Tech" 
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Catégorie *</Form.Label>
                                        <Form.Select name="category" required>
                                            <option value="">Choisir une catégorie</option>
                                            <option value="conference">Conférence</option>
                                            <option value="workshop">Atelier</option>
                                            <option value="seminar">Séminaire</option>
                                            <option value="networking">Networking</option>
                                            <option value="training">Formation</option>
                                            <option value="webinar">Webinaire</option>
                                            <option value="meetup">Meetup</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Description *</Form.Label>
                                <Form.Control 
                                    name="description"
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Description complète de l'événement..."
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description courte</Form.Label>
                                <Form.Control 
                                    name="short_description"
                                    type="text" 
                                    placeholder="Résumé court pour les cartes..."
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date de début *</Form.Label>
                                        <Form.Control 
                                            name="start_date"
                                            type="datetime-local" 
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date de fin *</Form.Label>
                                        <Form.Control 
                                            name="end_date"
                                            type="datetime-local" 
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Lieu *</Form.Label>
                                        <Form.Control 
                                            name="location"
                                            type="text" 
                                            placeholder="Nom du lieu"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Adresse complète</Form.Label>
                                        <Form.Control 
                                            name="address"
                                            type="text" 
                                            placeholder="Adresse complète du lieu"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Capacité</Form.Label>
                                        <Form.Control 
                                            name="capacity"
                                            type="number" 
                                            placeholder="Nombre de places"
                                            min="1"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Prix (XAF) *</Form.Label>
                                        <Form.Control 
                                            name="price"
                                            type="number" 
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <div className="mt-4">
                                            <Form.Check 
                                                name="is_free"
                                                type="checkbox" 
                                                label="Événement gratuit"
                                            />
                                            <Form.Check 
                                                name="requires_approval"
                                                type="checkbox" 
                                                label="Approbation requise"
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
                                Annuler
                            </Button>
                            <Button 
                                type="submit"
                                style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                            >
                                Créer l'événement
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* Edit Event Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Modifier l'événement</Modal.Title>
                    </Modal.Header>
                    {editingEvent && (
                        <Form onSubmit={handleEditSubmit}>
                            <Modal.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Titre de l'événement *</Form.Label>
                                            <Form.Control 
                                                name="title"
                                                type="text" 
                                                defaultValue={editingEvent.title}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Catégorie *</Form.Label>
                                            <Form.Select name="category" defaultValue={editingEvent.category} required>
                                                <option value="">Choisir une catégorie</option>
                                                <option value="conference">Conférence</option>
                                                <option value="workshop">Atelier</option>
                                                <option value="seminar">Séminaire</option>
                                                <option value="networking">Networking</option>
                                                <option value="training">Formation</option>
                                                <option value="webinar">Webinaire</option>
                                                <option value="meetup">Meetup</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control 
                                        name="description"
                                        as="textarea" 
                                        rows={3} 
                                        defaultValue={editingEvent.description}
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Lieu *</Form.Label>
                                            <Form.Control 
                                                name="location"
                                                type="text" 
                                                defaultValue={editingEvent.location}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prix (XAF) *</Form.Label>
                                            <Form.Control 
                                                name="price"
                                                type="number" 
                                                defaultValue={editingEvent.price}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Capacité</Form.Label>
                                            <Form.Control 
                                                name="capacity"
                                                type="number" 
                                                defaultValue={editingEvent.capacity || ''}
                                                min="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mt-4">
                                            <Form.Check 
                                                name="is_free"
                                                type="checkbox" 
                                                label="Événement gratuit"
                                                defaultChecked={editingEvent.is_free}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                                    Annuler
                                </Button>
                                <Button 
                                    type="submit"
                                    style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                                >
                                    Sauvegarder
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Modal>
            </div>
        </DashboardLayout>
    );
}