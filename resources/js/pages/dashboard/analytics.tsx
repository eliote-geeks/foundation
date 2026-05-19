import DashboardLayout from '../../layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col, Badge, Nav, ProgressBar, Table } from 'react-bootstrap';
import { useState } from 'react';

interface Stat {
    title: string;
    value: string | number;
    change: string;
    positive: boolean;
    color: string;
    icon: string;
}

interface MonthPoint {
    month: string;
    nouveaux: number;
    cumul: number;
}

interface MemberType {
    type: string;
    label: string;
    count: number;
}

interface ActivityType {
    type: string;
    label: string;
    count: number;
    total_points: number;
}

interface TopMember {
    name: string;
    member_type: string;
    engagement_score: number;
    engagement_level: string;
    last_active: string | null;
}

interface DonationPoint {
    month: string;
    montant: number;
    nombre: number;
}

interface EventStats {
    total: number;
    published: number;
    upcoming: number;
    tickets_sold: number;
    revenue: number;
}

interface ContestStats {
    total: number;
    active: number;
    votes: number;
    revenue: number;
}

interface AnalyticsProps {
    user?: { name: string; email: string; avatar?: string };
    stats: Stat[];
    memberGrowthData: MonthPoint[];
    membersByType: MemberType[];
    activitiesByType: ActivityType[];
    topMembers: TopMember[];
    donationTrend: DonationPoint[];
    eventStats: EventStats;
    contestStats: ContestStats;
}

const TYPE_COLORS = ['#5FA145', '#4A8A2A', '#C69438', '#C69438', '#20c997', '#fd7e14'];

