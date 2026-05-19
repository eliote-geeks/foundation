import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTranslation } from '../../hooks/useTranslation';

interface MemberType {
    label: string;
    description: string;
    icon: string;
    color: string;
}

interface MemberTypes {
    [key: string]: MemberType;
}

interface MemberTypeSelectorProps {
    memberTypes: MemberTypes;
    selectedType: string;
    onChange: (type: string) => void;
    error?: string;
    className?: string;
}

export function MemberTypeSelector({
    memberTypes,
    selectedType,
    onChange,
    error,
    className = ''
}: MemberTypeSelectorProps) {
    const { t } = useTranslation();

    const getCardStyle = (color: string, isSelected: boolean) => {
        const baseStyle = {
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            borderRadius: '20px',
            border: '2px solid',
        };
        
        if (isSelected) {
            const colorMap = {
                'blue': {
                    background: 'linear-gradient(135deg, #5FA145 0%, #4D8A3C 100%)',
                    borderColor: '#5FA145',
                    boxShadow: '0 15px 40px rgba(95, 161, 69, 0.4)'
                },
                'gold': {
                    background: 'linear-gradient(135deg, #C69438 0%, #5FA145 100%)',
                    borderColor: '#C69438',
                    boxShadow: '0 15px 40px rgba(198, 148, 56, 0.4)'
                },
                'green': {
                    background: 'linear-gradient(135deg, #5FA145 0%, #C69438 100%)',
                    borderColor: '#5FA145',
                    boxShadow: '0 15px 40px rgba(95, 161, 69, 0.4)'
                },
                'purple': {
                    background: 'linear-gradient(135deg, #C69438 0%, #F9D27A 100%)',
                    borderColor: '#C69438',
                    boxShadow: '0 15px 40px rgba(198, 148, 56, 0.4)'
                },
                'red': {
                    background: 'linear-gradient(135deg, #C69438 0%, #C69438 100%)',
                    borderColor: '#C69438',
                    boxShadow: '0 15px 40px rgba(198, 148, 56, 0.4)'
                },
                'cyan': {
                    background: 'linear-gradient(135deg, #4D8A3C 0%, #334E15 100%)',
                    borderColor: '#4D8A3C',
                    boxShadow: '0 15px 40px rgba(77, 138, 60, 0.4)'
                }
            };
            
            return {
                ...baseStyle,
                ...colorMap[color as keyof typeof colorMap] || colorMap.blue
            };
        }
        
        return {
            ...baseStyle,
            background: 'rgba(232, 245, 232, 0.1)',
            borderColor: 'rgba(232, 245, 232, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
        };
    };

    return (
        <div className={className}>
            <div className="mb-6">
                <h2 
                    className="h3 fw-bold mb-3"
                    style={{ 
                        color: '#E8F5E8',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {t('memberType', 'Type de membre')} *
                </h2>
                <p 
                    style={{ 
                        color: '#E8F5E8',
                        opacity: 0.9,
                        fontSize: '1.1rem'
                    }}
                >
                    {t('memberTypeDescription', 'Choisissez le type de membre qui correspond à votre profil et vos objectifs')}
                </p>
            </div>
            
            <div className="row g-4">
                {Object.entries(memberTypes).map(([key, memberType]) => {
                    const isSelected = selectedType === key;
                    const cardStyle = getCardStyle(memberType.color, isSelected);
                    
                    return (
                        <div key={key} className="col-lg-4 col-md-6">
                            <div
                                style={cardStyle}
                                onClick={() => onChange(key)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    if (!isSelected) {
                                        e.currentTarget.style.background = 'rgba(232, 245, 232, 0.2)';
                                        e.currentTarget.style.borderColor = 'rgba(95, 161, 69, 0.5)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    if (!isSelected) {
                                        e.currentTarget.style.background = 'rgba(232, 245, 232, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(232, 245, 232, 0.3)';
                                    }
                                }}
                            >
                                <div className="p-4 text-center">
                                    <div className="mb-3" style={{ fontSize: '3rem' }}>{memberType.icon}</div>
                                    <h3 
                                        className="h5 fw-bold mb-3"
                                        style={{ 
                                            color: isSelected ? '#334E15' : '#E8F5E8',
                                            textShadow: isSelected ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        {memberType.label}
                                    </h3>
                                    <p 
                                        className="mb-4"
                                        style={{ 
                                            color: isSelected ? 'rgba(51, 78, 21, 0.8)' : 'rgba(232, 245, 232, 0.9)',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4'
                                        }}
                                    >
                                        {memberType.description}
                                    </p>
                                    
                                    <div className="d-flex align-items-center justify-content-center">
                                        {isSelected ? (
                                            <div 
                                                className="d-flex align-items-center gap-2 fw-semibold"
                                                style={{ color: '#334E15' }}
                                            >
                                                <i className="bi bi-check-circle-fill"></i>
                                                <span style={{ fontSize: '0.9rem' }}>
                                                    {t('selected', 'Sélectionné')}
                                                </span>
                                            </div>
                                        ) : (
                                            <div 
                                                style={{ 
                                                    color: 'rgba(232, 245, 232, 0.7)',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {t('clickToSelect', 'Cliquer pour sélectionner')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

export default MemberTypeSelector;