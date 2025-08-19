import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { ModernHeader } from '../../components/home/modern-header';
import { ModernFooter } from '../../components/home/modern-footer';
import { useTranslation } from '../../hooks/useTranslation';

type SimpleRegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    member_type: string;
    phone?: string;
    city?: string;
};

interface Props {
    memberTypes?: Record<string, any>;
}

export default function SimpleRegister({ memberTypes = {} }: Props) {
    const { t } = useTranslation();
    const [selectedMemberType, setSelectedMemberType] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<SimpleRegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        member_type: 'adherent',
        phone: '',
        city: '',
    });

    // Types de membres par défaut si pas fournis par le backend
    const defaultMemberTypes = {
        adherent: {
            label: 'Adhérent',
            description: 'Membre de la communauté',
            icon: '👤',
            color: 'blue'
        },
        ambassador: {
            label: 'Ambassadeur',
            description: 'Représentant de la fondation',
            icon: '🌟',
            color: 'gold'
        },
        challenger: {
            label: 'Ancien challenger',
            description: 'Participant aux défis',
            icon: '🏆',
            color: 'green'
        },
        partner: {
            label: 'Partenaire',
            description: 'Partenaire institutionnel',
            icon: '🤝',
            color: 'purple'
        },
        volunteer: {
            label: 'Bénévole',
            description: 'Contributeur bénévole',
            icon: '❤️',
            color: 'red'
        },
        beneficiary: {
            label: 'Bénéficiaire',
            description: 'Bénéficiaire des programmes',
            icon: '🎯',
            color: 'cyan'
        }
    };

    const types = Object.keys(memberTypes).length > 0 ? memberTypes : defaultMemberTypes;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const getCardStyle = (color: string, isSelected: boolean) => {
        if (isSelected) {
            const colorMap = {
                'blue': {
                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                    borderColor: '#5FA145',
                    boxShadow: '0 8px 25px rgba(95, 161, 69, 0.4)'
                },
                'gold': {
                    background: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)',
                    borderColor: '#C69438',
                    boxShadow: '0 8px 25px rgba(198, 148, 56, 0.4)'
                },
                'green': {
                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                    borderColor: '#5FA145',
                    boxShadow: '0 8px 25px rgba(95, 161, 69, 0.4)'
                },
                'purple': {
                    background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
                    borderColor: '#E4518C',
                    boxShadow: '0 8px 25px rgba(228, 81, 140, 0.4)'
                },
                'red': {
                    background: 'linear-gradient(135deg, #E4518C 0%, #C69438 100%)',
                    borderColor: '#E4518C',
                    boxShadow: '0 8px 25px rgba(228, 81, 140, 0.4)'
                },
                'cyan': {
                    background: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)',
                    borderColor: '#4D8A3C',
                    boxShadow: '0 8px 25px rgba(77, 138, 60, 0.4)'
                }
            };
            return colorMap[color as keyof typeof colorMap] || colorMap.blue;
        }
        
        return {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        };
    };

    return (
        <>
            <Head title={(t('register', 'Inscription') || 'Inscription') + ' - Fondation TITI'} />
            
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
                            <Col lg={8} md={10} sm={12}>
                                {/* Logo et branding */}
                                <div className="text-center mb-5">
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
                                    <h1 className="h2 fw-bold text-white mb-2">
                                        {t('joinFoundation', 'Rejoignez la Fondation Titi')}
                                    </h1>
                                    <p className="text-white" style={{ opacity: 0.9 }}>
                                        Créez votre compte en quelques étapes simples et rejoignez notre communauté.
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
                                            {/* Sélection du type de membre */}
                                            <div className="mb-5">
                                                <h3 className="h5 fw-bold mb-3" style={{ color: '#374151' }}>
                                                    <i className="bi bi-person-badge me-2" style={{ color: '#5FA145' }}></i>
                                                    {t('selectMemberType', 'Choisissez votre type de membre')}
                                                </h3>
                                                <Row className="g-3">
                                                    {Object.entries(types).map(([key, memberType]) => {
                                                        const isSelected = data.member_type === key;
                                                        const style = getCardStyle(memberType.color, isSelected);
                                                        
                                                        return (
                                                            <Col md={4} key={key}>
                                                                <div
                                                                    className="member-type-card p-3 rounded-3 text-center h-100 position-relative"
                                                                    style={{
                                                                        ...style,
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s ease',
                                                                        border: `2px solid ${style.borderColor || 'rgba(255, 255, 255, 0.3)'}`
                                                                    }}
                                                                    onClick={() => setData('member_type', key)}
                                                                >
                                                                    <div className="mb-2" style={{ fontSize: '2rem' }}>
                                                                        {memberType.icon}
                                                                    </div>
                                                                    <h6 
                                                                        className="fw-bold mb-1"
                                                                        style={{ 
                                                                            color: isSelected ? '#FFF' : '#374151' 
                                                                        }}
                                                                    >
                                                                        {memberType.label}
                                                                    </h6>
                                                                    <small 
                                                                        style={{ 
                                                                            color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#6B7280' 
                                                                        }}
                                                                    >
                                                                        {memberType.description}
                                                                    </small>
                                                                    {isSelected && (
                                                                        <div className="position-absolute top-0 end-0 p-2">
                                                                            <i className="bi bi-check-circle-fill text-white"></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                        );
                                                    })}
                                                </Row>
                                                {errors.member_type && (
                                                    <div className="text-danger small mt-2">
                                                        {errors.member_type}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Informations de base */}
                                            <Row>
                                                {/* Nom complet */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            {t('name', 'Nom complet')} *
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
                                                            {t('email', 'Email')} *
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

                                                {/* Téléphone */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            {t('phone', 'Téléphone')}
                                                        </Form.Label>
                                                        <div className="position-relative">
                                                            <i 
                                                                className="bi bi-telephone position-absolute text-muted"
                                                                style={{
                                                                    left: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            ></i>
                                                            <Form.Control
                                                                type="tel"
                                                                name="phone"
                                                                value={data.phone}
                                                                onChange={(e) => setData('phone', e.target.value)}
                                                                placeholder="+237 6XX XXX XXX"
                                                                className="ps-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 20px 12px 40px',
                                                                    borderColor: errors.phone ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                        </div>
                                                        {errors.phone && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.phone}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                {/* Ville */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            {t('city', 'Ville')}
                                                        </Form.Label>
                                                        <div className="position-relative">
                                                            <i 
                                                                className="bi bi-geo-alt position-absolute text-muted"
                                                                style={{
                                                                    left: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            ></i>
                                                            <Form.Control
                                                                type="text"
                                                                name="city"
                                                                value={data.city}
                                                                onChange={(e) => setData('city', e.target.value)}
                                                                placeholder="Votre ville"
                                                                className="ps-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 20px 12px 40px',
                                                                    borderColor: errors.city ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                        </div>
                                                        {errors.city && (
                                                            <div className="text-danger small mt-1">
                                                                {errors.city}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                {/* Mot de passe */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            {t('password', 'Mot de passe')} *
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
                                                </Col>

                                                {/* Confirmation mot de passe */}
                                                <Col md={6}>
                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="fw-semibold mb-2" style={{ color: '#374151' }}>
                                                            {t('confirmPassword', 'Confirmer le mot de passe')} *
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
                                                                type={showPasswordConfirm ? 'text' : 'password'}
                                                                name="password_confirmation"
                                                                value={data.password_confirmation}
                                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                                required
                                                                placeholder="••••••••"
                                                                className="ps-5 pe-5"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    padding: '12px 40px 12px 40px',
                                                                    borderColor: errors.password_confirmation ? '#dc3545' : '#D1D5DB',
                                                                    fontSize: '1rem'
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-link position-absolute border-0 p-0 text-muted"
                                                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                                style={{
                                                                    right: '12px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)'
                                                                }}
                                                            >
                                                                <i className={`bi ${showPasswordConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                            </button>
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
                                                        {t('processing', 'Création du compte...')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-person-plus me-2"></i>
                                                        {t('register', 'Créer mon compte')}
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
                                                        {t('login', 'Se connecter')}
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