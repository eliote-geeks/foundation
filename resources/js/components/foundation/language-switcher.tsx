import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const currentLang = i18n.language;

    return (
        <DropdownButton 
            id="language-switcher" 
            title={
                <>
                    <i className="bi bi-translate me-2"></i>
                    {currentLang === 'fr' ? 'FR' : 'EN'}
                </>
            }
            variant="outline-secondary"
            size="sm"
        >
            <Dropdown.Item 
                onClick={() => changeLanguage('fr')}
                active={currentLang === 'fr'}
            >
                <i className="bi bi-flag me-2"></i>
                Français
            </Dropdown.Item>
            <Dropdown.Item 
                onClick={() => changeLanguage('en')}
                active={currentLang === 'en'}
            >
                <i className="bi bi-flag me-2"></i>
                English
            </Dropdown.Item>
        </DropdownButton>
    );
}