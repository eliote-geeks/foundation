import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Modal, Form, Alert, Dropdown, InputGroup, Nav, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';
import DashboardLayout from '../../layouts/dashboard-layout';


interface Contest {
    id: number;
    title: string;
    description: string;
    category: string;
    category_display: string;
    type: string;
    type_display: string;
    status: string;
    status_display: string;
    image?: string;
    start_date: string;
    end_date: string;
    voting_start?: string;
    voting_end?: string;
    entry_fee: number;
    vote_price: number;
    formatted_entry_fee: string;
    formatted_vote_price: string;
    is_free: boolean;
    max_participants?: number;
    total_participants: number;
    total_votes: number;
    total_revenue: number;
    created_at: string;
    creator_name: string;
    is_active: boolean;
    is_voting_open: boolean;
    is_completed: boolean;
    can_accept_participants: boolean;
}

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface DashboardContestsProps {
    user?: {
        name: string;
        email: string;
    };
    stats: Stat[];
    contests: {
        data: Contest[];
        current_page: number;
        last_page: number;
        total: number;
    };
    recentContests: Array<{
        id: number;
        title: string;
        category: string;
        start_date: string;
        status: string;
        creator: string;
        total_votes: number;
    }>;
    contestsByCategory: Record<string, { count: number; revenue: number }>;
    contestsByType: Record<string, number>;
    status: string;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function DashboardContests({ user, stats, contests, recentContests, contestsByCategory, contestsByType, status, filters }: DashboardContestsProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'danger'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);
    const [processingContests, setProcessingContests] = useState<Set<number>>(new Set());
    const [validationErrors, setValidationErrors] = useState<Record<string, string | string[]>>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        short_description: '',
        category: 'innovation',
        type: 'voting',
        start_date: '',
        end_date: '',
        voting_start: '',
        voting_end: '',
        entry_fee: '',
        vote_price: '',
        is_free: false,
        max_participants: '',
        max_votes_per_user: '1',
        prizes: [],
        rules: [],
        criteria: [],
        sponsors: [],
        judges: []
    });

    const [voteData, setVoteData] = useState({
        participant_name: '',
        participant_id: '',
        amount_paid: '',
        payment_method: 'mobile_money',
        transaction_id: '',
        comment: ''
    });
    const [voteValidationErrors, setVoteValidationErrors] = useState<Record<string, string[]>>({});

    const contestCategories = [
        { value: 'innovation', label: 'Innovation', color: '#5FA145', icon: 'bi-lightbulb' },
        { value: 'technology', label: 'Technologie', color: '#4A8A2A', icon: 'bi-cpu' },
        { value: 'entrepreneurship', label: 'Entrepreneuriat', color: '#C69438', icon: 'bi-briefcase' },
        { value: 'education', label: 'Éducation', color: '#C69438', icon: 'bi-book' },
        { value: 'arts', label: 'Arts & Culture', color: '#4D8A3C', icon: 'bi-palette' },
        { value: 'environment', label: 'Environnement', color: '#334E15', icon: 'bi-tree' },
        { value: 'social', label: 'Social', color: '#6366F1', icon: 'bi-people' }
    ];

    const contestTypes = [
        { value: 'voting', label: 'Concours avec vote', color: '#5FA145', icon: 'bi-hand-thumbs-up' },
        { value: 'submission', label: 'Soumission', color: '#C69438', icon: 'bi-file-earmark-plus' },
        { value: 'quiz', label: 'Quiz', color: '#C69438', icon: 'bi-question-circle' },
        { value: 'challenge', label: 'Défi', color: '#4A8A2A', icon: 'bi-trophy' }
    ];

    const getCategoryInfo = (category: string) => {
        return contestCategories.find(c => c.value === category) || contestCategories[0];
    };

    const getTypeInfo = (type: string) => {
        return contestTypes.find(t => t.value === type) || contestTypes[0];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#5FA145';
            case 'voting': return '#C69438';
            case 'draft': return '#6B7280';
            case 'closed': return '#C69438';
            case 'completed': return '#4D8A3C';
            default: return '#6B7280';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showAlert = (message: string, type: 'success' | 'danger' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => setAlertMessage(''), 5000);
    };

    // Fonction pour créer un popover d'erreur
    const createErrorPopover = (fieldName: string) => {
        const errors = validationErrors[fieldName];
        if (!errors || errors.length === 0) return null;

        // S'assurer que errors est un array
        const errorArray = Array.isArray(errors) ? errors : [errors];

        return (
            <Popover id={`popover-${fieldName}`}>
                <Popover.Header as="h3" className="text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Erreur de validation
                </Popover.Header>
                <Popover.Body>
                    <ul className="mb-0 ps-3">
                        {errorArray.map((error, index) => (
                            <li key={index} className="text-danger small">{error}</li>
                        ))}
                    </ul>
                </Popover.Body>
            </Popover>
        );
    };

    // Fonction pour wrapper un champ avec un popover d'erreur
    type ClassStyleProps = { className?: string; style?: React.CSSProperties };
    const withErrorPopover = (fieldName: string, children: React.ReactElement<ClassStyleProps>) => {
        const errors = validationErrors[fieldName];
        const hasError = errors && (Array.isArray(errors) ? errors.length > 0 : true);
        
        if (!hasError) {
            return children;
        }

        return (
            <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="top"
                overlay={createErrorPopover(fieldName)!}
            >
                {React.cloneElement(children, {
                    className: `${children.props.className || ''} is-invalid`,
                    style: {
                        ...children.props.style,
                        borderColor: '#dc3545',
                        boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
                    }
                })}
            </OverlayTrigger>
        );
    };

    // Fonction pour créer un popover d'erreur pour les votes
    const createVoteErrorPopover = (fieldName: string) => {
        const errors = voteValidationErrors[fieldName];
        if (!errors || errors.length === 0) return null;

        // S'assurer que errors est un array
        const errorArray = Array.isArray(errors) ? errors : [errors];

        return (
            <Popover id={`vote-popover-${fieldName}`}>
                <Popover.Header as="h3" className="text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Erreur de validation
                </Popover.Header>
                <Popover.Body>
                    <ul className="mb-0 ps-3">
                        {errorArray.map((error, index) => (
                            <li key={index} className="text-danger small">{error}</li>
                        ))}
                    </ul>
                </Popover.Body>
            </Popover>
        );
    };

    // Fonction pour wrapper un champ vote avec un popover d'erreur
    const withVoteErrorPopover = (fieldName: string, children: React.ReactElement<ClassStyleProps>) => {
        const errors = voteValidationErrors[fieldName];
        const hasError = errors && (Array.isArray(errors) ? errors.length > 0 : true);
        
        if (!hasError) {
            return children;
        }

        return (
            <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="top"
                overlay={createVoteErrorPopover(fieldName)!}
            >
                {React.cloneElement(children, {
                    className: `${children.props.className || ''} is-invalid`,
                    style: {
                        ...children.props.style,
                        borderColor: '#dc3545',
                        boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
                    }
                })}
            </OverlayTrigger>
        );
    };

    const resetFormData = () => {
        setFormData({
            title: '',
            description: '',
            short_description: '',
            category: 'innovation',
            type: 'voting',
            start_date: '',
            end_date: '',
            voting_start: '',
            voting_end: '',
            entry_fee: '',
            vote_price: '',
            is_free: false,
            max_participants: '',
            max_votes_per_user: '1',
            prizes: [],
            rules: [],
            criteria: [],
            sponsors: [],
            judges: []
        });
    };

    const loadContestData = (contest: Contest) => {
        setFormData({
            title: contest.title,
            description: contest.description,
            short_description: '',
            category: contest.category,
            type: contest.type,
            start_date: contest.start_date,
            end_date: contest.end_date,
            voting_start: contest.voting_start || '',
            voting_end: contest.voting_end || '',
            entry_fee: contest.entry_fee.toString(),
            vote_price: contest.vote_price.toString(),
            is_free: contest.is_free,
            max_participants: contest.max_participants?.toString() || '',
            max_votes_per_user: '1',
            prizes: [],
            rules: [],
            criteria: [],
            sponsors: [],
            judges: []
        });
    };

    const handleCreateContest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            router.post('/dashboard/contests', formData, {
                onSuccess: () => {
                    setShowCreateModal(false);
                    resetFormData();
                    setValidationErrors({});
                    showAlert('Concours créé avec succès !');
                },
                onError: (errors) => {
                    console.error('Erreurs de validation:', errors);
                    setValidationErrors(errors || {});
                    showAlert('Veuillez corriger les erreurs de validation (survolez les champs en rouge)', 'danger');
                },
                onFinish: () => setIsLoading(false)
            });
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de la création du concours', 'danger');
            setIsLoading(false);
        }
    };

    const handleEditContest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContest) return;
        
        setIsLoading(true);
        
        try {
            router.put(`/dashboard/contests/${selectedContest.id}`, formData, {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedContest(null);
                    resetFormData();
                    setValidationErrors({});
                    showAlert('Concours mis à jour avec succès !');
                },
                onError: (errors) => {
                    console.error('Erreurs de validation:', errors);
                    setValidationErrors(errors || {});
                    showAlert('Veuillez corriger les erreurs de validation (survolez les champs en rouge)', 'danger');
                },
                onFinish: () => setIsLoading(false)
            });
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de la mise à jour', 'danger');
            setIsLoading(false);
        }
    };

    const handleDeleteContest = async (contest: Contest) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le concours "${contest.title}" ?`)) return;
        
        try {
            router.delete(`/dashboard/contests/${contest.id}`, {
                onSuccess: () => {
                    showAlert('Concours supprimé avec succès !');
                },
                onError: () => {
                    showAlert('Erreur lors de la suppression', 'danger');
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Erreur lors de la suppression', 'danger');
        }
    };

    const handleUpdateStatus = (contest: Contest, newStatus: string) => {
        const contestId = contest.id;
        setProcessingContests(prev => new Set(prev).add(contestId));
        
        router.post(`/dashboard/contests/${contestId}/status`, { status: newStatus }, {
            onSuccess: () => {
                showAlert('Statut du concours mis à jour avec succès');
            },
            onError: (errors: any) => {
                const errorMessage = errors?.error || 'Erreur lors du changement de statut';
                showAlert(errorMessage, 'danger');
            },
            onFinish: () => {
                setProcessingContests(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(contestId);
                    return newSet;
                });
            }
        });
    };

    const handleProcessVote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContest) return;
        
        setIsLoading(true);
        
        router.post(`/dashboard/contests/${selectedContest.id}/vote`, voteData, {
            onSuccess: () => {
                setShowVoteModal(false);
                setSelectedContest(null);
                setVoteData({
                    participant_name: '',
                    participant_id: '',
                    amount_paid: '',
                    payment_method: 'mobile_money',
                    transaction_id: '',
                    comment: ''
                });
                setVoteValidationErrors({});
                showAlert('Vote enregistré avec succès pour ' + voteData.participant_name);
            },
            onError: (errors: any) => {
                console.error('Erreurs de validation votes:', errors);
                if (errors && typeof errors === 'object' && !errors.error) {
                    setVoteValidationErrors(errors);
                    showAlert('Veuillez corriger les erreurs de validation (survolez les champs en rouge)', 'danger');
                } else {
                    const errorMessage = errors?.error || 'Erreur lors de l\'enregistrement du vote';
                    showAlert(errorMessage, 'danger');
                }
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (status !== 'all') params.set('status', status);
        
        window.location.href = `/dashboard/contests?${params.toString()}`;
    };

    return (
        <DashboardLayout title="Gestion des Concours" user={user}>
            <Head title="Dashboard - Concours" />

            {/* Flash Messages - Temporairement désactivé */}

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
                        <i className="bi bi-trophy me-2" style={{ color: '#C69438' }}></i>
                        Gestion des Concours
                    </h2>
                    <p className="text-muted mb-0">
                        Gérez vos concours avec vote payant et suivez leur performance.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="outline-primary"
                        onClick={() => window.open('/dashboard/contests/export', '_blank')}
                        style={{
                            borderColor: '#C69438',
                            color: '#C69438',
                            borderRadius: '10px'
                        }}
                    >
                        <i className="bi bi-download me-2"></i>
                        Export CSV
                    </Button>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                            border: 'none',
                            borderRadius: '10px'
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nouveau Concours
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
                        { key: 'all', label: 'Tous les concours', icon: 'bi-trophy', count: contests.total, href: '/dashboard/contests' },
                        { key: 'active', label: 'Actifs', icon: 'bi-play-circle', href: '/dashboard/contests?status=active' },
                        { key: 'voting', label: 'Vote en cours', icon: 'bi-hand-thumbs-up', href: '/dashboard/contests?status=voting' },
                        { key: 'draft', label: 'Brouillons', icon: 'bi-file-earmark', href: '/dashboard/contests?status=draft' },
                        { key: 'completed', label: 'Terminés', icon: 'bi-check-circle', href: '/dashboard/contests?status=completed' }
                    ].map(tab => (
                        <a
                            key={tab.key}
                            href={tab.href || `/dashboard/contests${tab.key === 'all' || tab.key === 'overview' ? '' : `?status=${tab.key}`}`}
                            className={`nav-link ${status === tab.key || (status === 'all' && tab.key === 'all') ? 'active' : ''}`}
                            style={{
                                background: (status === tab.key || (status === 'all' && tab.key === 'all'))
                                    ? 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)'
                                    : 'transparent',
                                color: (status === tab.key || (status === 'all' && tab.key === 'all')) ? '#FFF' : '#6B7280',
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
                                placeholder="Rechercher par titre, catégorie, type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ borderRadius: '10px 0 0 10px' }}
                            />
                            <Button 
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
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
                                    <i className="bi bi-trophy me-2"></i>
                                    Concours Récents
                                </h5>
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead style={{ background: '#F8F9FA' }}>
                                            <tr>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Concours</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Type</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Statut</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Votes</th>
                                                <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contests.data.slice(0, 5).map(contest => {
                                                const categoryInfo = getCategoryInfo(contest.category);
                                                const typeInfo = getTypeInfo(contest.type);
                                                return (
                                                    <tr key={contest.id}>
                                                        <td className="border-0">
                                                            <div className="d-flex align-items-center">
                                                                <div 
                                                                    className="rounded me-3 d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        background: `${categoryInfo.color}20`,
                                                                        color: categoryInfo.color
                                                                    }}
                                                                >
                                                                    <i className={categoryInfo.icon}></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                                        {contest.title}
                                                                    </div>
                                                                    <small style={{ color: '#6B7280' }}>
                                                                        {categoryInfo.label} • {contest.start_date}
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
                                                            <Badge 
                                                                style={{ 
                                                                    background: getStatusColor(contest.status),
                                                                    fontSize: '0.75rem'
                                                                }}
                                                            >
                                                                {contest.status_display}
                                                            </Badge>
                                                        </td>
                                                        <td className="border-0">
                                                            <div>
                                                                <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                                    {contest.total_votes}
                                                                </div>
                                                                <small style={{ color: '#6B7280' }}>
                                                                    {contest.formatted_vote_price} / vote
                                                                </small>
                                                            </div>
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
                                                                            setSelectedContest(contest);
                                                                            setShowDetailModal(true);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-eye me-2"></i>Voir détails
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item 
                                                                        onClick={() => {
                                                                            setSelectedContest(contest);
                                                                            loadContestData(contest);
                                                                            setShowEditModal(true);
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-pencil me-2"></i>Modifier
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item 
                                                                        onClick={() => {
                                                                            setSelectedContest(contest);
                                                                            setVoteData(prev => ({ ...prev, amount_paid: contest.vote_price.toString() }));
                                                                            setShowVoteModal(true);
                                                                        }}
                                                                        style={{ color: '#C69438' }}
                                                                        disabled={!contest.is_voting_open}
                                                                    >
                                                                        <i className="bi bi-hand-thumbs-up me-2"></i>Enregistrer un vote
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item 
                                                                        onClick={() => handleUpdateStatus(contest, contest.status === 'active' ? 'voting' : 'active')}
                                                                        style={{ color: contest.status === 'active' ? '#C69438' : '#5FA145' }}
                                                                        disabled={processingContests.has(contest.id)}
                                                                    >
                                                                        {processingContests.has(contest.id) ? (
                                                                            <>
                                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                                Traitement...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className={`bi bi-${contest.status === 'active' ? 'hand-thumbs-up' : 'play'} me-2`}></i>
                                                                                {contest.status === 'active' ? 'Ouvrir le vote' : 'Activer'}
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
                                        href="/dashboard/contests"
                                        variant="outline-primary"
                                        style={{ borderColor: '#C69438', color: '#C69438', borderRadius: '10px' }}
                                    >
                                        Voir tous les concours
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Row className="g-4">
                            <Col xs={12}>
                                <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                                    <Card.Body className="p-4">
                                        <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                            <i className="bi bi-pie-chart me-2"></i>
                                            Par Catégorie
                                        </h6>
                                        <div className="categories-chart">
                                            {Object.entries(contestsByCategory).map(([category, data]) => {
                                                const categoryInfo = getCategoryInfo(category);
                                                const percentage = Math.round((data.count / contests.total) * 100);
                                                
                                                return (
                                                    <div key={category} className="mb-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <div className="d-flex align-items-center">
                                                                <div 
                                                                    className="rounded me-2"
                                                                    style={{
                                                                        width: '12px',
                                                                        height: '12px',
                                                                        background: categoryInfo.color
                                                                    }}
                                                                />
                                                                <span className="fw-semibold" style={{ color: '#1F2937', fontSize: '0.9rem' }}>
                                                                    {categoryInfo.label}
                                                                </span>
                                                            </div>
                                                            <div className="text-end">
                                                                <div className="fw-bold" style={{ color: categoryInfo.color }}>
                                                                    {data.count}
                                                                </div>
                                                                <small style={{ color: '#6B7280' }}>
                                                                    {percentage}%
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div 
                                                            className="progress rounded-pill" 
                                                            style={{ 
                                                                height: '6px',
                                                                backgroundColor: `${categoryInfo.color}20`
                                                            }}
                                                        >
                                                            <div 
                                                                className="progress-bar rounded-pill"
                                                                style={{ 
                                                                    backgroundColor: categoryInfo.color,
                                                                    width: `${percentage}%`,
                                                                    transition: 'width 0.3s ease'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xs={12}>
                                <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                                    <Card.Body className="p-4">
                                        <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                            <i className="bi bi-bar-chart me-2"></i>
                                            Par Type
                                        </h6>
                                        <div className="types-chart">
                                            {Object.entries(contestsByType).map(([type, count]) => {
                                                const typeInfo = getTypeInfo(type);
                                                const percentage = Math.round((count / contests.total) * 100);
                                                
                                                return (
                                                    <div key={type} className="d-flex justify-content-between align-items-center py-2">
                                                        <div className="d-flex align-items-center">
                                                            <i className={`${typeInfo.icon} me-2`} style={{ color: typeInfo.color }}></i>
                                                            <span className="fw-semibold" style={{ color: '#1F2937', fontSize: '0.9rem' }}>
                                                                {typeInfo.label}
                                                            </span>
                                                        </div>
                                                        <div className="text-end">
                                                            <div className="fw-bold" style={{ color: typeInfo.color }}>
                                                                {count}
                                                            </div>
                                                            <small style={{ color: '#6B7280' }}>
                                                                {percentage}%
                                                            </small>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}

            {/* All Contests List */}
            {status !== 'overview' && (
                <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                <i className="bi bi-trophy me-2"></i>
                                {status === 'all' ? 'Tous les concours' : 
                                 status === 'active' ? 'Concours actifs' :
                                 status === 'voting' ? 'Vote en cours' :
                                 status === 'draft' ? 'Brouillons' :
                                 status === 'completed' ? 'Concours terminés' : 'Concours'}
                                <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.8rem' }}>
                                    {contests.total}
                                </Badge>
                            </h5>
                        </div>
                        
                        <Row className="g-4">
                            {contests.data.map(contest => {
                                const categoryInfo = getCategoryInfo(contest.category);
                                const typeInfo = getTypeInfo(contest.type);
                                return (
                                    <Col lg={4} md={6} key={contest.id}>
                                        <Card 
                                            className="border-0 h-100"
                                            style={{
                                                borderRadius: '15px',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            {contest.image && (
                                                <div 
                                                    style={{
                                                        height: '200px',
                                                        backgroundImage: `url(${contest.image})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        borderRadius: '15px 15px 0 0'
                                                    }}
                                                />
                                            )}
                                            <Card.Body className="p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div className="d-flex gap-2">
                                                        <Badge 
                                                            style={{ 
                                                                background: categoryInfo.color,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            <i className={`${categoryInfo.icon} me-1`}></i>
                                                            {categoryInfo.label}
                                                        </Badge>
                                                        <Badge 
                                                            style={{ 
                                                                background: typeInfo.color,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            {typeInfo.label}
                                                        </Badge>
                                                    </div>
                                                    <Badge 
                                                        style={{ 
                                                            background: getStatusColor(contest.status),
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {contest.status_display}
                                                    </Badge>
                                                </div>
                                                
                                                <h6 className="fw-bold mb-2" style={{ color: '#1F2937' }}>
                                                    {contest.title}
                                                </h6>
                                                
                                                <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                                    {contest.description}
                                                </p>
                                                
                                                <div className="mb-3">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="bi bi-calendar me-2" style={{ color: '#6B7280' }}></i>
                                                        <small style={{ color: '#6B7280' }}>
                                                            {contest.start_date} - {contest.end_date}
                                                        </small>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="bi bi-hand-thumbs-up me-2" style={{ color: '#6B7280' }}></i>
                                                        <small style={{ color: '#6B7280' }}>
                                                            {contest.total_votes} votes • {contest.formatted_vote_price}
                                                        </small>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-people me-2" style={{ color: '#6B7280' }}></i>
                                                        <small style={{ color: '#6B7280' }}>
                                                            {contest.total_participants} participants
                                                        </small>
                                                    </div>
                                                </div>
                                                
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedContest(contest);
                                                            setShowDetailModal(true);
                                                        }}
                                                        style={{ 
                                                            borderColor: '#C69438', 
                                                            color: '#C69438',
                                                            borderRadius: '8px',
                                                            flex: 1
                                                        }}
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        Voir
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedContest(contest);
                                                            loadContestData(contest);
                                                            setShowEditModal(true);
                                                        }}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            flex: 1
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>
                                                        Modifier
                                                    </Button>
                                                    <Dropdown>
                                                        <Dropdown.Toggle 
                                                            variant="outline-secondary" 
                                                            size="sm"
                                                            style={{ 
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            <i className="bi bi-three-dots"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item 
                                                                onClick={() => {
                                                                    setSelectedContest(contest);
                                                                    setVoteData(prev => ({ ...prev, amount_paid: contest.vote_price.toString() }));
                                                                    setShowVoteModal(true);
                                                                }}
                                                                disabled={!contest.is_voting_open}
                                                            >
                                                                <i className="bi bi-hand-thumbs-up me-2"></i>Enregistrer vote
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item 
                                                                onClick={() => handleUpdateStatus(contest, 'completed')}
                                                                style={{ color: '#4D8A3C' }}
                                                                disabled={processingContests.has(contest.id)}
                                                            >
                                                                {processingContests.has(contest.id) ? (
                                                                    <>
                                                                        <Spinner animation="border" size="sm" className="me-2" />
                                                                        Traitement...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-check-circle me-2"></i>Terminer
                                                                    </>
                                                                )}
                                                            </Dropdown.Item>
                                                            <Dropdown.Item 
                                                                onClick={() => handleDeleteContest(contest)}
                                                                style={{ color: '#DC2626' }}
                                                            >
                                                                <i className="bi bi-trash me-2"></i>Supprimer
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>

                        {/* Pagination */}
                        {contests.last_page > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        {Array.from({ length: contests.last_page }, (_, i) => i + 1).map(page => (
                                            <li key={page} className={`page-item ${page === contests.current_page ? 'active' : ''}`}>
                                                <a 
                                                    className="page-link" 
                                                    href={`/dashboard/contests?page=${page}${status !== 'all' ? `&status=${status}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}`}
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

            {/* Create Contest Modal */}
            <Modal show={showCreateModal} onHide={() => { setShowCreateModal(false); setValidationErrors({}); }} size="lg" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Nouveau Concours
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleCreateContest}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Titre *</Form.Label>
                                    {withErrorPopover('title', 
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Catégorie *</Form.Label>
                                    {withErrorPopover('category',
                                        <Form.Select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        >
                                            {contestCategories.map(category => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Type *</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        style={{ borderRadius: '8px' }}
                                    >
                                        {contestTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Participants max</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="max_participants"
                                        value={formData.max_participants}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Description *</Form.Label>
                                    {withErrorPopover('description',
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Date de début *</Form.Label>
                                    {withErrorPopover('start_date',
                                        <Form.Control
                                            type="datetime-local"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Date de fin *</Form.Label>
                                    {withErrorPopover('end_date',
                                        <Form.Control
                                            type="datetime-local"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleInputChange}
                                            required
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Début des votes</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="voting_start"
                                        value={formData.voting_start}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Fin des votes</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="voting_end"
                                        value={formData.voting_end}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Frais d'inscription (XAF)</Form.Label>
                                    {withErrorPopover('entry_fee',
                                        <Form.Control
                                            type="number"
                                            name="entry_fee"
                                            value={formData.entry_fee}
                                            onChange={handleInputChange}
                                            disabled={formData.is_free}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Prix par vote (XAF)</Form.Label>
                                    {withErrorPopover('vote_price',
                                        <Form.Control
                                            type="number"
                                            name="vote_price"
                                            value={formData.vote_price}
                                            onChange={handleInputChange}
                                            disabled={formData.is_free}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Votes max/utilisateur</Form.Label>
                                    {withErrorPopover('max_votes_per_user',
                                        <Form.Control
                                            type="number"
                                            name="max_votes_per_user"
                                            value={formData.max_votes_per_user}
                                            onChange={handleInputChange}
                                            min="1"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        label="Concours gratuit (pas de frais d'inscription ni de vote)"
                                        name="is_free"
                                        checked={formData.is_free}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_free: e.target.checked }))}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => { setShowCreateModal(false); setValidationErrors({}); }}
                                style={{ borderRadius: '8px' }}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Création...
                                    </>
                                ) : (
                                    'Créer le concours'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Contest Modal */}
            <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setValidationErrors({}); }} size="lg" centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-pencil me-2"></i>
                        Modifier le Concours
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedContest && (
                        <Form onSubmit={handleEditContest}>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Titre *</Form.Label>
                                        {withErrorPopover('title', 
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Catégorie *</Form.Label>
                                        {withErrorPopover('category',
                                            <Form.Select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            >
                                                {contestCategories.map(category => (
                                                    <option key={category.value} value={category.value}>
                                                        {category.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Description *</Form.Label>
                                        {withErrorPopover('description',
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Date de début *</Form.Label>
                                        {withErrorPopover('start_date',
                                            <Form.Control
                                                type="datetime-local"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Date de fin *</Form.Label>
                                        {withErrorPopover('end_date',
                                            <Form.Control
                                                type="datetime-local"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Début des votes</Form.Label>
                                        {withErrorPopover('voting_start',
                                            <Form.Control
                                                type="datetime-local"
                                                name="voting_start"
                                                value={formData.voting_start}
                                                onChange={handleInputChange}
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Fin des votes</Form.Label>
                                        {withErrorPopover('voting_end',
                                            <Form.Control
                                                type="datetime-local"
                                                name="voting_end"
                                                value={formData.voting_end}
                                                onChange={handleInputChange}
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Frais d'inscription (XAF)</Form.Label>
                                        {withErrorPopover('entry_fee',
                                            <Form.Control
                                                type="number"
                                                name="entry_fee"
                                                value={formData.entry_fee}
                                                onChange={handleInputChange}
                                                disabled={formData.is_free}
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Prix par vote (XAF)</Form.Label>
                                        {withErrorPopover('vote_price',
                                            <Form.Control
                                                type="number"
                                                name="vote_price"
                                                value={formData.vote_price}
                                                onChange={handleInputChange}
                                                disabled={formData.is_free}
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">Votes max/utilisateur</Form.Label>
                                        {withErrorPopover('max_votes_per_user',
                                            <Form.Control
                                                type="number"
                                                name="max_votes_per_user"
                                                value={formData.max_votes_per_user}
                                                onChange={handleInputChange}
                                                min="1"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group className="d-flex align-items-center">
                                        <Form.Check
                                            type="checkbox"
                                            label="Concours gratuit (pas de frais d'inscription ni de vote)"
                                            name="is_free"
                                            checked={formData.is_free}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_free: e.target.checked }))}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => { setShowEditModal(false); setValidationErrors({}); }}
                                    style={{ borderRadius: '8px' }}
                                    disabled={isLoading}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
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
                    )}
                </Modal.Body>
            </Modal>

            {/* Vote Modal */}
            <Modal show={showVoteModal} onHide={() => { setShowVoteModal(false); setVoteValidationErrors({}); }} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <Modal.Title style={{ color: '#334E15' }}>
                        <i className="bi bi-hand-thumbs-up me-2"></i>
                        Enregistrer un Vote
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedContest && (
                        <>
                            <div className="text-center mb-4">
                                <h5>Concours: {selectedContest.title}</h5>
                                <small className="text-muted">
                                    Prix du vote: {selectedContest.formatted_vote_price}
                                </small>
                            </div>
                            <Form onSubmit={handleProcessVote}>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Nom du participant *</Form.Label>
                                            {withVoteErrorPopover('participant_name',
                                                <Form.Control
                                                    type="text"
                                                    value={voteData.participant_name}
                                                    onChange={(e) => setVoteData(prev => ({ ...prev, participant_name: e.target.value }))}
                                                    required
                                                    style={{ borderRadius: '8px' }}
                                                    placeholder="Nom du candidat pour qui voter"
                                                />
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Montant payé (XAF) *</Form.Label>
                                            {withVoteErrorPopover('amount_paid',
                                                <Form.Control
                                                    type="number"
                                                    value={voteData.amount_paid}
                                                    onChange={(e) => setVoteData(prev => ({ ...prev, amount_paid: e.target.value }))}
                                                    required
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Méthode de paiement *</Form.Label>
                                            {withVoteErrorPopover('payment_method',
                                                <Form.Select
                                                    value={voteData.payment_method}
                                                    onChange={(e) => setVoteData(prev => ({ ...prev, payment_method: e.target.value }))}
                                                    required
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    <option value="mobile_money">Mobile Money</option>
                                                    <option value="bank_transfer">Virement bancaire</option>
                                                    <option value="cash">Espèces</option>
                                                    <option value="card">Carte bancaire</option>
                                                </Form.Select>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">ID de transaction</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={voteData.transaction_id}
                                                onChange={(e) => setVoteData(prev => ({ ...prev, transaction_id: e.target.value }))}
                                                style={{ borderRadius: '8px' }}
                                                placeholder="Référence de la transaction"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">Commentaire</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={voteData.comment}
                                                onChange={(e) => setVoteData(prev => ({ ...prev, comment: e.target.value }))}
                                                style={{ borderRadius: '8px' }}
                                                placeholder="Commentaire optionnel..."
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => { setShowVoteModal(false); setVoteValidationErrors({}); }}
                                        style={{ borderRadius: '8px' }}
                                        disabled={isLoading}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        style={{
                                            background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                                            border: 'none',
                                            borderRadius: '8px'
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Enregistrer le vote
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
}
