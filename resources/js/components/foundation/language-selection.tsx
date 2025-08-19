import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface LanguageOption {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    description: string;
}

const languages: LanguageOption[] = [
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        description: 'Choisir le français comme langue principale'
    },
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        description: 'Choose English as your primary language'
    }
];

interface LanguageSelectionProps {
    showTitle?: boolean;
    compact?: boolean;
    onLanguageChange?: (language: string) => void;
}

export function LanguageSelection({ 
    showTitle = true, 
    compact = false,
    onLanguageChange 
}: LanguageSelectionProps) {
    const { currentLanguage, changeLanguage, t } = useTranslation();
    const [isChanging, setIsChanging] = useState(false);

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === currentLanguage) return;
        
        setIsChanging(true);
        
        try {
            changeLanguage(langCode);
            onLanguageChange?.(langCode);
            
            // Optionnel : notification de succès
            if (window.location.pathname !== '/') {
                // Recharger la page pour appliquer les traductions
                setTimeout(() => window.location.reload(), 500);
            }
        } catch (error) {
            console.error('Erreur lors du changement de langue:', error);
        } finally {
            setTimeout(() => setIsChanging(false), 500);
        }
    };

    if (compact) {
        return (
            <div className="flex gap-2">
                {languages.map((lang) => (
                    <Button
                        key={lang.code}
                        variant={currentLanguage === lang.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLanguageChange(lang.code)}
                        disabled={isChanging}
                        className="flex items-center gap-2"
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="hidden sm:inline">{lang.nativeName}</span>
                        <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                    </Button>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {showTitle && (
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('chooseLanguage', 'Choisissez votre langue')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('languageDescription', 'Sélectionnez la langue d\'affichage de la plateforme')}
                    </p>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {languages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    
                    return (
                        <Card 
                            key={lang.code}
                            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                isSelected 
                                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            } ${isChanging ? 'pointer-events-none opacity-60' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <div className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="text-4xl">
                                        {lang.flag}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {lang.nativeName}
                                            </h3>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                ({lang.name})
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {lang.description}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        {isSelected && (
                                            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium">
                                                    {t('selected', 'Sélectionné')}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {isChanging && currentLanguage !== lang.code && (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Section informative */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {t('languageInfo', 'Information sur la langue')}
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                            {currentLanguage === 'fr' 
                                ? 'La plateforme traduira automatiquement les contenus dynamiques selon votre choix de langue.'
                                : 'The platform will automatically translate dynamic content according to your language choice.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LanguageSelection;