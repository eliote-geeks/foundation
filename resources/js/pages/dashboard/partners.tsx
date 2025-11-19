import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Table, Badge, Button, Nav, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';

interface PartnersProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Partners({ user }: PartnersProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddModal, setShowAddModal] = useState(false);

    const stats = [
        { title: 'Partenaires actifs', value: '24', change: '+3', positive: true, color: '#5FA145', icon: 'bi-building-check' },
        { title: 'Collaborations', value: '45', change: '+12', positive: true, color: '#667eea', icon: 'bi-handshake' },
        { title: 'Contrats en cours', value: '8', change: '+2', positive: true, color: '#E4518C', icon: 'bi-file-contract' },
        { title: 'Revenus partenaires', value: '21.250.000 FCFA', change: '+18%', positive: true, color: '#C69438', icon: 'bi-graph-up' }
    ];

    const partners = [
        { id: 1, name: 'Entreprise ABC', type: 'Corporate', status: 'Actif', since: '2023-01-15', contribution: '9.800.000 FCFA', contact: 'Marie Dupont' },
        { id: 2, name: 'Association XYZ', type: 'Non-profit', status: 'Actif', since: '2023-03-10', contribution: '5.560.000 FCFA', contact: 'Jean Martin' },
        { id: 3, name: 'Fondation 123', type: 'Foundation', status: 'En négociation', since: '2024-01-20', contribution: '16.350.000 FCFA', contact: 'Sophie Bernard' },
        { id: 4, name: 'Tech Solutions', type: 'Technology', status: 'Actif', since: '2022-09-05', contribution: '7.840.000 FCFA', contact: 'Pierre Dubois' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Actif': return 'success';
            case 'En négociation': return 'warning';
            case 'Suspendu': return 'danger';
            default: return 'secondary';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Corporate': return '#5FA145';
            case 'Non-profit': return '#667eea';
            case 'Foundation': return '#E4518C';
            case 'Technology': return '#C69438';
            default: return '#6c757d';
        }
    };

    return (
        <DashboardLayout title="Partenaires" user={user}>
            <div className="partners-page">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Partenaires</h2>
                        <p className="text-muted mb-0">Gestion des partenariats et collaborations</p>
                    </div>
                    <Button 
                        style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nouveau partenaire
                    </Button>
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
                                    <Badge bg="success" className="rounded-pill">{stat.change}</Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="mb-4">
                    <Nav variant="pills" className="nav-fill">
                        {[
                            { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-eye' },
                            { key: 'partnerships', label: 'Partenariats', icon: 'bi-handshake' },
                            { key: 'contracts', label: 'Contrats', icon: 'bi-file-contract' },
                            { key: 'reports', label: 'Rapports', icon: 'bi-graph-up' }
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

                <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0">Liste des partenaires</h5>
                        <div className="d-flex gap-2">
                            <Button variant="outline-secondary" size="sm">
                                <i className="bi bi-funnel me-2"></i>Filtrer
                            </Button>
                            <Button variant="outline-primary" size="sm">
                                <i className="bi bi-download me-2"></i>Exporter
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead style={{ backgroundColor: '#F8F9FA' }}>
                                <tr>
                                    <th className="border-0 py-3 px-4">Nom</th>
                                    <th className="border-0 py-3">Type</th>
                                    <th className="border-0 py-3">Statut</th>
                                    <th className="border-0 py-3">Depuis</th>
                                    <th className="border-0 py-3">Contribution</th>
                                    <th className="border-0 py-3">Contact</th>
                                    <th className="border-0 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partners.map((partner) => (
                                    <tr key={partner.id}>
                                        <td className="py-3 px-4">
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                    style={{ width: '40px', height: '40px', backgroundColor: `${getTypeColor(partner.type)}20`, color: getTypeColor(partner.type) }}
                                                >
                                                    <i className="bi bi-building"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{partner.name}</div>
                                                    <small className="text-muted">ID: {partner.id}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <Badge style={{ backgroundColor: getTypeColor(partner.type), color: 'white' }}>
                                                {partner.type}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            <Badge bg={getStatusColor(partner.status)}>
                                                {partner.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-muted">
                                            {new Date(partner.since).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-3 fw-semibold text-success">
                                            {partner.contribution}
                                        </td>
                                        <td className="py-3">{partner.contact}</td>
                                        <td className="py-3">
                                            <div className="d-flex gap-1">
                                                <Button variant="outline-primary" size="sm">
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button variant="outline-success" size="sm">
                                                    <i className="bi bi-pencil"></i>
                                                </Button>
                                                <Button variant="outline-danger" size="sm">
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un nouveau partenaire</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nom du partenaire</Form.Label>
                                        <Form.Control type="text" placeholder="Nom de l'organisation" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Type de partenaire</Form.Label>
                                        <Form.Select>
                                            <option>Sélectionner un type</option>
                                            <option value="Corporate">Corporate</option>
                                            <option value="Non-profit">Non-profit</option>
                                            <option value="Foundation">Foundation</option>
                                            <option value="Technology">Technology</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contact principal</Form.Label>
                                        <Form.Control type="text" placeholder="Nom du contact" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="contact@partenaire.com" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Description du partenariat</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Décrivez la nature du partenariat..." />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Annuler
                        </Button>
                        <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                            Ajouter le partenaire
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
