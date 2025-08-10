import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LoaderCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ModernPageLayout, { FloatingCard } from '@/components/modern-page-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <ModernPageLayout
            title="Créer votre compte"
            description="Rejoignez notre communauté et commencez votre parcours d'engagement social"
            icon={<User className="w-8 h-8 text-white" />}
            className="flex items-center justify-center"
            showFooter={false}
        >
            <Head title="Inscription" />

            <div className="w-full max-w-md mx-auto">
                <FloatingCard>
                    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4"
                            >
                                <User className="w-10 h-10 text-white" />
                            </motion.div>
                            
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Bienvenue !
                            </CardTitle>
                            
                            <CardDescription className="text-base text-slate-600">
                                Créez votre compte pour rejoindre notre communauté
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={submit} className="space-y-5">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                        Nom complet
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Votre nom complet"
                                            className="pl-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <InputError message={errors.name} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Adresse email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="votre@email.com"
                                            className="pl-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="••••••••"
                                            className="pl-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="••••••••"
                                            className="pl-10 h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium group"
                                        tabIndex={5} 
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                                Création...
                                            </>
                                        ) : (
                                            <>
                                                Créer mon compte
                                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-center pt-6 border-t border-slate-200"
                            >
                                <p className="text-sm text-slate-600">
                                    Déjà membre ?{' '}
                                    <TextLink 
                                        href={route('login')} 
                                        className="font-medium text-emerald-600 hover:text-emerald-700"
                                        tabIndex={6}
                                    >
                                        Se connecter
                                    </TextLink>
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </FloatingCard>
            </div>
        </ModernPageLayout>
    );
}
