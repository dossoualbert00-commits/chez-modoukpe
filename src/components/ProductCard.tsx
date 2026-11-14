import { Eye, MessageCircle, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../lib/currency';
import { ProductImage } from '../lib/media';
import { buildProductWhatsAppUrl } from '../lib/whatsapp';
import { CurrencyCode, Product } from '../types/shop';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onViewProduct: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  currency,
  onViewProduct,
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const quickWhatsappUrl = buildProductWhatsAppUrl(product, 1, currency);

  return (
    <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
      <div>
        <div
          onClick={() => onViewProduct(product)}
          className="relative aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer"
        >
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-semibold bg-[#0B2E59] text-white rounded">
              Vedette
            </span>
          )}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label={`Aperçu rapide de ${product.name}`}
              className="absolute bottom-3 right-3 inline-flex items-center justify-center min-w-[40px] min-h-[40px] rounded-lg bg-white/95 text-[#0B2E59] border border-slate-200 shadow-xs opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-[#0277BD] hover:text-white cursor-pointer"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0277BD]">
            {product.category}
          </p>
          <h3
            onClick={() => onViewProduct(product)}
            className="mt-1.5 text-base font-semibold text-[#0B2E59] leading-snug line-clamp-2 cursor-pointer hover:text-[#0277BD] transition-colors"
          >
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{product.deliveryEstimate}</p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
        <span className="font-mono text-sm sm:text-base font-semibold tabular-nums text-slate-900 truncate">
          {formatPrice(product.priceFcfa, currency, product.isOnQuote)}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={quickWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Commander ${product.name} directement sur WhatsApp`}
            title="Commander sur WhatsApp"
            className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] rounded-lg text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-semibold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </article>
  );
}
