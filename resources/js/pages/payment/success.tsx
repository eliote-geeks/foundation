import { Head, Link } from '@inertiajs/react';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

interface Props {
    reference: string | null;
    type: 'donation' | 'ticket' | 'vote' | null;
    item: {
        amount: string;
        label: string;
        name: string;
        status: string;
        ticket_number?: string;
        quantity?: number;
    } | null;
}

export default function PaymentSuccess({ reference, type, item }: Props) {
    const isTicket = type === 'ticket';
    const isVote   = type === 'vote';

    return (
        <>
            <Head title="Paiement confirmé — TITI EVENTS" />
            <ModernHeader />
            <div style={{ background: 'var(--titi-surface)', minHeight: '100vh', paddingTop: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: 480, width: '100%', margin: '40px 16px', textAlign: 'center' }}>
                    <div style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 16, padding: '40px 32px' }}>

                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <i className={`bi ${isTicket ? 'bi-ticket-perforated-fill' : isVote ? 'bi-hand-thumbs-up-fill' : 'bi-check-circle-fill'}`} style={{ fontSize: '2rem', color: '#16A34A' }} />
                        </div>

                        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--titi-text)', marginBottom: 8 }}>
                            {isTicket ? 'Billet confirmé !' : isVote ? 'Vote confirmé !' : 'Paiement confirmé !'}
                        </h1>
                        <p style={{ color: 'var(--titi-sub)', fontSize: '0.9375rem', marginBottom: 24 }}>
                            {isTicket
                                ? 'Votre billet a bien été acheté. Conservez votre numéro de billet.'
                                : isVote
                                ? 'Votre vote a bien été enregistré et confirmé.'
                                : 'Merci pour votre générosité. Votre don a bien été reçu.'}
                        </p>

                        {item && (
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                                {isTicket && item.ticket_number && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#166534' }}>N° de billet</span>
                                        <strong style={{ color: '#14532d', fontSize: '0.875rem', fontFamily: 'monospace' }}>{item.ticket_number}</strong>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: '0.8125rem', color: '#166534' }}>
                                        {isTicket ? 'Événement' : isVote ? 'Concours' : 'Campagne'}
                                    </span>
                                    <span style={{ fontSize: '0.8125rem', color: '#14532d', fontWeight: 500, maxWidth: 200, textAlign: 'right' }}>{item.label}</span>
                                </div>
                                {isVote && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#166534' }}>Candidat soutenu</span>
                                        <span style={{ fontSize: '0.8125rem', color: '#14532d', fontWeight: 500 }}>{item.name}</span>
                                    </div>
                                )}
                                {isTicket && item.quantity && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#166534' }}>Quantité</span>
                                        <span style={{ fontSize: '0.8125rem', color: '#14532d', fontWeight: 500 }}>{item.quantity} place{item.quantity > 1 ? 's' : ''}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isVote ? 0 : 8 }}>
                                    <span style={{ fontSize: '0.8125rem', color: '#166534' }}>Montant</span>
                                    <strong style={{ color: '#14532d', fontSize: '0.9375rem' }}>{item.amount}</strong>
                                </div>
                                {!isVote && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#166534' }}>{isTicket ? 'Participant' : 'Donateur'}</span>
                                        <span style={{ fontSize: '0.8125rem', color: '#14532d', fontWeight: 500 }}>{item.name}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {reference && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginBottom: 24 }}>
                                Référence SharePay : <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{reference}</code>
                            </p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link href={isTicket ? '/events' : isVote ? '/contests' : '/donate'} style={{
                                display: 'block', padding: '11px', background: '#16A34A', color: '#fff',
                                borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem',
                            }}>
                                <i className={`bi ${isTicket ? 'bi-calendar-event' : isVote ? 'bi-trophy' : 'bi-heart-fill'} me-2`} />
                                {isTicket ? 'Voir les événements' : isVote ? 'Voir les concours' : 'Faire un autre don'}
                            </Link>
                            <Link href="/" style={{
                                display: 'block', padding: '11px', background: 'var(--titi-surface)', color: 'var(--titi-text)',
                                borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem',
                                border: '1px solid var(--titi-border)',
                            }}>
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ModernFooter />
        </>
    );
}
