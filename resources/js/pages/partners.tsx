import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface Partner {
    id: number;
    name: string;
    logo: string;
    description: string;
    website: string;
    category: string;
    partnership: string;
    since: number;
}

interface PartnersProps {
    user?: {
        name: string;
        email: string;
    };
}

export default function Partners({ user }: PartnersProps) {
    const [visiblePartners, setVisiblePartners] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        category: '',
        partnershipType: '',
        description: '',
        budget: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const partnersRef = useRef<HTMLDivElement>(null);

    // Données des partenaires
    const partners: Partner[] = [
        {
            id: 1,
            name: "Orange Sénégal",
            logo: "📱",
            description: "Leader des télécommunications au Sénégal, Orange soutient nos initiatives de transformation digitale et d'inclusion numérique.",
            website: "orange.sn",
            category: "Technologie",
            partnership: "Partenaire Principal",
            since: 2019
        },
        {
            id: 2,
            name: "Banque Atlantique",
            logo: "🏦",
            description: "Institution financière de référence qui accompagne nos projets d'entrepreneuriat et de microfinance communautaire.",
            website: "banqueatlantique.net",
            category: "Finance",
            partnership: "Partenaire Financier",
            since: 2020
        },
        {
            id: 3,
            name: "Université Cheikh Anta Diop",
            logo: "🎓",
            description: "Partenariat académique pour la recherche, l'innovation et la formation des jeunes talents sénégalais.",
            website: "ucad.edu.sn",
            category: "Éducation",
            partnership: "Partenaire Académique",
            since: 2018
        },
        {
            id: 4,
            name: "Sonatel",
            logo: "📡",
            description: "Opérateur télécom national qui facilite la connectivité de nos programmes dans les zones rurales.",
            website: "sonatel.sn",
            category: "Télécommunications",
            partnership: "Partenaire Technique",
            since: 2021
        },
        {
            id: 5,
            name: "CBAO Groupe Attijariwafa Bank",
            logo: "💳",
            description: "Partenaire bancaire stratégique pour le financement de nos projets d'impact social et environnemental.",
            website: "cbao.sn",
            category: "Finance",
            partnership: "Partenaire Financier",
            since: 2020
        },
        {
            id: 6,
            name: "Ecobank Sénégal",
            logo: "🌍",
            description: "Banque panafricaine qui soutient notre expansion régionale et nos initiatives entrepreneuriales.",
            website: "ecobank.com",
            category: "Finance",
            partnership: "Partenaire Régional",
            since: 2019
        },
        {
            id: 7,
            name: "Total Énergies Sénégal",
            logo: "⚡",
            description: "Partenaire énergétique pour nos projets d'électrification rurale et d'énergies renouvelables.",
            website: "totalenergies.sn",
            category: "Énergie",
            partnership: "Partenaire Environnemental",
            since: 2022
        },
        {
            id: 8,
            name: "Nestlé Sénégal",
            logo: "🥛",
            description: "Collaboration sur les programmes de nutrition communautaire et de sécurité alimentaire.",
            website: "nestle.sn",
            category: "Agroalimentaire",
            partnership: "Partenaire Social",
            since: 2021
        },
        {
            id: 9,
            name: "Microsoft Afrique de l'Ouest",
            logo: "💻",
            description: "Partenaire technologique pour la digitalisation de nos processus et la formation numérique.",
            website: "microsoft.com",
            category: "Technologie",
            partnership: "Partenaire Innovation",
            since: 2023
        },
        {
            id: 10,
            name: "Senelec",
            logo: "💡",
            description: "Compagnie nationale d'électricité partenaire de nos projets d'accès à l'énergie pour tous.",
            website: "senelec.sn",
            category: "Énergie",
            partnership: "Partenaire Public",
            since: 2020
        },
        {
            id: 11,
            name: "Air Sénégal",
            logo: "✈️",
            description: "Compagnie aérienne nationale qui facilite la mobilité de nos équipes et partenaires internationaux.",
            website: "airsenegal.sl",
            category: "Transport",
            partnership: "Partenaire Logistique",
            since: 2022
        },
        {
            id: 12,
            name: "Groupe Kirène",
            logo: "💧",
            description: "Leader de l'eau minérale au Sénégal, partenaire de nos initiatives d'accès à l'eau potable.",
            website: "kirene.sn",
            category: "Agroalimentaire",
            partnership: "Partenaire Santé",
            since: 2019
        }
    ];

    const categories = ['Technologie', 'Finance', 'Éducation', 'Télécommunications', 'Énergie', 'Agroalimentaire', 'Transport'];
    const partnershipTypes = ['Financier', 'Technique', 'Académique', 'Environnemental', 'Social', 'Innovation'];

    // Animation fade-in au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const partnerId = parseInt(entry.target.getAttribute('data-partner-id') || '0');
                        if (!visiblePartners.includes(partnerId)) {
                            setVisiblePartners(prev => [...prev, partnerId]);
                        }
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const partnerCards = document.querySelectorAll('[data-partner-id]');
        partnerCards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [visiblePartners]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ici vous ajouteriez l'appel API pour envoyer le formulaire
        setShowAlert(true);
        setFormData({
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            website: '',
            category: '',
            partnershipType: '',
            description: '',
            budget: ''
        });
        
        // Masquer l'alert après 5 secondes
        setTimeout(() => setShowAlert(false), 5000);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Technologie': '#5FA145',
            'Finance': '#C69438',
            'Éducation': '#E4518C',
            'Télécommunications': '#4D8A3C',
            'Énergie': '#F5B4C6',
            'Agroalimentaire': '#334E15',
            'Transport': '#6B7280'
        };
        return colors[category] || '#6B7280';
    };

    return (
        <>
            <Head>
                <title>Partenaires - Fondation TITI</title>
                <meta name="description" content="Découvrez nos partenaires qui nous accompagnent dans notre mission d'impact social et rejoignez notre écosystème." />
            </Head>

            <div className="partners-page">
                <ModernHeader user={user} />
                
                {/* Section Hero */}
                <section 
                    className="hero-section py-5"
                    style={{
                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                        marginTop: '70px',
                        minHeight: '400px'
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
                                        🤝 Nos Partenaires
                                    </h1>
                                    <p 
                                        className="lead mb-4"
                                        style={{ color: '#FFFFFF', opacity: 0.9, fontSize: '1.2rem' }}
                                    >
                                        Ensemble, nous construisons un écosystème d'innovation et d'impact social. 
                                        Découvrez les organisations qui nous accompagnent dans notre mission de transformation positive.
                                    </p>
                                    
                                    {/* Statistiques partenaires */}
                                    <div className="d-flex justify-content-center gap-5 flex-wrap mt-5">
                                        <div className="text-center">
                                            <div className="h2 fw-bold mb-2" style={{ color: '#C69438' }}>
                                                {partners.length}
                                            </div>
                                            <div style={{ color: '#FFFFFF', fontSize: '1rem' }}>
                                                Partenaires actifs
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h2 fw-bold mb-2" style={{ color: '#E4518C' }}>
                                                {categories.length}
                                            </div>
                                            <div style={{ color: '#FFFFFF', fontSize: '1rem' }}>
                                                Secteurs d'activité
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h2 fw-bold mb-2" style={{ color: '#F5B4C6' }}>
                                                5
                                            </div>
                                            <div style={{ color: '#FFFFFF', fontSize: '1rem' }}>
                                                Années d'expérience
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Grille des partenaires */}
                <section className="py-5" ref={partnersRef}>
                    <Container>
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-4" style={{ color: '#1F2937' }}>
                                Ils nous font confiance
                            </h2>
                            <p className="lead mx-auto" style={{ color: '#6B7280', maxWidth: '600px' }}>
                                Des partenaires de renommée qui partagent notre vision d'un avenir plus équitable et durable.
                            </p>
                        </div>

                        <Row className="g-4">
                            {partners.map((partner, index) => (
                                <Col lg={4} md={6} key={partner.id}>
                                    <Card 
                                        className="partner-card h-100 border-0 shadow-sm"
                                        data-partner-id={partner.id}
                                        style={{
                                            borderRadius: '20px',
                                            opacity: visiblePartners.includes(partner.id) ? 1 : 0,
                                            transform: visiblePartners.includes(partner.id) ? 'translateY(0)' : 'translateY(30px)',
                                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transitionDelay: `${index * 0.1}s`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        <div 
                                            className="card-header-section text-center py-4"
                                            style={{
                                                background: `linear-gradient(135deg, ${getCategoryColor(partner.category)} 0%, rgba(255,255,255,0.1) 100%)`,
                                                borderRadius: '20px 20px 0 0'
                                            }}
                                        >
                                            {/* Logo */}
                                            <div 
                                                className="partner-logo-container mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                                    fontSize: '2.5rem'
                                                }}
                                            >
                                                {partner.logo}
                                            </div>
                                            
                                            {/* Nom du partenaire */}
                                            <h5 className="fw-bold text-white mb-2">
                                                {partner.name}
                                            </h5>
                                            
                                            {/* Type de partenariat */}
                                            <span 
                                                className="badge px-3 py-2 fw-medium"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    color: '#FFFFFF',
                                                    borderRadius: '50px',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {partner.partnership}
                                            </span>
                                        </div>

                                        <Card.Body className="p-4">
                                            {/* Description */}
                                            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                                {partner.description}
                                            </p>

                                            {/* Informations détaillées */}
                                            <div className="partner-details">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <small className="text-muted">
                                                        <i className="bi bi-tag me-1"></i>
                                                        {partner.category}
                                                    </small>
                                                    <small className="text-muted">
                                                        <i className="bi bi-calendar me-1"></i>
                                                        Depuis {partner.since}
                                                    </small>
                                                </div>
                                                
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <small className="text-muted">
                                                        <i className="bi bi-globe me-1"></i>
                                                        {partner.website}
                                                    </small>
                                                </div>
                                            </div>

                                            {/* Bouton d'action */}
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="w-100 mt-3"
                                                style={{
                                                    borderColor: getCategoryColor(partner.category),
                                                    color: getCategoryColor(partner.category),
                                                    borderRadius: '25px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = getCategoryColor(partner.category);
                                                    e.currentTarget.style.color = '#FFFFFF';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = getCategoryColor(partner.category);
                                                }}
                                            >
                                                <i className="bi bi-arrow-right me-2"></i>
                                                En savoir plus
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Section avantages partenariat */}
                <section 
                    className="py-5"
                    style={{ backgroundColor: '#F8F9FA' }}
                >
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} className="mb-4">
                                <h3 className="fw-bold mb-4" style={{ color: '#1F2937' }}>
                                    Pourquoi devenir partenaire ?
                                </h3>
                                
                                <div className="advantages-list">
                                    {[
                                        {
                                            icon: '🎯',
                                            title: 'Impact Social Mesurable',
                                            description: 'Contribuez concrètement à des projets qui transforment des vies et des communautés.'
                                        },
                                        {
                                            icon: '🌍',
                                            title: 'Visibilité Régionale',
                                            description: 'Bénéficiez d\'une exposition dans tout l\'écosystème sénégalais et ouest-africain.'
                                        },
                                        {
                                            icon: '🤝',
                                            title: 'Réseau Étendu',
                                            description: 'Accédez à notre réseau de partenaires, experts et leaders communautaires.'
                                        },
                                        {
                                            icon: '📊',
                                            title: 'Reporting Transparent',
                                            description: 'Recevez des rapports détaillés sur l\'impact de votre partenariat.'
                                        }
                                    ].map((advantage, index) => (
                                        <div key={index} className="d-flex align-items-start mb-4">
                                            <div 
                                                className="advantage-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: '#5FA145',
                                                    color: '#FFFFFF',
                                                    fontSize: '1.5rem',
                                                    minWidth: '50px'
                                                }}
                                            >
                                                {advantage.icon}
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-2" style={{ color: '#1F2937' }}>
                                                    {advantage.title}
                                                </h6>
                                                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                                    {advantage.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div 
                                    className="stats-visualization p-4 rounded-4 text-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <h4 className="fw-bold mb-4">Notre Impact Collectif</h4>
                                    
                                    <Row className="g-3">
                                        <Col xs={6}>
                                            <div className="stat-item">
                                                <div className="h3 fw-bold mb-1" style={{ color: '#C69438' }}>
                                                    150K+
                                                </div>
                                                <small>Bénéficiaires touchés</small>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="stat-item">
                                                <div className="h3 fw-bold mb-1" style={{ color: '#E4518C' }}>
                                                    2.5B
                                                </div>
                                                <small>FCFA mobilisés</small>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="stat-item">
                                                <div className="h3 fw-bold mb-1" style={{ color: '#F5B4C6' }}>
                                                    85
                                                </div>
                                                <small>Projets financés</small>
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="stat-item">
                                                <div className="h3 fw-bold mb-1" style={{ color: '#5FA145' }}>
                                                    12
                                                </div>
                                                <small>Régions couvertes</small>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Formulaire devenir partenaire */}
                <section className="py-5" id="become-partner">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={8}>
                                <div className="text-center mb-5">
                                    <h2 className="display-5 fw-bold mb-4" style={{ color: '#1F2937' }}>
                                        Rejoignez-nous !
                                    </h2>
                                    <p className="lead" style={{ color: '#6B7280' }}>
                                        Vous partagez notre vision ? Devenons partenaires pour créer un impact durable ensemble.
                                    </p>
                                </div>

                                {showAlert && (
                                    <Alert variant="success" className="mb-4">
                                        <i className="bi bi-check-circle me-2"></i>
                                        Votre demande de partenariat a été envoyée avec succès ! 
                                        Nous vous recontacterons dans les 48h.
                                    </Alert>
                                )}

                                <Card 
                                    className="border-0 shadow-lg"
                                    style={{ borderRadius: '20px' }}
                                >
                                    <Card.Body className="p-5">
                                        <Form onSubmit={handleSubmit}>
                                            <Row className="g-4">
                                                {/* Informations de l'entreprise */}
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Nom de l'entreprise *
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="companyName"
                                                            value={formData.companyName}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Nom du contact *
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="contactName"
                                                            value={formData.contactName}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Email *
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Téléphone
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Site web
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="url"
                                                            name="website"
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                            placeholder="https://"
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Secteur d'activité *
                                                        </Form.Label>
                                                        <Form.Select
                                                            name="category"
                                                            value={formData.category}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        >
                                                            <option value="">Sélectionnez...</option>
                                                            {categories.map(category => (
                                                                <option key={category} value={category}>
                                                                    {category}
                                                                </option>
                                                            ))}
                                                            <option value="Autre">Autre</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Type de partenariat souhaité *
                                                        </Form.Label>
                                                        <Form.Select
                                                            name="partnershipType"
                                                            value={formData.partnershipType}
                                                            onChange={handleInputChange}
                                                            required
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        >
                                                            <option value="">Sélectionnez...</option>
                                                            {partnershipTypes.map(type => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Budget approximatif
                                                        </Form.Label>
                                                        <Form.Select
                                                            name="budget"
                                                            value={formData.budget}
                                                            onChange={handleInputChange}
                                                            style={{ borderRadius: '12px', padding: '12px' }}
                                                        >
                                                            <option value="">Non spécifié</option>
                                                            <option value="< 1M FCFA">Moins de 1M FCFA</option>
                                                            <option value="1-5M FCFA">1 - 5M FCFA</option>
                                                            <option value="5-10M FCFA">5 - 10M FCFA</option>
                                                            <option value="10-50M FCFA">10 - 50M FCFA</option>
                                                            <option value="> 50M FCFA">Plus de 50M FCFA</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col xs={12}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold mb-2">
                                                            Description de votre projet de partenariat *
                                                        </Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={4}
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleInputChange}
                                                            placeholder="Décrivez vos objectifs, votre vision du partenariat et comment vous souhaitez contribuer à notre mission..."
                                                            required
                                                            style={{ borderRadius: '12px', padding: '15px' }}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col xs={12} className="text-center">
                                                    <Button
                                                        type="submit"
                                                        size="lg"
                                                        className="px-5 py-3 fw-bold"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                            border: 'none',
                                                            borderRadius: '50px',
                                                            fontSize: '1.1rem',
                                                            boxShadow: '0 8px 25px rgba(95, 161, 69, 0.3)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(95, 161, 69, 0.4)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.3)';
                                                        }}
                                                    >
                                                        <i className="bi bi-send me-2"></i>
                                                        Envoyer ma demande
                                                    </Button>
                                                    
                                                    <p className="text-muted mt-3 small">
                                                        Nous étudierons votre demande et vous recontacterons sous 48h.
                                                    </p>
                                                </Col>
                                            </Row>
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