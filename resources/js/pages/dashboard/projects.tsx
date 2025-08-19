import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Form, InputGroup, Modal, ProgressBar } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface ProjectsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    filter?: string;
}

export default function Projects({ user, filter }: ProjectsProps) {
    const { t } = useTranslation();
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filter === 'active' ? 'En cours' : filter === 'completed' ? 'Terminé' : 'all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'timeline'

    const stats = [
        {
            title: 'Projets actifs',
            value: '18',
            change: '+3',
            positive: true,
            color: '#5FA145',
            icon: 'bi-play-circle-fill'
        },
        {
            title: 'Projets terminés',
            value: '42',
            change: '+7',
            positive: true,
            color: '#667eea',
            icon: 'bi-check-circle-fill'
        },
        {
            title: 'Budget total',
            value: '81.750.000 FCFA',
            change: '+15%',
            positive: true,
            color: '#E4518C',
            icon: 'bi-wallet-fill'
        },
        {
            title: 'Bénéficiaires',
            value: '2,340',
            change: '+28%',
            positive: true,
            color: '#C69438',
            icon: 'bi-person-hearts'
        }
    ];

    const projects = [
        {
            id: 1,
            title: 'Aide alimentaire d\'urgence',
            description: 'Distribution de repas aux familles dans le besoin',
            status: 'Actif',
            priority: 'Haute',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            budget: 25000,
            spent: 15750,
            progress: 63,
            beneficiaries: 450,
            manager: 'Marie Dubois',
            team: 8,
            category: 'Solidarité'
        },
        {
            id: 2,
            title: 'Programme éducation numérique',
            description: 'Formation aux outils numériques pour les jeunes',
            status: 'Actif',
            priority: 'Moyenne',
            startDate: '2024-03-01',
            endDate: '2024-11-30',
            budget: 18000,
            spent: 8200,
            progress: 45,
            beneficiaries: 120,
            manager: 'Jean Mbong',
            team: 5,
            category: 'Éducation'
        },
        {
            id: 3,
            title: 'Rénovation centre d\'accueil',
            description: 'Remise en état du centre d\'accueil principal',
            status: 'En pause',
            priority: 'Basse',
            startDate: '2024-06-01',
            endDate: '2024-10-15',
            budget: 35000,
            spent: 12000,
            progress: 25,
            beneficiaries: 800,
            manager: 'Sophie Martin',
            team: 12,
            category: 'Infrastructure'
        },
        {
            id: 4,
            title: 'Campagne sensibilisation',
            description: 'Sensibilisation aux droits des enfants',
            status: 'Terminé',
            priority: 'Haute',
            startDate: '2024-02-01',
            endDate: '2024-07-31',
            budget: 8000,
            spent: 7850,
            progress: 100,
            beneficiaries: 1500,
            manager: 'Paul Nguyen',
            team: 6,
            category: 'Communication'
        },
        {
            id: 5,
            title: 'Formation professionnelle',
            description: 'Programme de formation aux métiers du bâtiment',
            status: 'Planifié',
            priority: 'Moyenne',
            startDate: '2024-10-01',
            endDate: '2025-03-31',
            budget: 22000,
            spent: 0,
            progress: 0,
            beneficiaries: 60,
            manager: 'Aminata Ba',
            team: 4,
            category: 'Formation'
        }
    ];

    const getStatusBadge = (status: string) => {
        const variants: any = {
            'Actif': 'success',
            'Terminé': 'primary',
            'En pause': 'warning',
            'Planifié': 'info',
            'Annulé': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getPriorityBadge = (priority: string) => {
        const variants: any = {
            'Haute': 'danger',
            'Moyenne': 'warning',
            'Basse': 'success'
        };
        return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
    };

    const getCategoryColor = (category: string) => {
        const colors: any = {
            'Solidarité': '#5FA145',
            'Éducation': '#667eea',
            'Infrastructure': '#E4518C',
            'Communication': '#C69438',
            'Formation': '#764ba2'
        };
        return colors[category] || '#6B7280';
    };

    const getBudgetUsedPercentage = (spent: number, budget: number) => {
        return Math.round((spent / budget) * 100);
    };

    const filteredProjects = selectedStatus === 'all' 
        ? projects 
        : projects.filter(p => p.status === selectedStatus);

    return (
        <DashboardLayout title="Gestion des Projets" user={user}>
            <div className="projects-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                Gestion des Projets
                            </h2>
                            <p className="text-muted mb-0">
                                Suivez et pilotez tous vos projets de A à Z
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <div className="btn-group" role="group">
                                <Button 
                                    variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <i className="bi bi-grid-3x3"></i>
                                </Button>
                                <Button 
                                    variant={viewMode === 'timeline' ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    onClick={() => setViewMode('timeline')}
                                >
                                    <i className="bi bi-diagram-3"></i>
                                </Button>
                            </div>
                            <Button 
                                style={{
                                    backgroundColor: '#5FA145',
                                    borderColor: '#5FA145'
                                }}
                                onClick={() => setShowProjectModal(true)}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Nouveau projet
                            </Button>
                        </div>
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
                                            <i className={`${stat.icon} fs-5`}></i>
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

                {/* Filters */}
                <Card className="mb-4 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-4">
                        <Row className="align-items-center">
                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Rechercher un projet..."
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={2}>
                                <Form.Select 
                                    value={selectedStatus} 
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="all">Tous statuts</option>
                                    <option value="Actif">Actifs</option>
                                    <option value="Terminé">Terminés</option>
                                    <option value="En pause">En pause</option>
                                    <option value="Planifié">Planifiés</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select>
                                    <option value="">Toutes catégories</option>
                                    <option value="solidarite">Solidarité</option>
                                    <option value="education">Éducation</option>
                                    <option value="infrastructure">Infrastructure</option>
                                    <option value="communication">Communication</option>
                                    <option value="formation">Formation</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select>
                                    <option value="">Toutes priorités</option>
                                    <option value="haute">Haute</option>
                                    <option value="moyenne">Moyenne</option>
                                    <option value="basse">Basse</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Button variant="outline-secondary" className="w-100">
                                    <i className="bi bi-funnel me-2"></i>
                                    Filtres
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Projects Grid/Timeline */}
                {viewMode === 'grid' ? (
                    <Row className="g-4">
                        {filteredProjects.map((project) => (
                            <Col lg={6} key={project.id}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div 
                                                        className="rounded me-2"
                                                        style={{
                                                            width: '4px',
                                                            height: '20px',
                                                            backgroundColor: getCategoryColor(project.category)
                                                        }}
                                                    ></div>
                                                    <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                                        {project.title}
                                                    </h5>
                                                </div>
                                                <p className="text-muted mb-2 small">
                                                    {project.description}
                                                </p>
                                            </div>
                                            <div className="d-flex flex-column gap-1 ms-3">
                                                {getStatusBadge(project.status)}
                                                {getPriorityBadge(project.priority)}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="small text-muted">Progression</span>
                                                <span className="small fw-medium">{project.progress}%</span>
                                            </div>
                                            <ProgressBar 
                                                now={project.progress}
                                                style={{ height: '6px' }}
                                            />
                                        </div>

                                        <Row className="g-3 mb-3">
                                            <Col xs={6}>
                                                <div className="text-center">
                                                    <div className="fw-bold" style={{ color: '#5FA145' }}>
                                                        {project.spent.toLocaleString()} FCFA
                                                    </div>
                                                    <div className="text-muted small">
                                                        / {project.budget.toLocaleString()} FCFA
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        Budget utilisé
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <div className="text-center">
                                                    <div className="fw-bold" style={{ color: '#E4518C' }}>
                                                        {project.beneficiaries}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        Bénéficiaires
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between text-muted small">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-calendar3 me-1"></i>
                                                    {new Date(project.startDate).toLocaleDateString('fr-FR')}
                                                    <i className="bi bi-arrow-right mx-2"></i>
                                                    {new Date(project.endDate).toLocaleDateString('fr-FR')}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-people me-1"></i>
                                                    {project.team} membres
                                                </div>
                                            </div>
                                            <div className="text-muted small mt-1">
                                                <i className="bi bi-person-badge me-1"></i>
                                                Chef de projet: {project.manager}
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" className="flex-fill">
                                                <i className="bi bi-eye me-2"></i>
                                                Détails
                                            </Button>
                                            <Button variant="outline-secondary" size="sm" className="flex-fill">
                                                <i className="bi bi-pencil me-2"></i>
                                                Modifier
                                            </Button>
                                            <Button variant="outline-secondary" size="sm">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Body className="p-4 text-center" style={{ minHeight: '400px' }}>
                            <i className="bi bi-diagram-3 mb-3" style={{ fontSize: '3rem', color: '#5FA145' }}></i>
                            <h4 className="fw-bold mb-3" style={{ color: '#1F2937' }}>
                                Vue Timeline
                            </h4>
                            <p className="text-muted mb-4">
                                La vue timeline avec diagramme de Gantt sera disponible prochainement pour visualiser la planification de vos projets.
                            </p>
                            <Button variant="outline-primary" onClick={() => setViewMode('grid')}>
                                Retour à la vue grille
                            </Button>
                        </Card.Body>
                    </Card>
                )}

                {/* Create Project Modal */}
                <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Créer un nouveau projet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titre du projet</Form.Label>
                                        <Form.Control type="text" placeholder="Ex: Programme d'aide alimentaire" />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Priorité</Form.Label>
                                        <Form.Select>
                                            <option value="">Choisir une priorité</option>
                                            <option value="haute">Haute</option>
                                            <option value="moyenne">Moyenne</option>
                                            <option value="basse">Basse</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Description détaillée du projet..." />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Catégorie</Form.Label>
                                        <Form.Select>
                                            <option value="">Choisir une catégorie</option>
                                            <option value="solidarite">Solidarité</option>
                                            <option value="education">Éducation</option>
                                            <option value="infrastructure">Infrastructure</option>
                                            <option value="communication">Communication</option>
                                            <option value="formation">Formation</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Chef de projet</Form.Label>
                                        <Form.Select>
                                            <option value="">Assigner un chef de projet</option>
                                            <option value="marie">Marie Dubois</option>
                                            <option value="jean">Jean Mbong</option>
                                            <option value="sophie">Sophie Martin</option>
                                            <option value="paul">Paul Nguyen</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date de début</Form.Label>
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date de fin prévue</Form.Label>
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Budget (FCFA)</Form.Label>
                                        <Form.Control type="number" placeholder="25000" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bénéficiaires estimés</Form.Label>
                                        <Form.Control type="number" placeholder="450" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowProjectModal(false)}>
                            Annuler
                        </Button>
                        <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                            Créer le projet
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}