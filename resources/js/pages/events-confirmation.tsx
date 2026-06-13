import { Head } from '@inertiajs/react';
import { Container, Card, Button, Badge } from 'react-bootstrap';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface Props {
    user?: { name: string; email: string };
    event: { id: number; title: string; start_date_display: string; location: string; requires_approval: boolean };
    registration: { id: number; full_name: string; email: string; phone: string | null; quantity: number; status: string };
}

export default function EventsConfirmationPage({ user, event, registration }: Props) {
    const isPending = registration.status === 'pending';

    return (
        <>
            <Head>
                <title>Confirmation - {event.title}</title>
                <meta name="description" content="Confirmation de votre demande de réservation / invitation." />
            </Head>

            <ModernHeader user={user} />

            <div style={{ paddingTop: 110, background: '#F9FAFB', minHeight: '100vh' }}>
                <Container style={{ maxWidth: 760 }}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <i
                                        className={`bi ${isPending ? 'bi-hourglass-split' : 'bi-check-circle-fill'}`}
                                        style={{ fontSize: '3rem', color: isPending ? '#C69438' : '#5FA145' }}
                                    ></i>
                                </div>
                                <h2 className="fw-bold mb-2" style={{ color: '#111827' }}>
                                    {isPending ? 'Demande reçue' : 'Inscription confirmée'}
                                </h2>
                                <p className="text-muted mb-0">
                                    {isPending
                                        ? "Votre demande sera validée par l'organisateur."
                                        : 'Vous êtes bien enregistré(e) pour cet événement.'}
                                </p>
                            </div>

                            <Card className="border-0" style={{ background: '#F3F4F6' }}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                        <div>
                                            <div className="fw-bold mb-1">{event.title}</div>
                                            <div className="text-muted">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {event.start_date_display}
                                            </div>
                                            <div className="text-muted">
                                                <i className="bi bi-geo-alt me-2"></i>
                                                {event.location}
                                            </div>
                                        </div>
                                        <Badge bg={isPending ? 'warning' : 'success'}>
                                            {isPending ? 'En attente' : 'Confirmé'}
                                        </Badge>
                                    </div>
                                </Card.Body>
                            </Card>

                            <div className="mt-4 d-flex flex-column flex-sm-row gap-2">
                                <Button
                                    href={`/events/${event.id}`}
                                    className="flex-grow-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                        border: 'none',
                                        fontWeight: 700,
                                    }}
                                >
                                    Revenir à l'événement
                                </Button>
                                <Button href="/events" variant="outline-secondary" className="flex-grow-1">
                                    Voir d'autres événements
                                </Button>
                            </div>

                            <div className="mt-4 small text-muted">
                                Référence: #{registration.id} — {registration.full_name} ({registration.email})
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </div>

            <ModernFooter />
        </>
    );
}
