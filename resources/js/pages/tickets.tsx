import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    time: string;
    location: string;
    city: string;
    price: number;
    originalPrice?: number;
    availableTickets: number;
    totalTickets: number;
    featured: boolean;
    tags: string[];
}

interface TicketsProps {
    user?: {
        name: string;
        email: string;
    };
}

export default function Tickets({ user }: TicketsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [purchasedTickets, setPurchasedTickets] = useState<number[]>([]);

    // Données d'événements
    const events: Event[] = useMemo(() => ([
        {
            id: 1,
            title: "Conférence Innovation Sociale",
            description: "Rencontrez les acteurs du changement social et découvrez les innovations qui transforment nos communautés.",
            image: "🎯",
            category: "conference",
            date: "2025-02-15",
            time: "09:00",
            location: "Centre de Conférences Yaoundé",
            city: "Yaoundé",
            price: 15000,
            originalPrice: 20000,
            availableTickets: 45,
            totalTickets: 150,
            featured: true,
            tags: ["innovation", "social", "networking"]
        },
        {
            id: 2,
            title: "Atelier Entrepreneuriat Vert",
            description: "Formation pratique sur la création d'entreprises durables avec des experts reconnus.",
            image: "🌱",
            category: "formation",
            date: "2025-02-20",
            time: "14:00",
            location: "Hub Innovation Douala",
            city: "Douala",
            price: 8000,
            availableTickets: 25,
            totalTickets: 30,
            featured: false,
            tags: ["formation", "entrepreneuriat", "environnement"]
        },
        {
            id: 3,
            title: "Gala de Charité 2025",
            description: "Soirée de gala pour collecter des fonds au profit de l'éducation des jeunes défavorisés.",
            image: "✨",
            category: "gala",
            date: "2025-03-10",
            time: "19:00",
            location: "Hôtel Hilton Yaoundé",
            city: "Yaoundé",
            price: 50000,
            availableTickets: 12,
            totalTickets: 100,
            featured: true,
            tags: ["gala", "charité", "éducation"]
        },
        {
            id: 4,
            title: "Festival Arts & Culture",
            description: "Célébration de la diversité culturelle sénégalaise avec expositions, concerts et spectacles.",
            image: "🎨",
            category: "festival",
            date: "2025-03-25",
            time: "10:00",
            location: "Parc de la Mvog-Beti",
            city: "Yaoundé",
            price: 5000,
            availableTickets: 200,
            totalTickets: 500,
            featured: false,
            tags: ["culture", "art", "festival"]
        },
        {
            id: 5,
            title: "Hackathon Tech4Good",
            description: "48h pour développer des solutions technologiques aux défis sociaux et environnementaux.",
            image: "💻",
            category: "hackathon",
            date: "2025-04-05",
            time: "09:00",
            location: "Technopole de Yaoundé",
            city: "Yaoundé",
            price: 12000,
            availableTickets: 35,
            totalTickets: 50,
            featured: true,
            tags: ["tech", "innovation", "hackathon"]
        },
        {
            id: 6,
            title: "Conférence Santé Communautaire",
            description: "Débats sur l'amélioration de l'accès aux soins de santé dans les zones rurales.",
            image: "⚕️",
            category: "conference",
            date: "2025-04-15",
            time: "08:30",
            location: "Université de Yaoundé I",
            city: "Yaoundé",
            price: 10000,
            availableTickets: 60,
            totalTickets: 120,
            featured: false,
            tags: ["santé", "communauté", "rural"]
        },
        {
            id: 7,
            title: "Séminaire Leadership Féminin",
            description: "Formation dédiée au leadership et à l'autonomisation des femmes entrepreneures.",
            image: "👑",
            category: "formation",
            date: "2025-05-20",
            time: "13:00",
            location: "Centre Culturel Camerounais",
            city: "Douala",
            price: 7500,
            availableTickets: 18,
            totalTickets: 25,
            featured: false,
            tags: ["leadership", "femmes", "formation"]
        },
        {
            id: 8,
            title: "Concert Solidaire",
            description: "Concert caritatif avec les plus grands artistes sénégalais pour soutenir l'éducation.",
            image: "🎵",
            category: "concert",
            date: "2025-06-01",
            time: "20:00",
            location: "Palais des Congrès de Yaoundé",
            city: "Yaoundé",
            price: 25000,
            originalPrice: 30000,
            availableTickets: 8,
            totalTickets: 300,
            featured: true,
            tags: ["concert", "musique", "solidaire"]
        }
    ]), []);

    const categories = [
        { value: 'all', label: 'Toutes catégories' },
        { value: 'conference', label: 'Conférences' },
        { value: 'formation', label: 'Formations' },
        { value: 'gala', label: 'Galas' },
        { value: 'festival', label: 'Festivals' },
        { value: 'hackathon', label: 'Hackathons' },
        { value: 'concert', label: 'Concerts' }
    ];

    const months = [
        { value: 'all', label: 'Tous les mois' },
        { value: '2025-02', label: 'Février 2025' },
        { value: '2025-03', label: 'Mars 2025' },
        { value: '2025-04', label: 'Avril 2025' },
        { value: '2025-05', label: 'Mai 2025' },
        { value: '2025-06', label: 'Juin 2025' }
    ];

    const priceRanges = [
        { value: 'all', label: 'Tous les prix' },
        { value: '0-10000', label: 'Moins de 10K FCFA' },
        { value: '10000-20000', label: '10K - 20K FCFA' },
        { value: '20000-50000', label: '20K - 50K FCFA' },
        { value: '50000+', label: 'Plus de 50K FCFA' }
    ];

    // Filtrage des événements
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Recherche textuelle
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 event.city.toLowerCase().includes(searchTerm.toLowerCase());

            // Catégorie
            const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;

            // Mois
            const matchesMonth = selectedMonth === 'all' || event.date.startsWith(selectedMonth);

            // Prix
            let matchesPrice = true;
            if (priceRange !== 'all') {
                const price = event.price;
                switch (priceRange) {
                    case '0-10000':
                        matchesPrice = price < 10000;
                        break;
                    case '10000-20000':
                        matchesPrice = price >= 10000 && price <= 20000;
                        break;
                    case '20000-50000':
                        matchesPrice = price > 20000 && price <= 50000;
                        break;
                    case '50000+':
                        matchesPrice = price > 50000;
                        break;
                }
            }

            return matchesSearch && matchesCategory && matchesMonth && matchesPrice;
        });
    }, [events, searchTerm, selectedCategory, selectedMonth, priceRange]);

    const handlePurchase = (eventId: number) => {
        if (!purchasedTickets.includes(eventId)) {
            setPurchasedTickets([...purchasedTickets, eventId]);
            // Ici, vous ajouteriez l'appel API pour l'achat
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0
        }).format(price) + ' FCFA';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            conference: '#5FA145',
            formation: '#C69438',
            gala: '#E4518C',
            festival: '#F5B4C6',
            hackathon: '#4D8A3C',
            concert: '#334E15'
        };
        return colors[category] || '#6B7280';
    };

    const getAvailabilityStatus = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage > 50) return { color: '#5FA145', text: 'Disponible' };
        if (percentage > 20) return { color: '#C69438', text: 'Places limitées' };
        if (percentage > 0) return { color: '#E4518C', text: 'Dernières places' };
        return { color: '#6B7280', text: 'Complet' };
    };

    return (
        <>
            <Head>
                <title>Billetterie - Fondation TITI</title>
                <meta name="description" content="Réservez vos billets pour les événements de la Fondation TITI. Conférences, formations, galas et bien plus." />
            </Head>

            <div className="tickets-page">
                <ModernHeader user={user} />
                
                {/* Section Hero */}
                <section 
                    className="hero-section py-5"
                    style={{
                        background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                        marginTop: '70px',
                        minHeight: '350px'
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
                                        🎫 Billetterie en ligne
                                    </h1>
                                    <p 
                                        className="lead mb-4"
                                        style={{ color: '#FFFFFF', opacity: 0.9, fontSize: '1.2rem' }}
                                    >
                                        Réservez vos places pour nos événements inspirants. Conférences, formations, 
                                        galas et festivals qui font la différence dans nos communautés.
                                    </p>
                                    
                                    {/* Stats rapides */}
                                    <div className="d-flex justify-content-center gap-4 flex-wrap mt-4">
                                        <div className="text-center">
                                            <div className="h3 fw-bold mb-1" style={{ color: '#C69438' }}>
                                                {events.length}
                                            </div>
                                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                                                Événements
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h3 fw-bold mb-1" style={{ color: '#E4518C' }}>
                                                {events.reduce((sum, event) => sum + event.totalTickets - event.availableTickets, 0)}
                                            </div>
                                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                                                Billets vendus
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h3 fw-bold mb-1" style={{ color: '#F5B4C6' }}>
                                                6
                                            </div>
                                            <div style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>
                                                Villes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Filtres */}
                <section className="py-4" style={{ backgroundColor: '#F8F9FA' }}>
                    <Container>
                        <Row className="g-3 align-items-end">
                            {/* Recherche */}
                            <Col lg={4} md={6}>
                                <Form.Label className="fw-semibold mb-2">Rechercher</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text style={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' }}>
                                        <i className="bi bi-search text-muted"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Événement, lieu, ville..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ borderColor: '#D1D5DB' }}
                                    />
                                </InputGroup>
                            </Col>
                            
                            {/* Catégorie */}
                            <Col lg={2} md={6}>
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
                            
                            {/* Mois */}
                            <Col lg={2} md={6}>
                                <Form.Label className="fw-semibold mb-2">Période</Form.Label>
                                <Form.Select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    style={{ borderColor: '#D1D5DB' }}
                                >
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            
                            {/* Prix */}
                            <Col lg={2} md={6}>
                                <Form.Label className="fw-semibold mb-2">Budget</Form.Label>
                                <Form.Select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    style={{ borderColor: '#D1D5DB' }}
                                >
                                    {priceRanges.map(range => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            
                            {/* Résultats */}
                            <Col lg={2} md={12}>
                                <div className="text-center text-md-start">
                                    <div className="text-muted small mb-2">Résultats</div>
                                    <div className="fw-bold" style={{ color: '#5FA145' }}>
                                        {filteredEvents.length} événement{filteredEvents.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Liste des événements */}
                <section className="py-5">
                    <Container>
                        {/* Événements en vedette */}
                        {filteredEvents.some(event => event.featured) && (
                            <>
                                <div className="d-flex align-items-center mb-4">
                                    <div 
                                        className="featured-indicator me-3 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)'
                                        }}
                                    >
                                        <i className="bi bi-star-fill text-white"></i>
                                    </div>
                                    <h3 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                        Événements en vedette
                                    </h3>
                                </div>
                                
                                <Row className="g-4 mb-5">
                                    {filteredEvents.filter(event => event.featured).map(event => (
                                        <Col lg={4} md={6} key={event.id}>
                                            {/* Card template sera ici */}
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}

                        {/* Tous les événements */}
                        <h3 className="fw-bold mb-4" style={{ color: '#1F2937' }}>
                            Tous nos événements
                        </h3>
                        
                        <Row className="g-4">
                            {filteredEvents.map(event => {
                                const availability = getAvailabilityStatus(event.availableTickets, event.totalTickets);
                                const isPurchased = purchasedTickets.includes(event.id);
                                const isSoldOut = event.availableTickets === 0;
                                
                                return (
                                    <Col xl={4} lg={6} key={event.id}>
                                        <Card 
                                            className="event-card h-100 border-0 shadow-sm position-relative overflow-hidden"
                                            style={{
                                                borderRadius: '20px',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            {/* Badge Featured */}
                                            {event.featured && (
                                                <div 
                                                    className="position-absolute top-0 end-0 m-3"
                                                    style={{ zIndex: 2 }}
                                                >
                                                    <Badge 
                                                        className="px-3 py-2"
                                                        style={{ 
                                                            background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
                                                            fontSize: '0.75rem',
                                                            borderRadius: '50px'
                                                        }}
                                                    >
                                                        <i className="bi bi-star-fill me-1"></i>
                                                        Vedette
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Header avec image/emoji */}
                                            <div 
                                                className="card-header-image text-center py-4 position-relative"
                                                style={{
                                                    background: `linear-gradient(135deg, ${getCategoryColor(event.category)} 0%, rgba(255,255,255,0.1) 100%)`,
                                                    borderRadius: '20px 20px 0 0'
                                                }}
                                            >
                                                <div style={{ fontSize: '4rem' }}>{event.image}</div>
                                                
                                                {/* Badge catégorie */}
                                                <div className="position-absolute bottom-0 start-0 m-3">
                                                    <Badge 
                                                        style={{ 
                                                            backgroundColor: getCategoryColor(event.category),
                                                            fontSize: '0.75rem',
                                                            padding: '6px 12px',
                                                            borderRadius: '50px'
                                                        }}
                                                    >
                                                        {categories.find(c => c.value === event.category)?.label}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <Card.Body className="p-4">
                                                {/* Titre et description */}
                                                <h5 className="card-title fw-bold mb-3" style={{ color: '#1F2937', lineHeight: '1.3' }}>
                                                    {event.title}
                                                </h5>
                                                <p className="card-text text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                    {event.description}
                                                </p>

                                                {/* Informations événement */}
                                                <div className="event-details mb-4">
                                                    {/* Date et heure */}
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div 
                                                            className="detail-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                backgroundColor: 'rgba(95, 161, 69, 0.1)',
                                                                minWidth: '32px'
                                                            }}
                                                        >
                                                            <i className="bi bi-calendar text-success"></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold" style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                                {formatDate(event.date)}
                                                            </div>
                                                            <div className="text-muted small">
                                                                {event.time}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Lieu */}
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div 
                                                            className="detail-icon me-3 rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                backgroundColor: 'rgba(198, 148, 56, 0.1)',
                                                                minWidth: '32px'
                                                            }}
                                                        >
                                                            <i className="bi bi-geo-alt" style={{ color: '#C69438' }}></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold" style={{ fontSize: '0.9rem', color: '#374151' }}>
                                                                {event.location}
                                                            </div>
                                                            <div className="text-muted small">
                                                                {event.city}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Prix et disponibilité */}
                                                <div className="price-availability d-flex justify-content-between align-items-center mb-4">
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <span className="fw-bold h5 mb-0 me-2" style={{ color: '#E4518C' }}>
                                                                {formatPrice(event.price)}
                                                            </span>
                                                            {event.originalPrice && (
                                                                <span className="text-muted text-decoration-line-through small">
                                                                    {formatPrice(event.originalPrice)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div 
                                                            className="availability-badge px-2 py-1 rounded-pill small fw-semibold"
                                                            style={{
                                                                backgroundColor: `${availability.color}20`,
                                                                color: availability.color,
                                                                fontSize: '0.75rem'
                                                            }}
                                                        >
                                                            {availability.text}
                                                        </div>
                                                        <div className="text-muted small mt-1">
                                                            {event.availableTickets} / {event.totalTickets} places
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bouton d'achat */}
                                                <Button
                                                    className="w-100 fw-bold py-3"
                                                    size="lg"
                                                    disabled={isSoldOut || isPurchased}
                                                    onClick={() => handlePurchase(event.id)}
                                                    style={{
                                                        background: isPurchased 
                                                            ? 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)' 
                                                            : isSoldOut 
                                                                ? '#9CA3AF' 
                                                                : 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontSize: '1rem',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: !isSoldOut && !isPurchased ? '0 4px 15px rgba(95, 161, 69, 0.3)' : 'none'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isSoldOut && !isPurchased) {
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.4)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isSoldOut && !isPurchased) {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(95, 161, 69, 0.3)';
                                                        }
                                                    }}
                                                >
                                                    <i className={`bi ${
                                                        isPurchased ? 'bi-check-circle' :
                                                        isSoldOut ? 'bi-x-circle' : 'bi-ticket-perforated'
                                                    } me-2`}></i>
                                                    {isPurchased ? 'Billet acheté' :
                                                     isSoldOut ? 'Complet' : 'Acheter le billet'}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>

                        {/* Message si aucun résultat */}
                        {filteredEvents.length === 0 && (
                            <div className="text-center py-5">
                                <div style={{ fontSize: '4rem', opacity: 0.3 }} className="mb-3">🔍</div>
                                <h4 className="fw-bold mb-3" style={{ color: '#6B7280' }}>
                                    Aucun événement trouvé
                                </h4>
                                <p className="text-muted mb-4">
                                    Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
                                </p>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                        setSelectedMonth('all');
                                        setPriceRange('all');
                                    }}
                                    style={{
                                        borderColor: '#5FA145',
                                        color: '#5FA145'
                                    }}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        )}
                    </Container>
                </section>

                <ModernFooter />
            </div>
        </>
    );
}
