import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Inscription - Fondation TITI" />
            
            <div className="register-page">
                <ModernHeader />
                
                {/* Section Hero avec formulaire */}
                <section 
                    className="min-vh-100 d-flex align-items-center py-5"
                    style={{
                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                        marginTop: '70px'
                    }}
                >
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={6} md={8} sm={10}>
                                {/* Logo et branding */}
                                <div className="text-center mb-4">
                                    <div 
                                        className="logo-container mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <img 
                                            src="/logo foundation.jpg"
                                            alt="Logo Fondation TITI"
                                            className="rounded-circle"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <h1 className="h2 fw-bold text-white mb-2">Bienvenue !</h1>
                                    <p className="text-white" style={{ opacity: 0.9 }}>
                                        Créez votre compte pour rejoindre notre communauté d'impact social.
                                    </p>
                                </div>

                                {/* Formulaire d'inscription */}
                                <Card 
                                    className="border-0 shadow-lg"
                                    style={{
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <Card.Body className="p-5">
                                        <Form onSubmit={submit}>
                                            <Row>
                                                {/* Nom complet */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            Nom complet
                                                        </Form.Label>
                                                        <div className="position-relative">
                                                            <i 
                                                                className="bi bi-person position-absolute text-muted"
                                                                style={{
                                                                    left: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            ></i>
                                                            <Form.Control
                                                                type="text"
                                                                name="name"
                                                                value={data.name}
                                                                onChange={(e) => setData('name', e.target.value)}
                                                                required
                                                                autoFocus
                                                                placeholder="Votre nom complet"
                                                                className="ps-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 20px 12px 40px',
                                                                    borderColor: errors.name ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                        </div>
                                                        {errors.name && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.name}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                {/* Email */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            Adresse email
                                                        </Form.Label>
                                                        <div className="position-relative">
                                                            <i 
                                                                className="bi bi-envelope position-absolute text-muted"
                                                                style={{
                                                                    left: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            ></i>
                                                            <Form.Control
                                                                type="email"
                                                                name="email"
                                                                value={data.email}
                                                                onChange={(e) => setData('email', e.target.value)}
                                                                required
                                                                placeholder="votre@email.com"
                                                                className="ps-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 20px 12px 40px',
                                                                    borderColor: errors.email ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                        </div>
                                                        {errors.email && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.email}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                {/* Mot de passe */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            Mot de passe
                                                        </Form.Label>
                                                        <div className="position-relative">
                                                            <i 
                                                                className="bi bi-lock position-absolute text-muted"
                                                                style={{
                                                                    left: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            ></i>
                                                            <Form.Control
                                                                type="password"
                                                                name="password"
                                                                value={data.password}
                                                                onChange={(e) => setData('password', e.target.value)}
                                                                required
                                                                placeholder="••••••••"
                                                                className="ps-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 20px 12px 40px',
                                                                    borderColor: errors.password ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                        </div>
                                                        {errors.password && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.password}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                {/* Confirmation mot de passe */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            Confirmer le mot de passe
                                                        </Form.Label>
                                                        <div className="position-relative">
                                                            <i 
                                                                className="bi bi-lock position-absolute text-muted"
                                                                style={{
                                                                    left: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            ></i>
                                                            <Form.Control
                                                                type="password"
                                                                name="password_confirmation"
                                                                value={data.password_confirmation}
                                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                required
                                                                placeholder="••••••••"
                                                                className="ps-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 20px 12px 40px',
                                                                    borderColor: errors.password_confirmation ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                        </div>
                                                        {errors.password_confirmation && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.password_confirmation}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            {/* Bouton d'inscription */}
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-100 fw-bold py-3 mb-4"
                                                size="lg"
                                                style={{
                                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    fontSize: '1.1rem',
                                                    boxShadow: '0 4px 15px rgba(95, 161, 69, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!processing) {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.4)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!processing) {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(95, 161, 69, 0.3)';
                                                    }
                                                }}
                                            >
                                                {processing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Création du compte...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-person-plus me-2"></i>
                                                        Créer mon compte
                                                    </>
                                                )}
                                            </Button>

                                            {/* Lien vers connexion */}
                                            <div className="text-center">
                                                <p className="mb-2" style={{ color: '#6B7280' }}>
                                                    Déjà membre ?{' '}
                                                    <a 
                                                        href={route('login')} 
                                                        className="text-decoration-none fw-semibold"
                                                        style={{ color: '#5FA145' }}
                                                    >
                                                        Se connecter
                                                    </a>
                                                </p>
                                                <small className="text-muted">
                                                    En créant votre compte, vous acceptez nos conditions d'utilisation
                                                </small>
                                            </div>
                                        </Form>
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
