import { useState, useEffect, useRef } from 'react';

interface HomeStats {
    totalEvents: number;
    totalMembers: number;
    ticketsSold: number;
    totalRaised: string;
}

interface Props {
    user?: { name: string; email: string };
    stats: HomeStats;
}

function useCountUp(target: number, duration = 1800, start = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start || target === 0) return;
        const startTime = performance.now();
        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration, start]);
    return value;
}

function StatCard({ icon, target, label, color, delay, started }: {
    icon: string; target: number; label: string; color: string; delay: number; started: boolean;
}) {
    const count = useCountUp(target, 1600, started);
    return (
        <div style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '20px 16px',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            animation: `heroFadeUp 0.7s ease ${delay}s both`,
            transition: 'transform 0.25s, background 0.25s',
        }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
        >
            <i className={`bi ${icon}`} style={{ fontSize: '1.5rem', color, display: 'block', marginBottom: 10 }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {target === 0 ? '—' : count.toLocaleString('fr-FR')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
            </div>
        </div>
    );
}

export function ProfessionalHeroSection({ user, stats }: Props) {
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setStarted(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const counters = [
        { icon: 'bi-calendar-event',      target: stats.totalEvents,  label: 'Événements',    color: '#86EFAC', delay: 0.55 },
        { icon: 'bi-people-fill',          target: stats.totalMembers, label: 'Membres',        color: '#FDE68A', delay: 0.65 },
        { icon: 'bi-ticket-perforated',    target: stats.ticketsSold,  label: 'Billets vendus', color: '#F9A8D4', delay: 0.75 },
        { icon: 'bi-cash-coin',            target: 0,                   label: 'Fonds collectés',color: '#7DD3FC', delay: 0.85 },
    ];

    const totalRaisedDisplay = (stats.totalRaised && stats.totalRaised !== '0.0M' && stats.totalRaised !== '0K')
        ? `${stats.totalRaised} FCFA` : '—';

    return (
        <section
            ref={ref}
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#0B2210',
                paddingTop: 'clamp(90px, 14vw, 130px)',
                paddingBottom: 'clamp(60px, 10vw, 100px)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {/* ── Animated background blobs ── */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                {/* Blob 1 — large green */}
                <div style={{
                    position: 'absolute', width: 700, height: 700, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(22,163,74,0.22) 0%, transparent 70%)',
                    top: '-200px', left: '-150px',
                    animation: 'blobFloat1 14s ease-in-out infinite',
                }} />
                {/* Blob 2 — gold */}
                <div style={{
                    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)',
                    bottom: '-100px', right: '-80px',
                    animation: 'blobFloat2 18s ease-in-out infinite',
                }} />
                {/* Blob 3 — lighter green, center */}
                <div style={{
                    position: 'absolute', width: 350, height: 350, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
                    top: '40%', left: '55%',
                    animation: 'blobFloat3 22s ease-in-out infinite',
                }} />

                {/* Subtle grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: i % 3 === 0 ? 3 : 2,
                        height: i % 3 === 0 ? 3 : 2,
                        borderRadius: '50%',
                        background: i % 4 === 0 ? 'rgba(217,119,6,0.7)' : 'rgba(134,239,172,0.5)',
                        left: `${8 + (i * 7.5) % 84}%`,
                        top: `${10 + (i * 11) % 80}%`,
                        animation: `particleFloat ${6 + (i % 5) * 2}s ease-in-out ${i * 0.4}s infinite`,
                    }} />
                ))}
            </div>

            {/* ── Main content ── */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center' }} className="hero-grid">

                    {/* Left */}
                    <div>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 99, padding: '6px 14px', marginBottom: 28,
                            animation: 'heroFadeUp 0.6s ease 0.1s both',
                        }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', animation: 'pulseGreen 2s infinite' }} />
                            <span style={{ color: '#A7F3C0', fontSize: '0.8125rem', fontWeight: 500 }}>
                                Fondation TITI — {user ? `Bienvenue, ${user.name.split(' ')[0]} 👋` : 'Cameroun'}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            margin: '0 0 20px',
                            fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-0.025em',
                            color: '#fff',
                            animation: 'heroFadeUp 0.7s ease 0.2s both',
                        }}>
                            Événements à impact,{' '}
                            <span style={{
                                color: 'transparent',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                backgroundImage: 'linear-gradient(90deg, #FDE68A 0%, #D97706 100%)',
                                display: 'inline-block',
                            }}>
                                organisés pour vous
                            </span>
                        </h1>

                        {/* Sub */}
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '1.0625rem',
                            lineHeight: 1.75,
                            maxWidth: 500,
                            marginBottom: 36,
                            animation: 'heroFadeUp 0.7s ease 0.3s both',
                        }}>
                            Réservez vos places en ligne, payez en Mobile Money ou par carte, et rejoignez une communauté engagée pour un impact durable au Cameroun.
                        </p>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48, animation: 'heroFadeUp 0.7s ease 0.4s both' }}>
                            <a href="/events" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                height: 44, padding: '0 22px',
                                background: '#D97706', color: '#fff',
                                borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem',
                                textDecoration: 'none', border: 'none',
                                boxShadow: '0 0 0 0 rgba(217,119,6,0.4)',
                                animation: 'ctaPulse 3s ease 2s infinite',
                                transition: 'transform 0.2s',
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                            >
                                <i className="bi bi-calendar-event" />
                                Voir les événements
                            </a>
                            {!user && (
                                <a href="/register" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    height: 44, padding: '0 22px',
                                    background: 'rgba(255,255,255,0.1)', color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: 8, fontWeight: 500, fontSize: '0.9375rem',
                                    textDecoration: 'none', transition: 'background 0.2s, transform 0.2s',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                                >
                                    <i className="bi bi-person-plus" />
                                    S'inscrire gratuitement
                                </a>
                            )}
                        </div>

                        {/* Trust strip */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, animation: 'heroFadeUp 0.7s ease 0.5s both' }}>
                            {[
                                { icon: 'bi-shield-check', text: 'Paiement sécurisé' },
                                { icon: 'bi-phone',        text: 'MTN / Orange Money' },
                                { icon: 'bi-qr-code',      text: 'Billet QR électronique' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                    <i className={`bi ${item.icon}`} style={{ color: '#86EFAC', fontSize: '0.9375rem' }} />
                                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8125rem' }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — stat cards */}
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {counters.map((c, i) => (
                                <StatCard key={i} {...c} started={started} />
                            ))}
                        </div>

                        {/* Fonds collectés special display */}
                        <div style={{
                            marginTop: 12,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            animation: 'heroFadeUp 0.7s ease 0.9s both',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <i className="bi bi-cash-coin" style={{ color: '#7DD3FC', fontSize: '1.25rem' }} />
                                <div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fonds collectés</div>
                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>{totalRaisedDisplay}</div>
                                </div>
                            </div>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', animation: 'pulseGreen 2s infinite' }} />
                        </div>

                        {/* Scroll cue */}
                        <div style={{ textAlign: 'center', marginTop: 20, animation: 'heroFadeUp 0.7s ease 1s both' }}>
                            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <i className="bi bi-mouse" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
                                Défiler pour découvrir
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes blobFloat1 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    33%     { transform: translate(40px,-30px) scale(1.05); }
                    66%     { transform: translate(-20px,20px) scale(0.96); }
                }
                @keyframes blobFloat2 {
                    0%,100% { transform: translate(0,0) scale(1); }
                    50%     { transform: translate(-50px,40px) scale(1.08); }
                }
                @keyframes blobFloat3 {
                    0%,100% { transform: translate(0,0); }
                    40%     { transform: translate(30px,-40px); }
                    80%     { transform: translate(-20px,15px); }
                }
                @keyframes particleFloat {
                    0%,100% { transform: translateY(0) translateX(0); opacity: 0.6; }
                    50%     { transform: translateY(-20px) translateX(8px); opacity: 1; }
                }
                @keyframes pulseGreen {
                    0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
                    50%     { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
                }
                @keyframes ctaPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(217,119,6,0); }
                    50%     { box-shadow: 0 0 0 8px rgba(217,119,6,0); }
                }
                @keyframes scrollBounce {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(4px); }
                }
                .hero-grid {
                    grid-template-columns: 1fr 400px;
                }
                @media (max-width: 1024px) {
                    .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
                }
                @media (max-width: 640px) {
                    .hero-grid { gap: 32px !important; }
                }
            `}</style>
        </section>
    );
}
