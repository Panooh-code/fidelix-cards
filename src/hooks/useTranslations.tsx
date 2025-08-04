import { useState, useEffect, useMemo } from 'react';

// Define supported languages with their locale codes
export type SupportedLanguage = 'pt-BR' | 'pt-PT' | 'es-ES' | 'en' | 'fr' | 'it' | 'de';

// Translation dictionary with all supported languages
const translations = {
  'pt-BR': {
    title: 'Cartão de Fidelidade {businessName}',
    subtitle: 'Quer participar do nosso cartão de fidelidade para colecionar selos e conquistar recompensas incríveis?',
    flipButton: 'Virar cartão',
    ctaIntermediate: 'Participe agora!',
    terms: 'Concordo em participar da promoção e fazer parte do clube/cartão de fidelidade {businessName}, e em receber comunicações sobre o programa.',
    ctaPrimary: 'Quero participar!',
    decline: 'Não, obrigado',
    loading: 'Carregando cartão...',
    cardNotFound: 'Cartão não encontrado',
    cardNotFoundMessage: 'Este cartão não existe ou não está mais ativo.',
    backToHome: 'Voltar ao início',
    back: 'Voltar',
    loyaltyCard: 'Cartão de Fidelidade',
    agreeToTermsError: 'Você deve concordar com os termos para participar'
  },
  'pt-PT': {
    title: 'Cartão de Fidelização {businessName}',
    subtitle: 'Gostaria de aderir ao nosso cartão de fidelização para acumular selos e ganhar recompensas fantásticas?',
    flipButton: 'Virar cartão',
    ctaIntermediate: 'Junte-se agora!',
    terms: 'Aceito participar na campanha e integrar o clube/cartão de fidelização {businessName}, bem como receber comunicações relacionadas com o programa.',
    ctaPrimary: 'Quero aderir!',
    decline: 'Não, obrigado',
    loading: 'A carregar cartão...',
    cardNotFound: 'Cartão não encontrado',
    cardNotFoundMessage: 'Este cartão não existe ou já não está activo.',
    backToHome: 'Voltar ao início',
    back: 'Voltar',
    loyaltyCard: 'Cartão de Fidelização',
    agreeToTermsError: 'Deve concordar com os termos para participar'
  },
  'es-ES': {
    title: 'Tarjeta de Fidelidad {businessName}',
    subtitle: '¿Te gustaría unirte a nuestra tarjeta de fidelidad para coleccionar sellos y conseguir recompensas increíbles?',
    flipButton: 'Girar tarjeta',
    ctaIntermediate: 'Únete ahora',
    terms: 'Acepto participar en la promoción, formar parte del club de fidelidad {businessName} y recibir comunicaciones relacionadas con el programa.',
    ctaPrimary: 'Quiero unirme',
    decline: 'No, gracias',
    loading: 'Cargando tarjeta...',
    cardNotFound: 'Tarjeta no encontrada',
    cardNotFoundMessage: 'Esta tarjeta no existe o ya no está activa.',
    backToHome: 'Volver al inicio',
    back: 'Volver',
    loyaltyCard: 'Tarjeta de Fidelidad',
    agreeToTermsError: 'Debes aceptar los términos para participar'
  },
  'en': {
    title: '{businessName} Loyalty Card',
    subtitle: 'Would you like to join our loyalty card program to collect stamps and unlock amazing rewards?',
    flipButton: 'Flip card',
    ctaIntermediate: 'Join now!',
    terms: 'I agree to join the promotion and become part of the {businessName} loyalty club, and to receive communications related to the program.',
    ctaPrimary: 'I want to join!',
    decline: 'No, thanks',
    loading: 'Loading card...',
    cardNotFound: 'Card not found',
    cardNotFoundMessage: 'This card does not exist or is no longer active.',
    backToHome: 'Back to home',
    back: 'Back',
    loyaltyCard: 'Loyalty Card',
    agreeToTermsError: 'You must agree to the terms to participate'
  },
  'fr': {
    title: 'Carte de Fidélité {businessName}',
    subtitle: 'Souhaitez-vous rejoindre notre carte de fidélité pour collectionner des tampons et obtenir des récompenses exclusives ?',
    flipButton: 'Retourner la carte',
    ctaIntermediate: 'Rejoindre maintenant',
    terms: 'J\'accepte de participer à la promotion, de faire partie du club de fidélité {businessName} et de recevoir des communications relatives au programme.',
    ctaPrimary: 'Je veux participer',
    decline: 'Non merci',
    loading: 'Chargement de la carte...',
    cardNotFound: 'Carte introuvable',
    cardNotFoundMessage: 'Cette carte n\'existe pas ou n\'est plus active.',
    backToHome: 'Retour à l\'accueil',
    back: 'Retour',
    loyaltyCard: 'Carte de Fidélité',
    agreeToTermsError: 'Vous devez accepter les termes pour participer'
  },
  'it': {
    title: 'Carta Fedeltà {businessName}',
    subtitle: 'Vuoi partecipare alla nostra carta fedeltà per raccogliere timbri e ottenere premi esclusivi?',
    flipButton: 'Gira la carta',
    ctaIntermediate: 'Unisciti ora',
    terms: 'Acconsento a partecipare alla promozione, entrare a far parte del club fedeltà {businessName} e ricevere comunicazioni relative al programma.',
    ctaPrimary: 'Voglio partecipare!',
    decline: 'No, grazie',
    loading: 'Caricamento carta...',
    cardNotFound: 'Carta non trovata',
    cardNotFoundMessage: 'Questa carta non esiste o non è più attiva.',
    backToHome: 'Torna alla home',
    back: 'Indietro',
    loyaltyCard: 'Carta Fedeltà',
    agreeToTermsError: 'Devi accettare i termini per partecipare'
  },
  'de': {
    title: '{businessName} Treuekarte',
    subtitle: 'Möchtest du an unserem Treueprogramm teilnehmen, um Stempel zu sammeln und tolle Belohnungen zu erhalten?',
    flipButton: 'Karte drehen',
    ctaIntermediate: 'Jetzt mitmachen',
    terms: 'Ich stimme zu, an der Aktion teilzunehmen, Teil des {businessName} Treueclubs zu werden und Mitteilungen zum Programm zu erhalten.',
    ctaPrimary: 'Ich möchte mitmachen!',
    decline: 'Nein, danke',
    loading: 'Karte wird geladen...',
    cardNotFound: 'Karte nicht gefunden',
    cardNotFoundMessage: 'Diese Karte existiert nicht oder ist nicht mehr aktiv.',
    backToHome: 'Zurück zur Startseite',
    back: 'Zurück',
    loyaltyCard: 'Treuekarte',
    agreeToTermsError: 'Sie müssen den Bedingungen zustimmen, um teilzunehmen'
  }
};

