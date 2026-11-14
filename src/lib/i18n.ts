import { LanguageCode } from '../types/shop';

export const SLOGANS = {
  main: 'Plus qu’un magasin, une solution !',
  quality: 'Des produits de qualité, adaptés à vos besoins.',
  priority: 'Votre satisfaction est notre priorité !',
  value: 'Chez Modoukpè, nous apportons de la valeur.',
  importExport: 'Import + Export partout avec vous',
};

export const DICTIONARY: Record<
  LanguageCode,
  {
    nav: {
      home: string;
      catalog: string;
      importExport: string;
      custom: string;
      surprise: string;
      contact: string;
      cart: string;
      orderNow: string;
    };
    hero: {
      welcome: string;
      subtitle: string;
      ctaWhatsapp: string;
      ctaCatalog: string;
      deliveryNote: string;
    };
    sections: {
      categoriesTitle: string;
      featuredTitle: string;
      viewAllCatalog: string;
      testimonialsTitle: string;
    };
  }
> = {
  fr: {
    nav: {
      home: 'Accueil',
      catalog: 'Catalogue',
      importExport: 'Import-Export',
      custom: 'Personnalisation',
      surprise: 'Surprise Agency',
      contact: 'Contact',
      cart: 'Panier',
      orderNow: 'Commander',
    },
    hero: {
      welcome: 'Bienvenue chez Modoukpè',
      subtitle:
        'Import-Export, Dermocosmétique & Surprise Agency entre le Bénin et le Niger. Commandez facilement et recevez vos articles chez vous.',
      ctaWhatsapp: 'Commandez dès maintenant',
      ctaCatalog: 'Voir le catalogue',
      deliveryNote: 'Livraison 24–48 h en local · 7–15 jours en import',
    },
    sections: {
      categoriesTitle: 'Nos univers produits',
      featuredTitle: 'Sélection vedette',
      viewAllCatalog: 'Explorer tout le catalogue',
      testimonialsTitle: 'Ils nous font confiance au Bénin et au Niger',
    },
  },
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      importExport: 'Import-Export',
      custom: 'Customization',
      surprise: 'Surprise Agency',
      contact: 'Contact',
      cart: 'Bag',
      orderNow: 'Order now',
    },
    hero: {
      welcome: 'Welcome to Chez Modoukpè',
      subtitle:
        'Import-Export, Dermocosmetics & Surprise Agency across Benin and Niger. Order effortlessly via WhatsApp.',
      ctaWhatsapp: 'Order now on WhatsApp',
      ctaCatalog: 'Browse catalog',
      deliveryNote: '24–48h local delivery · 7–15 days import',
    },
    sections: {
      categoriesTitle: 'Explore our categories',
      featuredTitle: 'Featured selection',
      viewAllCatalog: 'View full catalog',
      testimonialsTitle: 'Trusted by customers in Benin & Niger',
    },
  },
};
