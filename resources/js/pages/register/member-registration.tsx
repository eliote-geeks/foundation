import { Row, Col, Card, Button, Form, Container, Alert } from 'react-bootstrap';
import { FoundationLayout } from '@/layouts/foundation-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface MemberRegistrationProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
}

interface MemberFormData {
    profile_type: 'adherent' | 'ambassador' | 'alumni' | 'volunteer';
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    country: string;
    profession: string;
    company: string;
    education_level: string;
    motivation: string;
    previous_experience: string;
    skills: string[];
    availability: string[];
    interests: string[];
    communication_preferences: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
        newsletter: boolean;
    };
    terms_accepted: boolean;
    privacy_accepted: boolean;
}

const profileTypes = {
    adherent: {
        name: 'Adhérent Fondation',
        description: 'Rejoignez notre communauté et participez à nos actions',
        price: '25 000 FCFA/an',
        color: 'primary',
        icon: 'bi-person-check',
        benefits: [
            'Accès aux événements membres',
            'Newsletter mensuelle exclusive',
            'Vote aux assemblées générales',
            'Tarifs préférentiels sur les événements',
            'Accès à la plateforme communautaire'
        ]
    },
    ambassador: {
        name: 'Ambassadeur',
        description: 'Devenez porte-parole de nos valeurs et missions',
        price: '75 000 FCFA/an',
        color: 'success',
        icon: 'bi-megaphone',
        benefits: [
            'Tous les avantages adhérent',
            'Formation leadership social',
            'Participation aux décisions stratégiques',
            'Kit communication personnalisé',
            'Invitations événements VIP',
            'Mentorat de nouveaux membres'
        ]
    },
    alumni: {
        name: 'Alumni Challenger',
        description: 'Réseau exclusif des anciens participants aux programmes',
        price: 'Gratuit',
        color: 'warning',
        icon: 'bi-trophy',
        benefits: [
            'Accès réseau alumni exclusif',
            'Mentorat nouvelles générations',
            'Opportunités professionnelles',
            'Événements networking premium',
            'Plateforme d\'entraide',
            'Certification alumni'
        ]
    },
    volunteer: {
        name: 'Bénévole Actif',
        description: 'Contribuez activement à nos missions sur le terrain',
        price: 'Gratuit',
        color: 'info',
        icon: 'bi-hand-thumbs-up',
        benefits: [
            'Formations spécialisées gratuites',
            'Certificats de bénévolat',
            'Remboursement frais mission',
            'Assurance activités',
            'Reconnaissance annuelle',
            'Accès prioritaire aux missions'
        ]
    }
};

const skillsOptions = [
    'Communication', 'Marketing digital', 'Gestion de projet', 'Formation/Éducation',
    'Comptabilité/Finance', 'Développement web', 'Design graphique', 'Photographie',
    'Vidéo/Montage', 'Rédaction', 'Traduction', 'Animation communautaire',
    'Collecte de fonds', 'Événementiel', 'Relations publiques', 'Juridique'
];

const availabilityOptions = [
    'Weekends seulement', 'Soirées en semaine', 'Temps plein disponible',
    'Missions ponctuelles', 'Télétravail possible', 'Déplacements régionaux',
    'Missions internationales', 'Urgences/Crises'
];

const interestOptions = [
    'Éducation et formation', 'Environnement et développement durable',
    'Santé et bien-être', 'Inclusion sociale', 'Entrepreneuriat social',
    'Technologies pour le développement', 'Droits humains', 'Genre et égalité',
    'Jeunesse et leadership', 'Arts et culture', 'Sport et loisirs'
];

