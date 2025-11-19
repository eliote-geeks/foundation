import DashboardLayout from '../../layouts/dashboard-layout';
import { Card, Row, Col, Form, Button, Nav, Alert } from 'react-bootstrap';
import { useState } from 'react';

interface SettingsProps {
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export default function Settings({ user }: SettingsProps) {
    const [activeTab, setActiveTab] = useState('general');
    const [showSaveAlert, setShowSaveAlert] = useState(false);

    const handleSave = () => {
        setShowSaveAlert(true);
        setTimeout(() => setShowSaveAlert(false), 3000);
    };

    return (
        <DashboardLayout title="Paramètres" user={user}>
            <div className="settings-page">
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Paramètres</h2>
                    <p className="text-muted mb-0">Configuration et préférences de votre fondation</p>
                </div>

                {showSaveAlert && (
                    <Alert variant="success" className="mb-4">
                        <i className="bi bi-check-circle me-2"></i>
                        Paramètres sauvegardés avec succès !
                    </Alert>
                )}

                <Row className="g-4">
                    <Col lg={3}>
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-0">
                                <Nav variant="pills" className="flex-column">
                                    {[
                                        { key: 'general', label: 'Général', icon: 'bi-gear' },
                                        { key: 'notifications', label: 'Notifications', icon: 'bi-bell' },
                                        { key: 'security', label: 'Sécurité', icon: 'bi-shield-check' },
                                        { key: 'integrations', label: 'Intégrations', icon: 'bi-puzzle' },
                                        { key: 'backup', label: 'Sauvegarde', icon: 'bi-cloud-upload' }
                                    ].map(tab => (
                                        <Nav.Item key={tab.key}>
                                            <Nav.Link 
                                                active={activeTab === tab.key} 
                                                onClick={() => setActiveTab(tab.key)}
                                                className="text-start px-4 py-3"
                                                style={{ 
                                                    backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                                    border: 'none'
                                                }}
                                            >
                                                <i className={`${tab.icon} me-3`}></i>
                                                {tab.label}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={9}>
                        <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <Card.Body className="p-4">
                                {activeTab === 'general' && (
                                    <div>
                                        <h5 className="fw-bold mb-4">Paramètres généraux</h5>
                                        <Form>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nom de la fondation</Form.Label>
                                                        <Form.Control type="text" defaultValue="Fondation TITI" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email principal</Form.Label>
                                                        <Form.Control type="email" defaultValue="contact@fondation-titi.org" />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Téléphone</Form.Label>
                                                        <Form.Control type="tel" defaultValue="+33 1 23 45 67 89" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Site web</Form.Label>
                                                        <Form.Control type="url" defaultValue="https://fondation-titi.org" />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Adresse</Form.Label>
                                                <Form.Control as="textarea" rows={3} defaultValue="123 Rue de la Solidarité&#10;75001 Paris&#10;France" />
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control as="textarea" rows={4} defaultValue="La Fondation TITI œuvre pour l'aide aux personnes dans le besoin et le développement de projets sociaux." />
                                            </Form.Group>
                                        </Form>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div>
                                        <h5 className="fw-bold mb-4">Paramètres de notifications</h5>
                                        <Form>
                                            <div className="mb-4">
                                                <h6 className="mb-3">Notifications par email</h6>
                                                <Form.Check type="switch" id="email-donations" label="Nouveaux dons" className="mb-2" defaultChecked />
                                                <Form.Check type="switch" id="email-members" label="Nouveaux membres" className="mb-2" defaultChecked />
                                                <Form.Check type="switch" id="email-events" label="Événements" className="mb-2" />
                                                <Form.Check type="switch" id="email-reports" label="Rapports hebdomadaires" className="mb-2" defaultChecked />
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="mb-3">Notifications push</h6>
                                                <Form.Check type="switch" id="push-urgent" label="Alertes urgentes" className="mb-2" defaultChecked />
                                                <Form.Check type="switch" id="push-comments" label="Nouveaux commentaires" className="mb-2" />
                                                <Form.Check type="switch" id="push-updates" label="Mises à jour système" className="mb-2" defaultChecked />
                                            </div>
                                        </Form>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div>
                                        <h5 className="fw-bold mb-4">Sécurité</h5>
                                        <Form>
                                            <div className="mb-4">
                                                <h6 className="mb-3">Authentification</h6>
                                                <Form.Check type="switch" id="2fa" label="Authentification à deux facteurs" className="mb-2" />
                                                <Form.Check type="switch" id="login-alerts" label="Alertes de connexion" className="mb-2" defaultChecked />
                                                <Form.Check type="switch" id="session-timeout" label="Déconnexion automatique (30 min)" className="mb-2" defaultChecked />
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="mb-3">Permissions</h6>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Niveau d'accès par défaut</Form.Label>
                                                    <Form.Select>
                                                        <option value="viewer">Lecteur</option>
                                                        <option value="editor">Éditeur</option>
                                                        <option value="admin">Administrateur</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                        </Form>
                                    </div>
                                )}

                                {activeTab === 'integrations' && (
                                    <div>
                                        <h5 className="fw-bold mb-4">Intégrations</h5>
                                        <div className="mb-4">
                                            <h6 className="mb-3">Services connectés</h6>
                                            <div className="p-3 border rounded mb-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Google Analytics</strong>
                                                        <div className="text-muted small">Suivi des performances web</div>
                                                    </div>
                                                    <Button variant="outline-success" size="sm">Connecté</Button>
                                                </div>
                                            </div>
                                            <div className="p-3 border rounded mb-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Mailchimp</strong>
                                                        <div className="text-muted small">Gestion des newsletters</div>
                                                    </div>
                                                    <Button variant="outline-secondary" size="sm">Connecter</Button>
                                                </div>
                                            </div>
                                            <div className="p-3 border rounded">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Stripe</strong>
                                                        <div className="text-muted small">Paiements en ligne</div>
                                                    </div>
                                                    <Button variant="outline-secondary" size="sm">Connecter</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'backup' && (
                                    <div>
                                        <h5 className="fw-bold mb-4">Sauvegarde et restauration</h5>
                                        <Form>
                                            <div className="mb-4">
                                                <h6 className="mb-3">Sauvegarde automatique</h6>
                                                <Form.Check type="switch" id="auto-backup" label="Sauvegarde automatique quotidienne" className="mb-2" defaultChecked />
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Conserver les sauvegardes</Form.Label>
                                                    <Form.Select>
                                                        <option value="7">7 jours</option>
                                                        <option value="30" selected>30 jours</option>
                                                        <option value="90">90 jours</option>
                                                        <option value="365">1 an</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                            <div className="mb-4">
                                                <h6 className="mb-3">Actions manuelles</h6>
                                                <div className="d-flex gap-2">
                                                    <Button variant="outline-primary">
                                                        <i className="bi bi-download me-2"></i>
                                                        Télécharger sauvegarde
                                                    </Button>
                                                    <Button variant="outline-secondary">
                                                        <i className="bi bi-upload me-2"></i>
                                                        Restaurer sauvegarde
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                )}

                                <div className="pt-4 border-top">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button variant="outline-secondary">Annuler</Button>
                                        <Button 
                                            style={{ backgroundColor: '#5FA145', borderColor: '#5FA145' }}
                                            onClick={handleSave}
                                        >
                                            Sauvegarder
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </DashboardLayout>
    );
}
