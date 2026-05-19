import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Table, Badge, Button, Form, InputGroup, Modal, Nav } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

interface CommunicationsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Communications({ user }: CommunicationsProps) {
    const { t } = useTranslation();
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [activeTab, setActiveTab] = useState('newsletters'); // 'newsletters', 'campaigns', 'social', 'notifications'

    const stats = [
        {
            title: 'Newsletters envoyées',
            value: '47',
            change: '+8',
            positive: true,
            color: '#5FA145',
            icon: 'bi-envelope-paper-fill'
        },
        {
            title: 'Abonnés actifs',
            value: '2,847',
            change: '+12%',
            positive: true,
            color: '#4A8A2A',
            icon: 'bi-people-fill'
        },
        {
            title: 'Taux d\'ouverture',
            value: '68.4%',
            change: '+5.2%',
            positive: true,
            color: '#C69438',
            icon: 'bi-eye-fill'
        },
        {
            title: 'Interactions sociales',
            value: '1,234',
            change: '+23%',
            positive: true,
            color: '#C69438',
            icon: 'bi-heart-fill'
        }
    ];

    const newsletters = [
        {
            id: 1,
            title: 'Newsletter Août 2024',
            subject: 'Nos actions estivales - Bilan du mois',
            status: 'Envoyée',
            recipients: 2847,
            openRate: 72.3,
            clickRate: 18.5,
            sentDate: '2024-08-15T10:00:00',
            campaign: 'Communication mensuelle'
        },
        {
            id: 2,
            title: 'Appel aux dons - Urgence',
            subject: 'Aide d\'urgence suite aux inondations',
            status: 'Programmée',
            recipients: 2847,
            openRate: 0,
            clickRate: 0,
            sentDate: '2024-08-25T14:00:00',
            campaign: 'Campagne urgence'
        },
        {
            id: 3,
            title: 'Invitation Gala de Charité',
            subject: 'Vous êtes invité à notre Gala annuel',
            status: 'Brouillon',
            recipients: 0,
            openRate: 0,
            clickRate: 0,
            sentDate: null,
            campaign: 'Événements'
        }
    ];

    const campaigns = [
        {
            id: 1,
            name: 'Communication mensuelle',
            description: 'Newsletter mensuelle avec actualités et bilan',
            type: 'Newsletter',
            status: 'Actif',
            subscribers: 2847,
            frequency: 'Mensuelle',
            lastSent: '2024-08-15'
        },
        {
            id: 2,
            name: 'Campagne urgence',
            description: 'Communications d\'urgence et appels aux dons',
            type: 'Email',
            status: 'Actif',
            subscribers: 2847,
            frequency: 'À la demande',
            lastSent: '2024-07-20'
        },
        {
            id: 3,
            name: 'Événements',
            description: 'Invitations et informations sur les événements',
            type: 'Email',
            status: 'Actif',
            subscribers: 1934,
            frequency: 'Hebdomadaire',
            lastSent: '2024-08-12'
        }
    ];

    const socialPosts = [
        {
            id: 1,
            platform: 'Facebook',
            content: 'Merci à tous les bénévoles qui ont participé à la collecte alimentaire ! 🙏',
            status: 'Publié',
            scheduledDate: '2024-08-19T09:00:00',
            engagement: { likes: 143, shares: 28, comments: 15 }
        },
        {
            id: 2,
            platform: 'Instagram',
            content: 'Découvrez les coulisses de notre programme d\'éducation numérique 📚💻',
            status: 'Programmé',
            scheduledDate: '2024-08-20T15:00:00',
            engagement: { likes: 0, shares: 0, comments: 0 }
        },
        {
            id: 3,
            platform: 'Twitter',
            content: 'Rejoignez-nous pour le Gala de Charité du 30 août ! Billets disponibles sur notre site.',
            status: 'Brouillon',
            scheduledDate: null,
            engagement: { likes: 0, shares: 0, comments: 0 }
        }
    ];

    const notifications = [
        {
            id: 1,
            title: 'Nouveau don reçu',
            message: 'Marie Dubois a fait un don de 97.500 FCFA',
            type: 'Donation',
            timestamp: '2024-08-19T14:30:00',
            read: false,
            priority: 'Normal'
        },
        {
            id: 2,
            title: 'Événement complet',
            message: 'La formation bénévoles affiche complet (30/30)',
            type: 'Event',
            timestamp: '2024-08-19T11:15:00',
            read: true,
            priority: 'Important'
        },
        {
            id: 3,
            title: 'Nouveau membre',
            message: 'Paul Nguyen a rejoint la communauté',
            type: 'Member',
            timestamp: '2024-08-19T09:45:00',
            read: true,
            priority: 'Normal'
        }
    ];

