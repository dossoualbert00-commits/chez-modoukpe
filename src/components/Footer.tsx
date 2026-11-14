import { Globe, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { SLOGANS } from '../lib/i18n';
import { BRAND_CONTACTS, buildWhatsAppUrl } from '../lib/whatsapp';
import { ALL_CATEGORIES, CategoryName, LanguageCode } from '../types/shop';
import { ModoukpeLogo, WaveDivider } from './BrandMotifs';

interface FooterProps {
  onNavigate: (path: string, category?: CategoryName) => void;
  lang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
}

export function Footer({ onNavigate, lang, onChangeLang }: FooterProps) {
  return (
    <footer className="mt-16">
      <WaveDivider fill="#0B2E59" />
      <div className="bg-[#0B2E59] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand summary */}
          <div className="space-y-4">
            <ModoukpeLogo inverted />
            <p className="font-accent italic text-base text-blue-100">
              « {SLOGANS.main} »
            </p>
            <p className="text-sm text-blue-100/85 leading-relaxed">
              Import-Export, Dermocosmétique &amp; Surprise Agency entre le Bénin et le Niger.
              Livraison 24–48 h en local et 7–15 jours pour les commandes importées.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={BRAND_CONTACTS.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Facebook · {BRAND_CONTACTS.facebookLabel}
              </a>
              <a
                href={BRAND_CONTACTS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Instagram · {BRAND_CONTACTS.instagramHandle}
              </a>
            </div>
          </div>

          {/* 7 Categories */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Catégories
            </h3>
            <ul className="space-y-2.5 text-sm text-blue-100/85">
              {ALL_CATEGORIES.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => onNavigate('/catalogue', category)}
                    className="hover:text-[#F25C19] transition-colors text-left cursor-pointer"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Infos */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4">
              Services &amp; Informations
            </h3>
            <ul className="space-y-2.5 text-sm text-blue-100/85">
              <li>
                <button type="button" onClick={() => onNavigate('/import-export')} className="hover:text-[#F25C19] transition-colors cursor-pointer">
                  Import-Export sur mesure
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/personnalisation')} className="hover:text-[#F25C19] transition-colors cursor-pointer">
                  Personnalisation d’articles
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/surprise-agency')} className="hover:text-[#F25C19] transition-colors cursor-pointer">
                  Surprise Agency (Cadeaux)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/a-propos')} className="hover:text-[#F25C19] transition-colors cursor-pointer">
                  À propos de Chez Modoukpè
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/faq')} className="hover:text-[#F25C19] transition-colors cursor-pointer">
                  Foire aux questions (FAQ)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-[#F25C19] transition-colors cursor-pointer">
                  Contact &amp; zones de livraison
                </button>
              </li>
            </ul>
          </div>

          {/* Contacts & Zones */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Contacts directs
            </h3>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#F25C19] shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={buildWhatsAppUrl('Bonjour Chez Modoukpè, je souhaite passer commande.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-mono tabular-nums"
                >
                  {BRAND_CONTACTS.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#F25C19] shrink-0 mt-0.5" aria-hidden="true" />
                <a href={`mailto:${BRAND_CONTACTS.email}`} className="hover:underline break-all">
                  {BRAND_CONTACTS.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F25C19] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Bénin (Cotonou, Parakou…) &amp; Niger (Niamey, Zinder, Maradi…)</span>
              </li>
            </ul>

            {/* Language switcher FR / EN */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-1 p-1 bg-white/10 rounded-lg">
                <Globe className="w-3.5 h-3.5 text-blue-200 ml-1.5 mr-1" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => onChangeLang('fr')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                    lang === 'fr' ? 'bg-[#F25C19] text-white' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLang('en')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                    lang === 'en' ? 'bg-[#F25C19] text-white' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Admin Row */}
        <div className="border-t border-white/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100/75">
            <p>© {new Date().getFullYear()} Chez Modoukpè · chezmodoukpe.com · {SLOGANS.priority}</p>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => onNavigate('/mentions-legales')} className="hover:text-white cursor-pointer">
                Mentions légales
              </button>
              <button type="button" onClick={() => onNavigate('/cgv')} className="hover:text-white cursor-pointer">
                CGV
              </button>
              <button type="button" onClick={() => onNavigate('/confidentialite')} className="hover:text-white cursor-pointer">
                Confidentialité
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/admin')}
                className="inline-flex items-center gap-1 text-blue-200 hover:text-white cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
