import DashboardLayout from '../../layouts/dashboard-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import type { SharedData } from '../../types';

interface Entry {
    id: number;
    entry_number: string;
    title: string;
    description: string;
    status: string;
    status_label: string;
    author_name: string;
    submitted_at: string | null;
    votes_count: number;
}

interface Props {
    user?: { name: string; email: string };
    contest: { id: number; title: string };
    entries: Entry[];
}

const STATUS_COLORS: Record<string, string> = {
    approved: 'success',
    pending:  'warning',
    rejected: 'danger',
    draft:    'secondary',
};

export default function ContestEntries({ user, contest, entries }: Props) {
    const { flash } = usePage<SharedData & { flash?: { success?: string; error?: string } }>().props;

    function approve(entryId: number) {
        router.post(`/dashboard/contests/${contest.id}/entries/${entryId}/approve`);
    }
    function reject(entryId: number) {
        router.post(`/dashboard/contests/${contest.id}/entries/${entryId}/reject`);
    }

    return (
        <DashboardLayout title="Projets soumis" user={user}>
            <Head title={`Projets — ${contest.title}`} />

            <div className="mb-4 d-flex justify-content-between align-items-start">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Link href="/dashboard/contests" style={{ color: 'var(--titi-sub)', fontSize: '0.875rem', textDecoration: 'none' }}>
                            <i className="bi bi-arrow-left me-1"></i>Concours
                        </Link>
                        <span style={{ color: 'var(--titi-border)' }}>/</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--titi-sub)' }}>{contest.title}</span>
                    </div>
                    <h2 className="fw-bold mb-1" style={{ color: 'var(--titi-text)' }}>Projets soumis</h2>
                    <p className="mb-0" style={{ color: 'var(--titi-sub)' }}>
                        {entries.length} projet{entries.length !== 1 ? 's' : ''} — approuvez ou rejetez les soumissions
                    </p>
                </div>
            </div>

            {flash?.success && (
                <Alert variant="success" className="mb-3">
                    <i className="bi bi-check-circle me-2"></i>{flash.success}
                </Alert>
            )}

            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: 'var(--titi-white)', border: '1px solid var(--titi-border)' }}>
                <Card.Body className="p-0">
                    {entries.length === 0 ? (
                        <div className="text-center py-5" style={{ color: 'var(--titi-sub)' }}>
                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                            Aucun projet soumis pour ce concours.
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead style={{ backgroundColor: 'var(--titi-surface)' }}>
                                <tr>
                                    <th className="border-0 py-3 px-4" style={{ color: 'var(--titi-sub)' }}>Projet</th>
                                    <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Auteur</th>
                                    <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Votes</th>
                                    <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Soumis le</th>
                                    <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Statut</th>
                                    <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(e => (
                                    <tr key={e.id}>
                                        <td className="py-3 px-4">
                                            <div className="fw-medium" style={{ color: 'var(--titi-text)' }}>{e.title}</div>
                                            <div className="small" style={{ color: 'var(--titi-sub)' }}>{e.entry_number}</div>
                                            <div className="small mt-1" style={{ color: 'var(--titi-sub)', maxWidth: 300 }}>
                                                {e.description.length > 100 ? e.description.slice(0, 100) + '…' : e.description}
                                            </div>
                                        </td>
                                        <td className="py-3" style={{ color: 'var(--titi-text)' }}>{e.author_name}</td>
                                        <td className="py-3">
                                            <span className="fw-bold" style={{ color: 'var(--titi-text)' }}>{e.votes_count}</span>
                                        </td>
                                        <td className="py-3 small" style={{ color: 'var(--titi-sub)' }}>
                                            {e.submitted_at ? new Date(e.submitted_at).toLocaleDateString('fr-FR') : '—'}
                                        </td>
                                        <td className="py-3">
                                            <Badge bg={STATUS_COLORS[e.status] ?? 'secondary'}>{e.status_label}</Badge>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex gap-1">
                                                {e.status !== 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-success"
                                                        style={{ padding: '2px 10px', fontSize: '0.75rem' }}
                                                        onClick={() => approve(e.id)}
                                                    >
                                                        <i className="bi bi-check2 me-1"></i>Approuver
                                                    </Button>
                                                )}
                                                {e.status !== 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        style={{ padding: '2px 10px', fontSize: '0.75rem' }}
                                                        onClick={() => reject(e.id)}
                                                    >
                                                        <i className="bi bi-x me-1"></i>Rejeter
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </DashboardLayout>
    );
}