    const getStatusBadge = (status: string) => {
        const variants: any = {
            'Envoyée': 'success',
            'Programmée': 'warning',
            'Brouillon': 'secondary',
            'Publié': 'success',
            'Programmé': 'warning',
            'Actif': 'success',
            'Inactif': 'secondary'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getPlatformIcon = (platform: string) => {
        const icons: any = {
            'Facebook': 'bi-facebook',
            'Instagram': 'bi-instagram',
            'Twitter': 'bi-twitter',
            'LinkedIn': 'bi-linkedin'
        };
        return icons[platform] || 'bi-share';
    };

    const getNotificationIcon = (type: string) => {
        const icons: any = {
            'Donation': 'bi-heart-fill',
            'Event': 'bi-calendar-event',
            'Member': 'bi-person-plus',
            'System': 'bi-gear'
        };
        return icons[type] || 'bi-bell';
    };

    return (
        <DashboardLayout title="Communications" user={user}>
            <div className="communications-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                Communications
                            </h2>
                            <p className="text-muted mb-0">
                                Gérez toutes vos communications et interactions
                            </p>
                        </div>
                        <Button 
                            style={{
                                backgroundColor: '#5FA145',
                                borderColor: '#5FA145'
                            }}
                            onClick={() => setShowNewsletterModal(true)}
                        >
                            <i className="bi bi-envelope-plus me-2"></i>
                            Nouvelle communication
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

                {/* Navigation Tabs */}
                <div className="mb-4">
                    <Nav variant="pills" className="nav-fill">
                        {[
                            { key: 'newsletters', label: 'Newsletters', icon: 'bi-envelope-paper' },
                            { key: 'campaigns', label: 'Campagnes', icon: 'bi-megaphone' },
                            { key: 'social', label: 'Réseaux sociaux', icon: 'bi-share' },
                            { key: 'notifications', label: 'Notifications', icon: 'bi-bell' }
                        ].map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link
                                    active={activeTab === tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className="px-4 py-2"
                                    style={{
                                        backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                        borderColor: activeTab === tab.key ? '#5FA145' : '#dee2e6',
                                        color: activeTab === tab.key ? '#fff' : '#6c757d'
                                    }}
                                >
                                    <i className={`${tab.icon} me-2`}></i>
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'newsletters' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                    Newsletters et Emails
                                </h5>
                                <InputGroup style={{ width: '300px' }}>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Rechercher..."
                                    />
                                </InputGroup>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4">Titre</th>
                                        <th className="border-0 py-3">Statut</th>
                                        <th className="border-0 py-3">Destinataires</th>
                                        <th className="border-0 py-3">Taux d'ouverture</th>
                                        <th className="border-0 py-3">Taux de clic</th>
                                        <th className="border-0 py-3">Date d'envoi</th>
                                        <th className="border-0 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsletters.map((newsletter) => (
                                        <tr key={newsletter.id}>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="fw-medium" style={{ color: '#1F2937' }}>
                                                        {newsletter.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {newsletter.subject}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {getStatusBadge(newsletter.status)}
                                            </td>
                                            <td className="py-3 text-muted">
                                                {newsletter.recipients.toLocaleString()}
                                            </td>
                                            <td className="py-3">
                                                <div className="fw-medium" style={{ color: '#5FA145' }}>
                                                    {newsletter.openRate > 0 ? `${newsletter.openRate}%` : '-'}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="fw-medium" style={{ color: '#C69438' }}>
                                                    {newsletter.clickRate > 0 ? `${newsletter.clickRate}%` : '-'}
                                                </div>
                                            </td>
                                            <td className="py-3 text-muted small">
                                                {newsletter.sentDate 
                                                    ? new Date(newsletter.sentDate).toLocaleDateString('fr-FR')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <Button variant="outline-secondary" size="sm">
                                                        <i className="bi bi-eye"></i>
                                                    </Button>
                                                    <Button variant="outline-secondary" size="sm">
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                    <Button variant="outline-secondary" size="sm">
                                                        <i className="bi bi-share"></i>
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

                {activeTab === 'campaigns' && (
                    <Row className="g-4">
                        {campaigns.map((campaign) => (
                            <Col lg={6} key={campaign.id}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                                    {campaign.name}
                                                </h5>
                                                <p className="text-muted mb-0 small">
                                                    {campaign.description}
                                                </p>
                                            </div>
                                            <div className="d-flex gap-2">
                                                {getStatusBadge(campaign.status)}
                                                <Badge bg="info">{campaign.type}</Badge>
                                            </div>
                                        </div>

                                        <Row className="g-3 mb-3">
                                            <Col xs={6}>
                                                <div className="text-center">
                                                    <div className="fw-bold" style={{ color: '#5FA145', fontSize: '1.5rem' }}>
                                                        {campaign.subscribers.toLocaleString()}
                                                    </div>
                                                    <div className="text-muted small">Abonnés</div>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <div className="text-center">
                                                    <div className="fw-bold" style={{ color: '#C69438' }}>
                                                        {campaign.frequency}
                                                    </div>
                                                    <div className="text-muted small">Fréquence</div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mb-3">
                                            <div className="text-muted small">
                                                Dernier envoi: {new Date(campaign.lastSent).toLocaleDateString('fr-FR')}
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
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {activeTab === 'social' && (
                    <Row className="g-4">
                        {socialPosts.map((post) => (
                            <Col lg={6} key={post.id}>
                                <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                <i 
                                                    className={`${getPlatformIcon(post.platform)} me-2`}
                                                    style={{ color: '#5FA145', fontSize: '1.5rem' }}
                                                ></i>
                                                <div>
                                                    <div className="fw-bold">{post.platform}</div>
                                                    <div className="text-muted small">
                                                        {post.scheduledDate 
                                                            ? new Date(post.scheduledDate).toLocaleDateString('fr-FR')
                                                            : 'Non programmé'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {getStatusBadge(post.status)}
                                        </div>

                                        <div className="mb-3">
                                            <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                                                {post.content}
                                            </p>
                                        </div>

                                        {post.status === 'Publié' && (
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-around text-center">
                                                    <div>
                                                        <div className="fw-bold" style={{ color: '#C69438' }}>
                                                            {post.engagement.likes}
                                                        </div>
                                                        <div className="text-muted small">J'aime</div>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold" style={{ color: '#5FA145' }}>
                                                            {post.engagement.shares}
                                                        </div>
                                                        <div className="text-muted small">Partages</div>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold" style={{ color: '#4A8A2A' }}>
                                                            {post.engagement.comments}
                                                        </div>
                                                        <div className="text-muted small">Commentaires</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="d-flex gap-2">
                                            <Button variant="outline-secondary" size="sm" className="flex-fill">
                                                <i className="bi bi-pencil me-2"></i>
                                                Modifier
                                            </Button>
                                            {post.status === 'Brouillon' && (
                                                <Button variant="outline-primary" size="sm" className="flex-fill">
                                                    <i className="bi bi-calendar me-2"></i>
                                                    Programmer
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {activeTab === 'notifications' && (
                    <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                Notifications système
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {notifications.map((notification) => (
                                <div key={notification.id} className="d-flex align-items-start py-3 border-bottom">
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: notification.read ? '#F3F4F6' : '#5FA145',
                                            color: notification.read ? '#6B7280' : 'white'
                                        }}
                                    >
                                        <i className={getNotificationIcon(notification.type)}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h6 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                                {notification.title}
                                            </h6>
                                            <div className="d-flex align-items-center gap-2">
                                                {notification.priority === 'Important' && (
                                                    <Badge bg="warning">Important</Badge>
                                                )}
                                                <small className="text-muted">
                                                    {new Date(notification.timestamp).toLocaleTimeString('fr-FR')}
                                                </small>
                                            </div>
                                        </div>
                                        <p className="mb-0 text-muted small">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                )}

                {/* Create Newsletter Modal */}
                <Modal show={showNewsletterModal} onHide={() => setShowNewsletterModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Nouvelle communication</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Type de communication</Form.Label>
                                <Form.Select>
                                    <option value="newsletter">Newsletter</option>
                                    <option value="campaign">Campagne email</option>
                                    <option value="notification">Notification</option>
                                    <option value="social">Publication sociale</option>
                                </Form.Select>
                            </Form.Group>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titre</Form.Label>
                                        <Form.Control type="text" placeholder="Titre de votre communication" />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Campagne</Form.Label>
                                        <Form.Select>
                                            <option value="">Choisir une campagne</option>
                                            <option value="monthly">Communication mensuelle</option>
                                            <option value="urgent">Campagne urgence</option>
                                            <option value="events">Événements</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Objet</Form.Label>
                                <Form.Control type="text" placeholder="Objet de l'email" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contenu</Form.Label>
                                <Form.Control as="textarea" rows={6} placeholder="Rédigez votre message..." />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Destinataires</Form.Label>
                                        <Form.Select>
                                            <option value="all">Tous les abonnés (2,847)</option>
                                            <option value="members">Membres seulement (1,234)</option>
                                            <option value="donors">Donateurs (890)</option>
                                            <option value="volunteers">Bénévoles (456)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Programmation</Form.Label>
                                        <Form.Control type="datetime-local" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowNewsletterModal(false)}>
                            Sauvegarder brouillon
                        </Button>
                        <Button variant="outline-primary">
                            Programmer
                        </Button>
                        <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                            Envoyer maintenant
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout>
    );
}