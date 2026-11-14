import { CurrencyCode } from '../types/shop';

const RATES_FROM_FCFA: Record<CurrencyCode, number> = {
  FCFA: 1,
  EUR: 1 / 655.957,
  USD: 1 / 605,
};

export function formatPrice(
  priceFcfa: number | null,
  currency: CurrencyCode = 'FCFA',
  isOnQuote = false
): string {
  if (isOnQuote || priceFcfa === null) {
    return 'Sur devis';
  }
  if (currency === 'FCFA') {
    const formatted = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    }).format(Math.round(priceFcfa));
    return `${formatted} FCFA`;
  }
  const converted = priceFcfa * RATES_FROM_FCFA[currency];
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}
