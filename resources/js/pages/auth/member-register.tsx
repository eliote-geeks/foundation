import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, User, Mail, Lock, MapPin, Briefcase, Heart } from 'lucide-react';
import { MemberTypeSelector } from '@/components/auth/member-type-selector';
import { InterestsSkillsSelector } from '@/components/auth/interests-skills-selector';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelection } from '@/components/foundation/language-selection';

interface MemberFormData {
    // Account info
    email: string;
    password: string;
    password_confirmation: string;
    
    // Profile info
    member_type: string;
    first_name: string;
    last_name: string;
    phone: string;
    birth_date: string;
    gender: string;
    
    // Location
    address: string;
    city: string;
    postal_code: string;
    country: string;
    
    // Professional
    profession: string;
    company: string;
    bio: string;
    
    // Preferences
    interests: string[];
    skills: string[];
    preferred_language: string;
    
    // Communication
    accepts_newsletter: boolean;
    accepts_sms: boolean;
    accepts_phone_calls: boolean;
    
    // Social networks
    linkedin_url: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    
    // Type specific data
    type_specific_data: Record<string, any>;
}

interface Props {
    memberTypes: Record<string, any>;
    availableInterests: string[];
    availableSkills: string[];
    countries: Record<string, string>;
}

export default function MemberRegister({ memberTypes, availableInterests, availableSkills, countries }: Props) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const { data, setData, post, processing, errors } = useForm<MemberFormData>({
        email: '',
        password: '',
        password_confirmation: '',
        member_type: 'adherent',
        first_name: '',
        last_name: '',
        phone: '',
        birth_date: '',
        gender: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Cameroon',
        profession: '',
        company: '',
        bio: '',
        interests: [],
        skills: [],
        preferred_language: 'fr',
        accepts_newsletter: true,
        accepts_sms: false,
        accepts_phone_calls: false,
        linkedin_url: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        type_specific_data: {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('member-register.store'));
    };

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return t('selectMemberType', 'Sélectionnez votre type de membre');
            case 2: return t('personalInfo', 'Informations personnelles');
            case 3: return t('professionalProfile', 'Profil professionnel');
            case 4: return t('finalizeRegistration', 'Finaliser l\'inscription');
            default: return '';
        }
    };

    return (
        <>
            <Head title={t('memberRegistration', 'Inscription membre') || 'Inscription membre'} />
            
            <div 
                className="min-h-screen py-12 position-relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #334E15 0%, #4D8A3C 50%, #5FA145 100%)',
                    paddingTop: '120px'
                }}
            >
                {/* Animated Background Elements comme sur l'accueil */}
                <div className="position-absolute w-100 h-100" style={{ zIndex: 1 }}>
                    <div 
                        className="position-absolute rounded-circle"
                        style={{
                            width: '300px',
                            height: '300px',
                            background: 'rgba(228, 81, 140, 0.1)',
                            top: '10%',
                            right: '10%',
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="position-absolute rounded-circle"
                        style={{
                            width: '200px',
                            height: '200px',
                            background: 'rgba(198, 148, 56, 0.1)',
                            bottom: '20%',
                            left: '5%',
                            animation: 'float 4s ease-in-out infinite reverse'
                        }}
                    />
                    <div 
                        className="position-absolute"
                        style={{
                            width: '150px',
                            height: '150px',
                            background: 'rgba(232, 245, 232, 0.1)',
                            top: '60%',
                            right: '20%',
                            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                            animation: 'morphing 8s ease-in-out infinite'
                        }}
                    />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 position-relative" style={{ zIndex: 2 }}>
                    {/* Header avec design de l'accueil */}
                    <div className="text-center mb-12">
                        {/* Badge comme sur l'accueil */}
                        <div 
                            className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-4"
                            style={{
                                background: 'rgba(232, 245, 232, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(232, 245, 232, 0.3)'
                            }}
                        >
                            <span 
                                className="badge rounded-pill me-2"
                                style={{
                                    background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)',
                                    color: '#334E15'
                                }}
                            >
                                Nouveau
                            </span>
                            <span style={{ color: '#E8F5E8', fontSize: '0.9rem' }}>
                                {t('memberRegistrationBadge', 'Inscription membre simplifiée !')}
                            </span>
                        </div>

                        <h1 
                            className="display-3 fw-bold mb-4"
                            style={{ 
                                color: '#E8F5E8',
                                lineHeight: '1.2',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            {t('joinFoundation', 'Rejoignez la Fondation Titi')}
                        </h1>
                        <p 
                            className="lead mb-5"
                            style={{ 
                                color: '#E8F5E8',
                                opacity: 0.9,
                                fontSize: '1.3rem',
                                maxWidth: '700px',
                                margin: '0 auto'
                            }}
                        >
                            {t('memberRegistrationDescription', 'Créez votre profil complet et devenez membre de notre communauté')}
                        </p>
                    </div>

                    {/* Progress avec style de l'accueil */}
                    <div 
                        className="mb-10 rounded-3xl p-8"
                        style={{
                            background: 'rgba(51, 78, 21, 0.9)',
                            backdropFilter: 'blur(15px)',
                            border: '2px solid rgba(95, 161, 69, 0.3)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 
                                className="h3 fw-bold mb-0"
                                style={{ 
                                    color: '#E8F5E8',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}
                            >
                                {getStepTitle()}
                            </h2>
                            <div 
                                className="px-3 py-2 rounded-pill"
                                style={{
                                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                    color: '#334E15',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}
                            >
                                {t('step', 'Étape')} {step} {t('of', 'sur')} {totalSteps}
                            </div>
                        </div>
                        
                        <div className="position-relative">
                            {/* Progress bar avec style accueil */}
                            <div 
                                className="w-100 rounded-pill mb-4"
                                style={{
                                    height: '6px',
                                    background: 'rgba(232, 245, 232, 0.2)'
                                }}
                            >
                                <div 
                                    className="h-100 rounded-pill"
                                    style={{
                                        width: `${(step / totalSteps) * 100}%`,
                                        background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </div>
                            
                            {/* Step indicators */}
                            <div className="d-flex justify-content-between">
                                {Array.from({ length: totalSteps }, (_, i) => (
                                    <div key={i} className="d-flex flex-column align-items-center">
                                        <div 
                                            className={`d-flex align-items-center justify-content-center rounded-circle fw-bold`}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                fontSize: '0.9rem',
                                                background: i + 1 <= step 
                                                    ? 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)' 
                                                    : 'rgba(232, 245, 232, 0.2)',
                                                color: i + 1 <= step ? '#334E15' : '#E8F5E8',
                                                border: i + 1 <= step ? 'none' : '2px solid rgba(232, 245, 232, 0.3)',
                                                boxShadow: i + 1 <= step ? '0 4px 15px rgba(95, 161, 69, 0.4)' : 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {i + 1 < step ? (
                                                <i className="bi bi-check" style={{ fontSize: '1.2rem' }}></i>
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Member Type Selection */}
                        {step === 1 && (
                            <div 
                                className="rounded-3xl p-8"
                                style={{
                                    background: 'rgba(51, 78, 21, 0.9)',
                                    backdropFilter: 'blur(15px)',
                                    border: '2px solid rgba(95, 161, 69, 0.3)',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <MemberTypeSelector
                                    memberTypes={memberTypes}
                                    selectedType={data.member_type}
                                    onChange={(type) => setData('member_type', type)}
                                    error={errors.member_type}
                                />
                                
                                <div className="d-flex justify-content-end mt-5">
                                    <button
                                        type="button"
                                        onClick={nextStep} 
                                        disabled={!data.member_type}
                                        className="btn btn-lg px-5 py-3 fw-semibold rounded-pill"
                                        style={{
                                            background: !data.member_type 
                                                ? 'rgba(232, 245, 232, 0.3)' 
                                                : 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                            border: 'none',
                                            color: !data.member_type ? 'rgba(232, 245, 232, 0.6)' : '#334E15',
                                            fontSize: '1.1rem',
                                            boxShadow: !data.member_type 
                                                ? 'none' 
                                                : '0 10px 30px rgba(95, 161, 69, 0.3)',
                                            transform: 'translateY(0)',
                                            transition: 'all 0.3s ease',
                                            cursor: !data.member_type ? 'not-allowed' : 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (data.member_type) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(95, 161, 69, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (data.member_type) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 161, 69, 0.3)';
                                            }
                                        }}
                                    >
                                        <i className="bi bi-arrow-right me-2"></i>
                                        {t('continue', 'Continuer')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Personal Information */}
                        {step === 2 && (
                            <div className="space-y-6">
                                {/* Account Information */}
                                <div 
                                    className="rounded-3xl p-6"
                                    style={{
                                        background: 'rgba(51, 78, 21, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(95, 161, 69, 0.3)',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div 
                                                className="p-2 rounded-circle"
                                                style={{
                                                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)'
                                                }}
                                            >
                                                <Lock className="h-5 w-5" style={{ color: '#334E15' }} />
                                            </div>
                                            <h3 
                                                className="h4 fw-bold mb-0"
                                                style={{ 
                                                    color: '#E8F5E8',
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {t('accountInfo', 'Informations de compte')}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="email" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('email', 'Email')} *
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="form-control"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            {errors.email && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="phone" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('phone', 'Téléphone')} *
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                className="form-control"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            {errors.phone && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row g-3 mt-3">
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="password" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('password', 'Mot de passe')} *
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                className="form-control"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            {errors.password && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="password_confirmation" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('confirmPassword', 'Confirmer le mot de passe')} *
                                            </label>
                                            <input
                                                id="password_confirmation"
                                                type="password"
                                                className="form-control"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div 
                                    className="rounded-3xl p-6 mt-6"
                                    style={{
                                        background: 'rgba(51, 78, 21, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(95, 161, 69, 0.3)',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div 
                                                className="p-2 rounded-circle"
                                                style={{
                                                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)'
                                                }}
                                            >
                                                <User className="h-5 w-5" style={{ color: '#334E15' }} />
                                            </div>
                                            <h3 
                                                className="h4 fw-bold mb-0"
                                                style={{ 
                                                    color: '#E8F5E8',
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {t('personalInfo', 'Informations personnelles')}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="first_name" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('firstName', 'Prénom')} *
                                            </label>
                                            <input
                                                id="first_name"
                                                type="text"
                                                className="form-control"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            {errors.first_name && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                    {errors.first_name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="last_name" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('lastName', 'Nom de famille')} *
                                            </label>
                                            <input
                                                id="last_name"
                                                type="text"
                                                className="form-control"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            {errors.last_name && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                    {errors.last_name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row g-3 mt-3">
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="birth_date" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('birthDate', 'Date de naissance')}
                                            </label>
                                            <input
                                                id="birth_date"
                                                type="date"
                                                className="form-control"
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label 
                                                htmlFor="gender" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('gender', 'Genre')}
                                            </label>
                                            <select
                                                id="gender"
                                                className="form-select"
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                <option value="">{t('selectGender', 'Sélectionnez votre genre')}</option>
                                                <option value="male">{t('male', 'Masculin')}</option>
                                                <option value="female">{t('female', 'Féminin')}</option>
                                                <option value="other">{t('other', 'Autre')}</option>
                                                <option value="prefer_not_to_say">{t('preferNotToSay', 'Préfère ne pas dire')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div 
                                    className="rounded-3xl p-6 mt-6"
                                    style={{
                                        background: 'rgba(51, 78, 21, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(95, 161, 69, 0.3)',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div 
                                                className="p-2 rounded-circle"
                                                style={{
                                                    background: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)'
                                                }}
                                            >
                                                <MapPin className="h-5 w-5" style={{ color: '#334E15' }} />
                                            </div>
                                            <h3 
                                                className="h4 fw-bold mb-0"
                                                style={{ 
                                                    color: '#E8F5E8',
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {t('location', 'Localisation')}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label 
                                            htmlFor="address" 
                                            className="form-label fw-semibold mb-2"
                                            style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                        >
                                            {t('address', 'Adresse')}
                                        </label>
                                        <input
                                            id="address"
                                            type="text"
                                            className="form-control"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            style={{
                                                background: 'rgba(232, 245, 232, 0.1)',
                                                border: '2px solid rgba(232, 245, 232, 0.3)',
                                                borderRadius: '12px',
                                                color: '#E8F5E8',
                                                padding: '12px 16px'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#5FA145';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label 
                                                htmlFor="city" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('city', 'Ville')} *
                                            </label>
                                            <input
                                                id="city"
                                                type="text"
                                                className="form-control"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                            {errors.city && (
                                                <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
                                                    {errors.city}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <label 
                                                htmlFor="postal_code" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('postalCode', 'Code postal')}
                                            </label>
                                            <input
                                                id="postal_code"
                                                type="text"
                                                className="form-control"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label 
                                                htmlFor="country" 
                                                className="form-label fw-semibold mb-2"
                                                style={{ color: '#E8F5E8', fontSize: '0.95rem' }}
                                            >
                                                {t('country', 'Pays')} *
                                            </label>
                                            <select
                                                id="country"
                                                className="form-select"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                                style={{
                                                    background: 'rgba(232, 245, 232, 0.1)',
                                                    border: '2px solid rgba(232, 245, 232, 0.3)',
                                                    borderRadius: '12px',
                                                    color: '#E8F5E8',
                                                    padding: '12px 16px'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#5FA145';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(95, 161, 69, 0.2)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                {Object.entries(countries).map(([code, name]) => (
                                                    <option key={code} value={code}>
                                                        {name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Language Preference */}
                                <div 
                                    className="rounded-3xl p-6 mt-6"
                                    style={{
                                        background: 'rgba(51, 78, 21, 0.9)',
                                        backdropFilter: 'blur(15px)',
                                        border: '2px solid rgba(95, 161, 69, 0.3)',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div 
                                                className="p-2 rounded-circle"
                                                style={{
                                                    background: 'linear-gradient(135deg, #E4518C 0%, #F5B4C6 100%)'
                                                }}
                                            >
                                                <i className="bi bi-globe" style={{ color: '#334E15', fontSize: '1.2rem' }}></i>
                                            </div>
                                            <h3 
                                                className="h4 fw-bold mb-0"
                                                style={{ 
                                                    color: '#E8F5E8',
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                                }}
                                            >
                                                {t('languagePreference', 'Préférence de langue')}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <LanguageSelection 
                                        showTitle={false}
                                        compact={true}
                                        onLanguageChange={(lang) => setData('preferred_language', lang)}
                                    />
                                </div>

                                <div className="d-flex justify-content-between pt-5">
                                    <button
                                        type="button"
                                        onClick={prevStep} 
                                        className="btn btn-lg px-5 py-3 fw-semibold rounded-pill"
                                        style={{
                                            background: 'transparent',
                                            border: '2px solid rgba(232, 245, 232, 0.3)',
                                            color: '#E8F5E8',
                                            fontSize: '1.1rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#5FA145';
                                            e.currentTarget.style.background = 'rgba(95, 161, 69, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        {t('back', 'Retour')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn btn-lg px-5 py-3 fw-semibold rounded-pill"
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                            border: 'none',
                                            color: '#334E15',
                                            fontSize: '1.1rem',
                                            boxShadow: '0 10px 30px rgba(95, 161, 69, 0.3)',
                                            transform: 'translateY(0)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(95, 161, 69, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 161, 69, 0.3)';
                                        }}
                                    >
                                        {t('continue', 'Continuer')}
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Professional Profile */}
                        {step === 3 && (
                            <div className="space-y-6">
                                {/* Professional Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Briefcase className="h-5 w-5" />
                                            {t('professionalInfo', 'Informations professionnelles')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="profession">{t('profession', 'Profession')}</Label>
                                                <Input
                                                    id="profession"
                                                    value={data.profession}
                                                    onChange={(e) => setData('profession', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="company">{t('company', 'Entreprise')}</Label>
                                                <Input
                                                    id="company"
                                                    value={data.company}
                                                    onChange={(e) => setData('company', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="bio">{t('bio', 'Biographie')}</Label>
                                            <Textarea
                                                id="bio"
                                                value={data.bio}
                                                onChange={(e) => setData('bio', e.target.value)}
                                                rows={3}
                                                placeholder={t('bioPlaceholder', 'Parlez-nous de vous...')}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Interests */}
                                <Card>
                                    <CardContent className="p-6">
                                        <InterestsSkillsSelector
                                            type="interests"
                                            availableOptions={availableInterests}
                                            selectedItems={data.interests}
                                            onChange={(interests) => setData('interests', interests)}
                                            maxItems={8}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Skills */}
                                <Card>
                                    <CardContent className="p-6">
                                        <InterestsSkillsSelector
                                            type="skills"
                                            availableOptions={availableSkills}
                                            selectedItems={data.skills}
                                            onChange={(skills) => setData('skills', skills)}
                                            maxItems={10}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Social Networks */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('socialNetworks', 'Réseaux sociaux')}</CardTitle>
                                        <CardDescription>{t('socialNetworksDescription', 'Optionnel - Partagez vos profils sociaux')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="linkedin_url">LinkedIn</Label>
                                                <Input
                                                    id="linkedin_url"
                                                    type="url"
                                                    value={data.linkedin_url}
                                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                                    placeholder="https://linkedin.com/in/..."
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="facebook_url">Facebook</Label>
                                                <Input
                                                    id="facebook_url"
                                                    type="url"
                                                    value={data.facebook_url}
                                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                                    placeholder="https://facebook.com/..."
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="instagram_url">Instagram</Label>
                                                <Input
                                                    id="instagram_url"
                                                    type="url"
                                                    value={data.instagram_url}
                                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                                    placeholder="https://instagram.com/..."
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="twitter_url">Twitter/X</Label>
                                                <Input
                                                    id="twitter_url"
                                                    type="url"
                                                    value={data.twitter_url}
                                                    onChange={(e) => setData('twitter_url', e.target.value)}
                                                    placeholder="https://twitter.com/..."
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="d-flex justify-content-between pt-5">
                                    <button
                                        type="button"
                                        onClick={prevStep} 
                                        className="btn btn-lg px-5 py-3 fw-semibold rounded-pill"
                                        style={{
                                            background: 'transparent',
                                            border: '2px solid rgba(232, 245, 232, 0.3)',
                                            color: '#E8F5E8',
                                            fontSize: '1.1rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#5FA145';
                                            e.currentTarget.style.background = 'rgba(95, 161, 69, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        {t('back', 'Retour')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn btn-lg px-5 py-3 fw-semibold rounded-pill"
                                        style={{
                                            background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                                            border: 'none',
                                            color: '#334E15',
                                            fontSize: '1.1rem',
                                            boxShadow: '0 10px 30px rgba(95, 161, 69, 0.3)',
                                            transform: 'translateY(0)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(95, 161, 69, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(95, 161, 69, 0.3)';
                                        }}
                                    >
                                        {t('continue', 'Continuer')}
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Communication Preferences & Final */}
                        {step === 4 && (
                            <div className="space-y-6">
                                {/* Communication Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Mail className="h-5 w-5" />
                                            {t('communicationPreferences', 'Préférences de communication')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('communicationDescription', 'Choisissez comment vous souhaitez recevoir nos communications')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="accepts_newsletter"
                                                    checked={data.accepts_newsletter}
                                                    onCheckedChange={(checked) => setData('accepts_newsletter', checked as boolean)}
                                                />
                                                <Label htmlFor="accepts_newsletter">
                                                    {t('newsletter', 'Newsletter et actualités')}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="accepts_sms"
                                                    checked={data.accepts_sms}
                                                    onCheckedChange={(checked) => setData('accepts_sms', checked as boolean)}
                                                />
                                                <Label htmlFor="accepts_sms">
                                                    {t('smsNotifications', 'Notifications SMS')}
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="accepts_phone_calls"
                                                    checked={data.accepts_phone_calls}
                                                    onCheckedChange={(checked) => setData('accepts_phone_calls', checked as boolean)}
                                                />
                                                <Label htmlFor="accepts_phone_calls">
                                                    {t('phoneNotifications', 'Appels téléphoniques')}
                                                </Label>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('registrationSummary', 'Résumé de votre inscription')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">{t('memberType')}:</span>
                                                    <p className="text-sm">{memberTypes[data.member_type]?.label}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">{t('fullName')}:</span>
                                                    <p className="text-sm">{data.first_name} {data.last_name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">{t('email')}:</span>
                                                    <p className="text-sm">{data.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">{t('location')}:</span>
                                                    <p className="text-sm">{data.city}, {countries[data.country]}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">{t('interests')}:</span>
                                                    <p className="text-sm">{data.interests.length} {t('selected', 'sélectionné(s)')}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">{t('skills')}:</span>
                                                    <p className="text-sm">{data.skills.length} {t('selected', 'sélectionné(s)')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-between pt-8">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={prevStep}
                                        className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {t('back', 'Retour')}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-w-[220px]"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full mr-2 h-4 w-4 border-b-2 border-white"></div>
                                                {t('processing', 'Traitement...')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                {t('completeRegistration', 'Finaliser l\'inscription')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}