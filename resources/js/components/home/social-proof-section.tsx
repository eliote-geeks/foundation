import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    city: string | null;
    content: string;
    rating: number;
    icon: string;
    icon_color: string;
    icon_bg: string;
}

interface Props {
    testimonials?: Testimonial[];
}

const FAQ = [
    {
        q: 'Comment réserver un billet ?',
        a: "Rendez-vous sur la page Événements, choisissez l'événement qui vous intéresse, sélectionnez votre type de billet et payez en ligne. Votre billet QR vous est envoyé automatiquement.",
    },
    {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons MTN Mobile Money, Orange Money et les cartes bancaires (Visa, Mastercard). Le paiement est sécurisé et validé en temps réel.',
    },
    {
        q: 'Puis-je obtenir un remboursement ?',
        a: "Les demandes de remboursement sont acceptées jusqu'à 48 h avant la date de l'événement. Contactez-nous à Info.titievents@gmail.com avec votre numéro de billet.",
    },
    {
        q: 'Comment rejoindre la communauté ?',
        a: "Créez un compte gratuit sur la plateforme. Vous accéderez à votre espace membre, votre historique, vos billets, et aux actualités de la fondation.",
    },
    {
        q: 'Comment devenir partenaire ou sponsor ?',
        a: "Visitez notre page Partenaires et soumettez une demande. Notre équipe vous répondra dans les 48 h avec une proposition adaptée à vos objectifs.",
    },
];

const FALLBACK: Testimonial[] = [
    { id: 1, name: 'Marie Nkomo', role: 'Adhérente', city: 'Yaoundé', content: "La réservation était ultra simple — j'ai payé par MTN Money en moins de 2 minutes et reçu mon billet QR sur WhatsApp. Événement parfaitement organisé !", rating: 5, icon: 'bi-person-fill', icon_color: '#5FA145', icon_bg: 'rgba(95, 161, 69, 0.18)' },
    { id: 2, name: 'Jean-Baptiste Mbarga', role: 'Partenaire', city: 'Douala', content: "Nos collaborations avec la TITI EVENTS ont généré un impact réel. La plateforme est fiable, transparente et l'équipe est très professionnelle.", rating: 5, icon: 'bi-briefcase-fill', icon_color: '#C69438', icon_bg: 'rgba(198, 148, 56, 0.18)' },
    { id: 3, name: 'Sylvie Atangana', role: 'Bénévole', city: 'Bafoussam', content: "En tant que bénévole, j'accède à mon espace facilement. Je vois les événements auxquels j'ai participé et les points d'engagement accumulés. Très motivant !", rating: 5, icon: 'bi-heart-fill', icon_color: '#C69438', icon_bg: 'rgba(198, 148, 56, 0.18)' },
];

