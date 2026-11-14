import { useState } from 'react';
import { ChevronDown, Mail, MapPin, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { BrushTitle, RoundBrandIcon } from '../components/BrandMotifs';
import { SLOGANS } from '../lib/i18n';
import { BRAND_CONTACTS, buildWhatsAppUrl } from '../lib/whatsapp';

export function AboutPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0277BD]">
          À propos de la marque
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B2E59]">
          <BrushTitle accent="orange">Chez Modoukpè</BrushTitle>
        </h1>
        <p className="font-accent italic text-xl text-[#0277BD]">
          « {SLOGANS.main} »
        </p>
        <p className="text-base text-slate-700 leading-relaxed max-w-3xl">
          Née entre le Bénin et le Niger, <strong>Chez Modoukpè</strong> réunit trois métiers
          complémentaires pour simplifier le quotidien des particuliers et des entreprises :
          l’<strong>Import-Export sur mesure</strong>, une sélection exigeante en{' '}
          <strong>Dermocosmétique</strong> et notre atelier créatif{' '}
          <strong>Surprise Agency &amp; Personnalisation</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <RoundBrandIcon>
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </RoundBrandIcon>
          <h2 className="font-display text-lg font-bold text-[#0B2E59]">Qualité vérifiée</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            « {SLOGANS.quality} » Chaque produit est contrôlé avant remise.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <RoundBrandIcon>
            <Truck className="w-5 h-5" aria-hidden="true" />
          </RoundBrandIcon>
          <h2 className="font-display text-lg font-bold text-[#0B2E59]">Délais maîtrisés</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            24 à 48 heures en local au Bénin et au Niger, et 7 à 15 jours pour les commandes
            importées sur mesure.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <RoundBrandIcon>
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </RoundBrandIcon>
          <h2 className="font-display text-lg font-bold text-[#0B2E59]">Proximité WhatsApp</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            « {SLOGANS.priority} » Un conseiller humain suit votre commande du devis à la livraison.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => onNavigate('/catalogue')}
          className="min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl cursor-pointer"
        >
          Découvrir le catalogue
        </button>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: 'Quels sont les délais de livraison au Bénin et au Niger ?',
    a: 'Les articles en stock local sont livrés sous 24 à 48 heures à Cotonou, Parakou, Niamey et principales villes. Les commandes Import-Export sur mesure arrivent sous 7 à 15 jours ouvrés.',
  },
  {
    q: 'Comment se déroule le paiement des commandes ?',
    a: 'En V1, la validation et le règlement se font simplement après confirmation sur WhatsApp (paiement à la livraison selon la zone ou transfert Mobile Money / virement). Une interface de paiement Mobile Money intégrée est prévue prochainement.',
  },
  {
    q: 'Que signifie la mention « Sur devis » ?',
    a: 'Certains lots personnalisés ou articles importés sur demande dépendent du volume, du poids et du cours du moment. Envoyez votre besoin via WhatsApp ou le formulaire et recevez un tarif exact en FCFA.',
  },
  {
    q: 'Puis-je commander un cadeau à distance pour un proche au Bénin ou au Niger ?',
    a: 'Oui ! Avec Surprise Agency, vous commandez depuis l’étranger ou une autre ville et nous livrons le coffret accompagné de votre message personnalisé directement au destinataire.',
  },
  {
    q: 'Quelle est votre politique de retour ou d’échange ?',
    a: 'Si un article arrive endommagé ou non conforme à votre commande validée, nous procédons à son remplacement ou remboursement sous 48 heures après signalement avec photo sur WhatsApp.',
  },
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B2E59]">
          <BrushTitle accent="orange">Questions fréquentes</BrushTitle>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Livraison, paiement, commandes import-export et retours expliqués clairement.
        </p>
      </div>

      <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="font-display text-base font-bold text-[#0B2E59]">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#0277BD] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-sm text-slate-700 leading-relaxed">{item.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<'Bénin' | 'Niger'>('Bénin');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        customerName: name,
        phone,
        country,
        summary: message.slice(0, 140),
        details: { Message: message },
      }),
    });
    setSent(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B2E59]">
          <BrushTitle accent="orange">Contactez-nous</BrushTitle>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Notre équipe est joignable 7j/7 sur WhatsApp pour vos commandes, conseils
          dermocosmétiques et devis Import-Export entre le Bénin et le Niger.
        </p>

        <div className="space-y-4 pt-2 text-sm">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-[#F25C19] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#0B2E59]">WhatsApp Direct</p>
              <a
                href={buildWhatsAppUrl('Bonjour Chez Modoukpè !')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#0277BD] hover:underline"
              >
                {BRAND_CONTACTS.whatsappDisplay}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#0277BD] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#0B2E59]">E-mail professionnel</p>
              <a
                href={`mailto:${BRAND_CONTACTS.email}`}
                className="text-slate-700 hover:underline break-all"
              >
                {BRAND_CONTACTS.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#0277BD] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#0B2E59]">Zones desservies</p>
              <p className="text-slate-600">
                Bénin (Cotonou, Abomey-Calavi, Porto-Novo, Parakou) &amp; Niger (Niamey, Zinder,
                Maradi, Tahoua).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        {sent ? (
          <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-8 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0B2E59]">
              Message bien transmis
            </h2>
            <p className="text-sm text-slate-600">
              Merci ! Pour une réponse immédiate, écrivez-nous directement sur WhatsApp.
            </p>
            <a
              href={buildWhatsAppUrl(`Bonjour Chez Modoukpè, je m'appelle ${name} : ${message}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-bold text-white bg-[#F25C19] rounded-xl"
            >
              Ouvrir WhatsApp
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pays</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as 'Bénin' | 'Niger')}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white"
              >
                <option value="Bénin">Bénin</option>
                <option value="Niger">Niger</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Votre message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#0277BD] hover:bg-[#0B2E59] rounded-xl cursor-pointer"
            >
              Envoyer le message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function LegalPage({ type }: { type: 'mentions' | 'cgv' | 'confidentialite' }) {
  const titles = {
    mentions: 'Mentions légales',
    cgv: 'Conditions Générales de Vente (CGV)',
    confidentialite: 'Politique de confidentialité',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-[#0B2E59]">{titles[type]}</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 text-sm text-slate-700 leading-relaxed">
        {type === 'mentions' && (
          <>
            <p>
              <strong>Éditeur :</strong> Chez Modoukpè — Import-Export, Dermocosmétique &amp;
              Surprise Agency.
            </p>
            <p>
              <strong>Domaine officiel :</strong> chezmodoukpe.com
            </p>
            <p>
              <strong>Contacts :</strong> {BRAND_CONTACTS.whatsappDisplay} · {BRAND_CONTACTS.email}
            </p>
            <p>
              <strong>Zones d’activité :</strong> République du Bénin et République du Niger.
            </p>
          </>
        )}

        {type === 'cgv' && (
          <>
            <p>
              <strong>1. Commandes et devis :</strong> Les commandes effectuées via le catalogue ou
              les formulaires sont confirmées avec le client sur WhatsApp avant expédition. Les
              articles portant la mention « Sur devis » font l’objet d’une cotation préalable en
              FCFA.
            </p>
            <p>
              <strong>2. Livraison :</strong> 24 à 48 heures pour les articles disponibles localement
              au Bénin et au Niger ; 7 à 15 jours ouvrés pour les commandes importées sur mesure.
            </p>
            <p>
              <strong>3. Retours :</strong> Tout produit endommagé ou non conforme est remplacé ou
              remboursé sur signalement dans les 48 heures suivant la réception.
            </p>
          </>
        )}

        {type === 'confidentialite' && (
          <>
            <p>
              Les informations recueillies via nos formulaires (nom, numéro WhatsApp, ville,
              précisions de commande) servent exclusivement au traitement et au suivi de vos
              demandes commerciales chez Chez Modoukpè.
            </p>
            <p>
              Aucune donnée personnelle n’est cédée ni revendue à des tiers. Vous pouvez demander la
              suppression de vos coordonnées à tout moment par e-mail à {BRAND_CONTACTS.email}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
