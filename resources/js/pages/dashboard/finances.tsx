import DashboardLayout from '../../layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col, Table, Badge, Button, Nav, ProgressBar } from 'react-bootstrap';
import { useState } from 'react';

interface Stat {
    title: string;
    value: string;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface Transaction {
    id: string;
    type: string;
    source: string;
    description: string;
    amount: number;
    formatted: string;
    date: string | null;
    status: string;
}

interface RevenueSource {
    name: string;
    amount: number;
    formatted: string;
    color: string;
}

interface MonthlyRevenue {
    month: string;
    total: number;
    dons: number;
    billets: number;
    votes: number;
}

interface Totals {
    donations: number;
    tickets: number;
    votes: number;
    total: number;
}

interface FinancesProps {
    user?: { name: string; email: string; avatar?: string };
    stats: Stat[];
    transactions: Transaction[];
    revenueBySource: RevenueSource[];
    monthlyRevenue: MonthlyRevenue[];
    totals: Totals;
}

const sourceColors: Record<string, string> = {
    Don: 'success',
    Billet: 'primary',
    Vote: 'warning',
};

export default function Finances({ user, stats, transactions, revenueBySource, monthlyRevenue, totals }: FinancesProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

    const maxMonthly = Math.max(...monthlyRevenue.map(m => m.total), 1);

    return (
        <DashboardLayout title="Finances" user={user}>
            <Head title="Finances" />
            <div className="finances-page">
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Finances</h2>
                    <p className="text-muted mb-0">Suivi des revenus de la fondation</p>
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
                    <Nav variant="pills" className="nav-fill">
                        {([
                            { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-pie-chart' },
                            { key: 'transactions', label: 'Transactions', icon: 'bi-list-ul' },
                        ] as const).map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link
                                    active={activeTab === tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                        borderColor: activeTab === tab.key ? '#5FA145' : '#dee2e6',
                                        color: activeTab === tab.key ? '#fff' : '#6c757d',
                                    }}
                                >
                                    <i className={`${tab.icon} me-2`}></i>{tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {/* Vue d'ensemble */}
                {activeTab === 'overview' && (
                    <Row className="g-4">
                        {/* Répartition par source */}
                        <Col lg={4}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Répartition des revenus</h6>
                                </Card.Header>
                                <Card.Body>
                                    {revenueBySource.map((src, i) => {
                                        const pct = totals.total > 0 ? Math.round((src.amount / totals.total) * 100) : 0;
                                        return (
                                            <div key={i} className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span
                                                            className="rounded-circle d-inline-block"
                                                            style={{ width: 10, height: 10, backgroundColor: src.color }}
                                                        />
                                                        <span className="small fw-medium">{src.name}</span>
                                                    </div>
                                                    <span className="small text-muted">{pct}%</span>
                                                </div>
                                                <ProgressBar
                                                    now={pct}
                                                    style={{ height: 6, backgroundColor: `${src.color}20` }}
                                                >
                                                    <ProgressBar now={pct} style={{ backgroundColor: src.color }} />
                                                </ProgressBar>
                                                <div className="text-muted small mt-1">{src.formatted}</div>
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Évolution mensuelle */}
                        <Col lg={8}>
                            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold mb-0">Revenus mensuels (12 mois)</h6>
                                </Card.Header>
                                <Card.Body>
                                    {monthlyRevenue.every(m => m.total === 0) ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-graph-up fs-1 d-block mb-2"></i>
                                            Aucune donnée pour cette période
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-end gap-1" style={{ height: 180 }}>
                                            {monthlyRevenue.map((m, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-fill d-flex flex-column align-items-center gap-1"
                                                    title={`${m.month}: ${m.total.toLocaleString()} XAF`}
                                                >
                                                    <div
                                                        className="w-100 rounded-top"
                                                        style={{
                                                            height: Math.max(4, (m.total / maxMonthly) * 150),
                                                            backgroundColor: '#5FA145',
                                                            opacity: 0.8,
                                                            transition: 'height 0.3s',
                                                        }}
                                                    />
                                                    <span
                                                        className="text-muted"
                                                        style={{ fontSize: 9, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                                                    >
                                                        {m.month.split(' ')[0]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Note dépenses */}
                        <Col xs={12}>
                            <Card className="border-0 border-start border-warning border-3" style={{ backgroundColor: '#fffbf0' }}>
                                <Card.Body className="py-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-info-circle text-warning"></i>
                                        <span className="small text-muted">
                                            Le suivi des <strong>dépenses et du budget</strong> nécessite une table dédiée en base de données.
                                            Cette fonctionnalité sera disponible après la migration correspondante.
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Transactions */}
                {activeTab === 'transactions' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                Transactions récentes
                                <span className="text-muted fw-normal fs-6 ms-2">({transactions.length})</span>
                            </h5>
                            <div className="d-flex gap-2 small text-muted">
                                {Object.entries(sourceColors).map(([src, color]) => (
                                    <span key={src} className="d-flex align-items-center gap-1">
                                        <Badge bg={color}>{src}</Badge>
                                    </span>
                                ))}
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {transactions.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                    Aucune transaction enregistrée
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead style={{ backgroundColor: '#F8F9FA' }}>
                                        <tr>
                                            <th className="border-0 py-3 px-4">Description</th>
                                            <th className="border-0 py-3">Source</th>
                                            <th className="border-0 py-3">Montant</th>
                                            <th className="border-0 py-3">Date</th>
                                            <th className="border-0 py-3">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(tx => (
                                            <tr key={tx.id}>
                                                <td className="py-3 px-4">{tx.description}</td>
                                                <td className="py-3">
                                                    <Badge bg={sourceColors[tx.source] ?? 'secondary'}>{tx.source}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <span className="fw-bold text-success">{tx.formatted}</span>
                                                </td>
                                                <td className="py-3 text-muted small">
                                                    {tx.date ? new Date(tx.date).toLocaleDateString('fr-FR') : '—'}
                                                </td>
                                                <td className="py-3">
                                                    <Badge bg="success">{tx.status}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
