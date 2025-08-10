import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users, Ticket, Clock, Shield, QrCode, RefreshCw, Plus, Info, Eye, Star } from 'lucide-react';

import { FoundationLayout } from '@/layouts/foundation-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ModernPageLayout, { FloatingCard, staggerContainer, fadeInUp, cardHover } from '@/components/modern-page-layout';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    tickets_available: number;
    total_tickets: number;
    image: string;
    category: string;
}

interface EventsIndexProps {
    auth?: {
        user: {
            name: string;
            email: string;
        };
    };
    events?: Event[];
}

export default function EventsIndex({ auth, events = [] }: EventsIndexProps) {
    const { t } = useTranslation();

    const mockEvents: Event[] = [
        {
            id: 1,
            title: 'Gala Annuel de la Fondation 2024',
            description: 'Soirée de gala pour célébrer les réussites de l\'année et lever des fonds pour nos projets.',
            date: '2024-06-15T19:00:00',
            location: 'Palais des Congrès, Paris',
            price: 150.00,
            tickets_available: 45,
            total_tickets: 200,
            image: '/images/gala2024.jpg',
            category: 'Gala'
        },
        {
            id: 2,
            title: 'Conférence Impact Social',
            description: 'Conférence sur l\'innovation sociale avec des experts internationaux.',
            date: '2024-04-20T14:00:00',
            location: 'Centre de Conventions, Lyon',
            price: 75.00,
            tickets_available: 120,
            total_tickets: 300,
            image: '/images/conference2024.jpg',
            category: 'Conférence'
        },
        {
            id: 3,
            title: 'Marathon Solidaire',
            description: 'Course caritative pour soutenir nos programmes d\'aide aux jeunes.',
            date: '2024-05-10T08:00:00',
            location: 'Parc de la Villette, Paris',
            price: 25.00,
            tickets_available: 0,
            total_tickets: 500,
            image: '/images/marathon2024.jpg',
            category: 'Sport'
        }
    ];

    const displayEvents = events.length > 0 ? events : mockEvents;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAvailabilityBadge = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        
        if (available === 0) {
            return <Badge className="bg-red-100 text-red-700">Complet</Badge>;
        } else if (percentage < 20) {
            return <Badge className="bg-orange-100 text-orange-700">Dernières places</Badge>;
        } else {
            return <Badge className="bg-emerald-100 text-emerald-700">Disponible</Badge>;
        }
    };

    const getEventGradient = (category: string) => {
        switch (category) {
            case 'Gala': return 'from-purple-500 via-pink-500 to-red-500';
            case 'Conférence': return 'from-blue-500 via-cyan-500 to-teal-500';
            case 'Sport': return 'from-green-500 via-emerald-500 to-teal-500';
            default: return 'from-indigo-500 via-purple-500 to-pink-500';
        }
    };

    const availableEvents = displayEvents.filter(e => e.tickets_available > 0).length;
    const totalTickets = displayEvents.reduce((sum, e) => sum + e.total_tickets, 0);
    const soldTickets = displayEvents.reduce((sum, e) => sum + (e.total_tickets - e.tickets_available), 0);

    return (
        <FoundationLayout user={auth?.user}>
            <Head title={t('events')} />
            
            <ModernPageLayout
                title="Événements & Billetterie"
                description="Découvrez nos événements exclusifs et réservez vos places pour des moments d'échange, de formation et de networking autour de l'impact social"
                icon={<Ticket className="w-8 h-8 text-white" />}
                showFooter={false}
            >
                {/* Section d'information */}
                <FloatingCard className="mb-12">
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <Ticket className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Billetterie sécurisée</h3>
                                <p className="text-slate-600">Tous nos événements avec un système de paiement fiable et sécurisé</p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Paiement sécurisé SSL</h4>
                                    <p className="text-sm text-slate-600">Transactions cryptées et protégées</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <QrCode className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-2">E-billets avec QR code</h4>
                                    <p className="text-sm text-slate-600">Billets électroniques pratiques</p>
                                </motion.div>
                                
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="text-center p-6 bg-white rounded-xl shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <RefreshCw className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Remboursement possible</h4>
                                    <p className="text-sm text-slate-600">Politique de remboursement flexible</p>
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
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{availableEvents}</h3>
                                <p className="text-sm text-slate-600">Événements disponibles</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.2}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{totalTickets.toLocaleString()}</h3>
                                <p className="text-sm text-slate-600">Places totales</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.3}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Ticket className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{soldTickets.toLocaleString()}</h3>
                                <p className="text-sm text-slate-600">Billets vendus</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                    
                    <FloatingCard delay={0.4}>
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{displayEvents.length}</h3>
                                <p className="text-sm text-slate-600">Total événements</p>
                            </CardContent>
                        </Card>
                    </FloatingCard>
                </div>

                {/* Actions principales */}
                <FloatingCard className="mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white group"
                        >
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Organiser un événement
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Voir le calendrier
                        </Button>
                    </div>
                </FloatingCard>

                {/* Liste des événements */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12"
                >
                    {displayEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            variants={fadeInUp}
                            whileHover="hover"
                            initial="rest"
                        >
                            <motion.div variants={cardHover}>
                                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                                    {/* Header avec gradient */}
                                    <div className={`h-48 bg-gradient-to-br ${getEventGradient(event.category)} relative overflow-hidden`}>
                                        <motion.div
                                            className="absolute inset-0 bg-black/20"
                                            whileHover={{ opacity: 0.1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        
                                        {/* Badge de catégorie */}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-black/50 text-white border-0">
                                                {event.category}
                                            </Badge>
                                        </div>
                                        
                                        {/* Badge de disponibilité */}
                                        <div className="absolute top-4 right-4">
                                            {getAvailabilityBadge(event.tickets_available, event.total_tickets)}
                                        </div>
                                        
                                        {/* Icône centrale */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Calendar className="w-20 h-20 text-white/30" />
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
                                        <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-slate-600 mb-4 leading-relaxed flex-grow">
                                            {event.description}
                                        </p>
                                        
                                        {/* Informations */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(event.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Users className="w-4 h-4" />
                                                <span>{event.tickets_available} / {event.total_tickets} places disponibles</span>
                                            </div>
                                            
                                            {event.tickets_available > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Disponibilité</span>
                                                        <span className="font-medium">
                                                            {Math.round((event.tickets_available / event.total_tickets) * 100)}%
                                                        </span>
                                                    </div>
                                                    <Progress 
                                                        value={(event.tickets_available / event.total_tickets) * 100} 
                                                        className="h-2"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Prix et actions */}
                                        <div className="border-t pt-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-slate-500">Prix</p>
                                                <p className="font-bold text-emerald-600">
                                                    {(event.price * 500).toLocaleString()} FCFA
                                                </p>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="group"
                                                >
                                                    <Link href={`/events/${event.id}`}>
                                                        <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                        Détails
                                                    </Link>
                                                </Button>
                                                
                                                {event.tickets_available > 0 ? (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 group"
                                                    >
                                                        <Link href={`/events/${event.id}/booking`}>
                                                            <Ticket className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                                            Réserver
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        disabled
                                                    >
                                                        Complet
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
                {displayEvents.length === 0 && (
                    <FloatingCard>
                        <Card className="border-0 shadow-lg">
                            <CardContent className="text-center py-16">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                        Aucun événement programmé
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        De nouveaux événements seront bientôt annoncés.
                                    </p>
                                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Proposer un événement
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