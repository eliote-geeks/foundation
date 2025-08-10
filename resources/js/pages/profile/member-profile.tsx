import { useState } from 'react';
import { Row, Col, Card, Button, Form, Badge, Tab, Tabs, Modal, Alert, ListGroup } from 'react-bootstrap';
import { FoundationLayout } from '@/layouts/foundation-layout';
import { Head } from '@inertiajs/react';

interface MemberProfileProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            profile_type?: 'adherent' | 'ambassador' | 'alumni' | 'volunteer';
            first_name?: string;
            last_name?: string;
            phone?: string;
            city?: string;
            country?: string;
            profession?: string;
            skills?: string[];
            interests?: string[];
            member_since?: string;
            membership_status?: 'active' | 'pending' | 'expired';
            membership_expires_at?: string;
        };
    };
}

// Mock data - en attendant l'intégration backend
const mockProfileData = {
    profile_type: 'ambassador' as const,
    first_name: 'Ama',
    last_name: 'Kouassi',
    phone: '+225 07 XX XX XX XX',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    profession: 'Consultante en développement',
    company: 'Impact Consulting CI',
    skills: ['Communication', 'Gestion de projet', 'Formation/Éducation'],
    interests: ['Éducation et formation', 'Entrepreneuriat social', 'Genre et égalité'],
    member_since: '2023-03-15',
    membership_status: 'active' as const,
    membership_expires_at: '2025-03-15',
    participation_score: 85,
    total_events_attended: 12,
    total_votes_cast: 25,
    total_donations: 150000, // en FCFA
    volunteer_hours: 48
};

const mockNotifications = [
    {
        id: 1,
        title: 'Nouvel événement : Formation Leadership Féminin',
        message: 'Une formation spécialement conçue pour les ambassadrices débute le 15 mars.',
        type: 'event' as const,
        date: '2024-03-01T10:00:00',
        read: false
    },
    {
        id: 2,
        title: 'Rappel : Assemblée Générale 2024',
        message: 'N\'oubliez pas de participer à notre AG annuelle le 20 mars à 14h.',
        type: 'reminder' as const,
        date: '2024-02-28T14:30:00',
        read: false
    },
    {
        id: 3,
        title: 'Merci pour votre participation au concours Innovation',
        message: 'Votre vote a été pris en compte. Résultats annoncés bientôt !',
        type: 'info' as const,
        date: '2024-02-25T16:45:00',
        read: true
    }
];

const mockPayments = [
    {
        id: 1,
        type: 'membership' as const,
        description: 'Cotisation Ambassadeur 2024',
        amount: 75000,
        status: 'completed' as const,
        date: '2024-03-15T09:00:00',
        method: 'mobile_money',
        reference: 'AMB2024001'
    },
    {
        id: 2,
        type: 'event' as const,
        description: 'Billet Gala Annuel 2024',
        amount: 75000, // 150€ * 500
        status: 'completed' as const,
        date: '2024-02-10T11:30:00',
        method: 'card',
        reference: 'EVT2024025'
    },
    {
        id: 3,
        type: 'vote' as const,
        description: '5 votes - Concours Innovation',
        amount: 12500, // 5€ * 5 * 500
        status: 'completed' as const,
        date: '2024-01-20T16:15:00',
        method: 'mobile_money',
        reference: 'VOT2024010'
    }
];

const profileTypes = {
    adherent: { name: 'Adhérent', color: 'primary', icon: 'bi-person-check' },
    ambassador: { name: 'Ambassadeur', color: 'success', icon: 'bi-megaphone' },
    alumni: { name: 'Alumni', color: 'warning', icon: 'bi-trophy' },
    volunteer: { name: 'Bénévole', color: 'info', icon: 'bi-hand-thumbs-up' }
};