const MiniBar = ({ data, valueKey, labelKey, color = '#5FA145' }: {
    data: Record<string, any>[];
    valueKey: string;
    labelKey: string;
    color?: string;
}) => {
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="d-flex align-items-end gap-1" style={{ height: 120 }}>
            {data.map((d, i) => (
                <div key={i} className="flex-fill d-flex flex-column align-items-center gap-1"
                    title={`${d[labelKey]}: ${d[valueKey].toLocaleString()}`}>
                    <div
                        className="w-100 rounded-top"
                        style={{
                            height: Math.max(3, (d[valueKey] / max) * 100),
                            backgroundColor: color,
                            opacity: 0.8,
                            transition: 'height 0.3s',
                        }}
                    />
                    <span className="text-muted" style={{ fontSize: 8, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        {d[labelKey].split(' ')[0]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function Analytics({
    user, stats, memberGrowthData, membersByType, activitiesByType,
    topMembers, donationTrend, eventStats, contestStats,
}: AnalyticsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'membres' | 'dons' | 'engagement'>('overview');

    const totalByType = membersByType.reduce((s, m) => s + m.count, 0);

    return (
        <DashboardLayout title="Analytics" user={user}>
            <Head title="Analytics" />
            <div className="analytics-page">
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: '#1F2937' }}>Analytics</h2>
                    <p className="text-muted mb-0">Performances de la fondation — données en temps réel</p>
                </div>

                {/* KPI */}
                <Row className="g-4 mb-4">
                    {stats.map((stat, i) => (
                        <Col lg={3} md={6} key={i}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h3 className="h4 fw-bold mb-0" style={{ color: '#1F2937' }}>{stat.value}</h3>
                                            <p className="text-muted mb-2 small">{stat.title}</p>
                                        </div>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: 48, height: 48, backgroundColor: stat.color, color: 'white' }}
                                        >
                                            <i className={`${stat.icon} fs-5`}></i>
                                        </div>
                                    </div>
                                    <Badge bg={stat.positive ? 'success' : 'danger'} className="rounded-pill">
                                        {stat.change}
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Tabs */}
                <div className="mb-4">
                    <Nav variant="pills" className="nav-fill">
                        {([
                            { key: 'overview',    label: 'Vue d\'ensemble', icon: 'bi-graph-up' },
                            { key: 'membres',     label: 'Membres',         icon: 'bi-people' },
                            { key: 'dons',        label: 'Dons',            icon: 'bi-heart' },
                            { key: 'engagement',  label: 'Engagement',      icon: 'bi-lightning-charge' },
                        ] as const).map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link
                                    active={activeTab === tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        backgroundColor: activeTab === tab.key ? '#5FA145' : 'transparent',
                                        borderColor: activeTab === tab.key ? '#5FA145' : '#dee2e6',
                                        color: activeTab === tab.key ? '#fff' : '#6c757d',
                                    }}
                                >
                                    <i className={`${tab.icon} me-2`}></i>{tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {/* VUE D'ENSEMBLE */}
                {activeTab === 'overview' && (
                    <Row className="g-4">
                        {/* Événements */}
                        <Col lg={6}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">
                                        <i className="bi bi-calendar-event me-2 text-primary"></i>Événements
                                    </h6>
                                </Card.Header>
                                <Card.Body className="pt-2">
                                    <Row className="g-3">
                                        {[
                                            { label: 'Total', value: eventStats.total, color: '#4A8A2A' },
                                            { label: 'Publiés', value: eventStats.published, color: '#5FA145' },
                                            { label: 'À venir', value: eventStats.upcoming, color: '#C69438' },
                                            { label: 'Billets vendus', value: eventStats.tickets_sold, color: '#C69438' },
                                        ].map((item, i) => (
                                            <Col xs={6} key={i}>
                                                <div
                                                    className="rounded p-3 text-center"
                                                    style={{ backgroundColor: `${item.color}12` }}
                                                >
                                                    <div className="fw-bold fs-4" style={{ color: item.color }}>{item.value}</div>
                                                    <div className="text-muted small">{item.label}</div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                    {eventStats.revenue > 0 && (
                                        <div className="mt-3 pt-3 border-top small text-muted">
                                            <i className="bi bi-currency-exchange me-1"></i>
                                            Revenus billets : <strong className="text-success">{eventStats.revenue.toLocaleString()} XAF</strong>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Concours */}
                        <Col lg={6}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">
                                        <i className="bi bi-trophy me-2 text-warning"></i>Concours
                                    </h6>
                                </Card.Header>
                                <Card.Body className="pt-2">
                                    <Row className="g-3">
                                        {[
                                            { label: 'Total', value: contestStats.total, color: '#4A8A2A' },
                                            { label: 'Actifs', value: contestStats.active, color: '#5FA145' },
                                            { label: 'Votes enregistrés', value: contestStats.votes, color: '#C69438' },
                                            { label: 'Revenus votes', value: contestStats.revenue.toLocaleString() + ' XAF', color: '#C69438' },
                                        ].map((item, i) => (
                                            <Col xs={6} key={i}>
                                                <div
                                                    className="rounded p-3 text-center"
                                                    style={{ backgroundColor: `${item.color}12` }}
                                                >
                                                    <div className="fw-bold fs-4" style={{ color: item.color }}>{item.value}</div>
                                                    <div className="text-muted small">{item.label}</div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Répartition membres par type */}
                        <Col xs={12}>
                            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">
                                        <i className="bi bi-people me-2 text-success"></i>Répartition des membres par type
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    {membersByType.length === 0 ? (
                                        <p className="text-muted text-center py-3">Aucun profil membre enregistré</p>
                                    ) : (
                                        <Row className="g-3">
                                            {membersByType.map((m, i) => (
                                                <Col lg={2} md={4} xs={6} key={i}>
                                                    <div className="text-center">
                                                        <div
                                                            className="fw-bold fs-3 mb-1"
                                                            style={{ color: TYPE_COLORS[i % TYPE_COLORS.length] }}
                                                        >
                                                            {m.count}
                                                        </div>
                                                        <div className="text-muted small">{m.label}</div>
                                                        <div className="text-muted" style={{ fontSize: 11 }}>
                                                            {totalByType > 0 ? Math.round((m.count / totalByType) * 100) : 0}%
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* MEMBRES */}
                {activeTab === 'membres' && (
                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Nouveaux membres — 12 derniers mois</h6>
                                </Card.Header>
                                <Card.Body>
                                    {memberGrowthData.every(m => m.nouveaux === 0) ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-people fs-1 d-block mb-2"></i>
                                            Aucune inscription sur la période
                                        </div>
                                    ) : (
                                        <MiniBar data={memberGrowthData} valueKey="nouveaux" labelKey="month" color="#5FA145" />
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Types de membres</h6>
                                </Card.Header>
                                <Card.Body>
                                    {membersByType.length === 0 ? (
                                        <p className="text-muted text-center small py-3">Aucun profil enregistré</p>
                                    ) : membersByType.map((m, i) => {
                                        const pct = totalByType > 0 ? Math.round((m.count / totalByType) * 100) : 0;
                                        return (
                                            <div key={i} className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="small fw-medium">{m.label}</span>
                                                    <span className="small text-muted">{m.count} ({pct}%)</span>
                                                </div>
                                                <ProgressBar
                                                    now={pct}
                                                    style={{ height: 6, backgroundColor: `${TYPE_COLORS[i % TYPE_COLORS.length]}20` }}
                                                >
                                                    <ProgressBar
                                                        now={pct}
                                                        style={{ backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length] }}
                                                    />
                                                </ProgressBar>
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* DONS */}
                {activeTab === 'dons' && (
                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Montant des dons — 12 derniers mois</h6>
                                </Card.Header>
                                <Card.Body>
                                    {donationTrend.every(d => d.montant === 0) ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-heart fs-1 d-block mb-2"></i>
                                            Aucun don enregistré sur la période
                                        </div>
                                    ) : (
                                        <MiniBar data={donationTrend} valueKey="montant" labelKey="month" color="#C69438" />
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Dons par mois</h6>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table hover className="mb-0 small">
                                        <thead style={{ backgroundColor: '#F8F9FA' }}>
                                            <tr>
                                                <th className="border-0 py-2 px-3">Mois</th>
                                                <th className="border-0 py-2 text-end">Montant</th>
                                                <th className="border-0 py-2 text-end px-3">Nb</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...donationTrend].reverse().map((d, i) => (
                                                <tr key={i}>
                                                    <td className="py-2 px-3">{d.month}</td>
                                                    <td className="py-2 text-end text-success fw-medium">
                                                        {d.montant > 0 ? d.montant.toLocaleString() : '—'}
                                                    </td>
                                                    <td className="py-2 text-end px-3 text-muted">{d.nombre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* ENGAGEMENT */}
                {activeTab === 'engagement' && (
                    <Row className="g-4">
                        {/* Activités par type */}
                        <Col lg={7}>
                            <Card className="border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Activités — 30 derniers jours</h6>
                                </Card.Header>
                                <Card.Body>
                                    {activitiesByType.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-activity fs-1 d-block mb-2"></i>
                                            Aucune activité enregistrée
                                        </div>
                                    ) : activitiesByType.map((a, i) => {
                                        const maxCount = activitiesByType[0].count;
                                        const pct = Math.round((a.count / maxCount) * 100);
                                        return (
                                            <div key={i} className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="small fw-medium">{a.label}</span>
                                                    <div className="d-flex gap-3">
                                                        <span className="small text-muted">{a.count} fois</span>
                                                        <span className="small text-warning">{a.total_points} pts</span>
                                                    </div>
                                                </div>
                                                <ProgressBar now={pct} style={{ height: 6 }}>
                                                    <ProgressBar
                                                        now={pct}
                                                        style={{ backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length] }}
                                                    />
                                                </ProgressBar>
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Top membres */}
                        <Col lg={5}>
                            <Card className="h-100 border-0" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Card.Header className="bg-white border-0 pt-4 pb-2">
                                    <h6 className="fw-bold mb-0">Top membres par engagement</h6>
                                </Card.Header>
                                <Card.Body>
                                    {topMembers.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-trophy fs-1 d-block mb-2"></i>
                                            Aucun score d'engagement enregistré
                                        </div>
                                    ) : topMembers.map((m, i) => (
                                        <div key={i} className="d-flex align-items-center gap-3 py-3 border-bottom">
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                style={{
                                                    width: 36, height: 36,
                                                    backgroundColor: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#5FA145',
                                                    color: 'white', fontSize: 14,
                                                }}
                                            >
                                                {i < 3 ? <i className="bi bi-trophy-fill"></i> : i + 1}
                                            </div>
                                            <div className="flex-grow-1 min-width-0">
                                                <div className="fw-medium text-truncate" style={{ color: '#1F2937' }}>{m.name}</div>
                                                <div className="text-muted small">{m.member_type}</div>
                                            </div>
                                            <div className="text-end flex-shrink-0">
                                                <div className="fw-bold" style={{ color: '#C69438' }}>{m.engagement_score} pts</div>
                                                <div className="text-muted" style={{ fontSize: 11 }}>{m.engagement_level}</div>
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </DashboardLayout>
    );
}
