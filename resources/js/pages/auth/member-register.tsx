import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AuthLayout } from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, User, Mail, Lock, Phone, MapPin, Briefcase, Heart, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemberFormData {
    // Informations de base (existantes)
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    
    // Nouvelles informations de profil membre
    profile_type: 'adherent' | 'ambassador' | 'alumni' | 'volunteer';
    first_name: string;
    last_name: string;
    phone: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    city: string;
    country: string;
    profession: string;
    company: string;
    education_level: string;
    motivation: string;
    previous_experience: string;
    skills: string[];
    availability: string[];
    interests: string[];
    communication_preferences: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
        newsletter: boolean;
    };
    terms_accepted: boolean;
    privacy_accepted: boolean;
}

const profileTypes = {
    adherent: {
        name: 'Adhérent Fondation',
        description: 'Rejoignez notre communauté et participez à nos actions',
        price: '25 000 FCFA/an',
        color: 'primary',
        icon: 'bi-person-check',
        benefits: [
            'Accès aux événements membres',
            'Newsletter mensuelle exclusive',
            'Vote aux assemblées générales',
            'Tarifs préférentiels sur les événements',
            'Accès à la plateforme communautaire'
        ]
    },
    ambassador: {
        name: 'Ambassadeur',
        description: 'Devenez porte-parole de nos valeurs et missions',
        price: '75 000 FCFA/an',
        color: 'success',
        icon: 'bi-megaphone',
        benefits: [
            'Tous les avantages adhérent',
            'Formation leadership social',
            'Participation aux décisions stratégiques',
            'Kit communication personnalisé',
            'Invitations événements VIP',
            'Mentorat de nouveaux membres'
        ]
    },
    alumni: {
        name: 'Alumni Challenger',
        description: 'Réseau exclusif des anciens participants aux programmes',
        price: 'Gratuit',
        color: 'warning',
        icon: 'bi-trophy',
        benefits: [
            'Accès réseau alumni exclusif',
            'Mentorat nouvelles générations',
            'Opportunités professionnelles',
            'Événements networking premium',
            'Plateforme d\'entraide',
            'Certification alumni'
        ]
    },
    volunteer: {
        name: 'Bénévole Actif',
        description: 'Contribuez activement à nos missions sur le terrain',
        price: 'Gratuit',
        color: 'info',
        icon: 'bi-hand-thumbs-up',
        benefits: [
            'Formations spécialisées gratuites',
            'Certificats de bénévolat',
            'Remboursement frais mission',
            'Assurance activités',
            'Reconnaissance annuelle',
            'Accès prioritaire aux missions'
        ]
    }
};

const skillsOptions = [
    'Communication', 'Marketing digital', 'Gestion de projet', 'Formation/Éducation',
    'Comptabilité/Finance', 'Développement web', 'Design graphique', 'Photographie',
    'Vidéo/Montage', 'Rédaction', 'Traduction', 'Animation communautaire',
    'Collecte de fonds', 'Événementiel', 'Relations publiques', 'Juridique'
];

const availabilityOptions = [
    'Weekends seulement', 'Soirées en semaine', 'Temps plein disponible',
    'Missions ponctuelles', 'Télétravail possible', 'Déplacements régionaux',
    'Missions internationales', 'Urgences/Crises'
];

const interestOptions = [
    'Éducation et formation', 'Environnement et développement durable',
    'Santé et bien-être', 'Inclusion sociale', 'Entrepreneuriat social',
    'Technologies pour le développement', 'Droits humains', 'Genre et égalité',
    'Jeunesse et leadership', 'Arts et culture', 'Sport et loisirs'
];

