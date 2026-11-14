import { useState } from 'react';
import { MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { BrushTitle } from '../components/BrandMotifs';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../lib/currency';
import { ProductImage } from '../lib/media';
import { buildProductWhatsAppUrl } from '../lib/whatsapp';
import { ALL_CATEGORIES, CategoryName, CurrencyCode, Product } from '../types/shop';

interface CatalogPageProps {
  products: Product[];
  loading: boolean;
  selectedCategory: 'Toutes' | CategoryName;
  onSelectCategory: (cat: 'Toutes' | CategoryName) => void;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
}

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'newest';

export function CatalogPage({
  products,
  loading,
  selectedCategory,
  onSelectCategory,
  currency,
  onChangeCurrency,
  onViewProduct,
  onAddToCart,
}: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filtered = products
    .filter((p) => {
      const catMatch = selectedCategory === 'Toutes' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const textMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return catMatch && textMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price_asc') {
        const pa = a.isOnQuote ? Number.MAX_SAFE_INTEGER : a.priceFcfa ?? 0;
        const pb = b.isOnQuote ? Number.MAX_SAFE_INTEGER : b.priceFcfa ?? 0;
        return pa - pb;
      }
      if (sortBy === 'price_desc') {
        const pa = a.isOnQuote ? -1 : a.priceFcfa ?? 0;
        const pb = b.isOnQuote ? -1 : b.priceFcfa ?? 0;
        return pb - pa;
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B2E59]">
            <BrushTitle accent="orange">Catalogue Chez Modoukpè</BrushTitle>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {filtered.length} article{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} · Livraison Bénin &amp; Niger
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-medium text-slate-500">Devise :</span>
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg">
            {(['FCFA', 'EUR', 'USD'] as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChangeCurrency(code)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                  currency === code
                    ? 'bg-[#0B2E59] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs (All 7 Categories + Toutes) */}
      <div className="flex flex-wrap items-center gap-2">
        {(['Toutes', ...ALL_CATEGORIES] as ('Toutes' | CategoryName)[]).map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#0277BD] text-white border-[#0277BD]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#0277BD] hover:text-[#0277BD]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit, soin, mug, montre..."
            aria-label="Rechercher dans le catalogue"
            className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30 focus:border-[#0277BD]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="catalog-sort" className="text-xs font-medium text-slate-500 shrink-0">
            Trier par :
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="min-h-[44px] px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30"
          >
            <option value="featured">Articles vedettes</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="newest">Nouveautés</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-4/3 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-9 w-full bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <p className="text-lg font-semibold text-[#0B2E59]">Aucun article trouvé</p>
          <p className="text-sm text-slate-600">
            Essayez un autre mot-clé ou réinitialisez les filtres de catégorie.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('Toutes');
              setSearchQuery('');
            }}
            className="mt-2 min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#0277BD] hover:bg-[#0B2E59] rounded-xl cursor-pointer"
          >
            Afficher tout le catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onViewProduct={onViewProduct}
              onQuickView={setQuickViewProduct}
              onAddToCart={(prod) => onAddToCart(prod, prod.sizes[0], prod.colors[0])}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label={quickViewProduct.name}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2"
          >
            <div className="aspect-4/3 md:aspect-auto bg-slate-50">
              <ProductImage
                src={quickViewProduct.imageUrl}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0277BD]">
                    {quickViewProduct.category}
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    aria-label="Fermer l'aperçu"
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <h2 className="mt-1 font-display text-xl font-bold text-[#0B2E59]">
                  {quickViewProduct.name}
                </h2>
                <p className="mt-2 font-mono text-lg font-bold tabular-nums text-slate-900">
                  {formatPrice(quickViewProduct.priceFcfa, currency, quickViewProduct.isOnQuote)}
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Délai estimé : {quickViewProduct.deliveryEstimate}
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <a
                  href={buildProductWhatsAppUrl(quickViewProduct, 1, currency)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Commander sur WhatsApp</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(
                        quickViewProduct,
                        quickViewProduct.sizes[0],
                        quickViewProduct.colors[0]
                      );
                      setQuickViewProduct(null);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold text-[#0B2E59] bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Ajouter au panier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const prod = quickViewProduct;
                      setQuickViewProduct(null);
                      onViewProduct(prod);
                    }}
                    className="inline-flex items-center justify-center min-h-[44px] px-3 py-2 text-xs font-semibold text-[#0277BD] border border-[#0277BD]/30 hover:bg-[#0277BD]/5 rounded-xl cursor-pointer"
                  >
                    Fiche complète
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
