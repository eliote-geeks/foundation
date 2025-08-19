# Intégration API de Traduction - Fondation Titi

## Vue d'ensemble

Cette documentation explique l'intégration complète de l'API de traduction automatique français-anglais dans la plateforme de la Fondation Titi.

---

## 🏗️ Architecture

### Backend (Laravel)
- **Service de traduction** : `TranslationService.php`
- **Contrôleur API** : `TranslationController.php`
- **Routes API** : `/api/translation/*`
- **Configuration** : Google Translate API

### Frontend (React)
- **Service client** : `translationService.ts`
- **Hook personnalisé** : `useTranslation.tsx`
- **Composants intelligents** : `smart-text.tsx`
- **Sélecteur de langue** : `language-switcher.tsx`

---

## 🔧 Configuration

### 1. Clé API Google Translate

Ajoutez votre clé API dans le fichier `.env` :

```env
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
```

### 2. Installation des dépendances

Les dépendances sont déjà configurées :
- **Backend** : `guzzlehttp/guzzle` pour les requêtes HTTP
- **Frontend** : `i18next`, `react-i18next` pour l'internationalisation

---

## 📡 API Endpoints

### POST `/api/translation`
Traduit un texte simple
```json
{
  "text": "Bonjour le monde",
  "target_language": "en",
  "source_language": "fr"
}
```

### POST `/api/translation/batch`
Traduit plusieurs textes
```json
{
  "texts": ["Bonjour", "Comment allez-vous?"],
  "target_language": "en"
}
```

### POST `/api/translation/detect`
Détecte la langue d'un texte
```json
{
  "text": "Bonjour le monde"
}
```

### POST `/api/translation/auto`
Traduction automatique selon la langue utilisateur
```json
{
  "text": "Hello world",
  "user_language": "fr"
}
```

### GET `/api/translation/languages`
Liste des langues supportées

---

## 🎣 Utilisation Frontend

### Hook useTranslation

```tsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
    const { t, translateText, currentLanguage, changeLanguage } = useTranslation();
    
    // Traductions statiques (i18next)
    const title = t('welcome', 'Bienvenue');
    
    // Traductions dynamiques (API)
    const [dynamicText, setDynamicText] = useState('');
    
    useEffect(() => {
        translateText('Contenu dynamique').then(setDynamicText);
    }, []);
    
    return (
        <div>
            <h1>{title}</h1>
            <p>{dynamicText}</p>
        </div>
    );
}
```

### Composants Smart Text

```tsx
import { SmartText, SmartHeading, SmartParagraph } from '../components/foundation/smart-text';

function ContentPage() {
    return (
        <div>
            <SmartHeading level={1}>
                Titre qui sera traduit automatiquement
            </SmartHeading>
            
            <SmartParagraph>
                Ce paragraphe sera traduit selon la langue courante.
            </SmartParagraph>
            
            <SmartText tag="span" showLoader>
                Texte avec indicateur de chargement
            </SmartText>
        </div>
    );
}
```

### Sélecteur de langue amélioré

```tsx
import { LanguageSwitcher } from '../components/foundation/language-switcher';

function Header() {
    return (
        <nav>
            <LanguageSwitcher />
        </nav>
    );
}
```

---

## 🚀 Fonctionnalités

### 1. Traduction hybride
- **Statique** : Clés de traduction predéfinies via i18next
- **Dynamique** : Contenu généré par l'utilisateur via API Google Translate

### 2. Mise en cache intelligente
- **Frontend** : Cache en mémoire pour éviter les requêtes répétées
- **Backend** : Cache Laravel (24h) pour optimiser les performances

### 3. Détection automatique
- Détection de la langue source
- Traduction uniquement si nécessaire

### 4. Composants intelligents
- `SmartText` : Traduction automatique avec loading
- `QuickText` : Traduction instantanée avec cache
- `SmartHeading` / `SmartParagraph` : Composants spécialisés

---

## 📊 Optimisations

### Performance
- **Requêtes groupées** : Traduction batch pour plusieurs textes
- **Cache multi-niveau** : Frontend + Backend + Google API
- **Lazy loading** : Traduction à la demande

### UX
- **Indicateurs visuels** : Spinners de chargement
- **Fallback gracieux** : Affichage du texte original en cas d'erreur
- **Persistance** : Sauvegarde des préférences de langue

### Coûts
- **Cache agressif** : Réduction des appels API
- **Déduplication** : Éviter les traductions identiques
- **Optimisation des requêtes** : Batch processing

---

## 🔒 Sécurité

### API Key
- Stockée côté serveur uniquement
- Jamais exposée au frontend
- Configuration via variables d'environnement

### Validation
- Validation des entrées (longueur, format)
- Limite de requêtes par batch (100 textes max)
- Sanitisation des données

### Rate Limiting
- Throttling automatique côté Laravel
- Gestion des erreurs API
- Retry logic avec backoff

---

## 🧪 Tests

### Backend
```bash
php artisan test --filter TranslationTest
```

### Frontend
```bash
npm run test -- translation
```

---

## 📈 Monitoring

### Métriques à surveiller
- Nombre d'appels API par jour
- Temps de réponse moyen
- Taux d'erreur
- Utilisation du cache

### Logs
- Erreurs d'API dans `storage/logs/laravel.log`
- Métriques de performance
- Utilisation par langue

---

## 🔄 Migration

### Contenus existants
1. Identifier les textes statiques → Migrer vers i18next
2. Identifier les textes dynamiques → Utiliser SmartText
3. Tester la compatibilité avec les langues existantes

### Étapes de déploiement
1. Configurer la clé API Google Translate
2. Déployer le backend avec les nouvelles routes
3. Mettre à jour le frontend avec les nouveaux composants
4. Tester l'intégration complète
5. Monitorer les performances

---

## 🔗 Ressources

### Documentation API
- [Google Translate API](https://cloud.google.com/translate/docs)
- [Laravel HTTP Client](https://laravel.com/docs/http-client)
- [React i18next](https://react.i18next.com/)

### Configuration Google Cloud
1. Créer un projet Google Cloud
2. Activer l'API Cloud Translation
3. Créer une clé API
4. Configurer les restrictions (domaines, IP)

---

*Intégration réalisée le 18 août 2025 - Version 1.0*