import { Head } from '@inertiajs/react';
import { ModernHeader } from '../components/home/modern-header';
import { ProfessionalHeroSection } from '../components/home/professional-hero-section';
import { ModulesShowcaseSection } from '../components/home/modules-showcase-section';
import { QuickActionsSection } from '../components/home/quick-actions-section';
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
                <title>Fondation TITI - Communauté d'Impact Social</title>
                <meta 
                    name="description" 
                    content="Rejoignez notre réseau social d'impact ! Connectez-vous avec des changemakers, participez à des concours et créez un impact durable ensemble." 
                />
                <meta name="keywords" content="réseau social, impact social, communauté, engagement citoyen, concours, événements, Cameroun" />
                <meta property="og:title" content="Fondation TITI - Communauté d'Impact Social" />
                <meta property="og:description" content="Le réseau social qui transforme l'engagement citoyen en impact concret" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="/" />
            </Head>

            <div className="home-page social-home">
                <ModernHeader user={user} />
                <ProfessionalHeroSection user={user} />
                <ModulesShowcaseSection />
                <QuickActionsSection />
                <ServicesSection />
                <TestimonialsSection />
                <ModernFooter />
            </div>

            <style jsx>{`
                .social-home {
                    background: #f8f9fa;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes morphing {
                    0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                    25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
                    50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
                    75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                .feed-container .card:last-child {
                    margin-bottom: 0;
                }

                .activity-list .d-flex:last-child {
                    margin-bottom: 0 !important;
                }
            `}</style>
        </>
    );
}