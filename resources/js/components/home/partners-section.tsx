import { Container, Row, Col, Button } from 'react-bootstrap';

interface Partner {
    id: number;
    name: string;
    logo: string;
    website_url: string | null;
}

interface Props {
    partners: Partner[];
}

const PLACEHOLDER_PARTNERS = [
    { id: 0, name: 'MTN Cameroun', initials: 'MTN', color: '#FFCC00', bg: 'rgba(255, 204, 0, 0.18)' },
    { id: 1, name: 'Orange Cameroun', initials: 'ORA', color: '#FF6600', bg: 'rgba(255, 102, 0, 0.18)' },
    { id: 2, name: 'Gouvernement', initials: 'GOV', color: '#1A56DB', bg: 'rgba(26, 86, 219, 0.18)' },
    { id: 3, name: 'Partenaire 4', initials: 'P4', color: '#5FA145', bg: 'rgba(95, 161, 69, 0.18)' },
    { id: 4, name: 'Partenaire 5', initials: 'P5', color: '#C69438', bg: 'rgba(198, 148, 56, 0.18)' },
    { id: 5, name: 'Partenaire 6', initials: 'P6', color: '#C69438', bg: 'rgba(198, 148, 56, 0.18)' },
];

export function PartnersSection({ partners }: Props) {
    const hasRealPartners = partners.length > 0;

    return (
        <section className="py-5" style={{ background: 'var(--titi-surface)' }}>
            <Container>
                <div className="text-center mb-5">
                    <span
                        className="d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold"
                        style={{ background: 'rgba(95, 161, 69, 0.15)', color: 'var(--titi-green)' }}
                    >
                        Partenaires & Sponsors
                    </span>
                    <h2 className="fw-bold mb-3" style={{ color: 'var(--titi-text)', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
                        Ils nous font confiance
                    </h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: 560, lineHeight: 1.7 }}>
                        TITI EVENTS porte ses projets avec le soutien d'organisations engagées
                        pour un développement durable au Cameroun.
                    </p>
                </div>

                {/* Partner logos grid */}
                {hasRealPartners ? (
                    <Row className="g-3 justify-content-center mb-5">
                        {partners.map((p) => (
                            <Col xs={6} sm={4} md={3} lg={2} key={p.id}>
                                {p.website_url ? (
                                    <a href={p.website_url} target="_blank" rel="noreferrer" className="text-decoration-none">
                                        <div
                                            className="d-flex align-items-center justify-content-center p-3 rounded-3"
                                            style={{
                                                background: 'var(--titi-white)',
                                                border: '1px solid var(--titi-border)',
                                                height: 80,
                                                transition: 'box-shadow 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'; }}
                                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                                        >
                                            <img src={p.logo} alt={p.name} style={{ maxWidth: '100%', maxHeight: 48, objectFit: 'contain' }} />
                                        </div>
                                    </a>
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center p-3 rounded-3"
                                        style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', height: 80 }}
                                    >
                                        <img src={p.logo} alt={p.name} style={{ maxWidth: '100%', maxHeight: 48, objectFit: 'contain' }} />
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>
                ) : (
                    /* Placeholder logos when no real partners yet */
                    <Row className="g-3 justify-content-center mb-5">
                        {PLACEHOLDER_PARTNERS.map((p) => (
                            <Col xs={6} sm={4} md={3} lg={2} key={p.id}>
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-3"
                                    style={{
                                        background: p.bg,
                                        border: `1px solid ${p.color}30`,
                                        height: 80,
                                        transition: 'transform 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                                >
                                    <span style={{ color: p.color, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                                        {p.initials}
                                    </span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Become partner CTA */}
                <div
                    className="rounded-4 p-4 p-md-5 text-center"
                    style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)' }}
                >
                    <Row className="justify-content-center">
                        <Col md={8} lg={6}>
                            <i className="bi bi-handshake mb-3 d-block" style={{ color: '#F9D27A', fontSize: '2.5rem' }}></i>
                            <h4 className="fw-bold mb-3" style={{ color: 'var(--titi-text)' }}>
                                Devenez partenaire ou sponsor
                            </h4>
                            <p style={{ color: 'var(--titi-sub)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                                Associez votre organisation aux événements de TITI EVENTS.
                                Visibilité, impact mesurable, réseau professionnel — rejoignez nos partenaires.
                            </p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center">
                                <Button
                                    href="/partners"
                                    style={{ background: '#D97706', border: 'none', color: '#fff', fontWeight: 500, borderRadius: 6, padding: '8px 20px', fontSize: '0.875rem' }}
                                >
                                    <i className="bi bi-handshake me-2"></i>
                                    Proposer un partenariat
                                </Button>
                                <Button
                                    href="/partners"
                                    style={{ background: 'rgba(95,161,69,0.12)', border: '1px solid var(--titi-border)', color: 'var(--titi-text)', fontWeight: 500, borderRadius: 6, padding: '8px 20px', fontSize: '0.875rem' }}
                                >
                                    <i className="bi bi-eye me-2"></i>
                                    Voir les partenaires
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    );
}
