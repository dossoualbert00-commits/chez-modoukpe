import { Globe, Menu, Phone, Search, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { DICTIONARY, SLOGANS } from '../lib/i18n';
import { BRAND_CONTACTS, buildWhatsAppUrl } from '../lib/whatsapp';
import { CategoryName, CurrencyCode, LanguageCode } from '../types/shop';
import { ModoukpeLogo } from './BrandMotifs';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, category?: CategoryName) => void;
  cartCount: number;
  onOpenCart: () => void;
  lang: LanguageCode;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
}

export function Navbar({
  currentPath,
  onNavigate,
  cartCount,
  onOpenCart,
  lang,
  currency,
  onChangeCurrency,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = DICTIONARY[lang].nav;

  const navItems: {
    path: string;
    label: string;
    badge?: string;
    category?: CategoryName;
  }[] = [
    { path: '/', label: t.home },
    { path: '/catalogue', label: t.catalog },
    { path: '/import-export', label: t.importExport, badge: 'DIRECT' },
    { path: '/personnalisation', label: t.custom },
    { path: '/surprise-agency', label: t.surprise, badge: 'BOX' },
    { path: '/catalogue', label: 'Dermocosmétique', category: 'Dermocosmétique' },
    { path: '/contact', label: t.contact },
  ];

  const whatsappDirect = buildWhatsAppUrl(
    'Bonjour Chez Modoukpè, je souhaite obtenir des informations ou passer une commande.'
  );

  function go(path: string, category?: CategoryName) {
    onNavigate(path, category);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 shadow-xs">
      {/* Top Navy Utility Bar */}
      <div className="bg-[#072042] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[38px] py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F25C19] text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
              Bénin &amp; Niger
            </span>
            <p className="hidden md:block text-blue-100 truncate">
              <span className="italic font-medium text-white">« {SLOGANS.main} »</span>
              <span className="mx-1.5 text-blue-300/60">•</span>
              <span>Livraison express Cotonou &amp; Niamey</span>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href={whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono font-semibold text-[#FBBF24] hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{BRAND_CONTACTS.whatsappDisplay}</span>
            </a>

            <div className="inline-flex items-center gap-1 bg-white/10 border border-white/15 rounded-md px-2 py-0.5">
              <Globe className="w-3.5 h-3.5 text-blue-200" aria-hidden="true" />
              <select
                aria-label="Choisir la devise"
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="FCFA" className="text-slate-900">
                  XOF (FCFA)
                </option>
                <option value="EUR" className="text-slate-900">
                  EUR (€)
                </option>
                <option value="USD" className="text-slate-900">
                  USD ($)
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => go('/admin')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                currentPath === '/admin'
                  ? 'bg-[#F25C19] text-white'
                  : 'bg-white/15 hover:bg-[#F25C19] text-white border border-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main White Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => go('/')}
            aria-label="Chez Modoukpè — Accueil"
            className="cursor-pointer py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0277BD] rounded-lg shrink-0"
          >
            <ModoukpeLogo />
          </button>

          {/* Desktop single-line nav links */}
          <nav aria-label="Navigation principale" className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isDermoLink = item.category === 'Dermocosmétique';
              const isActive = isDermoLink
                ? false
                : item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path);

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => go(item.path, item.category)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#E0F2FE] text-[#0277BD]'
                      : 'text-slate-700 hover:text-[#0B2E59] hover:bg-slate-100/80'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-[#F25C19] text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Search + Cart + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => go('/catalogue')}
              aria-label="Rechercher dans le catalogue"
              className="hidden sm:inline-flex items-center justify-center min-w-[42px] min-h-[42px] rounded-lg text-[#0B2E59] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`${t.cart} (${cartCount})`}
              className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 rounded-lg border border-slate-200 bg-white text-[#0B2E59] hover:border-[#0099E5] hover:bg-[#F0F9FF] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-[#0099E5]" aria-hidden="true" />
              <span
                className={`ml-1.5 text-xs font-mono font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
                  cartCount > 0 ? 'bg-[#F25C19] text-white' : 'text-[#0B2E59]'
                }`}
              >
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              className="xl:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-[#0B2E59] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Navigation mobile"
          className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-1 shadow-xl max-h-[80vh] overflow-y-auto"
        >
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : !item.category && currentPath.startsWith(item.path);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.path, item.category)}
                className={`w-full flex items-center justify-between text-left px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#E0F2FE] text-[#0277BD]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-[#F25C19] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => go('/a-propos')}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer"
            >
              À propos
            </button>
            <button
              type="button"
              onClick={() => go('/faq')}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 text-left cursor-pointer"
            >
              FAQ &amp; Aide
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => go('/admin')}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-bold text-[#0B2E59] bg-[#F0F9FF] border border-[#0099E5]/30 rounded-xl cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#0277BD]" aria-hidden="true" />
              <span>Espace Admin (Modifier le catalogue)</span>
            </button>
            <a
              href={whatsappDirect}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-sm font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors"
            >
              {t.orderNow} sur WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
