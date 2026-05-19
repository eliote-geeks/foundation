import { Container, Row, Col } from 'react-bootstrap';

const REASONS = [
    {
        icon: 'bi-calendar-check',
        color: '#5FA145',
        bg: '#EAF5E5',
        title: 'Événements authentiques',
        text: 'Des galas, conférences et programmes soigneusement organisés par la Fondation TITI, avec programme, intervenants et informations claires.',
    },
    {
        icon: 'bi-phone-fill',
        color: '#C69438',
        bg: '#FDF4E3',
        title: 'Paiement simplifié',
        text: 'Réglez en ligne par MTN Mobile Money, Orange Money ou carte bancaire. Reçevez votre billet QR immédiatement par email ou WhatsApp.',
    },
    {
        icon: 'bi-people-fill',
        color: '#C69438',
        bg: '#FDF4E3',
        title: 'Communauté engagée',
        text: 'Rejoignez des milliers de membres — adhérents, ambassadeurs, bénévoles — unis autour de projets à impact social mesurable.',
    },
    {
        icon: 'bi-graph-up-arrow',
        color: '#4D8A3C',
        bg: '#E8F4E5',
        title: 'Impact mesurable',
        text: 'Chaque participation soutient des initiatives concrètes. Suivez les résultats en transparence via les rapports d\'impact de la fondation.',
    },
];

export function WhyJoinSection() {
    return (
        <section className="py-5" style={{ background: '#F9FAFB' }}>
            <Container>
                <div className="text-center mb-5">
                    <span
                        className="d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold"
                        style={{ background: '#E8F5E8', color: '#3D7020' }}
                    >
                        Pourquoi nous choisir
                    </span>
                    <h2 className="fw-bold mb-3" style={{ color: '#1A3209', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>
                        Tout ce qu'il faut pour une réservation réussie
                    </h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: 600, lineHeight: 1.7 }}>
                        De la découverte d'un événement à la participation sur place, nous avons pensé chaque étape pour vous.
                    </p>
                </div>

                <Row className="g-4 mb-5">
                    {REASONS.map((r, i) => (
                        <Col md={6} lg={3} key={i}>
                            <div
                                className="h-100 p-4 rounded-4"
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E8EDEA',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.10)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
                            >
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                                    style={{ width: 52, height: 52, background: r.bg }}
                                >
                                    <i className={r.icon} style={{ color: r.color, fontSize: '1.4rem' }}></i>
                                </div>
                                <h5 className="fw-bold mb-2" style={{ color: '#1A3209' }}>{r.title}</h5>
                                <p className="text-muted small mb-0" style={{ lineHeight: 1.65 }}>{r.text}</p>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Chiffres clés inline */}
                <div
                    className="rounded-4 p-4 p-md-5"
                    style={{ background: '#111827', border: '1px solid #1F2937' }}
                >
                    <Row className="g-4 text-center">
                        {[
                            { value: '100%', label: 'Billets envoyés instantanément' },
                            { value: '3 min', label: 'Pour finaliser une réservation' },
                            { value: '3 modes', label: 'De paiement acceptés' },
                            { value: '24 h/24', label: 'Disponibilité de la plateforme' },
                        ].map((item, i) => (
                            <Col xs={6} md={3} key={i}>
                                <div style={{ color: '#D97706', fontSize: '1.75rem', fontWeight: 700 }}>{item.value}</div>
                                <div style={{ color: '#9CA3AF', fontSize: '0.8125rem', marginTop: 4 }}>{item.label}</div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </section>
    );
}
