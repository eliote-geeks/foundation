import { Card, Button, Row, Col, Badge, Dropdown, ProgressBar } from 'react-bootstrap';
import { useState } from 'react';

interface Report {
    id: string;
    name: string;
    description: string;
    type: 'financial' | 'members' | 'events' | 'partners' | 'custom';
    status: 'ready' | 'generating' | 'scheduled';
    lastGenerated: string;
    format: 'pdf' | 'excel' | 'csv';
    size: string;
    downloadUrl?: string;
    scheduleFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    fields: string[];
    estimatedTime: string;
}

export function ReportsModule() {
    const [activeView, setActiveView] = useState<'reports' | 'templates' | 'scheduled'>('reports');
    const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set());

    const reports: Report[] = [
        {
            id: '1',
            name: 'Rapport Financier Mensuel',
            description: 'Analyse complète des revenus, dépenses et budgets',
            type: 'financial',
            status: 'ready',
            lastGenerated: '2025-01-15T10:30:00',
            format: 'pdf',
            size: '2.4 MB',
            downloadUrl: '/reports/financial-monthly-jan2025.pdf',
            scheduleFrequency: 'monthly'
        },
        {
            id: '2',
            name: 'Statistiques Membres Q4 2024',
            description: 'Évolution des inscriptions et engagement communauté',
            type: 'members',
            status: 'ready',
            lastGenerated: '2025-01-10T14:20:00',
            format: 'excel',
            size: '1.8 MB',
            downloadUrl: '/reports/members-q4-2024.xlsx'
        },
        {
            id: '3',
            name: 'Bilan Événements 2024',
            description: 'Performance des événements et billetterie',
            type: 'events',
            status: 'generating',
            lastGenerated: '2025-01-05T09:15:00',
            format: 'pdf',
            size: 'Génération...'
        },
        {
            id: '4',
            name: 'Rapport Partenariats',
            description: 'État des partenariats et collaborations',
            type: 'partners',
            status: 'scheduled',
            lastGenerated: '2024-12-28T16:45:00',
            format: 'pdf',
            size: '3.1 MB',
            scheduleFrequency: 'quarterly'
        },
        {
            id: '5',
            name: 'Export Données Personnalisé',
            description: 'Export personnalisé des données sélectionnées',
            type: 'custom',
            status: 'ready',
            lastGenerated: '2025-01-12T11:30:00',
            format: 'csv',
            size: '856 KB',
            downloadUrl: '/reports/custom-export-jan12.csv'
        }
    ];

    const reportTemplates: ReportTemplate[] = [
        {
            id: '1',
            name: 'Rapport Financier',
            description: 'Revenus, dépenses, budgets et KPIs financiers',
            category: 'Finance',
            icon: 'bi-currency-exchange',
            color: '#C69438',
            fields: ['Revenus totaux', 'Dépenses par catégorie', 'Budget vs réalisé', 'Flux de trésorerie'],
            estimatedTime: '3-5 min'
        },
        {
            id: '2',
            name: 'Analyse Membres',
            description: 'Croissance, segmentation et engagement des membres',
            category: 'Communauté',
            icon: 'bi-people-fill',
            color: '#E4518C',
            fields: ['Nouvelles inscriptions', 'Taux d\'engagement', 'Segmentation démographique', 'Activité par région'],
            estimatedTime: '2-4 min'
        },
        {
            id: '3',
            name: 'Performance Événements',
            description: 'Analyse des événements et taux de participation',
            category: 'Événements',
            icon: 'bi-calendar-event-fill',
            color: '#5FA145',
            fields: ['Nombre d\'événements', 'Taux de participation', 'Revenus billetterie', 'Satisfaction participants'],
            estimatedTime: '4-6 min'
        },
        {
            id: '4',
            name: 'Bilan Partenariats',
            description: 'Évaluation des partenariats et collaborations',
            category: 'Partenaires',
            icon: 'bi-handshake-fill',
            color: '#6366F1',
            fields: ['Nouveaux partenaires', 'Valeur des partenariats', 'Projets collaboratifs', 'ROI partenariats'],
            estimatedTime: '5-8 min'
        },
        {
            id: '5',
            name: 'Dashboard Exécutif',
            description: 'Vue d\'ensemble pour la direction',
            category: 'Direction',
            icon: 'bi-graph-up-arrow',
            color: '#334E15',
            fields: ['KPIs clés', 'Tendances principales', 'Alertes importantes', 'Recommandations'],
            estimatedTime: '2-3 min'
        },
        {
            id: '6',
            name: 'Rapport d\'Impact',
            description: 'Mesure de l\'impact social et environnemental',
            category: 'Impact',
            icon: 'bi-heart-fill',
            color: '#DC3545',
            fields: ['Bénéficiaires touchés', 'Projets réalisés', 'Impact environnemental', 'Témoignages'],
            estimatedTime: '6-10 min'
        }
    ];

    const getTypeColor = (type: string): string => {
        switch (type) {
            case 'financial': return '#C69438';
            case 'members': return '#E4518C';
            case 'events': return '#5FA145';
            case 'partners': return '#6366F1';
            case 'custom': return '#334E15';
            default: return '#6B7280';
        }
    };

    const getTypeIcon = (type: string): string => {
        switch (type) {
            case 'financial': return 'bi-currency-exchange';
            case 'members': return 'bi-people-fill';
            case 'events': return 'bi-calendar-event';
            case 'partners': return 'bi-handshake';
            case 'custom': return 'bi-gear';
            default: return 'bi-file-earmark';
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            ready: { text: 'Prêt', color: '#5FA145' },
            generating: { text: 'Génération...', color: '#C69438' },
            scheduled: { text: 'Programmé', color: '#6366F1' }
        };
        const { text, color } = config[status as keyof typeof config];
        
        return (
            <Badge style={{ backgroundColor: color, fontSize: '0.7rem' }}>
                {status === 'generating' && <i className="bi bi-arrow-repeat me-1 spinner-border spinner-border-sm"></i>}
                {text}
            </Badge>
        );
    };

    const getFormatIcon = (format: string): string => {
        switch (format) {
            case 'pdf': return 'bi-file-earmark-pdf';
            case 'excel': return 'bi-file-earmark-excel';
            case 'csv': return 'bi-file-earmark-spreadsheet';
            default: return 'bi-file-earmark';
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generateReport = (templateId: string) => {
        setGeneratingReports(prev => new Set([...prev, templateId]));
        
        // Simulation de génération
        setTimeout(() => {
            setGeneratingReports(prev => {
                const newSet = new Set(prev);
                newSet.delete(templateId);
                return newSet;
            });
        }, 3000 + Math.random() * 2000);
    };

    const getFrequencyBadge = (frequency?: string) => {
        if (!frequency) return null;
        
        const config = {
            daily: { text: 'Quotidien', icon: 'bi-arrow-repeat' },
            weekly: { text: 'Hebdomadaire', icon: 'bi-calendar-week' },
            monthly: { text: 'Mensuel', icon: 'bi-calendar-month' },
            quarterly: { text: 'Trimestriel', icon: 'bi-calendar3' }
        };
        
        const freq = config[frequency as keyof typeof config];
        if (!freq) return null;
        
        return (
            <Badge 
                variant="secondary" 
                className="ms-2"
                style={{ 
                    backgroundColor: '#6B7280', 
                    fontSize: '0.7rem' 
                }}
            >
                <i className={`${freq.icon} me-1`}></i>
                {freq.text}
            </Badge>
        );
    };

    return (
        <div className="reports-module">
            {/* Module Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                        <i className="bi bi-file-earmark-bar-graph me-2"></i>
                        Centre de Rapports
                    </h4>
                    <p className="mb-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                        Générez et gérez vos rapports et exports de données
                    </p>
                </div>
                <div className="btn-group" role="group">
                    {[
                        { key: 'reports', label: 'Rapports', icon: 'bi-file-earmark-text' },
                        { key: 'templates', label: 'Modèles', icon: 'bi-file-earmark-plus' },
                        { key: 'scheduled', label: 'Programmés', icon: 'bi-clock-history' }
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

            {/* Reports List */}
            {activeView === 'reports' && (
                <Row className="g-4">
                    <Col lg={8}>
                        <Card 
                            className="border-0"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Card.Header className="bg-transparent border-0 p-4 pb-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="fw-bold mb-0" style={{ color: '#334E15' }}>
                                        Rapports Disponibles
                                    </h6>
                                    <Button
                                        size="sm"
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                            border: 'none',
                                            borderRadius: '10px'
                                        }}
                                        onClick={() => setActiveView('templates')}
                                    >
                                        <i className="bi bi-plus me-1"></i>
                                        Nouveau Rapport
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4 pt-3">
                                <div className="reports-list">
                                    {reports.map(report => (
                                        <div 
                                            key={report.id}
                                            className="d-flex align-items-center p-4 rounded-3 mb-3"
                                            style={{
                                                background: '#F8F9FA',
                                                border: '1px solid #E9ECEF'
                                            }}
                                        >
                                            <div 
                                                className="d-flex align-items-center justify-content-center rounded-circle me-4 flex-shrink-0"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    background: `${getTypeColor(report.type)}15`,
                                                    color: getTypeColor(report.type)
                                                }}
                                            >
                                                <i className={getTypeIcon(report.type)} style={{ fontSize: '1.3rem' }}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                                            {report.name}
                                                            {getFrequencyBadge(report.scheduleFrequency)}
                                                        </h6>
                                                        <p className="mb-2" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                            {report.description}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(report.status)}
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <i className={`${getFormatIcon(report.format)} me-2`} 
                                                           style={{ color: getTypeColor(report.type) }}></i>
                                                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                            {report.format.toUpperCase()} • {report.size}
                                                        </span>
                                                        <span className="mx-2" style={{ color: '#D1D5DB' }}>•</span>
                                                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                            Généré le {formatDate(report.lastGenerated)}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {report.status === 'ready' && report.downloadUrl && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                href={report.downloadUrl}
                                                                style={{
                                                                    borderColor: getTypeColor(report.type),
                                                                    color: getTypeColor(report.type),
                                                                    fontSize: '0.8rem'
                                                                }}
                                                            >
                                                                <i className="bi bi-download me-1"></i>
                                                                Télécharger
                                                            </Button>
                                                        )}
                                                        {report.status === 'generating' && (
                                                            <div className="d-flex align-items-center" style={{ color: '#C69438' }}>
                                                                <div className="spinner-border spinner-border-sm me-2"></div>
                                                                <small>Génération...</small>
                                                            </div>
                                                        )}
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                size="sm"
                                                                variant="link"
                                                                className="p-0 border-0 text-muted"
                                                            >
                                                                <i className="bi bi-three-dots-vertical"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item>
                                                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                                                    Regénérer
                                                                </Dropdown.Item>
                                                                <Dropdown.Item>
                                                                    <i className="bi bi-share me-2"></i>
                                                                    Partager
                                                                </Dropdown.Item>
                                                                <Dropdown.Item>
                                                                    <i className="bi bi-calendar-plus me-2"></i>
                                                                    Programmer
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item className="text-danger">
                                                                    <i className="bi bi-trash me-2"></i>
                                                                    Supprimer
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Quick Stats */}
                    <Col lg={4}>
                        <div className="reports-stats">
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
                                            { 
                                                label: 'Total Rapports', 
                                                value: reports.length, 
                                                color: '#5FA145', 
                                                icon: 'bi-file-earmark-text' 
                                            },
                                            { 
                                                label: 'Prêts', 
                                                value: reports.filter(r => r.status === 'ready').length, 
                                                color: '#5FA145', 
                                                icon: 'bi-check-circle' 
                                            },
                                            { 
                                                label: 'En génération', 
                                                value: reports.filter(r => r.status === 'generating').length, 
                                                color: '#C69438', 
                                                icon: 'bi-arrow-repeat' 
                                            },
                                            { 
                                                label: 'Programmés', 
                                                value: reports.filter(r => r.scheduleFrequency).length, 
                                                color: '#6366F1', 
                                                icon: 'bi-calendar-check' 
                                            }
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

                            {/* Recent Downloads */}
                            <Card 
                                className="border-0"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        <i className="bi bi-download me-2"></i>
                                        Derniers Téléchargements
                                    </h6>
                                    <div className="downloads-list">
                                        {reports.filter(r => r.downloadUrl).slice(0, 3).map(report => (
                                            <div key={report.id} className="d-flex align-items-center mb-3">
                                                <div 
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        background: `${getTypeColor(report.type)}15`,
                                                        color: getTypeColor(report.type)
                                                    }}
                                                >
                                                    <i className={getFormatIcon(report.format)} style={{ fontSize: '0.8rem' }}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold" style={{ fontSize: '0.85rem', color: '#334E15' }}>
                                                        {report.name.length > 20 
                                                            ? report.name.substring(0, 20) + '...' 
                                                            : report.name
                                                        }
                                                    </div>
                                                    <small style={{ color: '#6B7280' }}>{report.size}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="w-100"
                                        style={{
                                            borderColor: '#5FA145',
                                            color: '#5FA145',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        Voir tous les téléchargements
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}

            {/* Templates View */}
            {activeView === 'templates' && (
                <Row className="g-4">
                    {reportTemplates.map(template => (
                        <Col lg={6} key={template.id}>
                            <Card 
                                className="border-0 h-100"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    overflow: 'hidden'
                                }}
                            >
                                <div 
                                    className="p-4"
                                    style={{
                                        background: `linear-gradient(135deg, ${template.color} 0%, ${template.color}CC 100%)`
                                    }}
                                >
                                    <div className="d-flex align-items-center mb-3">
                                        <div 
                                            className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <i 
                                                className={`${template.icon} text-white`}
                                                style={{ fontSize: '1.5rem' }}
                                            ></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-1 text-white">
                                                {template.name}
                                            </h5>
                                            <Badge 
                                                style={{ 
                                                    background: 'rgba(255,255,255,0.2)',
                                                    color: '#FFF',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {template.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-white opacity-90 mb-3" style={{ fontSize: '0.9rem' }}>
                                        {template.description}
                                    </p>
                                    <div className="d-flex align-items-center text-white">
                                        <i className="bi bi-clock me-1"></i>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                                            Temps estimé: {template.estimatedTime}
                                        </span>
                                    </div>
                                </div>
                                
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        Données incluses
                                    </h6>
                                    <div className="fields-list mb-4">
                                        {template.fields.map((field, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <i 
                                                    className="bi bi-check-circle-fill me-2"
                                                    style={{ color: template.color, fontSize: '0.8rem' }}
                                                ></i>
                                                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                                    {field}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button
                                            className="flex-grow-1"
                                            disabled={generatingReports.has(template.id)}
                                            onClick={() => generateReport(template.id)}
                                            style={{
                                                background: generatingReports.has(template.id) 
                                                    ? '#6B7280' 
                                                    : `linear-gradient(135deg, ${template.color} 0%, ${template.color}CC 100%)`,
                                                border: 'none',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            {generatingReports.has(template.id) ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm me-2"></div>
                                                    Génération...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-play-fill me-2"></i>
                                                    Générer
                                                </>
                                            )}
                                        </Button>
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                size="sm"
                                                variant="outline-secondary"
                                                style={{ borderRadius: '10px' }}
                                            >
                                                <i className="bi bi-gear"></i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    <i className="bi bi-pencil me-2"></i>
                                                    Personnaliser
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <i className="bi bi-calendar-plus me-2"></i>
                                                    Programmer
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <i className="bi bi-copy me-2"></i>
                                                    Dupliquer
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Scheduled Reports */}
            {activeView === 'scheduled' && (
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
                                Rapports Programmés
                            </h6>
                            <Button
                                size="sm"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                    border: 'none',
                                    borderRadius: '10px'
                                }}
                            >
                                <i className="bi bi-calendar-plus me-1"></i>
                                Programmer un Rapport
                            </Button>
                        </div>
                        
                        <div className="scheduled-reports">
                            {reports.filter(r => r.scheduleFrequency).map(report => (
                                <div 
                                    key={report.id}
                                    className="d-flex align-items-center p-4 rounded-3 mb-3"
                                    style={{
                                        background: '#F8F9FA',
                                        border: '1px solid #E9ECEF'
                                    }}
                                >
                                    <div 
                                        className="d-flex align-items-center justify-content-center rounded-circle me-4 flex-shrink-0"
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            background: `${getTypeColor(report.type)}15`,
                                            color: getTypeColor(report.type)
                                        }}
                                    >
                                        <i className="bi bi-calendar-check" style={{ fontSize: '1.2rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                                    {report.name}
                                                </h6>
                                                <p className="mb-1" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                    {report.description}
                                                </p>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                {getFrequencyBadge(report.scheduleFrequency)}
                                                {getStatusBadge(report.status)}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                    Dernière génération: {formatDate(report.lastGenerated)}
                                                </span>
                                                <span className="mx-2" style={{ color: '#D1D5DB' }}>•</span>
                                                <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                    Prochaine: {
                                                        report.scheduleFrequency === 'monthly' ? '15/02/2025' :
                                                        report.scheduleFrequency === 'quarterly' ? '01/04/2025' :
                                                        '16/01/2025'
                                                    }
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    style={{
                                                        borderColor: getTypeColor(report.type),
                                                        color: getTypeColor(report.type),
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <i className="bi bi-gear me-1"></i>
                                                    Configurer
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    style={{ fontSize: '0.8rem' }}
                                                >
                                                    <i className="bi bi-play-fill me-1"></i>
                                                    Exécuter maintenant
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {reports.filter(r => r.scheduleFrequency).length === 0 && (
                                <div className="text-center py-5">
                                    <i 
                                        className="bi bi-calendar-x mb-3"
                                        style={{ 
                                            fontSize: '3rem',
                                            color: '#6B7280',
                                            opacity: 0.5
                                        }}
                                    ></i>
                                    <h6 className="fw-bold mb-2" style={{ color: '#6B7280' }}>
                                        Aucun rapport programmé
                                    </h6>
                                    <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                                        Automatisez vos rapports en les programmant à intervalles réguliers
                                    </p>
                                    <Button
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                            border: 'none',
                                            borderRadius: '10px'
                                        }}
                                        onClick={() => setActiveView('templates')}
                                    >
                                        <i className="bi bi-calendar-plus me-2"></i>
                                        Programmer mon premier rapport
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            )}

            <style jsx>{`
                .spinner-border-sm {
                    animation: spinner-border 0.75s linear infinite;
                }
                
                @keyframes spinner-border {
                    to { transform: rotate(360deg); }
                }
                
                .reports-module .btn:hover {
                    transform: translateY(-1px);
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
}