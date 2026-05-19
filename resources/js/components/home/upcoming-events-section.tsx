import { Container, Row, Col, Card, Button } from 'react-bootstrap';

type UpcomingEvent = {
    id: number;
    title: string;
    short_description: string | null;
    location: string;
    start_date_display: string;
    category_display: string;
    image: string | null;
    formatted_price: string;
    requires_approval: boolean;
};

interface Props {
    events: UpcomingEvent[];
}

export function UpcomingEventsSection({ events }: Props) {
    return (
        <section className="py-5" style={{ background: 'var(--titi-white)' }}>
            <Container>
                <Row className="align-items-end mb-4">
                    <Col md={8}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                            <i className="bi bi-calendar-event me-2" />Agenda
                        </p>
                        <h2 className="fw-bold mb-2" style={{ color: 'var(--titi-text)' }}>
                            Réservez en quelques clics
                        </h2>
                        <p className="text-muted mb-0" style={{ maxWidth: 720 }}>
                            Une promesse simple : des événements bien organisés, des informations claires, et un tunnel de réservation fluide.
                        </p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <Button
                            href="/events"
                            style={{ background: '#16A34A', border: 'none', fontWeight: 500, borderRadius: 6, fontSize: '0.875rem' }}
                        >
                            Voir tous les événements
                        </Button>
                    </Col>
                </Row>

                {events.length === 0 ? (
                    <Card className="border-0 shadow-sm" style={{ background: 'var(--titi-surface)', border: '1px solid var(--titi-border)' }}>
                        <Card.Body className="p-4 text-center">
                            <div className="mb-3">
                                <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', color: '#9CA3AF' }}></i>
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: 'var(--titi-text)' }}>Aucun événement publié</h5>
                            <p className="mb-0 text-muted">Revenez bientôt, ou contactez-nous pour proposer un événement.</p>
                            <div className="mt-3">
                                <Button href="/partners" variant="outline-success" className="fw-semibold">
                                    Proposer / Sponsoriser
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ) : (
                    <Row className="g-4">
                        {events.map((event) => (
                            <Col key={event.id} md={6} lg={4}>
                                <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)' }}>
                                    {event.image ? (
                                        <div
                                            style={{
                                                height: 170,
                                                backgroundImage: `url(${event.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                    ) : (
                                        <div style={{ height: 170, background: 'var(--titi-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="bi bi-calendar-event" style={{ fontSize: '2rem', color: 'var(--titi-muted)' }} />
                                        </div>
                                    )}
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span style={{ background: 'var(--titi-surface)', color: 'var(--titi-text)', border: '1px solid var(--titi-border)', fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, fontWeight: 500 }}>
                                                {event.category_display}
                                            </span>
                                            {event.requires_approval && <span className="badge bg-warning">Invitation</span>}
                                        </div>
                                        <h5 className="fw-bold mb-2" style={{ color: 'var(--titi-text)' }}>
                                            {event.title}
                                        </h5>
                                        <div className="text-muted small mb-2">
                                            <i className="bi bi-calendar-event me-2 text-success"></i>
                                            {event.start_date_display}
                                        </div>
                                        <div className="text-muted small mb-3">
                                            <i className="bi bi-geo-alt me-2 text-success"></i>
                                            {event.location}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="fw-semibold" style={{ color: 'var(--titi-green)' }}>
                                                {event.formatted_price}
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button
                                                href={`/events/${event.id}`}
                                                className="w-100"
                                                style={{ background: '#16A34A', border: 'none', fontWeight: 500, fontSize: '0.875rem' }}
                                            >
                                                Réserver
                                            </Button>
                                            <Button href={`/events/${event.id}`} variant="outline-secondary">
                                                Détails
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </section>
    );
}
