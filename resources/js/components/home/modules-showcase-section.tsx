import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface Module {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
    features: string[];
    status: 'active' | 'coming-soon' | 'beta';
    stats?: {
        label: string;
        value: string;
    };
    ctaText: string;
    ctaHref: string;
}

export function ModulesShowcaseSection() {
    const { t } = useTranslation();
    const [activeModule, setActiveModule] = useState('contests');

    const modules: Module[] = [
        {
            id: 'contests',
            title: 'Concours avec Vote Payant',
            description: 'Organisez des concours avec système de vote sécurisé et paiement intégré. Gestion complète des participants et résultats.',
            icon: 'bi-trophy-fill',
            color: '#C69438',
            gradient: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)',
            features: [
                'Vote payant sécurisé',
                'Gestion des participants',
                'Tableau de bord en temps réel',
                'Notifications automatiques',
                'Export des résultats'
            ],
            status: 'active',
            stats: {
                label: 'Concours actifs',
                value: '3'
            },
            ctaText: 'Voir les concours',
            ctaHref: '/contests'
        },
        {
            id: 'tickets',
            title: 'Billetterie en Ligne',
            description: 'Système complet de vente de billets avec QR codes, gestion des stocks et tarification flexible.',
            icon: 'bi-ticket-perforated-fill',
            color: '#5FA145',
            gradient: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
            features: [
                'Billets électroniques QR',
                'Gestion des stocks',
                'Tarification flexible',
                'Paiement sécurisé',
                'Contrôle d\'accès'
            ],
            status: 'active',
            stats: {
                label: 'Événements à venir',
                value: '8'
            },
            ctaText: 'Explorer les événements',
            ctaHref: '/events'
        },
        {
            id: 'members',
            title: 'Espace Membres',
            description: 'Communauté segmentée avec adhérents, ambassadeurs et anciens challengers. Notifications ciblées et engagement.',
            icon: 'bi-people-fill',
            color: '#E4518C',
            gradient: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
            features: [
                'Profils personnalisés',
                'Segmentation avancée',
                'Notifications ciblées',
                'Tableau de bord membre',
                'Réseau alumni'
            ],
            status: 'active',
            stats: {
                label: 'Membres actifs',
                value: '2,850+'
            },
            ctaText: 'Rejoindre la communauté',
            ctaHref: '/simple-register'
        },
        {
            id: 'programs',
            title: 'Inscription aux Programmes',
            description: 'Plateforme complète pour gérer les appels à candidatures, sélections et suivi des formations.',
            icon: 'bi-mortarboard-fill',
            color: '#4D8A3C',
            gradient: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)',
            features: [
                'Appels à candidatures',
                'Processus de sélection',
                'Gestion des formations',
                'Certificats numériques',
                'Suivi personnalisé'
            ],
            status: 'beta',
            stats: {
                label: 'Programmes disponibles',
                value: '12'
            },
            ctaText: 'Découvrir les programmes',
            ctaHref: '/programs'
        },
        {
            id: 'partners',
            title: 'Espace Partenaires',
            description: 'Vitrine des collaborations et espace privé dédié aux partenaires avec ressources et suivi des projets.',
            icon: 'bi-handshake-fill',
            color: '#334E15',
            gradient: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 100%)',
            features: [
                'Vitrine publique',
                'Espace privé partenaires',
                'Demandes de partenariat',
                'Suivi des collaborations',
                'Ressources marketing'
            ],
            status: 'coming-soon',
            stats: {
                label: 'Partenaires actifs',
                value: '45'
            },
            ctaText: 'Devenir partenaire',
            ctaHref: '/partners'
        },
        {
            id: 'multilingual',
            title: 'Plateforme Multilingue',
            description: 'Interface complètement traduite en français et anglais avec localisation automatique.',
            icon: 'bi-globe-americas',
            color: '#6366F1',
            gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            features: [
                'Français / Anglais',
                'Détection automatique',
                'Contenus localisés',
                'URLs multilingues',
                'Formats régionaux'
            ],
            status: 'active',
            ctaText: 'Changer de langue',
            ctaHref: '#'
        }
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'active': { bg: '#5FA145', text: 'Actif', icon: 'bi-check-circle-fill' },
            'beta': { bg: '#C69438', text: 'Bêta', icon: 'bi-wrench' },
            'coming-soon': { bg: '#E4518C', text: 'Bientôt', icon: 'bi-clock-fill' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge 
                className="d-inline-flex align-items-center gap-1 px-2 py-1"
                style={{ 
                    background: config.bg, 
                    fontSize: '0.7rem',
                    fontWeight: '500'
                }}
            >
                <i className={config.icon}></i>
                {config.text}
            </Badge>
        );
    };

    return (
        <section 
            className="modules-showcase py-5"
            style={{
                background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                minHeight: '100vh'
            }}
        >
            <Container>
                {/* Header */}
                <Row className="mb-5">
                    <Col className="text-center">
                        <div 
                            className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-4"
                            style={{
                                background: 'linear-gradient(135deg, rgba(95, 161, 69, 0.1) 0%, rgba(198, 148, 56, 0.1) 100%)',
                                border: '1px solid rgba(95, 161, 69, 0.2)'
                            }}
                        >
                            <i className="bi bi-grid-3x3-gap-fill me-2" style={{ color: '#5FA145' }}></i>
                            <span style={{ color: '#334E15', fontSize: '0.95rem', fontWeight: '600' }}>
                                Modules de la Plateforme
                            </span>
                        </div>
                        
                        <h2 
                            className="display-4 fw-bold mb-4"
                            style={{ color: '#334E15' }}
                        >
                            Un Écosystème Complet d'Impact
                        </h2>
                        
                        <p 
                            className="lead"
                            style={{ 
                                color: '#6B7280', 
                                maxWidth: '700px', 
                                margin: '0 auto',
                                fontSize: '1.2rem'
                            }}
                        >
                            Découvrez tous les modules intégrés qui font de notre plateforme 
                            l'outil de référence pour l'engagement citoyen et l'impact social.
                        </p>
                    </Col>
                </Row>

                {/* Module Navigation */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-center flex-wrap gap-2">
                            {modules.map(module => (
                                <Button
                                    key={module.id}
                                    variant={activeModule === module.id ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                    style={{
                                        background: activeModule === module.id 
                                            ? module.gradient
                                            : 'transparent',
                                        borderColor: activeModule === module.id ? 'transparent' : '#D1D5DB',
                                        color: activeModule === module.id ? '#FFF' : '#6B7280',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500'
                                    }}
                                    onClick={() => setActiveModule(module.id)}
                                >
                                    <i className={module.icon}></i>
                                    <span className="d-none d-md-inline">{module.title.split(' ')[0]}</span>
                                    {getStatusBadge(module.status)}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Active Module Display */}
                <Row className="justify-content-center">
                    <Col lg={10}>
                        {modules.filter(module => module.id === activeModule).map(module => (
                            <Card 
                                key={module.id}
                                className="border-0 shadow-lg"
                                style={{
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                                }}
                            >
                                <Row className="g-0">
                                    {/* Module Info */}
                                    <Col lg={7}>
                                        <div className="p-5">
                                            <div className="d-flex align-items-center mb-4">
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-4"
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        background: module.gradient
                                                    }}
                                                >
                                                    <i 
                                                        className={`${module.icon} text-white`}
                                                        style={{ fontSize: '1.5rem' }}
                                                    ></i>
                                                </div>
                                                <div>
                                                    <h3 className="fw-bold mb-2" style={{ color: '#334E15' }}>
                                                        {module.title}
                                                    </h3>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {getStatusBadge(module.status)}
                                                        {module.stats && (
                                                            <Badge 
                                                                style={{ 
                                                                    background: 'rgba(95, 161, 69, 0.1)',
                                                                    color: '#5FA145',
                                                                    fontSize: '0.7rem'
                                                                }}
                                                            >
                                                                {module.stats.value} {module.stats.label}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <p 
                                                className="mb-4"
                                                style={{ 
                                                    color: '#6B7280', 
                                                    fontSize: '1.1rem', 
                                                    lineHeight: '1.6' 
                                                }}
                                            >
                                                {module.description}
                                            </p>

                                            <div className="mb-4">
                                                <h5 className="fw-semibold mb-3" style={{ color: '#334E15' }}>
                                                    Fonctionnalités clés :
                                                </h5>
                                                <Row>
                                                    {module.features.map((feature, index) => (
                                                        <Col md={6} key={index} className="mb-2">
                                                            <div className="d-flex align-items-center">
                                                                <div 
                                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                                    style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        background: `${module.color}15`,
                                                                        minWidth: '20px'
                                                                    }}
                                                                >
                                                                    <i 
                                                                        className="bi bi-check"
                                                                        style={{ 
                                                                            color: module.color,
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    ></i>
                                                                </div>
                                                                <span 
                                                                    style={{ 
                                                                        color: '#4B5563',
                                                                        fontSize: '0.95rem'
                                                                    }}
                                                                >
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>

                                            <div className="d-flex gap-3">
                                                <Button
                                                    href={module.ctaHref}
                                                    size="lg"
                                                    className="px-4 py-3"
                                                    style={{
                                                        background: module.gradient,
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: '600',
                                                        boxShadow: `0 4px 15px ${module.color}30`
                                                    }}
                                                    disabled={module.status === 'coming-soon'}
                                                >
                                                    {module.status === 'coming-soon' ? (
                                                        <>
                                                            <i className="bi bi-clock me-2"></i>
                                                            Bientôt disponible
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-arrow-right-circle me-2"></i>
                                                            {module.ctaText}
                                                        </>
                                                    )}
                                                </Button>

                                                {module.status !== 'coming-soon' && (
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="lg"
                                                        className="px-4 py-3"
                                                        style={{
                                                            borderColor: '#D1D5DB',
                                                            color: '#6B7280',
                                                            borderRadius: '12px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        <i className="bi bi-info-circle me-2"></i>
                                                        En savoir plus
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Visual Preview */}
                                    <Col lg={5}>
                                        <div 
                                            className="h-100 d-flex align-items-center justify-content-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${module.color}10 0%, ${module.color}05 100%)`,
                                                minHeight: '400px'
                                            }}
                                        >
                                            <div className="text-center p-4">
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        background: module.gradient,
                                                        animation: 'pulse 3s ease-in-out infinite'
                                                    }}
                                                >
                                                    <i 
                                                        className={`${module.icon} text-white`}
                                                        style={{ fontSize: '3rem' }}
                                                    ></i>
                                                </div>
                                                <h4 className="fw-bold mb-2" style={{ color: module.color }}>
                                                    Interface {module.title}
                                                </h4>
                                                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                    Aperçu disponible après développement
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Col>
                </Row>

                {/* Bottom CTA */}
                <Row className="mt-5">
                    <Col className="text-center">
                        <div 
                            className="p-5 rounded-4"
                            style={{
                                background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 100%)',
                                color: '#E8F5E8'
                            }}
                        >
                            <h3 className="fw-bold mb-3">
                                Prêt à explorer notre plateforme complète ?
                            </h3>
                            <p className="mb-4" style={{ opacity: 0.9 }}>
                                Rejoignez notre communauté et accédez à tous les modules dès maintenant.
                            </p>
                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                <Button
                                    href="/simple-register"
                                    size="lg"
                                    className="px-5 py-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        color: '#334E15'
                                    }}
                                >
                                    <i className="bi bi-person-plus me-2"></i>
                                    Créer mon compte
                                </Button>
                                <Button
                                    href="/login"
                                    variant="outline-light"
                                    size="lg"
                                    className="px-5 py-3"
                                    style={{
                                        borderRadius: '50px',
                                        fontWeight: '500',
                                        borderWidth: '2px'
                                    }}
                                >
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Se connecter
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}