import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface SmartTextProps {
    children: string;
    className?: string;
    tag?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    showLoader?: boolean;
    fallback?: string;
}

/**
 * Composant qui traduit automatiquement le texte selon la langue courante
 */
export function SmartText({ 
    children, 
    className, 
    tag: Tag = 'span', 
    showLoader = false,
    fallback
}: SmartTextProps) {
    const { translateText, isTranslating, currentLanguage } = useTranslation();
    const [translatedText, setTranslatedText] = useState<string>(children);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const performTranslation = async () => {
            if (!children || children.trim() === '') {
                setTranslatedText(children);
                return;
            }

            setIsLoading(true);
            
            try {
                const result = await translateText(children);
                setTranslatedText(result);
            } catch (error) {
                console.error('SmartText translation error:', error);
                setTranslatedText(fallback || children);
            } finally {
                setIsLoading(false);
            }
        };

        performTranslation();
    }, [children, currentLanguage, translateText, fallback]);

    const displayText = translatedText || fallback || children;

    if (showLoader && (isLoading || isTranslating)) {
        return (
            <Tag className={className}>
                <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {displayText}
                </span>
            </Tag>
        );
    }

    return <Tag className={className}>{displayText}</Tag>;
}

/**
 * Composant pour les textes courts avec traduction instantanée
 */
export function QuickText({ children, className }: { children: string; className?: string }) {
    const { translateTextSync } = useTranslation();
    
    return (
        <span className={className}>
            {translateTextSync(children)}
        </span>
    );
}

/**
 * Composant pour les titres avec traduction
 */
export function SmartHeading({ 
    children, 
    level = 1, 
    className 
}: { 
    children: string; 
    level?: 1 | 2 | 3 | 4 | 5 | 6; 
    className?: string; 
}) {
    const Tag = `h${level}` as const;
    
    return (
        <SmartText tag={Tag} className={className} showLoader>
            {children}
        </SmartText>
    );
}

/**
 * Composant pour les paragraphes avec traduction
 */
export function SmartParagraph({ children, className }: { children: string; className?: string }) {
    return (
        <SmartText tag="p" className={className} showLoader>
            {children}
        </SmartText>
    );
}