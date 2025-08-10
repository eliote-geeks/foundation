import { useState, useEffect } from 'react';
import { Dropdown, Badge, ListGroup, Button } from 'react-bootstrap';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'event' | 'payment';
    read: boolean;
    created_at: string;
    action_url?: string;
    action_text?: string;
}

interface NotificationCenterProps {
    notifications?: Notification[];
    onMarkAsRead?: (notificationId: number) => void;
    onMarkAllAsRead?: () => void;
}

// Mock data pour la démo
const mockNotifications: Notification[] = [
    {
        id: 1,
        title: 'Paiement confirmé',
        message: 'Votre cotisation annuelle a été traitée avec succès.',
        type: 'success',
        read: false,
        created_at: '2024-03-01T10:30:00Z',
        action_url: '/profile/payments',
        action_text: 'Voir les détails'
    },
    {
        id: 2,
        title: 'Nouvel événement disponible',
        message: 'Formation Leadership Féminin - Inscriptions ouvertes',
        type: 'event',
        read: false,
        created_at: '2024-02-28T16:45:00Z',
        action_url: '/events/leadership-feminin',
        action_text: 'S\'inscrire'
    },
    {
        id: 3,
        title: 'Rappel : Assemblée Générale',
        message: 'N\'oubliez pas notre AG annuelle le 20 mars à 14h.',
        type: 'warning',
        read: false,
        created_at: '2024-02-25T09:15:00Z',
        action_url: '/events/ag-2024',
        action_text: 'Participer'
    },
    {
        id: 4,
        title: 'Profil mis à jour',
        message: 'Vos informations de profil ont été sauvegardées.',
        type: 'info',
        read: true,
        created_at: '2024-02-20T14:20:00Z'
    }
];

export function NotificationCenter({ 
    notifications = mockNotifications, 
    onMarkAsRead, 
    onMarkAllAsRead 
}: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationList, setNotificationList] = useState(notifications);

    useEffect(() => {
        setNotificationList(notifications);
    }, [notifications]);

    const unreadCount = notificationList.filter(n => !n.read).length;

    const handleMarkAsRead = (notificationId: number) => {
        setNotificationList(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        onMarkAsRead?.(notificationId);
    };

    const handleMarkAllAsRead = () => {
        setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
        onMarkAllAsRead?.();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return 'bi-check-circle-fill text-success';
            case 'warning': return 'bi-exclamation-triangle-fill text-warning';
            case 'error': return 'bi-x-circle-fill text-danger';
            case 'event': return 'bi-calendar-event text-primary';
            case 'payment': return 'bi-credit-card text-info';
            default: return 'bi-info-circle-fill text-info';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `Il y a ${diffInMinutes} min`;
        } else if (diffInMinutes < 1440) { // 24 heures
            return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
        } else {
            return `Il y a ${Math.floor(diffInMinutes / 1440)} jour(s)`;
        }
    };

    return (
        <Dropdown 
            show={isOpen} 
            onToggle={setIsOpen}
            align="end"
        >
            <Dropdown.Toggle 
                as="button" 
                className="btn btn-link text-dark position-relative p-2 border-0 bg-transparent"
                style={{ boxShadow: 'none' }}
            >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                    <Badge 
                        bg="danger" 
                        className="position-absolute top-0 start-100 translate-middle rounded-pill"
                        style={{ fontSize: '0.7rem', minWidth: '1.2em', height: '1.2em' }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu 
                className="shadow border-0" 
                style={{ 
                    width: '380px', 
                    maxHeight: '500px',
                    borderRadius: '12px'
                }}
            >
                {/* En-tête */}
                <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-semibold">Notifications</h6>
                    {unreadCount > 0 && (
                        <Button 
                            variant="link" 
                            size="sm" 
                            className="text-decoration-none p-0"
                            onClick={handleMarkAllAsRead}
                        >
                            <small>Tout marquer comme lu</small>
                        </Button>
                    )}
                </div>

                {/* Liste des notifications */}
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notificationList.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-bell-slash text-muted" style={{ fontSize: '2rem' }}></i>
                            <div className="mt-2 text-muted">
                                <small>Aucune notification</small>
                            </div>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {notificationList.map((notification) => (
                                <ListGroup.Item
                                    key={notification.id}
                                    className={`border-0 px-3 py-3 ${
                                        !notification.read 
                                            ? 'bg-light border-start border-primary border-3' 
                                            : ''
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                >
                                    <div className="d-flex align-items-start">
                                        <i 
                                            className={`${getNotificationIcon(notification.type)} me-3 mt-1`}
                                            style={{ fontSize: '1.1rem' }}
                                        ></i>
                                        
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>
                                                    {notification.title}
                                                </h6>
                                                {!notification.read && (
                                                    <div 
                                                        className="bg-primary rounded-circle"
                                                        style={{ width: '8px', height: '8px', minWidth: '8px' }}
                                                    ></div>
                                                )}
                                            </div>
                                            
                                            <p className="mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                                                {notification.message}
                                            </p>
                                            
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    {formatTimeAgo(notification.created_at)}
                                                </small>
                                                
                                                {notification.action_url && notification.action_text && (
                                                    <Button 
                                                        variant="link" 
                                                        size="sm" 
                                                        className="text-decoration-none p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Ici on pourrait router vers l'action
                                                            console.log('Navigate to:', notification.action_url);
                                                        }}
                                                    >
                                                        <small>{notification.action_text}</small>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>

                {/* Footer */}
                {notificationList.length > 0 && (
                    <div className="px-3 py-2 border-top text-center">
                        <Button 
                            variant="link" 
                            size="sm" 
                            className="text-decoration-none"
                            onClick={() => {
                                // Navigate to full notifications page
                                console.log('Navigate to all notifications');
                                setIsOpen(false);
                            }}
                        >
                            Voir toutes les notifications
                        </Button>
                    </div>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default NotificationCenter;