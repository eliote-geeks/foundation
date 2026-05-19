import DashboardLayout from '../../layouts/dashboard-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, Row, Col, Table, Badge, Button, Nav, ProgressBar, Modal, Form, Alert } from 'react-bootstrap';
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

interface Expense {
    id: number;
    title: string;
    description: string | null;
    amount: number;
    formatted: string;
    currency: string;
    category: string;
    category_label: string;
    expense_date: string;
    payment_method: string | null;
    status: string;
    reference: string | null;
    notes: string | null;
}

interface ExpenseCategory {
    category: string;
    label: string;
    amount: number;
    formatted: string;
}

interface ExpenseStats {
    total: number;
    totalFormatted: string;
    month: number;
    monthFormatted: string;
    lastMonth: number;
    netBalance: number;
    netFormatted: string;
    netPositive: boolean;
}

interface FinancesProps {
    user?: { name: string; email: string; avatar?: string };
    stats: Stat[];
    transactions: Transaction[];
    revenueBySource: RevenueSource[];
    monthlyRevenue: MonthlyRevenue[];
    totals: Totals;
    expenses: Expense[];
    expenseByCategory: ExpenseCategory[];
    expenseStats: ExpenseStats;
    expenseCategories: Record<string, string>;
}

const sourceColors: Record<string, string> = {
    Don: 'success',
    Billet: 'primary',
    Vote: 'warning',
};

const statusColors: Record<string, string> = {
    paid: 'success',
    pending: 'warning',
    cancelled: 'secondary',
};

const statusLabels: Record<string, string> = {
    paid: 'Payée',
    pending: 'En attente',
    cancelled: 'Annulée',
};

const emptyForm = {
    title: '',
    description: '',
    amount: '',
    currency: 'XAF',
    category: 'other',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    status: 'paid',
    reference: '',
    notes: '',
};

