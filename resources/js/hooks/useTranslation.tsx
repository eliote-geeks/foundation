import { useState, useEffect, useCallback } from 'react';
import { useTranslation as useI18n } from 'react-i18next';
import translationService from '../services/translationService';

interface UseTranslationResult {
    t: (key: string, fallback?: string) => string;
    translateText: (text: string) => Promise<string>;
    translateTextSync: (text: string) => string;
    isTranslating: boolean;
    currentLanguage: string;
    changeLanguage: (lang: string) => void;
    supportedLanguages: Record<string, string>;
}

/**
 * Hook personnalisé qui combine i18next avec l'API de traduction
 */
export function useTranslation(): UseTranslationResult {
    const { t: i18nT, i18n } = useI18n();
    const [isTranslating, setIsTranslating] = useState(false);
    const [supportedLanguages, setSupportedLanguages] = useState<Record<string, string>>({
        fr: 'Français',
        en: 'English'
    });
    const [translatedTexts, setTranslatedTexts] = useState<Map<string, string>>(new Map());

    // Charger les langues supportées au montage
    useEffect(() => {
        const loadSupportedLanguages = async () => {
            try {
                const result = await translationService.getSupportedLanguages();
                if (result.success && result.data) {
                    setSupportedLanguages(result.data.languages);
                }
            } catch (error) {
                console.warn('Could not load supported languages, using defaults');
                setSupportedLanguages({
                    fr: 'Français',
                    en: 'English'
                });
            }
        };

        loadSupportedLanguages();
    }, []);

    /**
     * Fonction t améliorée qui utilise i18next avec fallback sur l'API
     */
    const t = useCallback((key: string, fallback?: string): string => {
        // Essayer d'abord avec i18next
        const translated = i18nT(key);
        
        // Si la traduction i18next est identique à la clé, utiliser le fallback
        if (translated === key && fallback) {
            return fallback;
        }
        
        return translated;
    }, [i18nT]);

    /**
     * Traduit un texte dynamique via l'API
     */
    const translateText = useCallback(async (text: string): Promise<string> => {
        if (!text || text.trim() === '') {
            return text;
        }

        const cacheKey = `${text}_${i18n.language}`;
        
        // Vérifier le cache local
        if (translatedTexts.has(cacheKey)) {
            return translatedTexts.get(cacheKey)!;
        }

        setIsTranslating(true);
        
        try {
            const translatedText = await translationService.translateContent(text, i18n.language);
            
            // Mettre en cache le résultat
            setTranslatedTexts(prev => new Map(prev.set(cacheKey, translatedText)));
            
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [i18n.language, translatedTexts]);

    /**
     * Version synchrone qui retourne le texte en cache ou original
     */
    const translateTextSync = useCallback((text: string): string => {
        if (!text || text.trim() === '') {
            return text;
        }

        const cacheKey = `${text}_${i18n.language}`;
        
        if (translatedTexts.has(cacheKey)) {
            return translatedTexts.get(cacheKey)!;
        }

        // Déclencher la traduction en arrière-plan
        translateText(text);
        
        // Retourner le texte original en attendant
        return text;
    }, [i18n.language, translatedTexts, translateText]);

    /**
     * Change la langue et nettoie le cache
     */
    const changeLanguage = useCallback((lang: string) => {
        i18n.changeLanguage(lang);
        setTranslatedTexts(new Map()); // Nettoyer le cache lors du changement de langue
        translationService.clearCache();
    }, [i18n]);

    return {
        t,
        translateText,
        translateTextSync,
        isTranslating,
        currentLanguage: i18n.language,
        changeLanguage,
        supportedLanguages
    };
}