export default function MemberProfile({ auth }: MemberProfileProps) {
    const [activeTab, setActiveTab] = useState('profile');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null);
    
    // Merge auth data with mock data for demo
    const profileData = { ...auth.user, ...mockProfileData };
    const profileType = profileTypes[profileData.profile_type];

    const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
        setSelectedNotification(notification);
        setShowNotificationModal(true);
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'success',
            pending: 'warning',
            expired: 'danger'
        };
        const texts = {
            active: 'Actif',
            pending: 'En attente',
            expired: 'Expiré'
        };
        return <Badge bg={variants[status as keyof typeof variants]}>{texts[status as keyof typeof texts]}</Badge>;
    };

    const getPaymentStatusBadge = (status: string) => {
        const variants = {
            completed: 'success',
            pending: 'warning',
            failed: 'danger'
        };
        const texts = {
            completed: 'Complété',
            pending: 'En attente',
            failed: 'Échoué'
        };
        return <Badge bg={variants[status as keyof typeof variants]}>{texts[status as keyof typeof texts]}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR');
    };

    const unreadNotifications = mockNotifications.filter(n => !n.read);

    return (
        <FoundationLayout user={auth.user}>
            <Head title="Mon Profil - Fondation Titi" />
            
            {/* En-tête profil */}
            <div className="position-relative mb-5 overflow-hidden" style={{ borderRadius: '24px' }}>
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(6, 214, 160, 0.9) 100%)`,
                        zIndex: 1
                    }}
                />
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='70' cy='30' r='1'/%3E%3Ccircle cx='90' cy='10' r='2'/%3E%3Ccircle cx='10' cy='50' r='1'/%3E%3Ccircle cx='30' cy='70' r='2'/%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='70' cy='70' r='1'/%3E%3Ccircle cx='90' cy='50' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '100px 100px',
                        opacity: 0.3
                    }}
                />
                
                <div className="position-relative px-4 py-5" style={{ zIndex: 2 }}>
                    <Row className="align-items-center">
                        <Col lg={8} className="text-white">
                            <div className="d-flex align-items-center mb-3">
                                <div 
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-4"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <i className={`${profileType.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                                </div>
                                <div>
                                    <h1 className="text-white mb-1 fw-bold h2">{profileData.first_name} {profileData.last_name}</h1>
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <Badge bg={profileType.color} className="fs-6">
                                            {profileType.name}
                                        </Badge>
                                        {getStatusBadge(profileData.membership_status)}
                                    </div>
                                    <div className="text-white opacity-75">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {profileData.city}, {profileData.country}
                                        <span className="mx-2">•</span>
                                        <i className="bi bi-briefcase me-1"></i>
                                        {profileData.profession}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        
                        <Col lg={4} className="text-center mt-4 mt-lg-0">
                            <Row>
                                <Col sm={6} lg={12} className="mb-3">
                                    <div className="text-white">
                                        <div className="h3 mb-0">{profileData.participation_score}</div>
                                        <small className="opacity-75">Score de participation</small>
                                    </div>
                                </Col>
                                <Col sm={6} lg={12}>
                                    <Button 
                                        variant="light" 
                                        className="d-flex align-items-center justify-content-center position-relative"
                                        onClick={() => setActiveTab('notifications')}
                                    >
                                        <i className="bi bi-bell me-2"></i>
                                        Notifications
                                        {unreadNotifications.length > 0 && (
                                            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                                {unreadNotifications.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Navigation par onglets */}
            <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k || 'profile')}
                className="mb-4"
            >
                {/* Onglet Profil */}
                <Tab eventKey="profile" title={
                    <>
                        <i className="bi bi-person me-2"></i>
                        Mon Profil
                    </>
                }>
                    <Row className="g-4">
                        {/* Informations principales */}
                        <Col lg={8}>
                            <Card className="mb-4">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="bi bi-person-lines-fill me-2"></i>
                                        Informations personnelles
                                    </h5>
                                    <Button variant="outline-primary" size="sm" onClick={() => setShowEditModal(true)}>
                                        <i className="bi bi-pencil me-1"></i>
                                        Modifier
                                    </Button>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <strong>Email :</strong>
                                                <div>{profileData.email}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong>Téléphone :</strong>
                                                <div>{profileData.phone}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong>Profession :</strong>
                                                <div>{profileData.profession}</div>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <strong>Entreprise :</strong>
                                                <div>{profileData.company}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong>Membre depuis :</strong>
                                                <div>{formatDate(profileData.member_since)}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong>Adhésion expire :</strong>
                                                <div>{formatDate(profileData.membership_expires_at)}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Compétences et intérêts */}
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <i className="bi bi-lightning me-2"></i>
                                        Compétences & Centres d'intérêt
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-4">
                                        <h6>Compétences</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {profileData.skills.map((skill, index) => (
                                                <Badge key={index} bg="primary" className="fs-6">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h6>Centres d'intérêt</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {profileData.interests.map((interest, index) => (
                                                <Badge key={index} bg="success" className="fs-6">
                                                    {interest}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Statistiques d'engagement */}
                        <Col lg={4}>
                            <Card className="mb-4">
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <i className="bi bi-graph-up me-2"></i>
                                        Mon Engagement
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center mb-3">
                                        <div className="h2 text-success mb-0">{profileData.participation_score}/100</div>
                                        <small className="text-muted">Score de participation</small>
                                    </div>
                                    
                                    <div className="border-bottom pb-3 mb-3">
                                        <Row className="text-center">
                                            <Col>
                                                <div className="h4 text-primary mb-0">{profileData.total_events_attended}</div>
                                                <small className="text-muted">Événements</small>
                                            </Col>
                                            <Col>
                                                <div className="h4 text-warning mb-0">{profileData.total_votes_cast}</div>
                                                <small className="text-muted">Votes</small>
                                            </Col>
                                        </Row>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="mb-2">
                                            <small className="text-muted">Total des contributions</small>
                                            <div className="h5 text-success mb-0">
                                                {profileData.total_donations.toLocaleString()} FCFA
                                            </div>
                                        </div>
                                        <div>
                                            <small className="text-muted">Heures de bénévolat</small>
                                            <div className="h5 text-info mb-0">{profileData.volunteer_hours}h</div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Adhésion */}
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <i className="bi bi-card-text me-2"></i>
                                        Mon Adhésion
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center mb-3">
                                        <Badge bg={profileType.color} className="fs-6 mb-2">
                                            <i className={`${profileType.icon} me-1`}></i>
                                            {profileType.name}
                                        </Badge>
                                        <div>{getStatusBadge(profileData.membership_status)}</div>
                                    </div>
                                    
                                    <div className="text-center mb-3">
                                        <small className="text-muted">Expire le</small>
                                        <div className="fw-semibold">{formatDate(profileData.membership_expires_at)}</div>
                                    </div>
                                    
                                    <Button variant="success" className="w-100">
                                        <i className="bi bi-credit-card me-2"></i>
                                        Renouveler l'adhésion
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                {/* Onglet Notifications */}
                <Tab eventKey="notifications" title={
                    <span className="position-relative">
                        <i className="bi bi-bell me-2"></i>
                        Notifications
                        {unreadNotifications.length > 0 && (
                            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                {unreadNotifications.length}
                            </Badge>
                        )}
                    </span>
                }>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Mes Notifications</h5>
                            <Button variant="outline-secondary" size="sm">
                                <i className="bi bi-check2-all me-1"></i>
                                Tout marquer comme lu
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {mockNotifications.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-bell-slash text-muted" style={{ fontSize: '3rem' }}></i>
                                    <h5 className="text-muted mt-3">Aucune notification</h5>
                                    <p className="text-muted">Vous recevrez ici vos notifications importantes</p>
                                </div>
                            ) : (
                                <ListGroup variant="flush">
                                    {mockNotifications.map((notification) => (
                                        <ListGroup.Item 
                                            key={notification.id}
                                            className={`d-flex justify-content-between align-items-start ${!notification.read ? 'bg-light border-start border-primary border-3' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="me-auto">
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className={`bi ${
                                                        notification.type === 'event' ? 'bi-calendar-event text-success' :
                                                        notification.type === 'reminder' ? 'bi-clock text-warning' :
                                                        'bi-info-circle text-info'
                                                    } me-2`}></i>
                                                    <h6 className="mb-0">{notification.title}</h6>
                                                    {!notification.read && <Badge bg="primary" className="ms-2">Nouveau</Badge>}
                                                </div>
                                                <p className="mb-1 text-muted small">{notification.message}</p>
                                                <small className="text-muted">{formatDateTime(notification.date)}</small>
                                            </div>
                                            <i className="bi bi-chevron-right text-muted"></i>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                {/* Onglet Paiements */}
                <Tab eventKey="payments" title={
                    <>
                        <i className="bi bi-credit-card me-2"></i>
                        Mes Paiements
                    </>
                }>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Historique des paiements</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {mockPayments.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-credit-card text-muted" style={{ fontSize: '3rem' }}></i>
                                    <h5 className="text-muted mt-3">Aucun paiement</h5>
                                    <p className="text-muted">Vos transactions apparaîtront ici</p>
                                </div>
                            ) : (
                                <ListGroup variant="flush">
                                    {mockPayments.map((payment) => (
                                        <ListGroup.Item key={payment.id} className="d-flex justify-content-between align-items-start">
                                            <div className="me-auto">
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className={`bi ${
                                                        payment.type === 'membership' ? 'bi-person-badge text-success' :
                                                        payment.type === 'event' ? 'bi-calendar-event text-info' :
                                                        'bi-hand-thumbs-up text-warning'
                                                    } me-2`}></i>
                                                    <h6 className="mb-0">{payment.description}</h6>
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <small className="text-muted">
                                                        {formatDateTime(payment.date)}
                                                    </small>
                                                    <small className="text-muted">
                                                        Réf: {payment.reference}
                                                    </small>
                                                    <small className="text-muted">
                                                        {payment.method === 'mobile_money' ? 'Mobile Money' : 'Carte bancaire'}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="h6 mb-1">{payment.amount.toLocaleString()} FCFA</div>
                                                {getPaymentStatusBadge(payment.status)}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <small className="text-muted">
                                Total des paiements : <strong>{mockPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA</strong>
                            </small>
                        </Card.Footer>
                    </Card>
                </Tab>
            </Tabs>

            {/* Modal d'édition du profil */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Modifier mon profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control type="text" defaultValue={profileData.first_name} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control type="text" defaultValue={profileData.last_name} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Téléphone</Form.Label>
                                    <Form.Control type="tel" defaultValue={profileData.phone} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Profession</Form.Label>
                                    <Form.Control type="text" defaultValue={profileData.profession} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ville</Form.Label>
                                    <Form.Control type="text" defaultValue={profileData.city} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Entreprise</Form.Label>
                                    <Form.Control type="text" defaultValue={profileData.company} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary">
                        Enregistrer les modifications
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de notification */}
            <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedNotification && (
                            <div className="d-flex align-items-center">
                                <i className={`bi ${
                                    selectedNotification.type === 'event' ? 'bi-calendar-event text-success' :
                                    selectedNotification.type === 'reminder' ? 'bi-clock text-warning' :
                                    'bi-info-circle text-info'
                                } me-2`}></i>
                                {selectedNotification.title}
                            </div>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedNotification && (
                        <div>
                            <p>{selectedNotification.message}</p>
                            <div className="text-muted small">
                                <i className="bi bi-clock me-1"></i>
                                {formatDateTime(selectedNotification.date)}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowNotificationModal(false)}>
                        Fermer
                    </Button>
                    {selectedNotification && selectedNotification.type === 'event' && (
                        <Button variant="primary">
                            Voir l'événement
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </FoundationLayout>
    );
}