export default function MemberRegistration({ auth }: MemberRegistrationProps) {
    const [selectedProfileType, setSelectedProfileType] = useState<keyof typeof profileTypes>('adherent');
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm<MemberFormData>({
        profile_type: 'adherent',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        city: '',
        country: 'Côte d\'Ivoire',
        profession: '',
        company: '',
        education_level: '',
        motivation: '',
        previous_experience: '',
        skills: [],
        availability: [],
        interests: [],
        communication_preferences: {
            email: true,
            sms: false,
            whatsapp: false,
            newsletter: true
        },
        terms_accepted: false,
        privacy_accepted: false
    });

    const handleProfileTypeChange = (type: keyof typeof profileTypes) => {
        setSelectedProfileType(type);
        setData('profile_type', type);
    };

    const handleSkillToggle = (skill: string) => {
        const currentSkills = data.skills;
        const updatedSkills = currentSkills.includes(skill)
            ? currentSkills.filter(s => s !== skill)
            : [...currentSkills, skill];
        setData('skills', updatedSkills);
    };

    const handleAvailabilityToggle = (availability: string) => {
        const current = data.availability;
        const updated = current.includes(availability)
            ? current.filter(a => a !== availability)
            : [...current, availability];
        setData('availability', updated);
    };

    const handleInterestToggle = (interest: string) => {
        const current = data.interests;
        const updated = current.includes(interest)
            ? current.filter(i => i !== interest)
            : [...current, interest];
        setData('interests', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/register/member', {
            onSuccess: () => {
                setShowSuccess(true);
                setStep(1);
            }
        });
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const currentProfile = profileTypes[selectedProfileType];

    return (
        <FoundationLayout user={auth?.user}>
            <Head title="Inscription Membre - Fondation Titi" />
            
            {/* Hero Section */}
            <div className="position-relative mb-5 overflow-hidden" style={{ borderRadius: '24px' }}>
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.9) 100%)',
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
                                            <i className="bi bi-person-plus text-white" style={{ fontSize: '1.5rem' }}></i>
                                        </div>
                                        <div>
                                            <h1 className="text-white mb-0 fw-bold h2">Rejoignez Fondation Titi</h1>
                                            <small className="text-white opacity-75">Créez votre profil membre personnalisé</small>
                                        </div>
                                    </div>
                                    
                                    <p className="lead text-white opacity-90 mb-4" style={{ fontSize: '18px' }}>
                                        Choisissez le type d'engagement qui vous correspond et rejoignez une communauté 
                                        passionnée d'acteurs du changement social en Côte d'Ivoire et en Afrique.
                                    </p>
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
                                        <h6 className="text-white mb-2">Étape {step}/4</h6>
                                        <div className="text-white opacity-75 small">Inscription en cours</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            {showSuccess && (
                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                    <Alert.Heading>
                        <i className="bi bi-check-circle me-2"></i>
                        Inscription réussie !
                    </Alert.Heading>
                    <p>
                        Bienvenue dans la communauté Fondation Titi ! Vous recevrez prochainement un email 
                        de confirmation avec les détails de votre adhésion.
                    </p>
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* Step 1: Type de profil */}
                {step === 1 && (
                    <div>
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Choisissez votre type d'engagement</h3>
                            <p className="text-muted">Sélectionnez le profil qui correspond le mieux à vos objectifs</p>
                        </div>

                        <Row className="g-4 mb-4">
                            {Object.entries(profileTypes).map(([key, profile]) => (
                                <Col key={key} lg={6}>
                                    <Card 
                                        className={`h-100 border-0 shadow-sm cursor-pointer ${selectedProfileType === key ? 'border-primary border-2' : ''}`}
                                        onClick={() => handleProfileTypeChange(key as keyof typeof profileTypes)}
                                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    >
                                        <Card.Body className="d-flex flex-column">
                                            <div className="text-center mb-4">
                                                <div className={`bg-${profile.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                                                     style={{ width: '80px', height: '80px' }}>
                                                    <i className={`${profile.icon} text-${profile.color} fs-1`}></i>
                                                </div>
                                                <h5 className="mb-2">{profile.name}</h5>
                                                <p className="text-muted small">{profile.description}</p>
                                                <div className={`h5 text-${profile.color} mb-3`}>{profile.price}</div>
                                            </div>
                                            
                                            <div className="mb-4 flex-grow-1">
                                                <h6 className="mb-3">Avantages inclus :</h6>
                                                <ul className="list-unstyled">
                                                    {profile.benefits.map((benefit, index) => (
                                                        <li key={index} className="mb-2">
                                                            <i className={`bi bi-check-circle text-${profile.color} me-2`}></i>
                                                            <small>{benefit}</small>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            {selectedProfileType === key && (
                                                <div className="text-center">
                                                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                                                    <div className="text-success small mt-1">Sélectionné</div>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div className="text-center">
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={nextStep}
                                disabled={!selectedProfileType}
                            >
                                Continuer avec {currentProfile.name}
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Informations personnelles */}
                {step === 2 && (
                    <div>
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Informations personnelles</h3>
                            <p className="text-muted">Renseignez vos informations de base</p>
                        </div>

                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Prénom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        isInvalid={!!errors.first_name}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.first_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nom de famille *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        isInvalid={!!errors.last_name}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.last_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        isInvalid={!!errors.email}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Téléphone *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+225 XX XX XX XX XX"
                                        isInvalid={!!errors.phone}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Date de naissance *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        isInvalid={!!errors.date_of_birth}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.date_of_birth}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Genre</Form.Label>
                                    <Form.Select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value as any)}
                                    >
                                        <option value="male">Masculin</option>
                                        <option value="female">Féminin</option>
                                        <option value="other">Autre</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Adresse complète</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Rue, quartier, commune..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ville *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder="Abidjan, Bouaké, Yamoussoukro..."
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Pays</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between mt-5">
                            <Button variant="outline-secondary" onClick={prevStep}>
                                <i className="bi bi-arrow-left me-2"></i>
                                Retour
                            </Button>
                            <Button variant="primary" onClick={nextStep}>
                                Continuer
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Profil professionnel et compétences */}
                {step === 3 && (
                    <div>
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Profil professionnel</h3>
                            <p className="text-muted">Aidez-nous à mieux vous connaître pour personnaliser votre expérience</p>
                        </div>

                        <Row className="g-4 mb-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Profession actuelle</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.profession}
                                        onChange={(e) => setData('profession', e.target.value)}
                                        placeholder="Développeur, Enseignant, Entrepreneur..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Entreprise/Organisation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.company}
                                        onChange={(e) => setData('company', e.target.value)}
                                        placeholder="Nom de votre employeur actuel"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Niveau d'éducation</Form.Label>
                                    <Form.Select
                                        value={data.education_level}
                                        onChange={(e) => setData('education_level', e.target.value)}
                                    >
                                        <option value="">Sélectionnez votre niveau</option>
                                        <option value="bac">Baccalauréat</option>
                                        <option value="bts_dut">BTS/DUT</option>
                                        <option value="licence">Licence/Bachelor</option>
                                        <option value="master">Master</option>
                                        <option value="doctorat">Doctorat/PhD</option>
                                        <option value="autre">Autre/Formation professionnelle</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <Form.Group>
                                <Form.Label>Compétences et expertises</Form.Label>
                                <Form.Text className="text-muted d-block mb-3">
                                    Sélectionnez vos domaines de compétence (plusieurs choix possibles)
                                </Form.Text>
                                <div className="d-flex flex-wrap gap-2">
                                    {skillsOptions.map((skill) => (
                                        <Button
                                            key={skill}
                                            variant={data.skills.includes(skill) ? 'primary' : 'outline-secondary'}
                                            size="sm"
                                            type="button"
                                            onClick={() => handleSkillToggle(skill)}
                                        >
                                            {skill}
                                            {data.skills.includes(skill) && (
                                                <i className="bi bi-check-circle ms-1"></i>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </div>

                        <div className="mb-4">
                            <Form.Group>
                                <Form.Label>Disponibilité pour les activités</Form.Label>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {availabilityOptions.map((availability) => (
                                        <Button
                                            key={availability}
                                            variant={data.availability.includes(availability) ? 'success' : 'outline-secondary'}
                                            size="sm"
                                            type="button"
                                            onClick={() => handleAvailabilityToggle(availability)}
                                        >
                                            {availability}
                                            {data.availability.includes(availability) && (
                                                <i className="bi bi-check-circle ms-1"></i>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </div>

                        <div className="mb-4">
                            <Form.Group>
                                <Form.Label>Centres d'intérêt</Form.Label>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {interestOptions.map((interest) => (
                                        <Button
                                            key={interest}
                                            variant={data.interests.includes(interest) ? 'warning' : 'outline-secondary'}
                                            size="sm"
                                            type="button"
                                            onClick={() => handleInterestToggle(interest)}
                                        >
                                            {interest}
                                            {data.interests.includes(interest) && (
                                                <i className="bi bi-check-circle ms-1"></i>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </div>

                        <Row className="g-4">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Motivation pour rejoindre Fondation Titi *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={data.motivation}
                                        onChange={(e) => setData('motivation', e.target.value)}
                                        placeholder="Expliquez pourquoi vous souhaitez nous rejoindre et comment vous comptez contribuer à nos missions..."
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Expérience associative ou bénévole précédente</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={data.previous_experience}
                                        onChange={(e) => setData('previous_experience', e.target.value)}
                                        placeholder="Décrivez brièvement vos expériences passées dans le associatif ou bénévolat..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between mt-5">
                            <Button variant="outline-secondary" onClick={prevStep}>
                                <i className="bi bi-arrow-left me-2"></i>
                                Retour
                            </Button>
                            <Button variant="primary" onClick={nextStep}>
                                Continuer
                                <i className="bi bi-arrow-right ms-2"></i>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Préférences et confirmation */}
                {step === 4 && (
                    <div>
                        <div className="text-center mb-5">
                            <h3 className="mb-3">Finalisation de l'inscription</h3>
                            <p className="text-muted">Dernières préférences et validation de votre adhésion</p>
                        </div>

                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">
                                    <i className="bi bi-bell me-2"></i>
                                    Préférences de communication
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Form.Text className="text-muted d-block mb-3">
                                    Choisissez comment vous souhaitez recevoir nos communications
                                </Form.Text>
                                <Row>
                                    <Col md={6}>
                                        <Form.Check
                                            type="checkbox"
                                            id="pref-email"
                                            label="Notifications par email"
                                            checked={data.communication_preferences.email}
                                            onChange={(e) => setData('communication_preferences', {
                                                ...data.communication_preferences,
                                                email: e.target.checked
                                            })}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="pref-newsletter"
                                            label="Newsletter mensuelle"
                                            checked={data.communication_preferences.newsletter}
                                            onChange={(e) => setData('communication_preferences', {
                                                ...data.communication_preferences,
                                                newsletter: e.target.checked
                                            })}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Check
                                            type="checkbox"
                                            id="pref-sms"
                                            label="SMS pour urgences"
                                            checked={data.communication_preferences.sms}
                                            onChange={(e) => setData('communication_preferences', {
                                                ...data.communication_preferences,
                                                sms: e.target.checked
                                            })}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="pref-whatsapp"
                                            label="WhatsApp (événements)"
                                            checked={data.communication_preferences.whatsapp}
                                            onChange={(e) => setData('communication_preferences', {
                                                ...data.communication_preferences,
                                                whatsapp: e.target.checked
                                            })}
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">
                                    <i className="bi bi-card-checklist me-2"></i>
                                    Résumé de votre inscription
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <strong>Type de profil :</strong>
                                            <div className={`badge bg-${currentProfile.color} ms-2`}>
                                                {currentProfile.name}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <strong>Nom complet :</strong> {data.first_name} {data.last_name}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Email :</strong> {data.email}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <strong>Cotisation annuelle :</strong> {currentProfile.price}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Compétences sélectionnées :</strong> {data.skills.length} domaines
                                        </div>
                                        <div className="mb-3">
                                            <strong>Centres d'intérêt :</strong> {data.interests.length} sélectionnés
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <div className="mb-4">
                            <Form.Check
                                type="checkbox"
                                id="terms"
                                label={
                                    <>
                                        J'accepte les <a href="/terms" target="_blank">conditions d'utilisation</a> et 
                                        la <a href="/charter" target="_blank">charte des valeurs</a> de Fondation Titi *
                                    </>
                                }
                                checked={data.terms_accepted}
                                onChange={(e) => setData('terms_accepted', e.target.checked)}
                                required
                                isInvalid={!!errors.terms_accepted}
                            />
                            <Form.Check
                                type="checkbox"
                                id="privacy"
                                label={
                                    <>
                                        J'accepte la <a href="/privacy" target="_blank">politique de confidentialité</a> et 
                                        le traitement de mes données personnelles *
                                    </>
                                }
                                checked={data.privacy_accepted}
                                onChange={(e) => setData('privacy_accepted', e.target.checked)}
                                required
                                isInvalid={!!errors.privacy_accepted}
                            />
                        </div>

                        <div className="d-flex justify-content-between">
                            <Button variant="outline-secondary" onClick={prevStep}>
                                <i className="bi bi-arrow-left me-2"></i>
                                Retour
                            </Button>
                            <Button 
                                variant="success" 
                                size="lg" 
                                type="submit"
                                disabled={processing || !data.terms_accepted || !data.privacy_accepted}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Inscription en cours...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        Finaliser mon inscription
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>

            {/* Info complémentaire */}
            <Card className="mt-5 border-0 bg-light">
                <Card.Body className="text-center py-4">
                    <h6 className="mb-3">
                        <i className="bi bi-info-circle text-info me-2"></i>
                        Informations importantes
                    </h6>
                    <Row>
                        <Col md={4}>
                            <i className="bi bi-shield-check text-success mb-2 fs-4"></i>
                            <div className="small">
                                <strong>Données sécurisées</strong>
                                <div className="text-muted">Vos informations sont protégées</div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <i className="bi bi-clock-history text-warning mb-2 fs-4"></i>
                            <div className="small">
                                <strong>Validation sous 48h</strong>
                                <div className="text-muted">Confirmation rapide de votre adhésion</div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <i className="bi bi-telephone text-primary mb-2 fs-4"></i>
                            <div className="small">
                                <strong>Support disponible</strong>
                                <div className="text-muted">+225 XX XX XX XX XX</div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </FoundationLayout>
    );
}