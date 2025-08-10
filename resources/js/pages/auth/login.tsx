import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FloatingCard } from '@/components/modern-page-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
            <Head title="Connexion" />

            {/* Particules flottantes en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-200/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-md mx-auto relative z-10">
                <FloatingCard>
                    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                        <CardHeader className="text-center pb-6">
                            {/* Titre et description intégrés dans le card */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6"
                            >
                                <Lock className="w-10 h-10 text-white" />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                                    Connexion
                                </CardTitle>
                                
                                <CardDescription className="text-slate-600 mb-2">
                                    Bon retour parmi nous !
                                </CardDescription>
                                
                                <p className="text-sm text-slate-500">
                                    Accédez à votre espace membre et découvrez tout ce que nous avons préparé pour vous
                                </p>
                            </motion.div>
                        </CardHeader>

                        <CardContent className="px-8 pb-8">
                            {status && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-center text-sm font-medium text-green-700"
                                >
                                    {status}
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Champ Email */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Adresse email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="votre@email.com"
                                            className="pl-10 h-11 border-slate-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </motion.div>

                                {/* Champ Mot de passe */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                            Mot de passe
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink 
                                                href={route('password.request')} 
                                                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                                tabIndex={5}
                                            >
                                                Mot de passe oublié ?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-11 border-slate-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </motion.div>

                                {/* Checkbox Se souvenir */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center space-x-2 pt-2"
                                >
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember" className="text-sm text-slate-700 cursor-pointer">
                                        Se souvenir de moi
                                    </Label>
                                </motion.div>

                                {/* Bouton de connexion */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="pt-4"
                                >
                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium group transition-all"
                                        tabIndex={4} 
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                Connexion...
                                            </>
                                        ) : (
                                            <>
                                                Se connecter
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>

                            {/* Section inscription */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-center pt-6 mt-6 border-t border-slate-100"
                            >
                                <p className="text-sm text-slate-600">
                                    Pas encore membre ?{' '}
                                    <TextLink 
                                        href={route('register')} 
                                        className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                                        tabIndex={6}
                                    >
                                        Créer un compte gratuitement
                                    </TextLink>
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    Rejoignez notre communauté d'impact social
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </FloatingCard>
            </div>
        </div>
    );
}