// Language detection function
const detectLanguage = (): SupportedLanguage => {
  const userLanguage = navigator.language || navigator.languages?.[0] || 'en';
  
  // Check exact match first
  if (userLanguage in translations) {
    return userLanguage as SupportedLanguage;
  }
  
  // Check language without region (e.g., 'pt' from 'pt-BR')
  const languageCode = userLanguage.split('-')[0];
  
  // Map common language codes to specific variants
  switch (languageCode) {
    case 'pt':
      return 'pt-BR'; // Default Portuguese to Brazilian
    case 'es':
      return 'es-ES';
    case 'en':
      return 'en';
    case 'fr':
      return 'fr';
    case 'it':
      return 'it';
    case 'de':
      return 'de';
    default:
      return 'en'; // Fallback to English
  }
};

// Hook for managing translations
export const useTranslations = (businessName?: string) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const detectedLanguage = detectLanguage();
    setLanguage(detectedLanguage);
  }, []);

  const t = useMemo(() => {
    const currentTranslations = translations[language];
    
    return (key: keyof typeof translations['en'], interpolations?: Record<string, string>) => {
      let text = currentTranslations[key] || translations['en'][key] || key;
      
      // Replace placeholders with actual values
      if (interpolations) {
        Object.entries(interpolations).forEach(([placeholder, value]) => {
          text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
        });
      }
      
      // Replace business name placeholder
      if (businessName) {
        text = text.replace(/{businessName}/g, businessName);
      }
      
      return text;
    };
  }, [language, businessName]);

  return {
    t,
    language,
    setLanguage
  };
};