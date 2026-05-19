import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Table, Badge, Button, Nav, Modal, Form, Image } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface ContentProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    tab?: string;
}

export default function Content({ user, tab }: ContentProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(tab || 'overview');
    const [showAddModal, setShowAddModal] = useState(false);

    const stats = [
        { title: 'Articles publiés', value: '127', change: '+15', positive: true, color: '#5FA145', icon: 'bi-journal-text' },
        { title: 'Médias stockés', value: '843', change: '+42', positive: true, color: '#4A8A2A', icon: 'bi-images' },
        { title: 'Pages vues', value: '25.6K', change: '+8%', positive: true, color: '#C69438', icon: 'bi-eye' },
        { title: 'Engagement', value: '4.2%', change: '+1.1%', positive: true, color: '#C69438', icon: 'bi-heart' }
    ];

    const articles = [
        { id: 1, title: 'Nouveau projet en Afrique', status: 'Publié', author: 'Marie Dubois', date: '2024-08-15', views: 1200, category: 'Projets' },
        { id: 2, title: 'Rapport annuel 2024', status: 'Brouillon', author: 'Jean Martin', date: '2024-08-10', views: 0, category: 'Rapports' },
        { id: 3, title: 'Événement de collecte', status: 'Programmé', author: 'Sophie Bernard', date: '2024-08-20', views: 450, category: 'Événements' },
        { id: 4, title: 'Témoignage bénéficiaire', status: 'Publié', author: 'Pierre Dubois', date: '2024-08-12', views: 890, category: 'Témoignages' }
    ];

    const mediaFiles = [
        { id: 1, name: 'photo-projet-1.jpg', type: 'Image', size: '2.4 MB', date: '2024-08-15', usage: 'Article' },
        { id: 2, name: 'video-presentation.mp4', type: 'Vidéo', size: '45.2 MB', date: '2024-08-10', usage: 'Page d\'accueil' },
        { id: 3, name: 'logo-partenaire.png', type: 'Image', size: '512 KB', date: '2024-08-08', usage: 'Partenaires' },
        { id: 4, name: 'brochure-2024.pdf', type: 'Document', size: '8.7 MB', date: '2024-08-05', usage: 'Téléchargement' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Publié': return 'success';
            case 'Brouillon': return 'secondary';
            case 'Programmé': return 'warning';
            case 'Archivé': return 'danger';
            default: return 'secondary';
        }
    };

    const getFileTypeIcon = (type: string) => {
        switch (type) {
            case 'Image': return 'bi-image';
            case 'Vidéo': return 'bi-camera-video';
            case 'Document': return 'bi-file-pdf';
            default: return 'bi-file';
        }
    };

    return (
        <DashboardLayout title="Gestion de contenu" user={user}>
            <div className="content-page">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Gestion de contenu</h2>
                        <p className="text-muted mb-0">Articles, médias et ressources de la fondation</p>
                    </div>
                    <Button 
                        style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nouveau contenu
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
                            { key: 'articles', label: 'Articles', icon: 'bi-journal-text' },
                            { key: 'media', label: 'Médias', icon: 'bi-images' },
                            { key: 'analytics', label: 'Analytics', icon: 'bi-graph-up' }
                        ].map(tabItem => (
                            <Nav.Item key={tabItem.key}>
                                <Nav.Link active={activeTab === tabItem.key} onClick={() => setActiveTab(tabItem.key)}
                                         style={{ backgroundColor: activeTab === tabItem.key ? '#5FA145' : 'transparent' }}>
                                    <i className={`${tabItem.icon} me-2`}></i>{tabItem.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {(activeTab === 'overview' || activeTab === 'articles') && (
                    <Card className="border-0 mb-4" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Articles récents</h5>
                            <div className="d-flex gap-2">
                                <Button variant="outline-secondary" size="sm">
                                    <i className="bi bi-funnel me-2"></i>Filtrer
                                </Button>
                                <Button variant="outline-primary" size="sm">
                                    <i className="bi bi-plus-circle me-2"></i>Nouvel article
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4">Titre</th>
                                        <th className="border-0 py-3">Statut</th>
                                        <th className="border-0 py-3">Auteur</th>
                                        <th className="border-0 py-3">Date</th>
                                        <th className="border-0 py-3">Vues</th>
                                        <th className="border-0 py-3">Catégorie</th>
                                        <th className="border-0 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map((article) => (
                                        <tr key={article.id}>
                                            <td className="py-3 px-4">
                                                <div className="fw-semibold">{article.title}</div>
                                                <small className="text-muted">ID: {article.id}</small>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg={getStatusColor(article.status)}>
                                                    {article.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3">{article.author}</td>
                                            <td className="py-3 text-muted">
                                                {new Date(article.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-eye me-2 text-muted"></i>
                                                    {article.views.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="light" text="dark">{article.category}</Badge>
                                            </td>
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
                )}

                {(activeTab === 'overview' || activeTab === 'media') && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Bibliothèque média</h5>
                            <div className="d-flex gap-2">
                                <Button variant="outline-secondary" size="sm">
                                    <i className="bi bi-upload me-2"></i>Télécharger
                                </Button>
                                <Button variant="outline-primary" size="sm">
                                    <i className="bi bi-folder-plus me-2"></i>Nouveau dossier
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4">Fichier</th>
                                        <th className="border-0 py-3">Type</th>
                                        <th className="border-0 py-3">Taille</th>
                                        <th className="border-0 py-3">Date</th>
                                        <th className="border-0 py-3">Utilisation</th>
                                        <th className="border-0 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mediaFiles.map((file) => (
                                        <tr key={file.id}>
                                            <td className="py-3 px-4">
                                                <div className="d-flex align-items-center">
                                                    <div 
                                                        className="rounded me-3 d-flex align-items-center justify-content-center"
                                                        style={{ width: '40px', height: '40px', backgroundColor: '#F8F9FA' }}
                                                    >
                                                        <i className={`${getFileTypeIcon(file.type)} text-muted`}></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">{file.name}</div>
                                                        <small className="text-muted">ID: {file.id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="light" text="dark">{file.type}</Badge>
                                            </td>
                                            <td className="py-3 text-muted">{file.size}</td>
                                            <td className="py-3 text-muted">
                                                {new Date(file.date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="py-3">{file.usage}</td>
                                            <td className="py-3">
                                                <div className="d-flex gap-1">
                                                    <Button variant="outline-primary" size="sm">
                                                        <i className="bi bi-download"></i>
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
                )}

                {activeTab === 'analytics' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Body className="p-5 text-center" style={{ minHeight: '300px' }}>
                            <i className="bi bi-graph-up-arrow mb-4" style={{ fontSize: '4rem', color: '#5FA145' }}></i>
                            <h4 className="fw-bold mb-3" style={{ color: '#1F2937' }}>Analytics de contenu</h4>
                            <p className="text-muted mb-4">
                                Analyses détaillées de performance des contenus, taux d'engagement et métriques avancées à venir.
                            </p>
                            <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                                <i className="bi bi-bar-chart me-2"></i>Activer les analytics
                            </Button>
                        </Card.Body>
                    </Card>
                )}

                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Créer un nouveau contenu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Type de contenu</Form.Label>
                                <Form.Select>
                                    <option>Sélectionner un type</option>
                                    <option value="article">Article</option>
                                    <option value="news">Actualité</option>
                                    <option value="report">Rapport</option>
                                    <option value="testimonial">Témoignage</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control type="text" placeholder="Titre du contenu" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Catégorie</Form.Label>
                                <Form.Select>
                                    <option>Sélectionner une catégorie</option>
                                    <option value="projets">Projets</option>
                                    <option value="evenements">Événements</option>
                                    <option value="rapports">Rapports</option>
                                    <option value="temoignages">Témoignages</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Description du contenu..." />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Annuler
                        </Button>
                        <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                            Créer le contenu
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}