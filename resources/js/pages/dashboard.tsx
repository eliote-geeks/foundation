import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FoundationLayout } from '@/layouts/foundation-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Trophy, 
    Ticket, 
    Users, 
    BookOpen, 
    Building, 
    Heart, 
    Play, 
    ArrowRight, 
    Star,
    TrendingUp,
    MessageCircle,
    Send,
    CheckCircle,
    Headphones,
    Clock,
    Award,
    Newspaper,
    Mail
} from 'lucide-react';

interface DashboardProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
}

// Variants d'animation
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { 
        scale: 1.02, 
        y: -8,
        transition: { 
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const iconFloat = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Composant pour les statistiques animées
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const counter = useTransform(
        useScroll().scrollYProgress,
        [0, 1],
        [0, value]
    );
    
    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration }}
        >
            {isInView ? value.toLocaleString() : '0'}
        </motion.span>
    );
};

// Composant pour les cartes flottantes
const FloatingCard = ({ children, delay = 0, className = "" }: { 
    children: React.ReactNode; 
    delay?: number; 
    className?: string; 
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default function Dashboard({ auth }: DashboardProps) {
    const { t } = useTranslation();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const modules = [
        {
            title: t('contestVoting'),
            description: 'Participez aux votes des concours en ligne',
            icon: Trophy,
            href: '/contests',
            gradient: 'from-purple-500 to-indigo-600',
            participants: 1250
        },
        {
            title: t('ticketPurchase'),
            description: 'Achetez vos billets pour les événements',
            icon: Ticket,
            href: '/events',
            gradient: 'from-emerald-500 to-teal-600',
            participants: 850
        },
        {
            title: t('memberSpace'),
            description: 'Accédez à votre espace membre personnalisé',
            icon: Users,
            href: '/members',
            gradient: 'from-blue-500 to-cyan-600',
            participants: 2850
        },
        {
            title: t('programRegistration'),
            description: 'Inscrivez-vous aux programmes de la fondation',
            icon: BookOpen,
            href: '/programs',
            gradient: 'from-amber-500 to-orange-600',
            participants: 650
        },
        {
            title: t('partnerSpace'),
            description: 'Espace dédié aux partenaires',
            icon: Building,
            href: '/partners',
            gradient: 'from-slate-500 to-gray-600',
            participants: 180
        }
    ];

    const stats = [
        { label: 'Vies impactées', value: 2850, icon: Users },
        { label: 'Projets financés', value: 45, icon: Award },
        { label: 'Fonds mobilisés (M FCFA)', value: 600, icon: TrendingUp },
        { label: 'Pays d\'intervention', value: 15, icon: Building }
    ];

    return (
        <FoundationLayout user={auth?.user}>
            <Head title={t('dashboard')} />
            
            {/* Hero Section avec Parallax */}
            <motion.section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
                style={{ y: heroY, opacity: heroOpacity }}
            >
                {/* Arrière-plan animé */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0 opacity-30"
                        animate={{
                            background: [
                                "radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%)",
                                "radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)",
                                "radial-gradient(circle at 40% 40%, #8b5cf6 0%, transparent 50%)"
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    {/* Particules flottantes */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Logo flottant */}
                        <motion.div
                            variants={iconFloat}
                            animate="animate"
                            className="mb-8"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <Heart className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-6">
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 mb-4">
                                Fondation Titi • Ensemble pour un impact durable
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                        >
                            Construisons ensemble un{' '}
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                avenir solidaire
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
                        >
                            Rejoignez notre communauté engagée et participez à des initiatives 
                            qui transforment positivement notre société. Votre impact commence ici.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                        >
                            <Button
                                size="lg"
                                className="bg-white text-slate-900 hover:bg-white/90 text-lg px-8 py-6 rounded-full group"
                            >
                                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Nous rejoindre
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/50 text-white hover:bg-white/20 hover:border-white/70 text-lg px-8 py-6 rounded-full group bg-white/5 backdrop-blur-sm"
                            >
                                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Voir notre impact
                            </Button>
                        </motion.div>

                        {/* Indicateurs de confiance */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap justify-center gap-8 text-white/60"
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>+2,850 membres</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                <span>15 pays</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                <span>ONG certifiée</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <motion.div
                            className="w-1 h-3 bg-white rounded-full mt-2"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* Section Domaines d'Action */}
            <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-6">
                    <FloatingCard className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                            Nos Domaines d'Action
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Découvrez comment vous pouvez contribuer à un impact positif 
                            à travers nos différents programmes
                        </p>
                    </FloatingCard>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {modules.map((module, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover="hover"
                                initial="rest"
                            >
                                <motion.div variants={cardHover}>
                                    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                                        {/* Gradient Header */}
                                        <div className={`h-48 bg-gradient-to-br ${module.gradient} relative overflow-hidden`}>
                                            <motion.div
                                                className="absolute inset-0 bg-black/20"
                                                whileHover={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <module.icon className="w-16 h-16 text-white" />
                                                </motion.div>
                                            </div>
                                            
                                            {/* Floating particles dans les cartes */}
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                                                    style={{
                                                        left: `${20 + i * 15}%`,
                                                        top: `${30 + i * 10}%`,
                                                    }}
                                                    animate={{
                                                        y: [0, -20, 0],
                                                        opacity: [0.3, 0.8, 0.3],
                                                    }}
                                                    transition={{
                                                        duration: 2 + i * 0.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.3,
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-semibold mb-3 group-hover:text-slate-900 transition-colors">
                                                {module.title}
                                            </h3>
                                            <p className="text-slate-600 mb-4 leading-relaxed">
                                                {module.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    className="p-0 h-auto text-slate-900 group-hover:text-slate-700"
                                                >
                                                    <Link href={module.href} className="flex items-center gap-2">
                                                        Découvrir
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </Button>
                                                
                                                <Badge variant="secondary" className="text-xs">
                                                    +{module.participants.toLocaleString()} participants
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section Statistiques */}
            <section className="py-24 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                {/* Pattern de fond décoratif */}
                <div className="absolute inset-0 opacity-5">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                            }}
                        />
                    ))}
                </div>
                
                <div className="container mx-auto px-6 relative">
                    <FloatingCard className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Notre Impact en 2024
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Des résultats concrets qui témoignent de notre engagement
                        </p>
                    </FloatingCard>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <FloatingCard key={index} delay={index * 0.1}>
                                <div className="text-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4"
                                    >
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    
                                    <h3 className="text-4xl font-bold text-white mb-2">
                                        <AnimatedCounter value={stat.value} />
                                        {stat.label.includes('FCFA') && 'M'}
                                        {stat.label.includes('Vies') && '+'}
                                    </h3>
                                    
                                    <p className="text-white/80 text-sm">
                                        {stat.label}
                                    </p>
                                </div>
                            </FloatingCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section Témoignage */}
            <section className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FloatingCard>
                            <Card className="p-8 border-0 shadow-xl">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Sarah Kouamé</h4>
                                            <p className="text-slate-600">Ambassadrice • Membre depuis 2022</p>
                                        </div>
                                    </div>
                                    
                                    <blockquote className="text-lg text-slate-700 italic mb-6 leading-relaxed">
                                        "Rejoindre cette fondation a transformé ma vision de l'engagement social. 
                                        Chaque projet que nous soutenons a un impact réel et mesurable. 
                                        Je recommande vivement de faire partie de cette belle aventure humaine."
                                    </blockquote>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <Badge variant="outline">Témoignage vérifié</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.2}>
                            <div className="space-y-6">
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                                    Rejoignez notre communauté
                                </h3>
                                
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Plus de 2,850 personnes nous font déjà confiance pour créer un impact positif 
                                    et durable. Ensemble, nous construisons un avenir meilleur.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-slate-700">Accompagnement personnalisé</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-slate-700">Impact mesurable et transparent</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-slate-700">Communauté bienveillante</span>
                                    </div>
                                </div>

                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                    Commencer mon engagement
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            {/* Section Newsletter */}
            <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="container mx-auto px-6">
                    <FloatingCard className="text-center max-w-2xl mx-auto">
                        <motion.div
                            variants={iconFloat}
                            animate="animate"
                            className="mb-8"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <h3 className="text-3xl font-bold text-slate-900 mb-4">
                            Restez connecté(e) à notre mission
                        </h3>
                        
                        <p className="text-lg text-slate-600 mb-8">
                            Recevez notre newsletter mensuelle avec les dernières nouvelles 
                            de nos actions et l'impact de votre soutien.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Votre adresse email"
                                className="flex-1"
                            />
                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                                <Send className="w-4 h-4 mr-2" />
                                S'abonner
                            </Button>
                        </div>

                        <div className="flex justify-center items-center gap-6 mt-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Sans spam
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Désabonnement facile
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </section>

            {/* Section Support */}
            <section className="py-24 bg-slate-900">
                <div className="container mx-auto px-6">
                    <FloatingCard className="text-center">
                        <motion.div
                            variants={iconFloat}
                            animate="animate"
                            className="mb-8"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full">
                                <Headphones className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <h3 className="text-3xl font-bold text-white mb-4">
                            Une question ? Notre équipe vous accompagne
                        </h3>
                        
                        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                            Bénéficiez de l'accompagnement personnalisé de nos experts pour maximiser 
                            votre impact social et tirer le meilleur parti de notre plateforme.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Démarrer une conversation
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/30 text-white hover:bg-white/10"
                            >
                                <BookOpen className="w-5 h-5 mr-2" />
                                Centre d'aide
                            </Button>
                        </div>
                    </FloatingCard>
                </div>
            </section>
        </FoundationLayout>
    );
}