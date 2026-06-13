import { Head, Link } from '@inertiajs/react';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

interface Props {
    reference: string | null;
}

export default function PaymentCancel({ reference }: Props) {
    return (
        <>
            <Head title="Paiement annulé — TITI EVENTS" />
            <ModernHeader />
            <div style={{ background: 'var(--titi-surface)', minHeight: '100vh', paddingTop: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: 480, width: '100%', margin: '40px 16px', textAlign: 'center' }}>
                    <div style={{ background: 'var(--titi-white)', border: '1px solid var(--titi-border)', borderRadius: 16, padding: '40px 32px' }}>

                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2', border: '2px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <i className="bi bi-x-circle-fill" style={{ fontSize: '2rem', color: '#DC2626' }} />
                        </div>

                        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--titi-text)', marginBottom: 8 }}>
                            Paiement annulé
                        </h1>
                        <p style={{ color: 'var(--titi-sub)', fontSize: '0.9375rem', marginBottom: 24 }}>
                            Votre don n'a pas été finalisé. Vous pouvez réessayer à tout moment.
                        </p>

                        {reference && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', marginBottom: 24 }}>
                                Référence : <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{reference}</code>
                            </p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link href="/donate" style={{
                                display: 'block', padding: '11px', background: '#16A34A', color: '#fff',
                                borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem',
                            }}>
                                <i className="bi bi-arrow-counterclockwise me-2" />Réessayer le don
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
