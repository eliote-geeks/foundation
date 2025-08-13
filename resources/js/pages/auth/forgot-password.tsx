import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Mot de passe oublié - Fondation TITI" />
            
            <div className="forgot-password-page">
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
                            <Col lg={5} md={7} sm={10}>
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
                                        <i 
                                            className="bi bi-key text-white" 
                                            style={{ fontSize: '2rem' }}
                                        ></i>
                                    </div>
                                    <h1 className="h2 fw-bold text-white mb-2">Mot de passe oublié ?</h1>
                                    <p className="text-white" style={{ opacity: 0.9 }}>
                                        Saisissez votre adresse email pour recevoir un lien de réinitialisation.
                                    </p>
                                </div>

                                {/* Formulaire */}
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

                                            {/* Bouton d'envoi */}
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
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-envelope-arrow-up me-2"></i>
                                                        Envoyer le lien de réinitialisation
                                                    </>
                                                )}
                                            </Button>

                                            {/* Retour à la connexion */}
                                            <div className="text-center">
                                                <p className="mb-0" style={{ color: '#6B7280' }}>
                                                    Vous vous souvenez de votre mot de passe ?{' '}
                                                    <a 
                                                        href={route('login')} 
                                                        className="text-decoration-none fw-semibold"
                                                        style={{ color: '#5FA145' }}
                                                    >
                                                        Retour à la connexion
                                                    </a>
                                                </p>
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
