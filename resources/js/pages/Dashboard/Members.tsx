import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Form, Alert, Dropdown, InputGroup, Nav, ProgressBar, Spinner } from 'react-bootstrap';
import DashboardLayout from '../../layouts/dashboard-layout';

interface Member {
    id: number;
    user_id: number;
    name: string;
    email: string;
    member_type: string;
    member_type_display: string;
    city?: string;
    country?: string;
    engagement_score: number;
    engagement_level: string;
    last_activity?: string;
    joined_at?: string;
    avatar?: string;
    is_active: boolean;
    skills_count: number;
    interests_count: number;
    activities_count: number;
}

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface Activity {
    id: number;
    member_name: string;
    member_type: string;
    activity_type: string;
    activity_title: string;
    points_earned: number;
    created_at: string;
}

interface DashboardMembersProps {
    user?: {
        name: string;
        email: string;
    };
    stats: Stat[];
    members: {
        data: Member[];
        current_page: number;
        last_page: number;
        total: number;
    };
    memberType: string;
    engagementData: Record<string, { avg_score: number; count: number }>;
    recentActivities: Activity[];
    filters: {
        search?: string;
        filter?: string;
    };
}

export default function DashboardMembers({ user, stats, members, memberType, engagementData, recentActivities, filters }: DashboardMembersProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'danger'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);
    const [processingMembers, setProcessingMembers] = useState<Set<number>>(new Set());

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        first_name: '',
        last_name: '',
        member_type: 'adherent',
        phone: '',
        birth_date: '',
        gender: '',
        address: '',
        city: '',
        country: 'Cameroun',
        profession: '',
        company: '',
        bio: '',
        interests: [] as string[],
        skills: [] as string[],
        is_active: true
    });

    const [pointsData, setPointsData] = useState({
        points: '',
        activity_title: '',
        activity_type: 'volunteer_work'
    });

    const memberTypes = [
        { value: 'adherent', label: 'Adhérent', color: '#4A8A2A', icon: 'bi-person-check' },
        { value: 'ambassador', label: 'Ambassadeur', color: '#C69438', icon: 'bi-star' },
        { value: 'volunteer', label: 'Bénévole', color: '#C69438', icon: 'bi-hand-thumbs-up' },
        { value: 'former_challenger', label: 'Ancien Challenger', color: '#5FA145', icon: 'bi-trophy' },
        { value: 'partner', label: 'Partenaire', color: '#4D8A3C', icon: 'bi-handshake' },
        { value: 'beneficiary', label: 'Bénéficiaire', color: '#334E15', icon: 'bi-heart' }
    ];

    const commonInterests = [
        'Environnement', 'Éducation', 'Technologie', 'Santé', 'Agriculture',
        'Entrepreneuriat', 'Arts & Culture', 'Sports', 'Développement Durable', 'Innovation'
    ];

    const commonSkills = [
        'Leadership', 'Communication', 'Gestion de projet', 'Informatique', 'Marketing',
        'Finance', 'Enseignement', 'Organisation', 'Créativité', 'Analyse'
    ];

    const getTypeInfo = (type: string) => {
        return memberTypes.find(t => t.value === type) || memberTypes[0];
    };

    const getEngagementColor = (score: number) => {
        if (score >= 1000) return '#5FA145';
        if (score >= 500) return '#C69438';
        if (score >= 200) return '#C69438';
        if (score >= 50) return '#4A8A2A';
        return '#9CA3AF';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field: 'interests' | 'skills', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const showAlert = (message: string, type: 'success' | 'danger' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => setAlertMessage(''), 5000);
    };

    const resetFormData = () => {
        setFormData({
            email: '',
            name: '',
            first_name: '',
            last_name: '',
            member_type: 'adherent',
            phone: '',
            birth_date: '',
            gender: '',
            address: '',
            city: '',
            country: 'Cameroun',
            profession: '',
            company: '',
            bio: '',
            interests: [],
            skills: [],
            is_active: true
        });
    };

    const loadMemberData = (member: Member) => {
        setFormData({
            email: member.email,
            name: member.name,
            first_name: member.name.split(' ')[0] || '',
            last_name: member.name.split(' ').slice(1).join(' ') || '',
            member_type: member.member_type,
            phone: '',
            birth_date: '',
            gender: '',
            address: '',
            city: member.city || '',
            country: member.country || 'Cameroun',
            profession: '',
            company: '',
            bio: '',
            interests: [],
            skills: [],
            is_active: member.is_active
        });
    };

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            router.post('/dashboard/members', formData, {
                onSuccess: () => {
                    setShowCreateModal(false);
                    resetFormData();
                    showAlert('Membre créé avec succès !');
                },
                onError: (errors) => {
                    console.error('Erreurs de validation:', errors);
                    showAlert('Erreur lors de la création du membre', 'danger');
                },
                onFinish: () => setIsLoading(false)
            });
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de la création du membre', 'danger');
            setIsLoading(false);
        }
    };

    const handleEditMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        setIsLoading(true);

        try {
            router.put(`/dashboard/members/${selectedMember.id}`, formData, {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedMember(null);
                    resetFormData();
                    showAlert('Membre mis à jour avec succès !');
                },
                onError: (errors) => {
                    console.error('Erreurs de validation:', errors);
                    showAlert('Erreur lors de la mise à jour', 'danger');
                },
                onFinish: () => setIsLoading(false)
            });
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de la mise à jour', 'danger');
            setIsLoading(false);
        }
    };

    const handleDeleteMember = async () => {
        if (!selectedMember) return;

        setIsLoading(true);

        try {
            router.delete(`/dashboard/members/${selectedMember.id}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedMember(null);
                    showAlert('Membre supprimé avec succès !');
                },
                onError: () => {
                    showAlert('Erreur lors de la suppression', 'danger');
                },
                onFinish: () => setIsLoading(false)
            });
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de la suppression', 'danger');
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (member: Member) => {
        const memberId = member.id;
        setProcessingMembers(prev => new Set(prev).add(memberId));

        try {
            const response = await fetch(`/dashboard/members/${memberId}/toggle-active`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (response.ok) {
                showAlert(data.message);
                // Recharger la page pour mettre à jour les données
                router.reload();
            } else {
                showAlert('Erreur lors du changement de statut', 'danger');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors du changement de statut', 'danger');
        } finally {
            setProcessingMembers(prev => {
                const newSet = new Set(prev);
                newSet.delete(memberId);
                return newSet;
            });
        }
    };

    const handleAddPoints = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/dashboard/members/${selectedMember.id}/engagement-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(pointsData)
            });

            const data = await response.json();

            if (response.ok) {
                setShowPointsModal(false);
                setSelectedMember(null);
                setPointsData({ points: '', activity_title: '', activity_type: 'volunteer_work' });
                showAlert(data.message);
                router.reload();
            } else {
                showAlert('Erreur lors de l\'ajout des points', 'danger');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de l\'ajout des points', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (memberType !== 'all') params.set('filter', memberType);

        window.location.href = `/dashboard/members?${params.toString()}`;
    };

    return (
        <DashboardLayout title="Gestion des Membres" user={user}>
            <Head title="Dashboard - Membres" />

            {/* Alert Messages */}
            {alertMessage && (
                <Alert variant={alertType} className="mb-4" dismissible onClose={() => setAlertMessage('')}>
                    {alertMessage}
                </Alert>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1F2937' }}>
                        <i className="bi bi-people-fill me-2" style={{ color: '#5FA145' }}></i>
                        Gestion des Membres
                    </h2>
                    <p className="text-muted mb-0">
                        Gérez votre communauté : adhérents, ambassadeurs, bénévoles et plus encore.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={() => window.open('/dashboard/members/export', '_blank')}
                        style={{
                            borderColor: '#5FA145',
                            color: '#5FA145',
                            borderRadius: '10px'
                        }}
                    >
                        <i className="bi bi-download me-2"></i>
                        Export CSV
                    </Button>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                            border: 'none',
                            borderRadius: '10px'
                        }}
                    >
                        <i className="bi bi-person-plus me-2"></i>
                        Nouveau Membre
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-5">
                {stats.map((stat, index) => (
                    <Col lg={3} md={6} key={index}>
                        <Card
                            className="border-0 h-100"
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}90 100%)`
                            }}
                        >
                            <Card.Body className="p-4 text-white">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="mb-1 opacity-90" style={{ fontSize: '0.9rem' }}>
                                            {stat.title}
                                        </p>
                                        <h3 className="fw-bold mb-0">
                                            {stat.value}
                                        </h3>
                                    </div>
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            background: 'rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <i className={stat.icon} style={{ fontSize: '1.3rem' }}></i>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className={`bi bi-arrow-${stat.positive ? 'up' : 'down'} me-2`}></i>
                                    <span className="fw-semibold">{stat.change}</span>
                                    <span className="ms-2 opacity-75">ce mois</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Navigation Tabs */}
            <div className="mb-4">
                <div className="nav nav-pills justify-content-center" style={{ background: '#F8F9FA', borderRadius: '15px', padding: '8px' }}>
                    {[
                        { key: 'overview', label: 'Vue d\'ensemble', icon: 'bi-house' },
                        { key: 'all', label: 'Tous les membres', icon: 'bi-people', count: members.total, href: '/dashboard/members' },
                        { key: 'adherent', label: 'Adhérents', icon: 'bi-person-check', href: '/dashboard/members/adherent' },
                        { key: 'ambassador', label: 'Ambassadeurs', icon: 'bi-star', href: '/dashboard/members/ambassador' },
                        { key: 'volunteer', label: 'Bénévoles', icon: 'bi-hand-thumbs-up', href: '/dashboard/members/volunteer' },
                        { key: 'analytics', label: 'Analytics', icon: 'bi-graph-up', href: '/dashboard/members/analytics' }
                    ].map(tab => (
                        <a
                            key={tab.key}
                            href={tab.href || `/dashboard/members${tab.key === 'all' || tab.key === 'overview' ? '' : `/${tab.key}`}`}
                            className={`nav-link ${memberType === tab.key || (memberType === 'all' && tab.key === 'all') ? 'active' : ''}`}
                            style={{
                                background: (memberType === tab.key || (memberType === 'all' && tab.key === 'all'))
                                    ? 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
                                    : 'transparent',
                                color: (memberType === tab.key || (memberType === 'all' && tab.key === 'all')) ? '#FFF' : '#6B7280',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '500',
                                padding: '10px 20px',
                                textDecoration: 'none'
                            }}
                        >
                            <i className={`${tab.icon} me-2`}></i>
                            {tab.label}
                            {tab.count && (
                                <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                    {tab.count}
                                </Badge>
                            )}
                        </a>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <Card className="border-0 mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <Card.Body className="p-3">
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher par nom, email, ville..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ borderRadius: '10px 0 0 10px' }}
                            />
                            <Button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '0 10px 10px 0'
                                }}
                            >
                                <i className="bi bi-search"></i>
                            </Button>
                        </InputGroup>
                    </Form>
                </Card.Body>
            </Card>

            {/* Main Content */}
            {activeTab === 'overview' && (
                <Row className="g-4">
                    <Col lg={8}>
                        <Card className="border-0 h-100" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    <i className="bi bi-people me-2"></i>
                                    Membres Récents
                                </h5>
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead style={{ background: '#F8F9FA' }}>
                                            <tr>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Membre</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Type</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Engagement</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Activité</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {members.data.slice(0, 5).map(member => {
                                                const typeInfo = getTypeInfo(member.member_type);
                                                return (
                                                    <tr key={member.id}>
                                                        <td className="border-0">
                                                            <div className="d-flex align-items-center">
                                                                <div
                                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        background: member.avatar ? 'transparent' : `${typeInfo.color}20`,
                                                                        color: typeInfo.color
                                                                    }}
                                                                >
                                                                    {member.avatar ? (
                                                                        <img
                                                                            src={member.avatar}
                                                                            alt={member.name}
                                                                            className="rounded-circle"
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                        />
                                                                    ) : (
                                                                        <i className="bi bi-person-fill"></i>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                                        {member.name}
                                                                    </div>
                                                                    <small style={{ color: '#6B7280' }}>
                                                                        {member.email}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="border-0">
                                                            <Badge
                                                                style={{
                                                                    background: typeInfo.color,
                                                                    fontSize: '0.75rem'
                                                                }}
                                                            >
                                                                <i className={`${typeInfo.icon} me-1`}></i>
                                                                {typeInfo.label}
                                                            </Badge>
                                                        </td>
                                                        <td className="border-0">
                                                            <div>
                                                                <div className="fw-semibold" style={{ color: getEngagementColor(member.engagement_score) }}>
                                                                    {member.engagement_score}
                                                                </div>
                                                                <ProgressBar
                                                                    now={Math.min(member.engagement_score / 10, 100)}
                                                                    style={{ height: '4px' }}
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="border-0">
                                                            <small style={{ color: '#6B7280' }}>
                                                                {member.last_activity || 'Jamais'}
                                                            </small>
                                                        </td>
                                                        <td className="border-0">
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    style={{ border: 'none', background: 'none' }}
                                                                >
                                                                    <i className="bi bi-three-dots"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            setSelectedMember(member);
                                                                            setShowDetailModal(true);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-eye me-2"></i>Voir détails
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            setSelectedMember(member);
                                                                            loadMemberData(member);
                                                                            setShowEditModal(true);
                                                                        }}
                                                                        style={{ fontSize: '0.9rem' }}
                                                                    >
                                                                        <i className="bi bi-pencil me-2"></i>Modifier
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            setSelectedMember(member);
                                                                            setShowPointsModal(true);
                                                                        }}
                                                                        style={{ fontSize: '0.9rem', color: '#5FA145' }}
                                                                    >
                                                                        <i className="bi bi-trophy me-2"></i>Ajouter points
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item
                                                                        onClick={() => handleToggleActive(member)}
                                                                        style={{ fontSize: '0.9rem', color: member.is_active ? '#C69438' : '#5FA145' }}
                                                                        disabled={processingMembers.has(member.id)}
                                                                    >
                                                                        {processingMembers.has(member.id) ? (
                                                                            <>
                                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                                Traitement...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className={`bi bi-${member.is_active ? 'pause' : 'play'} me-2`}></i>
                                                                                {member.is_active ? 'Désactiver' : 'Activer'}
                                                                            </>
                                                                        )}
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="text-center mt-3">
                                    <Button
                                        href="/dashboard/members"
                                        variant="outline-primary"
                                        style={{ borderColor: '#5FA145', color: '#5FA145', borderRadius: '10px' }}
                                    >
                                        Voir tous les membres
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 h-100" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                    <i className="bi bi-activity me-2"></i>
                                    Activités Récentes
                                </h6>
                                <div className="activities-list">
                                    {recentActivities.map(activity => {
                                        const typeInfo = getTypeInfo(activity.member_type);
                                        return (
                                            <div
                                                key={activity.id}
                                                className="d-flex align-items-start p-3 rounded-3 mb-3"
                                                style={{ background: '#F8F9FA' }}
                                            >
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                    style={{
                                                        width: '35px',
                                                        height: '35px',
                                                        background: `${typeInfo.color}15`,
                                                        color: typeInfo.color,
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    <i className={typeInfo.icon}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem', color: '#1F2937' }}>
                                                        {activity.member_name}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                                        {activity.activity_title}
                                                    </div>
                                                    <div className="d-flex align-items-center mt-1">
                                                        <Badge
                                                            bg="success"
                                                            style={{ fontSize: '0.65rem' }}
                                                        >
                                                            +{activity.points_earned} pts
                                                        </Badge>
                                                        <small className="ms-2" style={{ color: '#9CA3AF' }}>
                                                            {activity.created_at}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* All Members List */}
            {memberType !== 'overview' && (
                <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                <i className="bi bi-people me-2"></i>
                                {memberType === 'all' ? 'Tous les membres' :
                                 memberType === 'adherent' ? 'Adhérents' :
                                 memberType === 'ambassador' ? 'Ambassadeurs' :
                                 memberType === 'volunteer' ? 'Bénévoles' : 'Membres'}
                                <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.8rem' }}>
                                    {members.total}
                                </Badge>
                            </h5>
                        </div>

                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead style={{ background: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Membre</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Type</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Localisation</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Engagement</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Inscription</th>
                                        <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.data.map(member => {
                                        const typeInfo = getTypeInfo(member.member_type);
                                        return (
                                            <tr key={member.id}>
                                                <td className="border-0">
                                                    <div className="d-flex align-items-center">
                                                        <div
                                                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                background: member.avatar ? 'transparent' : `${typeInfo.color}20`,
                                                                color: typeInfo.color
                                                            }}
                                                        >
                                                            {member.avatar ? (
                                                                <img
                                                                    src={member.avatar}
                                                                    alt={member.name}
                                                                    className="rounded-circle"
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                <i className="bi bi-person-fill"></i>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                                {member.name}
                                                            </div>
                                                            <small style={{ color: '#6B7280' }}>
                                                                {member.email}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <Badge
                                                        style={{
                                                            background: typeInfo.color,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        <i className={`${typeInfo.icon} me-1`}></i>
                                                        {typeInfo.label}
                                                    </Badge>
                                                </td>
                                                <td className="border-0">
                                                    <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                        {member.city && member.country ? `${member.city}, ${member.country}` :
                                                         member.country || 'Non spécifié'}
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <div>
                                                        <div className="fw-semibold" style={{ color: getEngagementColor(member.engagement_score) }}>
                                                            {member.engagement_score} pts
                                                        </div>
                                                        <small style={{ color: '#6B7280' }}>
                                                            {member.engagement_level}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                        {member.joined_at || 'Non définie'}
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <div className="d-flex gap-1">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setShowDetailModal(true);
                                                            }}
                                                            style={{
                                                                border: 'none',
                                                                background: '#E8F5E8',
                                                                color: '#5FA145'
                                                            }}
                                                            title="Voir détails"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                loadMemberData(member);
                                                                setShowEditModal(true);
                                                            }}
                                                            style={{
                                                                border: 'none',
                                                                background: '#F3F4F6',
                                                                color: '#6B7280'
                                                            }}
                                                            title="Modifier"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                style={{
                                                                    border: 'none',
                                                                    background: '#F3F4F6',
                                                                    color: '#6B7280'
                                                                }}
                                                            >
                                                                <i className="bi bi-three-dots"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    onClick={() => {
                                                                        setSelectedMember(member);
                                                                        setShowPointsModal(true);
                                                                    }}
                                                                    style={{ fontSize: '0.9rem' }}
                                                                >
                                                                    <i className="bi bi-trophy me-2"></i>Ajouter points
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item
                                                                    onClick={() => handleToggleActive(member)}
                                                                    style={{
                                                                        fontSize: '0.9rem',
                                                                        color: member.is_active ? '#C69438' : '#5FA145'
                                                                    }}
                                                                    disabled={processingMembers.has(member.id)}
                                                                >
                                                                    {processingMembers.has(member.id) ? (
                                                                        <>
                                                                            <Spinner animation="border" size="sm" className="me-2" />
                                                                            Traitement...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <i className={`bi bi-${member.is_active ? 'pause' : 'play'} me-2`}></i>
                                                                            {member.is_active ? 'Désactiver' : 'Activer'}
                                                                        </>
                                                                    )}
                                                                </Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() => {
                                                                        setSelectedMember(member);
                                                                        setShowDeleteModal(true);
                                                                    }}
                                                                    style={{ fontSize: '0.9rem', color: '#DC2626' }}
                                                                >
                                                                    <i className="bi bi-trash me-2"></i>Supprimer
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {members.last_page > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        {Array.from({ length: members.last_page }, (_, i) => i + 1).map(page => (
                                            <li key={page} className={`page-item ${page === members.current_page ? 'active' : ''}`}>
                                                <a
                                                    className="page-link"
                                                    href={`/dashboard/members?page=${page}${memberType !== 'all' ? `&filter=${memberType}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}`}
                                                >
                                                    {page}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* Edit Member Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-pencil me-2"></i>
                        Modifier le Membre
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleEditMember}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Prénom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Nom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Type de membre *</Form.Label>
                                    <Form.Select
                                        name="member_type"
                                        value={formData.member_type}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    >
                                        {memberTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Ville</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Check
                                        type="checkbox"
                                        label="Membre actif"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowEditModal(false)}
                                style={{ borderRadius: '8px' }}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Mise à jour...
                                    </>
                                ) : (
                                    'Mettre à jour'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Create Member Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-person-plus me-2"></i>
                        Nouveau Membre
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleCreateMember}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Prénom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Nom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Type de membre *</Form.Label>
                                    <Form.Select
                                        name="member_type"
                                        value={formData.member_type}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    >
                                        {memberTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Téléphone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Profession</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Centres d'intérêt</Form.Label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {commonInterests.map(interest => (
                                            <Badge
                                                key={interest}
                                                bg={formData.interests.includes(interest) ? 'primary' : 'light'}
                                                text={formData.interests.includes(interest) ? 'light' : 'dark'}
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}
                                                onClick={() => handleArrayChange('interests', interest)}
                                            >
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowCreateModal(false)}
                                style={{ borderRadius: '8px' }}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            >
                                Créer le membre
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Points Modal */}
            <Modal show={showPointsModal} onHide={() => setShowPointsModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-trophy me-2"></i>
                        Ajouter des Points d'Engagement
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedMember && (
                        <>
                            <div className="text-center mb-4">
                                <h5>Membre: {selectedMember.name}</h5>
                                <small className="text-muted">
                                    Score actuel: <span className="fw-bold" style={{ color: getEngagementColor(selectedMember.engagement_score) }}>
                                        {selectedMember.engagement_score} points
                                    </span>
                                </small>
                            </div>
                            <Form onSubmit={handleAddPoints}>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Nombre de points *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                max="1000"
                                                value={pointsData.points}
                                                onChange={(e) => setPointsData(prev => ({ ...prev, points: e.target.value }))}
                                                required
                                                style={{ borderRadius: '8px' }}
                                                placeholder="Ex: 50"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Type d'activité *</Form.Label>
                                            <Form.Select
                                                value={pointsData.activity_type}
                                                onChange={(e) => setPointsData(prev => ({ ...prev, activity_type: e.target.value }))}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            >
                                                <option value="volunteer_work">Travail bénévole</option>
                                                <option value="event_attendance">Participation événement</option>
                                                <option value="training_completion">Formation complétée</option>
                                                <option value="referral">Parrainage</option>
                                                <option value="partnership_activity">Activité partenariat</option>
                                                <option value="profile_update">Mise à jour profil</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Titre de l'activité *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={pointsData.activity_title}
                                                onChange={(e) => setPointsData(prev => ({ ...prev, activity_title: e.target.value }))}
                                                required
                                                style={{ borderRadius: '8px' }}
                                                placeholder="Ex: Participation à l'événement communautaire"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPointsModal(false)}
                                        style={{ borderRadius: '8px' }}
                                        disabled={isLoading}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                            border: 'none',
                                            borderRadius: '8px'
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Ajout...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Ajouter les points
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#DC2626' }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Confirmer la Suppression
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedMember && (
                        <>
                            <div className="text-center mb-4">
                                <div
                                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: '#FEE2E2',
                                        color: '#DC2626'
                                    }}
                                >
                                    <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                                </div>
                                <h5 className="mb-3">Supprimer le membre ?</h5>
                                <p className="text-muted mb-1">
                                    Vous êtes sur le point de supprimer le membre :
                                </p>
                                <div className="fw-bold" style={{ color: '#1F2937', fontSize: '1.1rem' }}>
                                    {selectedMember.name}
                                </div>
                                <small className="text-muted">
                                    {selectedMember.email} • {selectedMember.member_type_display}
                                </small>
                            </div>

                            <div
                                className="p-3 rounded"
                                style={{ background: '#FEF3C7', border: '1px solid #F59E0B20' }}
                            >
                                <div className="d-flex align-items-start">
                                    <i className="bi bi-exclamation-triangle text-warning me-2 mt-1"></i>
                                    <div>
                                        <strong style={{ color: '#92400E' }}>Attention !</strong>
                                        <div style={{ color: '#92400E', fontSize: '0.9rem' }}>
                                            Cette action est irréversible. Toutes les données du membre,
                                            ses activités et son historique seront définitivement supprimés.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <small className="text-muted d-block mb-1">Données qui seront supprimées :</small>
                                <ul className="list-unstyled" style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                                    <li><i className="bi bi-check2 me-2"></i>Profil et informations personnelles</li>
                                    <li><i className="bi bi-check2 me-2"></i>{selectedMember.activities_count} activités enregistrées</li>
                                    <li><i className="bi bi-check2 me-2"></i>{selectedMember.engagement_score} points d'engagement</li>
                                    <li><i className="bi bi-check2 me-2"></i>Historique des participations</li>
                                </ul>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowDeleteModal(false)}
                        style={{ borderRadius: '8px' }}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteMember}
                        style={{ borderRadius: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Suppression...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-trash me-2"></i>
                                Confirmer la suppression
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Member Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                {selectedMember && (
                    <>
                        <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <Modal.Title style={{ color: '#334E15' }}>
                                <i className="bi bi-person me-2"></i>
                                Profil de {selectedMember.name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div className="text-center mb-4">
                                <div
                                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: selectedMember.avatar ? 'transparent' : `${getTypeInfo(selectedMember.member_type).color}20`,
                                        color: getTypeInfo(selectedMember.member_type).color
                                    }}
                                >
                                    {selectedMember.avatar ? (
                                        <img
                                            src={selectedMember.avatar}
                                            alt={selectedMember.name}
                                            className="rounded-circle"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <i className="bi bi-person-fill" style={{ fontSize: '2rem' }}></i>
                                    )}
                                </div>
                                <h4 className="fw-bold mb-1">{selectedMember.name}</h4>
                                <Badge
                                    style={{
                                        background: getTypeInfo(selectedMember.member_type).color,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {selectedMember.member_type_display}
                                </Badge>
                            </div>

                            <Row className="g-3">
                                <Col md={6}>
                                    <small className="text-muted">Email</small>
                                    <div className="fw-semibold">{selectedMember.email}</div>
                                </Col>
                                <Col md={6}>
                                    <small className="text-muted">Localisation</small>
                                    <div className="fw-semibold">
                                        {selectedMember.city && selectedMember.country ?
                                            `${selectedMember.city}, ${selectedMember.country}` :
                                            selectedMember.country || 'Non spécifié'}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <small className="text-muted">Score d'engagement</small>
                                    <div className="fw-semibold" style={{ color: getEngagementColor(selectedMember.engagement_score) }}>
                                        {selectedMember.engagement_score} points ({selectedMember.engagement_level})
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <small className="text-muted">Inscription</small>
                                    <div className="fw-semibold">{selectedMember.joined_at || 'Non définie'}</div>
                                </Col>
                                <Col md={6}>
                                    <small className="text-muted">Compétences</small>
                                    <div className="fw-semibold">{selectedMember.skills_count} compétences</div>
                                </Col>
                                <Col md={6}>
                                    <small className="text-muted">Centres d'intérêt</small>
                                    <div className="fw-semibold">{selectedMember.interests_count} centres d'intérêt</div>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Fermer
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    loadMemberData(selectedMember);
                                    setShowEditModal(true);
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none'
                                }}
                            >
                                <i className="bi bi-pencil me-2"></i>
                                Modifier
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </DashboardLayout>
    );
}