export type CategoryName =
  | 'Articles personnalisés'
  | 'Articles importés'
  | 'Articles homme'
  | 'Articles femme'
  | 'Électroménager'
  | 'Cadeaux & produits de qualité'
  | 'Dermocosmétique';

export const ALL_CATEGORIES: CategoryName[] = [
  'Articles personnalisés',
  'Articles importés',
  'Articles homme',
  'Articles femme',
  'Électroménager',
  'Cadeaux & produits de qualité',
  'Dermocosmétique',
];

export type CurrencyCode = 'FCFA' | 'EUR' | 'USD';
export type LanguageCode = 'fr' | 'en';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryName;
  description: string;
  priceFcfa: number | null;
  isOnQuote: boolean;
  sizes: string[];
  colors: string[];
  imageUrl: string;
  featured: boolean;
  available: boolean;
  deliveryEstimate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type RequestType = 'import_export' | 'custom' | 'surprise' | 'contact';
export type RequestStatus = 'nouvelle' | 'en_cours' | 'traitee';

export interface CustomerRequest {
  id: string;
  type: RequestType;
  customerName: string;
  phone: string;
  email?: string;
  country: 'Bénin' | 'Niger';
  city?: string;
  summary: string;
  details: Record<string, string>;
  status: RequestStatus;
  createdAt: string;
}
