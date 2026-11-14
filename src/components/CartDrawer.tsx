import { useState } from 'react';
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatPrice } from '../lib/currency';
import { ProductImage } from '../lib/media';
import { buildCartWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import { CartItem, CurrencyCode } from '../types/shop';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  open,
  onClose,
  items,
  currency,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [country, setCountry] = useState<'Bénin' | 'Niger'>('Bénin');
  const [city, setCity] = useState('Cotonou');

  if (!open) return null;

  const hasQuoteItems = items.some((i) => i.product.isOnQuote);
  const fixedTotalFcfa = items.reduce(
    (sum, i) => sum + (i.product.isOnQuote ? 0 : (i.product.priceFcfa ?? 0) * i.quantity),
    0
  );

  const whatsappUrl = buildCartWhatsAppUrl(items, currency, country, city.trim() || undefined);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Panier de commande"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#0099E5]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#0B2E59]">
              Votre panier ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le panier"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" aria-hidden="true" />
              <p className="text-base font-medium text-[#0B2E59]">Votre panier est vide</p>
              <p className="text-sm text-slate-500">
                Ajoutez des articles du catalogue pour envoyer une commande groupée sur WhatsApp.
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const variantText = [item.selectedSize, item.selectedColor]
                .filter(Boolean)
                .join(' · ');
              return (
                <div
                  key={`${item.product.id}-${variantText}-${idx}`}
                  className="py-4 flex gap-3.5"
                >
                  <ProductImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#0B2E59] line-clamp-2">
                          {item.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          aria-label={`Retirer ${item.product.name}`}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      {variantText && (
                        <p className="text-xs text-slate-500 mt-0.5">{variantText}</p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, -1)}
                          aria-label="Diminuer la quantité"
                          className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-semibold tabular-nums text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(idx, 1)}
                          aria-label="Augmenter la quantité"
                          className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-sm font-mono font-semibold tabular-nums text-slate-900">
                        {item.product.isOnQuote
                          ? 'Sur devis'
                          : formatPrice((item.product.priceFcfa ?? 0) * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer checkout via WhatsApp */}
        {items.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pays de livraison
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    const next = e.target.value as 'Bénin' | 'Niger';
                    setCountry(next);
                    if (next === 'Niger' && city === 'Cotonou') {
                      setCity('Niamey');
                    } else if (next === 'Bénin' && city === 'Niamey') {
                      setCity('Cotonou');
                    }
                  }}
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="Bénin">Bénin</option>
                  <option value="Niger">Niger</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ville / Quartier
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={country === 'Bénin' ? 'Cotonou...' : 'Niamey...'}
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Total estimé</span>
              <span className="font-mono text-lg font-bold tabular-nums text-[#0B2E59]">
                {formatPrice(fixedTotalFcfa, currency)}
                {hasQuoteItems ? ' + sur devis' : ''}
              </span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('checkout_whatsapp', { items_count: items.length })}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>Envoyer la commande sur WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Paiement à la livraison ou transfert (Mobile Money V2 prêt)</span>
              <button
                type="button"
                onClick={onClearCart}
                className="text-slate-600 hover:text-red-600 underline cursor-pointer shrink-0 ml-2"
              >
                Vider
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
