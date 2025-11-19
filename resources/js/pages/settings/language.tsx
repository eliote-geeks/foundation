import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageSelection } from '../../components/foundation/language-selection';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert } from '../../components/ui/alert';

export default function LanguageSettings() {
    const { currentLanguage, t } = useTranslation();
    const [savedLanguage, setSavedLanguage] = useState(currentLanguage);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(currentLanguage !== savedLanguage);
    }, [currentLanguage, savedLanguage]);

    const handleLanguageChange = (newLanguage: string) => {
        setSavedLanguage(newLanguage);
        setHasChanges(newLanguage !== currentLanguage);
    };

    const handleSave = () => {
        setSavedLanguage(currentLanguage);
        setHasChanges(false);
        setShowSuccess(true);
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Optionnel : sauvegarder dans la base de données ou localStorage
        localStorage.setItem('preferredLanguage', currentLanguage);
    };

    const handleReset = () => {
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'fr';
        setSavedLanguage(preferredLanguage);
        window.location.reload();
    };

    return (
        <>
            <Head title={t('languageSettings', 'Paramètres de langue') || 'Paramètres de langue'} />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {t('languageSettings', 'Paramètres de langue')}
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    {t('languageSettingsDescription', 'Personnalisez votre expérience linguistique sur la plateforme')}
                                </p>
                            </div>
                            
                            <Badge variant={currentLanguage === 'fr' ? 'default' : 'secondary'}>
                                {currentLanguage === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                            </Badge>
                        </div>
                    </div>

                    {/* Message de succès */}
                    {showSuccess && (
                        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {t('languageSaved', 'Langue sauvegardée avec succès!')}
                        </Alert>
                    )}

                    {/* Section principale de sélection */}
                    <Card className="mb-8">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                {t('selectPreferredLanguage', 'Sélectionner votre langue préférée')}
                            </h2>
                            
                            <LanguageSelection 
                                showTitle={false}
                                onLanguageChange={handleLanguageChange}
                            />
                        </div>
                    </Card>

                    {/* Section informations supplémentaires */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Fonctionnalités */}
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('languageFeatures', 'Fonctionnalités linguistiques')}
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <div className="text-green-600 dark:text-green-400 mt-0.5">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {t('staticTranslation', 'Traduction statique')}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {currentLanguage === 'fr' 
                                                    ? 'Interface utilisateur traduite instantanément'
                                                    : 'User interface instantly translated'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="text-green-600 dark:text-green-400 mt-0.5">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {t('dynamicTranslation', 'Traduction dynamique')}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {currentLanguage === 'fr' 
                                                    ? 'Contenus générés automatiquement traduits'
                                                    : 'User-generated content automatically translated'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="text-green-600 dark:text-green-400 mt-0.5">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {t('contextualTranslation', 'Traduction contextuelle')}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {currentLanguage === 'fr' 
                                                    ? 'Adaptation selon le contexte de la Fondation'
                                                    : 'Adaptation according to Foundation context'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Statistiques */}
                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('languageStats', 'Statistiques linguistiques')}
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('currentLanguage', 'Langue actuelle')}
                                        </span>
                                        <Badge variant="outline">
                                            {currentLanguage === 'fr' ? 'Français' : 'English'}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('supportedLanguages', 'Langues supportées')}
                                        </span>
                                        <Badge variant="outline">2</Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('translationAccuracy', 'Précision de traduction')}
                                        </span>
                                        <Badge variant="outline">95%+</Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Actions */}
                    {hasChanges && (
                        <Card className="mt-6">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {t('unsavedChanges', 'Modifications non sauvegardées')}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('saveChangesPrompt', 'Vous avez des modifications non sauvegardées. Souhaitez-vous les enregistrer?')}
                                        </p>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <Button 
                                            variant="outline" 
                                            onClick={handleReset}
                                        >
                                            {t('cancel', 'Annuler')}
                                        </Button>
                                        <Button onClick={handleSave}>
                                            {t('saveChanges', 'Sauvegarder')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
