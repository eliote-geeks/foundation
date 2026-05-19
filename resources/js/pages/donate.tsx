import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';
import type { SharedData } from '../types';

interface Campaign {
    id: number;
    title: string;
    description: string;
    image: string | null;
    target: number;
    raised: number;
    percentage: number;
    donor_count: number;
    currency: string;
    slug: string;
}

interface RecentDonation {
    name: string;
    amount: string;
    campaign: string | null;
    date: string;
}

interface DonateProps {
    user?: { name: string; email: string; is_admin?: boolean };
    campaigns: Campaign[];
    recentDonations: RecentDonation[];
    stats: { total_raised: string; donor_count: number; campaign_count: number };
    settings: { mtn_number: string; orange_number: string; contact_name: string };
}

const SUGGESTED = [5000, 10000, 25000, 50000, 100000];

export default function Donate({ user, campaigns, recentDonations, stats, settings }: DonateProps) {
    const { flash } = usePage<SharedData & { flash?: { success?: string; error?: string } }>().props;
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0] ?? null);
    const [payMethod, setPayMethod] = useState<'mtn' | 'orange' | 'bank_transfer' | 'other'>('mtn');
    const [customAmount, setCustomAmount] = useState(false);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        campaign_id: String(campaigns[0]?.id ?? ''),
        amount: '10000',
        payment_method: 'mtn',
        transaction_ref: '',
        donor_name: user?.name ?? '',
        donor_phone: '',
        donor_email: user?.email ?? '',
        donor_message: '',
        is_anonymous: false,
    });

    function selectCampaign(c: Campaign) {
        setSelectedCampaign(c);
        setData('campaign_id', String(c.id));
    }

    function selectAmount(a: number) {
        setCustomAmount(false);
        setData('amount', String(a));
    }

    function handlePayMethod(m: typeof payMethod) {
        setPayMethod(m);
        setData('payment_method', m);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/donate', { onSuccess: () => reset('transaction_ref', 'donor_message') });
    }

    const payNumber = payMethod === 'mtn' ? settings.mtn_number : payMethod === 'orange' ? settings.orange_number : null;
    const amountNum = parseInt(data.amount) || 0;

    return (
        <>
            <Head title="Faire un don — TITI EVENTS" />
            <ModernHeader user={user} />

            <div style={{ background: 'var(--titi-surface)', minHeight: '100vh', paddingTop: 66 }}>

                {/* Hero */}
                <div style={{ background: 'linear-gradient(135deg, #16A34A 0%, #14532d 100%)', padding: '48px 0 40px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 20, marginBottom: 14 }}>
                            <i className="bi bi-heart-fill" style={{ color: '#fff', fontSize: '0.875rem' }}></i>
                            <span style={{ color: '#fff', fontSize: '0.8125rem', fontWeight: 600 }}>Soutenez nos actions</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: 10 }}>Faire un don</h1>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', margin: 0 }}>
                            Votre soutien finance nos événements et projets communautaires.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
                            {[
                                { icon: 'bi-cash-stack', label: 'Total collecté', value: stats.total_raised },
                                { icon: 'bi-people-fill', label: 'Donateurs', value: String(stats.donor_count) },
                                { icon: 'bi-megaphone-fill', label: 'Campagnes actives', value: String(stats.campaign_count) },
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <i className={`bi ${s.icon}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', display: 'block' }}></i>
                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{s.value}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

                    {/* Flash */}
                    {flash?.success && (
                        <div style={{ padding: '14px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 20, color: '#15803d', fontWeight: 500 }}>
                            <i className="bi bi-check-circle-fill me-2"></i>{flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, marginBottom: 20, color: '#b91c1c', fontWeight: 500 }}>
                            <i className="bi bi-exclamation-circle-fill me-2"></i>{flash.error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28 }}>

                        {/* Left: campaigns + recent donations */}
                        <div>
                            {/* Campaigns */}
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 12 }}>
                                Choisissez une campagne
                            </h2>
                            {campaigns.length === 0 ? (
                                <div style={{ padding: '28px', background: 'var(--titi-white)', borderRadius: 10, border: '1px solid var(--titi-border)', textAlign: 'center', color: 'var(--titi-sub)' }}>
                                    <i className="bi bi-megaphone" style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }}></i>
                                    Aucune campagne active pour le moment.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                                    {campaigns.map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => selectCampaign(c)}
                                            style={{
                                                padding: '14px 18px', background: 'var(--titi-white)', borderRadius: 10, cursor: 'pointer',
                                                border: `2px solid ${selectedCampaign?.id === c.id ? '#16A34A' : 'var(--titi-border)'}`,
                                                transition: 'border-color 0.15s',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--titi-text)' }}>{c.title}</div>
                                                    <div style={{ fontSize: '0.8125rem', color: 'var(--titi-sub)', marginTop: 2 }}>{c.description}</div>
                                                </div>
                                                {selectedCampaign?.id === c.id && (
                                                    <i className="bi bi-check-circle-fill text-success ms-2" style={{ flexShrink: 0, fontSize: '1.1rem' }}></i>
                                                )}
                                            </div>
                                            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3 }}>
                                                <div style={{ height: '100%', width: `${c.percentage}%`, background: '#16A34A', borderRadius: 3 }}></div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.75rem', color: 'var(--titi-sub)' }}>
                                                <span>{c.raised.toLocaleString('fr-FR')} / {c.target.toLocaleString('fr-FR')} {c.currency}</span>
                                                <span>{c.percentage}% — {c.donor_count} donateur{c.donor_count !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Recent donations */}
                            {recentDonations.length > 0 && (
                                <>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--titi-text)', marginBottom: 12 }}>
                                        <i className="bi bi-heart me-2 text-success"></i>Dons récents
                                    </h2>
                                    <div style={{ background: 'var(--titi-white)', borderRadius: 10, border: '1px solid var(--titi-border)', overflow: 'hidden' }}>
                                        {recentDonations.map((d, i) => (
                                            <div key={i} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '10px 16px', borderBottom: i < recentDonations.length - 1 ? '1px solid var(--titi-border)' : 'none',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <i className="bi bi-heart-fill" style={{ color: '#16A34A', fontSize: '0.75rem' }}></i>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: 'var(--titi-text)', fontSize: '0.875rem' }}>{d.name}</div>
                                                        {d.campaign && <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)' }}>{d.campaign}</div>}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 700, color: '#16A34A', fontSize: '0.875rem' }}>{d.amount}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--titi-sub)' }}>{d.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right: donation form */}
                        <div>
                            <div style={{ background: 'var(--titi-white)', borderRadius: 12, border: '1px solid var(--titi-border)', overflow: 'hidden', position: 'sticky', top: 80 }}>
                                <div style={{ background: '#16A34A', padding: '16px 20px' }}>
                                    <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                                        <i className="bi bi-heart-fill me-2"></i>
                                        {selectedCampaign ? `Don — ${selectedCampaign.title}` : 'Faire un don'}
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                        {/* Amount */}
                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 8 }}>
                                                Montant (XAF) *
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
                                                {SUGGESTED.slice(0, 6).map(a => (
                                                    <button
                                                        key={a}
                                                        type="button"
                                                        onClick={() => selectAmount(a)}
                                                        style={{
                                                            padding: '7px 4px', border: `1.5px solid ${!customAmount && data.amount === String(a) ? '#16A34A' : 'var(--titi-border)'}`,
                                                            borderRadius: 6, background: !customAmount && data.amount === String(a) ? '#f0fdf4' : 'var(--titi-white)',
                                                            color: !customAmount && data.amount === String(a) ? '#16A34A' : 'var(--titi-text)',
                                                            fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                                                        }}
                                                    >
                                                        {(a / 1000)}K
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="number"
                                                min="1000"
                                                value={customAmount ? data.amount : ''}
                                                onChange={e => { setCustomAmount(true); setData('amount', e.target.value); }}
                                                onFocus={() => setCustomAmount(true)}
                                                placeholder="Autre montant…"
                                                style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${customAmount ? '#16A34A' : 'var(--titi-border)'}`, borderRadius: 6, fontSize: '0.875rem', background: 'var(--titi-white)', color: 'var(--titi-text)', outline: 'none' }}
                                            />
                                            {errors.amount && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: 4 }}>{errors.amount}</div>}
                                        </div>

                                        {/* Payment method */}
                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 8 }}>
                                                Mode de paiement *
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                                {[
                                                    { key: 'mtn',           label: 'MTN Money',    icon: 'bi-phone', color: '#f59e0b' },
                                                    { key: 'orange',        label: 'Orange Money', icon: 'bi-phone', color: '#ea580c' },
                                                    { key: 'bank_transfer', label: 'Virement',     icon: 'bi-bank',  color: '#2563eb' },
                                                    { key: 'other',         label: 'Autre',         icon: 'bi-three-dots', color: '#6b7280' },
                                                ].map(m => (
                                                    <button
                                                        key={m.key}
                                                        type="button"
                                                        onClick={() => handlePayMethod(m.key as typeof payMethod)}
                                                        style={{
                                                            padding: '8px 10px', border: `1.5px solid ${payMethod === m.key ? m.color : 'var(--titi-border)'}`,
                                                            borderRadius: 8, background: payMethod === m.key ? `${m.color}15` : 'var(--titi-white)',
                                                            cursor: 'pointer', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--titi-text)',
                                                        }}
                                                    >
                                                        <i className={`bi ${m.icon} me-1`} style={{ color: m.color }}></i>{m.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment instructions */}
                                        {payNumber && (
                                            <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
                                                <div style={{ fontSize: '0.8125rem', color: '#15803d', fontWeight: 600, marginBottom: 4 }}>
                                                    <i className="bi bi-info-circle me-1"></i>Instructions de paiement
                                                </div>
                                                <div style={{ fontSize: '0.8125rem', color: '#166534' }}>
                                                    Envoyez <strong>{amountNum > 0 ? amountNum.toLocaleString('fr-FR') + ' XAF' : 'le montant'}</strong> au :
                                                </div>
                                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#14532d', letterSpacing: '0.05em', margin: '4px 0' }}>{payNumber}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#166534' }}>Bénéficiaire : <strong>{settings.contact_name}</strong></div>
                                                <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: 4 }}>
                                                    Notez la référence SMS reçue après le paiement
                                                </div>
                                            </div>
                                        )}

                                        {/* Transaction ref */}
                                        {(payMethod === 'mtn' || payMethod === 'orange') && (
                                            <div>
                                                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 4 }}>
                                                    Référence de transaction *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.transaction_ref}
                                                    onChange={e => setData('transaction_ref', e.target.value)}
                                                    placeholder="Ex: MP26050001234"
                                                    style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${errors.transaction_ref ? '#dc2626' : 'var(--titi-border)'}`, borderRadius: 6, fontSize: '0.875rem', background: 'var(--titi-white)', color: 'var(--titi-text)', outline: 'none' }}
                                                />
                                                {errors.transaction_ref && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: 4 }}>{errors.transaction_ref}</div>}
                                            </div>
                                        )}

                                        {/* Donor info */}
                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 4 }}>
                                                Votre nom *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.donor_name}
                                                onChange={e => setData('donor_name', e.target.value)}
                                                placeholder="Votre nom complet"
                                                style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${errors.donor_name ? '#dc2626' : 'var(--titi-border)'}`, borderRadius: 6, fontSize: '0.875rem', background: 'var(--titi-white)', color: 'var(--titi-text)', outline: 'none' }}
                                            />
                                            {errors.donor_name && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: 4 }}>{errors.donor_name}</div>}
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 4 }}>
                                                Téléphone *
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.donor_phone}
                                                onChange={e => setData('donor_phone', e.target.value)}
                                                placeholder="+237 6XX XXX XXX"
                                                style={{ width: '100%', padding: '7px 10px', border: `1.5px solid ${errors.donor_phone ? '#dc2626' : 'var(--titi-border)'}`, borderRadius: 6, fontSize: '0.875rem', background: 'var(--titi-white)', color: 'var(--titi-text)', outline: 'none' }}
                                            />
                                            {errors.donor_phone && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: 4 }}>{errors.donor_phone}</div>}
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 4 }}>
                                                Email (optionnel)
                                            </label>
                                            <input
                                                type="email"
                                                value={data.donor_email}
                                                onChange={e => setData('donor_email', e.target.value)}
                                                placeholder="email@exemple.com"
                                                style={{ width: '100%', padding: '7px 10px', border: '1.5px solid var(--titi-border)', borderRadius: 6, fontSize: '0.875rem', background: 'var(--titi-white)', color: 'var(--titi-text)', outline: 'none' }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--titi-sub)', display: 'block', marginBottom: 4 }}>
                                                Message (optionnel)
                                            </label>
                                            <textarea
                                                value={data.donor_message}
                                                onChange={e => setData('donor_message', e.target.value)}
                                                placeholder="Un message pour l'équipe..."
                                                rows={2}
                                                style={{ width: '100%', padding: '7px 10px', border: '1.5px solid var(--titi-border)', borderRadius: 6, fontSize: '0.875rem', background: 'var(--titi-white)', color: 'var(--titi-text)', outline: 'none', resize: 'vertical' }}
                                            />
                                        </div>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--titi-sub)' }}>
                                            <input
                                                type="checkbox"
                                                checked={data.is_anonymous}
                                                onChange={e => setData('is_anonymous', e.target.checked as false)}
                                            />
                                            Don anonyme (votre nom ne sera pas affiché publiquement)
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={processing || !selectedCampaign}
                                            style={{
                                                width: '100%', padding: '12px', background: processing || !selectedCampaign ? '#9ca3af' : '#16A34A',
                                                color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.9375rem', fontWeight: 700,
                                                cursor: processing || !selectedCampaign ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {processing ? (
                                                <><i className="bi bi-hourglass-split me-2"></i>Envoi en cours…</>
                                            ) : (
                                                <><i className="bi bi-heart-fill me-2"></i>Enregistrer mon don</>
                                            )}
                                        </button>

                                        <p style={{ fontSize: '0.75rem', color: 'var(--titi-sub)', textAlign: 'center', margin: 0 }}>
                                            <i className="bi bi-shield-check me-1"></i>
                                            Votre don sera confirmé après vérification du paiement.
                                            {/* Touchpay API en cours d'intégration */}
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModernFooter />
        </>
    );
}
