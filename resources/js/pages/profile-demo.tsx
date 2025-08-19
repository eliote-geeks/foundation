import { Head } from '@inertiajs/react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';
import Profile from './profile';

interface ProfileDemoProps {
    user?: {
        name: string;
        email: string;
        member_type?: string;
    };
    type: string;
}

export default function ProfileDemo({ user, type }: ProfileDemoProps) {
    // Types d'utilisateurs disponibles
    const userTypes = [
        {
            id: 'adherent',
            name: 'Adhérent Fondation',
            description: 'Membre actif de la communauté',
            color: '#5FA145',
            icon: 'bi-person-check-fill'
        },
        {
            id: 'ambassador',
            name: 'Ambassadeur',
            description: 'Représentant et promoteur',
            color: '#C69438',
            icon: 'bi-megaphone-fill'
        },
        {
            id: 'former_challenger',
            name: 'Ancien Challenger',
            description: 'Alumnus des programmes',
            color: '#E4518C',
            icon: 'bi-trophy-fill'
        },
        {
            id: 'partner',
            name: 'Partenaire',
            description: 'Organisation partenaire',
            color: '#334E15',
            icon: 'bi-building-fill'
        },
        {
            id: 'volunteer',
            name: 'Bénévole',
            description: 'Contributeur volontaire',
            color: '#6366F1',
            icon: 'bi-heart-fill'
        },
        {
            id: 'beneficiary',
            name: 'Bénéficiaire',
            description: 'Participant aux programmes',
            color: '#F59E0B',
            icon: 'bi-gift-fill'
        }
    ];

    // Si un type spécifique est demandé, afficher ce profil
    if (type && userTypes.find(t => t.id === type)) {
        return <Profile user={user} userType={type} />;
    }

    // Sinon, afficher la sélection des types de profil
    return (
        <>
            <Head>
                <title>Types de Profil - Fondation TITI</title>
                <meta name="description" content="Explorez les différents types de profil utilisateur de la Fondation TITI" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="profile-demo-page">
                <ModernHeader user={user} />
                
                {/* Hero Section */}
                <section 
                    className="demo-hero position-relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                        marginTop: '70px',
                        paddingTop: '80px',
                        paddingBottom: '60px'
                    }}
                >
                    <Container>
                        <div className="text-center text-white">
                            <h1 className="display-4 fw-bold mb-4">
                                Types de Profil Utilisateur
                            </h1>
                            <p className="lead mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
                                Découvrez les différents profils d'utilisateurs de la Fondation TITI et leurs modules spécifiques.
                                Chaque type d'utilisateur a accès à des fonctionnalités adaptées à ses besoins.
                            </p>
                        </div>
                    </Container>
                </section>

                {/* Types de profil */}
                <section className="py-5">
                    <Container>
                        <Row className="g-4">
                            {userTypes.map(userType => (
                                <Col lg={4} md={6} key={userType.id}>
                                    <Card 
                                        className="border-0 h-100 text-center"
                                        style={{
                                            borderRadius: '20px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        <div 
                                            className="p-4"
                                            style={{
                                                background: `linear-gradient(135deg, ${userType.color} 0%, ${userType.color}80 100%)`,
                                                borderRadius: '20px 20px 0 0'
                                            }}
                                        >
                                            <div 
                                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    background: 'rgba(255,255,255,0.2)',
                                                    backdropFilter: 'blur(10px)'
                                                }}
                                            >
                                                <i 
                                                    className={`${userType.icon} text-white`}
                                                    style={{ fontSize: '2rem' }}
                                                ></i>
                                            </div>
                                            <h5 className="fw-bold text-white mb-2">
                                                {userType.name}
                                            </h5>
                                            <p className="text-white opacity-90 mb-0">
                                                {userType.description}
                                            </p>
                                        </div>

                                        <Card.Body className="p-4">
                                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                                                Explorez les fonctionnalités et modules spécifiques à ce type de profil utilisateur.
                                            </p>
                                            
                                            <div className="d-flex gap-2">
                                                <Button
                                                    href={`/profile/${userType.id}`}
                                                    className="flex-grow-1"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${userType.color} 0%, ${userType.color}CC 100%)`,
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    <i className="bi bi-eye me-2"></i>
                                                    Voir le Profil
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Section info */}
                        <Row className="mt-5">
                            <Col lg={8} className="mx-auto text-center">
                                <Card 
                                    className="border-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                        borderRadius: '20px'
                                    }}
                                >
                                    <Card.Body className="p-5">
                                        <i 
                                            className="bi bi-info-circle mb-4"
                                            style={{ fontSize: '3rem', color: '#5FA145' }}
                                        ></i>
                                        <h4 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                            Profils Adaptatifs
                                        </h4>
                                        <p className="text-muted mb-4">
                                            Chaque type d'utilisateur dispose de modules personnalisés selon ses besoins et permissions.
                                            Les fonctionnalités s'adaptent automatiquement au profil de l'utilisateur connecté.
                                        </p>
                                        <div className="d-flex justify-content-center gap-3">
                                            <Button
                                                href="/simple-register"
                                                style={{
                                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                    border: 'none',
                                                    borderRadius: '50px',
                                                    padding: '12px 24px'
                                                }}
                                            >
                                                <i className="bi bi-person-plus me-2"></i>
                                                Créer un Compte
                                            </Button>
                                            <Button
                                                href="/login"
                                                variant="outline-secondary"
                                                style={{
                                                    borderColor: '#5FA145',
                                                    color: '#5FA145',
                                                    borderRadius: '50px',
                                                    padding: '12px 24px'
                                                }}
                                            >
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Se Connecter
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>

                <ModernFooter />
            </div>
        </>
    );
}