import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Table, Badge, Button, Nav, ProgressBar } from 'react-bootstrap';
import { useState } from 'react';

interface FinancesProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Finances({ user }: FinancesProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { title: 'Revenus totaux', value: '57.142.500 FCFA', change: '+15%', positive: true, color: '#5FA145', icon: 'bi-arrow-up-circle' },
        { title: 'Dépenses totales', value: '40.721.000 FCFA', change: '+8%', positive: false, color: '#E4518C', icon: 'bi-arrow-down-circle' },
        { title: 'Solde disponible', value: '16.421.500 FCFA', change: '+7%', positive: true, color: '#667eea', icon: 'bi-wallet2' },
        { title: 'Budget mensuel', value: '7.840.000 FCFA', change: '0%', positive: true, color: '#C69438', icon: 'bi-calendar-month' }
    ];

    const transactions = [
        { id: 1, type: 'Recette', description: 'Don - Marie Dubois', amount: 97500, date: '2024-08-19', category: 'Dons', status: 'Confirmé' },
        { id: 2, type: 'Dépense', description: 'Achat matériel collecte', amount: -159750, date: '2024-08-18', category: 'Matériel', status: 'Payé' },
        { id: 3, type: 'Recette', description: 'Subvention municipale', amount: 3250000, date: '2024-08-15', category: 'Subventions', status: 'Confirmé' }
    ];

    const budgetCategories = [
        { name: 'Projets sociaux', budget: 29375000, spent: 21225000, color: '#5FA145' },
        { name: 'Fonctionnement', budget: 11750000, spent: 9270000, color: '#667eea' },
        { name: 'Communications', budget: 5220000, spent: 3985000, color: '#E4518C' },
        { name: 'Événements', budget: 7840000, spent: 6232000, color: '#C69438' }
    ];

    return (
        <DashboardLayout title="Finances" user={user}>
            <div className="finances-page">
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Finances</h2>
                    <p className="text-muted mb-0">Suivi financier et gestion budgétaire</p>
                </div>

                <Row className="g-4 mb-4">
                    {stats.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>{stat.value}</h3>
                                            <p className="text-muted mb-2 small">{stat.title}</p>
                                        </div>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                                             style={{ width: '48px', height: '48px', backgroundColor: stat.color, color: 'white' }}>
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                    <Badge bg={stat.positive ? 'success' : 'danger'} className="rounded-pill">{stat.change}</Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="mb-4">
                    <Nav variant="pills" className="nav-fill">
                        {[
                            { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-pie-chart' },
                            { key: 'transactions', label: 'Transactions', icon: 'bi-list-ul' },
                            { key: 'budget', label: 'Budget', icon: 'bi-wallet' }
                        ].map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}
                                         style={{ backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent' }}>
                                    <i className={`${tab.icon} me-2`}></i>{tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {activeTab === 'overview' && (
                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4 text-center" style={{ minHeight: '300px' }}>
                                    <i className="bi bi-graph-up mb-3" style={{ fontSize: '3rem', color: '#5FA145' }}></i>
                                    <h4 className="fw-bold mb-3">Graphiques financiers</h4>
                                    <p className="text-muted">Les graphiques détaillés seront disponibles prochainement</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0">
                                    <h6 className="fw-bold mb-0">Répartition budget</h6>
                                </Card.Header>
                                <Card.Body>
                                    {budgetCategories.map((category, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small">{category.name}</span>
                                                <span className="small fw-medium">€{category.spent.toLocaleString()}</span>
                                            </div>
                                            <ProgressBar now={(category.spent / category.budget) * 100} 
                                                        style={{ height: '6px', backgroundColor: `${category.color}20` }} />
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {activeTab === 'transactions' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0">
                            <h5 className="fw-bold mb-0">Transactions récentes</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4">Description</th>
                                        <th className="border-0 py-3">Type</th>
                                        <th className="border-0 py-3">Montant</th>
                                        <th className="border-0 py-3">Catégorie</th>
                                        <th className="border-0 py-3">Date</th>
                                        <th className="border-0 py-3">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="py-3 px-4">{transaction.description}</td>
                                            <td className="py-3">
                                                <Badge bg={transaction.type === 'Recette' ? 'success' : 'danger'}>
                                                    {transaction.type}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <span className={transaction.amount > 0 ? 'text-success' : 'text-danger'}>
                                                    {Math.abs(transaction.amount).toLocaleString()} FCFA
                                                </span>
                                            </td>
                                            <td className="py-3 text-muted">{transaction.category}</td>
                                            <td className="py-3 text-muted">{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                                            <td className="py-3"><Badge bg="success">{transaction.status}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                {activeTab === 'budget' && (
                    <Row className="g-4">
                        {budgetCategories.map((category, index) => (
                            <Col lg={6} key={index}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <Card.Body className="p-4">
                                        <h5 className="fw-bold mb-3">{category.name}</h5>
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Utilisé: €{category.spent.toLocaleString()}</span>
                                                <span>Budget: €{category.budget.toLocaleString()}</span>
                                            </div>
                                            <ProgressBar now={(category.spent / category.budget) * 100} 
                                                        style={{ height: '8px' }} />
                                        </div>
                                        <div className="text-muted small">
                                            {Math.round((category.spent / category.budget) * 100)}% du budget utilisé
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </DashboardLayout>
    );
}
