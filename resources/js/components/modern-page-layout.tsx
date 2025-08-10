import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { CheckCircle, Settings, Phone, Sparkles } from 'lucide-react';

interface ModernPageLayoutProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    children: ReactNode;
    showFooter?: boolean;
    className?: string;
}

// Variants d'animation standardisées
export const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const cardHover = {
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

// Composant FloatingCard standardisé
export const FloatingCard = ({ 
    children, 
    delay = 0, 
    className = "" 
}: { 
    children: ReactNode; 
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

export default function ModernPageLayout({ 
    title, 
    description, 
    icon, 
    children, 
    showFooter = true,
    className = ""
}: ModernPageLayoutProps) {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 ${className}`}>
            {/* Header moderne avec particules */}
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
                            {icon || <Sparkles className="w-8 h-8 text-white" />}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                                {description}
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>
            
            {/* Contenu principal */}
            <div className="container mx-auto px-6 py-12">
                {children}
            </div>
            
            {/* Footer informatif */}
            {showFooter && (
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
                                        <h4 className="font-semibold text-white">Service rapide</h4>
                                        <p className="text-sm text-white/70">Traitement en moins de 48h</p>
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
            )}
        </div>
    );
}