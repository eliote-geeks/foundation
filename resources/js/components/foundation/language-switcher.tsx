import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Dropdown, Button } from 'react-bootstrap';

interface LanguageOption {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

const languages: LanguageOption[] = [
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷'
    },
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧'
    }
];

interface LanguageSwitcherProps {
    variant?: 'default' | 'compact' | 'icon-only';
    size?: 'sm' | 'md' | 'lg';
}

export function LanguageSwitcher({ variant = 'default', size = 'sm' }: LanguageSwitcherProps) {
    const { currentLanguage, changeLanguage, t } = useTranslation();
    const [isChanging, setIsChanging] = useState(false);

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

    const handleLanguageChange = async (langCode: string) => {
        if (langCode === currentLanguage) return;
        
        setIsChanging(true);
        
        try {
            changeLanguage(langCode);
        } catch (error) {
            console.error('Erreur lors du changement de langue:', error);
        } finally {
            setTimeout(() => setIsChanging(false), 300);
        }
    };

    if (variant === 'compact') {
        return (
            <div className="d-flex gap-1">
                {languages.map((lang) => (
                    <Button
                        key={lang.code}
                        variant={currentLanguage === lang.code ? "primary" : "outline-secondary"}
                        size={size}
                        onClick={() => handleLanguageChange(lang.code)}
                        disabled={isChanging}
                        className="p-2"
                        style={{ minWidth: '40px', height: '32px' }}
                    >
                        <span className="small">{lang.flag}</span>
                    </Button>
                ))}
            </div>
        );
    }

    if (variant === 'icon-only') {
        return (
            <Dropdown>
                <Dropdown.Toggle
                    variant="outline-light" 
                    size={size}
                    className="p-2 border-0"
                    style={{ minWidth: '40px', height: '32px' }}
                    disabled={isChanging}
                >
                    {isChanging ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <span className="small">{currentLang.flag}</span>
                    )}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="shadow">
                    {languages.map((lang) => (
                        <Dropdown.Item
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`d-flex align-items-center gap-2 ${
                                currentLanguage === lang.code ? 'active' : ''
                            }`}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                            {currentLanguage === lang.code && (
                                <i className="bi bi-check-lg text-primary ms-auto"></i>
                            )}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Dropdown>
            <Dropdown.Toggle
                variant="outline-light" 
                size={size}
                className="d-flex align-items-center gap-2 border-0"
                disabled={isChanging}
            >
                {isChanging ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <>
                        <span>{currentLang.flag}</span>
                        <span className="d-none d-sm-inline">{currentLang.nativeName}</span>
                        <span className="d-sm-none">{currentLang.code.toUpperCase()}</span>
                    </>
                )}
                <i className="bi bi-chevron-down"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="shadow">
                <Dropdown.Header>
                    {t('selectLanguage', 'Sélectionner la langue')}
                </Dropdown.Header>
                {languages.map((lang) => (
                    <Dropdown.Item
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`d-flex align-items-center gap-2 ${
                            currentLanguage === lang.code ? 'active' : ''
                        }`}
                    >
                        <span>{lang.flag}</span>
                        <div className="flex-grow-1">
                            <div className="fw-medium">{lang.nativeName}</div>
                            <div className="small text-muted">{lang.name}</div>
                        </div>
                        {currentLanguage === lang.code && (
                            <i className="bi bi-check-lg text-primary"></i>
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}