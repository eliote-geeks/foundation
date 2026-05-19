import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, ProgressBar } from 'react-bootstrap';
import DashboardLayout from '../../layouts/dashboard-layout';

interface MembersAnalyticsProps {
    user?: {
        name: string;
        email: string;
    };
    totalMembers: number;
    activeMembers: number;
    thisMonthMembers: number;
    membersByType: Record<string, number>;
    engagementDistribution: Record<string, number>;
    geoDistribution: Record<string, number>;
    monthlyGrowth: Array<{
        month: string;
        count: number;
    }>;
    recentActivities: Array<{
        type: string;
        count: number;
        total_points: number;
    }>;
    avgEngagementByType: Record<string, number>;
    topMembers: Array<{
        id: number;
        name: string;
        member_type: string;
        engagement_score: number;
        city?: string;
        joined_at?: string;
    }>;
}

export default function MembersAnalytics({
    user,
    totalMembers,
    activeMembers,
    thisMonthMembers,
    membersByType,
    engagementDistribution,
    geoDistribution,
    monthlyGrowth,
    recentActivities,
    avgEngagementByType,
    topMembers
}: MembersAnalyticsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const getTypeColor = (type: string) => {
        const colors = {
            'Adhérents': '#4A8A2A',
            'Ambassadeurs': '#C69438',
            'Bénévoles': '#C69438',
            'Anciens Challengers': '#5FA145',
            'Partenaires': '#4D8A3C',
            'Bénéficiaires': '#334E15'
        };
        return colors[type as keyof typeof colors] || '#6B7280';
    };

    const getEngagementColor = (score: number) => {
        if (score >= 1000) return '#5FA145';
        if (score >= 500) return '#C69438';
        if (score >= 200) return '#C69438';
        if (score >= 50) return '#4A8A2A';
        return '#9CA3AF';
    };

    return (
        <DashboardLayout title="Analytics des Membres" user={user}>
            <Head title="Dashboard - Analytics Membres" />

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1F2937' }}>
                        <i className="bi bi-graph-up me-2" style={{ color: '#5FA145' }}></i>
                        Analytics des Membres
                    </h2>
                    <p className="text-muted mb-0">
                        Analyse détaillée de votre communauté et de l'engagement des membres.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-5">
                <Col lg={4} md={6}>
                    <Card 
                        className="border-0 h-100"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)'
                        }}
                    >
                        <Card.Body className="p-4 text-white">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <p className="mb-1 opacity-90" style={{ fontSize: '0.9rem' }}>
                                        Total Membres
                                    </p>
                                    <h3 className="fw-bold mb-0">
                                        {totalMembers.toLocaleString()}
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
                                    <i className="bi bi-people-fill" style={{ fontSize: '1.3rem' }}></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-arrow-up me-2"></i>
                                <span className="fw-semibold">+{thisMonthMembers}</span>
                                <span className="ms-2 opacity-75">ce mois</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6}>
                    <Card 
                        className="border-0 h-100"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            background: 'linear-gradient(135deg, #4A8A2A 0%, #5a67d8 100%)'
                        }}
                    >
                        <Card.Body className="p-4 text-white">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <p className="mb-1 opacity-90" style={{ fontSize: '0.9rem' }}>
                                        Membres Actifs
                                    </p>
                                    <h3 className="fw-bold mb-0">
                                        {activeMembers.toLocaleString()}
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
                                    <i className="bi bi-person-check-fill" style={{ fontSize: '1.3rem' }}></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="fw-semibold">
                                    {Math.round((activeMembers / totalMembers) * 100)}%
                                </span>
                                <span className="ms-2 opacity-75">du total</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4} md={6}>
                    <Card 
                        className="border-0 h-100"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            background: 'linear-gradient(135deg, #C69438 0%, #d53f8c 100%)'
                        }}
                    >
                        <Card.Body className="p-4 text-white">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <p className="mb-1 opacity-90" style={{ fontSize: '0.9rem' }}>
                                        Engagement Moyen
                                    </p>
                                    <h3 className="fw-bold mb-0">
                                        {Math.round(Object.values(avgEngagementByType).reduce((a, b) => a + b, 0) / Object.values(avgEngagementByType).length)}
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
                                    <i className="bi bi-trophy-fill" style={{ fontSize: '1.3rem' }}></i>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="fw-semibold">points</span>
                                <span className="ms-2 opacity-75">par membre</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Répartition par Type */}
                <Col lg={6}>
                    <Card className="border-0 h-100" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                <i className="bi bi-pie-chart me-2"></i>
                                Répartition par Type
                            </h5>
                            <div className="member-types-chart">
                                {Object.entries(membersByType).map(([type, count]) => {
                                    const percentage = Math.round((count / totalMembers) * 100);
                                    const color = getTypeColor(type);
                                    
                                    return (
                                        <div key={type} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div 
                                                        className="rounded me-3"
                                                        style={{
                                                            width: '12px',
                                                            height: '12px',
                                                            background: color
                                                        }}
                                                    />
                                                    <span className="fw-semibold" style={{ color: '#1F2937' }}>
                                                        {type}
                                                    </span>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold" style={{ color: color }}>
                                                        {count}
                                                    </div>
                                                    <small style={{ color: '#6B7280' }}>
                                                        {percentage}%
                                                    </small>
                                                </div>
                                            </div>
                                            <ProgressBar 
                                                now={percentage} 
                                                style={{ 
                                                    height: '8px',
                                                    background: `${color}20`
                                                }}
                                                className="rounded-pill"
                                            >
                                                <div 
                                                    className="progress-bar rounded-pill"
                                                    style={{ 
                                                        background: color,
                                                        width: `${percentage}%`
                                                    }}
                                                />
                                            </ProgressBar>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Distribution d'Engagement */}
                <Col lg={6}>
                    <Card className="border-0 h-100" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                <i className="bi bi-speedometer2 me-2"></i>
                                Niveaux d'Engagement
                            </h5>
                            <div className="engagement-chart">
                                {Object.entries(engagementDistribution).map(([level, count]) => {
                                    const percentage = Math.round((count / totalMembers) * 100);
                                    const colors = [
                                        '#5FA145', '#C69438', '#C69438', '#4A8A2A', '#9CA3AF'
                                    ];
                                    const colorIndex = Object.keys(engagementDistribution).indexOf(level);
                                    const color = colors[colorIndex] || '#9CA3AF';
                                    
                                    return (
                                        <div key={level} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-semibold" style={{ color: '#1F2937', fontSize: '0.9rem' }}>
                                                    {level}
                                                </span>
                                                <span className="fw-bold" style={{ color: color }}>
                                                    {count}
                                                </span>
                                            </div>
                                            <ProgressBar 
                                                now={percentage} 
                                                style={{ height: '6px' }}
                                                className="rounded-pill"
                                            >
                                                <div 
                                                    className="progress-bar rounded-pill"
                                                    style={{ 
                                                        background: color,
                                                        width: `${percentage}%`
                                                    }}
                                                />
                                            </ProgressBar>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Membres */}
                <Col lg={8}>
                    <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                <i className="bi bi-award me-2"></i>
                                Top Membres par Engagement
                            </h5>
                            <div className="table-responsive">
                                <Table hover className="mb-0">
                                    <thead style={{ background: '#F8F9FA' }}>
                                        <tr>
                                            <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Rang</th>
                                            <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Membre</th>
                                            <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Type</th>
                                            <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Points</th>
                                            <th className="border-0 fw-semibold" style={{ color: '#6B7280' }}>Ville</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topMembers.map((member, index) => (
                                            <tr key={member.id}>
                                                <td className="border-0">
                                                    <div 
                                                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            background: index < 3 ? 
                                                                (index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32') :
                                                                '#F3F4F6',
                                                            color: index < 3 ? '#FFF' : '#6B7280',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        {index < 3 ? (
                                                            <i className={`bi bi-${index === 0 ? 'trophy' : index === 1 ? 'award' : 'star'}-fill`}></i>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <div>
                                                        <div className="fw-semibold" style={{ color: '#1F2937' }}>
                                                            {member.name}
                                                        </div>
                                                        <small style={{ color: '#6B7280' }}>
                                                            Inscrit le {member.joined_at}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <Badge 
                                                        style={{ 
                                                            background: getTypeColor(member.member_type),
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {member.member_type}
                                                    </Badge>
                                                </td>
                                                <td className="border-0">
                                                    <div className="fw-bold" style={{ color: getEngagementColor(member.engagement_score) }}>
                                                        {member.engagement_score.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="border-0" style={{ color: '#6B7280' }}>
                                                    {member.city || 'Non spécifiée'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Répartition Géographique */}
                <Col lg={4}>
                    <Card className="border-0 h-100" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="p-4">
                            <h6 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                <i className="bi bi-geo-alt me-2"></i>
                                Répartition Géographique
                            </h6>
                            <div className="geo-distribution">
                                {Object.entries(geoDistribution).map(([city, count]) => {
                                    const percentage = Math.round((count / totalMembers) * 100);
                                    
                                    return (
                                        <div key={city} className="d-flex justify-content-between align-items-center py-2">
                                            <div>
                                                <div className="fw-semibold" style={{ color: '#1F2937', fontSize: '0.9rem' }}>
                                                    {city}
                                                </div>
                                                <small style={{ color: '#6B7280' }}>
                                                    {percentage}% des membres
                                                </small>
                                            </div>
                                            <div className="fw-bold" style={{ color: '#5FA145' }}>
                                                {count}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Activités Récentes */}
                <Col xs={12}>
                    <Card className="border-0" style={{ borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4" style={{ color: '#334E15' }}>
                                <i className="bi bi-activity me-2"></i>
                                Activités Populaires (30 derniers jours)
                            </h5>
                            <Row className="g-3">
                                {recentActivities.map((activity, index) => (
                                    <Col lg={2} md={4} sm={6} key={index}>
                                        <Card 
                                            className="text-center border-0"
                                            style={{
                                                background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F5E8 100%)',
                                                borderRadius: '12px'
                                            }}
                                        >
                                            <Card.Body className="p-3">
                                                <div className="fw-bold mb-1" style={{ color: '#5FA145', fontSize: '1.2rem' }}>
                                                    {activity.count}
                                                </div>
                                                <div style={{ color: '#1F2937', fontSize: '0.8rem', fontWeight: '500' }}>
                                                    {activity.type}
                                                </div>
                                                <div style={{ color: '#6B7280', fontSize: '0.7rem' }}>
                                                    {activity.total_points} pts
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </DashboardLayout>
    );
}