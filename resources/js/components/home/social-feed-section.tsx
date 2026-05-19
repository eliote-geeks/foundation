import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface Post {
    id: number;
    author: {
        name: string;
        avatar: string;
        memberType: string;
        badge: string;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    type: 'event' | 'contest' | 'achievement' | 'community';
    category: string;
}

export function SocialFeedSection() {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState('all');

    const mockPosts: Post[] = [
        {
            id: 1,
            author: {
                name: 'Marie Dubois',
                avatar: '👩‍💼',
                memberType: 'Ambassadrice',
                badge: '🌟'
            },
            content: 'Très fière de vous annoncer le lancement de notre nouveau programme de mentorat entrepreneurial ! 🚀 Plus de 50 jeunes entrepreneurs vont bénéficier d\'un accompagnement personnalisé.',
            image: '/api/placeholder/400/250',
            timestamp: '2 heures',
            likes: 42,
            comments: 8,
            shares: 12,
            isLiked: false,
            type: 'event',
            category: 'Entrepreneuriat'
        },
        {
            id: 2,
            author: {
                name: 'Jean-Claude Kamgang',
                avatar: '👨‍🎓',
                memberType: 'Ancien Challenger',
                badge: '🏆'
            },
            content: 'Merci à toute l\'équipe de la TITI EVENTS ! Grâce au concours Innovation Tech, j\'ai pu développer mon application mobile qui aide les agriculteurs camerounais. Aujourd\'hui, plus de 1000 utilisateurs !',
            timestamp: '4 heures',
            likes: 89,
            comments: 15,
            shares: 23,
            isLiked: true,
            type: 'achievement',
            category: 'Technologie'
        },
        {
            id: 3,
            author: {
                name: 'TITI EVENTS',
                avatar: '🏛️',
                memberType: 'Organisation',
                badge: '✅'
            },
            content: '🎉 NOUVEAU CONCOURS ! Le "Défi Environnement 2025" est officiellement lancé. Thème : Solutions durables pour nos communautés. Prix total : 50 000€. Inscriptions ouvertes jusqu\'au 31 mars.',
            image: '/api/placeholder/400/200',
            timestamp: '6 heures',
            likes: 156,
            comments: 34,
            shares: 67,
            isLiked: false,
            type: 'contest',
            category: 'Environnement'
        },
        {
            id: 4,
            author: {
                name: 'Aminata Traoré',
                avatar: '👩‍🌾',
                memberType: 'Bénéficiaire',
                badge: '🎯'
            },
            content: 'Formation terminée avec succès ! 6 mois d\'apprentissage en agriculture durable et me voilà prête à transformer mon exploitation. Un grand merci aux formateurs et à ma cohorte 💪',
            timestamp: '1 jour',
            likes: 78,
            comments: 12,
            shares: 5,
            isLiked: true,
            type: 'achievement',
            category: 'Agriculture'
        },
        {
            id: 5,
            author: {
                name: 'Community Team',
                avatar: '👥',
                memberType: 'Équipe',
                badge: '💼'
            },
            content: '📊 IMPACT DU MOIS : 340 nouvelles inscriptions, 12 projets financés, 25 formations dispensées et 8 partenariats signés. Ensemble, nous avançons ! Merci à tous nos membres actifs.',
            timestamp: '2 jours',
            likes: 203,
            comments: 28,
            shares: 45,
            isLiked: false,
            type: 'community',
            category: 'Impact'
        }
    ];

    const filters = [
        { key: 'all', label: 'Tout voir', icon: '📱' },
        { key: 'event', label: 'Événements', icon: '📅' },
        { key: 'contest', label: 'Concours', icon: '🏆' },
        { key: 'achievement', label: 'Réussites', icon: '🎯' },
        { key: 'community', label: 'Communauté', icon: '👥' }
    ];

    const filteredPosts = activeFilter === 'all' 
        ? mockPosts 
        : mockPosts.filter(post => post.type === activeFilter);

    const getTypeColor = (type: string) => {
        const colors = {
            'event': '#5FA145',
            'contest': '#C69438',
            'achievement': '#C69438',
            'community': '#4D8A3C'
        };
        return colors[type as keyof typeof colors] || '#5FA145';
    };

    const getMemberTypeStyle = (memberType: string) => {
        const styles = {
            'Ambassadrice': { bg: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)', color: '#334E15' },
            'Ambassadeur': { bg: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)', color: '#334E15' },
            'Ancien Challenger': { bg: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)', color: '#FFF' },
            'Bénéficiaire': { bg: 'linear-gradient(135deg, #C69438 0%, #F9D27A 100%)', color: '#334E15' },
            'Organisation': { bg: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)', color: '#FFF' },
            'Équipe': { bg: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 100%)', color: '#FFF' }
        };
        return styles[memberType as keyof typeof styles] || styles['Organisation'];
    };

    return (
        <section 
            className="social-feed py-5"
            style={{
                background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
                minHeight: '100vh'
            }}
        >
            <Container>
                {/* Header Section */}
                <Row className="mb-5">
                    <Col>
                        <div className="text-center mb-4">
                            <h2 
                                className="display-4 fw-bold mb-3"
                                style={{ color: '#334E15' }}
                            >
                                🌟 Notre Communauté en Action
                            </h2>
                            <p 
                                className="lead"
                                style={{ color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}
                            >
                                Découvrez les dernières actualités, réussites et opportunités 
                                partagées par notre communauté d'impact social.
                            </p>
                        </div>

                        {/* Filtres */}
                        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                            {filters.map(filter => (
                                <Button
                                    key={filter.key}
                                    variant={activeFilter === filter.key ? 'primary' : 'outline-secondary'}
                                    size="sm"
                                    className="px-3 py-2 rounded-pill fw-medium"
                                    style={{
                                        background: activeFilter === filter.key 
                                            ? 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
                                            : 'transparent',
                                        borderColor: activeFilter === filter.key ? '#5FA145' : '#D1D5DB',
                                        color: activeFilter === filter.key ? '#FFF' : '#6B7280',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => setActiveFilter(filter.key)}
                                >
                                    <span className="me-2">{filter.icon}</span>
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Feed Posts */}
                <Row className="justify-content-center">
                    <Col lg={8} md={10}>
                        <div className="feed-container">
                            {filteredPosts.map(post => (
                                <Card 
                                    key={post.id}
                                    className="mb-4 border-0 shadow-sm"
                                    style={{
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <Card.Body className="p-4">
                                        {/* Post Header */}
                                        <div className="d-flex align-items-start mb-3">
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    fontSize: '1.5rem',
                                                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)'
                                                }}
                                            >
                                                {post.author.avatar}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h6 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                                        {post.author.name}
                                                    </h6>
                                                    <span>{post.author.badge}</span>
                                                    <span 
                                                        className="badge rounded-pill px-2 py-1"
                                                        style={{
                                                            ...getMemberTypeStyle(post.author.memberType),
                                                            background: getMemberTypeStyle(post.author.memberType).bg,
                                                            color: getMemberTypeStyle(post.author.memberType).color,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {post.author.memberType}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <small style={{ color: '#6B7280' }}>
                                                        Il y a {post.timestamp}
                                                    </small>
                                                    <span 
                                                        className="badge rounded-pill"
                                                        style={{
                                                            backgroundColor: `${getTypeColor(post.type)}20`,
                                                            color: getTypeColor(post.type),
                                                            fontSize: '0.65rem'
                                                        }}
                                                    >
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="mb-3">
                                            <p className="mb-3" style={{ color: '#374151', lineHeight: '1.6' }}>
                                                {post.content}
                                            </p>
                                            {post.image && (
                                                <div 
                                                    className="rounded-3 overflow-hidden mb-3"
                                                    style={{ height: '200px', background: '#F3F4F6' }}
                                                >
                                                    <div 
                                                        className="d-flex align-items-center justify-content-center h-100"
                                                        style={{ color: '#9CA3AF' }}
                                                    >
                                                        📸 Image du post
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Post Actions */}
                                        <div className="d-flex justify-content-between align-items-center pt-3" 
                                             style={{ borderTop: '1px solid #F3F4F6' }}>
                                            <div className="d-flex gap-4">
                                                <Button
                                                    variant="link"
                                                    className="p-0 d-flex align-items-center gap-2"
                                                    style={{
                                                        color: post.isLiked ? '#C69438' : '#6B7280',
                                                        textDecoration: 'none',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    <i className={`bi ${post.isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                                    {post.likes}
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="p-0 d-flex align-items-center gap-2"
                                                    style={{
                                                        color: '#6B7280',
                                                        textDecoration: 'none',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    <i className="bi bi-chat"></i>
                                                    {post.comments}
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="p-0 d-flex align-items-center gap-2"
                                                    style={{
                                                        color: '#6B7280',
                                                        textDecoration: 'none',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    <i className="bi bi-share"></i>
                                                    {post.shares}
                                                </Button>
                                            </div>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="rounded-pill px-3"
                                                style={{
                                                    borderColor: getTypeColor(post.type),
                                                    color: getTypeColor(post.type),
                                                    fontSize: '0.8rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = getTypeColor(post.type);
                                                    e.currentTarget.style.color = '#FFF';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = getTypeColor(post.type);
                                                }}
                                            >
                                                {post.type === 'event' && 'Voir l\'événement'}
                                                {post.type === 'contest' && 'Participer'}
                                                {post.type === 'achievement' && 'Féliciter'}
                                                {post.type === 'community' && 'En savoir plus'}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="text-center mt-4">
                            <Button
                                size="sm"
                                className="px-4 py-2 rounded-pill fw-medium"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    color: '#FFF',
                                    fontSize: '0.875rem',
                                    boxShadow: '0 2px 8px rgba(95, 161, 69, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)';
                                    e.currentTarget.style.color = '#FFF';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(95, 161, 69, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)';
                                    e.currentTarget.style.color = '#FFF';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(95, 161, 69, 0.3)';
                                }}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Voir plus
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}