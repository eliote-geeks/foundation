import { Container, Row, Col, Button } from 'react-bootstrap';

const STEPS = [
    {
        num: '01',
        icon: 'bi-search',
        color: '#5FA145',
        bg: 'rgba(95, 161, 69, 0.18)',
        title: 'Parcourez les événements',
        text: 'Filtrez par catégorie, date ou lieu. Consultez le programme, les intervenants, les tarifs et les informations pratiques.',
    },
    {
        num: '02',
        icon: 'bi-ticket-perforated',
        color: '#C69438',
        bg: 'rgba(198, 148, 56, 0.18)',
        title: 'Choisissez votre place',
        text: 'Sélectionnez le type de billet (standard, VIP, table…) et le nombre de places souhaité.',
    },
    {
        num: '03',
        icon: 'bi-phone',
        color: '#C69438',
        bg: 'rgba(198, 148, 56, 0.18)',
        title: 'Payez en 1 minute',
        text: 'MTN Mobile Money, Orange Money ou carte bancaire. Le paiement est sécurisé et confirmé en temps réel.',
    },
    {
        num: '04',
        icon: 'bi-qr-code-scan',
        color: '#4D8A3C',
        bg: 'rgba(77, 138, 60, 0.18)',
        title: 'Recevez votre billet',
        text: "Votre billet QR vous est envoyé par email et WhatsApp. Présentez-le au contrôle d'accès le jour J.",
    },
];

const PAYMENT_METHODS = [
    { name: 'MTN Mobile Money', icon: 'bi-phone-fill', color: '#FFCC00', bg: 'rgba(255, 204, 0, 0.18)' },
    { name: 'Orange Money', icon: 'bi-phone-fill', color: '#FF6600', bg: 'rgba(255, 102, 0, 0.18)' },
    { name: 'Carte bancaire', icon: 'bi-credit-card-2-front', color: '#1A56DB', bg: 'rgba(26, 86, 219, 0.18)' },
    { name: 'Virement', icon: 'bi-bank', color: '#4D8A3C', bg: 'rgba(77, 138, 60, 0.18)' },
];

export function HowItWorksSection() {
    return (
        <section className="py-5" style={{ background: 'var(--titi-white)' }}>
            <Container>
                {/* Header */}
                <div className="text-center mb-5">
                    <span
                        className="d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold"
                        style={{ background: 'rgba(198, 148, 56, 0.15)', color: '#C69438' }}
                    >
                        Billetterie en ligne
                    </span>
                    <h2 className="fw-bold mb-3" style={{ color: 'var(--titi-text)', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
                        Réservez en 4 étapes simples
                    </h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: 560, lineHeight: 1.7 }}>
                        Pas de file d'attente, pas de déplacement. Votre billet arrive directement sur votre téléphone.
                    </p>
                </div>

                {/* Steps */}
                <Row className="g-4 mb-5 position-relative">
                    {/* Connector line (desktop) */}
                    <div
                        className="d-none d-lg-block position-absolute"
                        style={{ top: 40, left: '12.5%', right: '12.5%', height: 1, background: 'var(--titi-border)', zIndex: 0 }}
                    />
                    {STEPS.map((step, i) => (
                        <Col md={6} lg={3} key={i} style={{ position: 'relative', zIndex: 1 }}>
                            <div className="text-center">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{
                                        width: 72,
                                        height: 72,
                                        background: step.bg,
                                        border: `3px solid ${step.color}40`,
                                        fontSize: '1.6rem',
                                        color: step.color,
                                    }}
                                >
                                    <i className={step.icon}></i>
                                </div>
                                <div className="fw-bold mb-1" style={{ color: step.color, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ÉTAPE {step.num}</div>
                                <h5 className="fw-bold mb-2" style={{ color: 'var(--titi-text)' }}>{step.title}</h5>
                                <p className="text-muted small" style={{ lineHeight: 1.6 }}>{step.text}</p>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Payment methods */}
                <div
                    className="rounded-4 p-4 p-md-5"
                    style={{ background: 'var(--titi-surface)', border: '1px solid var(--titi-border)' }}
                >
                    <Row className="align-items-center g-4">
                        <Col md={5}>
                            <h4 className="fw-bold mb-2" style={{ color: 'var(--titi-text)' }}>
                                <i className="bi bi-shield-check me-2" style={{ color: '#5FA145' }}></i>
                                Paiements sécurisés
                            </h4>
                            <p className="text-muted mb-3" style={{ lineHeight: 1.65 }}>
                                Tous les paiements sont traités via des passerelles sécurisées.
                                Vos données bancaires ne sont jamais stockées sur notre plateforme.
                            </p>
                            <Button
                                href="/events"
                                style={{ background: '#16A34A', border: 'none', borderRadius: 6, fontWeight: 500, padding: '8px 20px', fontSize: '0.875rem' }}
                            >
                                <i className="bi bi-ticket-perforated me-2"></i>
                                Réserver maintenant
                            </Button>
                        </Col>
                        <Col md={7}>
                            <Row className="g-3">
                                {PAYMENT_METHODS.map((pm, i) => (
                                    <Col xs={6} key={i}>
                                        <div
                                            className="d-flex align-items-center gap-2 p-2 p-md-3 rounded-3"
                                            style={{ background: pm.bg, border: `1px solid ${pm.color}30` }}
                                        >
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                                                style={{ width: 34, height: 34, background: 'var(--titi-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                                            >
                                                <i className={pm.icon} style={{ color: pm.color, fontSize: '1rem' }}></i>
                                            </div>
                                            <span className="fw-semibold" style={{ color: 'var(--titi-text)', fontSize: 'clamp(0.72rem, 1.8vw, 0.875rem)', lineHeight: 1.2 }}>{pm.name}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    );
}
