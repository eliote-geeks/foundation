import { Card, Button, Row, Col, Badge, Dropdown, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'meeting' | 'event' | 'deadline' | 'reminder' | 'contest';
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    location?: string;
    participants?: number;
    priority: 'high' | 'medium' | 'low';
    category: string;
    recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
}

interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'high' | 'medium' | 'low';
    assignedTo?: string;
    category: string;
    progress: number;
}

export function CalendarModule() {
    const [activeView, setActiveView] = useState<'calendar' | 'events' | 'tasks'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

    const events: CalendarEvent[] = [
        {
            id: '1',
            title: 'Conférence Innovation Tech',
            description: 'Grand événement technologique avec 500 participants attendus',
            date: '2025-01-20',
            startTime: '09:00',
            endTime: '17:00',
            type: 'event',
            status: 'scheduled',
            location: 'Centre de Conférences Douala',
            participants: 487,
            priority: 'high',
            category: 'Événements',
            recurring: 'none'
        },
        {
            id: '2',
            title: 'Réunion Équipe Direction',
            description: 'Point mensuel sur les objectifs et KPIs',
            date: '2025-01-16',
            startTime: '14:00',
            endTime: '16:00',
            type: 'meeting',
            status: 'scheduled',
            location: 'Salle de réunion A',
            participants: 8,
            priority: 'medium',
            category: 'Réunions',
            recurring: 'monthly'
        },
        {
            id: '3',
            title: 'Deadline Budget Q1',
            description: 'Finalisation et validation du budget du premier trimestre',
            date: '2025-01-18',
            startTime: '23:59',
            endTime: '23:59',
            type: 'deadline',
            status: 'scheduled',
            priority: 'high',
            category: 'Administration',
            recurring: 'none'
        },
        {
            id: '4',
            title: 'Concours Entrepreneuriat',
            description: 'Lancement du concours pour jeunes entrepreneurs',
            date: '2025-01-25',
            startTime: '10:00',
            endTime: '12:00',
            type: 'contest',
            status: 'scheduled',
            participants: 156,
            priority: 'high',
            category: 'Concours',
            recurring: 'none'
        },
        {
            id: '5',
            title: 'Formation Personnel',
            description: 'Session de formation sur les nouvelles procédures',
            date: '2025-01-22',
            startTime: '08:30',
            endTime: '11:30',
            type: 'meeting',
            status: 'scheduled',
            location: 'Salle de formation',
            participants: 24,
            priority: 'medium',
            category: 'Formation',
            recurring: 'none'
        }
    ];

    const tasks: Task[] = [
        {
            id: '1',
            title: 'Préparer présentation partenaires',
            description: 'Créer la présentation pour la réunion avec Orange Cameroun',
            dueDate: '2025-01-17',
            status: 'in-progress',
            priority: 'high',
            assignedTo: 'Marie Dubois',
            category: 'Partenariats',
            progress: 65
        },
        {
            id: '2',
            title: 'Mettre à jour site web',
            description: 'Ajouter la section témoignages et optimiser le SEO',
            dueDate: '2025-01-19',
            status: 'pending',
            priority: 'medium',
            assignedTo: 'Jean Mbong',
            category: 'Communication',
            progress: 0
        },
        {
            id: '3',
            title: 'Analyse feedback événements',
            description: 'Compiler et analyser les retours des participants',
            dueDate: '2025-01-21',
            status: 'pending',
            priority: 'medium',
            assignedTo: 'Sarah Kamga',
            category: 'Événements',
            progress: 30
        },
        {
            id: '4',
            title: 'Rapport financier mensuel',
            description: 'Finaliser le rapport financier de janvier',
            dueDate: '2025-01-31',
            status: 'pending',
            priority: 'high',
            assignedTo: 'Paul Nkomo',
            category: 'Finance',
            progress: 10
        }
    ];

    const getEventTypeIcon = (type: string): string => {
        switch (type) {
            case 'meeting': return 'bi-people-fill';
            case 'event': return 'bi-calendar-event-fill';
            case 'deadline': return 'bi-clock-fill';
            case 'reminder': return 'bi-bell-fill';
            case 'contest': return 'bi-trophy-fill';
            default: return 'bi-calendar';
        }
    };

    const getEventTypeColor = (type: string): string => {
        switch (type) {
            case 'meeting': return '#6366F1';
            case 'event': return '#5FA145';
            case 'deadline': return '#C69438';
            case 'reminder': return '#C69438';
            case 'contest': return '#DC3545';
            default: return '#6B7280';
        }
    };

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'high': return '#C69438';
            case 'medium': return '#C69438';
            case 'low': return '#5FA145';
            default: return '#6B7280';
        }
    };

    const getStatusBadge = (status: string, type: 'event' | 'task' = 'event') => {
        const eventConfig = {
            scheduled: { text: 'Programmé', color: '#6366F1' },
            'in-progress': { text: 'En cours', color: '#C69438' },
            completed: { text: 'Terminé', color: '#5FA145' },
            cancelled: { text: 'Annulé', color: '#C69438' }
        };

        const taskConfig = {
            pending: { text: 'En attente', color: '#6B7280' },
            'in-progress': { text: 'En cours', color: '#C69438' },
            completed: { text: 'Terminé', color: '#5FA145' }
        };

        const config = type === 'event' ? eventConfig : taskConfig;
        const { text, color } = config[status as keyof typeof config] || { text: status, color: '#6B7280' };

        return (
            <Badge style={{ backgroundColor: color, fontSize: '0.7rem' }}>
                {text}
            </Badge>
        );
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string): string => {
        return timeString.slice(0, 5);
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const getTasksForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter(task => task.dueDate === dateStr);
    };

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();

        // Jours de la semaine
        const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

        // En-têtes des jours
        for (let i = 0; i < weekDays.length; i++) {
            days.push(
                <div key={`header-${i}`} className="calendar-header-day text-center p-2 fw-bold"
                     style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                    {weekDays[i]}
                </div>
            );
        }

        // Jours vides au début du mois
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day"></div>);
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const dayTasks = getTasksForDate(date);
            const isCurrentDay = isToday(date);

            days.push(
                <div
                    key={day}
                    className="calendar-day p-2 border rounded-3 position-relative"
                    style={{
                        minHeight: '80px',
                        cursor: 'pointer',
                        background: isCurrentDay ? '#5FA14515' : '#FFF',
                        borderColor: isCurrentDay ? '#5FA145' : '#E9ECEF',
                        borderWidth: isCurrentDay ? '2px' : '1px'
                    }}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                            className="fw-bold"
                            style={{
                                color: isCurrentDay ? '#5FA145' : '#334E15',
                                fontSize: '0.9rem'
                            }}
                        >
                            {day}
                        </span>
                        {(dayEvents.length > 0 || dayTasks.length > 0) && (
                            <div
                                className="rounded-circle"
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    background: dayEvents.length > 0 ? '#5FA145' : '#C69438'
                                }}
                            />
                        )}
                    </div>

                    {/* Afficher les premiers événements/tâches */}
                    <div className="events-preview">
                        {dayEvents.slice(0, 2).map(event => (
                            <div
                                key={event.id}
                                className="event-dot mb-1 px-2 py-1 rounded-2"
                                style={{
                                    background: `${getEventTypeColor(event.type)}20`,
                                    color: getEventTypeColor(event.type),
                                    fontSize: '0.7rem',
                                    lineHeight: '1'
                                }}
                            >
                                <i className={`${getEventTypeIcon(event.type)} me-1`}></i>
                                {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                            </div>
                        ))}
                        {dayTasks.slice(0, 1).map(task => (
                            <div
                                key={task.id}
                                className="task-dot mb-1 px-2 py-1 rounded-2"
                                style={{
                                    background: `${getPriorityColor(task.priority)}15`,
                                    color: getPriorityColor(task.priority),
                                    fontSize: '0.7rem',
                                    lineHeight: '1'
                                }}
                            >
                                <i className="bi bi-check-square me-1"></i>
                                {task.title.length > 8 ? task.title.substring(0, 8) + '...' : task.title}
                            </div>
                        ))}
                        {(dayEvents.length + dayTasks.length) > 3 && (
                            <div style={{ fontSize: '0.6rem', color: '#6B7280' }}>
                                +{(dayEvents.length + dayTasks.length) - 3} autres
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const urgentTasks = tasks
        .filter(task => task.status !== 'completed')
        .sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        })
        .slice(0, 4);

    return (
        <div className="calendar-module">
            {/* Module Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                        <i className="bi bi-calendar3 me-2"></i>
                        Calendrier & Planning
                    </h4>
                    <p className="mb-0" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                        Gérez vos événements, réunions et tâches
                    </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button
                        size="sm"
                        style={{
                            background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                            border: 'none',
                            borderRadius: '10px'
                        }}
                        onClick={() => setShowEventModal(true)}
                    >
                        <i className="bi bi-plus me-1"></i>
                        Nouvel Événement
                    </Button>
                    <div className="btn-group" role="group">
                        {[
                            { key: 'calendar', label: 'Calendrier', icon: 'bi-calendar3' },
                            { key: 'events', label: 'Événements', icon: 'bi-calendar-event' },
                            { key: 'tasks', label: 'Tâches', icon: 'bi-list-check' }
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

            {/* Calendar View */}
            {activeView === 'calendar' && (
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
                                    <div className="d-flex align-items-center">
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() => navigateMonth('prev')}
                                            style={{ borderRadius: '8px' }}
                                        >
                                            <i className="bi bi-chevron-left"></i>
                                        </Button>
                                        <h5 className="fw-bold mx-3 mb-0" style={{ color: '#334E15' }}>
                                            {currentDate.toLocaleDateString('fr-FR', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </h5>
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            onClick={() => navigateMonth('next')}
                                            style={{ borderRadius: '8px' }}
                                        >
                                            <i className="bi bi-chevron-right"></i>
                                        </Button>
                                    </div>
                                    <div className="btn-group" role="group">
                                        {[
                                            { key: 'month', label: 'Mois', icon: 'bi-calendar3' },
                                            { key: 'week', label: 'Semaine', icon: 'bi-calendar-week' },
                                            { key: 'day', label: 'Jour', icon: 'bi-calendar-day' }
                                        ].map(mode => (
                                            <Button
                                                key={mode.key}
                                                size="sm"
                                                variant={viewMode === mode.key ? 'primary' : 'outline-secondary'}
                                                onClick={() => setViewMode(mode.key as any)}
                                                style={{
                                                    backgroundColor: viewMode === mode.key ? '#5FA145' : 'transparent',
                                                    borderColor: viewMode === mode.key ? '#5FA145' : '#E9ECEF',
                                                    color: viewMode === mode.key ? '#FFF' : '#6B7280',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                <i className={`${mode.icon} me-1`}></i>
                                                {mode.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <div
                                    className="calendar-grid"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '8px'
                                    }}
                                >
                                    {renderCalendarGrid()}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <div className="calendar-sidebar">
                            {/* Upcoming Events */}
                            <Card
                                className="border-0 mb-4"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        <i className="bi bi-calendar-event me-2"></i>
                                        Prochains Événements
                                    </h6>
                                    <div className="upcoming-events">
                                        {upcomingEvents.map(event => (
                                            <div key={event.id} className="d-flex align-items-start mb-3">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        background: `${getEventTypeColor(event.type)}15`,
                                                        color: getEventTypeColor(event.type)
                                                    }}
                                                >
                                                    <i className={getEventTypeIcon(event.type)} style={{ fontSize: '0.8rem' }}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold mb-1" style={{ fontSize: '0.85rem', color: '#334E15' }}>
                                                        {event.title}
                                                    </div>
                                                    <div className="d-flex align-items-center mb-1">
                                                        <small style={{ color: '#6B7280' }}>
                                                            {formatDate(event.date)} • {formatTime(event.startTime)}
                                                        </small>
                                                        {event.priority === 'high' && (
                                                            <Badge
                                                                className="ms-2"
                                                                style={{
                                                                    backgroundColor: '#C69438',
                                                                    fontSize: '0.6rem'
                                                                }}
                                                            >
                                                                Urgent
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {event.location && (
                                                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                                            <i className="bi bi-geo-alt me-1"></i>
                                                            {event.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="w-100"
                                        onClick={() => setActiveView('events')}
                                        style={{
                                            borderColor: '#5FA145',
                                            color: '#5FA145',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        Voir tous les événements
                                    </Button>
                                </Card.Body>
                            </Card>

                            {/* Urgent Tasks */}
                            <Card
                                className="border-0"
                                style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Card.Body className="p-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#334E15' }}>
                                        <i className="bi bi-list-check me-2"></i>
                                        Tâches Urgentes
                                    </h6>
                                    <div className="urgent-tasks">
                                        {urgentTasks.map(task => (
                                            <div key={task.id} className="d-flex align-items-start mb-3">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        background: `${getPriorityColor(task.priority)}15`,
                                                        color: getPriorityColor(task.priority)
                                                    }}
                                                >
                                                    <i className="bi bi-check-square" style={{ fontSize: '0.8rem' }}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold mb-1" style={{ fontSize: '0.85rem', color: '#334E15' }}>
                                                        {task.title}
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                                        <small style={{ color: '#6B7280' }}>
                                                            Échéance: {formatDate(task.dueDate)}
                                                        </small>
                                                        <Badge
                                                            style={{
                                                                backgroundColor: getPriorityColor(task.priority),
                                                                fontSize: '0.6rem'
                                                            }}
                                                        >
                                                            {task.priority === 'high' ? 'Urgent' :
                                                             task.priority === 'medium' ? 'Normal' : 'Faible'}
                                                        </Badge>
                                                    </div>
                                                    <div className="progress" style={{ height: '4px' }}>
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${task.progress}%`,
                                                                backgroundColor: getPriorityColor(task.priority)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="w-100"
                                        onClick={() => setActiveView('tasks')}
                                        style={{
                                            borderColor: '#C69438',
                                            color: '#C69438',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        Voir toutes les tâches
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            )}

            {/* Events List */}
            {activeView === 'events' && (
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
                                Tous les Événements
                            </h6>
                            <div className="d-flex align-items-center gap-2">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        size="sm"
                                        variant="outline-secondary"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <i className="bi bi-filter me-1"></i>
                                        Filtrer
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Tous les types</Dropdown.Item>
                                        <Dropdown.Item>Événements</Dropdown.Item>
                                        <Dropdown.Item>Réunions</Dropdown.Item>
                                        <Dropdown.Item>Concours</Dropdown.Item>
                                        <Dropdown.Item>Échéances</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button
                                    size="sm"
                                    style={{
                                        background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                                        border: 'none',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <i className="bi bi-plus me-1"></i>
                                    Nouvel Événement
                                </Button>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-4 pt-3">
                        <div className="events-list">
                            {events.map(event => (
                                <div
                                    key={event.id}
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
                                            background: `${getEventTypeColor(event.type)}15`,
                                            color: getEventTypeColor(event.type)
                                        }}
                                    >
                                        <i className={getEventTypeIcon(event.type)} style={{ fontSize: '1.3rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                                    {event.title}
                                                </h6>
                                                {event.description && (
                                                    <p className="mb-2" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Badge
                                                    style={{
                                                        backgroundColor: getPriorityColor(event.priority),
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {event.priority === 'high' ? 'Priorité Haute' :
                                                     event.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
                                                </Badge>
                                                {getStatusBadge(event.status, 'event')}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center flex-wrap gap-3">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-calendar me-1" style={{ color: '#6B7280' }}></i>
                                                    <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                        {formatDate(event.date)}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-clock me-1" style={{ color: '#6B7280' }}></i>
                                                    <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                    </span>
                                                </div>
                                                {event.location && (
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-geo-alt me-1" style={{ color: '#6B7280' }}></i>
                                                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                )}
                                                {event.participants && (
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-people me-1" style={{ color: '#6B7280' }}></i>
                                                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                            {event.participants} participants
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    style={{
                                                        borderColor: getEventTypeColor(event.type),
                                                        color: getEventTypeColor(event.type),
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i>
                                                    Modifier
                                                </Button>
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
                                                            <i className="bi bi-eye me-2"></i>
                                                            Voir détails
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <i className="bi bi-copy me-2"></i>
                                                            Dupliquer
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <i className="bi bi-share me-2"></i>
                                                            Partager
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
            )}

            {/* Tasks List */}
            {activeView === 'tasks' && (
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
                                Gestion des Tâches
                            </h6>
                            <Button
                                size="sm"
                                style={{
                                    background: 'linear-gradient(135deg, #C69438 0%, #B8860B 100%)',
                                    border: 'none',
                                    borderRadius: '10px'
                                }}
                            >
                                <i className="bi bi-plus me-1"></i>
                                Nouvelle Tâche
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-4 pt-3">
                        <div className="tasks-list">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
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
                                            background: `${getPriorityColor(task.priority)}15`,
                                            color: getPriorityColor(task.priority)
                                        }}
                                    >
                                        <i className="bi bi-check-square" style={{ fontSize: '1.2rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-1" style={{ color: '#334E15' }}>
                                                    {task.title}
                                                </h6>
                                                {task.description && (
                                                    <p className="mb-2" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                            {getStatusBadge(task.status, 'task')}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-calendar me-1" style={{ color: '#6B7280' }}></i>
                                                    <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                        Échéance: {formatDate(task.dueDate)}
                                                    </span>
                                                </div>
                                                {task.assignedTo && (
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-person me-1" style={{ color: '#6B7280' }}></i>
                                                        <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>
                                                            {task.assignedTo}
                                                        </span>
                                                    </div>
                                                )}
                                                <Badge
                                                    className="me-2"
                                                    style={{
                                                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                                                        color: getPriorityColor(task.priority),
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    {task.category}
                                                </Badge>
                                            </div>
                                            <div className="text-end">
                                                <div style={{ color: getPriorityColor(task.priority), fontWeight: '600', fontSize: '0.9rem' }}>
                                                    {task.progress}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="progress flex-grow-1 me-3" style={{ height: '6px' }}>
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${task.progress}%`,
                                                        backgroundColor: getPriorityColor(task.priority)
                                                    }}
                                                />
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    style={{ fontSize: '0.8rem' }}
                                                    disabled={task.status === 'completed'}
                                                >
                                                    {task.status === 'completed' ? (
                                                        <>
                                                            <i className="bi bi-check2 me-1"></i>
                                                            Terminé
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check me-1"></i>
                                                            Marquer terminé
                                                        </>
                                                    )}
                                                </Button>
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
                                                            <i className="bi bi-pencil me-2"></i>
                                                            Modifier
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <i className="bi bi-person-plus me-2"></i>
                                                            Assigner
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <i className="bi bi-calendar-plus me-2"></i>
                                                            Reprogrammer
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
            )}

            <style>{`
                .calendar-day:hover {
                    background-color: #F8F9FA !important;
                    border-color: #5FA145 !important;
                }

                .event-dot, .task-dot {
                    transition: all 0.2s ease;
                }

                .event-dot:hover, .task-dot:hover {
                    transform: translateX(2px);
                }

                .progress-bar {
                    transition: width 0.6s ease;
                }
            `}</style>
        </div>
    );
}
