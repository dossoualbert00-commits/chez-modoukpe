import { CartItem, CurrencyCode, Product } from '../types/shop';
import { formatPrice } from './currency';

export const BRAND_CONTACTS = {
  whatsappDisplay: '+227 87 78 80 06',
  whatsappNumber: '22787788006',
  email: 'modoukpebadjimou6@gmail.com',
  facebookLabel: 'Modoukpè',
  facebookUrl: 'https://www.facebook.com/search/top?q=Modoukp%C3%A8',
  instagramHandle: '@soleil.0301',
  instagramUrl: 'https://www.instagram.com/soleil.0301/',
  domain: 'https://chezmodoukpe.com',
};

function cleanSpaces(text: string): string {
  return text.replace(/[\u00a0\u202f]/g, ' ');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://api.whatsapp.com/send?phone=${BRAND_CONTACTS.whatsappNumber}&text=${encodeURIComponent(message)}`;
}

interface OrderLineInput {
  name: string;
  quantity: number;
  priceText: string;
  variantLabel?: string;
}

function buildStructuredOrderMessage(
  items: OrderLineInput[],
  totalText: string,
  country: 'Bénin' | 'Niger',
  city?: string
): string {
  const lines: string[] = [
    ' Bonjour Chez Modoukpè !',
    'Je souhaite passer la commande suivante :',
    '',
  ];

  items.forEach((item, idx) => {
    const title = item.variantLabel ? `${item.name} (${item.variantLabel})` : item.name;
    lines.push(`${idx + 1}. *${title}*`);
    lines.push(`   - Quantité: ${item.quantity}`);
    lines.push(`   - Prix: ${cleanSpaces(item.priceText)}`);
    lines.push('');
  });

  lines.push(` *TOTAL ESTIMÉ:* ${cleanSpaces(totalText)}`);
  lines.push('');
  lines.push(' *INFORMATIONS DE LIVRAISON:*');
  lines.push(`• Pays de livraison: ${country}`);
  lines.push(`• Ville: ${city?.trim() || 'Cotonou'}`);
  lines.push('');
  lines.push(' Merci de me confirmer la disponibilité et les modalités de paiement !');

  return lines.join('\n');
}

export function buildProductWhatsAppUrl(
  product: Product,
  quantity: number,
  currency: CurrencyCode,
  variantLabel?: string,
  country: 'Bénin' | 'Niger' = 'Bénin',
  city?: string
): string {
  const priceText = product.isOnQuote
    ? 'Sur devis'
    : formatPrice((product.priceFcfa ?? 0) * quantity, currency, false);

  const message = buildStructuredOrderMessage(
    [
      {
        name: product.name,
        quantity,
        priceText,
        variantLabel,
      },
    ],
    priceText,
    country,
    city ?? (country === 'Bénin' ? 'Cotonou' : 'Niamey')
  );

  return buildWhatsAppUrl(message);
}

export function buildCartWhatsAppUrl(
  items: CartItem[],
  currency: CurrencyCode,
  country: 'Bénin' | 'Niger',
  customerCity?: string
): string {
  const hasQuoteItems = items.some((i) => i.product.isOnQuote);
  const fixedTotalFcfa = items.reduce(
    (sum, i) => sum + (i.product.isOnQuote ? 0 : (i.product.priceFcfa ?? 0) * i.quantity),
    0
  );

  const formattedItems: OrderLineInput[] = items.map((item) => {
    const variantParts = [item.selectedSize, item.selectedColor]
      .filter((v) => v && v !== 'Standard')
      .join(' / ');
    const linePrice = item.product.isOnQuote
      ? 'Sur devis'
      : formatPrice((item.product.priceFcfa ?? 0) * item.quantity, currency, false);
    return {
      name: item.product.name,
      quantity: item.quantity,
      priceText: linePrice,
      variantLabel: variantParts || undefined,
    };
  });

  const totalText = `${formatPrice(fixedTotalFcfa, currency, false)}${
    hasQuoteItems ? ' + articles sur devis' : ''
  }`;

  const message = buildStructuredOrderMessage(
    formattedItems,
    totalText,
    country,
    customerCity?.trim() || (country === 'Bénin' ? 'Cotonou' : 'Niamey')
  );

  return buildWhatsAppUrl(message);
}