export default function Finances({
    user, stats, transactions, revenueBySource, monthlyRevenue, totals,
    expenses, expenseByCategory, expenseStats, expenseCategories,
}: FinancesProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'expenses'>('overview');
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const maxMonthly = Math.max(...monthlyRevenue.map(m => m.total), 1);
    const maxExpCat = Math.max(...expenseByCategory.map(e => e.amount), 1);

    const { data, setData, post, put, processing, errors, reset } = useForm(emptyForm);

    function openAdd() {
        setEditingExpense(null);
        reset();
        setData(emptyForm);
        setShowModal(true);
    }

    function openEdit(e: Expense) {
        setEditingExpense(e);
        setData({
            title: e.title,
            description: e.description ?? '',
            amount: String(e.amount),
            currency: e.currency,
            category: e.category,
            expense_date: e.expense_date,
            payment_method: e.payment_method ?? '',
            status: e.status,
            reference: e.reference ?? '',
            notes: e.notes ?? '',
        });
        setShowModal(true);
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (editingExpense) {
            put(`/dashboard/finances/expenses/${editingExpense.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post('/dashboard/finances/expenses', {
                onSuccess: () => { setShowModal(false); reset(); },
            });
        }
    }

    function confirmDelete(id: number) {
        setDeleteId(id);
    }

    function doDelete() {
        if (!deleteId) return;
        router.delete(`/dashboard/finances/expenses/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    }

    const cardStyle = { boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--titi-border)', background: 'var(--titi-white)' };

    return (
        <DashboardLayout title="Finances" user={user}>
            <Head title="Finances" />
            <div className="finances-page">
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: 'var(--titi-text)' }}>Finances</h2>
                    <p className="mb-0" style={{ color: 'var(--titi-sub)' }}>Revenus, dépenses et budget</p>
                </div>

                {/* Revenue stats */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, i) => (
                        <Col lg={3} md={6} key={i}>
                            <Card className="h-100 border-0" style={cardStyle}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: 'var(--titi-text)' }}>{stat.value}</h3>
                                            <p className="mb-2 small" style={{ color: 'var(--titi-sub)' }}>{stat.title}</p>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 48, height: 48, backgroundColor: stat.color, color: 'white', flexShrink: 0 }}
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

                {/* Budget summary bar */}
                <Row className="g-3 mb-4">
                    <Col md={4}>
                        <div className="rounded-3 p-3 d-flex align-items-center gap-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#16a34a', color: '#fff', flexShrink: 0 }}>
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <div>
                                <div className="small" style={{ color: '#15803d', fontWeight: 500 }}>Total revenus</div>
                                <div className="fw-bold" style={{ color: '#14532d', fontSize: '1.1rem' }}>{totals.total.toLocaleString('fr-FR')} XAF</div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="rounded-3 p-3 d-flex align-items-center gap-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#dc2626', color: '#fff', flexShrink: 0 }}>
                                <i className="bi bi-graph-down-arrow"></i>
                            </div>
                            <div>
                                <div className="small" style={{ color: '#b91c1c', fontWeight: 500 }}>Total dépenses</div>
                                <div className="fw-bold" style={{ color: '#7f1d1d', fontSize: '1.1rem' }}>{expenseStats.totalFormatted}</div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div
                            className="rounded-3 p-3 d-flex align-items-center gap-3"
                            style={{
                                background: expenseStats.netPositive ? '#f0fdf4' : '#fef2f2',
                                border: `1px solid ${expenseStats.netPositive ? '#bbf7d0' : '#fecaca'}`,
                            }}
                        >
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: 44, height: 44, background: expenseStats.netPositive ? '#16a34a' : '#dc2626', color: '#fff', flexShrink: 0 }}
                            >
                                <i className={`bi ${expenseStats.netPositive ? 'bi-piggy-bank' : 'bi-exclamation-triangle'}`}></i>
                            </div>
                            <div>
                                <div className="small" style={{ color: expenseStats.netPositive ? '#15803d' : '#b91c1c', fontWeight: 500 }}>
                                    {expenseStats.netPositive ? 'Solde net' : 'Déficit'}
                                </div>
                                <div className="fw-bold" style={{ color: expenseStats.netPositive ? '#14532d' : '#7f1d1d', fontSize: '1.1rem' }}>
                                    {expenseStats.netPositive ? '+' : '-'}{expenseStats.netFormatted}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Tabs */}
                <div className="mb-4">
                    <Nav variant="pills" className="nav-fill">
                        {([
                            { key: 'overview',      label: 'Vue d\'ensemble', icon: 'bi-pie-chart' },
                            { key: 'transactions',  label: 'Transactions',    icon: 'bi-list-ul' },
                            { key: 'expenses',      label: 'Dépenses',        icon: 'bi-receipt' },
                        ] as const).map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link
                                    active={activeTab === tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                        borderColor:     activeTab === tab.key ? '#5FA145' : 'var(--titi-border)',
                                        color:           activeTab === tab.key ? '#fff'    : 'var(--titi-sub)',
                                    }}
                                >
                                    <i className={`${tab.icon} me-2`}></i>{tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {/* ── Vue d'ensemble ── */}
                {activeTab === 'overview' && (
                    <Row className="g-4">
                        <Col lg={4}>
                            <Card className="h-100 border-0" style={cardStyle}>
                                <Card.Header className="border-0 pt-4 pb-2" style={{ background: 'var(--titi-white)' }}>
                                    <h6 className="fw-bold mb-0" style={{ color: 'var(--titi-text)' }}>Répartition des revenus</h6>
                                </Card.Header>
                                <Card.Body>
                                    {revenueBySource.map((src, i) => {
                                        const pct = totals.total > 0 ? Math.round((src.amount / totals.total) * 100) : 0;
                                        return (
                                            <div key={i} className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="rounded-circle d-inline-block" style={{ width: 10, height: 10, backgroundColor: src.color }} />
                                                        <span className="small fw-medium" style={{ color: 'var(--titi-text)' }}>{src.name}</span>
                                                    </div>
                                                    <span className="small" style={{ color: 'var(--titi-sub)' }}>{pct}%</span>
                                                </div>
                                                <ProgressBar now={pct} style={{ height: 6, backgroundColor: `${src.color}20` }}>
                                                    <ProgressBar now={pct} style={{ backgroundColor: src.color }} />
                                                </ProgressBar>
                                                <div className="small mt-1" style={{ color: 'var(--titi-sub)' }}>{src.formatted}</div>
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={8}>
                            <Card className="border-0" style={cardStyle}>
                                <Card.Header className="border-0 pt-4 pb-2 d-flex justify-content-between align-items-center" style={{ background: 'var(--titi-white)' }}>
                                    <h6 className="fw-bold mb-0" style={{ color: 'var(--titi-text)' }}>Revenus mensuels (12 mois)</h6>
                                </Card.Header>
                                <Card.Body>
                                    {monthlyRevenue.every(m => m.total === 0) ? (
                                        <div className="text-center py-4" style={{ color: 'var(--titi-sub)' }}>
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

                        {/* Dépenses par catégorie */}
                        <Col xs={12}>
                            <Card className="border-0" style={cardStyle}>
                                <Card.Header className="border-0 pt-4 pb-2" style={{ background: 'var(--titi-white)' }}>
                                    <h6 className="fw-bold mb-0" style={{ color: 'var(--titi-text)' }}>Dépenses par catégorie</h6>
                                </Card.Header>
                                <Card.Body>
                                    {expenseByCategory.every(e => e.amount === 0) ? (
                                        <div className="text-center py-3" style={{ color: 'var(--titi-sub)' }}>
                                            <i className="bi bi-receipt fs-2 d-block mb-2"></i>
                                            Aucune dépense enregistrée
                                        </div>
                                    ) : (
                                        <Row className="g-3">
                                            {expenseByCategory.filter(e => e.amount > 0).map((e, i) => {
                                                const pct = Math.round((e.amount / maxExpCat) * 100);
                                                return (
                                                    <Col md={4} key={i}>
                                                        <div className="mb-1 d-flex justify-content-between">
                                                            <span className="small fw-medium" style={{ color: 'var(--titi-text)' }}>{e.label}</span>
                                                            <span className="small" style={{ color: 'var(--titi-sub)' }}>{e.formatted}</span>
                                                        </div>
                                                        <ProgressBar now={pct} style={{ height: 6 }} variant="danger" />
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* ── Transactions ── */}
                {activeTab === 'transactions' && (
                    <Card className="border-0" style={cardStyle}>
                        <Card.Header className="border-0 py-3 d-flex justify-content-between align-items-center" style={{ background: 'var(--titi-white)' }}>
                            <h5 className="fw-bold mb-0" style={{ color: 'var(--titi-text)' }}>
                                Transactions récentes
                                <span className="fw-normal fs-6 ms-2" style={{ color: 'var(--titi-sub)' }}>({transactions.length})</span>
                            </h5>
                            <div className="d-flex gap-2 small" style={{ color: 'var(--titi-sub)' }}>
                                {Object.entries(sourceColors).map(([src, color]) => (
                                    <span key={src} className="d-flex align-items-center gap-1">
                                        <Badge bg={color}>{src}</Badge>
                                    </span>
                                ))}
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {transactions.length === 0 ? (
                                <div className="text-center py-5" style={{ color: 'var(--titi-sub)' }}>
                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                    Aucune transaction enregistrée
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead style={{ backgroundColor: 'var(--titi-surface)' }}>
                                        <tr>
                                            <th className="border-0 py-3 px-4" style={{ color: 'var(--titi-sub)' }}>Description</th>
                                            <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Source</th>
                                            <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Montant</th>
                                            <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Date</th>
                                            <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(tx => (
                                            <tr key={tx.id}>
                                                <td className="py-3 px-4" style={{ color: 'var(--titi-text)' }}>{tx.description}</td>
                                                <td className="py-3">
                                                    <Badge bg={sourceColors[tx.source] ?? 'secondary'}>{tx.source}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <span className="fw-bold text-success">{tx.formatted}</span>
                                                </td>
                                                <td className="py-3 small" style={{ color: 'var(--titi-sub)' }}>
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

                {/* ── Dépenses ── */}
                {activeTab === 'expenses' && (
                    <div>
                        {/* Sub-header */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span className="fw-semibold" style={{ color: 'var(--titi-text)' }}>
                                    {expenses.length} dépense{expenses.length !== 1 ? 's' : ''}
                                </span>
                                <span className="ms-3 small" style={{ color: 'var(--titi-sub)' }}>
                                    Ce mois: <strong>{expenseStats.monthFormatted}</strong>
                                </span>
                            </div>
                            <Button
                                size="sm"
                                style={{ backgroundColor: '#5FA145', borderColor: '#5FA145', color: '#fff' }}
                                onClick={openAdd}
                            >
                                <i className="bi bi-plus-lg me-1"></i>Nouvelle dépense
                            </Button>
                        </div>

                        <Card className="border-0" style={cardStyle}>
                            <Card.Body className="p-0">
                                {expenses.length === 0 ? (
                                    <div className="text-center py-5" style={{ color: 'var(--titi-sub)' }}>
                                        <i className="bi bi-receipt fs-1 d-block mb-3"></i>
                                        Aucune dépense enregistrée
                                        <div className="mt-2">
                                            <Button size="sm" variant="outline-success" onClick={openAdd}>
                                                <i className="bi bi-plus-lg me-1"></i>Ajouter une dépense
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Table responsive hover className="mb-0">
                                        <thead style={{ backgroundColor: 'var(--titi-surface)' }}>
                                            <tr>
                                                <th className="border-0 py-3 px-4" style={{ color: 'var(--titi-sub)' }}>Titre</th>
                                                <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Catégorie</th>
                                                <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Montant</th>
                                                <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Date</th>
                                                <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Statut</th>
                                                <th className="border-0 py-3" style={{ color: 'var(--titi-sub)' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.map(e => (
                                                <tr key={e.id}>
                                                    <td className="py-3 px-4">
                                                        <div className="fw-medium" style={{ color: 'var(--titi-text)' }}>{e.title}</div>
                                                        {e.reference && (
                                                            <div className="small" style={{ color: 'var(--titi-sub)' }}>Réf: {e.reference}</div>
                                                        )}
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg="secondary" className="rounded-pill">{e.category_label}</Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="fw-bold text-danger">{e.formatted}</span>
                                                    </td>
                                                    <td className="py-3 small" style={{ color: 'var(--titi-sub)' }}>
                                                        {new Date(e.expense_date).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg={statusColors[e.status] ?? 'secondary'}>
                                                            {statusLabels[e.status] ?? e.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline-secondary"
                                                                style={{ padding: '2px 8px' }}
                                                                onClick={() => openEdit(e)}
                                                                title="Modifier"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                style={{ padding: '2px 8px' }}
                                                                onClick={() => confirmDelete(e.id)}
                                                                title="Supprimer"
                                                            >
                                                                <i className="bi bi-trash"></i>
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
                    </div>
                )}
            </div>

            {/* ── Expense form modal ── */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                    <Modal.Title style={{ color: 'var(--titi-text)', fontSize: '1rem', fontWeight: 600 }}>
                        {editingExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body style={{ background: 'var(--titi-white)' }}>
                        <Row className="g-3">
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Titre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        isInvalid={!!errors.title}
                                        placeholder="Ex: Achat de matériel"
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Montant *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        isInvalid={!!errors.amount}
                                        placeholder="0"
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Devise</Form.Label>
                                    <Form.Select
                                        value={data.currency}
                                        onChange={e => setData('currency', e.target.value)}
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    >
                                        <option value="XAF">XAF</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Catégorie *</Form.Label>
                                    <Form.Select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    >
                                        {Object.entries(expenseCategories).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={data.expense_date}
                                        onChange={e => setData('expense_date', e.target.value)}
                                        isInvalid={!!errors.expense_date}
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.expense_date}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Statut</Form.Label>
                                    <Form.Select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    >
                                        <option value="paid">Payée</option>
                                        <option value="pending">En attente</option>
                                        <option value="cancelled">Annulée</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Mode de paiement</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.payment_method}
                                        onChange={e => setData('payment_method', e.target.value)}
                                        placeholder="Ex: Mobile Money, Virement..."
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Référence</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.reference}
                                        onChange={e => setData('reference', e.target.value)}
                                        placeholder="N° facture, reçu..."
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Description optionnelle..."
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-medium" style={{ color: 'var(--titi-sub)' }}>Notes internes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Notes internes..."
                                        style={{ background: 'var(--titi-white)', color: 'var(--titi-text)', borderColor: 'var(--titi-border)' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            style={{ backgroundColor: '#5FA145', borderColor: '#5FA145', color: '#fff' }}
                        >
                            {processing ? <><i className="bi bi-hourglass-split me-1"></i>Enregistrement...</> : (editingExpense ? 'Mettre à jour' : 'Ajouter')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── Delete confirm modal ── */}
            <Modal show={deleteId !== null} onHide={() => setDeleteId(null)} centered>
                <Modal.Header closeButton style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                    <Modal.Title style={{ color: 'var(--titi-text)', fontSize: '1rem', fontWeight: 600 }}>
                        Confirmer la suppression
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--titi-white)', color: 'var(--titi-sub)' }}>
                    Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
                </Modal.Body>
                <Modal.Footer style={{ background: 'var(--titi-white)', borderColor: 'var(--titi-border)' }}>
                    <Button variant="outline-secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
                    <Button variant="danger" onClick={doDelete}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </DashboardLayout>
    );
}
