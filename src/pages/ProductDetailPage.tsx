import { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { formatPrice } from '../lib/currency';
import { ProductImage } from '../lib/media';
import { BRAND_CONTACTS, buildProductWhatsAppUrl } from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';
import { CurrencyCode, Product } from '../types/shop';

interface ProductDetailPageProps {
  product: Product | null;
  currency: CurrencyCode;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
}

export function ProductDetailPage({
  product,
  currency,
  onBackToCatalog,
  onAddToCart,
}: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryCountry, setDeliveryCountry] = useState<'Bénin' | 'Niger'>('Bénin');
  const [deliveryCity, setDeliveryCity] = useState('Cotonou');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? '');
      setSelectedColor(product.colors[0] ?? '');
      setQuantity(1);
    }
  }, [product?.id]);

  // Inject Schema.org Product JSON-LD dynamically
  useEffect(() => {
    if (!product) return;
    const scriptId = 'modoukpe-product-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      category: product.category,
      url: `${BRAND_CONTACTS.domain}/produit/${product.slug}`,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'XOF',
        price: product.isOnQuote ? '0' : String(product.priceFcfa ?? 0),
        availability: product.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    });
    return () => {
      script?.remove();
    };
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#0B2E59]">Produit introuvable</h1>
        <p className="text-sm text-slate-600">
          Cet article n’est plus disponible ou le lien a changé.
        </p>
        <button
          type="button"
          onClick={onBackToCatalog}
          className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#0277BD] rounded-xl cursor-pointer"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  const variantParts = [selectedSize, selectedColor].filter((v) => v && v !== 'Standard');
  const variantLabel = variantParts.join(' · ') || undefined;
  const whatsappOrderUrl = buildProductWhatsAppUrl(
    product,
    quantity,
    currency,
    variantLabel,
    deliveryCountry,
    deliveryCity
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        type="button"
        onClick={onBackToCatalog}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#0277BD] hover:text-[#0B2E59] mb-6 cursor-pointer min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Retour au catalogue</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0277BD]">
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59] leading-tight">
              {product.name}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-slate-900">
                {formatPrice(product.priceFcfa, currency, product.isOnQuote)}
              </span>
              <span className="text-xs font-medium text-emerald-700">
                {product.available ? 'Disponible sur commande' : 'Momentanément épuisé'}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            {product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Format / Taille : <span className="text-[#0B2E59]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#0B2E59] text-white border-[#0B2E59]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-[#0277BD]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Finition / Couleur : <span className="text-[#0B2E59]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selectedColor === color
                          ? 'bg-[#0277BD] text-white border-[#0277BD]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-[#0277BD]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Quantité</p>
              <div className="inline-flex items-center border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="px-4 text-sm font-mono font-bold tabular-nums text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Augmenter la quantité"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            {/* Delivery Country & City for WhatsApp Message */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pays de livraison
                </label>
                <select
                  value={deliveryCountry}
                  onChange={(e) => {
                    const nextCountry = e.target.value as 'Bénin' | 'Niger';
                    setDeliveryCountry(nextCountry);
                    if (nextCountry === 'Niger' && deliveryCity === 'Cotonou') {
                      setDeliveryCity('Niamey');
                    } else if (nextCountry === 'Bénin' && deliveryCity === 'Niamey') {
                      setDeliveryCity('Cotonou');
                    }
                  }}
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                >
                  <option value="Bénin">Bénin</option>
                  <option value="Niger">Niger</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ville
                </label>
                <input
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder={deliveryCountry === 'Bénin' ? 'Cotonou' : 'Niamey'}
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Primary Purchase Actions */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('order_product_whatsapp', { product: product.slug, qty: quantity })
              }
              className="w-full inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors shadow-sm"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>Commander sur WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onAddToCart(product, quantity, selectedSize, selectedColor)}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-semibold text-[#0B2E59] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Ajouter au panier WhatsApp</span>
            </button>
          </div>

          {/* Trust & Delivery info */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0277BD] shrink-0" aria-hidden="true" />
              <span>Délai estimé : {product.deliveryEstimate}</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F25C19] shrink-0" aria-hidden="true" />
              <span>Votre satisfaction est notre priorité ! Contrôle qualité avant expédition.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
