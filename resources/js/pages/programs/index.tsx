import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, Calendar, Users, Send, Eye, AlertTriangle, GraduationCap, Target, Award, Search, Filter, Plus } from 'lucide-react';

import { FoundationLayout } from '@/layouts/foundation-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import ModernPageLayout, { FloatingCard, staggerContainer, fadeInUp, cardHover } from '@/components/modern-page-layout';

interface Program {
    id: number;
    title: string;
    description: string;
    type: 'formation' | 'insertion' | 'atelier' | 'challenge';
    duration: string;
    startDate: string;
    deadline: string;
    requirements: string[];
    benefits: string[];
    spots: number;
    applications: number;
    status: 'open' | 'closing-soon' | 'closed';
}

interface ProgramsIndexProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
    programs?: Program[];
}

export default function ProgramsIndex({ auth, programs = [] }: ProgramsIndexProps) {
    const { t } = useTranslation();

    const mockPrograms: Program[] = [
        {
            id: 1,
            title: 'Programme d\'Insertion Professionnelle 2024',
            description: 'Formation intensive de 6 mois pour faciliter l\'insertion professionnelle des jeunes diplômés dans le secteur du numérique.',
            type: 'insertion',
            duration: '6 mois',
            startDate: '2024-04-01',
            deadline: '2024-03-15',
            requirements: [
                'Diplôme BAC+3 minimum',
                'Âge entre 18-30 ans',
                'Motivation et projet professionnel défini',
                'Disponibilité à temps plein'
            ],
            benefits: [
                'Formation certifiante',
                'Accompagnement personnalisé',
                'Réseau professionnel',
                'Stage garanti en entreprise',
                'Suivi post-formation 12 mois'
            ],
            spots: 25,
            applications: 18,
            status: 'open'
        },
        {
            id: 2,
            title: 'Atelier Entrepreneuriat Social',
            description: 'Série d\'ateliers pour développer les compétences entrepreneuriales dans le domaine de l\'impact social.',
            type: 'atelier',
            duration: '3 mois',
            startDate: '2024-03-20',
            deadline: '2024-03-10',
            requirements: [
                'Projet entrepreneurial social en cours',
                'Expérience associative souhaitée',
                'Disponibilité les weekends'
            ],
            benefits: [
                'Mentorat d\'experts',
                'Pitch devant investisseurs',
                'Boîte à outils complète',
                'Réseau d\'entrepreneurs'
            ],
            spots: 15,
            applications: 22,
            status: 'closing-soon'
        },
        {
            id: 3,
            title: 'Formation Leadership Féminin',
            description: 'Programme dédié au développement du leadership féminin dans les secteurs d\'impact.',
            type: 'formation',
            duration: '4 mois',
            startDate: '2024-05-15',
            deadline: '2024-04-30',
            requirements: [
                'Femme active professionnellement',
                'Expérience managériale de 2+ ans',
                'Volonté d\'impact social'
            ],
            benefits: [
                'Coaching personnel',
                'Réseau de femmes leaders',
                'Certification leadership',
                'Conférences exclusives'
            ],
            spots: 20,
            applications: 8,
            status: 'open'
        },
        {
            id: 4,
            title: 'Challenge Innovation Verte',
            description: 'Concours d\'innovation pour développer des solutions environnementales durables.',
            type: 'challenge',
            duration: '2 mois',
            startDate: '2024-02-01',
            deadline: '2024-01-31',
            requirements: [
                'Équipe de 2-5 personnes',
                'Projet innovation environnementale',
                'Présentation prototype fonctionnel'
            ],
            benefits: [
                'Prix de 25M FCFA',
                'Incubation 1 an',
                'Mentorat experts',
                'Médiatisation du projet'
            ],
            spots: 30,
            applications: 45,
            status: 'closed'
        }
    ];

    const displayPrograms = programs.length > 0 ? programs : mockPrograms;

    const getStatusBadge = (status: string) => {
        const configs = {
            open: { className: 'bg-emerald-100 text-emerald-700', text: 'Inscriptions ouvertes' },
            'closing-soon': { className: 'bg-orange-100 text-orange-700', text: 'Clôture bientôt' },
            closed: { className: 'bg-red-100 text-red-700', text: 'Inscriptions fermées' }
        };
        
        const config = configs[status as keyof typeof configs];
        return <Badge className={config.className}>{config.text}</Badge>;
    };

    const getTypeLabel = (type: string) => {
        const labels = {
            formation: 'Formation',
            insertion: 'Insertion Pro',
            atelier: 'Atelier',
            challenge: 'Challenge'
        };
        return labels[type as keyof typeof labels];
    };

    const getTypeGradient = (type: string) => {
        const gradients = {
            formation: 'from-blue-500 via-indigo-500 to-purple-500',
            insertion: 'from-emerald-500 via-teal-500 to-cyan-500',
            atelier: 'from-orange-500 via-amber-500 to-yellow-500',
            challenge: 'from-pink-500 via-rose-500 to-red-500'
        };
        return gradients[type as keyof typeof gradients];
    };

    const getTypeIcon = (type: string) => {
        const icons = {
            formation: BookOpen,
            insertion: Target,
            atelier: Users,
            challenge: Award
        };
        const IconComponent = icons[type as keyof typeof icons];
        return <IconComponent className="w-6 h-6 text-white" />;
    };

    const openPrograms = displayPrograms.filter(p => p.status === 'open').length;
    const totalSpots = displayPrograms.reduce((sum, p) => sum + p.spots, 0);
    const totalApplications = displayPrograms.reduce((sum, p) => sum + p.applications, 0);

    return (
        <FoundationLayout user={auth?.user}>
            <Head title={t('programs')} />
            
            <ModernPageLayout
                title="Programmes & Formations"
                description="Transformez votre carrière avec nos programmes de formation, d'insertion et de leadership. Rejoignez une nouvelle génération d'acteurs du changement social"
                icon={<GraduationCap className="w-8 h-8 text-white" />}
                showFooter={false}
            >
                {/* Section d'information */}
                <FloatingCard className="mb-12">
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                                    <GraduationCap className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Comment candidater ?</h3>
                                <p className="text-slate-600">Rejoignez nos programmes en 4 étapes simples</p>
                            </div>
                            
                            <div className="grid md:grid-cols-4 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Consultez les prérequis</h4>
                                    <p className="text-sm text-slate-600">Vérifiez votre éligibilité</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Complétez votre candidature</h4>
                                    <p className="text-sm text-slate-600">Soumettez votre dossier complet</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">3</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Entretien de sélection</h4>
                                    <p className="text-sm text-slate-600">Présentation de votre motivation</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold">4</span>
                                    </div>
                                    <h4 className="font-semibold mb-2">Confirmation d'acceptation</h4>
                                    <p className="text-sm text-slate-600">Notification et intégration</p>
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
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{openPrograms}</h3>
                                <p className="text-sm text-slate-600">Programmes ouverts</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.2}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{totalSpots}</h3>
                                <p className="text-sm text-slate-600">Places disponibles</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.3}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Send className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{totalApplications}</h3>
                                <p className="text-sm text-slate-600">Candidatures reçues</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.4}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{displayPrograms.length}</h3>
                                <p className="text-sm text-slate-600">Total programmes</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                </div>

                {/* Filtres et recherche */}
                <FloatingCard className="mb-12">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Type de programme</label>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Tous les types" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Statut</label>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Tous les statuts" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Recherche</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Rechercher un programme..." className="pl-10" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FloatingCard>

                {/* Actions principales */}
                <FloatingCard className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white group"
                        >
                            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                            Candidater maintenant
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Voir le calendrier
                        </Button>
                    </div>
                </FloatingCard>

                {/* Liste des programmes */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-8 mb-12"
                >
                    {displayPrograms.map((program, index) => (
                        <motion.div
                            key={program.id}
                            variants={fadeInUp}
                            whileHover="hover"
                            initial="rest"
                        >
                            <motion.div variants={cardHover}>
                                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                                    {/* Header avec gradient */}
                                    <div className={`h-48 bg-gradient-to-br ${getTypeGradient(program.type)} relative overflow-hidden`}>
                                        <motion.div
                                            className="absolute inset-0 bg-black/20"
                                            whileHover={{ opacity: 0.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        
                                        {/* Badge de type */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-black/50 text-white border-0">
                                                {getTypeLabel(program.type)}
                                            </Badge>
                                        </div>
                                        
                                        {/* Badge de statut */}
                                        <div className="absolute top-4 right-4">
                                            {getStatusBadge(program.status)}
                                        </div>
                                        
                                        {/* Icône centrale */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                                            >
                                                {getTypeIcon(program.type)}
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
                                        <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600 transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 leading-relaxed flex-grow">
                                            {program.description}
                                        </p>
                                        
                                        {/* Informations clés */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-4 h-4" />
                                                <div>
                                                    <div className="font-medium">{program.duration}</div>
                                                    <div className="text-xs text-slate-500">Durée</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Calendar className="w-4 h-4" />
                                                <div>
                                                    <div className="font-medium">
                                                        {new Date(program.startDate).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div className="text-xs text-slate-500">Début</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Users className="w-4 h-4" />
                                                <div>
                                                    <div className="font-medium">{program.spots} places</div>
                                                    <div className="text-xs text-slate-500">Disponibles</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Send className="w-4 h-4" />
                                                <div>
                                                    <div className="font-medium">{program.applications} reçues</div>
                                                    <div className="text-xs text-slate-500">Candidatures</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Date limite */}
                                        {program.status !== 'closed' && (
                                            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                                <div className="flex items-center gap-2 text-sm text-orange-700">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        Date limite : {new Date(program.deadline).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Progression des candidatures */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Taux de candidature</span>
                                                <span className="font-medium">
                                                    {Math.round((program.applications / program.spots) * 100)}%
                                                </span>
                                            </div>
                                            <Progress 
                                                value={(program.applications / program.spots) * 100} 
                                                className="h-2"
                                            />
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="border-t pt-4 flex gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 group"
                                            >
                                                <Link href={`/programs/${program.id}`}>
                                                    <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                    Détails
                                                </Link>
                                            </Button>
                                            
                                            {program.status === 'open' && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 group"
                                                >
                                                    <Link href={`/programs/${program.id}/apply`}>
                                                        <Send className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                                                        Candidater
                                                    </Link>
                                                </Button>
                                            )}
                                            
                                            {program.status === 'closing-soon' && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 group"
                                                >
                                                    <Link href={`/programs/${program.id}/apply`}>
                                                        <AlertTriangle className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                        Derniers jours
                                                    </Link>
                                                </Button>
                                            )}
                                            
                                            {program.status === 'closed' && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="flex-1"
                                                    disabled
                                                >
                                                    Fermé
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* État vide */}
                {displayPrograms.length === 0 && (
                    <FloatingCard>
                        <Card className="border-0 shadow-lg">
                            <CardContent className="text-center py-16">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                        Aucun programme disponible
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        De nouveaux programmes seront bientôt proposés.
                                    </p>
                                    <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Proposer un programme
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