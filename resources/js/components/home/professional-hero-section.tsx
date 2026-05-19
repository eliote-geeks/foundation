import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

interface HomeStats {
    totalEvents: number;
    totalMembers: number;
    ticketsSold: number;
    totalRaised: string;
}

interface HeroSlide {
    headline: string;
    headline_accent?: string;
    tagline?: string;
    badge_text?: string;
    cta_primary_label?: string;
    cta_primary_url?: string;
    cta_secondary_label?: string;
    cta_secondary_url?: string;
}

interface Props {
    user?: { name: string; email: string } | null;
    stats: HomeStats;
    heroSlide?: HeroSlide | null;
}

function useCountUp(target: number, duration = 1600, start = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start || target === 0) return;
        const t0 = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(e * target));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration, start]);
    return value;
}

export function ProfessionalHeroSection({ user, stats, heroSlide }: Props) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const eventsCount  = useCountUp(stats.totalEvents,  1400, visible);
    const membersCount = useCountUp(stats.totalMembers, 1600, visible);
    const ticketsCount = useCountUp(stats.ticketsSold,  1500, visible);

    const headline       = heroSlide?.headline        ?? 'Engagez, contribuez,';
    const headlineAccent = heroSlide?.headline_accent  ?? 'transformez.';
    const tagline        = heroSlide?.tagline          ?? "La plateforme d'événements et d'impact social de la TITI EVENTS. Réservez vos billets, soutenez des initiatives, rejoignez une communauté engagée au Cameroun.";
    const badgeText      = heroSlide?.badge_text       ?? '🌿 TITI EVENTS · Cameroun';
    const cta1Label      = heroSlide?.cta_primary_label   ?? 'Rejoindre gratuitement';
    const cta1Url        = heroSlide?.cta_primary_url     ?? '/register';
    const cta2Label      = heroSlide?.cta_secondary_label ?? 'Voir les événements';
    const cta2Url        = heroSlide?.cta_secondary_url   ?? '/events';

    const fade = (delay: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    });

    return (
        <>
            <style>{`
                .hero-root {
                    min-height: 100vh;
                    background: #FFFFFF;
                    display: flex;
                    align-items: center;
                    padding-top: 66px;
                    position: relative;
                    overflow: hidden;
                }
                .hero-bg-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, #D1FAE5 1.5px, transparent 1.5px);
                    background-size: 32px 32px;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .hero-bg-glow {
                    position: absolute;
                    top: -140px;
                    right: -100px;
                    width: 640px;
                    height: 640px;
                    background: radial-gradient(circle, #DCFCE7 0%, transparent 68%);
                    pointer-events: none;
                }
                .hero-inner {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 72px 24px 80px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                    width: 100%;
                }
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #DCFCE7;
                    color: #15803D;
                    border: 1px solid #BBF7D0;
                    border-radius: 999px;
                    padding: 6px 16px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                .hero-h1 {
                    font-size: clamp(2.5rem, 4.2vw, 3.75rem);
                    font-weight: 800;
                    line-height: 1.08;
                    color: #111827;
                    letter-spacing: -0.03em;
                    margin: 0 0 6px;
                }
                .hero-h1-accent {
                    font-size: clamp(2.5rem, 4.2vw, 3.75rem);
                    font-weight: 800;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0 0 28px;
                    color: #16A34A;
                    position: relative;
                    display: inline-block;
                }
                .hero-h1-accent::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, #16A34A 0%, #D97706 100%);
                    border-radius: 4px;
                }
                .hero-tagline {
                    font-size: 1.0625rem;
                    color: #6B7280;
                    line-height: 1.75;
                    margin-bottom: 36px;
                    max-width: 480px;
                }
                .hero-ctas {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-bottom: 44px;
                }
                .hero-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #16A34A;
                    color: #fff !important;
                    border: none;
                    border-radius: 8px;
                    padding: 13px 26px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
                    box-shadow: 0 4px 14px rgba(22,163,74,0.35);
                    cursor: pointer;
                }
                .hero-btn-primary:hover {
                    background: #15803D;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 22px rgba(22,163,74,0.45);
                }
                .hero-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    color: #111827 !important;
                    border: 1.5px solid #D1D5DB;
                    border-radius: 8px;
                    padding: 13px 26px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: border-color 0.18s, background 0.18s, transform 0.15s;
                    cursor: pointer;
                }
                .hero-btn-secondary:hover {
                    border-color: #16A34A;
                    background: #F0FDF4;
                    color: #15803D !important;
                    transform: translateY(-2px);
                }
                .hero-stats {
                    display: flex;
                    border: 1px solid #E5E7EB;
                    border-radius: 14px;
                    overflow: hidden;
                    background: #F9FAFB;
                }
                .hero-stat-item {
                    flex: 1;
                    padding: 18px 10px;
                    text-align: center;
                    border-right: 1px solid #E5E7EB;
                }
                .hero-stat-item:last-child { border-right: none; }
                .hero-stat-num {
                    font-size: 1.625rem;
                    font-weight: 800;
                    color: #111827;
                    letter-spacing: -0.03em;
                    line-height: 1;
                }
                .hero-stat-label {
                    font-size: 0.7rem;
                    color: #9CA3AF;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    margin-top: 5px;
                }

                /* Right panel */
                .hero-right {
                    position: relative;
                    height: 460px;
                }
                .hero-panel-bg {
                    position: absolute;
                    inset: 8px 0 0 8px;
                    background: linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%);
                    border: 1px solid #BBF7D0;
                    border-radius: 24px;
                }
                .hero-card {
                    position: absolute;
                    background: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 16px;
                    padding: 16px 18px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.09);
                }
                .hero-card-1 {
                    top: 28px;
                    left: -20px;
                    right: 48px;
                    transform: rotate(-1deg);
                    animation: heroFloat1 5.5s ease-in-out infinite;
                }
                .hero-card-2 {
                    top: 165px;
                    right: -20px;
                    left: 36px;
                    transform: rotate(1deg);
                    animation: heroFloat2 6.5s ease-in-out infinite;
                }
                .hero-card-3 {
                    bottom: 24px;
                    left: 12px;
                    right: 64px;
                    transform: rotate(-0.5deg);
                    animation: heroFloat3 4.8s ease-in-out infinite;
                }
                @keyframes heroFloat1 {
                    0%,100% { transform: translateY(0) rotate(-1deg); }
                    50%     { transform: translateY(-8px) rotate(-1deg); }
                }
                @keyframes heroFloat2 {
                    0%,100% { transform: translateY(0) rotate(1deg); }
                    50%     { transform: translateY(-10px) rotate(1deg); }
                }
                @keyframes heroFloat3 {
                    0%,100% { transform: translateY(0) rotate(-0.5deg); }
                    50%     { transform: translateY(-6px) rotate(-0.5deg); }
                }
                .hero-card-lbl {
                    font-size: 0.675rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #9CA3AF;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .hero-progress-bg {
                    background: #E5E7EB;
                    border-radius: 999px;
                    height: 7px;
                    margin: 8px 0 5px;
                }
                .hero-progress-fill {
                    background: linear-gradient(90deg, #16A34A, #22C55E);
                    border-radius: 999px;
                    height: 7px;
                    width: 0%;
                    animation: heroBarGrow 2s ease 0.9s forwards;
                }
                @keyframes heroBarGrow { to { width: 73%; } }
                .hero-avatar-row {
                    display: flex;
                    align-items: center;
                }
                .hero-av {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.575rem;
                    font-weight: 800;
                    margin-left: -6px;
                }
                .hero-av:first-child { margin-left: 0; }
                .hero-live-dot {
                    width: 8px;
                    height: 8px;
                    background: #22C55E;
                    border-radius: 50%;
                    display: inline-block;
                    animation: livePulse 1.6s ease-in-out infinite;
                }
                @keyframes livePulse {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50%     { opacity: 0.35; transform: scale(1.4); }
                }
                .hero-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: #F0FDF4;
                    color: #15803D;
                    border: 1px solid #BBF7D0;
                    border-radius: 6px;
                    padding: 3px 9px;
                    font-size: 0.72rem;
                    font-weight: 600;
                }
                @media (max-width: 920px) {
                    .hero-inner { grid-template-columns: 1fr; gap: 48px; }
                    .hero-right { height: 340px; }
                    .hero-card-1 { left: 0; }
                    .hero-card-2 { right: 0; left: 24px; }
                }
                @media (max-width: 540px) {
                    .hero-right { height: 280px; }
                    .hero-h1, .hero-h1-accent { font-size: 2.1rem; }
                    .hero-tagline { font-size: 0.9375rem; }
                }
            `}</style>

            <section className="hero-root" ref={ref as React.RefObject<HTMLElement>}>
                <div className="hero-bg-dots" />
                <div className="hero-bg-glow" />

                <div className="hero-inner">
                    {/* ── Left ── */}
                    <div>
                        <div style={fade(0.1)}>
                            <h1 className="hero-h1">{headline}</h1>
                            <div className="hero-h1-accent">{headlineAccent}</div>
                        </div>

                        <p className="hero-tagline" style={fade(0.27)}>{tagline}</p>

                        <div className="hero-ctas" style={fade(0.38)}>
                            <Link href={cta1Url} className="hero-btn-primary">
                                <i className="bi bi-arrow-right-circle-fill" />
                                {cta1Label}
                            </Link>
                            <Link href={cta2Url} className="hero-btn-secondary">
                                <i className="bi bi-calendar3" />
                                {cta2Label}
                            </Link>
                        </div>

                        <div className="hero-stats" style={fade(0.5)}>
                            <div className="hero-stat-item">
                                <div className="hero-stat-num">{stats.totalEvents > 0 ? eventsCount : '—'}</div>
                                <div className="hero-stat-label">Événements</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-num">{stats.totalMembers > 0 ? membersCount.toLocaleString('fr-FR') : '—'}</div>
                                <div className="hero-stat-label">Membres</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-num">{stats.ticketsSold > 0 ? ticketsCount.toLocaleString('fr-FR') : '—'}</div>
                                <div className="hero-stat-label">Billets vendus</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-num" style={{ color: '#D97706', fontSize: '1.3rem' }}>
                                    {stats.totalRaised !== '0K' && stats.totalRaised !== '0.0M' ? stats.totalRaised : '—'}
                                </div>
                                <div className="hero-stat-label">Collectés XAF</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right ── */}
                    <div className="hero-right" style={fade(0.2)}>
                        <div className="hero-panel-bg" />

                        {/* Card 1 — événement */}
                        <div className="hero-card hero-card-1">
                            <div className="hero-card-lbl">
                                <i className="bi bi-calendar-event" style={{ color: '#16A34A' }} />
                                Prochain événement
                            </div>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                                Forum Innovation Sociale
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <i className="bi bi-geo-alt" />
                                Yaoundé · 28 Mai 2026
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span className="hero-chip">
                                    <i className="bi bi-ticket-perforated" />
                                    32 places restantes
                                </span>
                                <Link href="/events" style={{ fontSize: '0.8125rem', color: '#16A34A', fontWeight: 700, textDecoration: 'none' }}>
                                    Réserver →
                                </Link>
                            </div>
                        </div>

                        {/* Card 2 — collecte */}
                        <div className="hero-card hero-card-2">
                            <div className="hero-card-lbl">
                                <i className="bi bi-graph-up-arrow" style={{ color: '#D97706' }} />
                                Impact du mois
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Collecte de fonds</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#16A34A' }}>73%</span>
                            </div>
                            <div className="hero-progress-bg">
                                <div className="hero-progress-fill" />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF' }}>
                                <span>450 000 XAF</span>
                                <span>Objectif : 620 000</span>
                            </div>
                        </div>

                        {/* Card 3 — communauté */}
                        <div className="hero-card hero-card-3">
                            <div className="hero-card-lbl">
                                <i className="bi bi-people-fill" style={{ color: '#16A34A' }} />
                                Communauté active
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className="hero-avatar-row">
                                    {[['MN','#D1FAE5','#15803D'],['JB','#FEF3C7','#92400E'],['SA','#D1FAE5','#15803D'],['KD','#FEF3C7','#92400E']].map(([s,bg,c],i) => (
                                        <div key={i} className="hero-av" style={{ background: bg, color: c }}>{s}</div>
                                    ))}
                                    <div className="hero-av" style={{ background: '#F3F4F6', color: '#6B7280' }}>+8</div>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                    <b style={{ color: '#111827' }}>12</b> nouveaux cette semaine
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
