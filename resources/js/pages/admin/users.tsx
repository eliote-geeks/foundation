import React, { useState } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form, InputGroup, Dropdown, Modal, Tab, Tabs } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin-layout';
import { useTranslation } from '../../hooks/useTranslation';

interface User {
    id: string;
    name: string;
    email: string;
    memberType: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    joinedAt: string;
    lastActive: string;
    avatar?: string;
    city?: string;
    phone?: string;
}

interface AdminUsersProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    users?: User[];
}

export default function AdminUsers({ user }: AdminUsersProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [memberTypeFilter, setMemberTypeFilter] = useState('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Données d'exemple
    const usersData: User[] = [
        {
            id: '1',
            name: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            memberType: 'ambassadrice',
            status: 'active',
            joinedAt: '2024-01-15',
            lastActive: '2024-12-20',
            city: 'Yaoundé',
            phone: '+237 6XX XXX XXX'
        },
        {
            id: '2',
            name: 'Jean-Claude Kamgang',
            email: 'jc.kamgang@email.com',
            memberType: 'ancien_challenger',
            status: 'active',
            joinedAt: '2024-02-20',
            lastActive: '2024-12-19',
            city: 'Douala',
            phone: '+237 6XX XXX XXX'
        },
        {
            id: '3',
            name: 'Aminata Traoré',
            email: 'aminata.traore@email.com',
            memberType: 'beneficiaire',
            status: 'pending',
            joinedAt: '2024-12-18',
            lastActive: '2024-12-18',
            city: 'Bamenda',
            phone: '+237 6XX XXX XXX'
        },
        {
            id: '4',
            name: 'Paul Njiki',
            email: 'paul.njiki@email.com',
            memberType: 'benevole',
            status: 'active',
            joinedAt: '2024-03-10',
            lastActive: '2024-12-17',
            city: 'Garoua',
            phone: '+237 6XX XXX XXX'
        },
        {
            id: '5',
            name: 'Sarah Martin',
            email: 'sarah.martin@email.com',
            memberType: 'adherent',
            status: 'suspended',
            joinedAt: '2024-01-05',
            lastActive: '2024-11-15',
            city: 'Bafoussam',
            phone: '+237 6XX XXX XXX'
        }
    ];

    const getStatusColor = (status: User['status']) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'inactive': return '#6B7280';
            case 'pending': return '#F59E0B';
            case 'suspended': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusLabel = (status: User['status']) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'inactive': return 'Inactif';
            case 'pending': return 'En attente';
            case 'suspended': return 'Suspendu';
            default: return status;
        }
    };

    const getMemberTypeLabel = (type: string) => {
        switch (type) {
            case 'ambassadrice': return 'Ambassadrice';
            case 'ancien_challenger': return 'Ancien Challenger';
            case 'beneficiaire': return 'Bénéficiaire';
            case 'benevole': return 'Bénévole';
            case 'adherent': return 'Adhérent';
            case 'partenaire': return 'Partenaire';
            default: return type;
        }
    };

    const getMemberTypeColor = (type: string) => {
        switch (type) {
            case 'ambassadrice': return '#C69438';
            case 'ancien_challenger': return '#E4518C';
            case 'beneficiaire': return '#5FA145';
            case 'benevole': return '#6366F1';
            case 'adherent': return '#4D8A3C';
            case 'partenaire': return '#8B5CF6';
            default: return '#6B7280';
        }
    };

    const filteredUsers = usersData.filter(userData => {
        const matchesSearch = userData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            userData.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || userData.status === statusFilter;
        const matchesMemberType = memberTypeFilter === 'all' || userData.memberType === memberTypeFilter;
        
        return matchesSearch && matchesStatus && matchesMemberType;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handleUserAction = (user: User, action: string) => {
        console.log(`Action ${action} sur l'utilisateur:`, user);
        // Ici vous intégreriez avec votre API
    };

    const UserModal = () => (
        <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg" centered>
            <Modal.Header closeButton style={{ borderBottom: '1px solid #F3F4F6' }}>
                <Modal.Title className="fw-bold" style={{ color: '#1F2937' }}>
                    <i className="bi bi-person-circle me-2" style={{ color: '#5FA145' }}></i>
                    Détails de l'utilisateur
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedUser && (
                    <Tabs defaultActiveKey="profile" className="mb-3">
                        <Tab eventKey="profile" title="Profil">
                            <Row>
                                <Col md={4} className="text-center mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            backgroundColor: '#5FA145',
                                            color: '#FFFFFF',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {selectedUser.avatar ? (
                                            <img 
                                                src={selectedUser.avatar} 
                                                alt={selectedUser.name}
                                                className="rounded-circle"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            selectedUser.name.split(' ').map(n => n[0]).join('')
                                        )}
                                    </div>
                                    <h5 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                                        {selectedUser.name}
                                    </h5>
                                    <Badge 
                                        style={{ 
                                            backgroundColor: getMemberTypeColor(selectedUser.memberType),
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        {getMemberTypeLabel(selectedUser.memberType)}
                                    </Badge>
                                </Col>
                                <Col md={8}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Email
                                        </label>
                                        <div className="form-control-plaintext">
                                            {selectedUser.email}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Téléphone
                                        </label>
                                        <div className="form-control-plaintext">
                                            {selectedUser.phone || 'Non renseigné'}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Ville
                                        </label>
                                        <div className="form-control-plaintext">
                                            {selectedUser.city || 'Non renseignée'}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Status
                                        </label>
                                        <div>
                                            <Badge style={{ backgroundColor: getStatusColor(selectedUser.status) }}>
                                                {getStatusLabel(selectedUser.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Membre depuis
                                        </label>
                                        <div className="form-control-plaintext">
                                            {new Date(selectedUser.joinedAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold" style={{ color: '#374151' }}>
                                            Dernière connexion
                                        </label>
                                        <div className="form-control-plaintext">
                                            {new Date(selectedUser.lastActive).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="activity" title="Activité">
                            <div className="text-center py-4">
                                <i className="bi bi-clock-history" style={{ fontSize: '3rem', color: '#D1D5DB' }}></i>
                                <p className="mt-3 text-muted">Historique d'activité</p>
                                <small className="text-muted">Fonctionnalité à implémenter</small>
                            </div>
                        </Tab>
                    </Tabs>
                )}
            </Modal.Body>
            <Modal.Footer style={{ borderTop: '1px solid #F3F4F6' }}>
                <Button variant="outline-secondary" onClick={() => setShowUserModal(false)}>
                    Fermer
                </Button>
                <Button 
                    style={{ 
                        backgroundColor: '#5FA145',
                        borderColor: '#5FA145'
                    }}
                    onClick={() => {
                        console.log('Modifier utilisateur:', selectedUser);
                        setShowUserModal(false);
                    }}
                >
                    Modifier
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <AdminLayout title={t('usersManagement', 'Gestion des Utilisateurs')} user={user}>
            {/* En-tête avec statistiques */}
            <Row className="mb-4">
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {usersData.length}
                                    </h3>
                                    <p className="text-muted mb-0 small">Total Utilisateurs</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {usersData.filter(u => u.status === 'active').length}
                                    </h3>
                                    <p className="text-muted mb-0 small">Utilisateurs Actifs</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-clock-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        {usersData.filter(u => u.status === 'pending').length}
                                    </h3>
                                    <p className="text-muted mb-0 small">En Attente</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: 'linear-gradient(135deg, #C69438 0%, #B8832F 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <i className="bi bi-person-plus-fill"></i>
                                </div>
                                <div>
                                    <h3 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                        +12
                                    </h3>
                                    <p className="text-muted mb-0 small">Ce Mois</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Table des utilisateurs */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <Card.Header className="bg-white border-0 px-4 py-3" style={{ borderRadius: '16px 16px 0 0' }}>
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                <i className="bi bi-table me-2" style={{ color: '#5FA145' }}></i>
                                Liste des Utilisateurs
                            </h5>
                        </Col>
                        <Col xs="auto">
                            <Button 
                                size="sm"
                                style={{ 
                                    backgroundColor: '#5FA145',
                                    borderColor: '#5FA145'
                                }}
                            >
                                <i className="bi bi-person-plus me-2"></i>
                                Nouvel Utilisateur
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="px-0 py-0">
                    {/* Filtres */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <Row className="align-items-center">
                            <Col lg={4} md={6} sm={12} className="mb-3 mb-lg-0">
                                <InputGroup>
                                    <InputGroup.Text style={{ backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB' }}>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Rechercher un utilisateur..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ border: '1px solid #D1D5DB' }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={3} md={6} sm={12} className="mb-3 mb-lg-0">
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ border: '1px solid #D1D5DB' }}
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="active">Actif</option>
                                    <option value="inactive">Inactif</option>
                                    <option value="pending">En attente</option>
                                    <option value="suspended">Suspendu</option>
                                </Form.Select>
                            </Col>
                            <Col lg={3} md={6} sm={12} className="mb-3 mb-lg-0">
                                <Form.Select
                                    value={memberTypeFilter}
                                    onChange={(e) => setMemberTypeFilter(e.target.value)}
                                    style={{ border: '1px solid #D1D5DB' }}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="ambassadrice">Ambassadrice</option>
                                    <option value="ancien_challenger">Ancien Challenger</option>
                                    <option value="beneficiaire">Bénéficiaire</option>
                                    <option value="benevole">Bénévole</option>
                                    <option value="adherent">Adhérent</option>
                                    <option value="partenaire">Partenaire</option>
                                </Form.Select>
                            </Col>
                            <Col lg={2} md={6} sm={12}>
                                <div className="text-muted small">
                                    {filteredUsers.length} résultat(s)
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <Table className="mb-0" style={{ fontSize: '0.9rem' }}>
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Utilisateur
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Type
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Status
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Inscription
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Dernière activité
                                    </th>
                                    <th className="border-0 px-4 py-3 fw-semibold" style={{ color: '#374151' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((userData, index) => (
                                    <tr key={userData.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#5FA145',
                                                        color: '#FFFFFF',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {userData.avatar ? (
                                                        <img 
                                                            src={userData.avatar} 
                                                            alt={userData.name}
                                                            className="rounded-circle"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        userData.name.split(' ').map(n => n[0]).join('')
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                        {userData.name}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {userData.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge 
                                                style={{ 
                                                    backgroundColor: `${getMemberTypeColor(userData.memberType)}20`,
                                                    color: getMemberTypeColor(userData.memberType),
                                                    border: `1px solid ${getMemberTypeColor(userData.memberType)}30`
                                                }}
                                            >
                                                {getMemberTypeLabel(userData.memberType)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge style={{ backgroundColor: getStatusColor(userData.status) }}>
                                                {getStatusLabel(userData.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {new Date(userData.joinedAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {new Date(userData.lastActive).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="border-0"
                                                    style={{ backgroundColor: 'transparent' }}
                                                >
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            setSelectedUser(userData);
                                                            setShowUserModal(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-eye me-2"></i>
                                                        Voir
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleUserAction(userData, 'edit')}>
                                                        <i className="bi bi-pencil me-2"></i>
                                                        Modifier
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleUserAction(userData, 'message')}>
                                                        <i className="bi bi-envelope me-2"></i>
                                                        Envoyer un message
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item 
                                                        className="text-danger"
                                                        onClick={() => handleUserAction(userData, 'suspend')}
                                                    >
                                                        <i className="bi bi-person-x me-2"></i>
                                                        Suspendre
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px solid #F3F4F6' }}>
                            <div className="text-muted small">
                                Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} résultats
                            </div>
                            <div className="d-flex gap-1">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "primary" : "outline-secondary"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        style={page === currentPage ? {
                                            backgroundColor: '#5FA145',
                                            borderColor: '#5FA145'
                                        } : {}}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <UserModal />
        </AdminLayout>
    );
}