// Variants d'animation pour cohérence avec dashboard
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
        y: -4,
        transition: { 
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

// Composant FloatingCard pour cohérence
const FloatingCard = ({ children, delay = 0, className = "" }: { 
    children: React.ReactNode; 
    delay?: number; 
    className?: string; 
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    
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

export default function MemberRegister() {
    const [selectedProfileType, setSelectedProfileType] = useState<keyof typeof profileTypes>('adherent');
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm<MemberFormData>({
        // Champs existants
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        
        // Nouveaux champs
        profile_type: 'adherent',
        first_name: '',
        last_name: '',
        phone: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        city: '',
        country: 'Cameroun',
        profession: '',
        company: '',
        education_level: '',
        motivation: '',
        previous_experience: '',
        skills: [],
        availability: [],
        interests: [],
        communication_preferences: {
            email: true,
            sms: false,
            whatsapp: false,
            newsletter: true
        },
        terms_accepted: false,
        privacy_accepted: false
    });

    const handleProfileTypeChange = (type: keyof typeof profileTypes) => {
        setSelectedProfileType(type);
        setData('profile_type', type);
    };

    const handleSkillToggle = (skill: string) => {
        const currentSkills = data.skills;
        const updatedSkills = currentSkills.includes(skill)
            ? currentSkills.filter(s => s !== skill)
            : [...currentSkills, skill];
        setData('skills', updatedSkills);
    };

    const handleAvailabilityToggle = (availability: string) => {
        const current = data.availability;
        const updated = current.includes(availability)
            ? current.filter(a => a !== availability)
            : [...current, availability];
        setData('availability', updated);
    };

    const handleInterestToggle = (interest: string) => {
        const current = data.interests;
        const updated = current.includes(interest)
            ? current.filter(i => i !== interest)
            : [...current, interest];
        setData('interests', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Combine first_name and last_name into name for existing auth system
        const submitData = {
            ...data,
            name: `${data.first_name} ${data.last_name}`.trim()
        };
        
        post('/register', {
            data: submitData,
            onSuccess: () => {
                // Redirect sera géré par le backend
            }
        });
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const currentProfile = profileTypes[selectedProfileType];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
            <Head title="Inscription Membre - Fondation Titi" />
            
            {/* Header avec particules */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 overflow-hidden">
                {/* Particules flottantes */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
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
                
                <div className="relative container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Rejoignez Fondation Titi
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Créez votre profil membre personnalisé et rejoignez une communauté passionnée d'acteurs du changement social.
                        </p>
                    </motion.div>
                </div>
            </div>
            
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Progress Bar Moderne */}
                <FloatingCard className="mb-12">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    Inscription Membre
                                </h2>
                                <Badge variant="outline" className="text-sm">
                                    Étape {step} sur 4
                                </Badge>
                            </div>
                            
                            <div className="relative">
                                <Progress value={(step / 4) * 100} className="h-3 bg-slate-100" />
                                <motion.div
                                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 4) * 100}%` }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                {[
                                    { name: 'Type d\'engagement', icon: User },
                                    { name: 'Informations', icon: Mail },
                                    { name: 'Profil pro', icon: Briefcase },
                                    { name: 'Finalisation', icon: CheckCircle }
                                ].map((stepItem, index) => {
                                    const StepIcon = stepItem.icon;
                                    const isActive = step >= index + 1;
                                    return (
                                        <div key={index} className={`text-center transition-all duration-300 ${
                                            isActive ? 'text-primary' : 'text-muted-foreground'
                                        }`}>
                                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 transition-all duration-300 ${
                                                isActive 
                                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                                                    : 'bg-muted text-muted-foreground'
                                            }`}>
                                                <StepIcon className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs font-medium">{stepItem.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </FloatingCard>

                <form onSubmit={handleSubmit}>
                {/* Step 1: Type de profil */}
                {step === 1 && (
                    <FloatingCard>
                        <div className="space-y-8">
                            <motion.div 
                                className="text-center space-y-4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    animate={{ 
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full"
                                >
                                    <User className="h-10 w-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    Choisissez votre type d'engagement
                                </h3>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Sélectionnez le profil qui correspond le mieux à vos objectifs et découvrez tous les avantages
                                </p>
                            </motion.div>

                        <RadioGroup 
                            value={selectedProfileType} 
                            onValueChange={(value) => handleProfileTypeChange(value as keyof typeof profileTypes)}
                        >
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-6 md:grid-cols-2"
                            >
                                {Object.entries(profileTypes).map(([key, profile], index) => (
                                    <motion.div
                                        key={key}
                                        variants={fadeInUp}
                                        whileHover="hover"
                                        initial="rest"
                                        className="relative"
                                    >
                                        <motion.div variants={cardHover}>
                                            <input
                                                type="radio"
                                                name="profileType"
                                                value={key}
                                                id={key}
                                                checked={selectedProfileType === key}
                                                onChange={() => handleProfileTypeChange(key as keyof typeof profileTypes)}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={key}
                                                className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                                                    selectedProfileType === key
                                                        ? 'border-purple-500 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50'
                                                        : 'border-slate-200 hover:border-purple-300 bg-white'
                                                }`}
                                            >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-full bg-${profile.color}/10`}>
                                                <div className="w-6 h-6 text-primary" />
                                            </div>
                                            {selectedProfileType === key && (
                                                <CheckCircle className="h-6 w-6 text-primary" />
                                            )}
                                        </div>
                                        
                                        <h4 className="font-semibold text-lg mb-2">{profile.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-3">{profile.description}</p>
                                        <div className="text-lg font-bold text-primary mb-4">{profile.price}</div>
                                        
                                        <div className="space-y-2">
                                            <h5 className="font-medium text-sm">Avantages inclus :</h5>
                                            <ul className="space-y-1 text-xs text-muted-foreground">
                                                {profile.benefits.slice(0, 3).map((benefit, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                                {profile.benefits.length > 3 && (
                                                    <li className="text-primary text-xs font-medium">
                                                        +{profile.benefits.length - 3} autres avantages
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </Label>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </RadioGroup>

                        <motion.div 
                            className="flex justify-end mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button 
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!selectedProfileType}
                                    size="lg"
                                    className="min-w-[200px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white group"
                                >
                                    Continuer
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        </div>
                    </FloatingCard>
                )}

                {/* Step 2: Informations personnelles et compte */}
                {step === 2 && (
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <Mail className="mx-auto h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Informations personnelles et compte</h3>
                            <p className="text-muted-foreground">Créez votre compte et renseignez vos informations de base</p>
                        </div>

                        {/* Section Compte */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Informations de connexion
                                </CardTitle>
                                <CardDescription>Créez votre compte sécurisé</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Adresse email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="votre.email@example.com"
                                            required
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+237 6XX XXX XXX"
                                            required
                                        />
                                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Mot de passe *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmer le mot de passe *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                        {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section Informations personnelles */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informations personnelles
                                </CardTitle>
                                <CardDescription>Renseignez vos informations de base</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">Prénom *</Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Votre prénom"
                                            required
                                        />
                                        {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Nom de famille *</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Votre nom"
                                            required
                                        />
                                        {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_birth">Date de naissance *</Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            required
                                        />
                                        {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Genre</Label>
                                        <Select value={data.gender} onValueChange={(value: any) => setData('gender', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez votre genre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Masculin</SelectItem>
                                                <SelectItem value="female">Féminin</SelectItem>
                                                <SelectItem value="other">Autre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section Adresse */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Localisation
                                </CardTitle>
                                <CardDescription>Où êtes-vous basé(e) ?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Adresse complète</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Rue, quartier..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville *</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Yaoundé, Douala, Bafoussam..."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Pays</Label>
                                        <Input
                                            id="country"
                                            type="text"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder="Cameroun"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Button>
                            <Button type="button" onClick={nextStep}>
                                Continuer
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Profil professionnel et compétences */}
                {step === 3 && (
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <Briefcase className="mx-auto h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Profil professionnel</h3>
                            <p className="text-muted-foreground">Aidez-nous à mieux vous connaître pour personnaliser votre expérience</p>
                        </div>

                        {/* Informations professionnelles */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations professionnelles</CardTitle>
                                <CardDescription>Votre situation professionnelle actuelle</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="profession">Profession actuelle</Label>
                                        <Input
                                            id="profession"
                                            type="text"
                                            value={data.profession}
                                            onChange={(e) => setData('profession', e.target.value)}
                                            placeholder="Développeur, Enseignant, Entrepreneur..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Entreprise/Organisation</Label>
                                        <Input
                                            id="company"
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="Nom de votre employeur actuel"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="education">Niveau d'éducation</Label>
                                    <Select value={data.education_level} onValueChange={(value) => setData('education_level', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez votre niveau" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bac">Baccalauréat</SelectItem>
                                            <SelectItem value="bts_dut">BTS/DUT</SelectItem>
                                            <SelectItem value="licence">Licence/Bachelor</SelectItem>
                                            <SelectItem value="master">Master</SelectItem>
                                            <SelectItem value="doctorat">Doctorat/PhD</SelectItem>
                                            <SelectItem value="autre">Autre/Formation professionnelle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Compétences */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Compétences et expertises</CardTitle>
                                <CardDescription>Sélectionnez vos domaines de compétence (plusieurs choix possibles)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {skillsOptions.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant={data.skills.includes(skill) ? 'default' : 'secondary'}
                                            className={cn(
                                                'cursor-pointer hover:bg-primary/80 transition-colors',
                                                data.skills.includes(skill) ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                                            )}
                                            onClick={() => handleSkillToggle(skill)}
                                        >
                                            {skill}
                                            {data.skills.includes(skill) && (
                                                <CheckCircle className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Disponibilité */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Disponibilité pour les activités</CardTitle>
                                <CardDescription>Quand êtes-vous disponible pour participer ?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {availabilityOptions.map((availability) => (
                                        <Badge
                                            key={availability}
                                            variant={data.availability.includes(availability) ? 'default' : 'outline'}
                                            className={cn(
                                                'cursor-pointer hover:bg-green-100 hover:border-green-300 transition-colors',
                                                data.availability.includes(availability) ? 'bg-green-600 text-white border-green-600' : ''
                                            )}
                                            onClick={() => handleAvailabilityToggle(availability)}
                                        >
                                            {availability}
                                            {data.availability.includes(availability) && (
                                                <CheckCircle className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Centres d'intérêt */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Centres d'intérêt</CardTitle>
                                <CardDescription>Quels sont vos domaines d'intérêt ?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map((interest) => (
                                        <Badge
                                            key={interest}
                                            variant={data.interests.includes(interest) ? 'default' : 'outline'}
                                            className={cn(
                                                'cursor-pointer hover:bg-orange-100 hover:border-orange-300 transition-colors',
                                                data.interests.includes(interest) ? 'bg-orange-500 text-white border-orange-500' : ''
                                            )}
                                            onClick={() => handleInterestToggle(interest)}
                                        >
                                            {interest}
                                            {data.interests.includes(interest) && (
                                                <CheckCircle className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Motivations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Motivation et expérience
                                </CardTitle>
                                <CardDescription>Parlez-nous de vous</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="motivation">Motivation pour rejoindre Fondation Titi *</Label>
                                    <Textarea
                                        id="motivation"
                                        value={data.motivation}
                                        onChange={(e) => setData('motivation', e.target.value)}
                                        placeholder="Expliquez pourquoi vous souhaitez nous rejoindre et comment vous comptez contribuer à nos missions..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Expérience associative ou bénévole précédente</Label>
                                    <Textarea
                                        id="experience"
                                        value={data.previous_experience}
                                        onChange={(e) => setData('previous_experience', e.target.value)}
                                        placeholder="Décrivez brièvement vos expériences passées dans l'associatif ou le bénévolat..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Button>
                            <Button type="button" onClick={nextStep}>
                                Continuer
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Préférences et confirmation */}
                {step === 4 && (
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <Settings className="mx-auto h-12 w-12 text-primary" />
                            <h3 className="text-xl font-semibold">Finalisation de l'inscription</h3>
                            <p className="text-muted-foreground">Dernières préférences et validation de votre adhésion</p>
                        </div>

                        {/* Préférences de communication */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Préférences de communication</CardTitle>
                                <CardDescription>Choisissez comment vous souhaitez recevoir nos communications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="pref-email"
                                                checked={data.communication_preferences.email}
                                                onCheckedChange={(checked) => setData('communication_preferences', {
                                                    ...data.communication_preferences,
                                                    email: checked as boolean
                                                })}
                                            />
                                            <Label htmlFor="pref-email">Notifications par email</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="pref-newsletter"
                                                checked={data.communication_preferences.newsletter}
                                                onCheckedChange={(checked) => setData('communication_preferences', {
                                                    ...data.communication_preferences,
                                                    newsletter: checked as boolean
                                                })}
                                            />
                                            <Label htmlFor="pref-newsletter">Newsletter mensuelle</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="pref-sms"
                                                checked={data.communication_preferences.sms}
                                                onCheckedChange={(checked) => setData('communication_preferences', {
                                                    ...data.communication_preferences,
                                                    sms: checked as boolean
                                                })}
                                            />
                                            <Label htmlFor="pref-sms">SMS pour urgences</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="pref-whatsapp"
                                                checked={data.communication_preferences.whatsapp}
                                                onCheckedChange={(checked) => setData('communication_preferences', {
                                                    ...data.communication_preferences,
                                                    whatsapp: checked as boolean
                                                })}
                                            />
                                            <Label htmlFor="pref-whatsapp">WhatsApp (événements)</Label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Résumé de l'inscription */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Résumé de votre inscription</CardTitle>
                                <CardDescription>Vérifiez vos informations avant de finaliser</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Type de profil</p>
                                            <Badge variant="outline" className="text-sm">{currentProfile.name}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                                            <p className="text-sm">{data.first_name} {data.last_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <p className="text-sm">{data.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Cotisation annuelle</p>
                                            <p className="text-sm font-bold text-primary">{currentProfile.price}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Compétences sélectionnées</p>
                                            <p className="text-sm">{data.skills.length} domaines</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Centres d'intérêt</p>
                                            <p className="text-sm">{data.interests.length} sélectionnés</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conditions */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={data.terms_accepted}
                                        onCheckedChange={(checked) => setData('terms_accepted', checked as boolean)}
                                        required
                                    />
                                    <Label htmlFor="terms" className="text-sm leading-5">
                                        J'accepte les <a href="/terms" target="_blank" className="text-primary hover:underline">conditions d'utilisation</a> et 
                                        la <a href="/charter" target="_blank" className="text-primary hover:underline">charte des valeurs</a> de Fondation Titi *
                                    </Label>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="privacy"
                                        checked={data.privacy_accepted}
                                        onCheckedChange={(checked) => setData('privacy_accepted', checked as boolean)}
                                        required
                                    />
                                    <Label htmlFor="privacy" className="text-sm leading-5">
                                        J'accepte la <a href="/privacy" target="_blank" className="text-primary hover:underline">politique de confidentialité</a> et 
                                        le traitement de mes données personnelles *
                                    </Label>
                                </div>
                                {(errors.terms_accepted || errors.privacy_accepted) && (
                                    <p className="text-sm text-destructive">Vous devez accepter les conditions pour continuer</p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={prevStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Button>
                            <Button 
                                type="submit"
                                size="lg"
                                disabled={processing || !data.terms_accepted || !data.privacy_accepted}
                                className="min-w-[200px]"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full mr-2 h-4 w-4 border-b-2 border-white"></div>
                                        Inscription en cours...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Finaliser mon inscription
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>

            {/* Info complémentaire */}
            <Card className="mt-8 border-muted bg-muted/50">
                <CardContent className="pt-6">
                    <div className="text-center mb-4">
                        <h6 className="text-sm font-semibold">Informations importantes</h6>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Données sécurisées</p>
                                <p className="text-xs text-muted-foreground">Vos informations sont protégées</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <div className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Validation sous 48h</p>
                                <p className="text-xs text-muted-foreground">Confirmation rapide de votre adhésion</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <Phone className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Support disponible</p>
                                <p className="text-xs text-muted-foreground">+237 6XX XXX XXX</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
            
            {/* Footer informatif moderne */}
            <div className="bg-slate-900 py-12">
                <div className="container mx-auto px-6">
                    <FloatingCard>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full"
                                >
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </motion.div>
                                <div>
                                    <h4 className="font-semibold text-white">Données sécurisées</h4>
                                    <p className="text-sm text-white/70">Vos informations sont protégées</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full"
                                >
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </motion.div>
                                <div>
                                    <h4 className="font-semibold text-white">Validation sous 48h</h4>
                                    <p className="text-sm text-white/70">Confirmation rapide de votre adhésion</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full"
                                >
                                    <Phone className="w-6 h-6 text-blue-600" />
                                </motion.div>
                                <div>
                                    <h4 className="font-semibold text-white">Support disponible</h4>
                                    <p className="text-sm text-white/70">+237 6XX XXX XXX</p>
                                </div>
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </div>
        </div>
    );
}