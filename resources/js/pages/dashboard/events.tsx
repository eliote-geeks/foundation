import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Form, InputGroup, Modal, Calendar } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface EventsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Events({ user }: EventsProps) {
    const { t } = useTranslation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'calendar'

    const stats = [
        {
            title: 'Événements actifs',
            value: '24',
            change: '+8%',
            positive: true,
            color: '#5FA145',
            icon: 'bi-calendar-check'
        },
        {
            title: 'Participants inscrits',
            value: '1,847',
            change: '+25%',
            positive: true,
            color: '#667eea',
            icon: 'bi-people'
        },
        {
            title: 'Revenus générés',
            value: '5.530.000 FCFA',
            change: '+12%',
            positive: true,
            color: '#E4518C',
            icon: 'bi-currency-euro'
        },
        {
            title: 'Événements ce mois',
            value: '8',
            change: '+3',
            positive: true,
            color: '#C69438',
            icon: 'bi-calendar-event'
        }
    ];

    const events = [
        {
            id: 1,
            title: 'Collecte Alimentaire',
            description: 'Grande collecte pour les familles dans le besoin',
            date: '2024-08-25',
            time: '14:00',
            location: 'Centre-ville',
            category: 'Solidarité',
            status: 'Actif',
            participants: 127,
            capacity: 200,
            price: 'Gratuit',
            organizer: 'Marie Dubois'
        },
        {
            id: 2,
            title: 'Gala de Charité',
            description: 'Soirée de levée de fonds pour nos projets',
            date: '2024-08-30',
            time: '19:00',
            location: 'Hôtel de ville',
            category: 'Levée de fonds',
            status: 'Actif',
            participants: 85,
            capacity: 150,
            price: '32.500 FCFA',
            organizer: 'Jean Mbong'
        },
        {
            id: 3,
            title: 'Formation Bénévoles',
            description: 'Session de formation pour nouveaux bénévoles',
            date: '2024-09-05',
            time: '10:00',
            location: 'Siège social',
            category: 'Formation',
            status: 'Programmé',
            participants: 23,
            capacity: 30,
            price: 'Gratuit',
            organizer: 'Sophie Martin'
        },
        {
            id: 4,
            title: 'Conférence Impact Social',
            description: 'Conférence sur l\'impact social des associations',
            date: '2024-09-12',
            time: '09:00',
            location: 'Université locale',
            category: 'Éducation',
            status: 'Brouillon',
            participants: 0,
            capacity: 300,
            price: '16.350 FCFA',
            organizer: 'Paul Nguyen'
        }
    ];

    const getStatusBadge = (status: string) => {
        const variants: any = {
            'Actif': 'success',
            'Programmé': 'warning',
            'Brouillon': 'secondary',
            'Terminé': 'info',
            'Annulé': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getCategoryBadge = (category: string) => {
        const colors: any = {
            'Solidarité': 'primary',
            'Levée de fonds': 'success',
            'Formation': 'info',
            'Éducation': 'warning'
        };
        return <Badge bg={colors[category] || 'secondary'}>{category}</Badge>;
    };

    const getOccupancyPercentage = (participants: number, capacity: number) => {
        return Math.round((participants / capacity) * 100);
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
                                onClick={() => setShowCreateModal(true)}
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
                        {events.map((event) => (
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
                                                {getStatusBadge(event.status)}
                                                {getCategoryBadge(event.category)}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-calendar3 me-2 text-muted"></i>
                                                <span className="small">
                                                    {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-geo-alt me-2 text-muted"></i>
                                                <span className="small">{event.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-person me-2 text-muted"></i>
                                                <span className="small">Organisé par {event.organizer}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-currency-euro me-2 text-muted"></i>
                                                <span className="small">{event.price}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="small text-muted">Participation</span>
                                                <span className="small fw-medium">
                                                    {event.participants}/{event.capacity} places
                                                </span>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div 
                                                    className="progress-bar bg-success"
                                                    style={{ width: `${getOccupancyPercentage(event.participants, event.capacity)}%` }}
                                                ></div>
                                            </div>
                                            <div className="small text-muted mt-1">
                                                {getOccupancyPercentage(event.participants, event.capacity)}% de taux d'occupation
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
                                                <i className="bi bi-three-dots-vertical"></i>
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
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titre de l'événement</Form.Label>
                                        <Form.Control type="text" placeholder="Ex: Collecte alimentaire" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Catégorie</Form.Label>
                                        <Form.Select>
                                            <option value="">Choisir une catégorie</option>
                                            <option value="solidarite">Solidarité</option>
                                            <option value="levee-fonds">Levée de fonds</option>
                                            <option value="formation">Formation</option>
                                            <option value="education">Éducation</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Description de l'événement..." />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Heure</Form.Label>
                                        <Form.Control type="time" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Lieu</Form.Label>
                                <Form.Control type="text" placeholder="Lieu de l'événement" />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Capacité</Form.Label>
                                        <Form.Control type="number" placeholder="Nombre de places" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Prix</Form.Label>
                                        <Form.Control type="text" placeholder="Ex: Gratuit, 16.350 FCFA" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
                            Annuler
                        </Button>
                        <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                            Créer l'événement
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}