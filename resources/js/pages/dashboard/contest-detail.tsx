import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Badge, Button, Table, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface ContestDetail {
    id: number;
    title: string;
    description: string;
    short_description?: string;
    category: string;
    category_display: string;
    type: string;
    type_display: string;
    status: string;
    status_display: string;
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
    prizes?: any[];
    rules?: string[];
    criteria?: any[];
    sponsors?: any[];
    judges?: any[];
    created_at: string;
    creator_name: string;
    is_active: boolean;
    is_voting_open: boolean;
    is_completed: boolean;
    can_accept_participants: boolean;
}

interface Vote {
    id: number;
    participant_name: string;
    participant_id: string;
    amount_paid: number;
    payment_status: string;
    payment_method: string;
    comment?: string;
    voted_at: string;
    voter_name?: string;
}

interface ContestDetailProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    contest: ContestDetail;
    votes: Vote[];
    voteStats: {
        total: number;
        paid: number;
        revenue: number;
        avg_per_participant: number;
    };
    recentVotes: Vote[];
    topParticipants: Array<{
        name: string;
        votes: number;
        revenue: number;
    }>;
}

export default function ContestDetail({ user, contest, votes, voteStats, recentVotes, topParticipants }: ContestDetailProps) {
    const { t } = useTranslation();
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState(contest.status);
    const [voteData, setVoteData] = useState({
        participant_name: '',
        participant_id: '',
        amount_paid: contest.vote_price.toString(),
        payment_method: 'mobile_money',
        comment: ''
    });
    const [alert, setAlert] = useState<{type: 'success' | 'danger', message: string} | null>(null);

    const getStatusBadge = (status: string, statusDisplay: string) => {
        const variants: any = {
            'active': 'success',
            'voting': 'warning',
            'completed': 'info',
            'draft': 'secondary',
            'cancelled': 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{statusDisplay}</Badge>;
    };

    const getCategoryBadge = (category: string, categoryDisplay: string) => {
        const colors: any = {
            'innovation': 'primary',
            'entrepreneurship': 'success',
            'environment': 'info',
            'arts': 'warning',
            'education': 'secondary',
            'technology': 'dark',
            'social': 'light'
        };
        return <Badge bg={colors[category] || 'secondary'}>{categoryDisplay}</Badge>;
    };

    const getPaymentStatusBadge = (status: string) => {
        const variants: any = {
            'paid': 'success',
            'pending': 'warning',
            'failed': 'danger'
        };
        const labels: any = {
            'paid': 'Payé',
            'pending': 'En attente',
            'failed': 'Échoué'
        };
        return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    const handleVoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/dashboard/contests/${contest.id}/vote`, voteData, {
            onSuccess: () => {
                setShowVoteModal(false);
                setVoteData({
                    participant_name: '',
                    participant_id: '',
                    amount_paid: contest.vote_price.toString(),
                    payment_method: 'mobile_money',
                    comment: ''
                });
                setAlert({type: 'success', message: 'Vote enregistré avec succès'});
            },
            onError: () => {
                setAlert({type: 'danger', message: 'Erreur lors de l\'enregistrement du vote'});
            }
        });
    };

    const handleStatusChange = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/dashboard/contests/${contest.id}/status`, { status: newStatus }, {
            onSuccess: () => {
                setShowStatusModal(false);
                setAlert({type: 'success', message: 'Statut mis à jour avec succès'});
            },
            onError: () => {
                setAlert({type: 'danger', message: 'Erreur lors de la mise à jour du statut'});
            }
        });
    };

    const handleExport = () => {
        router.get(`/dashboard/contests/export?contest=${contest.id}`);
    };

    const handleViewAnalytics = () => {
        router.get(`/dashboard/contests/${contest.id}/votes-analytics`);
    };

    return (
        <DashboardLayout title={contest.title} user={user}>
            <div className="contest-detail-page">
                {/* Header */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-decoration-none"
                                            onClick={() => router.get('/dashboard/contests')}
                                        >
                                            Concours
                                        </Button>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {contest.title}
                                    </li>
                                </ol>
                            </nav>
                            <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                {contest.title}
                            </h2>
                            <p className="text-muted mb-0">
                                Créé par {contest.creator_name} • {contest.created_at}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            {contest.is_voting_open && (
                                <Button 
                                    variant="outline-success"
                                    onClick={() => setShowVoteModal(true)}
                                >
                                    <i className="bi bi-hand-thumbs-up me-2"></i>
                                    Ajouter un vote
                                </Button>
                            )}
                            <Button 
                                variant="outline-primary"
                                onClick={handleViewAnalytics}
                            >
                                <i className="bi bi-graph-up me-2"></i>
                                Analytics
                            </Button>
                            <Button 
                                variant="outline-secondary"
                                onClick={handleExport}
                            >
                                <i className="bi bi-download me-2"></i>
                                Exporter
                            </Button>
                            <Button 
                                variant="outline-warning"
                                onClick={() => setShowStatusModal(true)}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Changer statut
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <Alert 
                        variant={alert.type} 
                        onClose={() => setAlert(null)} 
                        dismissible
                        className="mb-4"
                    >
                        {alert.message}
                    </Alert>
                )}

                {/* Contest Info */}
                <Row className="mb-4">
                    <Col lg={8}>
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex gap-2">
                                        {getStatusBadge(contest.status, contest.status_display)}
                                        {getCategoryBadge(contest.category, contest.category_display)}
                                        <Badge bg="info">{contest.type_display}</Badge>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold fs-5" style={{ color: '#C69438' }}>
                                            {contest.formatted_vote_price}
                                        </div>
                                        <small className="text-muted">Prix par vote</small>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Description</h5>
                                    <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                        {contest.description}
                                    </p>
                                </div>

                                <Row>
                                    <Col md={6}>
                                        <h6 className="fw-semibold mb-3">Informations du concours</h6>
                                        <div className="mb-2">
                                            <i className="bi bi-calendar3 me-2 text-muted"></i>
                                            <strong>Début:</strong> {contest.start_date}
                                        </div>
                                        <div className="mb-2">
                                            <i className="bi bi-calendar-x me-2 text-muted"></i>
                                            <strong>Fin:</strong> {contest.end_date}
                                        </div>
                                        {contest.voting_start && (
                                            <div className="mb-2">
                                                <i className="bi bi-hand-thumbs-up me-2 text-muted"></i>
                                                <strong>Votes du:</strong> {contest.voting_start}
                                            </div>
                                        )}
                                        {contest.voting_end && (
                                            <div className="mb-2">
                                                <i className="bi bi-hand-thumbs-down me-2 text-muted"></i>
                                                <strong>Votes au:</strong> {contest.voting_end}
                                            </div>
                                        )}
                                        <div className="mb-2">
                                            <i className="bi bi-currency-euro me-2 text-muted"></i>
                                            <strong>Frais d'inscription:</strong> {contest.formatted_entry_fee}
                                        </div>
                                        {contest.max_participants && (
                                            <div className="mb-2">
                                                <i className="bi bi-people me-2 text-muted"></i>
                                                <strong>Participants max:</strong> {contest.max_participants}
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        {contest.prizes && contest.prizes.length > 0 && (
                                            <div className="mb-4">
                                                <h6 className="fw-semibold mb-3">Prix à gagner</h6>
                                                {contest.prizes.map((prize, index) => (
                                                    <div key={index} className="mb-2">
                                                        <div className="fw-medium text-warning">
                                                            <i className="bi bi-trophy me-1"></i>
                                                            {prize.position}
                                                        </div>
                                                        <div className="fw-bold">{prize.amount}</div>
                                                        <small className="text-muted">{prize.description}</small>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Col>
                                </Row>

                                {contest.rules && contest.rules.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Règlement</h6>
                                        <ul className="list-unstyled">
                                            {contest.rules.map((rule, index) => (
                                                <li key={index} className="mb-1">
                                                    <i className="bi bi-check-circle text-success me-2"></i>
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {contest.criteria && contest.criteria.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Critères d'évaluation</h6>
                                        <div className="row">
                                            {contest.criteria.map((criterion, index) => (
                                                <div key={index} className="col-md-6 mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className="fw-medium">{criterion.name}</div>
                                                            <small className="text-muted">{criterion.description}</small>
                                                        </div>
                                                        <Badge bg="primary">{criterion.weight}%</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {contest.judges && contest.judges.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Jury</h6>
                                        <div className="row">
                                            {contest.judges.map((judge, index) => (
                                                <div key={index} className="col-md-6 mb-3">
                                                    <div className="fw-medium">{judge.name}</div>
                                                    <div className="text-muted">{judge.title}</div>
                                                    <small className="text-muted">{judge.bio}</small>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {contest.sponsors && contest.sponsors.length > 0 && (
                                    <div className="mt-4">
                                        <h6 className="fw-semibold mb-3">Partenaires</h6>
                                        <div className="row">
                                            {contest.sponsors.map((sponsor, index) => (
                                                <div key={index} className="col-md-4 mb-2">
                                                    <div className="fw-medium">{sponsor.name}</div>
                                                    {sponsor.website && (
                                                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none small">
                                                            <i className="bi bi-link-45deg me-1"></i>
                                                            Site web
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Stats */}
                        <Card className="border-0 mb-4" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-semibold mb-3">Statistiques</h6>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Participants</span>
                                        <span className="fw-bold">{contest.total_participants}</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Total votes</span>
                                        <span className="fw-bold">{contest.total_votes}</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Revenus votes</span>
                                        <span className="fw-bold text-success">
                                            {contest.total_revenue.toLocaleString()} XAF
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Moyenne/participant</span>
                                        <span className="fw-bold">
                                            {voteStats.avg_per_participant.toFixed(1)} votes
                                        </span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Top Participants */}
                        {topParticipants.length > 0 && (
                            <Card className="border-0 mb-4" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <h6 className="fw-semibold mb-3">Top Participants</h6>
                                    
                                    {topParticipants.map((participant, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center">
                                                <Badge 
                                                    bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'light'}
                                                    className="me-2"
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <span className="fw-medium">{participant.name}</span>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold">{participant.votes} votes</div>
                                                <small className="text-success">
                                                    {participant.revenue.toLocaleString()} XAF
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                <h6 className="fw-semibold mb-3">Actions rapides</h6>
                                
                                <div className="d-grid gap-2">
                                    {contest.is_voting_open && (
                                        <Button 
                                            variant="outline-success" 
                                            size="sm"
                                            onClick={() => setShowVoteModal(true)}
                                        >
                                            <i className="bi bi-hand-thumbs-up me-2"></i>
                                            Ajouter un vote
                                        </Button>
                                    )}
                                    
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={handleViewAnalytics}
                                    >
                                        <i className="bi bi-graph-up me-2"></i>
                                        Voir les analytics
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={handleExport}
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Export CSV
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Votes */}
                <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0" style={{ color: '#1F2937' }}>
                                Votes récents
                            </h5>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={handleViewAnalytics}
                            >
                                Voir analytics
                            </Button>
                        </div>
                        
                        <div className="table-responsive">
                            <Table className="mb-0">
                                <thead style={{ backgroundColor: '#F8F9FA' }}>
                                    <tr>
                                        <th className="border-0 fw-semibold text-muted py-3">Participant</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Votant</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Montant</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Paiement</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Commentaire</th>
                                        <th className="border-0 fw-semibold text-muted py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentVotes.length > 0 ? (
                                        recentVotes.map((vote) => (
                                            <tr key={vote.id}>
                                                <td className="py-3">
                                                    <div className="fw-medium">{vote.participant_name}</div>
                                                    <small className="text-muted">ID: {vote.participant_id}</small>
                                                </td>
                                                <td className="py-3">
                                                    <span className="fw-medium">{vote.voter_name || 'Anonyme'}</span>
                                                </td>
                                                <td className="py-3">
                                                    <span className="fw-medium">
                                                        {vote.amount_paid.toLocaleString()} XAF
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {getPaymentStatusBadge(vote.payment_status)}
                                                    <br />
                                                    <small className="text-muted">{vote.payment_method}</small>
                                                </td>
                                                <td className="py-3">
                                                    <small className="text-muted">
                                                        {vote.comment || '—'}
                                                    </small>
                                                </td>
                                                <td className="py-3">
                                                    <small className="text-muted">{vote.voted_at}</small>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-hand-thumbs-up mb-2" style={{ fontSize: '2rem' }}></i>
                                                    <p className="mb-0">Aucun vote pour ce concours.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>

                {/* Vote Modal */}
                <Modal show={showVoteModal} onHide={() => setShowVoteModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un vote</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleVoteSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nom du participant *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nom complet du participant"
                                            value={voteData.participant_name}
                                            onChange={(e) => setVoteData({...voteData, participant_name: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>ID Participant *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Identifiant du participant"
                                            value={voteData.participant_id}
                                            onChange={(e) => setVoteData({...voteData, participant_id: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Montant (XAF) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={voteData.amount_paid}
                                            onChange={(e) => setVoteData({...voteData, amount_paid: e.target.value})}
                                            min="0"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Moyen de paiement *</Form.Label>
                                        <Form.Select
                                            value={voteData.payment_method}
                                            onChange={(e) => setVoteData({...voteData, payment_method: e.target.value})}
                                            required
                                        >
                                            <option value="mobile_money">Mobile Money</option>
                                            <option value="bank_transfer">Virement bancaire</option>
                                            <option value="card">Carte bancaire</option>
                                            <option value="cash">Espèces</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Commentaire</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Commentaire ou message de soutien (optionnel)"
                                    value={voteData.comment}
                                    onChange={(e) => setVoteData({...voteData, comment: e.target.value})}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={() => setShowVoteModal(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="success">
                                <i className="bi bi-hand-thumbs-up me-2"></i>
                                Enregistrer le vote
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* Status Modal */}
                <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Changer le statut</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleStatusChange}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Nouveau statut</Form.Label>
                                <Form.Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    required
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="active">Actif (inscriptions ouvertes)</option>
                                    <option value="voting">Phase de vote</option>
                                    <option value="completed">Terminé</option>
                                    <option value="cancelled">Annulé</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={() => setShowStatusModal(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="primary">
                                Mettre à jour
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </DashboardLayout>
    );
}