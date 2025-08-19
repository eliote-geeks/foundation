import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useTranslation } from '../../hooks/useTranslation';

interface InterestsSkillsSelectorProps {
    type: 'interests' | 'skills';
    availableOptions: string[];
    selectedItems: string[];
    onChange: (items: string[]) => void;
    maxItems?: number;
    allowCustom?: boolean;
    placeholder?: string;
    error?: string;
    className?: string;
}

export function InterestsSkillsSelector({
    type,
    availableOptions,
    selectedItems,
    onChange,
    maxItems = 10,
    allowCustom = true,
    placeholder,
    error,
    className = ''
}: InterestsSkillsSelectorProps) {
    const { t } = useTranslation();
    const [customInput, setCustomInput] = useState('');
    const [showAll, setShowAll] = useState(false);

    const displayOptions = showAll ? availableOptions : availableOptions.slice(0, 12);

    const handleToggleItem = (item: string) => {
        if (selectedItems.includes(item)) {
            onChange(selectedItems.filter(i => i !== item));
        } else if (selectedItems.length < maxItems) {
            onChange([...selectedItems, item]);
        }
    };

    const handleAddCustom = () => {
        const trimmedInput = customInput.trim();
        if (trimmedInput && !selectedItems.includes(trimmedInput) && selectedItems.length < maxItems) {
            onChange([...selectedItems, trimmedInput]);
            setCustomInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustom();
        }
    };

    const label = type === 'interests' ? t('interests', 'Centres d\'intérêt') : t('skills', 'Compétences');
    const defaultPlaceholder = type === 'interests' 
        ? t('addCustomInterest', 'Ajouter un centre d\'intérêt')
        : t('addCustomSkill', 'Ajouter une compétence');

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedItems.length}/{maxItems} {t('selected', 'sélectionné(s)')}
                </span>
            </div>

            {/* Options prédéfinies */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                    {displayOptions.map((option) => {
                        const isSelected = selectedItems.includes(option);
                        
                        return (
                            <Button
                                key={option}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleToggleItem(option)}
                                disabled={!isSelected && selectedItems.length >= maxItems}
                                className="text-xs h-8"
                            >
                                {isSelected && (
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {option}
                            </Button>
                        );
                    })}
                </div>

                {availableOptions.length > 12 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs text-blue-600 dark:text-blue-400"
                    >
                        {showAll 
                            ? t('showLess', 'Voir moins')
                            : t('showMore', `Voir ${availableOptions.length - 12} options supplémentaires`)
                        }
                    </Button>
                )}
            </div>

            {/* Ajout personnalisé */}
            {allowCustom && selectedItems.length < maxItems && (
                <div className="mb-4">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={placeholder || defaultPlaceholder}
                            className="flex-1"
                            maxLength={50}
                        />
                        <Button
                            type="button"
                            onClick={handleAddCustom}
                            disabled={!customInput.trim() || selectedItems.includes(customInput.trim())}
                            size="sm"
                        >
                            {t('add', 'Ajouter')}
                        </Button>
                    </div>
                </div>
            )}

            {/* Items sélectionnés */}
            {selectedItems.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {t('selectedItems', 'Éléments sélectionnés')} :
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                            <Badge
                                key={item}
                                variant="secondary"
                                className="flex items-center gap-1 px-2 py-1"
                            >
                                <span className="text-xs">{item}</span>
                                <button
                                    type="button"
                                    onClick={() => handleToggleItem(item)}
                                    className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {selectedItems.length >= maxItems && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    {t('maxItemsReached', `Maximum ${maxItems} éléments autorisés`)}
                </p>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

export default InterestsSkillsSelector;