import { Card, Row, Col, ProgressBar, Badge, Button } from 'react-bootstrap';
import { useState } from 'react';

interface FinancialData {
    totalRevenue: number;
    totalExpenses: number;
    budget: number;
    transactions: Transaction[];
    monthlyData: MonthlyFinancial[];
}

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    category: string;
    date: string;
    status: 'completed' | 'pending' | 'cancelled';
}

interface MonthlyFinancial {
    month: string;
    revenue: number;
    expenses: number;
    target: number;
}

export function FinancialModule() {
    const [activeView, setActiveView] = useState<'overview' | 'transactions' | 'budget'>('overview');

    const financialData: FinancialData = {
        totalRevenue: 45750000, // 45.75M FCFA
        totalExpenses: 32400000, // 32.4M FCFA
        budget: 50000000, // 50M FCFA
        transactions: [
            {
                id: '1',
                type: 'income',
                description: 'Vente de billets - Conférence Innovation',
                amount: 2500000,
                category: 'Événements',
                date: '2025-01-15',
                status: 'completed'
            },
            {
                id: '2',
                type: 'expense',
                description: 'Location salle de conférence',
                amount: 850000,
                category: 'Événements',
                date: '2025-01-14',
                status: 'completed'
            },
            {
                id: '3',
                type: 'income',
                description: 'Partenariat Orange Cameroun',
                amount: 10000000,
                category: 'Partenariats',
                date: '2025-01-12',
                status: 'completed'
            },
            {
                id: '4',
                type: 'expense',
                description: 'Matériel informatique',
                amount: 1200000,
                category: 'Équipements',
                date: '2025-01-10',
                status: 'pending'
            }
        ],
        monthlyData: [
            { month: 'Jan', revenue: 45750000, expenses: 32400000, target: 50000000 },
            { month: 'Déc', revenue: 38200000, expenses: 28900000, target: 45000000 },
            { month: 'Nov', revenue: 42100000, expenses: 31200000, target: 45000000 },
        ]
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('XAF', 'FCFA');
    };

    const getTransactionIcon = (type: string, category: string): string => {
        if (type === 'income') {
            switch (category) {
                case 'Événements': return 'bi-calendar-event';
                case 'Partenariats': return 'bi-handshake';
                case 'Donations': return 'bi-heart';
                default: return 'bi-arrow-up-circle';
            }
        } else {
            switch (category) {
                case 'Événements': return 'bi-calendar-event';
                case 'Équipements': return 'bi-laptop';
                case 'Personnel': return 'bi-people';
                default: return 'bi-arrow-down-circle';
            }
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'completed': return '#5FA145';
            case 'pending': return '#C69438';
            case 'cancelled': return '#E4518C';
            default: return '#6B7280';
        }
    };

    const budgetUsed = (financialData.totalExpenses / financialData.budget) * 100;
    const netProfit = financialData.totalRevenue - financialData.totalExpenses;
    const profitMargin = ((netProfit / financialData.totalRevenue) * 100);

    return (
        <div className="financial-module">
            {/* Module Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                        <i className="bi bi-currency-exchange me-2"></i>
                        Module Financier
                    </h4>
                    <p className="mb-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                        Gestion des finances et budgets de la fondation
                    </p>
                </div>
                <div className="btn-group" role="group">
                    {[
                        { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-pie-chart' },
                        { key: 'transactions', label: 'Transactions', icon: 'bi-list-ul' },
                        { key: 'budget', label: 'Budget', icon: 'bi-wallet2' }
                    ].map(view => (
                        <Button
                            key={view.key}
                            size="sm"
                            variant={activeView === view.key ? 'primary' : 'outline-secondary'}
                            onClick={() => setActiveView(view.key as any)}
                            style={{
                                backgroundColor: activeView === view.key ? '#5FA145' : 'transparent',
                                borderColor: '#5FA145',
                                color: activeView === view.key ? '#FFF' : '#5FA145'
                            }}
                        >
                            <i className={`${view.icon} me-1`}></i>
                            {view.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Overview */}
            {activeView === 'overview' && (
                <Row className="g-4">
                    {/* Key Financial Metrics */}
                    <Col lg={8}>
                        <Row className="g-3 mb-4">
                            <Col md={4}>
                                <Card 
                                    className="border-0 h-100"
                                    style={{
                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                        borderRadius: '15px'
                                    }}
                                >
                                    <Card.Body className="p-3 text-white">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <i className="bi bi-arrow-up-circle" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                                            <Badge bg="light" text="dark" className="px-2">
                                                +12%
                                            </Badge>
                                        </div>
                                        <h6 className="fw-bold mb-1">{formatCurrency(financialData.totalRevenue)}</h6>
                                        <small className="opacity-90">Revenus Total</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card 
                                    className="border-0 h-100"
                                    style={{
                                        background: 'linear-gradient(135deg, #E4518C 0%, #D63384 100%)',
                                        borderRadius: '15px'
                                    }}
                                >
                                    <Card.Body className="p-3 text-white">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <i className="bi bi-arrow-down-circle" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                                            <Badge bg="light" text="dark" className="px-2">
                                                +8%
                                            </Badge>
                                        </div>
                                        <h6 className="fw-bold mb-1">{formatCurrency(financialData.totalExpenses)}</h6>
                                        <small className="opacity-90">Dépenses</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card 
                                    className="border-0 h-100"
                                    style={{
                                        background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                                        borderRadius: '15px'
                                    }}
                                >
                                    <Card.Body className="p-3 text-white">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <i className="bi bi-graph-up" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                                            <Badge bg="light" text="dark" className="px-2">
                                                {profitMargin.toFixed(1)}%
                                            </Badge>
                                        </div>
                                        <h6 className="fw-bold mb-1">{formatCurrency(netProfit)}</h6>
                                        <small className="opacity-90">Bénéfice Net</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Budget Progress */}
                        <Card 
                            className="border-0"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Card.Body className="p-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                    <i className="bi bi-wallet2 me-2"></i>
                                    Utilisation du Budget
                                </h6>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span style={{ color: '#6B7280' }}>
                                            {formatCurrency(financialData.totalExpenses)} / {formatCurrency(financialData.budget)}
                                        </span>
                                        <span 
                                            className="fw-bold"
                                            style={{ 
                                                color: budgetUsed > 80 ? '#E4518C' : budgetUsed > 60 ? '#C69438' : '#5FA145' 
                                            }}
                                        >
                                            {budgetUsed.toFixed(1)}%
                                        </span>
                                    </div>
                                    <ProgressBar 
                                        now={budgetUsed}
                                        style={{ height: '8px' }}
                                        className="rounded-pill"
                                        variant={budgetUsed > 80 ? 'danger' : budgetUsed > 60 ? 'warning' : 'success'}
                                    />
                                </div>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="text-center p-2 rounded-3" style={{ background: '#5FA14515' }}>
                                            <div className="fw-bold" style={{ color: '#5FA145' }}>
                                                {formatCurrency(financialData.budget - financialData.totalExpenses)}
                                            </div>
                                            <small style={{ color: '#6B7280' }}>Budget Restant</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-center p-2 rounded-3" style={{ background: '#C6943815' }}>
                                            <div className="fw-bold" style={{ color: '#C69438' }}>
                                                {Math.ceil((financialData.budget - financialData.totalExpenses) / (financialData.totalExpenses / 30))}
                                            </div>
                                            <small style={{ color: '#6B7280' }}>Jours Restants</small>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Recent Transactions Preview */}
                    <Col lg={4}>
                        <Card 
                            className="border-0 h-100"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                        <i className="bi bi-clock-history me-2"></i>
                                        Dernières Transactions
                                    </h6>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => setActiveView('transactions')}
                                        style={{
                                            borderColor: '#5FA145',
                                            color: '#5FA145',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        Tout voir
                                    </Button>
                                </div>
                                <div className="transactions-list">
                                    {financialData.transactions.slice(0, 4).map(transaction => (
                                        <div key={transaction.id} className="d-flex align-items-center mb-3">
                                            <div 
                                                className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    background: `${transaction.type === 'income' ? '#5FA145' : '#E4518C'}15`,
                                                    color: transaction.type === 'income' ? '#5FA145' : '#E4518C'
                                                }}
                                            >
                                                <i className={getTransactionIcon(transaction.type, transaction.category)} style={{ fontSize: '0.9rem' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold" style={{ fontSize: '0.85rem', color: '#334E15' }}>
                                                    {transaction.description.length > 25 
                                                        ? transaction.description.substring(0, 25) + '...' 
                                                        : transaction.description
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small style={{ color: '#6B7280' }}>{transaction.category}</small>
                                                    <div className="text-end">
                                                        <div 
                                                            className="fw-bold" 
                                                            style={{ 
                                                                color: transaction.type === 'income' ? '#5FA145' : '#E4518C',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount).replace('FCFA', '')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Transactions View */}
            {activeView === 'transactions' && (
                <Card 
                    className="border-0"
                    style={{
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                >
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                Toutes les Transactions
                            </h6>
                            <Button
                                size="sm"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '10px'
                                }}
                            >
                                <i className="bi bi-plus me-1"></i>
                                Nouvelle Transaction
                            </Button>
                        </div>
                        
                        {financialData.transactions.map(transaction => (
                            <div 
                                key={transaction.id}
                                className="d-flex align-items-center p-3 rounded-3 mb-3"
                                style={{
                                    background: '#F8F9FA',
                                    border: '1px solid #E9ECEF'
                                }}
                            >
                                <div 
                                    className="d-flex align-items-center justify-content-center rounded-circle me-4 flex-shrink-0"
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        background: `${transaction.type === 'income' ? '#5FA145' : '#E4518C'}15`,
                                        color: transaction.type === 'income' ? '#5FA145' : '#E4518C'
                                    }}
                                >
                                    <i className={getTransactionIcon(transaction.type, transaction.category)} style={{ fontSize: '1.2rem' }}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <div>
                                            <h6 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                                {transaction.description}
                                            </h6>
                                            <div className="d-flex align-items-center">
                                                <Badge 
                                                    className="me-2"
                                                    style={{ 
                                                        background: `${transaction.type === 'income' ? '#5FA145' : '#E4518C'}20`,
                                                        color: transaction.type === 'income' ? '#5FA145' : '#E4518C',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {transaction.category}
                                                </Badge>
                                                <Badge 
                                                    style={{ 
                                                        background: getStatusColor(transaction.status),
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {transaction.status === 'completed' ? 'Complété' : 
                                                     transaction.status === 'pending' ? 'En attente' : 'Annulé'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div 
                                                className="fw-bold mb-1" 
                                                style={{ 
                                                    color: transaction.type === 'income' ? '#5FA145' : '#E4518C',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </div>
                                            <small style={{ color: '#6B7280' }}>
                                                {new Date(transaction.date).toLocaleDateString('fr-FR')}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            )}

            {/* Budget View */}
            {activeView === 'budget' && (
                <Row className="g-4">
                    <Col xs={12}>
                        <Card 
                            className="border-0"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Card.Body className="p-4">
                                <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    <i className="bi bi-wallet2 me-2"></i>
                                    Gestion du Budget 2025
                                </h6>
                                
                                <div className="row g-4">
                                    <div className="col-md-8">
                                        <div className="budget-categories">
                                            {[
                                                { name: 'Événements & Conférences', allocated: 20000000, spent: 12500000, color: '#5FA145' },
                                                { name: 'Équipements & Infrastructure', allocated: 15000000, spent: 8900000, color: '#C69438' },
                                                { name: 'Personnel & Formation', allocated: 10000000, spent: 7200000, color: '#E4518C' },
                                                { name: 'Marketing & Communication', allocated: 5000000, spent: 3800000, color: '#6366F1' }
                                            ].map((category, index) => {
                                                const percentage = (category.spent / category.allocated) * 100;
                                                return (
                                                    <div key={index} className="mb-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <h6 className="fw-semibold mb-0" style={{ color: '#334E15' }}>
                                                                {category.name}
                                                            </h6>
                                                            <div className="text-end">
                                                                <div style={{ color: category.color, fontWeight: '600' }}>
                                                                    {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                                                                </div>
                                                                <small style={{ color: '#6B7280' }}>
                                                                    {percentage.toFixed(1)}% utilisé
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <ProgressBar 
                                                            now={percentage}
                                                            style={{ 
                                                                height: '8px',
                                                                background: `${category.color}20`
                                                            }}
                                                            className="rounded-pill"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div 
                                            className="p-4 rounded-4 text-center h-100"
                                            style={{
                                                background: 'linear-gradient(135deg, #334E15 0%, #5FA145 100%)',
                                                color: '#FFF'
                                            }}
                                        >
                                            <i className="bi bi-pie-chart-fill mb-3" style={{ fontSize: '3rem', opacity: 0.8 }}></i>
                                            <h5 className="fw-bold mb-2">Budget Total</h5>
                                            <h3 className="fw-bold mb-3">{formatCurrency(financialData.budget)}</h3>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Utilisé:</span>
                                                <span>{formatCurrency(financialData.totalExpenses)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span>Restant:</span>
                                                <span>{formatCurrency(financialData.budget - financialData.totalExpenses)}</span>
                                            </div>
                                            <Button
                                                className="w-100"
                                                style={{
                                                    background: 'rgba(255,255,255,0.2)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    color: '#FFF'
                                                }}
                                            >
                                                <i className="bi bi-pencil me-2"></i>
                                                Modifier Budget
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
}