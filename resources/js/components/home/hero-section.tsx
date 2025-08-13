import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            title: "Créons ensemble un avenir meilleur",
            subtitle: "Rejoignez une communauté engagée pour transformer les défis en opportunités",
            cta: "Découvrir nos événements",
            image: "🌱"
        },
        {
            title: "Des événements qui changent des vies",
            subtitle: "Participez à des concours, programmes et initiatives qui font la différence",
            cta: "Explorer maintenant",
            image: "🎯"
        },
        {
            title: "Votre engagement compte",
            subtitle: "Chaque action compte. Ensemble, construisons un monde plus solidaire",
            cta: "Nous rejoindre",
            image: "🤝"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section 
            id="hero"
            className="hero-section position-relative overflow-hidden"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                paddingTop: '100px'
            }}
        >
            {/* Animated Background Elements */}
            <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '300px',
                        height: '300px',
                        background: 'rgba(228, 81, 140, 0.1)',
                        top: '10%',
                        right: '10%',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <div 
                    className="position-absolute rounded-circle"
                    style={{
                        width: '200px',
                        height: '200px',
                        background: 'rgba(198, 148, 56, 0.1)',
                        bottom: '20%',
                        left: '5%',
                        animation: 'float 4s ease-in-out infinite reverse'
                    }}
                />
                <div 
                    className="position-absolute"
                    style={{
                        width: '150px',
                        height: '150px',
                        background: 'rgba(232, 245, 232, 0.1)',
                        top: '60%',
                        right: '20%',
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        animation: 'morphing 8s ease-in-out infinite'
                    }}
                />
            </div>

            <Container className="position-relative" style={{ zIndex: 2 }}>
                <Row className="align-items-center min-vh-100">
                    <Col lg={6} className="text-center text-lg-start">
                        <div className="hero-content fade-in-up">
                            <div 
                                className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-4"
                                style={{
                                    background: 'rgba(232, 245, 232, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(232, 245, 232, 0.3)'
                                }}
                            >
                                <span 
                                    className="badge rounded-pill me-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
                                        color: '#334E15'
                                    }}
                                >
                                    Nouveau
                                </span>
                                <span style={{ color: '#E8F5E8', fontSize: '0.9rem' }}>
                                    Plateforme événementielle lancée !
                                </span>
                            </div>

                            <h1 
                                className="display-3 fw-bold mb-4"
                                style={{ 
                                    color: '#E8F5E8',
                                    lineHeight: '1.2',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                {slides[currentSlide].title}
                            </h1>
                            
                            <p 
                                className="lead mb-5"
                                style={{ 
                                    color: '#E8F5E8',
                                    opacity: 0.9,
                                    fontSize: '1.3rem',
                                    maxWidth: '600px'
                                }}
                            >
                                {slides[currentSlide].subtitle}
                            </p>

                            <div className="d-flex flex-column flex-sm-row gap-3">
                                <Button
                                    size="lg"
                                    className="modern-btn-primary px-5 py-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                        border: 'none',
                                        color: '#334E15',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        borderRadius: '50px',
                                        boxShadow: '0 10px 30px rgba(95, 161, 69, 0.3)',
                                        transform: 'translateY(0)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(95, 161, 69, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 161, 69, 0.3)';
                                    }}
                                >
                                    <i className="bi bi-rocket-takeoff me-2"></i>
                                    {slides[currentSlide].cta}
                                </Button>
                                
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    className="px-5 py-3 video-btn"
                                    style={{
                                        borderColor: '#E8F5E8',
                                        color: '#E8F5E8',
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        borderRadius: '50px',
                                        borderWidth: '2px',
                                        background: 'transparent',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(95, 161, 69, 0.2)';
                                        e.currentTarget.style.borderColor = '#5FA145';
                                        e.currentTarget.style.color = '#5FA145';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 161, 69, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = '#E8F5E8';
                                        e.currentTarget.style.color = '#E8F5E8';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                                >
                                    <i className="bi bi-play-circle me-2"></i>
                                    Voir la vidéo
                                </Button>
                            </div>

                            {/* Slide indicators */}
                            <div className="d-flex justify-content-center justify-content-lg-start mt-5 gap-2">
                                {slides.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`slide-indicator ${currentSlide === index ? 'active' : ''}`}
                                        style={{
                                            width: currentSlide === index ? '40px' : '10px',
                                            height: '4px',
                                            background: currentSlide === index 
                                                ? 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)' 
                                                : 'rgba(232, 245, 232, 0.3)',
                                            borderRadius: '2px',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setCurrentSlide(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>
                    
                    <Col lg={6} className="text-center mt-5 mt-lg-0">
                        <div className="hero-visual position-relative">
                            <div 
                                className="hero-emoji-container d-flex align-items-center justify-content-center rounded-circle mx-auto"
                                style={{
                                    width: '400px',
                                    height: '400px',
                                    background: 'linear-gradient(135deg, rgba(232, 245, 232, 0.1) 0%, rgba(228, 81, 140, 0.1) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '2px solid rgba(232, 245, 232, 0.2)',
                                    fontSize: '8rem',
                                    animation: 'pulse 3s ease-in-out infinite'
                                }}
                            >
                                {slides[currentSlide].image}
                            </div>
                            
                            {/* Floating stats */}
                            <div 
                                className="position-absolute floating-stat"
                                style={{
                                    top: '20%',
                                    left: '-10%',
                                    background: 'rgba(51, 78, 21, 0.9)',
                                    backdropFilter: 'blur(15px)',
                                    border: '2px solid rgba(95, 161, 69, 0.5)',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    color: '#E8F5E8',
                                    animation: 'float 5s ease-in-out infinite',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div className="fw-bold h4 mb-1" style={{ color: '#5FA145', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>2,850+</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Membres actifs</div>
                            </div>
                            
                            <div 
                                className="position-absolute floating-stat"
                                style={{
                                    bottom: '30%',
                                    right: '-5%',
                                    background: 'rgba(51, 78, 21, 0.9)',
                                    backdropFilter: 'blur(15px)',
                                    border: '2px solid rgba(198, 148, 56, 0.5)',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    color: '#E8F5E8',
                                    animation: 'float 4s ease-in-out infinite reverse',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <div className="fw-bold h4 mb-1" style={{ color: '#C69438', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>45</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Projets soutenus</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                
                {/* Scroll indicator */}
                <div className="position-absolute w-100 text-center" style={{ bottom: '30px', left: 0 }}>
                    <div 
                        className="scroll-indicator mx-auto"
                        style={{
                            width: '30px',
                            height: '50px',
                            border: '2px solid rgba(232, 245, 232, 0.5)',
                            borderRadius: '15px',
                            position: 'relative'
                        }}
                    >
                        <div 
                            style={{
                                width: '4px',
                                height: '8px',
                                background: '#E8F5E8',
                                borderRadius: '2px',
                                position: 'absolute',
                                top: '8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                animation: 'scroll-bounce 2s infinite'
                            }}
                        />
                    </div>
                    <div className="mt-2" style={{ color: 'rgba(232, 245, 232, 0.7)', fontSize: '0.8rem' }}>
                        Faites défiler pour découvrir
                    </div>
                </div>
            </Container>
        </section>
    );
}