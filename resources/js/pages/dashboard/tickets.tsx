import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Ticket {
    id: number;
    ticket_number: string;
    event_title: string;
    event_date: string;
    attendee_name: string;
    attendee_email: string;
    attendee_phone: string;
    ticket_type: string;
    price_paid: number;
    currency: string;
    status: string;
    payment_status: string;
    payment_method: string;
    purchased_at?: string;
    checked_in_at?: string;
    can_checkin: boolean;
}

interface Event {
    id: number;
    title: string;
    date: string;
}

interface TicketsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    tickets: {
        data: Ticket[];
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
    events: Event[];
    filters: any;
}

export default function Tickets({ user, tickets, stats, events, filters }: TicketsProps) {
    const { t } = useTranslation();
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const ticketsData = tickets?.data || [];

    const getStatusBadge = (status: string) => {
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

    const getPaymentStatusBadge = (status: string) => {
        const variants: any = {
            'paid': 'success',
            'pending': 'warning',
            'failed': 'danger'
        };
        const labels: any = {
            'paid': 'Payé',
            'pending': 'En attente',
            'failed': 'Échoué'
        };
        return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    const getTicketTypeBadge = (type: string) => {
        const colors: any = {
            'standard': 'primary',
            'vip': 'warning',
            'premium': 'info',
            'student': 'success'
        };
        const labels: any = {
            'standard': 'Standard',
            'vip': 'VIP',
            'premium': 'Premium',
            'student': 'Étudiant'
        };
        return <Badge bg={colors[type] || 'secondary'}>{labels[type] || type}</Badge>;
    };

    const handleCheckin = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowCheckinModal(true);
    };

    const confirmCheckin = () => {
        if (selectedTicket) {
            router.post(`/dashboard/events/${selectedTicket.id}/checkin`, {
                ticket_number: selectedTicket.ticket_number
            });
            setShowCheckinModal(false);
            setSelectedTicket(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const searchParams = new URLSearchParams();
        
        for (const [key, value] of formData.entries()) {
            if (value) {
                searchParams.set(key, value.toString());
            }
        }
        
        router.get('/dashboard/events/tickets', Object.fromEntries(searchParams));
    };

    return (
        <DashboardLayout title="Gestion des Billets" user={user}>
            <div className="tickets-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                Gestion des Billets
                            </h2>
                            <p className="text-muted mb-0">
                                Gérez tous les billets et effectuez les check-ins
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-primary"
                                onClick={() => router.get('/dashboard/events')}
                            >
                                <i className="bi bi-calendar-event me-2"></i>
                                Retour aux événements
                            </Button>
                            <Button 
                                style={{
                                    backgroundColor: '#5FA145',
                                    borderColor: '#5FA145'
                                }}
                                onClick={() => router.get('/dashboard/events/export')}
                            >
                                <i className="bi bi-download me-2"></i>
                                Exporter
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
                        <Form onSubmit={handleSearch}>
                            <Row className="align-items-end">
                                <Col md={3}>
                                    <Form.Label>Rechercher</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <i className="bi bi-search"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            name="search"
                                            type="text"
                                            placeholder="N° billet, nom, email..."
                                            defaultValue={filters?.search}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={2}>
                                    <Form.Label>Événement</Form.Label>
                                    <Form.Select name="event" defaultValue={filters?.event}>
                                        <option value="">Tous les événements</option>
                                        {events.map(event => (
                                            <option key={event.id} value={event.id}>
                                                {event.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Form.Label>Statut</Form.Label>
                                    <Form.Select name="status" defaultValue={filters?.status}>
                                        <option value="">Tous les statuts</option>
                                        <option value="confirmed">Confirmé</option>
                                        <option value="pending">En attente</option>
                                        <option value="cancelled">Annulé</option>
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Button type="submit" variant="primary" className="w-100">
                                        <i className="bi bi-funnel me-2"></i>
                                        Filtrer
                                    </Button>
                                </Col>
                                <Col md={3} className="text-end">
                                    <small className="text-muted">
                                        {tickets.total} billets au total
                                    </small>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Tickets Table */}
                <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 fw-semibold text-muted py-3 px-4">N° Billet</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Événement</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Participant</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Type</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Prix</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Statut</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Check-in</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketsData.length > 0 ? (
                                        ticketsData.map((ticket) => (
                                            <tr key={ticket.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                            {ticket.ticket_number}
                                                        </div>
                                                        <small className="text-muted">
                                                            {ticket.purchased_at}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div>
                                                        <div className="fw-medium">{ticket.event_title}</div>
                                                        <small className="text-muted">{ticket.event_date}</small>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div>
                                                        <div className="fw-medium">{ticket.attendee_name}</div>
                                                        <small className="text-muted">{ticket.attendee_email}</small>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    {getTicketTypeBadge(ticket.ticket_type)}
                                                </td>
                                                <td className="py-3">
                                                    <div>
                                                        <span className="fw-medium">
                                                            {ticket.price_paid.toLocaleString()} {ticket.currency}
                                                        </span>
                                                        <div>
                                                            {getPaymentStatusBadge(ticket.payment_status)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    {getStatusBadge(ticket.status)}
                                                </td>
                                                <td className="py-3">
                                                    {ticket.checked_in_at ? (
                                                        <div className="text-success">
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            <small>{ticket.checked_in_at}</small>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">
                                                            <i className="bi bi-clock me-1"></i>
                                                            Non effectué
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex gap-1">
                                                        {ticket.can_checkin && (
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() => handleCheckin(ticket)}
                                                            >
                                                                <i className="bi bi-check-circle"></i>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                        >
                                                            <i className="bi bi-printer"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-ticket-perforated mb-3" style={{ fontSize: '3rem' }}></i>
                                                    <h5 className="fw-bold mb-2">Aucun billet trouvé</h5>
                                                    <p className="mb-0">Aucun billet ne correspond aux critères de recherche.</p>
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
                        <Modal.Title>Confirmer le check-in</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedTicket && (
                            <div>
                                <p><strong>Billet :</strong> {selectedTicket.ticket_number}</p>
                                <p><strong>Participant :</strong> {selectedTicket.attendee_name}</p>
                                <p><strong>Événement :</strong> {selectedTicket.event_title}</p>
                                <p><strong>Date :</strong> {selectedTicket.event_date}</p>
                                
                                <div className="alert alert-info">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Confirmer le check-in pour ce participant ?
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowCheckinModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="success" onClick={confirmCheckin}>
                            <i className="bi bi-check-circle me-2"></i>
                            Confirmer le check-in
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}