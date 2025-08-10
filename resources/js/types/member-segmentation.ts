// Types pour la segmentation des membres et les notifications

export interface Member {
    id: number;
    profile_type: 'adherent' | 'ambassador' | 'alumni' | 'volunteer';
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    skills: string[];
    interests: string[];
    availability: string[];
    city: string;
    country: string;
    communication_preferences: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
        newsletter: boolean;
    };
    created_at: string;
    last_active: string;
    participation_score: number;
}

export interface MemberSegment {
    id: string;
    name: string;
    description: string;
    criteria: SegmentCriteria;
    member_count: number;
    created_at: string;
    updated_at: string;
}

export interface SegmentCriteria {
    profile_types?: ('adherent' | 'ambassador' | 'alumni' | 'volunteer')[];
    skills?: string[];
    interests?: string[];
    availability?: string[];
    cities?: string[];
    countries?: string[];
    age_range?: {
        min: number;
        max: number;
    };
    registration_date_range?: {
        start: string;
        end: string;
    };
    participation_score_range?: {
        min: number;
        max: number;
    };
    communication_preferences?: {
        email?: boolean;
        sms?: boolean;
        whatsapp?: boolean;
        newsletter?: boolean;
    };
}

export interface NotificationCampaign {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'event' | 'urgent' | 'newsletter' | 'survey';
    channels: ('email' | 'sms' | 'whatsapp' | 'push')[];
    target_segments: string[];
    scheduled_at?: string;
    sent_at?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
    stats: {
        total_recipients: number;
        delivered: number;
        opened: number;
        clicked: number;
        unsubscribed: number;
    };
    created_at: string;
    created_by: string;
}

export interface ActivityNotification {
    id: string;
    title: string;
    description: string;
    activity_type: 'event' | 'contest' | 'program' | 'volunteer_opportunity' | 'survey';
    activity_id: string;
    required_skills?: string[];
    target_interests?: string[];
    location?: string;
    date?: string;
    deadline?: string;
    max_participants?: number;
    current_participants: number;
    auto_send: boolean;
    send_reminders: boolean;
    reminder_schedule: number[]; // jours avant l'événement
    created_at: string;
}

// Segments prédéfinis pour la segmentation automatique
export const DefaultSegments = {
    NEW_MEMBERS: {
        name: 'Nouveaux membres',
        description: 'Membres inscrits dans les 30 derniers jours',
        criteria: {
            registration_date_range: {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                end: new Date().toISOString()
            }
        }
    },
    ACTIVE_AMBASSADORS: {
        name: 'Ambassadeurs actifs',
        description: 'Ambassadeurs avec un score de participation élevé',
        criteria: {
            profile_types: ['ambassador'],
            participation_score_range: { min: 70, max: 100 }
        }
    },
    TECH_VOLUNTEERS: {
        name: 'Bénévoles Tech',
        description: 'Bénévoles avec compétences techniques',
        criteria: {
            profile_types: ['volunteer'],
            skills: ['Développement web', 'Design graphique', 'Marketing digital']
        }
    },
    ABIDJAN_MEMBERS: {
        name: 'Membres Abidjan',
        description: 'Tous les membres basés à Abidjan',
        criteria: {
            cities: ['Abidjan']
        }
    },
    EDUCATION_FOCUS: {
        name: 'Passionnés d\'éducation',
        description: 'Membres intéressés par l\'éducation et la formation',
        criteria: {
            interests: ['Éducation et formation']
        }
    }
};

// Types de notifications automatiques
export const NotificationTypes = {
    WELCOME_NEW_MEMBER: {
        title: 'Bienvenue dans la communauté Fondation Titi !',
        delay_hours: 1, // Envoyé 1h après inscription
        channels: ['email', 'whatsapp']
    },
    ONBOARDING_REMINDER: {
        title: 'Complétez votre profil pour une meilleure expérience',
        delay_hours: 72, // 3 jours après inscription
        channels: ['email']
    },
    MONTHLY_NEWSLETTER: {
        title: 'Newsletter mensuelle - Fondation Titi',
        schedule: 'monthly', // Premier lundi du mois
        channels: ['email']
    },
    EVENT_RECOMMENDATION: {
        title: 'Événement qui pourrait vous intéresser',
        trigger: 'new_relevant_event',
        channels: ['email', 'push']
    },
    VOLUNTEER_OPPORTUNITY: {
        title: 'Nouvelle opportunité de bénévolat',
        trigger: 'matching_skills',
        channels: ['email', 'sms', 'whatsapp']
    }
};