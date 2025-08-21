import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface EventDetail {
    id: number;
    title: string;
    description: string;
    short_description?: string;
    location: string;
    address?: string;
    start_date: string;
    end_date: string;
    category: string;
    category_display: string;
    status: string;
    status_display: string;
    image?: string;
    gallery?: string[];
    price: number;
    formatted_price: string;
    is_free: boolean;
    capacity?: number;
    tickets_sold: number;
    available_tickets: number;
    total_revenue: number;
    requires_approval: boolean;
    contact_info?: any;
    speakers?: any[];
    agenda?: any[];
    created_at: string;
    creator_name: string;
    is_active: boolean;
    is_ongoing: boolean;
    is_completed: boolean;
}

interface Ticket {
    id: number;
    ticket_number: string;
    attendee_name: string;
    attendee_email: string;
    ticket_type: string;
    price_paid: number;
    status: string;
    payment_status: string;
    purchased_at: string;
    checked_in_at?: string;
}

interface EventDetailProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    event: EventDetail;
    tickets: Ticket[];
    ticketStats: {
        total: number;
        confirmed: number;
        checked_in: number;
        revenue: number;
    };
    recentTickets: Ticket[];
}

export default function EventDetail({ user, event, tickets, ticketStats, recentTickets }: EventDetailProps) {
    const { t } = useTranslation();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [checkinTicket, setCheckinTicket] = useState('');
    const [alert, setAlert] = useState<{type: 'success' | 'danger', message: string} | null>(null);

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

    const getTicketStatusBadge = (status: string) => {
        const variants: any = {
            'confirmed': 'success',
            'pending': 'warning',
            'cancelled': 'danger'
        };
        const labels: any = {
            'confirmed': 'Confirmé',
            'pending': 'En attente',
            'cancelled': 'Annulé'
        };
        return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    const handleToggleStatus = () => {
        router.post(`/dashboard/events/${event.id}/toggle-status`, {}, {
            onSuccess: () => {
                setAlert({type: 'success', message: 'Statut mis à jour avec succès'});
            },
            onError: () => {
                setAlert({type: 'danger', message: 'Erreur lors de la mise à jour du statut'});
            }
        });
    };

    const handleCheckin = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/dashboard/events/${event.id}/checkin`, { 
            ticket_number: checkinTicket 
        }, {
            onSuccess: () => {
                setShowCheckinModal(false);
                setCheckinTicket('');
                setAlert({type: 'success', message: 'Check-in effectué avec succès'});
            },
            onError: () => {
                setAlert({type: 'danger', message: 'Erreur lors du check-in'});
            }
        });
    };

    const handleExport = () => {
        router.get(`/dashboard/events/export?event=${event.id}`);
    };

    return (
        <DashboardLayout title={event.title} user={user}>
            <div className="event-detail-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-decoration-none"
                                            onClick={() => router.get('/dashboard/events')}
                                        >
                                            Événements
                                        </Button>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {event.title}
                                    </li>
                                </ol>
                            </nav>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                {event.title}
                            </h2>
                            <p className="text-muted mb-0">
                                Créé par {event.creator_name} • {event.created_at}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-primary"
                                onClick={() => setShowCheckinModal(true)}
                            >
                                <i className="bi bi-person-check me-2"></i>
                                Check-in
                            </Button>
                            <Button 
                                variant="outline-secondary"
                                onClick={handleExport}
                            >
                                <i className="bi bi-download me-2"></i>
                                Exporter
                            </Button>
                            <Button 
                                variant="outline-warning"
                                onClick={handleToggleStatus}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Changer statut
                            </Button>
                            <Button 
                                style={{
                                    backgroundColor: '#5FA145',
                                    borderColor: '#5FA145'
                                }}
                                onClick={() => setShowEditModal(true)}
                            >
                                <i className="bi bi-pencil me-2"></i>
                                Modifier
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <Alert 
                        variant={alert.type} 
                        onClose={() => setAlert(null)} 
                        dismissible
                        className="mb-4"
                    >
                        {alert.message}
                    </Alert>
                )}

                {/* Event Info */}
                <Row className="mb-4">
                    <Col lg={8}>
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex gap-2">
                                        {getStatusBadge(event.status, event.status_display)}
                                        {getCategoryBadge(event.category, event.category_display)}
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold fs-4" style={{ color: '#5FA145' }}>
                                            {event.formatted_price}
                                        </div>
                                        {!event.is_free && (
                                            <small className="text-muted">Prix par billet</small>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Description</h5>
                                    <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                        {event.description}
                                    </p>
                                </div>

                                <Row>
                                    <Col md={6}>
                                        <h6 className="fw-semibold mb-3">Informations pratiques</h6>
                                        <div className="mb-2">
                                            <i className="bi bi-calendar3 me-2 text-muted"></i>
                                            <strong>Début:</strong> {event.start_date}
                                        </div>
                                        <div className="mb-2">
                                            <i className="bi bi-calendar-x me-2 text-muted"></i>
                                            <strong>Fin:</strong> {event.end_date}
                                        </div>
                                        <div className="mb-2">
                                            <i className="bi bi-geo-alt me-2 text-muted"></i>
                                            <strong>Lieu:</strong> {event.location}
                                        </div>
                                        {event.address && (
                                            <div className="mb-2">
                                                <i className="bi bi-pin-map me-2 text-muted"></i>
                                                <strong>Adresse:</strong> {event.address}
                                            </div>
                                        )}
                                        {event.capacity && (
                                            <div className="mb-2">
                                                <i className="bi bi-people me-2 text-muted"></i>
                                                <strong>Capacité:</strong> {event.capacity} places
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        {event.speakers && event.speakers.length > 0 && (
                                            <div className="mb-4">
                                                <h6 className="fw-semibold mb-3">Intervenants</h6>
                                                {event.speakers.map((speaker, index) => (
                                                    <div key={index} className="mb-2">
                                                        <div className="fw-medium">{speaker.name}</div>
                                                        <small className="text-muted">
                                                            {speaker.title} - {speaker.company}
                                                        </small>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {event.contact_info && (
                                            <div>
                                                <h6 className="fw-semibold mb-3">Contact</h6>
                                                {event.contact_info.email && (
                                                    <div className="mb-2">
                                                        <i className="bi bi-envelope me-2 text-muted"></i>
                                                        {event.contact_info.email}
                                                    </div>
                                                )}
                                                {event.contact_info.phone && (
                                                    <div className="mb-2">
                                                        <i className="bi bi-phone me-2 text-muted"></i>
                                                        {event.contact_info.phone}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                </Row>

                                {event.agenda && event.agenda.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Programme</h6>
                                        <div className="row">
                                            {event.agenda.map((item, index) => (
                                                <div key={index} className="col-md-6 mb-3">
                                                    <div className="d-flex">
                                                        <Badge bg="primary" className="me-2">{item.time}</Badge>
                                                        <div>
                                                            <div className="fw-medium">{item.title}</div>
                                                            {item.speaker && (
                                                                <small className="text-muted">{item.speaker}</small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Stats */}
                        <Card className="border-0 mb-4" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-semibold mb-3">Statistiques</h6>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Billets vendus</span>
                                        <span className="fw-bold">{event.tickets_sold}</span>
                                    </div>
                                    {event.capacity && (
                                        <div className="progress mt-1" style={{ height: '4px' }}>
                                            <div 
                                                className="progress-bar bg-success"
                                                style={{ 
                                                    width: `${Math.round((event.tickets_sold / event.capacity) * 100)}%` 
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Revenus</span>
                                        <span className="fw-bold text-success">
                                            {event.total_revenue.toLocaleString()} XAF
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Places disponibles</span>
                                        <span className="fw-bold">
                                            {event.capacity ? event.available_tickets : 'Illimité'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Check-ins</span>
                                        <span className="fw-bold">{ticketStats.checked_in}</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-semibold mb-3">Actions rapides</h6>
                                
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => router.get('/dashboard/events/tickets?event=' + event.id)}
                                    >
                                        <i className="bi bi-ticket-perforated me-2"></i>
                                        Voir tous les billets
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-success" 
                                        size="sm"
                                        onClick={() => setShowCheckinModal(true)}
                                    >
                                        <i className="bi bi-person-check me-2"></i>
                                        Check-in rapide
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={handleExport}
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Export CSV
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Tickets */}
                <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                Billets récents
                            </h5>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => router.get('/dashboard/events/tickets?event=' + event.id)}
                            >
                                Voir tout
                            </Button>
                        </div>
                        
                        <div className="table-responsive">
                            <Table className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 fw-semibold text-muted py-3">N° Billet</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Participant</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Type</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Prix</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Statut</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Acheté</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTickets.length > 0 ? (
                                        recentTickets.map((ticket) => (
                                            <tr key={ticket.id}>
                                                <td className="py-3">
                                                    <span className="font-monospace fw-medium">
                                                        {ticket.ticket_number}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <div>
                                                        <div className="fw-medium">{ticket.attendee_name}</div>
                                                        <small className="text-muted">{ticket.attendee_email}</small>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <Badge bg="primary">{ticket.ticket_type}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <span className="fw-medium">
                                                        {ticket.price_paid.toLocaleString()} XAF
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {getTicketStatusBadge(ticket.status)}
                                                </td>
                                                <td className="py-3">
                                                    <small className="text-muted">{ticket.purchased_at}</small>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-ticket-perforated mb-2" style={{ fontSize: '2rem' }}></i>
                                                    <p className="mb-0">Aucun billet vendu pour cet événement.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                {/* Check-in Modal */}
                <Modal show={showCheckinModal} onHide={() => setShowCheckinModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Check-in rapide</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleCheckin}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Numéro de billet</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: TK-ABC123DEFG"
                                    value={checkinTicket}
                                    onChange={(e) => setCheckinTicket(e.target.value)}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Scannez ou saisissez le numéro de billet
                                </Form.Text>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={() => setShowCheckinModal(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="success">
                                <i className="bi bi-check-circle me-2"></i>
                                Effectuer le check-in
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
}