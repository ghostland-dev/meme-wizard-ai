// Application constants for production

export const APP_CONFIG = {
  name: 'Meme Wizard AI',
  description: 'Générateur de memes IA avec styles personnalisables',
  url: 'https://meme-wizard-ai.com',
  version: '1.0.0',
  author: 'Meme Wizard AI Team',
  
  // Features
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxImageDimension: 2048,
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxPromptLength: 500,
  
  // Credits system
  defaultCredits: 3,
  maxCredits: 1000,
  
  // Performance
  apiTimeout: 30000, // 30 seconds
  retryAttempts: 3,
  
  // Social sharing
  socialLinks: {
    twitter: 'https://twitter.com/memewizardai',
    facebook: 'https://facebook.com/memewizardai',
    instagram: 'https://instagram.com/memewizardai',
  },
} as const;

export const MEME_STYLES = {
  viral: '🔥 Viral',
  funny: '😂 Drôle',
  classic: '📱 Classique',
  dark: '🖤 Sombre',
  wholesome: '💕 Bienveillant',
  political: '🏛️ Politique',
  tech: '💻 Tech',
  gaming: '🎮 Gaming',
} as const;

export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    credits: 20,
    price: 5,
    description: 'Parfait pour commencer',
  },
  popular: {
    name: 'Populaire',
    credits: 50,
    price: 10,
    description: 'Le plus choisi par nos utilisateurs',
  },
  pro: {
    name: 'Pro',
    credits: 100,
    price: 18,
    description: 'Pour les créateurs actifs',
  },
  unlimited: {
    name: 'Illimité',
    credits: 250,
    price: 35,
    description: 'Création sans limites',
  },
} as const;