import DashboardLayout from '../../layouts/dashboard-layout';
import { Head, router } from '@inertiajs/react';
import { Card, Row, Col, Table, Badge, Button, Form, InputGroup, ProgressBar } from 'react-bootstrap';
import { useState } from 'react';

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface RecentDonation {
    id: number;
    donor: string;
    email: string | null;
    amount: number;
    formatted_amount: string;
    campaign: string | null;
    type: string;
    method: string;
    status: string;
    status_raw: string;
    date: string | null;
    receipt: boolean;
}

interface Campaign {
    id: number;
    title: string;
    description: string;
    goal: number;
    raised: number;
    donors: number;
    endDate: string | null;
    status: string;
    completion_percentage: number;
    formatted_raised: string;
    formatted_goal: string;
}

interface TopDonor {
    name: string;
    totalAmount: number;
    formatted_total: string;
    donations: number;
}

interface DonationsProps {
    user?: { name: string; email: string; avatar?: string };
    stats: Stat[];
    recentDonations: RecentDonation[];
    campaigns: Campaign[];
    topDonors: TopDonor[];
}

export default function Donations({ user, stats, recentDonations, campaigns, topDonors }: DonationsProps) {
    const [activeTab, setActiveTab] = useState<'donations' | 'campaigns' | 'donors'>('donations');
    const [search, setSearch] = useState('');

    const statusVariant: Record<string, string> = {
        'completed': 'success',
        'pending': 'warning',
        'processing': 'info',
        'failed': 'danger',
        'cancelled': 'secondary',
        'refunded': 'info',
    };

    const filteredDonations = recentDonations.filter(d =>
        search === '' ||
        d.donor.toLowerCase().includes(search.toLowerCase()) ||
        (d.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (d.campaign ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout title="Gestion des Dons" user={user}>
            <Head title="Gestion des Dons" />
            <div className="donations-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Gestion des Dons</h2>
                            <p className="text-muted mb-0">Suivez et gérez toutes vos collectes de fonds</p>
                        </div>
                        <Button
                            style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                            onClick={() => router.visit(route('donations.campaigns.index'))}
                        >
                            <i className="bi bi-megaphone me-2"></i>
                            Gérer les campagnes
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, i) => (
                        <Col lg={3} md={6} key={i}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>{stat.value}</h3>
                                            <p className="text-muted mb-2 small">{stat.title}</p>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 48, height: 48, backgroundColor: stat.color, color: 'white' }}
                                        >
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                    <Badge bg={stat.positive ? 'success' : 'danger'} className="rounded-pill">
                                        {stat.change}
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Tabs */}
                <div className="mb-4">
                    <nav className="nav nav-pills nav-fill">
                        {([
                            { key: 'donations', label: 'Dons récents', icon: 'bi-heart' },
                            { key: 'campaigns', label: 'Campagnes', icon: 'bi-megaphone' },
                            { key: 'donors',    label: 'Top Donateurs', icon: 'bi-trophy' },
                        ] as const).map(tab => (
                            <button
                                key={tab.key}
                                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                    borderColor: activeTab === tab.key ? '#5FA145' : '#dee2e6',
                                    color: activeTab === tab.key ? '#fff' : '#6c757d',
                                }}
                            >
                                <i className={`${tab.icon} me-2`}></i>{tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Dons récents */}
                {activeTab === 'donations' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>Dons récents</h5>
                                <div className="d-flex gap-2">
                                    <InputGroup style={{ width: 300 }}>
                                        <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Rechercher un don..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </InputGroup>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => router.visit(route('donations.donors.index'))}
                                    >
                                        <i className="bi bi-arrow-right me-2"></i>Tout voir
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {filteredDonations.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                    Aucun don trouvé
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead style={{ backgroundColor: '#F8F9FA' }}>
                                        <tr>
                                            <th className="border-0 py-3 px-4">Donateur</th>
                                            <th className="border-0 py-3">Montant</th>
                                            <th className="border-0 py-3">Campagne</th>
                                            <th className="border-0 py-3">Type</th>
                                            <th className="border-0 py-3">Méthode</th>
                                            <th className="border-0 py-3">Statut</th>
                                            <th className="border-0 py-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDonations.map(d => (
                                            <tr key={d.id}>
                                                <td className="py-3 px-4">
                                                    <div className="fw-medium" style={{ color: '#1F2937' }}>{d.donor}</div>
                                                    {d.email && <div className="text-muted small">{d.email}</div>}
                                                </td>
                                                <td className="py-3">
                                                    <span className="fw-bold" style={{ color: '#5FA145' }}>{d.formatted_amount}</span>
                                                </td>
                                                <td className="py-3 text-muted">{d.campaign ?? '—'}</td>
                                                <td className="py-3"><Badge bg="primary">{d.type}</Badge></td>
                                                <td className="py-3 text-muted">{d.method}</td>
                                                <td className="py-3">
                                                    <Badge bg={statusVariant[d.status_raw] ?? 'secondary'}>{d.status}</Badge>
                                                </td>
                                                <td className="py-3 text-muted small">
                                                    {d.date ? new Date(d.date).toLocaleDateString('fr-FR') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                )}

                {/* Campagnes */}
                {activeTab === 'campaigns' && (
                    campaigns.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-megaphone fs-1 d-block mb-3"></i>
                            Aucune campagne active
                        </div>
                    ) : (
                        <Row className="g-4">
                            {campaigns.map(c => (
                                <Col lg={6} key={c.id}>
                                    <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="fw-bold mb-1" style={{ color: '#1F2937' }}>{c.title}</h5>
                                                    <p className="text-muted mb-0 small">{c.description}</p>
                                                </div>
                                                <Badge bg="success">{c.status}</Badge>
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="fw-bold" style={{ color: '#5FA145', fontSize: '1.4rem' }}>
                                                        {c.formatted_raised}
                                                    </span>
                                                    <span className="text-muted small">/ {c.formatted_goal}</span>
                                                </div>
                                                <ProgressBar now={c.completion_percentage} style={{ height: 8 }} />
                                                <div className="d-flex justify-content-between mt-2">
                                                    <span className="small text-muted">{c.completion_percentage}% atteint</span>
                                                    <span className="small text-muted">{c.donors} donateurs</span>
                                                </div>
                                            </div>
                                            {c.endDate && (
                                                <div className="mb-3 text-muted small">
                                                    <i className="bi bi-calendar3 me-2"></i>
                                                    Fin le {new Date(c.endDate).toLocaleDateString('fr-FR')}
                                                </div>
                                            )}
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="flex-fill"
                                                    onClick={() => router.visit(route('donations.campaigns.show', c.id))}
                                                >
                                                    <i className="bi bi-eye me-2"></i>Voir détails
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )
                )}

                {/* Top Donateurs */}
                {activeTab === 'donors' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>Top Donateurs</h5>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => router.visit(route('donations.donors.index'))}
                                >
                                    Voir tous
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {topDonors.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-people fs-1 d-block mb-3"></i>
                                    Aucun donateur pour l'instant
                                </div>
                            ) : topDonors.map((d, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#5FA145',
                                                color: 'white',
                                            }}
                                        >
                                            {i < 3
                                                ? <i className="bi bi-trophy-fill"></i>
                                                : <span>{d.name.charAt(0)}</span>
                                            }
                                        </div>
                                        <div>
                                            <div className="fw-medium" style={{ color: '#1F2937' }}>{d.name}</div>
                                            <div className="text-muted small">{d.donations} donation{d.donations > 1 ? 's' : ''}</div>
                                        </div>
                                    </div>
                                    <div className="fw-bold" style={{ color: '#5FA145' }}>{d.formatted_total}</div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
