import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, Table, Modal, Alert } from 'react-bootstrap';
import { Member, MemberSegment, SegmentCriteria, NotificationCampaign, DefaultSegments } from '@/types/member-segmentation';

interface MemberSegmentationProps {
    members: Member[];
    segments: MemberSegment[];
    onCreateSegment: (segment: Partial<MemberSegment>) => void;
    onCreateCampaign: (campaign: Partial<NotificationCampaign>) => void;
}

export function MemberSegmentation({ members, segments, onCreateSegment, onCreateCampaign }: MemberSegmentationProps) {
    const [activeTab, setActiveTab] = useState<'segments' | 'campaigns'>('segments');
    const [showSegmentModal, setShowSegmentModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState<string>('');
    const [segmentPreview, setSegmentPreview] = useState<Member[]>([]);
    
    const [segmentForm, setSegmentForm] = useState<Partial<MemberSegment>>({
        name: '',
        description: '',
        criteria: {
            profile_types: [],
            skills: [],
            interests: [],
            cities: [],
        }
    });

    const [campaignForm, setCampaignForm] = useState<Partial<NotificationCampaign>>({
        title: '',
        message: '',
        type: 'info',
        channels: ['email'],
        target_segments: []
    });

    // Fonction pour filtrer les membres selon les critères
    const filterMembers = (criteria: SegmentCriteria): Member[] => {
        return members.filter(member => {
            // Filtre par type de profil
            if (criteria.profile_types && criteria.profile_types.length > 0) {
                if (!criteria.profile_types.includes(member.profile_type)) return false;
            }

            // Filtre par compétences
            if (criteria.skills && criteria.skills.length > 0) {
                const hasMatchingSkill = criteria.skills.some(skill => 
                    member.skills.includes(skill)
                );
                if (!hasMatchingSkill) return false;
            }

            // Filtre par centres d'intérêt
            if (criteria.interests && criteria.interests.length > 0) {
                const hasMatchingInterest = criteria.interests.some(interest => 
                    member.interests.includes(interest)
                );
                if (!hasMatchingInterest) return false;
            }

            // Filtre par ville
            if (criteria.cities && criteria.cities.length > 0) {
                if (!criteria.cities.includes(member.city)) return false;
            }

            // Filtre par score de participation
            if (criteria.participation_score_range) {
                const { min, max } = criteria.participation_score_range;
                if (member.participation_score < min || member.participation_score > max) return false;
            }

            return true;
        });
    };

    // Met à jour la preview quand les critères changent
    useEffect(() => {
        if (segmentForm.criteria) {
            const preview = filterMembers(segmentForm.criteria);
            setSegmentPreview(preview);
        }
    }, [segmentForm.criteria, members]);

    const handleCreateSegment = () => {
        if (segmentForm.name && segmentForm.criteria) {
            const newSegment = {
                ...segmentForm,
                id: `segment_${Date.now()}`,
                member_count: segmentPreview.length,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            onCreateSegment(newSegment);
            setShowSegmentModal(false);
            setSegmentForm({
                name: '',
                description: '',
                criteria: { profile_types: [], skills: [], interests: [], cities: [] }
            });
        }
    };

    const handleCreateCampaign = () => {
        if (campaignForm.title && campaignForm.message && campaignForm.target_segments) {
            const totalRecipients = campaignForm.target_segments!.reduce((total, segmentId) => {
                const segment = segments.find(s => s.id === segmentId);
                return total + (segment?.member_count || 0);
            }, 0);

            const newCampaign = {
                ...campaignForm,
                id: `campaign_${Date.now()}`,
                status: 'draft' as const,
                stats: {
                    total_recipients: totalRecipients,
                    delivered: 0,
                    opened: 0,
                    clicked: 0,
                    unsubscribed: 0
                },
                created_at: new Date().toISOString(),
                created_by: 'current_user' // À remplacer par l'utilisateur connecté
            };
            onCreateCampaign(newCampaign);
            setShowCampaignModal(false);
            setCampaignForm({
                title: '',
                message: '',
                type: 'info',
                channels: ['email'],
                target_segments: []
            });
        }
    };

    const skillsOptions = [
        'Communication', 'Marketing digital', 'Gestion de projet', 'Formation/Éducation',
        'Comptabilité/Finance', 'Développement web', 'Design graphique', 'Photographie'
    ];

    const interestOptions = [
        'Éducation et formation', 'Environnement et développement durable',
        'Santé et bien-être', 'Inclusion sociale', 'Entrepreneuriat social'
    ];

    return (
        <div>
            {/* En-tête avec statistiques */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center border-0 bg-primary bg-opacity-10">
                        <Card.Body>
                            <i className="bi bi-people text-primary fs-1 mb-2"></i>
                            <h4 className="text-primary mb-1">{members.length}</h4>
                            <small className="text-muted">Membres totaux</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center border-0 bg-success bg-opacity-10">
                        <Card.Body>
                            <i className="bi bi-diagram-3 text-success fs-1 mb-2"></i>
                            <h4 className="text-success mb-1">{segments.length}</h4>
                            <small className="text-muted">Segments créés</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center border-0 bg-warning bg-opacity-10">
                        <Card.Body>
                            <i className="bi bi-bell text-warning fs-1 mb-2"></i>
                            <h4 className="text-warning mb-1">12</h4>
                            <small className="text-muted">Campagnes actives</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center border-0 bg-info bg-opacity-10">
                        <Card.Body>
                            <i className="bi bi-graph-up text-info fs-1 mb-2"></i>
                            <h4 className="text-info mb-1">87%</h4>
                            <small className="text-muted">Taux d'engagement</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Navigation par onglets */}
            <div className="mb-4">
                <Button
                    variant={activeTab === 'segments' ? 'primary' : 'outline-primary'}
                    className="me-2"
                    onClick={() => setActiveTab('segments')}
                >
                    <i className="bi bi-diagram-3 me-2"></i>
                    Segmentation
                </Button>
                <Button
                    variant={activeTab === 'campaigns' ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveTab('campaigns')}
                >
                    <i className="bi bi-megaphone me-2"></i>
                    Campagnes
                </Button>
            </div>

            {/* Onglet Segmentation */}
            {activeTab === 'segments' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>Segments de membres</h4>
                        <Button variant="success" onClick={() => setShowSegmentModal(true)}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Créer un segment
                        </Button>
                    </div>

                    {/* Segments prédéfinis */}
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Segments intelligents (automatiques)</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {Object.entries(DefaultSegments).map(([key, segment]) => {
                                    const memberCount = filterMembers(segment.criteria).length;
                                    return (
                                        <Col md={6} lg={4} key={key} className="mb-3">
                                            <Card className="border">
                                                <Card.Body className="text-center">
                                                    <h6>{segment.name}</h6>
                                                    <p className="text-muted small">{segment.description}</p>
                                                    <Badge bg="primary">{memberCount} membres</Badge>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Segments personnalisés */}
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Segments personnalisés</h5>
                        </Card.Header>
                        <Card.Body>
                            {segments.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="bi bi-diagram-3 text-muted" style={{ fontSize: '3rem' }}></i>
                                    <h5 className="text-muted mt-3">Aucun segment personnalisé</h5>
                                    <p className="text-muted">Créez votre premier segment pour cibler vos communications</p>
                                </div>
                            ) : (
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Description</th>
                                            <th>Membres</th>
                                            <th>Créé le</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {segments.map((segment) => (
                                            <tr key={segment.id}>
                                                <td className="fw-semibold">{segment.name}</td>
                                                <td className="text-muted small">{segment.description}</td>
                                                <td>
                                                    <Badge bg="primary">{segment.member_count}</Badge>
                                                </td>
                                                <td className="small">
                                                    {new Date(segment.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td>
                                                    <Button size="sm" variant="outline-primary" className="me-1">
                                                        <i className="bi bi-eye"></i>
                                                    </Button>
                                                    <Button size="sm" variant="outline-secondary">
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            )}

            {/* Onglet Campagnes */}
            {activeTab === 'campaigns' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>Campagnes de notification</h4>
                        <Button variant="success" onClick={() => setShowCampaignModal(true)}>
                            <i className="bi bi-plus-circle me-2"></i>
                            Nouvelle campagne
                        </Button>
                    </div>

                    <Card>
                        <Card.Body>
                            <div className="text-center py-4">
                                <i className="bi bi-megaphone text-muted" style={{ fontSize: '3rem' }}></i>
                                <h5 className="text-muted mt-3">Aucune campagne créée</h5>
                                <p className="text-muted">Créez votre première campagne de notification</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {/* Modal de création de segment */}
            <Modal show={showSegmentModal} onHide={() => setShowSegmentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Créer un nouveau segment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nom du segment *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={segmentForm.name || ''}
                                        onChange={(e) => setSegmentForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ex: Bénévoles Abidjan"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Type de profil</Form.Label>
                                    <Form.Select
                                        value={segmentForm.criteria?.profile_types?.[0] || ''}
                                        onChange={(e) => setSegmentForm(prev => ({
                                            ...prev,
                                            criteria: {
                                                ...prev.criteria,
                                                profile_types: e.target.value ? [e.target.value as any] : []
                                            }
                                        }))}
                                    >
                                        <option value="">Tous les types</option>
                                        <option value="adherent">Adhérents</option>
                                        <option value="ambassador">Ambassadeurs</option>
                                        <option value="alumni">Alumni</option>
                                        <option value="volunteer">Bénévoles</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={segmentForm.description || ''}
                                onChange={(e) => setSegmentForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Description du segment..."
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Compétences requises</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {skillsOptions.map(skill => (
                                            <Button
                                                key={skill}
                                                size="sm"
                                                variant={segmentForm.criteria?.skills?.includes(skill) ? 'primary' : 'outline-secondary'}
                                                onClick={() => {
                                                    const currentSkills = segmentForm.criteria?.skills || [];
                                                    const updatedSkills = currentSkills.includes(skill)
                                                        ? currentSkills.filter(s => s !== skill)
                                                        : [...currentSkills, skill];
                                                    setSegmentForm(prev => ({
                                                        ...prev,
                                                        criteria: { ...prev.criteria, skills: updatedSkills }
                                                    }));
                                                }}
                                            >
                                                {skill}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Centres d'intérêt</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {interestOptions.map(interest => (
                                            <Button
                                                key={interest}
                                                size="sm"
                                                variant={segmentForm.criteria?.interests?.includes(interest) ? 'success' : 'outline-secondary'}
                                                onClick={() => {
                                                    const currentInterests = segmentForm.criteria?.interests || [];
                                                    const updatedInterests = currentInterests.includes(interest)
                                                        ? currentInterests.filter(i => i !== interest)
                                                        : [...currentInterests, interest];
                                                    setSegmentForm(prev => ({
                                                        ...prev,
                                                        criteria: { ...prev.criteria, interests: updatedInterests }
                                                    }));
                                                }}
                                            >
                                                {interest}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Alert variant="info" className="d-flex justify-content-between align-items-center">
                            <span>
                                <i className="bi bi-info-circle me-2"></i>
                                Aperçu : {segmentPreview.length} membres correspondent à ces critères
                            </span>
                            <Badge bg="info">{segmentPreview.length}</Badge>
                        </Alert>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowSegmentModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleCreateSegment}>
                        Créer le segment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de création de campagne */}
            <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nouvelle campagne de notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label>Titre de la campagne *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={campaignForm.title || ''}
                                        onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Ex: Invitation événement networking"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        value={campaignForm.type || 'info'}
                                        onChange={(e) => setCampaignForm(prev => ({ ...prev, type: e.target.value as any }))}
                                    >
                                        <option value="info">Information</option>
                                        <option value="event">Événement</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="newsletter">Newsletter</option>
                                        <option value="survey">Sondage</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Message *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={campaignForm.message || ''}
                                onChange={(e) => setCampaignForm(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Rédigez votre message..."
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Canaux de diffusion</Form.Label>
                                    <div className="mt-2">
                                        {['email', 'sms', 'whatsapp', 'push'].map(channel => (
                                            <Form.Check
                                                key={channel}
                                                type="checkbox"
                                                id={`channel-${channel}`}
                                                label={channel.charAt(0).toUpperCase() + channel.slice(1)}
                                                checked={campaignForm.channels?.includes(channel as any)}
                                                onChange={(e) => {
                                                    const currentChannels = campaignForm.channels || [];
                                                    const updatedChannels = e.target.checked
                                                        ? [...currentChannels, channel as any]
                                                        : currentChannels.filter(c => c !== channel);
                                                    setCampaignForm(prev => ({ ...prev, channels: updatedChannels }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Segments cibles</Form.Label>
                                    <div className="mt-2">
                                        {segments.map(segment => (
                                            <Form.Check
                                                key={segment.id}
                                                type="checkbox"
                                                id={`segment-${segment.id}`}
                                                label={`${segment.name} (${segment.member_count} membres)`}
                                                checked={campaignForm.target_segments?.includes(segment.id)}
                                                onChange={(e) => {
                                                    const currentSegments = campaignForm.target_segments || [];
                                                    const updatedSegments = e.target.checked
                                                        ? [...currentSegments, segment.id]
                                                        : currentSegments.filter(s => s !== segment.id);
                                                    setCampaignForm(prev => ({ ...prev, target_segments: updatedSegments }));
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowCampaignModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleCreateCampaign}>
                        Créer la campagne
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}