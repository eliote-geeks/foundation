import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Container, Row, Col, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap';
import { useTranslation } from '../hooks/useTranslation';

interface AdminLayoutProps {
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

export default function AdminLayout({ children, title = 'Dashboard', user }: AdminLayoutProps) {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarItems: SidebarItem[] = [
        {
            key: 'dashboard',
            label: t('dashboard', 'Dashboard'),
            icon: 'bi-speedometer2',
            href: '/admin'
        },
        {
            key: 'users',
            label: t('users', 'Utilisateurs'),
            icon: 'bi-people',
            href: '/admin/users',
            badge: '152'
        },
        {
            key: 'members',
            label: t('members', 'Membres'),
            icon: 'bi-person-badge',
            href: '/admin/members',
            children: [
                {
                    key: 'adherents',
                    label: t('adherents', 'Adhérents'),
                    icon: 'bi-person-check',
                    href: '/admin/members/adherents'
                },
                {
                    key: 'ambassadors',
                    label: t('ambassadors', 'Ambassadeurs'),
                    icon: 'bi-star',
                    href: '/admin/members/ambassadors'
                },
                {
                    key: 'volunteers',
                    label: t('volunteers', 'Bénévoles'),
                    icon: 'bi-hand-thumbs-up',
                    href: '/admin/members/volunteers'
                }
            ]
        },
        {
            key: 'contests',
            label: t('contests', 'Concours'),
            icon: 'bi-trophy',
            href: '/admin/contests',
            badge: '8'
        },
        {
            key: 'events',
            label: t('events', 'Événements'),
            icon: 'bi-calendar-event',
            href: '/admin/events'
        },
        {
            key: 'content',
            label: t('content', 'Contenu'),
            icon: 'bi-file-text',
            href: '/admin/content',
            children: [
                {
                    key: 'posts',
                    label: t('posts', 'Articles'),
                    icon: 'bi-newspaper',
                    href: '/admin/content/posts'
                },
                {
                    key: 'pages',
                    label: t('pages', 'Pages'),
                    icon: 'bi-file-earmark',
                    href: '/admin/content/pages'
                }
            ]
        },
        {
            key: 'partners',
            label: t('partners', 'Partenaires'),
            icon: 'bi-building',
            href: '/admin/partners'
        },
        {
            key: 'reports',
            label: t('reports', 'Rapports'),
            icon: 'bi-graph-up',
            href: '/admin/reports',
            children: [
                {
                    key: 'analytics',
                    label: t('analytics', 'Analytics'),
                    icon: 'bi-bar-chart',
                    href: '/admin/reports/analytics'
                },
                {
                    key: 'finance',
                    label: t('finance', 'Finance'),
                    icon: 'bi-currency-euro',
                    href: '/admin/reports/finance'
                }
            ]
        },
        {
            key: 'settings',
            label: t('settings', 'Paramètres'),
            icon: 'bi-gear',
            href: '/admin/settings',
            children: [
                {
                    key: 'general',
                    label: t('general', 'Général'),
                    icon: 'bi-sliders',
                    href: '/admin/settings/general'
                },
                {
                    key: 'permissions',
                    label: t('permissions', 'Permissions'),
                    icon: 'bi-shield-check',
                    href: '/admin/settings/permissions'
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
                        transition: 'all 0.2s ease'
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
                        <span 
                            className="badge rounded-pill"
                            style={{ 
                                backgroundColor: '#C69438',
                                color: '#334E15',
                                fontSize: '0.7rem'
                            }}
                        >
                            {item.badge}
                        </span>
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
            <Head title={`${title} - Admin - Fondation TITI`} />
            
            <div className="admin-layout d-flex" style={{ minHeight: '100vh' }}>
                {/* Sidebar Desktop */}
                <div 
                    className="sidebar d-none d-lg-flex flex-column position-fixed h-100"
                    style={{
                        width: '280px',
                        background: 'linear-gradient(180deg, #334E15 0%, #4D8A3C 100%)',
                        borderRight: '1px solid rgba(232, 245, 232, 0.1)',
                        zIndex: 1000
                    }}
                >
                    {/* Logo */}
                    <div className="sidebar-header p-4">
                        <Link href="/" className="d-flex align-items-center text-decoration-none">
                            <img 
                                src="/logo foundation.jpg"
                                alt="Logo Fondation TITI"
                                className="me-3 rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                                <div className="fw-bold text-white mb-0" style={{ fontSize: '1.1rem' }}>
                                    Fondation TITI
                                </div>
                                <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                                    Admin Panel
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="sidebar-nav flex-grow-1 px-3" style={{ overflowY: 'auto' }}>
                        {sidebarItems.map(item => renderSidebarItem(item))}
                    </div>

                    {/* User Info */}
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
                                    {user?.name || 'Admin'}
                                </div>
                                <div className="text-white-50" style={{ fontSize: '0.75rem' }}>
                                    Administrateur
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Mobile */}
                <Offcanvas 
                    show={sidebarOpen} 
                    onHide={() => setSidebarOpen(false)} 
                    placement="start"
                    style={{ background: 'linear-gradient(180deg, #334E15 0%, #4D8A3C 100%)' }}
                >
                    <Offcanvas.Header closeButton className="text-white">
                        <Offcanvas.Title className="d-flex align-items-center">
                            <img 
                                src="/logo foundation.jpg"
                                alt="Logo Fondation TITI"
                                className="me-2 rounded-circle"
                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            />
                            Fondation TITI
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="sidebar-nav">
                            {sidebarItems.map(item => renderSidebarItem(item))}
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Main Content */}
                <div className="main-content flex-grow-1" style={{ marginLeft: '280px' }}>
                    {/* Top Bar */}
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
                                    3
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
                                <span className="fw-medium">{user?.name || 'Admin'}</span>
                            </Link>
                        </div>
                    </Navbar>

                    {/* Page Content */}
                    <div className="page-content p-4" style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 73px)' }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .sidebar-link:hover {
                    transform: translateX(2px);
                }
                
                .sidebar-link.active {
                    box-shadow: 0 4px 12px rgba(95, 161, 69, 0.3);
                }
                
                .sidebar-nav::-webkit-scrollbar {
                    width: 4px;
                }
                
                .sidebar-nav::-webkit-scrollbar-track {
                    background: rgba(232, 245, 232, 0.1);
                    border-radius: 2px;
                }
                
                .sidebar-nav::-webkit-scrollbar-thumb {
                    background: rgba(232, 245, 232, 0.3);
                    border-radius: 2px;
                }
                
                .sidebar-nav::-webkit-scrollbar-thumb:hover {
                    background: rgba(232, 245, 232, 0.5);
                }
                
                @media (max-width: 991.98px) {
                    .main-content {
                        margin-left: 0 !important;
                    }
                    .top-bar {
                        margin-left: 0 !important;
                        padding-left: 1rem !important;
                    }
                }
            `}</style>
        </>
    );
}