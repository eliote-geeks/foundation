import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

interface Testimonial {
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
    rating: number;
}

interface Stat {
    value: string;
    label: string;
    icon: string;
    color: string;
    target: number;
}

export function TestimonialsSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);

    const testimonials: Testimonial[] = [
        {
            name: "Marie Diallo",
            role: "Directrice RSE",
            company: "TechCorp Sénégal",
            content: "La Fondation nous a permis de transformer notre approche RSE. Les programmes sont excellents et l'impact est mesurable. Nous avons pu toucher plus de 1000 bénéficiaires grâce à leur plateforme.",
            avatar: "👩🏾‍💼",
            rating: 5
        },
        {
            name: "Amadou Ba",
            role: "Entrepreneur Social",
            company: "Green Innovation",
            content: "Grâce aux concours de la Fondation, j'ai pu développer mon projet d'agriculture durable. Le mentorat et les ressources sont exceptionnels. Aujourd'hui, nous impactons 500 familles rurales.",
            avatar: "👨🏿‍💼",
            rating: 5
        },
        {
            name: "Fatima Ndiaye",
            role: "Responsable Formation",
            company: "ONG Jeunesse+",
            content: "Les outils de formation de la Fondation ont révolutionné notre approche pédagogique. Nous formons maintenant 3 fois plus de jeunes avec des résultats remarquables.",
            avatar: "👩🏾‍🏫",
            rating: 5
        },
        {
            name: "Ibrahima Sarr",
            role: "Coordinateur Projet",
            company: "Fondation Éducation",
            content: "La collaboration avec cette plateforme a multiplié notre portée par 5. L'interface intuitive et les analytics nous permettent d'optimiser chaque initiative.",
            avatar: "👨🏾‍💻",
            rating: 5
        }
    ];

    const stats: Stat[] = [
        { value: "2,850", label: "Membres Actifs", icon: "bi bi-people-fill", color: "#5FA145", target: 2850 },
        { value: "600M", label: "FCFA Collectés", icon: "bi bi-cash-coin", color: "#C69438", target: 600 },
        { value: "45", label: "Projets Soutenus", icon: "bi bi-rocket-takeoff", color: "#E4518C", target: 45 },
        { value: "98%", label: "Satisfaction", icon: "bi bi-heart-fill", color: "#F5B4C6", target: 98 }
    ];

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Animate statistics
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        stats.forEach((stat, index) => {
                            let start = 0;
                            const target = stat.target;
                            const duration = 2000;
                            const increment = target / (duration / 16);

                            const animate = () => {
                                if (start < target) {
                                    start += increment;
                                    setAnimatedValues(prev => {
                                        const newValues = [...prev];
                                        newValues[index] = Math.min(Math.floor(start), target);
                                        return newValues;
                                    });
                                    requestAnimationFrame(animate);
                                } else {
                                    setAnimatedValues(prev => {
                                        const newValues = [...prev];
                                        newValues[index] = target;
                                        return newValues;
                                    });
                                }
                            };
                            
                            setTimeout(() => animate(), index * 200);
                        });
                    }
                });
            },
            { threshold: 0.5 }
        );

        const statsElement = document.querySelector('#stats-section');
        if (statsElement) {
            observer.observe(statsElement);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section 
            className="py-5"
            style={{
                background: 'linear-gradient(180deg, rgba(51, 78, 21, 0.95) 0%, #4D8A3C 50%, rgba(51, 78, 21, 0.95) 100%)',
                minHeight: '100vh',
                position: 'relative'
            }}
        >
            <Container>
                {/* Statistics Section */}
                <div id="stats-section" className="mb-5 pb-5">
                    <div className="text-center mb-5">
                        <h2 
                            className="display-4 fw-bold mb-4"
                            style={{ color: '#FFFFFF' }}
                        >
                            Notre impact en chiffres
                        </h2>
                        <p 
                            className="lead"
                            style={{ color: '#FFFFFF', opacity: 0.9, maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}
                        >
                            Des résultats concrets qui témoignent de notre engagement 
                            pour un changement positif et durable.
                        </p>
                    </div>

                    <Row className="g-4">
                        {stats.map((stat, index) => (
                            <Col lg={3} md={6} key={index}>
                                <div 
                                    className="stat-card text-center p-4 h-100"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(51, 78, 21, 0.9) 0%, rgba(77, 138, 60, 0.8) 100%)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(198, 148, 56, 0.4)',
                                        borderRadius: '20px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = `0 15px 35px rgba(${
                                            stat.color === '#5FA145' ? '95, 161, 69' :
                                            stat.color === '#C69438' ? '198, 148, 56' :
                                            stat.color === '#E4518C' ? '228, 81, 140' : '245, 180, 198'
                                        }, 0.3)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div 
                                        className="stat-icon d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: `linear-gradient(135deg, ${stat.color} 0%, rgba(255,255,255,0.1) 100%)`,
                                            color: '#FFF'
                                        }}
                                    >
                                        <i className={`${stat.icon} display-6`}></i>
                                    </div>
                                    
                                    <div 
                                        className="stat-value display-3 fw-bold mb-2"
                                        style={{ color: stat.color }}
                                    >
                                        {index === 1 ? `${animatedValues[index]}M` : 
                                         index === 3 ? `${animatedValues[index]}%` : 
                                         animatedValues[index].toLocaleString()}
                                    </div>
                                    
                                    <div 
                                        className="stat-label fw-semibold"
                                        style={{ color: '#FFFFFF', fontSize: '1.1rem' }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Testimonials Section */}
                <div className="testimonials-section">
                    <div className="text-center mb-5">
                        <div 
                            className="d-inline-flex align-items-center px-4 py-2 rounded-pill mb-4"
                            style={{
                                background: 'rgba(228, 81, 140, 0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(228, 81, 140, 0.3)'
                            }}
                        >
                            <i className="bi bi-chat-heart me-2" style={{ color: '#E4518C' }}></i>
                            <span style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600' }}>
                                Témoignages
                            </span>
                        </div>
                        
                        <h2 
                            className="display-4 fw-bold mb-4"
                            style={{ color: '#FFFFFF' }}
                        >
                            Ils nous font confiance
                        </h2>
                    </div>

                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div 
                                className="testimonial-container p-5 rounded-4 text-center"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(232, 245, 232, 0.1) 0%, rgba(228, 81, 140, 0.05) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(232, 245, 232, 0.2)',
                                    minHeight: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <div 
                                    className="testimonial-avatar mb-4"
                                    style={{
                                        fontSize: '4rem',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                                    }}
                                >
                                    {testimonials[currentTestimonial].avatar}
                                </div>

                                <div className="mb-4">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, index) => (
                                        <i 
                                            key={index}
                                            className="bi bi-star-fill me-1"
                                            style={{ color: '#C69438', fontSize: '1.2rem' }}
                                        ></i>
                                    ))}
                                </div>

                                <blockquote 
                                    className="mb-4"
                                    style={{
                                        fontSize: '1.3rem',
                                        lineHeight: '1.7',
                                        color: '#E8F5E8',
                                        fontStyle: 'italic',
                                        position: 'relative'
                                    }}
                                >
                                    <i 
                                        className="bi bi-quote position-absolute"
                                        style={{
                                            fontSize: '3rem',
                                            color: 'rgba(95, 161, 69, 0.2)',
                                            top: '-20px',
                                            left: '-10px'
                                        }}
                                    ></i>
                                    "{testimonials[currentTestimonial].content}"
                                </blockquote>

                                <div>
                                    <div 
                                        className="fw-bold mb-1"
                                        style={{ color: '#5FA145', fontSize: '1.2rem' }}
                                    >
                                        {testimonials[currentTestimonial].name}
                                    </div>
                                    <div 
                                        style={{ 
                                            color: '#FFFFFF', 
                                            opacity: 0.8,
                                            fontSize: '1.1rem',
                                            fontWeight: '400'
                                        }}
                                    >
                                        {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].company}
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial indicators */}
                            <div className="d-flex justify-content-center mt-4 gap-2">
                                {testimonials.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`testimonial-indicator ${currentTestimonial === index ? 'active' : ''}`}
                                        style={{
                                            width: currentTestimonial === index ? '40px' : '12px',
                                            height: '4px',
                                            background: currentTestimonial === index 
                                                ? 'linear-gradient(135deg, #5FA145 0%, #E4518C 100%)' 
                                                : 'rgba(232, 245, 232, 0.3)',
                                            borderRadius: '2px',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setCurrentTestimonial(index)}
                                    />
                                ))}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    );
}