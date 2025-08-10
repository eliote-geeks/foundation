import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
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
    }
  },
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
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