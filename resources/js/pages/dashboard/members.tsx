import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Table, Badge, Button, Form, InputGroup, Dropdown, ProgressBar } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface MembersProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    filter?: string;
}

export default function Members({ user, filter }: MembersProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(filter || 'all');

    const stats = [
        {
            title: 'Total Membres',
            value: '1,342',
            change: '+12%',
            positive: true,
            color: '#5FA145'
        },
        {
            title: 'Adhérents',
            value: '890',
            change: '+8%',
            positive: true,
            color: '#667eea'
        },
        {
            title: 'Ambassadeurs',
            value: '234',
            change: '+15%',
            positive: true,
            color: '#E4518C'
        },
        {
            title: 'Bénévoles',
            value: '218',
            change: '+5%',
            positive: true,
            color: '#C69438'
        }
    ];

    const members = [
        {
            id: 1,
            name: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            type: 'Adhérent',
            status: 'Actif',
            joinDate: '2024-01-15',
            lastActivity: '2 heures',
            avatar: null
        },
        {
            id: 2,
            name: 'Jean Mbong',
            email: 'jean.mbong@email.com',
            type: 'Ambassadeur',
            status: 'Actif',
            joinDate: '2023-11-20',
            lastActivity: '1 jour',
            avatar: null
        },
        {
            id: 3,
            name: 'Sophie Martin',
            email: 'sophie.martin@email.com',
            type: 'Bénévole',
            status: 'Inactif',
            joinDate: '2024-03-10',
            lastActivity: '1 semaine',
            avatar: null
        },
        {
            id: 4,
            name: 'Paul Nguyen',
            email: 'paul.nguyen@email.com',
            type: 'Adhérent',
            status: 'Actif',
            joinDate: '2024-05-22',
            lastActivity: '3 heures',
            avatar: null
        },
        {
            id: 5,
            name: 'Aminata Ba',
            email: 'aminata.ba@email.com',
            type: 'Ambassadeur',
            status: 'Actif',
            joinDate: '2023-12-05',
            lastActivity: '30 minutes',
            avatar: null
        }
    ];

    const getStatusBadge = (status: string) => {
        const variant = status === 'Actif' ? 'success' : 'secondary';
        return <Badge bg={variant}>{status}</Badge>;
    };

    const getTypeBadge = (type: string) => {
        const colors: any = {
            'Adhérent': 'primary',
            'Ambassadeur': 'warning',
            'Bénévole': 'info'
        };
        return <Badge bg={colors[type] || 'secondary'}>{type}</Badge>;
    };

    return (
        <DashboardLayout title="Gestion des Membres" user={user}>
            <div className="members-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                Gestion des Membres
                            </h2>
                            <p className="text-muted mb-0">
                                Gérez tous les membres de votre fondation
                            </p>
                        </div>
                        <Button 
                            style={{
                                backgroundColor: '#5FA145',
                                borderColor: '#5FA145'
                            }}
                        >
                            <i className="bi bi-person-plus me-2"></i>
                            Ajouter un membre
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>
                                                {stat.value}
                                            </h3>
                                            <p className="text-muted mb-2 small">
                                                {stat.title}
                                            </p>
                                        </div>
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                backgroundColor: stat.color,
                                                color: 'white'
                                            }}
                                        >
                                            <i className="bi bi-people fs-5"></i>
                                        </div>
                                    </div>
                                    <Badge 
                                        bg={stat.positive ? 'success' : 'danger'}
                                        className="rounded-pill"
                                    >
                                        {stat.change}
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Filters and Search */}
                <Card className="mb-4 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-4">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Rechercher un membre..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="adherent">Adhérents</option>
                                    <option value="ambassador">Ambassadeurs</option>
                                    <option value="volunteer">Bénévoles</option>
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" className="w-100">
                                        <i className="bi bi-funnel me-2"></i>
                                        Filtres
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Membres actifs</Dropdown.Item>
                                        <Dropdown.Item>Membres inactifs</Dropdown.Item>
                                        <Dropdown.Item>Nouveaux membres</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item>Exporter la liste</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Members Table */}
                <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Header className="bg-white border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                Liste des Membres ({members.length})
                            </h5>
                            <div className="d-flex gap-2">
                                <Button variant="outline-secondary" size="sm">
                                    <i className="bi bi-download me-2"></i>
                                    Exporter
                                </Button>
                                <Button variant="outline-secondary" size="sm">
                                    <i className="bi bi-printer me-2"></i>
                                    Imprimer
                                </Button>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead style={{ backgroundColor: '#F8F9FA' }}>
                                <tr>
                                    <th className="border-0 py-3 px-4">Membre</th>
                                    <th className="border-0 py-3">Type</th>
                                    <th className="border-0 py-3">Statut</th>
                                    <th className="border-0 py-3">Date d'adhésion</th>
                                    <th className="border-0 py-3">Dernière activité</th>
                                    <th className="border-0 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => (
                                    <tr key={member.id}>
                                        <td className="py-3 px-4">
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#5FA145',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-medium" style={{ color: '#1F2937' }}>
                                                        {member.name}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            {getTypeBadge(member.type)}
                                        </td>
                                        <td className="py-3">
                                            {getStatusBadge(member.status)}
                                        </td>
                                        <td className="py-3 text-muted">
                                            {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-3 text-muted">
                                            {member.lastActivity}
                                        </td>
                                        <td className="py-3 text-center">
                                            <Dropdown>
                                                <Dropdown.Toggle 
                                                    variant="link" 
                                                    size="sm"
                                                    className="p-0 border-0"
                                                    style={{ color: '#6B7280' }}
                                                >
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        <i className="bi bi-eye me-2"></i>
                                                        Voir le profil
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <i className="bi bi-pencil me-2"></i>
                                                        Modifier
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <i className="bi bi-envelope me-2"></i>
                                                        Envoyer un message
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item className="text-danger">
                                                        <i className="bi bi-trash me-2"></i>
                                                        Supprimer
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                                Affichage 1-5 sur {members.length} résultats
                            </div>
                            <nav>
                                <Button variant="outline-secondary" size="sm" className="me-2" disabled>
                                    Précédent
                                </Button>
                                <Button variant="outline-secondary" size="sm">
                                    Suivant
                                </Button>
                            </nav>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        </DashboardLayout>
    );
}