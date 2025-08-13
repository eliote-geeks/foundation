import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface Contest {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    endDate: string;
    votes: number;
    status: 'active' | 'ended' | 'upcoming';
    prize: string;
}

interface ContestsProps {
    user?: {
        name: string;
        email: string;
    };
}

export default function Contests({ user }: ContestsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [votedContests, setVotedContests] = useState<number[]>([]);

    // Données de concours exemples
    const contests: Contest[] = [
        {
            id: 1,
            title: "Innovation Sociale 2025",
            description: "Proposez votre projet d'innovation sociale pour transformer votre communauté et gagner un financement de 5M FCFA.",
            image: "🚀",
            category: "innovation",
            endDate: "2025-03-15",
            votes: 342,
            status: 'active',
            prize: "5M FCFA"
        },
        {
            id: 2,
            title: "Entrepreneuriat Vert",
            description: "Concours dédié aux projets environnementaux durables avec un impact positif sur l'écosystème.",
            image: "🌱",
            category: "environnement",
            endDate: "2025-04-20",
            votes: 256,
            status: 'active',
            prize: "3M FCFA"
        },
        {
            id: 3,
            title: "Éducation Numérique",
            description: "Développez des solutions éducatives numériques pour améliorer l'apprentissage des jeunes.",
            image: "📚",
            category: "education",
            endDate: "2025-05-10",
            votes: 189,
            status: 'active',
            prize: "4M FCFA"
        },
        {
            id: 4,
            title: "Santé Communautaire",
            description: "Initiatives pour améliorer l'accès aux soins de santé dans les communautés rurales.",
            image: "⚕️",
            category: "sante",
            endDate: "2025-02-28",
            votes: 423,
            status: 'active',
            prize: "6M FCFA"
        },
        {
            id: 5,
            title: "Art & Culture",
            description: "Valorisez le patrimoine culturel local à travers des projets artistiques innovants.",
            image: "🎨",
            category: "culture",
            endDate: "2025-01-30",
            votes: 178,
            status: 'ended',
            prize: "2M FCFA"
        },
        {
            id: 6,
            title: "Tech for Good",
            description: "Solutions technologiques au service du bien commun et de l'inclusion sociale.",
            image: "💻",
            category: "innovation",
            endDate: "2025-06-15",
            votes: 95,
            status: 'upcoming',
            prize: "7M FCFA"
        }
    ];

    const categories = [
        { value: 'all', label: 'Toutes les catégories' },
        { value: 'innovation', label: 'Innovation' },
        { value: 'environnement', label: 'Environnement' },
        { value: 'education', label: 'Éducation' },
        { value: 'sante', label: 'Santé' },
        { value: 'culture', label: 'Culture' }
    ];

    const filteredContests = contests.filter(contest => {
        const matchesSearch = contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             contest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || contest.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleVote = (contestId: number) => {
        if (!votedContests.includes(contestId)) {
            setVotedContests([...votedContests, contestId]);
            // Ici, vous ajouteriez l'appel API pour enregistrer le vote
        }
    };

    const getStatusBadge = (status: Contest['status']) => {
        const badgeStyles = {
            active: { bg: '#5FA145', text: 'Actif' },
            ended: { bg: '#6B7280', text: 'Terminé' },
            upcoming: { bg: '#C69438', text: 'À venir' }
        };
        
        return (
            <Badge 
                style={{ 
                    backgroundColor: badgeStyles[status].bg,
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    padding: '4px 8px'
                }}
            >
                {badgeStyles[status].text}
            </Badge>
        );
    };

    const participationSteps = [
        {
            icon: '📝',
            title: 'Inscrivez-vous',
            description: 'Créez votre compte sur notre plateforme'
        },
        {
            icon: '💡',
            title: 'Soumettez votre projet',
            description: 'Présentez votre idée avec tous les détails'
        },
        {
            icon: '🗳️',
            title: 'Vote du public',
            description: 'La communauté vote pour les meilleurs projets'
        },
        {
            icon: '🏆',
            title: 'Remportez le prix',
            description: 'Les gagnants reçoivent financement et accompagnement'
        }
    ];

    return (
        <>
            <Head>
                <title>Concours - Fondation TITI</title>
                <meta name="description" content="Participez aux concours de la Fondation TITI et votez pour les projets qui transforment nos communautés." />
            </Head>

            <div className="contests-page">
                <ModernHeader user={user} />
                
                {/* Section Hero */}
                <section 
                    className="hero-section py-5"
                    style={{
                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                        marginTop: '70px',
                        minHeight: '300px'
                    }}
                >
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={8} className="text-center mx-auto">
                                <div className="hero-content py-5">
                                    <h1 
                                        className="display-4 fw-bold mb-4"
                                        style={{ color: '#FFFFFF', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                                    >
                                        Concours & Innovation
                                    </h1>
                                    <p 
                                        className="lead mb-4"
                                        style={{ color: '#FFFFFF', opacity: 0.9, fontSize: '1.2rem' }}
                                    >
                                        Découvrez les projets innovants de notre communauté et votez pour ceux qui vous inspirent le plus.
                                        Ensemble, soutenons les idées qui transforment nos sociétés.
                                    </p>
                                    <div 
                                        className="stats-row d-flex justify-content-center gap-4 flex-wrap"
                                        style={{ marginTop: '2rem' }}
                                    >
                                        <div className="text-center">
                                            <div className="h3 fw-bold mb-1" style={{ color: '#C69438' }}>12</div>
                                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>Concours actifs</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h3 fw-bold mb-1" style={{ color: '#E4518C' }}>2,450</div>
                                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>Votes exprimés</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h3 fw-bold mb-1" style={{ color: '#F5B4C6' }}>45</div>
                                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>Projets soutenus</div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Barre de recherche et filtres */}
                <section className="py-4" style={{ backgroundColor: '#F8F9FA' }}>
                    <Container>
                        <Row className="g-3 align-items-end">
                            <Col md={6}>
                                <Form.Label className="fw-semibold mb-2">Rechercher un concours</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text style={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}>
                                        <i className="bi bi-search text-muted"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Titre, description, catégorie..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ borderColor: '#D1D5DB' }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-semibold mb-2">Catégorie</Form.Label>
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{ borderColor: '#D1D5DB' }}
                                >
                                    {categories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <div className="text-muted small">
                                    {filteredContests.length} résultat{filteredContests.length > 1 ? 's' : ''}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Grille des concours */}
                <section className="py-5">
                    <Container>
                        <Row className="g-4">
                            {filteredContests.map(contest => (
                                <Col lg={4} md={6} key={contest.id}>
                                    <Card 
                                        className="contest-card h-100 border-0 shadow-sm"
                                        style={{
                                            borderRadius: '16px',
                                            transition: 'all 0.3s ease',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        <div 
                                            className="card-image-header text-center py-4"
                                            style={{
                                                background: `linear-gradient(135deg, ${
                                                    contest.category === 'innovation' ? '#5FA145' :
                                                    contest.category === 'environnement' ? '#4D8A3C' :
                                                    contest.category === 'education' ? '#C69438' :
                                                    contest.category === 'sante' ? '#E4518C' :
                                                    contest.category === 'culture' ? '#F5B4C6' : '#334E15'
                                                } 0%, rgba(255,255,255,0.1) 100%)`
                                            }}
                                        >
                                            <div style={{ fontSize: '3rem' }}>{contest.image}</div>
                                        </div>
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 className="card-title fw-bold mb-0" style={{ color: '#1F2937' }}>
                                                    {contest.title}
                                                </h5>
                                                {getStatusBadge(contest.status)}
                                            </div>
                                            
                                            <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                {contest.description}
                                            </p>

                                            <div className="contest-meta mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <small className="text-muted">
                                                        <i className="bi bi-calendar me-1"></i>
                                                        Fin: {new Date(contest.endDate).toLocaleDateString('fr-FR')}
                                                    </small>
                                                    <small className="fw-semibold" style={{ color: '#C69438' }}>
                                                        Prix: {contest.prize}
                                                    </small>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <small className="text-muted">
                                                        <i className="bi bi-hand-thumbs-up me-1"></i>
                                                        {contest.votes} votes
                                                    </small>
                                                </div>
                                            </div>

                                            <Button
                                                className="w-100 fw-semibold"
                                                disabled={contest.status === 'ended' || votedContests.includes(contest.id)}
                                                onClick={() => handleVote(contest.id)}
                                                style={{
                                                    backgroundColor: votedContests.includes(contest.id) ? '#6B7280' : 
                                                                   contest.status === 'ended' ? '#9CA3AF' : '#5FA145',
                                                    borderColor: 'transparent',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!votedContests.includes(contest.id) && contest.status === 'active') {
                                                        e.currentTarget.style.backgroundColor = '#4D8A3C';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!votedContests.includes(contest.id) && contest.status === 'active') {
                                                        e.currentTarget.style.backgroundColor = '#5FA145';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }
                                                }}
                                            >
                                                <i className={`bi ${
                                                    votedContests.includes(contest.id) ? 'bi-check-circle' :
                                                    contest.status === 'ended' ? 'bi-lock' :
                                                    contest.status === 'upcoming' ? 'bi-clock' : 'bi-hand-thumbs-up'
                                                } me-2`}></i>
                                                {votedContests.includes(contest.id) ? 'Voté !' :
                                                 contest.status === 'ended' ? 'Concours terminé' :
                                                 contest.status === 'upcoming' ? 'Bientôt disponible' : 'Voter pour ce projet'}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Section Comment participer */}
                <section 
                    className="py-5"
                    style={{
                        background: 'linear-gradient(135deg, #F8F9FA 0%, #E5E7EB 100%)'
                    }}
                >
                    <Container>
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#1F2937' }}>
                                Comment participer ?
                            </h2>
                            <p className="lead mx-auto" style={{ color: '#6B7280', maxWidth: '600px' }}>
                                Suivez ces 4 étapes simples pour participer à nos concours et donner vie à vos projets innovants.
                            </p>
                        </div>

                        <Row className="g-4">
                            {participationSteps.map((step, index) => (
                                <Col lg={3} md={6} key={index} className="text-center">
                                    <div 
                                        className="step-card p-4 h-100 rounded-4 position-relative"
                                        style={{
                                            background: '#FFFFFF',
                                            border: '2px solid transparent',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#5FA145';
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(95, 161, 69, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                                        }}
                                    >
                                        {/* Numéro d'étape */}
                                        <div 
                                            className="step-number position-absolute rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                backgroundColor: '#5FA145',
                                                color: '#FFFFFF',
                                                top: '-16px',
                                                left: '20px',
                                                fontSize: '0.875rem',
                                                boxShadow: '0 4px 10px rgba(95, 161, 69, 0.3)'
                                            }}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Icône */}
                                        <div 
                                            className="step-icon mb-3"
                                            style={{ fontSize: '3rem', marginTop: '1rem' }}
                                        >
                                            {step.icon}
                                        </div>

                                        {/* Titre */}
                                        <h4 className="fw-bold mb-3" style={{ color: '#1F2937' }}>
                                            {step.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                            {step.description}
                                        </p>
                                    </div>
                                </Col>
                            ))}
                        </Row>

                        {/* Bouton CTA */}
                        <div className="text-center mt-5">
                            <Button
                                size="lg"
                                className="px-5 py-3 fw-semibold"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                    border: 'none',
                                    borderRadius: '50px',
                                    color: '#FFFFFF',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 8px 25px rgba(95, 161, 69, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(95, 161, 69, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.3)';
                                }}
                            >
                                <i className="bi bi-rocket-takeoff me-2"></i>
                                Commencer maintenant
                            </Button>
                        </div>
                    </Container>
                </section>

                {/* Section statistiques */}
                <section 
                    className="py-5"
                    style={{
                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 100%)'
                    }}
                >
                    <Container>
                        <Row className="text-center text-white">
                            <Col md={3} className="mb-4">
                                <div className="stat-item">
                                    <div 
                                        className="stat-number display-4 fw-bold mb-2"
                                        style={{ color: '#C69438' }}
                                    >
                                        156
                                    </div>
                                    <div className="stat-label">Projets soumis</div>
                                </div>
                            </Col>
                            <Col md={3} className="mb-4">
                                <div className="stat-item">
                                    <div 
                                        className="stat-number display-4 fw-bold mb-2"
                                        style={{ color: '#E4518C' }}
                                    >
                                        23M
                                    </div>
                                    <div className="stat-label">FCFA distribués</div>
                                </div>
                            </Col>
                            <Col md={3} className="mb-4">
                                <div className="stat-item">
                                    <div 
                                        className="stat-number display-4 fw-bold mb-2"
                                        style={{ color: '#F5B4C6' }}
                                    >
                                        89%
                                    </div>
                                    <div className="stat-label">Taux de réussite</div>
                                </div>
                            </Col>
                            <Col md={3} className="mb-4">
                                <div className="stat-item">
                                    <div 
                                        className="stat-number display-4 fw-bold mb-2"
                                        style={{ color: '#5FA145' }}
                                    >
                                        1.2K
                                    </div>
                                    <div className="stat-label">Participants actifs</div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <ModernFooter />
            </div>
        </>
    );
}