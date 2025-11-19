import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Badge, Nav, Tab, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface ProfileProps {
    user?: {
        name: string;
        email: string;
        member_type?: string;
        phone?: string;
        city?: string;
        joined_at?: string;
        avatar?: string;
    };
}

export default function Profile({ user }: ProfileProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAlert, setShowAlert] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '+237 6XX XXX XXX',
        city: user?.city || 'Yaoundé',
        bio: 'Membre actif de la Fondation TITI, engagé dans les actions humanitaires et sociales.',
        profession: 'Ingénieur',
        interests: ['Éducation', 'Santé', 'Environnement']
    });

    const handleSave = () => {
        setShowAlert(true);
        setIsEditing(false);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const memberStats = {
        donations: { count: 12, total: '780.000 FCFA' },
        events: { count: 8, upcoming: 2 },
        projects: { active: 3, completed: 7 },
        volunteering: { hours: 45, rank: 'Ambassadeur' }
    };

    const recentActivities = [
        {
            id: 1,
            type: 'donation',
            title: 'Don pour l\'éducation',
            amount: '65.000 FCFA',
            date: '2024-08-15',
            icon: 'bi-heart-fill',
            color: '#E4518C'
        },
        {
            id: 2,
            type: 'event',
            title: 'Participation à la collecte alimentaire',
            date: '2024-08-10',
            icon: 'bi-calendar-event',
            color: '#5FA145'
        },
        {
            id: 3,
            type: 'project',
            title: 'Projet Eau Potable - Bénévole',
            date: '2024-08-05',
            icon: 'bi-droplet',
            color: '#667eea'
        },
        {
            id: 4,
            type: 'achievement',
            title: 'Badge "Donateur Régulier" obtenu',
            date: '2024-08-01',
            icon: 'bi-award',
            color: '#C69438'
        }
    ];

    const badges = [
        { name: 'Donateur Régulier', icon: 'bi-heart-fill', color: '#E4518C', description: '10+ dons effectués' },
        { name: 'Bénévole Actif', icon: 'bi-hand-thumbs-up', color: '#5FA145', description: '40+ heures de bénévolat' },
        { name: 'Ambassadeur', icon: 'bi-star-fill', color: '#C69438', description: 'Membre exemplaire' },
        { name: 'Parrain', icon: 'bi-people', color: '#667eea', description: '5+ parrainages' }
    ];

    return (
        <>
            <Head title={`Profil de ${user?.name || 'Utilisateur'} - Fondation TITI`} />
            
            <div style={{ backgroundColor: '#F8FFFE', minHeight: '100vh' }}>
                <ModernHeader user={user} />
                
                <Container className="py-5">
                    {showAlert && (
                        <Alert variant="success" className="mb-4">
                            <i className="bi bi-check-circle me-2"></i>
                            Profil mis à jour avec succès !
                        </Alert>
                    )}

                    {/* En-tête du profil */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <div 
                            className="position-relative"
                            style={{
                                background: 'linear-gradient(135deg, #5FA145 0%, #334E15 100%)',
                                height: '200px',
                                borderRadius: '0.5rem 0.5rem 0 0'
                            }}
                        >
                            <div className="position-absolute bottom-0 start-0 p-4 text-white">
                                <Row className="align-items-end">
                                    <Col xs="auto">
                                        <div 
                                            className="rounded-circle border border-4 border-white d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                fontSize: '2.5rem',
                                                marginBottom: '-60px'
                                            }}
                                        >
                                            {user?.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.name}
                                                    className="rounded-circle"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <i className="bi bi-person-fill text-white"></i>
                                            )}
                                        </div>
                                    </Col>
                                    <Col>
                                        <h2 className="mb-1 fw-bold">{user?.name || 'Nom Utilisateur'}</h2>
                                        <p className="mb-0 opacity-75">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            {formData.city}, Cameroun
                                        </p>
                                        <p className="mb-0 opacity-75">
                                            <i className="bi bi-calendar-plus me-2"></i>
                                            Membre depuis {user?.joined_at ? new Date(user.joined_at).getFullYear() : '2023'}
                                        </p>
                                    </Col>
                                    <Col xs="auto">
                                        <Badge 
                                            className="px-3 py-2"
                                            style={{ backgroundColor: '#C69438', fontSize: '0.9rem' }}
                                        >
                                            {memberStats.volunteering.rank}
                                        </Badge>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <Card.Body style={{ paddingTop: '80px' }}>
                            <Row>
                                <Col md={8}>
                                    <p className="text-muted mb-3">{formData.bio}</p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {formData.interests.map((interest, index) => (
                                            <Badge key={index} bg="light" text="dark" className="px-3 py-2">
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </Col>
                                <Col md={4} className="text-end">
                                    <Button 
                                        variant={isEditing ? "success" : "outline-primary"}
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        className="me-2"
                                    >
                                        <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-pencil'} me-2`}></i>
                                        {isEditing ? 'Sauvegarder' : 'Modifier Profil'}
                                    </Button>
                                    {isEditing && (
                                        <Button variant="secondary" onClick={() => setIsEditing(false)}>
                                            Annuler
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row className="g-4">
                        {/* Statistiques rapides */}
                        <Col lg={3}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Header className="bg-white border-0 pb-2">
                                    <h5 className="mb-0 fw-bold">Mes Statistiques</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted">Dons effectués</span>
                                            <strong className="text-success">{memberStats.donations.count}</strong>
                                        </div>
                                        <div className="small text-muted">Total: {memberStats.donations.total}</div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted">Événements</span>
                                            <strong style={{ color: '#5FA145' }}>{memberStats.events.count}</strong>
                                        </div>
                                        <div className="small text-muted">{memberStats.events.upcoming} à venir</div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted">Projets</span>
                                            <strong style={{ color: '#667eea' }}>{memberStats.projects.completed}</strong>
                                        </div>
                                        <div className="small text-muted">{memberStats.projects.active} en cours</div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted">Bénévolat</span>
                                            <strong style={{ color: '#C69438' }}>{memberStats.volunteering.hours}h</strong>
                                        </div>
                                        <div className="small text-muted">Cette année</div>
                                    </div>

                                    <hr />
                                    
                                    <h6 className="fw-bold mb-3">Mes Badges</h6>
                                    <Row className="g-2">
                                        {badges.map((badge, index) => (
                                            <Col xs={6} key={index}>
                                                <div 
                                                    className="text-center p-2 rounded border"
                                                    style={{ backgroundColor: `${badge.color}10` }}
                                                >
                                                    <i 
                                                        className={`${badge.icon} d-block mb-1`}
                                                        style={{ color: badge.color, fontSize: '1.2rem' }}
                                                    ></i>
                                                    <small className="fw-semibold d-block">{badge.name}</small>
                                                    <small className="text-muted">{badge.description}</small>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Contenu principal avec onglets */}
                        <Col lg={9}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-white border-0">
                                    <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                                        <Nav.Item>
                                            <Nav.Link eventKey="overview">
                                                <i className="bi bi-house me-2"></i>Aperçu
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="activities">
                                                <i className="bi bi-activity me-2"></i>Activités
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="donations">
                                                <i className="bi bi-heart me-2"></i>Mes Dons
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="settings">
                                                <i className="bi bi-gear me-2"></i>Paramètres
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>

                                <Card.Body>
                                    {activeTab === 'overview' && (
                                        <div>
                                            <h5 className="fw-bold mb-4">Activités Récentes</h5>
                                            {recentActivities.map((activity) => (
                                                <div key={activity.id} className="d-flex align-items-start mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FA' }}>
                                                    <div 
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{ 
                                                            width: '40px', 
                                                            height: '40px', 
                                                            backgroundColor: activity.color,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <i className={`${activity.icon}`}></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{activity.title}</h6>
                                                        <p className="text-muted mb-0 small">
                                                            {activity.amount && (
                                                                <span className="fw-semibold me-2" style={{ color: activity.color }}>
                                                                    {activity.amount}
                                                                </span>
                                                            )}
                                                            {new Date(activity.date).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'activities' && (
                                        <div>
                                            <h5 className="fw-bold mb-4">Historique Complet</h5>
                                            <p className="text-muted">Voici l'ensemble de vos contributions à la fondation :</p>
                                            
                                            <div className="mb-4">
                                                <h6 className="fw-semibold">2024</h6>
                                                {recentActivities.map((activity) => (
                                                    <div key={activity.id} className="border-start border-3 ps-3 mb-3" style={{ borderColor: activity.color + '!important' }}>
                                                        <div className="small text-muted">{new Date(activity.date).toLocaleDateString('fr-FR')}</div>
                                                        <div className="fw-semibold">{activity.title}</div>
                                                        {activity.amount && <div className="text-success small">{activity.amount}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'donations' && (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="fw-bold mb-0">Mes Contributions</h5>
                                                <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}>
                                                    <i className="bi bi-plus-circle me-2"></i>Faire un don
                                                </Button>
                                            </div>

                                            <Row className="g-4 mb-4">
                                                <Col md={4}>
                                                    <Card className="text-center border-0" style={{ backgroundColor: '#E8F5E8' }}>
                                                        <Card.Body>
                                                            <h3 className="fw-bold" style={{ color: '#5FA145' }}>
                                                                {memberStats.donations.total}
                                                            </h3>
                                                            <p className="mb-0">Total donné</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col md={4}>
                                                    <Card className="text-center border-0" style={{ backgroundColor: '#FFF0F5' }}>
                                                        <Card.Body>
                                                            <h3 className="fw-bold" style={{ color: '#E4518C' }}>
                                                                {memberStats.donations.count}
                                                            </h3>
                                                            <p className="mb-0">Dons effectués</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col md={4}>
                                                    <Card className="text-center border-0" style={{ backgroundColor: '#F0F8FF' }}>
                                                        <Card.Body>
                                                            <h3 className="fw-bold" style={{ color: '#667eea' }}>
                                                                65.000
                                                            </h3>
                                                            <p className="mb-0">Don moyen (FCFA)</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            <h6 className="fw-semibold mb-3">Historique des dons</h6>
                                            {recentActivities.filter(a => a.type === 'donation').map((donation) => (
                                                <div key={donation.id} className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                                                    <div>
                                                        <div className="fw-semibold">{donation.title}</div>
                                                        <div className="small text-muted">{new Date(donation.date).toLocaleDateString('fr-FR')}</div>
                                                    </div>
                                                    <div className="text-success fw-bold">{donation.amount}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'settings' && (
                                        <div>
                                            <h5 className="fw-bold mb-4">Paramètres du Profil</h5>
                                            
                                            <Form>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Nom complet</Form.Label>
                                                            <Form.Control 
                                                                type="text" 
                                                                value={formData.name}
                                                                disabled={!isEditing}
                                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control 
                                                                type="email" 
                                                                value={formData.email}
                                                                disabled={!isEditing}
                                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Téléphone</Form.Label>
                                                            <Form.Control 
                                                                type="tel" 
                                                                value={formData.phone}
                                                                disabled={!isEditing}
                                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Ville</Form.Label>
                                                            <Form.Select 
                                                                value={formData.city}
                                                                disabled={!isEditing}
                                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                            >
                                                                <option value="Yaoundé">Yaoundé</option>
                                                                <option value="Douala">Douala</option>
                                                                <option value="Bamenda">Bamenda</option>
                                                                <option value="Bafoussam">Bafoussam</option>
                                                                <option value="Garoua">Garoua</option>
                                                                <option value="Maroua">Maroua</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Profession</Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        value={formData.profession}
                                                        disabled={!isEditing}
                                                        onChange={(e) => setFormData({...formData, profession: e.target.value})}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label>À propos de moi</Form.Label>
                                                    <Form.Control 
                                                        as="textarea" 
                                                        rows={3}
                                                        value={formData.bio}
                                                        disabled={!isEditing}
                                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                                    />
                                                </Form.Group>

                                                <div className="bg-light p-3 rounded">
                                                    <h6 className="fw-semibold mb-2">Préférences de notification</h6>
                                                    <Form.Check 
                                                        type="switch" 
                                                        id="email-notifications" 
                                                        label="Recevoir les notifications par email"
                                                        defaultChecked
                                                        disabled={!isEditing}
                                                    />
                                                    <Form.Check 
                                                        type="switch" 
                                                        id="event-notifications" 
                                                        label="Être notifié des nouveaux événements"
                                                        defaultChecked
                                                        disabled={!isEditing}
                                                    />
                                                    <Form.Check 
                                                        type="switch" 
                                                        id="donation-receipts" 
                                                        label="Recevoir les reçus de dons automatiquement"
                                                        defaultChecked
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            </Form>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <ModernFooter />
            </div>
        </>
    );
}
