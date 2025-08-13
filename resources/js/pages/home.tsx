import { Head } from '@inertiajs/react';
import { ModernHeader } from '../components/home/modern-header';
import { HeroSection } from '../components/home/hero-section';
import { ServicesSection } from '../components/home/services-section';
import { TestimonialsSection } from '../components/home/testimonials-section';
import { ModernFooter } from '../components/home/modern-footer';

interface HomeProps {
    user?: {
        name: string;
        email: string;
    };
}

export default function Home({ user }: HomeProps) {
    return (
        <>
            <Head>
                <title>Fondation TITI - Ensemble pour un avenir meilleur</title>
                <meta 
                    name="description" 
                    content="Rejoignez une communauté engagée pour transformer les défis en opportunités. Participez à nos événements, concours et programmes d'impact social." 
                />
                <meta name="keywords" content="fondation, événements, concours, impact social, engagement citoyen, Sénégal" />
                <meta property="og:title" content="Fondation TITI - Ensemble pour un avenir meilleur" />
                <meta property="og:description" content="Plateforme événementielle pour l'engagement citoyen et l'impact social" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="/" />
            </Head>

            <div className="home-page">
                <ModernHeader user={user} />
                <HeroSection />
                <ServicesSection />
                <TestimonialsSection />
                <ModernFooter />
            </div>
        </>
    );
}