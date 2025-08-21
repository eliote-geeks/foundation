import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Container, Row, Col, Navbar, Nav, Offcanvas, Button, Badge } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

interface SidebarItem {
    key: string;
    label: string;
    icon: string;
    href: string;
    badge?: string;
    children?: SidebarItem[];
}

export default function DashboardLayout({ children, title = 'Dashboard', user }: DashboardLayoutProps) {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarItems: SidebarItem[] = [
        {
            key: 'dashboard',
            label: t('dashboard', 'Dashboard'),
            icon: 'bi-house-door',
            href: '/dashboard'
        },
        {
            key: 'members',
            label: t('members', 'Membres'),
            icon: 'bi-people',
            href: '/dashboard/members',
            badge: '342',
            children: [
                {
                    key: 'adherents',
                    label: t('adherents', 'Adhérents'),
                    icon: 'bi-person-check',
                    href: '/dashboard/members/adherents'
                },
                {
                    key: 'ambassadors',
                    label: t('ambassadors', 'Ambassadeurs'),
                    icon: 'bi-star',
                    href: '/dashboard/members/ambassadors'
                },
                {
                    key: 'volunteers',
                    label: t('volunteers', 'Bénévoles'),
                    icon: 'bi-hand-thumbs-up',
                    href: '/dashboard/members/volunteers'
                }
            ]
        },
        {
            key: 'events',
            label: t('events', 'Événements'),
            icon: 'bi-calendar-event',
            href: '/dashboard/events',
            badge: '12',
            children: [
                {
                    key: 'events-list',
                    label: t('eventsList', 'Liste des événements'),
                    icon: 'bi-list-ul',
                    href: '/dashboard/events'
                },
                {
                    key: 'tickets',
                    label: t('tickets', 'Billetterie'),
                    icon: 'bi-ticket-perforated',
                    href: '/dashboard/events/tickets'
                }
            ]
        },
        {
            key: 'contests',
            label: t('contests', 'Concours'),
            icon: 'bi-trophy',
            href: '/dashboard/contests',
            badge: '7'
        },
        {
            key: 'donations',
            label: t('donations', 'Dons'),
            icon: 'bi-heart',
            href: '/dashboard/donations',
            children: [
                {
                    key: 'donation-campaigns',
                    label: t('campaigns', 'Campagnes'),
                    icon: 'bi-megaphone',
                    href: '/dashboard/donations/campaigns'
                },
                {
                    key: 'donors',
                    label: t('donors', 'Donateurs'),
                    icon: 'bi-person-hearts',
                    href: '/dashboard/donations/donors'
                }
            ]
        },
        {
            key: 'projects',
            label: t('projects', 'Projets'),
            icon: 'bi-diagram-3',
            href: '/dashboard/projects',
            children: [
                {
                    key: 'active-projects',
                    label: t('activeProjects', 'Projets actifs'),
                    icon: 'bi-play-circle',
                    href: '/dashboard/projects/active'
                },
                {
                    key: 'completed-projects',
                    label: t('completedProjects', 'Projets terminés'),
                    icon: 'bi-check-circle',
                    href: '/dashboard/projects/completed'
                }
            ]
        },
        {
            key: 'communications',
            label: t('communications', 'Communications'),
            icon: 'bi-chat-dots',
            href: '/dashboard/communications',
            children: [
                {
                    key: 'newsletters',
                    label: t('newsletters', 'Newsletters'),
                    icon: 'bi-newspaper',
                    href: '/dashboard/communications/newsletters'
                },
                {
                    key: 'social-media',
                    label: t('socialMedia', 'Réseaux sociaux'),
                    icon: 'bi-share',
                    href: '/dashboard/communications/social-media'
                }
            ]
        },
        {
            key: 'finances',
            label: t('finances', 'Finances'),
            icon: 'bi-graph-up-arrow',
            href: '/dashboard/finances',
            children: [
                {
                    key: 'budget',
                    label: t('budget', 'Budget'),
                    icon: 'bi-pie-chart',
                    href: '/dashboard/finances/budget'
                },
                {
                    key: 'transactions',
                    label: t('transactions', 'Transactions'),
                    icon: 'bi-receipt',
                    href: '/dashboard/finances/transactions'
                },
                {
                    key: 'reports',
                    label: t('reports', 'Rapports'),
                    icon: 'bi-file-text',
                    href: '/dashboard/finances/reports'
                }
            ]
        },
        {
            key: 'partners',
            label: t('partners', 'Partenaires'),
            icon: 'bi-building',
            href: '/dashboard/partners'
        },
        {
            key: 'content',
            label: t('content', 'Contenu'),
            icon: 'bi-file-richtext',
            href: '/dashboard/content',
            children: [
                {
                    key: 'articles',
                    label: t('articles', 'Articles'),
                    icon: 'bi-journal-text',
                    href: '/dashboard/content/articles'
                },
                {
                    key: 'media',
                    label: t('media', 'Médias'),
                    icon: 'bi-images',
                    href: '/dashboard/content/media'
                }
            ]
        },
        {
            key: 'analytics',
            label: t('analytics', 'Analytics'),
            icon: 'bi-bar-chart-line',
            href: '/dashboard/analytics'
        },
        {
            key: 'settings',
            label: t('settings', 'Paramètres'),
            icon: 'bi-gear',
            href: '/dashboard/settings',
            children: [
                {
                    key: 'general',
                    label: t('general', 'Général'),
                    icon: 'bi-sliders',
                    href: '/dashboard/settings/general'
                },
                {
                    key: 'notifications',
                    label: t('notifications', 'Notifications'),
                    icon: 'bi-bell',
                    href: '/dashboard/settings/notifications'
                },
                {
                    key: 'security',
                    label: t('security', 'Sécurité'),
                    icon: 'bi-shield-check',
                    href: '/dashboard/settings/security'
                }
            ]
        }
    ];

    const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
        const isActive = window.location.pathname === item.href;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.key} className={`sidebar-item level-${level}`}>
                <Link
                    href={item.href}
                    className={`sidebar-link d-flex align-items-center text-decoration-none py-2 px-3 rounded-2 mb-1 ${
                        isActive ? 'active' : ''
                    }`}
                    style={{
                        color: isActive ? '#FFFFFF' : '#E8F5E8',
                        backgroundColor: isActive ? 'rgba(95, 161, 69, 0.8)' : 'transparent',
                        marginLeft: `${level * 1}rem`,
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(95, 161, 69, 0.3)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(232, 245, 232, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }
                    }}
                >
                    <i className={`${item.icon} me-3`} style={{ fontSize: '1.1rem', width: '20px' }}></i>
                    <span className="flex-grow-1">{item.label}</span>
                    {item.badge && (
                        <Badge 
                            pill
                            style={{ 
                                backgroundColor: '#C69438',
                                color: '#334E15',
                                fontSize: '0.7rem'
                            }}
                        >
                            {item.badge}
                        </Badge>
                    )}
                </Link>
                {hasChildren && (
                    <div className="sidebar-children">
                        {item.children!.map(child => renderSidebarItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title={`${title} - Dashboard - Fondation TITI`} />
            
            <div className="dashboard-layout d-flex" style={{ minHeight: '100vh' }}>
                <div 
                    className="sidebar d-none d-lg-flex flex-column position-fixed h-100"
                    style={{
                        width: '280px',
                        background: 'linear-gradient(180deg, #334E15 0%, #4D8A3C 100%)',
                        borderRight: '1px solid rgba(232, 245, 232, 0.1)',
                        zIndex: 1000
                    }}
                >
                    <div className="sidebar-header p-4">
                        <Link href="/" className="d-flex align-items-center text-decoration-none">
                            <div 
                                className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                <i className="bi bi-heart-fill text-white fs-5"></i>
                            </div>
                            <div>
                                <div className="fw-bold text-white mb-0" style={{ fontSize: '1.1rem' }}>
                                    Fondation TITI
                                </div>
                                <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                                    Dashboard
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="sidebar-nav flex-grow-1 px-3" style={{ overflowY: 'auto' }}>
                        {sidebarItems.map(item => renderSidebarItem(item))}
                    </div>

                    <div className="sidebar-footer p-3" style={{ borderTop: '1px solid rgba(232, 245, 232, 0.1)' }}>
                        <div className="d-flex align-items-center">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    backgroundColor: 'rgba(232, 245, 232, 0.2)',
                                    color: '#E8F5E8'
                                }}
                            >
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user?.name} 
                                        className="rounded-circle"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <i className="bi bi-person-fill"></i>
                                )}
                            </div>
                            <div className="flex-grow-1">
                                <div className="fw-semibold text-white" style={{ fontSize: '0.9rem' }}>
                                    {user?.name || 'Utilisateur'}
                                </div>
                                <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                                    Membre
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Offcanvas 
                    show={sidebarOpen} 
                    onHide={() => setSidebarOpen(false)} 
                    placement="start"
                    style={{ background: 'linear-gradient(180deg, #334E15 0%, #4D8A3C 100%)' }}
                >
                    <Offcanvas.Header closeButton className="text-white">
                        <Offcanvas.Title className="d-flex align-items-center">
                            <div 
                                className="me-2 d-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                <i className="bi bi-heart-fill text-white"></i>
                            </div>
                            Fondation TITI
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="sidebar-nav">
                            {sidebarItems.map(item => renderSidebarItem(item))}
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>

                <div className="main-content flex-grow-1" style={{ marginLeft: '280px' }}>
                    <Navbar 
                        className="top-bar px-4 py-3 d-flex justify-content-between align-items-center"
                        style={{ 
                            backgroundColor: '#FFFFFF',
                            borderBottom: '1px solid #E5E7EB',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            marginLeft: '-280px',
                            paddingLeft: '320px'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="d-lg-none me-3"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <i className="bi bi-list"></i>
                            </Button>
                            <h1 className="h4 mb-0 fw-bold" style={{ color: '#1F2937' }}>
                                {title}
                            </h1>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3">
                            <Button variant="outline-secondary" size="sm" className="position-relative">
                                <i className="bi bi-bell"></i>
                                <span 
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                    style={{ backgroundColor: '#E4518C', fontSize: '0.6rem' }}
                                >
                                    5
                                </span>
                            </Button>
                            
                            <Link 
                                href="/profile" 
                                className="d-flex align-items-center text-decoration-none"
                                style={{ color: '#374151' }}
                            >
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        backgroundColor: '#5FA145',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    {user?.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt={user?.name} 
                                            className="rounded-circle"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <i className="bi bi-person-fill"></i>
                                    )}
                                </div>
                                <span className="fw-medium">{user?.name || 'Utilisateur'}</span>
                            </Link>
                        </div>
                    </Navbar>

                    <div className="page-content p-4" style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 73px)' }}>
                        {children}
                    </div>
                </div>
            </div>

        </>
    );
}