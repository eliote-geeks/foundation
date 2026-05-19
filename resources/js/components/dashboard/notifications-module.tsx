import { Card, Badge, Button, Dropdown, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

interface NotificationItem {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error' | 'urgent';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    category: 'system' | 'financial' | 'events' | 'members' | 'partners';
    actionUrl?: string;
    priority: 'high' | 'medium' | 'low';
}

interface AlertConfig {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    threshold: number;
    type: 'budget' | 'members' | 'events' | 'performance';
}

export function NotificationsModule() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [activeView, setActiveView] = useState<'notifications' | 'alerts' | 'settings'>('notifications');
    const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');

    const mockNotifications: NotificationItem[] = [
        {
            id: '1',
            type: 'warning',
            title: 'Budget Presque Épuisé',
            message: 'Le budget événements atteint 85% de sa limite mensuelle',
            timestamp: '2025-01-15T10:30:00',
            isRead: false,
            category: 'financial',
            priority: 'high',
            actionUrl: '/dashboard/finance'
        },
        {
            id: '2',
            type: 'success',
            title: 'Nouveau Partenaire Validé',
            message: 'Orange Cameroun a accepté le partenariat technologique',
            timestamp: '2025-01-15T09:15:00',
            isRead: false,
            category: 'partners',
            priority: 'medium'
        },
        {
            id: '3',
            type: 'urgent',
            title: 'Problème Technique Critique',
            message: 'Le système de paiement rencontre des difficultés',
            timestamp: '2025-01-15T08:45:00',
            isRead: false,
            category: 'system',
            priority: 'high',
            actionUrl: '/admin/system'
        },
        {
            id: '4',
            type: 'info',
            title: 'Rappel Événement',
            message: 'Conférence Innovation dans 3 jours - 234 inscrits',
            timestamp: '2025-01-15T07:20:00',
            isRead: true,
            category: 'events',
            priority: 'medium'
        },
        {
            id: '5',
            type: 'success',
            title: 'Objectif Membres Atteint',
            message: 'Félicitations ! 1000 nouveaux membres ce mois',
            timestamp: '2025-01-14T18:30:00',
            isRead: true,
            category: 'members',
            priority: 'low'
        }
    ];

    const alertConfigs: AlertConfig[] = [
        {
            id: '1',
            name: 'Seuil Budget',
            description: 'Alerte quand un budget dépasse le seuil défini',
            isActive: true,
            threshold: 80,
            type: 'budget'
        },
        {
            id: '2',
            name: 'Nouveaux Membres',
            description: 'Notification pour les nouveaux inscriptions',
            isActive: true,
            threshold: 10,
            type: 'members'
        },
        {
            id: '3',
            name: 'Événements Complets',
            description: 'Alerte quand un événement atteint sa capacité',
            isActive: true,
            threshold: 95,
            type: 'events'
        },
        {
            id: '4',
            name: 'Performance Système',
            description: 'Surveillance des performances de la plateforme',
            isActive: true,
            threshold: 90,
            type: 'performance'
        }
    ];

    useEffect(() => {
        setNotifications(mockNotifications);
    }, []);

    const getNotificationIcon = (type: string, category: string): string => {
        switch (type) {
            case 'urgent':
                return 'bi-exclamation-triangle-fill';
            case 'warning':
                return 'bi-exclamation-circle-fill';
            case 'success':
                return 'bi-check-circle-fill';
            case 'error':
                return 'bi-x-circle-fill';
            default:
                switch (category) {
                    case 'financial': return 'bi-currency-exchange';
                    case 'events': return 'bi-calendar-event';
                    case 'members': return 'bi-people';
                    case 'partners': return 'bi-handshake';
                    case 'system': return 'bi-gear';
                    default: return 'bi-info-circle';
                }
        }
    };

    const getNotificationColor = (type: string): string => {
        switch (type) {
            case 'urgent': return '#DC3545';
            case 'warning': return '#C69438';
            case 'success': return '#5FA145';
            case 'error': return '#C69438';
            default: return '#6366F1';
        }
    };

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'financial': return '#C69438';
            case 'events': return '#5FA145';
            case 'members': return '#C69438';
            case 'partners': return '#6366F1';
            case 'system': return '#DC3545';
            default: return '#6B7280';
        }
    };

    const getPriorityBadge = (priority: string) => {
        const config = {
            high: { text: 'Haute', color: '#C69438' },
            medium: { text: 'Moyenne', color: '#C69438' },
            low: { text: 'Basse', color: '#5FA145' }
        };
        const { text, color } = config[priority as keyof typeof config];
        return (
            <Badge style={{ backgroundColor: color, fontSize: '0.7rem' }}>
                {text}
            </Badge>
        );
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `Il y a ${minutes}min`;
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${days}j`;
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, isRead: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const deleteNotification = (notificationId: string) => {
        setNotifications(prev =>
            prev.filter(notif => notif.id !== notificationId)
        );
    };

    const getFilteredNotifications = () => {
        switch (filterType) {
            case 'unread':
                return notifications.filter(n => !n.isRead);
            case 'urgent':
                return notifications.filter(n => n.type === 'urgent' || n.priority === 'high');
            default:
                return notifications;
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const urgentCount = notifications.filter(n => n.type === 'urgent').length;

    return (
        <div className="notifications-module">
            {/* Module Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                        <i className="bi bi-bell-fill me-2"></i>
                        Centre de Notifications
                        {unreadCount > 0 && (
                            <Badge 
                                className="ms-2"
                                style={{ 
                                    backgroundColor: '#C69438',
                                    fontSize: '0.7rem',
                                    transform: 'translateY(-2px)'
                                }}
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </h4>
                    <p className="mb-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                        Gérez vos notifications et alertes système
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        style={{
                            borderColor: '#5FA145',
                            color: '#5FA145'
                        }}
                    >
                        <i className="bi bi-check-all me-1"></i>
                        Tout marquer lu
                    </Button>
                    <div className="btn-group" role="group">
                        {[
                            { key: 'notifications', label: 'Notifications', icon: 'bi-bell' },
                            { key: 'alerts', label: 'Alertes', icon: 'bi-exclamation-triangle' },
                            { key: 'settings', label: 'Paramètres', icon: 'bi-gear' }
                        ].map(view => (
                            <Button
                                key={view.key}
                                size="sm"
                                variant={activeView === view.key ? 'primary' : 'outline-secondary'}
                                onClick={() => setActiveView(view.key as any)}
                                style={{
                                    backgroundColor: activeView === view.key ? '#5FA145' : 'transparent',
                                    borderColor: '#5FA145',
                                    color: activeView === view.key ? '#FFF' : '#5FA145'
                                }}
                            >
                                <i className={`${view.icon} me-1`}></i>
                                {view.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications View */}
            {activeView === 'notifications' && (
                <Row className="g-4">
                    <Col lg={8}>
                        <Card 
                            className="border-0"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Card.Header 
                                className="bg-transparent border-0 p-4 pb-0"
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                        Notifications Récentes
                                    </h6>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            size="sm"
                                            variant="outline-secondary"
                                            style={{
                                                borderColor: '#E9ECEF',
                                                color: '#6B7280'
                                            }}
                                        >
                                            <i className="bi bi-filter me-1"></i>
                                            {filterType === 'all' ? 'Toutes' :
                                             filterType === 'unread' ? 'Non lues' : 'Urgentes'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setFilterType('all')}>
                                                Toutes ({notifications.length})
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setFilterType('unread')}>
                                                Non lues ({unreadCount})
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setFilterType('urgent')}>
                                                Urgentes ({urgentCount})
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4 pt-3">
                                <div className="notifications-list">
                                    {getFilteredNotifications().map(notification => (
                                        <div 
                                            key={notification.id}
                                            className={`d-flex align-items-start p-3 rounded-3 mb-3 position-relative ${
                                                !notification.isRead ? 'border-start border-4' : ''
                                            }`}
                                            style={{
                                                background: notification.isRead ? '#F8F9FA' : `${getNotificationColor(notification.type)}08`,
                                                borderColor: !notification.isRead ? getNotificationColor(notification.type) : 'transparent',
                                                borderWidth: !notification.isRead ? '0 0 0 4px' : '0',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div 
                                                className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: `${getNotificationColor(notification.type)}15`,
                                                    color: getNotificationColor(notification.type)
                                                }}
                                            >
                                                <i className={getNotificationIcon(notification.type, notification.category)} 
                                                   style={{ fontSize: '1rem' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <h6 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                                        {notification.title}
                                                        {!notification.isRead && (
                                                            <span 
                                                                className="ms-2 rounded-circle"
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    backgroundColor: getNotificationColor(notification.type)
                                                                }}
                                                            />
                                                        )}
                                                    </h6>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {getPriorityBadge(notification.priority)}
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                size="sm"
                                                                variant="link"
                                                                className="p-0 border-0 text-muted"
                                                                style={{ fontSize: '1rem' }}
                                                            >
                                                                <i className="bi bi-three-dots-vertical"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                {!notification.isRead && (
                                                                    <Dropdown.Item onClick={() => markAsRead(notification.id)}>
                                                                        <i className="bi bi-check me-2"></i>
                                                                        Marquer comme lu
                                                                    </Dropdown.Item>
                                                                )}
                                                                {notification.actionUrl && (
                                                                    <Dropdown.Item href={notification.actionUrl}>
                                                                        <i className="bi bi-arrow-right me-2"></i>
                                                                        Voir détails
                                                                    </Dropdown.Item>
                                                                )}
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item 
                                                                    className="text-danger"
                                                                    onClick={() => deleteNotification(notification.id)}
                                                                >
                                                                    <i className="bi bi-trash me-2"></i>
                                                                    Supprimer
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <p className="mb-2" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                    {notification.message}
                                                </p>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <Badge 
                                                            className="me-2"
                                                            style={{ 
                                                                backgroundColor: `${getCategoryColor(notification.category)}20`,
                                                                color: getCategoryColor(notification.category),
                                                                fontSize: '0.7rem'
                                                            }}
                                                        >
                                                            {notification.category}
                                                        </Badge>
                                                        <small style={{ color: '#9CA3AF' }}>
                                                            {formatTime(notification.timestamp)}
                                                        </small>
                                                    </div>
                                                    {notification.actionUrl && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            href={notification.actionUrl}
                                                            style={{
                                                                borderColor: getNotificationColor(notification.type),
                                                                color: getNotificationColor(notification.type),
                                                                fontSize: '0.8rem',
                                                                padding: '4px 8px'
                                                            }}
                                                        >
                                                            Action
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {getFilteredNotifications().length === 0 && (
                                        <div className="text-center py-5">
                                            <i 
                                                className="bi bi-bell-slash mb-3"
                                                style={{ 
                                                    fontSize: '3rem',
                                                    color: '#6B7280',
                                                    opacity: 0.5
                                                }}
                                            ></i>
                                            <h6 className="fw-bold mb-2" style={{ color: '#6B7280' }}>
                                                Aucune notification
                                            </h6>
                                            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                                                {filterType === 'unread' 
                                                    ? 'Toutes vos notifications ont été lues'
                                                    : filterType === 'urgent'
                                                    ? 'Aucune notification urgente'
                                                    : 'Vous êtes à jour !'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Quick Stats */}
                    <Col lg={4}>
                        <div className="notification-stats">
                            <Card 
                                className="border-0 mb-4"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        <i className="bi bi-graph-up me-2"></i>
                                        Statistiques
                                    </h6>
                                    <div className="stats-grid">
                                        {[
                                            { label: 'Total', value: notifications.length, color: '#6366F1', icon: 'bi-bell' },
                                            { label: 'Non lues', value: unreadCount, color: '#C69438', icon: 'bi-bell-fill' },
                                            { label: 'Urgentes', value: urgentCount, color: '#DC3545', icon: 'bi-exclamation-triangle-fill' },
                                            { label: 'Aujourd\'hui', value: 3, color: '#5FA145', icon: 'bi-calendar-day' }
                                        ].map((stat, index) => (
                                            <div 
                                                key={index}
                                                className="d-flex align-items-center p-3 rounded-3 mb-3"
                                                style={{ background: `${stat.color}08` }}
                                            >
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                    style={{
                                                        width: '35px',
                                                        height: '35px',
                                                        background: `${stat.color}15`,
                                                        color: stat.color
                                                    }}
                                                >
                                                    <i className={stat.icon}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold" style={{ color: stat.color, fontSize: '1.2rem' }}>
                                                        {stat.value}
                                                    </div>
                                                    <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Quick Actions */}
                            <Card 
                                className="border-0"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        <i className="bi bi-lightning-fill me-2"></i>
                                        Actions Rapides
                                    </h6>
                                    <div className="d-grid gap-2">
                                        <Button
                                            size="sm"
                                            style={{
                                                background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                                border: 'none',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Nouvelle Alerte
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            style={{
                                                borderColor: '#6366F1',
                                                color: '#6366F1',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <i className="bi bi-download me-2"></i>
                                            Exporter Logs
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            style={{
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <i className="bi bi-gear me-2"></i>
                                            Paramètres
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}

            {/* Alerts Configuration View */}
            {activeView === 'alerts' && (
                <Card 
                    className="border-0"
                    style={{
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                >
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                Configuration des Alertes
                            </h6>
                            <Button
                                size="sm"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '10px'
                                }}
                            >
                                <i className="bi bi-plus me-1"></i>
                                Nouvelle Alerte
                            </Button>
                        </div>
                        
                        <div className="alerts-list">
                            {alertConfigs.map(alert => (
                                <div 
                                    key={alert.id}
                                    className="d-flex align-items-center p-4 rounded-3 mb-3"
                                    style={{
                                        background: '#F8F9FA',
                                        border: '1px solid #E9ECEF'
                                    }}
                                >
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center mb-2">
                                            <h6 className="fw-bold mb-0 me-3" style={{ color: '#334E15' }}>
                                                {alert.name}
                                            </h6>
                                            <Badge 
                                                style={{ 
                                                    backgroundColor: alert.isActive ? '#5FA145' : '#6B7280',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {alert.isActive ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </div>
                                        <p className="mb-2" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                            {alert.description}
                                        </p>
                                        <div className="d-flex align-items-center">
                                            <span style={{ color: '#334E15', fontSize: '0.8rem', fontWeight: '500' }}>
                                                Seuil: {alert.threshold}%
                                            </span>
                                            <span className="mx-2" style={{ color: '#D1D5DB' }}>•</span>
                                            <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                Type: {alert.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            style={{
                                                borderColor: '#5FA145',
                                                color: '#5FA145',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <i className="bi bi-pencil me-1"></i>
                                            Modifier
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={alert.isActive ? 'outline-danger' : 'outline-success'}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            {alert.isActive ? (
                                                <>
                                                    <i className="bi bi-pause me-1"></i>
                                                    Désactiver
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-play me-1"></i>
                                                    Activer
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Settings View */}
            {activeView === 'settings' && (
                <Card 
                    className="border-0"
                    style={{
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                >
                    <Card.Body className="p-4">
                        <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                            Paramètres de Notification
                        </h6>
                        
                        <div className="settings-sections">
                            <div className="mb-5">
                                <h6 className="fw-semibold mb-3" style={{ color: '#334E15' }}>
                                    Préférences de Notification
                                </h6>
                                <div className="form-check-list">
                                    {[
                                        { label: 'Notifications par email', description: 'Recevoir les notifications importantes par email' },
                                        { label: 'Notifications push', description: 'Notifications instantanées sur votre navigateur' },
                                        { label: 'Notifications SMS', description: 'SMS pour les alertes critiques uniquement' },
                                        { label: 'Récap quotidien', description: 'Résumé quotidien des activités' }
                                    ].map((setting, index) => (
                                        <div 
                                            key={index}
                                            className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-2"
                                            style={{ background: '#F8F9FA' }}
                                        >
                                            <div>
                                                <div className="fw-semibold mb-1" style={{ color: '#334E15' }}>
                                                    {setting.label}
                                                </div>
                                                <small style={{ color: '#6B7280' }}>
                                                    {setting.description}
                                                </small>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    defaultChecked={index < 2}
                                                    style={{ transform: 'scale(1.2)' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h6 className="fw-semibold mb-3" style={{ color: '#334E15' }}>
                                    Fréquence des Notifications
                                </h6>
                                <div className="frequency-options">
                                    {[
                                        { label: 'Temps réel', description: 'Immédiatement quand ça arrive' },
                                        { label: 'Groupées (15 min)', description: 'Toutes les 15 minutes maximum' },
                                        { label: 'Résumé horaire', description: 'Une fois par heure' },
                                        { label: 'Résumé quotidien', description: 'Une fois par jour le matin' }
                                    ].map((option, index) => (
                                        <div 
                                            key={index}
                                            className="form-check mb-2"
                                        >
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="frequency" 
                                                defaultChecked={index === 0}
                                            />
                                            <label className="form-check-label ms-2">
                                                <div className="fw-semibold" style={{ color: '#334E15' }}>
                                                    {option.label}
                                                </div>
                                                <small style={{ color: '#6B7280' }}>
                                                    {option.description}
                                                </small>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                            <Button
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    paddingLeft: '30px',
                                    paddingRight: '30px'
                                }}
                            >
                                <i className="bi bi-check me-2"></i>
                                Sauvegarder
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}