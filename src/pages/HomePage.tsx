import {
  ArrowRight,
  Gift,
  Globe2,
  Home as HomeIcon,
  MessageCircle,
  PackageCheck,
  Palette,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import {
  BrushStrokeUnderline,
  BrushTitle,
  ImportExportGlobe,
  RoundBrandIcon,
  WaveDivider,
} from '../components/BrandMotifs';
import { ProductCard } from '../components/ProductCard';
import { DICTIONARY, SLOGANS } from '../lib/i18n';
import { HERO_IMAGE, ProductImage } from '../lib/media';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { CategoryName, CurrencyCode, LanguageCode, Product } from '../types/shop';

interface HomePageProps {
  products: Product[];
  loading: boolean;
  currency: CurrencyCode;
  lang: LanguageCode;
  onNavigate: (path: string, category?: CategoryName) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const SIX_HIGHLIGHT_CATEGORIES: {
  label: string;
  targetCategory: CategoryName;
  subtitle: string;
  Icon: typeof Globe2;
}[] = [
  {
    label: 'Articles importés',
    targetCategory: 'Articles importés',
    subtitle: 'Tech & sourcing',
    Icon: Globe2,
  },
  {
    label: 'Dermocosmétique',
    targetCategory: 'Dermocosmétique',
    subtitle: 'Soins certifiés',
    Icon: Sparkles,
  },
  {
    label: 'Personnalisation',
    targetCategory: 'Articles personnalisés',
    subtitle: 'Mugs, polos & logos',
    Icon: Palette,
  },
  {
    label: 'Surprise Agency',
    targetCategory: 'Cadeaux & produits de qualité',
    subtitle: 'Coffrets & cadeaux',
    Icon: Gift,
  },
  {
    label: 'Électroménager',
    targetCategory: 'Électroménager',
    subtitle: 'Maison & cuisine',
    Icon: HomeIcon,
  },
  {
    label: 'Mode Homme & Femme',
    targetCategory: 'Articles femme',
    subtitle: 'Montres, sacs & style',
    Icon: PackageCheck,
  },
];

const TESTIMONIALS = [
  {
    name: 'Aïcha Moussa',
    city: 'Niamey, Niger',
    context: 'Coffret Surprise Agency & Dermocosmétique',
    quote:
      'J’ai commandé un coffret anniversaire pour ma sœur depuis Cotonou pour une livraison à Niamey. Tout est arrivé en moins de 48 h avec un emballage impeccable.',
  },
  {
    name: 'Gildas Houngbédji',
    city: 'Cotonou, Bénin',
    context: 'Articles personnalisés (40 polos & mugs)',
    quote:
      'Le marquage de notre logo sur les polos d’équipe était net et livré dans les délais annoncés. La commande sur WhatsApp est directe et rassurante.',
  },
  {
    name: 'Mariama Abdou',
    city: 'Maradi, Niger',
    context: 'Import-Export sur mesure',
    quote:
      'J’ai envoyé le lien d’une machine expresso introuvable localement. Devis clair en FCFA dès le lendemain et réception en 11 jours sans mauvaise surprise.',
  },
];

export function HomePage({
  products,
  loading,
  currency,
  lang,
  onNavigate,
  onViewProduct,
  onAddToCart,
}: HomePageProps) {
  const t = DICTIONARY[lang];
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const dermoProducts = products.filter((p) => p.category === 'Dermocosmétique').slice(0, 3);

  const heroWhatsappUrl = buildWhatsAppUrl(
    'Bonjour Chez Modoukpè ! Je viens du site et je souhaite passer commande.'
  );

  return (
    <div>
      {/* 1. HERO (Deep Navy Brand Showcase) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071F40] via-[#0B2E59] to-[#08467A] text-white">
        {/* Subtle dot pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F25C19] text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Bénin &amp; Niger • Solution Globale</span>
            </span>

            <div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-extrabold uppercase tracking-tight leading-[1.04]">
                <span className="block text-white">Bienvenue chez</span>
                <span className="inline-block text-[#FBBF24] mt-1">
                  Modoukpè
                  <BrushStrokeUnderline color="orange" className="mt-0.5" />
                </span>
              </h1>
            </div>

            <p className="font-accent italic text-xl sm:text-2xl font-semibold text-[#FBBF24]">
              « {SLOGANS.main} »
            </p>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
              « {SLOGANS.quality} » Import-Export international, gamme dermocosmétique d’exception,
              objets personnalisés et coffrets cadeaux Surprise Agency livrés à Cotonou, Niamey et
              dans toute la région.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <a
                href={heroWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 text-sm sm:text-base font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors shadow-lg shadow-black/20 whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>{t.hero.ctaWhatsapp}</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate('/catalogue')}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{t.hero.ctaCatalog}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-blue-100">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#0099E5]" aria-hidden="true" />
                <span>{t.hero.deliveryNote}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FBBF24]" aria-hidden="true" />
                <span>Cotonou &amp; Niamey</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 relative pt-4 lg:pt-0">
            <div className="relative rounded-2xl p-2 bg-white/10 border border-[#0099E5]/40 shadow-2xl">
              <div className="relative rounded-xl overflow-hidden bg-white aspect-16/10 lg:aspect-4/3">
                <ProductImage
                  src={HERO_IMAGE}
                  alt="Boutique Chez Modoukpè : coffrets cadeaux, soins dermocosmétiques et articles importés"
                  priority
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#F25C19] text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow">
                  Qualité Premium
                </span>
              </div>

              {/* Floating Import-Export Card */}
              <div className="hidden sm:flex items-center gap-3 absolute -top-5 -left-4 bg-white text-[#0B2E59] px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0099E5] flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-extrabold leading-tight">Import-Export</p>
                  <p className="text-[11px] text-slate-500">Partout avec vous</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BANDEAU DES 6 CATÉGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59]">
              <BrushTitle accent="orange">{t.sections.categoriesTitle}</BrushTitle>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Trouvez votre article en 3 clics et finalisez sur WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/catalogue')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0277BD] hover:text-[#0B2E59] cursor-pointer self-start sm:self-auto"
          >
            <span>Voir les 7 catégories</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SIX_HIGHLIGHT_CATEGORIES.map(({ label, targetCategory, subtitle, Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate('/catalogue', targetCategory)}
              className="group bg-white border border-slate-200 hover:border-[#0099E5] hover:bg-[#F0F9FF]/50 rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm flex flex-col items-start gap-3 cursor-pointer min-h-[128px]"
            >
              <RoundBrandIcon>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </RoundBrandIcon>
              <div>
                <h3 className="font-display text-sm font-bold text-[#0B2E59] group-hover:text-[#0277BD]">
                  {label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUITS VEDETTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59]">
              <BrushTitle accent="blue">{t.sections.featuredTitle}</BrushTitle>
            </h2>
            <p className="mt-2 font-accent italic text-base text-[#0277BD]">
              « {SLOGANS.quality} »
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/catalogue')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F25C19] hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>{t.sections.viewAllCatalog}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-4/3 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-9 w-full bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onViewProduct={onViewProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. SECTION IMPORT-EXPORT (Vague bleue + Globe animé) */}
      <WaveDivider fill="#0277BD" />
      <section className="bg-[#0277BD] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <ImportExportGlobe />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
              Sourcing international &amp; logistique
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">
              {SLOGANS.importExport}
            </h2>
            <p className="text-base text-blue-50 leading-relaxed max-w-2xl">
              Vous recherchez un appareil précis, des équipements professionnels ou un article
              introuvable localement ? Nous achetons et acheminons vos commandes en toute
              sécurité vers le Bénin et le Niger sous 7 à 15 jours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 border border-white/15 rounded-xl p-4">
                <p className="font-mono text-xs font-bold text-[#F25C19]">01.</p>
                <p className="mt-1 text-sm font-semibold">Partagez votre besoin</p>
                <p className="mt-1 text-xs text-blue-100">
                  Lien produit, photo ou description via notre formulaire.
                </p>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-4">
                <p className="font-mono text-xs font-bold text-[#F25C19]">02.</p>
                <p className="mt-1 text-sm font-semibold">Devis clair en FCFA</p>
                <p className="mt-1 text-xs text-blue-100">
                  Tarif tout compris validé avec vous sur WhatsApp.
                </p>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-4">
                <p className="font-mono text-xs font-bold text-[#F25C19]">03.</p>
                <p className="mt-1 text-sm font-semibold">Livraison 7–15 jours</p>
                <p className="mt-1 text-xs text-blue-100">
                  Suivi régulier jusqu’à la remise au Bénin ou au Niger.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/import-export')}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl transition-colors cursor-pointer"
              >
                <span>Demander un devis Import-Export</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider fill="#0277BD" flip />

      {/* 5. ARTICLES PERSONNALISÉS & SURPRISE AGENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personnalisation */}
        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RoundBrandIcon>
                <Palette className="w-5 h-5" aria-hidden="true" />
              </RoundBrandIcon>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0277BD]">
                Atelier de marquage
              </span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-[#0B2E59]">
              Articles personnalisés
            </h2>
            <p className="font-accent italic text-base text-[#0277BD]">
              « {SLOGANS.value} »
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Mugs photo, casquettes brodées, polos d’entreprise ou coffrets événementiels :
              importez votre logo et indiquez votre texte pour un devis rapide à l’unité ou en lot.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/personnalisation')}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#0B2E59] hover:bg-[#0277BD] rounded-xl transition-colors cursor-pointer"
            >
              <span>Personnaliser un article</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/catalogue', 'Articles personnalisés')}
              className="text-sm font-semibold text-[#0277BD] hover:underline cursor-pointer"
            >
              Voir les modèles
            </button>
          </div>
        </article>

        {/* Surprise Agency */}
        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RoundBrandIcon>
                <Gift className="w-5 h-5" aria-hidden="true" />
              </RoundBrandIcon>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F25C19]">
                Surprise Agency
              </span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-[#0B2E59]">
              Cadeaux &amp; surprises mémorables
            </h2>
            <p className="font-accent italic text-base text-[#0277BD]">
              « Offrez l’attention parfaite, même à distance. »
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Anniversaires, mariages, félicitations ou cadeaux d’entreprise : nos équipes composent
              et livrent vos coffrets surprises avec mot personnalisé au Bénin et au Niger.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/surprise-agency')}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl transition-colors cursor-pointer"
            >
              <span>Commander une surprise</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/catalogue', 'Cadeaux & produits de qualité')}
              className="text-sm font-semibold text-[#0277BD] hover:underline cursor-pointer"
            >
              Voir les coffrets
            </button>
          </div>
        </article>
      </section>

      {/* 6. SECTION DERMOCOSMÉTIQUE */}
      <section className="bg-[#F0F9FF]/60 border-y border-[#0099E5]/15 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59]">
                <BrushTitle accent="orange">Pôle Dermocosmétique</BrushTitle>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Soins authentiques sélectionnés pour les peaux sensibles, climat chaud et routines quotidiennes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/catalogue', 'Dermocosmétique')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0277BD] hover:underline cursor-pointer self-start sm:self-auto"
            >
              <span>Toute la gamme soins</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dermoProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onViewProduct={onViewProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. AVIS CLIENTS & ENGAGEMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59]">
            {t.sections.testimonialsTitle}
          </h2>
          <p className="mt-2 font-accent italic text-lg text-[#0277BD]">
            « {SLOGANS.priority} »
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.name}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
            >
              <p className="text-sm text-slate-700 leading-relaxed">
                « {item.quote} »
              </p>
              <footer className="pt-3 border-t border-slate-100">
                <p className="font-semibold text-sm text-[#0B2E59]">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.city} · {item.context}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>

        {/* Final engagement callout */}
        <div className="bg-[#0B2E59] text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#0099E5]/30">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-display text-xl sm:text-2xl font-extrabold">
              {SLOGANS.priority}
            </h3>
            <p className="text-sm sm:text-base text-blue-100">
              Besoin d’un conseil dermocosmétique, d’un cadeau urgent ou d’une cotation import-export ?
              Notre équipe vous répond directement sur WhatsApp.
            </p>
          </div>
          <a
            href={heroWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
