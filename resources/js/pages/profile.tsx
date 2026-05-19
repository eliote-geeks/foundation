import { Head, router } from '@inertiajs/react';
import { Container, Row, Col, Card, Button, Badge, Nav, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { ModernHeader } from '../components/home/modern-header';
import { ModernFooter } from '../components/home/modern-footer';

interface UserData {
    name: string;
    email: string;
    joined_at: string;
    member_type: string;
    member_type_display: string;
    phone: string | null;
    city: string | null;
    country: string | null;
    bio: string | null;
    profession: string | null;
    company: string | null;
    interests: string[];
    skills: string[];
    engagement_score: number;
    engagement_level: string;
    avatar: string | null;
    accepts_newsletter: boolean;
    accepts_sms: boolean;
    linkedin_url: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
}

interface DonationStats {
    count: number;
    total: number;
    formatted_total: string;
    avg: number;
}

interface Stats {
    donations: DonationStats;
    tickets_count: number;
    activities_count: number;
}

interface Activity {
    id: number;
    type: string;
    label: string;
    title: string;
    points: number;
    date: string;
    date_human: string;
    icon: string;
    color: string;
}

interface Donation {
    id: number;
    title: string;
    amount: string;
    date: string | null;
    date_fr: string | null;
}

interface ProfileProps {
    user: UserData;
    stats: Stats;
    recentActivities: Activity[];
    recentDonations: Donation[];
}

export default function Profile({ user, stats, recentActivities, recentDonations }: ProfileProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAlert, setShowAlert] = useState(false);

    const handleGoToSettings = () => router.visit(route('profile.edit'));

    const MEMBER_TYPE_COLOR: Record<string, string> = {
        adherent: '#5FA145',
        ambassador: '#C69438',
        former_challenger: '#C69438',
        partner: '#334E15',
        volunteer: '#4A8A2A',
        beneficiary: '#F59E0B',
    };
    const memberColor = MEMBER_TYPE_COLOR[user.member_type] ?? '#5FA145';

    return (
        <>
            <Head title={`Profil de ${user.name} - TITI EVENTS`} />
            <div style={{ backgroundColor: '#F8FFFE', minHeight: '100vh' }}>
                <ModernHeader user={user} />

                <Container className="py-5">
                    {showAlert && (
                        <Alert variant="success" className="mb-4" onClose={() => setShowAlert(false)} dismissible>
                            <i className="bi bi-check-circle me-2"></i>
                            Profil mis à jour avec succès !
                        </Alert>
                    )}

                    {/* Bannière profil */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <div
                            className="position-relative"
                            style={{
                                background: `linear-gradient(135deg, ${memberColor} 0%, ${memberColor}99 100%)`,
                                height: 200,
                                borderRadius: '0.5rem 0.5rem 0 0',
                            }}
                        >
                            <div className="position-absolute bottom-0 start-0 p-4 text-white">
                                <Row className="align-items-end">
                                    <Col xs="auto">
                                        <div
                                            className="rounded-circle border border-4 border-white d-flex align-items-center justify-content-center"
                                            style={{ width: 120, height: 120, backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '2.5rem', marginBottom: -60 }}
                                        >
                                            {user.avatar
                                                ? <img src={user.avatar} alt={user.name} className="rounded-circle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                : <i className="bi bi-person-fill text-white"></i>
                                            }
                                        </div>
                                    </Col>
                                    <Col>
                                        <h2 className="mb-1 fw-bold">{user.name}</h2>
                                        {user.city && (
                                            <p className="mb-0 opacity-75">
                                                <i className="bi bi-geo-alt me-2"></i>{user.city}{user.country ? `, ${user.country}` : ''}
                                            </p>
                                        )}
                                        <p className="mb-0 opacity-75">
                                            <i className="bi bi-calendar-plus me-2"></i>
                                            Membre depuis {new Date(user.joined_at).getFullYear()}
                                        </p>
                                    </Col>
                                    <Col xs="auto">
                                        <Badge className="px-3 py-2" style={{ backgroundColor: memberColor, fontSize: '0.9rem' }}>
                                            {user.member_type_display}
                                        </Badge>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        <Card.Body style={{ paddingTop: 80 }}>
                            <Row>
                                <Col md={8}>
                                    {user.bio
                                        ? <p className="text-muted mb-3">{user.bio}</p>
                                        : <p className="text-muted fst-italic mb-3">Aucune bio renseignée.</p>
                                    }
                                    {user.interests.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {user.interests.map((interest, i) => (
                                                <Badge key={i} bg="light" text="dark" className="px-3 py-2">{interest}</Badge>
                                            ))}
                                        </div>
                                    )}
                                    {/* Réseaux sociaux */}
                                    <div className="d-flex gap-2">
                                        {user.linkedin_url && <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-linkedin"></i></a>}
                                        {user.facebook_url && <a href={user.facebook_url} target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-facebook"></i></a>}
                                        {user.instagram_url && <a href={user.instagram_url} target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-instagram"></i></a>}
                                        {user.twitter_url && <a href={user.twitter_url} target="_blank" rel="noreferrer" className="text-muted fs-5"><i className="bi bi-twitter-x"></i></a>}
                                    </div>
                                </Col>
                                <Col md={4} className="text-end">
                                    <Button
                                        style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                                        onClick={handleGoToSettings}
                                    >
                                        <i className="bi bi-pencil me-2"></i>Modifier le profil
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row className="g-4">
                        {/* Statistiques */}
                        <Col lg={3}>
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Header className="bg-white border-0 pb-2">
                                    <h5 className="mb-0 fw-bold">Mes Statistiques</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-muted small">Dons effectués</span>
                                            <strong className="text-success">{stats.donations.count}</strong>
                                        </div>
                                        <div className="text-muted small">Total : {stats.donations.formatted_total}</div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-muted small">Billets achetés</span>
                                            <strong style={{ color: '#4A8A2A' }}>{stats.tickets_count}</strong>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-muted small">Activités</span>
                                            <strong style={{ color: '#C69438' }}>{stats.activities_count}</strong>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-muted small">Score engagement</span>
                                            <strong style={{ color: memberColor }}>{user.engagement_score} pts</strong>
                                        </div>
                                        <div className="text-muted small">{user.engagement_level}</div>
                                    </div>

                                    {user.profession && (
                                        <div className="border-top pt-3 mt-3">
                                            <div className="text-muted small mb-1">Profession</div>
                                            <div className="fw-medium small">{user.profession}</div>
                                            {user.company && <div className="text-muted small">{user.company}</div>}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Contenu principal */}
                        <Col lg={9}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-white border-0">
                                    <Nav variant="tabs" activeKey={activeTab} onSelect={k => k && setActiveTab(k)}>
                                        <Nav.Item>
                                            <Nav.Link eventKey="overview"><i className="bi bi-house me-2"></i>Aperçu</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="activities"><i className="bi bi-activity me-2"></i>Activités</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="donations"><i className="bi bi-heart me-2"></i>Mes Dons</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>

                                <Card.Body>
                                    {/* Aperçu */}
                                    {activeTab === 'overview' && (
                                        <div>
                                            <h5 className="fw-bold mb-4">Activités récentes</h5>
                                            {recentActivities.length === 0 ? (
                                                <div className="text-center py-4 text-muted">
                                                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                    Aucune activité enregistrée
                                                </div>
                                            ) : recentActivities.map(a => (
                                                <div key={a.id} className="d-flex align-items-start mb-3 p-3 rounded" style={{ backgroundColor: '#F8F9FA' }}>
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                        style={{ width: 40, height: 40, backgroundColor: a.color, color: 'white' }}
                                                    >
                                                        <i className={a.icon}></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{a.title || a.label}</h6>
                                                        <div className="d-flex justify-content-between">
                                                            <span className="text-muted small">{a.date_human}</span>
                                                            {a.points > 0 && (
                                                                <Badge bg="warning" text="dark" className="rounded-pill">+{a.points} pts</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Activités */}
                                    {activeTab === 'activities' && (
                                        <div>
                                            <h5 className="fw-bold mb-4">Historique des activités</h5>
                                            {recentActivities.length === 0 ? (
                                                <p className="text-muted">Aucune activité enregistrée.</p>
                                            ) : recentActivities.map(a => (
                                                <div key={a.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                        style={{ width: 36, height: 36, backgroundColor: a.color, color: 'white', fontSize: 14 }}
                                                    >
                                                        <i className={a.icon}></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-medium">{a.title || a.label}</div>
                                                        <div className="text-muted small">{a.date_human}</div>
                                                    </div>
                                                    {a.points > 0 && (
                                                        <Badge bg="light" text="dark">+{a.points} pts</Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Mes Dons */}
                                    {activeTab === 'donations' && (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="fw-bold mb-0">Mes Contributions</h5>
                                                <Button style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                                                    onClick={() => router.visit('/events')}>
                                                    <i className="bi bi-plus-circle me-2"></i>Voir les événements
                                                </Button>
                                            </div>

                                            <Row className="g-3 mb-4">
                                                <Col md={4}>
                                                    <Card className="text-center border-0" style={{ backgroundColor: '#E8F5E8' }}>
                                                        <Card.Body>
                                                            <h3 className="fw-bold" style={{ color: '#5FA145' }}>{stats.donations.formatted_total}</h3>
                                                            <p className="mb-0 small">Total donné</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col md={4}>
                                                    <Card className="text-center border-0" style={{ backgroundColor: '#FFF0F5' }}>
                                                        <Card.Body>
                                                            <h3 className="fw-bold" style={{ color: '#C69438' }}>{stats.donations.count}</h3>
                                                            <p className="mb-0 small">Dons effectués</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col md={4}>
                                                    <Card className="text-center border-0" style={{ backgroundColor: '#F0F8FF' }}>
                                                        <Card.Body>
                                                            <h3 className="fw-bold" style={{ color: '#4A8A2A' }}>
                                                                {stats.donations.avg > 0
                                                                    ? stats.donations.avg.toLocaleString('fr-FR')
                                                                    : '—'}
                                                            </h3>
                                                            <p className="mb-0 small">Don moyen (XAF)</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            {recentDonations.length === 0 ? (
                                                <div className="text-center py-4 text-muted">
                                                    <i className="bi bi-heart fs-1 d-block mb-2"></i>
                                                    Aucun don effectué pour l'instant
                                                </div>
                                            ) : (
                                                <>
                                                    <h6 className="fw-semibold mb-3">Derniers dons</h6>
                                                    {recentDonations.map(d => (
                                                        <div key={d.id} className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                                                            <div>
                                                                <div className="fw-semibold">{d.title}</div>
                                                                <div className="small text-muted">{d.date_fr ?? d.date}</div>
                                                            </div>
                                                            <div className="text-success fw-bold">{d.amount}</div>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <ModernFooter />
            </div>
        </>
    );
}