export function SocialProofSection({ testimonials }: Props) {
    const list = testimonials && testimonials.length > 0 ? testimonials : FALLBACK;
    const [current, setCurrent] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const t = list[current] ?? list[0];

    return (
        <section className="py-5" style={{ background: 'var(--titi-white)' }}>
            <Container>
                {/* ── Testimonials ── */}
                <div className="text-center mb-5">
                    <span
                        className="d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold"
                        style={{ background: 'rgba(198, 148, 56, 0.15)', color: '#C69438' }}
                    >
                        Témoignages
                    </span>
                    <h2 className="fw-bold mb-3" style={{ color: 'var(--titi-text)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                        Ils ont participé, ils témoignent
                    </h2>
                </div>

                <Row className="justify-content-center mb-5">
                    <Col lg={8}>
                        <div
                            className="p-4 p-md-5 rounded-4 text-center mb-4"
                            style={{ background: 'var(--titi-surface)', border: '1px solid var(--titi-border)', minHeight: 280 }}
                        >
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{ width: 80, height: 80, background: t.icon_bg, border: `2px solid ${t.icon_color}30` }}
                            >
                                <i className={t.icon} style={{ color: t.icon_color, fontSize: '2rem' }} />
                            </div>
                            <div className="mb-3">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <i key={i} className="bi bi-star-fill me-1" style={{ color: '#C69438', fontSize: '1rem' }} />
                                ))}
                            </div>
                            <blockquote className="mb-4 fst-italic" style={{ color: 'var(--titi-text)', fontSize: '1.125rem', lineHeight: 1.8 }}>
                                "{t.content}"
                            </blockquote>
                            <div className="fw-bold" style={{ color: '#5FA145', fontSize: '1rem' }}>{t.name}</div>
                            <div style={{ color: 'var(--titi-sub)', fontSize: '0.9rem', marginTop: 2 }}>
                                {t.role}{t.city ? ` — ${t.city}` : ''}
                            </div>
                        </div>

                        <div className="d-flex justify-content-center gap-2">
                            {list.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    style={{
                                        width: i === current ? 32 : 10,
                                        height: 10,
                                        borderRadius: 5,
                                        background: i === current ? '#5FA145' : 'var(--titi-border)',
                                        border: 'none',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        padding: 0,
                                    }}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* ── FAQ + Contact ── */}
                <Row className="g-4 g-lg-5 align-items-start">
                    <Col lg={6}>
                        <span className="d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold" style={{ background: 'rgba(95, 161, 69, 0.15)', color: 'var(--titi-green)' }}>
                            FAQ
                        </span>
                        <h3 className="fw-bold mb-4" style={{ color: 'var(--titi-text)', fontSize: '1.5rem' }}>Questions fréquentes</h3>

                        {FAQ.map((item, i) => (
                            <div key={i} className="mb-3 rounded-3 overflow-hidden" style={{ border: '1px solid var(--titi-border)' }}>
                                <button
                                    className="w-100 text-start d-flex justify-content-between align-items-center p-3 fw-semibold"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{ background: openFaq === i ? 'rgba(95,161,69,0.12)' : 'var(--titi-white)', border: 'none', color: 'var(--titi-text)', fontSize: '0.95rem', cursor: 'pointer' }}
                                >
                                    {item.q}
                                    <i className={`bi bi-chevron-${openFaq === i ? 'up' : 'down'} ms-3 flex-shrink-0`} style={{ color: '#5FA145', fontSize: '0.85rem' }} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-3 pb-3" style={{ color: 'var(--titi-sub)', fontSize: '0.9rem', lineHeight: 1.65, background: 'var(--titi-surface)' }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </Col>

                    <Col lg={6}>
                        <span className="d-inline-block px-3 py-1 rounded-pill mb-3 small fw-semibold" style={{ background: 'rgba(198, 148, 56, 0.15)', color: '#C69438' }}>
                            Contact
                        </span>
                        <h3 className="fw-bold mb-4" style={{ color: 'var(--titi-text)', fontSize: '1.5rem' }}>Une question ? Écrivez-nous</h3>

                        <div className="d-flex flex-column gap-3 mb-4">
                            {[
                                { icon: 'bi-envelope', label: 'Email', value: 'Info.titievents@gmail.com', href: 'mailto:Info.titievents@gmail.com' },
                                { icon: 'bi-whatsapp', label: 'WhatsApp', value: '+237 654 450 215', href: 'https://wa.me/237654450215' },
                                { icon: 'bi-geo-alt', label: 'Adresse', value: 'Yaoundé, Cameroun', href: '#' },
                            ].map((c, i) => (
                                <a key={i} href={c.href} className="d-flex align-items-center gap-3 text-decoration-none p-3 rounded-3"
                                    style={{ background: 'var(--titi-surface)', border: '1px solid var(--titi-border)', color: 'var(--titi-text)' }}>
                                    <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(95, 161, 69, 0.18)' }}>
                                        <i className={c.icon} style={{ color: '#5FA145', fontSize: '1.1rem' }} />
                                    </div>
                                    <div>
                                        <div className="small text-muted">{c.label}</div>
                                        <div className="fw-semibold">{c.value}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="d-flex gap-2 mb-4">
                            {[
                                { icon: 'bi-facebook', color: '#1877F2', href: '#' },
                                { icon: 'bi-instagram', color: '#E1306C', href: '#' },
                                { icon: 'bi-twitter-x', color: '#000000', href: '#' },
                                { icon: 'bi-linkedin', color: '#0A66C2', href: '#' },
                                { icon: 'bi-youtube', color: '#FF0000', href: '#' },
                            ].map((s, i) => (
                                <a key={i} href={s.href}
                                    className="d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
                                    style={{ width: 40, height: 40, background: 'var(--titi-surface)', color: s.color, fontSize: '1.05rem', transition: 'background 0.2s, transform 0.2s' }}
                                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = s.color; el.style.color = '#fff'; el.style.transform = 'scale(1.1)'; }}
                                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'var(--titi-surface)'; el.style.color = s.color; el.style.transform = 'scale(1)'; }}
                                >
                                    <i className={s.icon} />
                                </a>
                            ))}
                        </div>

                        <Button href="/register" className="w-100"
                            style={{ background: '#16A34A', border: 'none', borderRadius: 6, fontWeight: 500, padding: '10px', fontSize: '0.9375rem' }}>
                            <i className="bi bi-person-plus me-2" />
                            Rejoindre la communauté gratuitement
                        </Button>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
