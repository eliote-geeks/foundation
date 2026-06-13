import { Head, useForm } from '@inertiajs/react';
import { Container, Row, Col, Card, Badge, Button, Accordion, Form, Table } from 'react-bootstrap';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

type EventDetail = {
    id: number;
    title: string;
    description: string;
    short_description: string | null;
    location: string;
    address: string | null;
    latitude: string | null;
    longitude: string | null;
    start_date_iso: string;
    end_date_iso: string;
    start_date_display: string;
    end_date_display: string;
    category: string;
    category_display: string;
    status: string;
    status_display: string;
    image: string | null;
    gallery: string[] | null;
    agenda: any[] | null;
    speakers: any[] | null;
    sponsors: any[] | null;
    is_free: boolean;
    price: number | null;
    requires_approval: boolean;
    formatted_price: string;
    capacity: number | null;
    available_tickets: number;
    terms_conditions: string | null;
    contact_info: Record<string, any> | null;
};

interface EventDetailProps {
    user?: { name: string; email: string };
    event: EventDetail;
}

export default function EventDetailPage({ user, event }: EventDetailProps) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: user?.name ?? '',
        email: user?.email ?? '',
        phone: '',
        quantity: 1,
        notes: '',
    });

    const totalPrice = event.is_free ? 0 : (event.price ?? 0) * data.quantity;
    const formattedTotal = event.is_free
        ? 'Gratuit'
        : totalPrice.toLocaleString('fr-FR') + ' XAF';

    const agendaItems = Array.isArray(event.agenda) ? event.agenda : [];
    const speakers = Array.isArray(event.speakers) ? event.speakers : [];
    const sponsors = Array.isArray(event.sponsors) ? event.sponsors : [];
    const gallery = Array.isArray(event.gallery) ? event.gallery : [];

    return (
        <>
            <Head>
                <title>{event.title} - TITI EVENTS</title>
                <meta name="description" content={event.short_description ?? event.title} />
                <link rel="canonical" href={`/events/${event.id}`} />
            </Head>

            <ModernHeader user={user} />

            <div style={{ paddingTop: 110, background: '#F9FAFB', minHeight: '100vh' }}>
                <Container>
                    <div className="mb-3">
                        <Button href="/events" variant="link" className="p-0 text-decoration-none">
                            ← Retour aux événements
                        </Button>
                    </div>

                    <Card className="border-0 shadow-sm overflow-hidden mb-4">
                        {event.image ? (
                            <div
                                style={{
                                    height: 260,
                                    backgroundImage: `url(${event.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    height: 260,
                                    background: 'linear-gradient(135deg, #334E15 0%, #5FA145 100%)',
                                }}
                            />
                        )}
                        <Card.Body className="p-4 p-md-5">
                            <Row className="g-4 align-items-start">
                                <Col md={8}>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        <Badge bg="success">Événement</Badge>
                                        <Badge bg="light" text="dark" style={{ border: '1px solid #E5E7EB' }}>
                                            {event.category_display}
                                        </Badge>
                                        {event.requires_approval && <Badge bg="warning">Invitation / validation</Badge>}
                                    </div>
                                    <h1 className="fw-bold mb-2" style={{ color: '#111827' }}>
                                        {event.title}
                                    </h1>
                                    {event.short_description && <p className="lead text-muted mb-0">{event.short_description}</p>}
                                </Col>
                                <Col md={4}>
                                    <Card className="border-0" style={{ background: '#F3F4F6' }}>
                                        <Card.Body>
                                            <div className="mb-2" style={{ color: '#374151' }}>
                                                <i className="bi bi-calendar-event me-2 text-success"></i>
                                                {event.start_date_display}
                                            </div>
                                            <div className="mb-2" style={{ color: '#374151' }}>
                                                <i className="bi bi-geo-alt me-2 text-success"></i>
                                                {event.location}
                                            </div>
                                            <div className="mb-3" style={{ color: '#374151' }}>
                                                <i className="bi bi-ticket-perforated me-2 text-success"></i>
                                                {event.formatted_price}
                                            </div>

                                            <Button
                                                className="w-100"
                                                style={{
                                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                    border: 'none',
                                                    fontWeight: 700,
                                                }}
                                                onClick={() => {
                                                    const el = document.getElementById('reservation');
                                                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }}
                                            >
                                                Réserver / Demander invitation
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        À propos
                                    </h4>
                                    <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{event.description}</div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        Programme
                                    </h4>
                                    {agendaItems.length === 0 ? (
                                        <div className="text-muted">Programme à venir.</div>
                                    ) : (
                                        <Table responsive className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 140 }}>Heure</th>
                                                    <th>Session</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {agendaItems.map((item: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="text-muted">
                                                            {item?.time ?? item?.start ?? item?.hour ?? '—'}
                                                        </td>
                                                        <td>
                                                            <div className="fw-semibold">{item?.title ?? item?.name ?? 'Session'}</div>
                                                            {item?.description && (
                                                                <div className="text-muted small">{item.description}</div>
                                                            )}
                                                            {item?.speaker && (
                                                                <div className="text-muted small">
                                                                    <i className="bi bi-mic me-1"></i>
                                                                    {item.speaker}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        Intervenants
                                    </h4>
                                    {speakers.length === 0 ? (
                                        <div className="text-muted">Intervenants à confirmer.</div>
                                    ) : (
                                        <Row className="g-3">
                                            {speakers.map((sp: any, idx: number) => (
                                                <Col key={idx} md={6}>
                                                    <Card className="border-0" style={{ background: '#F3F4F6' }}>
                                                        <Card.Body>
                                                            <div className="d-flex gap-3 align-items-center">
                                                                <div
                                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: 44,
                                                                        height: 44,
                                                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                                        color: '#fff',
                                                                        fontWeight: 800,
                                                                    }}
                                                                >
                                                                    {(sp?.name ?? sp?.full_name ?? 'I')
                                                                        .toString()
                                                                        .slice(0, 1)
                                                                        .toUpperCase()}
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <div className="fw-bold">{sp?.name ?? sp?.full_name ?? 'Intervenant'}</div>
                                                                    {sp?.role && <div className="text-muted small">{sp.role}</div>}
                                                                    {sp?.bio && <div className="text-muted small">{sp.bio}</div>}
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        Galerie
                                    </h4>
                                    {gallery.length === 0 ? (
                                        <div className="text-muted">Photos/vidéos à venir.</div>
                                    ) : (
                                        <Row className="g-3">
                                            {gallery.slice(0, 12).map((src: string, idx: number) => (
                                                <Col key={idx} xs={6} md={4}>
                                                    <div
                                                        className="rounded overflow-hidden"
                                                        style={{
                                                            height: 130,
                                                            backgroundImage: `url(${src})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            border: '1px solid #E5E7EB',
                                                        }}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        FAQ
                                    </h4>
                                    <Accordion flush>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Comment réserver ?</Accordion.Header>
                                            <Accordion.Body>
                                                Cliquez sur “Réserver / Demander invitation” puis remplissez le formulaire. Une
                                                confirmation vous sera envoyée.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>Remboursements et annulations</Accordion.Header>
                                            <Accordion.Body>
                                                Les conditions seront précisées lors du lancement du paiement en ligne. Pour l’instant,
                                                contactez l’organisateur via les informations de contact.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-2" style={{ color: '#334E15' }}>
                                        Tarifs
                                    </h5>
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted">Prix</span>
                                        <span className="fw-bold" style={{ color: '#111827' }}>
                                            {event.formatted_price}
                                        </span>
                                    </div>
                                    {event.capacity != null && (
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="text-muted">Capacité</span>
                                            <span className="fw-semibold">{event.capacity}</span>
                                        </div>
                                    )}
                                    {!event.is_free && (
                                        <div className="mt-3 small" style={{ color: '#16A34A' }}>
                                            <i className="bi bi-shield-lock me-1" />Paiement MTN MoMo / Orange Money
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card id="reservation" className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-2" style={{ color: ‘#334E15’ }}>
                                        {event.is_free ? ‘Inscription gratuite’ : ‘Acheter des billets’}
                                    </h5>
                                    <p className="text-muted mb-3" style={{ fontSize: ‘0.875rem’ }}>
                                        {event.is_free
                                            ? (event.requires_approval ? ‘Demande d\’invitation (validation requise).’ : ‘Inscription libre et gratuite.’)
                                            : ‘Paiement sécurisé via SharePay (MTN MoMo / Orange Money).’}
                                    </p>

                                    <Form onSubmit={(e) => { e.preventDefault(); post(`/events/${event.id}/reserve`); }}>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">Nom complet *</Form.Label>
                                            <Form.Control
                                                value={data.full_name}
                                                onChange={(e) => setData(‘full_name’, e.target.value)}
                                                isInvalid={Boolean(errors.full_name)}
                                                placeholder="Votre nom"
                                            />
                                            {errors.full_name && <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>}
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData(‘email’, e.target.value)}
                                                isInvalid={Boolean(errors.email)}
                                                placeholder="vous@exemple.com"
                                            />
                                            {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">Téléphone</Form.Label>
                                            <Form.Control
                                                value={data.phone}
                                                onChange={(e) => setData(‘phone’, e.target.value)}
                                                placeholder="+237 6xx xxx xxx"
                                            />
                                        </Form.Group>

                                        <Row className="g-2 mb-3">
                                            <Col xs={5}>
                                                <Form.Label className="small text-muted">Quantité</Form.Label>
                                                <Form.Control
                                                    type="number" min={1} max={10}
                                                    value={data.quantity}
                                                    onChange={(e) => setData(‘quantity’, Number(e.target.value))}
                                                    isInvalid={Boolean(errors.quantity)}
                                                />
                                            </Col>
                                            <Col xs={7}>
                                                <Form.Label className="small text-muted">Places restantes</Form.Label>
                                                <Form.Control value={`${event.available_tickets}`} disabled />
                                            </Col>
                                        </Row>

                                        {!event.is_free && (
                                            <div style={{ padding: ‘10px 14px’, background: ‘#f0fdf4’, border: ‘1px solid #bbf7d0’, borderRadius: 8, marginBottom: 16, display: ‘flex’, justifyContent: ‘space-between’, alignItems: ‘center’ }}>
                                                <span style={{ fontSize: ‘0.875rem’, color: ‘#166534’ }}>Total à payer</span>
                                                <strong style={{ fontSize: ‘1rem’, color: ‘#14532d’ }}>{formattedTotal}</strong>
                                            </div>
                                        )}

                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">Message (optionnel)</Form.Label>
                                            <Form.Control
                                                as="textarea" rows={2}
                                                value={data.notes}
                                                onChange={(e) => setData(‘notes’, e.target.value)}
                                                placeholder="Infos utiles..."
                                            />
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            disabled={processing || event.available_tickets <= 0}
                                            className="w-100"
                                            style={{ background: ‘linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)’, border: ‘none’, fontWeight: 700 }}
                                        >
                                            {processing
                                                ? (event.is_free ? ‘Envoi…’ : ‘Redirection vers le paiement…’)
                                                : (event.is_free ? ‘S\’inscrire’ : `Payer ${formattedTotal}`)}
                                        </Button>

                                        {!event.is_free && (
                                            <p className="text-center mt-2 mb-0" style={{ fontSize: ‘0.75rem’, color: ‘#6B7280’ }}>
                                                <i className="bi bi-shield-lock me-1" />Paiement sécurisé SharePay
                                            </p>
                                        )}
                                    </Form>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-2">Localisation</h6>
                                    <div className="text-muted mb-2">{event.address ?? event.location}</div>
                                    <div className="small text-muted">
                                        {event.latitude && event.longitude ? (
                                            <>
                                                GPS: {event.latitude}, {event.longitude}
                                            </>
                                        ) : (
                                            'Coordonnées GPS non renseignées'
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mt-4">
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-2">Sponsors & Partenaires</h6>
                                    {sponsors.length === 0 ? (
                                        <div className="text-muted small">Sponsors à annoncer.</div>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-2">
                                            {sponsors.slice(0, 12).map((sp: any, idx: number) => (
                                                <Badge
                                                    key={idx}
                                                    bg="light"
                                                    text="dark"
                                                    style={{ border: '1px solid #E5E7EB', fontWeight: 600 }}
                                                >
                                                    {sp?.name ?? sp?.title ?? sp?.toString?.() ?? 'Sponsor'}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {event.terms_conditions && (
                                <Card className="border-0 shadow-sm mt-4">
                                    <Card.Body className="p-4">
                                        <h6 className="fw-bold mb-2">Conditions</h6>
                                        <div className="small text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                            {event.terms_conditions}
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>
                    </Row>

                    <div className="my-5">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div>
                                    <h5 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                        TITI EVENTS : événements & campagnes
                                    </h5>
                                    <div className="text-muted">Participez, réservez, ou soutenez nos actions.</div>
                                </div>
                                <Button href="/partners" variant="outline-success" className="fw-semibold">
                                    Voir les partenaires
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>

            <ModernFooter />
        </>
    );
}
