import { Head } from '@inertiajs/react';
import { ModernHeader } from '../components/home/modern-header';
import { ProfessionalHeroSection } from '../components/home/professional-hero-section';
import { UpcomingEventsSection } from '../components/home/upcoming-events-section';
import { WhyJoinSection } from '../components/home/why-join-section';
import { HowItWorksSection } from '../components/home/how-it-works-section';
import { PartnersSection } from '../components/home/partners-section';
import { SocialProofSection } from '../components/home/social-proof-section';
import { ModernFooter } from '../components/home/modern-footer';

interface HomeStats {
    totalEvents: number;
    totalMembers: number;
    ticketsSold: number;
    totalRaised: string;
}

interface Partner {
    id: number;
    name: string;
    logo: string;
    website_url: string | null;
}

interface HomeProps {
    user?: { name: string; email: string };
    stats: HomeStats;
    partners: Partner[];
    upcomingEvents: Array<{
        id: number;
        title: string;
        short_description: string | null;
        location: string;
        start_date_display: string;
        category_display: string;
        image: string | null;
        formatted_price: string;
        requires_approval: boolean;
    }>;
}

export default function Home({ user, stats, partners, upcomingEvents }: HomeProps) {
    return (
        <>
            <Head>
                <title>Fondation TITI - Événements & Impact Social</title>
                <meta name="description" content="Réservez vos places aux événements de la Fondation TITI, soutenez des initiatives à impact, et rejoignez une communauté engagée au Cameroun." />
                <meta name="keywords" content="fondation, événements, billetterie, réservation, gala, impact social, campagnes caritatives, Cameroun" />
                <meta property="og:title" content="Fondation TITI - Événements & Impact Social" />
                <meta property="og:description" content="Réservez vos places en ligne, paiement Mobile Money ou carte. Événements culturels, galas et programmes d'impact." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="/" />
            </Head>

            <div className="home-page">
                <ModernHeader user={user} />
                <ProfessionalHeroSection user={user} stats={stats} />
                <UpcomingEventsSection events={upcomingEvents ?? []} />
                <WhyJoinSection />
                <HowItWorksSection />
                <PartnersSection partners={partners ?? []} />
                <SocialProofSection />
                <ModernFooter />
            </div>
        </>
    );
}
