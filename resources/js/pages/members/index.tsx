import { Row, Col, Card, Button, Badge, Tab, Tabs, Container } from 'react-bootstrap';
import { FoundationLayout } from '@/layouts/foundation-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface MembersIndexProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
}

export default function MembersIndex({ auth }: MembersIndexProps) {
    const { t } = useTranslation();

    const membershipTypes = [
        {
            id: 'member',
            name: 'Adhérent',
            description: 'Rejoignez notre communauté et participez à nos actions',
            benefits: [
                'Accès aux événements membres',
                'Newsletter mensuelle',
                'Vote aux assemblées générales',
                'Tarifs préférentiels sur les événements'
            ],
            price: '25 000 FCFA/an',
            color: 'primary',
            icon: 'bi-person-check'
        },
        {
            id: 'ambassador',
            name: 'Ambassadeur',
            description: 'Devenez porte-parole de nos valeurs et missions',
            benefits: [
                'Tous les avantages adhérent',
                'Formation leadership social',
                'Participation aux décisions stratégiques',
                'Kit communication personnalisé',
                'Invitations événements VIP'
            ],
            price: '75 000 FCFA/an',
            color: 'success',
            icon: 'bi-megaphone'
        },
        {
            id: 'challenger',
            name: 'Alumni Challenger',
            description: 'Réseau exclusif des anciens participants aux programmes',
            benefits: [
                'Accès réseau alumni',
                'Mentorat nouvelles générations',
                'Opportunités professionnelles',
                'Événements networking',
                'Plateforme d\'entraide'
            ],
            price: 'Gratuit',
            color: 'warning',
            icon: 'bi-trophy'
        },
        {
            id: 'partner',
            name: 'Partenaire Corporate',
            description: 'Partenariat entreprise pour l\'impact social',
            benefits: [
                'Visibilité sur nos supports',
                'Accès aux talents formés',
                'CSR et impact mesurable',
                'Événements B2B exclusifs',
                'Rapports d\'impact détaillés'
            ],
            price: 'Sur devis',
            color: 'info',
            icon: 'bi-building'
        }
    ];

    const communityStats = {
        totalMembers: 2850,
        newThisMonth: 125,
        activeEvents: 15,
        impactProjects: 45
    };

    return (
        <FoundationLayout user={auth?.user}>
            <Head title={t('members')} />
            
            {/* Hero Section */}
            <div className="position-relative mb-5 overflow-hidden" style={{ borderRadius: '24px' }}>
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.95) 0%, rgba(99, 102, 241, 0.9) 100%)',
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
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={8} className="text-white">
                                <div className="pe-lg-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div 
                                            className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 floating"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                background: 'rgba(255, 255, 255, 0.15)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            <i className="bi bi-people text-white" style={{ fontSize: '1.5rem' }}></i>
                                        </div>
                                        <div>
                                            <h1 className="text-white mb-0 fw-bold h2">Espace Membres</h1>
                                            <small className="text-white opacity-75">Rejoignez notre communauté d'impact</small>
                                        </div>
                                    </div>
                                    
                                    <p className="lead text-white opacity-90 mb-4" style={{ fontSize: '18px' }}>
                                        Intégrez une communauté engagée de leaders, ambassadeurs et passionnés d'impact social. 
                                        Ensemble, construisons un avenir plus solidaire et durable.
                                    </p>
                                    
                                    <div className="d-flex gap-3 flex-wrap">
                                        <Button className="btn-gradient-info btn-lg">
                                            <i className="bi bi-person-plus me-2"></i>
                                            Devenir membre
                                        </Button>
                                        <button className="btn btn-outline-light btn-lg">
                                            <i className="bi bi-people-fill me-2"></i>
                                            Découvrir la communauté
                                        </button>
                                    </div>
                                </div>
                            </Col>
                            
                            <Col lg={4} className="text-center mt-4 mt-lg-0">
                                <div 
                                    className="glass-card p-4"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        minHeight: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <div className="text-center text-white">
                                        <i className="bi bi-people-fill mb-3" style={{ fontSize: '3rem', opacity: 0.8 }}></i>
                                        <h6 className="text-white mb-2">Membres Actifs</h6>
                                        <div className="h4 text-white mb-0">{communityStats.totalMembers.toLocaleString()}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <div className="mb-4">
                
                {/* Statistiques communauté */}
                <Row className="g-3 mb-4">
                    <Col md={3} sm={6}>
                        <Card className="text-center border-0 bg-primary bg-opacity-10">
                            <Card.Body>
                                <i className="bi bi-people text-primary fs-1 mb-2"></i>
                                <h4 className="text-primary mb-1">{communityStats.totalMembers.toLocaleString()}</h4>
                                <small className="text-muted">Membres actifs</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} sm={6}>
                        <Card className="text-center border-0 bg-success bg-opacity-10">
                            <Card.Body>
                                <i className="bi bi-person-plus text-success fs-1 mb-2"></i>
                                <h4 className="text-success mb-1">+{communityStats.newThisMonth}</h4>
                                <small className="text-muted">Nouveaux ce mois</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} sm={6}>
                        <Card className="text-center border-0 bg-warning bg-opacity-10">
                            <Card.Body>
                                <i className="bi bi-calendar-event text-warning fs-1 mb-2"></i>
                                <h4 className="text-warning mb-1">{communityStats.activeEvents}</h4>
                                <small className="text-muted">Événements actifs</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} sm={6}>
                        <Card className="text-center border-0 bg-info bg-opacity-10">
                            <Card.Body>
                                <i className="bi bi-lightbulb text-info fs-1 mb-2"></i>
                                <h4 className="text-info mb-1">{communityStats.impactProjects}</h4>
                                <small className="text-muted">Projets d'impact</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Tabs defaultActiveKey="membership" className="mb-4">
                <Tab eventKey="membership" title={
                    <>
                        <i className="bi bi-person-badge me-2"></i>
                        Types d'adhésion
                    </>
                }>
                    <Row className="g-4">
                        {membershipTypes.map((type) => (
                            <Col key={type.id} lg={6}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Body className="d-flex flex-column">
                                        <div className="text-center mb-4">
                                            <div className={`bg-${type.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                                                 style={{ width: '80px', height: '80px' }}>
                                                <i className={`${type.icon} text-${type.color} fs-1`}></i>
                                            </div>
                                            <h4 className="mb-2">{type.name}</h4>
                                            <p className="text-muted">{type.description}</p>
                                        </div>
                                        
                                        <div className="mb-4 flex-grow-1">
                                            <h6 className="mb-3">Avantages inclus :</h6>
                                            <ul className="list-unstyled">
                                                {type.benefits.map((benefit, index) => (
                                                    <li key={index} className="mb-2">
                                                        <i className={`bi bi-check-circle text-${type.color} me-2`}></i>
                                                        <small>{benefit}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="border-top pt-3 text-center">
                                            <div className="mb-3">
                                                <span className="text-muted small">À partir de</span>
                                                <div className={`h4 text-${type.color} mb-0`}>{type.price}</div>
                                            </div>
                                            
                                            <Button variant={type.color} className="w-100">
                                                <i className="bi bi-arrow-right me-2"></i>
                                                {type.id === 'partner' ? 'Nous contacter' : 'Devenir membre'}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
                
                <Tab eventKey="community" title={
                    <>
                        <i className="bi bi-chat-dots me-2"></i>
                        Communauté
                    </>
                }>
                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="mb-3">
                                        <i className="bi bi-newspaper text-primary me-2"></i>
                                        Actualités de la communauté
                                    </h5>
                                    
                                    <div className="border-bottom pb-3 mb-3">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                 style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                                                <i className="bi bi-trophy"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Nouveau programme de mentorat lancé</h6>
                                                <p className="text-muted small mb-2">
                                                    Les ambassadeurs peuvent maintenant mentorer les nouveaux challengers.
                                                </p>
                                                <small className="text-muted">Il y a 2 jours</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-bottom pb-3 mb-3">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                 style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                                                <i className="bi bi-calendar-event"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Assemblée Générale 2024</h6>
                                                <p className="text-muted small mb-2">
                                                    Inscrivez-vous pour participer aux décisions importantes.
                                                </p>
                                                <small className="text-muted">Il y a 5 jours</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="d-flex align-items-start">
                                            <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                 style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                                                <i className="bi bi-people"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Nouveau partenariat avec EcoTech</h6>
                                                <p className="text-muted small mb-2">
                                                    Opportunités de stages et emplois pour nos membres.
                                                </p>
                                                <small className="text-muted">Il y a 1 semaine</small>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col lg={4}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h6 className="mb-3">
                                        <i className="bi bi-calendar-week text-success me-2"></i>
                                        Événements à venir
                                    </h6>
                                    
                                    <div className="border-bottom pb-2 mb-2">
                                        <div className="small fw-bold">15 Mars</div>
                                        <div className="small text-muted">Atelier leadership</div>
                                    </div>
                                    
                                    <div className="border-bottom pb-2 mb-2">
                                        <div className="small fw-bold">22 Mars</div>
                                        <div className="small text-muted">Networking ambassadeurs</div>
                                    </div>
                                    
                                    <div className="border-bottom pb-2 mb-2">
                                        <div className="small fw-bold">1 Avril</div>
                                        <div className="small text-muted">Conférence impact</div>
                                    </div>
                                    
                                    <Button variant="outline-success" size="sm" className="w-100 mt-2">
                                        Voir tous les événements
                                    </Button>
                                </Card.Body>
                            </Card>
                            
                            <Card>
                                <Card.Body className="text-center">
                                    <i className="bi bi-chat-heart text-primary fs-1 mb-3"></i>
                                    <h6>Besoin d'aide ?</h6>
                                    <p className="small text-muted mb-3">
                                        Notre équipe est là pour vous accompagner
                                    </p>
                                    <Button variant="primary" size="sm">
                                        <i className="bi bi-envelope me-2"></i>
                                        Nous contacter
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </FoundationLayout>
    );
}