import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      home: 'Accueil',
      tickets: 'Billetterie',
      contests: 'Concours',
      events: 'Événements',
      members: 'Membres',
      programs: 'Programmes',
      partners: 'Partenaires',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      
      // Auth
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      rememberMe: 'Se souvenir de moi',
      
      // Foundation platform
      welcome: 'Bienvenue sur la plateforme de la Fondation',
      contestVoting: 'Vote des concours',
      ticketPurchase: 'Achat de billets',
      memberSpace: 'Espace membre',
      programRegistration: 'Inscription aux programmes',
      partnerSpace: 'Espace partenaires',
      
      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      search: 'Rechercher',
      loading: 'Chargement...',
      
      // Profile types
      member: 'Adhérent',
      ambassador: 'Ambassadeur',
      challenger: 'Ancien challenger',
      partner: 'Partenaire',
      
      // Language settings
      chooseLanguage: 'Choisissez votre langue',
      languageDescription: 'Sélectionnez la langue d\'affichage de la plateforme',
      selectLanguage: 'Sélectionner la langue',
      selected: 'Sélectionné',
      languageInfo: 'Information sur la langue',
      languageSettings: 'Paramètres de langue',
      languageSettingsDescription: 'Personnalisez votre expérience linguistique sur la plateforme',
      selectPreferredLanguage: 'Sélectionner votre langue préférée',
      languageFeatures: 'Fonctionnalités linguistiques',
      staticTranslation: 'Traduction statique',
      dynamicTranslation: 'Traduction dynamique',
      contextualTranslation: 'Traduction contextuelle',
      languageStats: 'Statistiques linguistiques',
      currentLanguage: 'Langue actuelle',
      supportedLanguages: 'Langues supportées',
      translationAccuracy: 'Précision de traduction',
      unsavedChanges: 'Modifications non sauvegardées',
      saveChangesPrompt: 'Vous avez des modifications non sauvegardées. Souhaitez-vous les enregistrer?',
      saveChanges: 'Sauvegarder',
      languageSaved: 'Langue sauvegardée avec succès!',
      profile: 'Profil',
      join: 'Rejoindre',
      
      // Member registration
      memberRegistration: 'Inscription membre',
      joinFoundation: 'Rejoignez la Fondation Titi',
      memberRegistrationDescription: 'Créez votre profil complet et devenez membre de notre communauté',
      selectMemberType: 'Sélectionnez votre type de membre',
      personalInfo: 'Informations personnelles',
      professionalProfile: 'Profil professionnel',
      finalizeRegistration: 'Finaliser l\'inscription',
      step: 'Étape',
      of: 'sur',
      continue: 'Continuer',
      back: 'Retour',
      
      // Form fields
      accountInfo: 'Informations de compte',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      birthDate: 'Date de naissance',
      gender: 'Genre',
      selectGender: 'Sélectionnez votre genre',
      male: 'Masculin',
      female: 'Féminin',
      other: 'Autre',
      preferNotToSay: 'Préfère ne pas dire',
      location: 'Localisation',
      address: 'Adresse',
      city: 'Ville',
      postalCode: 'Code postal',
      country: 'Pays',
      languagePreference: 'Préférence de langue',
      professionalInfo: 'Informations professionnelles',
      profession: 'Profession',
      company: 'Entreprise',
      bio: 'Biographie',
      bioPlaceholder: 'Parlez-nous de vous...',
      socialNetworks: 'Réseaux sociaux',
      socialNetworksDescription: 'Optionnel - Partagez vos profils sociaux',
      communicationPreferences: 'Préférences de communication',
      communicationDescription: 'Choisissez comment vous souhaitez recevoir nos communications',
      newsletter: 'Newsletter et actualités',
      smsNotifications: 'Notifications SMS',
      phoneNotifications: 'Appels téléphoniques',
      registrationSummary: 'Résumé de votre inscription',
      fullName: 'Nom complet',
      processing: 'Traitement...',
      completeRegistration: 'Finaliser l\'inscription',
      
      // Member types
      memberType: 'Type de membre',
      
      // Misc
      memberTypeDescription: 'Choisissez le type de membre qui correspond à votre profil et vos objectifs',
      clickToSelect: 'Cliquer pour sélectionner',
      memberRegistrationBadge: 'Inscription membre simplifiée !',
    }
  },
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      home: 'Home',
      tickets: 'Tickets',
      contests: 'Contests',
      events: 'Events',
      members: 'Members',
      programs: 'Programs',
      partners: 'Partners',
      settings: 'Settings',
      logout: 'Logout',
      
      // Auth
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot your password?',
      rememberMe: 'Remember me',
      
      // Foundation platform
      welcome: 'Welcome to the Foundation Platform',
      contestVoting: 'Contest Voting',
      ticketPurchase: 'Ticket Purchase',
      memberSpace: 'Member Space',
      programRegistration: 'Program Registration',
      partnerSpace: 'Partner Space',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      loading: 'Loading...',
      
      // Profile types
      member: 'Member',
      ambassador: 'Ambassador',
      challenger: 'Former challenger',
      partner: 'Partner',
      
      // Language settings
      chooseLanguage: 'Choose your language',
      languageDescription: 'Select the platform display language',
      selectLanguage: 'Select language',
      selected: 'Selected',
      languageInfo: 'Language information',
      languageSettings: 'Language Settings',
      languageSettingsDescription: 'Customize your linguistic experience on the platform',
      selectPreferredLanguage: 'Select your preferred language',
      languageFeatures: 'Language features',
      staticTranslation: 'Static translation',
      dynamicTranslation: 'Dynamic translation',
      contextualTranslation: 'Contextual translation',
      languageStats: 'Language statistics',
      currentLanguage: 'Current language',
      supportedLanguages: 'Supported languages',
      translationAccuracy: 'Translation accuracy',
      unsavedChanges: 'Unsaved changes',
      saveChangesPrompt: 'You have unsaved changes. Would you like to save them?',
      saveChanges: 'Save changes',
      languageSaved: 'Language saved successfully!',
      profile: 'Profile',
      join: 'Join',
      
      // Member registration
      memberRegistration: 'Member Registration',
      joinFoundation: 'Join Titi Foundation',
      memberRegistrationDescription: 'Create your complete profile and become a member of our community',
      selectMemberType: 'Select your member type',
      personalInfo: 'Personal information',
      professionalProfile: 'Professional profile',
      finalizeRegistration: 'Finalize registration',
      step: 'Step',
      of: 'of',
      continue: 'Continue',
      back: 'Back',
      
      // Form fields
      accountInfo: 'Account information',
      firstName: 'First name',
      lastName: 'Last name',
      birthDate: 'Birth date',
      gender: 'Gender',
      selectGender: 'Select your gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotToSay: 'Prefer not to say',
      location: 'Location',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country',
      languagePreference: 'Language preference',
      professionalInfo: 'Professional information',
      profession: 'Profession',
      company: 'Company',
      bio: 'Biography',
      bioPlaceholder: 'Tell us about yourself...',
      socialNetworks: 'Social networks',
      socialNetworksDescription: 'Optional - Share your social profiles',
      communicationPreferences: 'Communication preferences',
      communicationDescription: 'Choose how you want to receive our communications',
      newsletter: 'Newsletter and news',
      smsNotifications: 'SMS notifications',
      phoneNotifications: 'Phone calls',
      registrationSummary: 'Registration summary',
      fullName: 'Full name',
      processing: 'Processing...',
      completeRegistration: 'Complete registration',
      
      // Member types
      memberType: 'Member type',
      
      // Misc
      memberTypeDescription: 'Choose the member type that matches your profile and goals',
      clickToSelect: 'Click to select',
      memberRegistrationBadge: 'Simplified member registration!',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
