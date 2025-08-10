import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, ThumbsUp, Eye, Plus, Info, Calendar, Award, DollarSign, Timer } from 'lucide-react';

import { FoundationLayout } from '@/layouts/foundation-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ModernPageLayout, { FloatingCard, staggerContainer, fadeInUp, cardHover } from '@/components/modern-page-layout';

interface Contest {
    id: number;
    title: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    vote_price: number;
    total_votes: number;
    status: 'upcoming' | 'active' | 'ended';
    participants_count: number;
}

interface ContestsIndexProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
    contests: Contest[];
}

const getStatusBadge = (status: string) => {
    const statusConfig = {
        upcoming: { variant: 'secondary' as const, label: 'À venir', color: 'bg-slate-100 text-slate-700' },
        active: { variant: 'default' as const, label: 'En cours', color: 'bg-emerald-100 text-emerald-700' },
        ended: { variant: 'destructive' as const, label: 'Terminé', color: 'bg-red-100 text-red-700' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
};

export default function ContestsIndex({ auth, contests = [] }: ContestsIndexProps) {
    const { t } = useTranslation();

    const mockContests: Contest[] = [
        {
            id: 1,
            title: 'Concours Innovation Sociale 2024',
            description: 'Récompensons les projets les plus innovants en matière d\'impact social et environnemental pour construire un avenir durable.',
            image: '/images/contest1.jpg',
            start_date: '2024-03-01',
            end_date: '2024-03-31',
            vote_price: 5.00,
            total_votes: 1250,
            status: 'active',
            participants_count: 25
        },
        {
            id: 2,
            title: 'Prix du Jeune Entrepreneur',
            description: 'Soutenez les jeunes talents entrepreneuriaux qui changent le monde avec leurs idées révolutionnaires.',
            image: '/images/contest2.jpg',
            start_date: '2024-04-01',
            end_date: '2024-04-30',
            vote_price: 3.00,
            total_votes: 0,
            status: 'upcoming',
            participants_count: 18
        },
        {
            id: 3,
            title: 'Challenge Développement Durable',
            description: 'Les meilleures initiatives pour un avenir plus durable et respectueux de l\'environnement.',
            image: '/images/contest3.jpg',
            start_date: '2024-02-01',
            end_date: '2024-02-28',
            vote_price: 7.50,
            total_votes: 2340,
            status: 'ended',
            participants_count: 32
        }
    ];

    const displayContests = contests.length > 0 ? contests : mockContests;
    const activeContests = displayContests.filter(c => c.status === 'active').length;

    return (
        <FoundationLayout user={auth?.user}>
            <Head title={t('contests')} />
            
            <ModernPageLayout
                title="Concours & Votes"
                description="Participez aux votes payants et soutenez les projets qui vous tiennent à cœur. Votre vote fait la différence dans la sélection des meilleures initiatives."
                icon={<Trophy className="w-8 h-8 text-white" />}
                showFooter={false}
            >
                {/* Section d'information */}
                <FloatingCard className="mb-12">
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                                    <Info className="w-8 h-8 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Comment ça marche ?</h3>
                                <p className="text-slate-600">Découvrez comment participer aux concours en 3 étapes simples</p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Parcourez les concours</h4>
                                    <p className="text-sm text-slate-600">Découvrez les concours actifs et à venir</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Achetez des votes</h4>
                                    <p className="text-sm text-slate-600">Soutenez financièrement les projets</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">3</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Suivez les résultats</h4>
                                    <p className="text-sm text-slate-600">Résultats en temps réel et transparent</p>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </FloatingCard>

                {/* Statistiques rapides */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <FloatingCard delay={0.1}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Trophy className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{activeContests}</h3>
                                <p className="text-sm text-slate-600">Concours actifs</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.2}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {displayContests.reduce((sum, c) => sum + c.participants_count, 0)}
                                </h3>
                                <p className="text-sm text-slate-600">Participants total</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.3}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ThumbsUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">
                                    {displayContests.reduce((sum, c) => sum + c.total_votes, 0).toLocaleString()}
                                </h3>
                                <p className="text-sm text-slate-600">Votes totaux</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.4}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{displayContests.length}</h3>
                                <p className="text-sm text-slate-600">Total concours</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                </div>

                {/* Actions principales */}
                <FloatingCard className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white group"
                        >
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Proposer un concours
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                            <Info className="w-5 h-5 mr-2" />
                            Guide de participation
                        </Button>
                    </div>
                </FloatingCard>

                {/* Liste des concours */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {displayContests.map((contest, index) => (
                        <motion.div
                            key={contest.id}
                            variants={fadeInUp}
                            whileHover="hover"
                            initial="rest"
                        >
                            <motion.div variants={cardHover}>
                                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                                    {/* Header avec gradient */}
                                    <div className="h-48 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
                                        <motion.div
                                            className="absolute inset-0 bg-black/20"
                                            whileHover={{ opacity: 0.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        
                                        {/* Badge de statut */}
                                        <div className="absolute top-4 left-4">
                                            {getStatusBadge(contest.status)}
                                        </div>
                                        
                                        {/* Icône centrale */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Trophy className="w-20 h-20 text-white/30" />
                                            </motion.div>
                                        </div>
                                        
                                        {/* Particules flottantes */}
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-2 h-2 bg-white/30 rounded-full"
                                                style={{
                                                    left: `${20 + i * 25}%`,
                                                    top: `${30 + i * 15}%`,
                                                }}
                                                animate={{
                                                    y: [0, -15, 0],
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

                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-600 transition-colors">
                                            {contest.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 leading-relaxed flex-grow">
                                            {contest.description}
                                        </p>
                                        
                                        {/* Statistiques */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>{contest.participants_count} participants</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span>{contest.total_votes.toLocaleString()} votes</span>
                                                </div>
                                            </div>
                                            
                                            {contest.status === 'active' && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Progression</span>
                                                        <span className="font-medium">
                                                            {Math.round((contest.total_votes / 3000) * 100)}%
                                                        </span>
                                                    </div>
                                                    <Progress 
                                                        value={(contest.total_votes / 3000) * 100} 
                                                        className="h-2"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Prix et actions */}
                                        <div className="border-t pt-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-slate-500">Prix du vote</p>
                                                <p className="font-bold text-emerald-600">
                                                    {(contest.vote_price * 500).toLocaleString()} FCFA
                                                </p>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="group"
                                                >
                                                    <Link href={`/contests/${contest.id}`}>
                                                        <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                        Voir
                                                    </Link>
                                                </Button>
                                                
                                                {contest.status === 'active' && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 group"
                                                    >
                                                        <Link href={`/contests/${contest.id}/vote`}>
                                                            <ThumbsUp className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                            Voter
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* État vide */}
                {displayContests.length === 0 && (
                    <FloatingCard>
                        <Card className="border-0 shadow-lg">
                            <CardContent className="text-center py-16">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Trophy className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                        Aucun concours disponible
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        Les nouveaux concours apparaîtront ici prochainement.
                                    </p>
                                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Proposer un concours
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                )}
            </ModernPageLayout>
        </FoundationLayout>
    );
}