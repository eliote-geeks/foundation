import DashboardLayout from '../../layouts/dashboard-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, Table, Badge, Button, Alert, Nav } from 'react-bootstrap';
import { useState } from 'react';
import type { SharedData } from '../../types';

interface PendingItem {
    id: number;
    type: 'vote' | 'donation';
    contest?: string;
    campaign?: string;
    user_name: string;
    participant?: string;
    amount: string;
    method: string;
    ref: string | null;
    date: string;
}

interface Props {
    user?: { name: string; email: string };
    pendingVotes: PendingItem[];
    pendingDonations: PendingItem[];
}

export default function PendingPayments({ user, pendingVotes, pendingDonations }: Props) {
    const { flash } = usePage<SharedData & { flash?: { success?: string } }>().props;
    const [tab, setTab] = useState<'votes' | 'donations'>('votes');

    function confirmVote(id: number) {
        router.post(`/dashboard/pending-payments/votes/${id}/confirm`);
    }
    function rejectVote(id: number) {
        if (confirm('Rejeter ce vote ?')) router.post(`/dashboard/pending-payments/votes/${id}/reject`);
    }
    function confirmDonation(id: number) {
        router.post(`/dashboard/pending-payments/donations/${id}/confirm`);
    }
    function rejectDonation(id: number) {
        if (confirm('Rejeter ce don ?')) router.post(`/dashboard/pending-payments/donations/${id}/reject`);
    }

    const cardStyle = { boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: 'var(--titi-white)', border: '1px solid var(--titi-border)' };

    return (
        <DashboardLayout title="Paiements en attente" user={user}>
            <Head title="Paiements en attente" />

            <div className="mb-4">
                <h2 className="fw-bold mb-1" style={{ color: 'var(--titi-text)' }}>Paiements en attente</h2>
                <p className="mb-0" style={{ color: 'var(--titi-sub)' }}>
                    Confirmez les votes et dons après vérification Mobile Money
                </p>
            </div>

            {flash?.success && (
                <Alert variant="success" className="mb-3">
                    <i className="bi bi-check-circle me-2"></i>{flash.success}
                </Alert>
            )}

            {/* Summary badges */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <i className="bi bi-hand-thumbs-up" style={{ color: '#f59e0b' }}></i>
                    <span style={{ fontWeight: 600, color: '#92400e' }}>{pendingVotes.length} vote{pendingVotes.length !== 1 ? 's' : ''} en attente</span>
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <i className="bi bi-heart-fill" style={{ color: '#16A34A' }}></i>
                    <span style={{ fontWeight: 600, color: '#15803d' }}>{pendingDonations.length} don{pendingDonations.length !== 1 ? 's' : ''} en attente</span>
                </div>
            </div>

            <div className="mb-4">
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link active={tab === 'votes'} onClick={() => setTab('votes')}
                            style={{ backgroundColor: tab === 'votes' ? '#5FA145' : 'transparent', borderColor: tab === 'votes' ? '#5FA145' : 'var(--titi-border)', color: tab === 'votes' ? '#fff' : 'var(--titi-sub)' }}
                        >
                            <i className="bi bi-hand-thumbs-up me-2"></i>Votes ({pendingVotes.length})
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link active={tab === 'donations'} onClick={() => setTab('donations')}
                            style={{ backgroundColor: tab === 'donations' ? '#5FA145' : 'transparent', borderColor: tab === 'donations' ? '#5FA145' : 'var(--titi-border)', color: tab === 'donations' ? '#fff' : 'var(--titi-sub)' }}
                        >
                            <i className="bi bi-heart me-2"></i>Dons ({pendingDonations.length})
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            {tab === 'votes' && (
                <Card className="border-0" style={cardStyle}>
                    <Card.Body className="p-0">
                        {pendingVotes.length === 0 ? (
                            <div className="text-center py-5" style={{ color: 'var(--titi-sub)' }}>
                                <i className="bi bi-check-circle fs-1 d-block mb-3 text-success"></i>
                                Aucun vote en attente de confirmation
                            </div>
                        ) : (
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: 'var(--titi-surface)' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4" style={{ color: 'var(--titi-sub)' }}>Votant</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Concours / Projet</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Montant</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Référence</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Date</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingVotes.map(v => (
                                        <tr key={v.id}>
                                            <td className="py-3 px-4" style={{ color: 'var(--titi-text)' }}>
                                                <div className="fw-medium">{v.user_name}</div>
                                                <div className="small" style={{ color: 'var(--titi-sub)' }}>{v.method}</div>
                                            </td>
                                            <td className="py-3">
                                                <div style={{ color: 'var(--titi-text)', fontWeight: 500 }}>{v.contest}</div>
                                                {v.participant && <div className="small" style={{ color: 'var(--titi-sub)' }}>Projet : {v.participant}</div>}
                                            </td>
                                            <td className="py-3">
                                                <span className="fw-bold text-success">{v.amount}</span>
                                            </td>
                                            <td className="py-3 small" style={{ color: 'var(--titi-text)', fontFamily: 'monospace' }}>{v.ref ?? '—'}</td>
                                            <td className="py-3 small" style={{ color: 'var(--titi-sub)' }}>
                                                {new Date(v.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex gap-1">
                                                    <Button size="sm" variant="outline-success" style={{ padding: '2px 10px', fontSize: '0.75rem' }} onClick={() => confirmVote(v.id)}>
                                                        <i className="bi bi-check2 me-1"></i>Confirmer
                                                    </Button>
                                                    <Button size="sm" variant="outline-danger" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => rejectVote(v.id)}>
                                                        <i className="bi bi-x"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            )}

            {tab === 'donations' && (
                <Card className="border-0" style={cardStyle}>
                    <Card.Body className="p-0">
                        {pendingDonations.length === 0 ? (
                            <div className="text-center py-5" style={{ color: 'var(--titi-sub)' }}>
                                <i className="bi bi-check-circle fs-1 d-block mb-3 text-success"></i>
                                Aucun don en attente de confirmation
                            </div>
                        ) : (
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: 'var(--titi-surface)' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4" style={{ color: 'var(--titi-sub)' }}>Donateur</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Campagne</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Montant</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Référence</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Date</th>
                                        <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingDonations.map(d => (
                                        <tr key={d.id}>
                                            <td className="py-3 px-4">
                                                <div className="fw-medium" style={{ color: 'var(--titi-text)' }}>{d.user_name}</div>
                                                <div className="small" style={{ color: 'var(--titi-sub)' }}>{d.method}</div>
                                            </td>
                                            <td className="py-3" style={{ color: 'var(--titi-text)' }}>{d.campaign ?? '—'}</td>
                                            <td className="py-3">
                                                <span className="fw-bold text-success">{d.amount}</span>
                                            </td>
                                            <td className="py-3 small" style={{ color: 'var(--titi-text)', fontFamily: 'monospace' }}>{d.ref ?? '—'}</td>
                                            <td className="py-3 small" style={{ color: 'var(--titi-sub)' }}>
                                                {new Date(d.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex gap-1">
                                                    <Button size="sm" variant="outline-success" style={{ padding: '2px 10px', fontSize: '0.75rem' }} onClick={() => confirmDonation(d.id)}>
                                                        <i className="bi bi-check2 me-1"></i>Confirmer
                                                    </Button>
                                                    <Button size="sm" variant="outline-danger" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => rejectDonation(d.id)}>
                                                        <i className="bi bi-x"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            )}
        </DashboardLayout>
    );
}
