import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Connexion - Fondation TITI" />
            
            <div className="login-page">
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
                            <Col lg={5} md={8} sm={10}>
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
                                    <h1 className="h2 fw-bold text-white mb-2">Connexion</h1>
                                    <p className="text-white" style={{ opacity: 0.9 }}>
                                        Bon retour parmi nous ! Accédez à votre espace membre.
                                    </p>
                                </div>

                                {/* Formulaire de connexion */}
                                <Card 
                                    className="border-0 shadow-lg"
                                    style={{
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <Card.Body className="p-5">
                                        {status && (
                                            <Alert variant="success" className="mb-4">
                                                <i className="bi bi-check-circle me-2"></i>
                                                {status}
                                            </Alert>
                                        )}

                                        <Form onSubmit={submit}>
                                            {/* Email */}
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
                                                        autoFocus
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

                                            {/* Mot de passe */}
                                            <Form.Group className="mb-4">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <Form.Label className="fw-semibold mb-0" style={{ color: '#374151' }}>
                                                        Mot de passe
                                                    </Form.Label>
                                                    {canResetPassword && (
                                                        <a 
                                                            href={route('password.request')} 
                                                            className="small text-decoration-none"
                                                            style={{ color: '#5FA145' }}
                                                        >
                                                            Mot de passe oublié ?
                                                        </a>
                                                    )}
                                                </div>
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
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        required
                                                        placeholder="••••••••"
                                                        className="ps-5 pe-5"
                                                        style={{
                                                            borderRadius: '12px',
                                                            padding: '12px 40px 12px 40px',
                                                            borderColor: errors.password ? '#dc3545' : '#D1D5DB',
                                                            fontSize: '1rem'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-link position-absolute border-0 p-0 text-muted"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{
                                                            right: '12px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)'
                                                        }}
                                                    >
                                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <div className="text-danger small mt-1">
                                                        {errors.password}
                                                    </div>
                                                )}
                                            </Form.Group>

                                            {/* Se souvenir de moi */}
                                            <Form.Check
                                                type="checkbox"
                                                id="remember"
                                                label="Se souvenir de moi"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="mb-4"
                                                style={{ color: '#6B7280' }}
                                            />

                                            {/* Bouton de connexion */}
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
                                                        Connexion...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                                        Se connecter
                                                    </>
                                                )}
                                            </Button>

                                            {/* Lien vers inscription */}
                                            <div className="text-center">
                                                <p className="mb-0" style={{ color: '#6B7280' }}>
                                                    Pas encore membre ?{' '}
                                                    <a 
                                                        href={route('register')} 
                                                        className="text-decoration-none fw-semibold"
                                                        style={{ color: '#5FA145' }}
                                                    >
                                                        Créer un compte gratuitement
                                                    </a>
                                                </p>
                                                <small className="text-muted">
                                                    Rejoignez notre communauté d'impact social
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