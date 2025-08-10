import { Row, Col, Card, Button, Badge, ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { FoundationLayout } from '@/layouts/foundation-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Participant {
    id: number;
    name: string;
    description: string;
    image: string;
    votes: number;
    category: string;
}

interface Contest {
    id: number;
    title: string;
    description: string;
    long_description: string;
    image: string;
    start_date: string;
    end_date: string;
    vote_price: number;
    total_votes: number;
    status: 'upcoming' | 'active' | 'ended';
    participants: Participant[];
}

interface ContestShowProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
    contest: Contest;
}

export default function ContestShow({ auth, contest }: ContestShowProps) {
    const { t } = useTranslation();

    // Mock data si pas de données du backend
    const mockContest: Contest = {
        id: 1,
        title: 'Concours Innovation Sociale 2024',
        description: 'Récompensons les projets les plus innovants en matière d\'impact social et environnemental.',
        long_description: 'Ce concours vise à identifier et récompenser les initiatives les plus prometteuses dans le domaine de l\'innovation sociale. Les participants présenteront leurs projets qui contribuent à résoudre des défis sociétaux contemporains.',
        image: '/images/contest1.jpg',
        start_date: '2024-03-01',
        end_date: '2024-03-31',
        vote_price: 5.00,
        total_votes: 1250,
        status: 'active',
        participants: [
            {
                id: 1,
                name: 'EcoTech Solutions',
                description: 'Application mobile pour réduire l\'empreinte carbone personnelle',
                image: '/images/participant1.jpg',
                votes: 450,
                category: 'Environnement'
            },
            {
                id: 2,
                name: 'SolidariTech',
                description: 'Plateforme de mise en relation entre bénévoles et associations',
                image: '/images/participant2.jpg',
                votes: 380,
                category: 'Social'
            },
            {
                id: 3,
                name: 'EdTech Inclusif',
                description: 'Outils pédagogiques adaptés aux enfants en situation de handicap',
                image: '/images/participant3.jpg',
                votes: 420,
                category: 'Éducation'
            }
        ]
    };

    const displayContest = contest || mockContest;
    const sortedParticipants = displayContest.participants.sort((a, b) => b.votes - a.votes);
    const totalVotes = sortedParticipants.reduce((sum, p) => sum + p.votes, 0);

    const getStatusBadge = (status: string) => {
        const variants = {
            upcoming: 'secondary',
            active: 'success',
            ended: 'danger'
        };
        
        const labels = {
            upcoming: 'À venir',
            active: 'En cours',
            ended: 'Terminé'
        };
        
        return <Badge bg={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
    };

    return (
        <FoundationLayout user={auth?.user}>
            <Head title={displayContest.title} />
            
            {/* Header du concours */}
            <div className="mb-4">
                <Row className="align-items-center mb-4">
                    <Col>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="/contests" className="text-decoration-none">Concours</a>
                                </li>
                                <li className="breadcrumb-item active">{displayContest.title}</li>
                            </ol>
                        </nav>
                        
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <h1 className="display-6 mb-0">{displayContest.title}</h1>
                            {getStatusBadge(displayContest.status)}
                        </div>
                        
                        <p className="lead text-muted">{displayContest.description}</p>
                    </Col>
                </Row>

                <Row>
                    <Col lg={8}>
                        <Card className="mb-4">
                            <div 
                                className="card-img-top bg-gradient"
                                style={{
                                    height: '300px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <i className="bi bi-trophy text-white" style={{ fontSize: '6rem', opacity: 0.3 }}></i>
                            </div>
                            <Card.Body>
                                <p className="mb-0">{displayContest.long_description}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col lg={4}>
                        <Card className="sticky-top">
                            <Card.Body>
                                <h5 className="mb-4">
                                    <i className="bi bi-info-circle text-primary me-2"></i>
                                    Informations du concours
                                </h5>
                                
                                <div className="mb-3">
                                    <small className="text-muted">Statut</small>
                                    <div>{getStatusBadge(displayContest.status)}</div>
                                </div>
                                
                                <div className="mb-3">
                                    <small className="text-muted">Période de vote</small>
                                    <div className="small">
                                        Du {new Date(displayContest.start_date).toLocaleDateString('fr-FR')}
                                        <br />
                                        au {new Date(displayContest.end_date).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <small className="text-muted">Prix du vote</small>
                                    <div className="h5 text-success mb-0">{(displayContest.vote_price * 500).toLocaleString()} FCFA</div>
                                </div>
                                
                                <div className="mb-4">
                                    <small className="text-muted">Total des votes</small>
                                    <div className="h5 mb-2">{totalVotes.toLocaleString()}</div>
                                    <ProgressBar now={(totalVotes / 2000) * 100} className="mb-1" style={{ height: '8px' }} />
                                    <small className="text-muted">Objectif: 2000 votes</small>
                                </div>
                                
                                {displayContest.status === 'active' && (
                                    <Button variant="primary" size="lg" className="w-100">
                                        <i className="bi bi-hand-thumbs-up me-2"></i>
                                        Voter maintenant
                                    </Button>
                                )}
                                
                                {displayContest.status === 'upcoming' && (
                                    <Button variant="outline-secondary" size="lg" className="w-100" disabled>
                                        <i className="bi bi-clock me-2"></i>
                                        Vote à venir
                                    </Button>
                                )}
                                
                                {displayContest.status === 'ended' && (
                                    <Button variant="outline-success" size="lg" className="w-100">
                                        <i className="bi bi-trophy me-2"></i>
                                        Voir les résultats
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Participants */}
            <Card>
                <Card.Body>
                    <Tabs defaultActiveKey="participants" className="mb-4">
                        <Tab eventKey="participants" title={
                            <>
                                <i className="bi bi-people me-2"></i>
                                Participants ({sortedParticipants.length})
                            </>
                        }>
                            <Row className="g-4">
                                {sortedParticipants.map((participant, index) => (
                                    <Col key={participant.id} lg={6}>
                                        <Card className="h-100 border-0 shadow-sm">
                                            <Card.Body>
                                                <div className="d-flex align-items-start mb-3">
                                                    <div 
                                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{ width: '48px', height: '48px', minWidth: '48px' }}
                                                    >
                                                        <span className="fw-bold">#{index + 1}</span>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{participant.name}</h6>
                                                        <Badge bg="light" text="dark" className="mb-2">
                                                            {participant.category}
                                                        </Badge>
                                                        <p className="text-muted small mb-0">
                                                            {participant.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="border-top pt-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="text-muted small">Votes reçus</span>
                                                        <span className="fw-bold">{participant.votes.toLocaleString()}</span>
                                                    </div>
                                                    <ProgressBar 
                                                        now={(participant.votes / Math.max(...sortedParticipants.map(p => p.votes))) * 100}
                                                        style={{ height: '6px' }}
                                                    />
                                                </div>
                                                
                                                {displayContest.status === 'active' && (
                                                    <div className="mt-3">
                                                        <Button variant="outline-primary" size="sm" className="w-100">
                                                            <i className="bi bi-hand-thumbs-up me-1"></i>
                                                            Voter pour ce projet
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>
                        
                        <Tab eventKey="rules" title={
                            <>
                                <i className="bi bi-list-check me-2"></i>
                                Règlement
                            </>
                        }>
                            <div className="prose">
                                <h5>Règles de participation</h5>
                                <ul>
                                    <li>Chaque vote coûte {(displayContest.vote_price * 500).toLocaleString()} FCFA</li>
                                    <li>Vous pouvez voter pour plusieurs participants</li>
                                    <li>Les votes sont limités à 10 par utilisateur par participant</li>
                                    <li>Les paiements sont sécurisés et non remboursables</li>
                                    <li>Les résultats sont mis à jour en temps réel</li>
                                </ul>
                                
                                <h5>Critères d'évaluation</h5>
                                <ul>
                                    <li>Innovation et originalité du projet</li>
                                    <li>Impact social et environnemental</li>
                                    <li>Faisabilité et viabilité</li>
                                    <li>Présentation et communication</li>
                                </ul>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </FoundationLayout>
    );
}