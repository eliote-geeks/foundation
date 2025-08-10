import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Building, Handshake, Award, Globe, Mail, Calendar, CheckCircle, Star, Search, Filter, Plus, Building2 } from 'lucide-react';

import { FoundationLayout } from '@/layouts/foundation-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModernPageLayout, { FloatingCard, staggerContainer, fadeInUp, cardHover } from '@/components/modern-page-layout';

interface Partner {
    id: number;
    name: string;
    logo: string;
    description: string;
    sector: string;
    partnershipType: 'gold' | 'silver' | 'bronze';
    website: string;
    collaborations: string[];
    joinedDate: string;
}

interface PartnersIndexProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
    partners?: Partner[];
}

export default function PartnersIndex({ auth, partners = [] }: PartnersIndexProps) {
    const { t } = useTranslation();

    const mockPartners: Partner[] = [
        {
            id: 1,
            name: 'TechCorp Solutions',
            logo: '/images/partners/techcorp.png',
            description: 'Leader technologique engagé dans l\'innovation sociale et la formation des jeunes talents.',
            sector: 'Technologie',
            partnershipType: 'gold',
            website: 'https://techcorp.com',
            collaborations: ['Formation développeurs', 'Stages rémunérés', 'Mentorat technique'],
            joinedDate: '2022-01-15'
        },
        {
            id: 2,
            name: 'EcoGreen Industries',
            logo: '/images/partners/ecogreen.png',
            description: 'Entreprise spécialisée dans les solutions durables et l\'économie circulaire.',
            sector: 'Environnement',
            partnershipType: 'silver',
            website: 'https://ecogreen.com',
            collaborations: ['Challenge environnemental', 'Consulting RSE'],
            joinedDate: '2023-03-20'
        },
        {
            id: 3,
            name: 'FinanceForAll',
            logo: '/images/partners/financeforall.png',
            description: 'Institution financière proposant des solutions inclusives et accessibles.',
            sector: 'Finance',
            partnershipType: 'gold',
            website: 'https://financeforall.com',
            collaborations: ['Microcrédits', 'Éducation financière', 'Insertion bancaire'],
            joinedDate: '2021-09-10'
        },
        {
            id: 4,
            name: 'HealthCare Connect',
            logo: '/images/partners/healthcare.png',
            description: 'Réseau de santé digitale pour l\'amélioration de l\'accès aux soins.',
            sector: 'Santé',
            partnershipType: 'bronze',
            website: 'https://healthcare-connect.com',
            collaborations: ['Téléconsultation gratuite'],
            joinedDate: '2023-11-05'
        }
    ];

    const displayPartners = partners.length > 0 ? partners : mockPartners;

    const partnershipLevels = {
        gold: {
            name: 'Partenaire Or',
            color: 'warning',
            benefits: [
                'Logo sur tous nos supports',
                'Accès prioritaire aux talents',
                'Événements VIP exclusifs',
                'Rapports d\'impact trimestriels',
                'Co-création de programmes',
                'Visibilité médiatique'
            ],
            investment: '25M+ FCFA / an'
        },
        silver: {
            name: 'Partenaire Argent',
            color: 'secondary',
            benefits: [
                'Logo sur site web',
                'Accès aux talents formés',
                'Invitation événements',
                'Rapports d\'impact annuels',
                'Participation aux challenges'
            ],
            investment: '12M+ FCFA / an'
        },
        bronze: {
            name: 'Partenaire Bronze',
            color: 'warning',
            benefits: [
                'Mention sur supports',
                'Newsletter partenaires',
                'Événements networking',
                'Rapport d\'impact global'
            ],
            investment: '5M+ FCFA / an'
        }
    };

    const getPartnershipBadge = (type: keyof typeof partnershipLevels) => {
        const level = partnershipLevels[type];
        const colorClasses = {
            warning: 'bg-amber-100 text-amber-700',
            secondary: 'bg-slate-100 text-slate-700',
        };
        return <Badge className={colorClasses[level.color as keyof typeof colorClasses]}>{level.name}</Badge>;
    };

    const getPartnershipGradient = (type: keyof typeof partnershipLevels) => {
        const gradients = {
            gold: 'from-yellow-400 via-amber-500 to-orange-600',
            silver: 'from-slate-300 via-slate-400 to-slate-500',
            bronze: 'from-amber-600 via-orange-600 to-red-600'
        };
        return gradients[type];
    };

    const getPartnershipIcon = (type: keyof typeof partnershipLevels) => {
        const icons = {
            gold: Star,
            silver: Award,
            bronze: Building
        };
        const IconComponent = icons[type];
        return <IconComponent className="w-6 h-6 text-white" />;
    };

    const goldPartners = displayPartners.filter(p => p.partnershipType === 'gold').length;
    const silverPartners = displayPartners.filter(p => p.partnershipType === 'silver').length;
    const bronzePartners = displayPartners.filter(p => p.partnershipType === 'bronze').length;

    return (
        <FoundationLayout user={auth?.user}>
            <Head title="Partenaires" />
            
            <ModernPageLayout
                title="Partenaires & Collaboration"
                description="Découvrez nos partenaires engagés et rejoignez un écosystème d'entreprises qui transforment leur engagement RSE en impact réel et mesurable"
                icon={<Building className="w-8 h-8 text-white" />}
                showFooter={false}
            >
                {/* Statistiques rapides */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <FloatingCard delay={0.1}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Building2 className="w-6 h-6 text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{displayPartners.length}</h3>
                                <p className="text-sm text-slate-600">Partenaires actifs</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.2}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{goldPartners}</h3>
                                <p className="text-sm text-slate-600">Partenaires Or</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.3}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Award className="w-6 h-6 text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{silverPartners}</h3>
                                <p className="text-sm text-slate-600">Partenaires Argent</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.4}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Building className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{bronzePartners}</h3>
                                <p className="text-sm text-slate-600">Partenaires Bronze</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                </div>

                {/* Actions principales */}
                <FloatingCard className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white group"
                        >
                            <Handshake className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Devenir partenaire
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                            <Building className="w-5 h-5 mr-2" />
                            Voir notre impact
                        </Button>
                    </div>
                </FloatingCard>

                <Tabs defaultValue="partners" className="mb-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="partners" className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Nos Partenaires ({displayPartners.length})
                        </TabsTrigger>
                        <TabsTrigger value="partnership-levels" className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Niveaux de Partenariat
                        </TabsTrigger>
                        <TabsTrigger value="become-partner" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Devenir Partenaire
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="partners" className="mt-8">
                        {/* Filtres et recherche */}
                        <FloatingCard className="mb-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Secteur</label>
                                            <div className="relative">
                                                <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input placeholder="Tous les secteurs" className="pl-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Niveau de partenariat</label>
                                            <div className="relative">
                                                <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input placeholder="Tous les niveaux" className="pl-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Recherche</label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input placeholder="Rechercher un partenaire..." className="pl-10" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FloatingCard>

                        {/* Liste des partenaires */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {displayPartners.map((partner, index) => (
                                <motion.div
                                    key={partner.id}
                                    variants={fadeInUp}
                                    whileHover="hover"
                                    initial="rest"
                                >
                                    <motion.div variants={cardHover}>
                                        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                                            {/* Header avec gradient */}
                                            <div className={`h-32 bg-gradient-to-br ${getPartnershipGradient(partner.partnershipType)} relative overflow-hidden`}>
                                                <motion.div
                                                    className="absolute inset-0 bg-black/20"
                                                    whileHover={{ opacity: 0.1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                                
                                                {/* Badge de secteur */}
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-black/50 text-white border-0">
                                                        {partner.sector}
                                                    </Badge>
                                                </div>
                                                
                                                {/* Badge de partenariat */}
                                                <div className="absolute top-4 right-4">
                                                    {getPartnershipBadge(partner.partnershipType)}
                                                </div>
                                                
                                                {/* Icône centrale */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                                                    >
                                                        <Building className="w-8 h-8 text-white" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <CardContent className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-xl font-semibold mb-3 group-hover:text-slate-600 transition-colors">
                                                    {partner.name}
                                                </h3>
                                                <p className="text-slate-600 mb-4 leading-relaxed flex-grow">
                                                    {partner.description}
                                                </p>
                                                
                                                {/* Collaborations */}
                                                <div className="mb-4">
                                                    <h6 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                                        <Handshake className="w-4 h-4" />
                                                        Collaborations actives
                                                    </h6>
                                                    <div className="flex flex-wrap gap-2">
                                                        {partner.collaborations.map((collab, index) => (
                                                            <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                                                                {collab}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="border-t pt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Depuis {new Date(partner.joinedDate).getFullYear()}</span>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="group"
                                                        >
                                                            <Globe className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                            Site web
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="group"
                                                        >
                                                            <Mail className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                            Contact
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="partnership-levels" className="mt-8">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {Object.entries(partnershipLevels).map(([key, level], index) => (
                                <motion.div
                                    key={key}
                                    variants={fadeInUp}
                                    whileHover="hover"
                                    initial="rest"
                                >
                                    <motion.div variants={cardHover}>
                                        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full text-center">
                                            {/* Header avec gradient */}
                                            <div className={`h-48 bg-gradient-to-br ${getPartnershipGradient(key as keyof typeof partnershipLevels)} relative overflow-hidden`}>
                                                <motion.div
                                                    className="absolute inset-0 bg-black/20"
                                                    whileHover={{ opacity: 0.1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                                
                                                {/* Icône centrale */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                                                    >
                                                        {getPartnershipIcon(key as keyof typeof partnershipLevels)}
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
                                                <h4 className="text-xl font-bold mb-3">{level.name}</h4>
                                                <div className="text-2xl font-bold text-slate-700 mb-6">{level.investment}</div>
                                                
                                                <div className="text-left mb-6 flex-grow">
                                                    <h6 className="font-semibold mb-3 text-slate-700">Avantages inclus :</h6>
                                                    <ul className="space-y-2">
                                                        {level.benefits.map((benefit, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                <span className="text-sm text-slate-600">{benefit}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                
                                                <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white group">
                                                    <Handshake className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Nous rejoindre
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="become-partner" className="mt-8">
                        <div className="max-w-4xl mx-auto">
                            <FloatingCard>
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <Handshake className="w-10 h-10 text-white" />
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Rejoignez Notre Écosystème</h3>
                                            <p className="text-slate-600 max-w-2xl mx-auto">
                                                Ensemble, construisons un avenir plus inclusif et durable. 
                                                Devenez partenaire et participez à une transformation sociale d'envergure.
                                            </p>
                                        </div>
                                        
                                        <form className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Nom de l'entreprise *</label>
                                                    <Input required placeholder="Votre entreprise" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Secteur d'activité *</label>
                                                    <Input required placeholder="Technologie, Finance, etc." />
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Nom du contact *</label>
                                                    <Input required placeholder="Votre nom" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Email professionnel *</label>
                                                    <Input type="email" required placeholder="contact@entreprise.com" />
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Téléphone</label>
                                                    <Input type="tel" placeholder="+237 6XX XXX XXX" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700">Site web</label>
                                                    <Input type="url" placeholder="https://votre-site.com" />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-slate-700">Type de partenariat souhaité</label>
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input type="radio" name="partnership" id="bronze-option" className="text-orange-600" />
                                                            <label htmlFor="bronze-option" className="font-medium cursor-pointer">
                                                                Bronze (5M+ FCFA)
                                                            </label>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">Partenariat de base</p>
                                                    </motion.div>
                                                    
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input type="radio" name="partnership" id="silver-option" className="text-slate-600" />
                                                            <label htmlFor="silver-option" className="font-medium cursor-pointer">
                                                                Argent (12M+ FCFA)
                                                            </label>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">Partenariat avancé</p>
                                                    </motion.div>
                                                    
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input type="radio" name="partnership" id="gold-option" className="text-amber-600" />
                                                            <label htmlFor="gold-option" className="font-medium cursor-pointer">
                                                                Or (25M+ FCFA)
                                                            </label>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">Partenariat premium</p>
                                                    </motion.div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Message / Présentation de votre projet *</label>
                                                <textarea 
                                                    required 
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                                    placeholder="Présentez votre entreprise, vos objectifs RSE et comment vous souhaitez collaborer avec notre fondation..."
                                                />
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="terms" 
                                                    required 
                                                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                                                />
                                                <label htmlFor="terms" className="text-sm text-slate-600">
                                                    J'accepte les conditions de partenariat et la politique de confidentialité
                                                </label>
                                            </div>
                                            
                                            <div className="text-center">
                                                <Button 
                                                    type="submit" 
                                                    size="lg" 
                                                    className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white group"
                                                >
                                                    <Mail className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                                    Envoyer ma demande
                                                </Button>
                                            </div>
                                            
                                            <div className="text-center">
                                                <p className="text-sm text-slate-500">
                                                    Notre équipe vous contactera sous 48h pour étudier votre demande
                                                </p>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </FloatingCard>
                        </div>
                    </TabsContent>
                </Tabs>
            </ModernPageLayout>
        </FoundationLayout>
    );
}