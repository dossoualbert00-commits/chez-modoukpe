import { useState } from 'react';
import { CheckCircle2, Gift, MessageCircle } from 'lucide-react';
import { BrushTitle, RoundBrandIcon } from '../components/BrandMotifs';
import { buildWhatsAppUrl } from '../lib/whatsapp';

const PACKS = [
  {
    name: 'Pack Anniversaire Éclat',
    price: '28 000 FCFA',
    description: 'Box ruban orange, bougie parfumée, gourmandises et carte calligraphiée.',
  },
  {
    name: 'Coffret Mariage & Union',
    price: '49 000 FCFA',
    description: 'Duo de mugs personnalisés, parfum d’ambiance, chocolats fins et mot des proches.',
  },
  {
    name: 'Offre Entreprise & VIP',
    price: 'Sur devis',
    description: 'Coffrets de fin d’année ou de remerciement marqués au logo de votre structure.',
  },
];

export function SurpriseAgencyPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('Anniversaire');
  const [recipientCity, setRecipientCity] = useState('');
  const [country, setCountry] = useState<'Bénin' | 'Niger'>('Bénin');
  const [budget, setBudget] = useState('30 000 FCFA');
  const [messageCard, setMessageCard] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'surprise',
          customerName,
          phone,
          country,
          city: recipientCity,
          summary: `Surprise ${occasion} — ${budget} (${country})`,
          details: {
            Occasion: occasion,
            Budget: budget,
            Destinataire: `${country} ${recipientCity}`,
            Mot: messageCard || 'Sans mot',
          },
        }),
      });

      const msg = [
        'Bonjour Surprise Agency (Chez Modoukpè),',
        `Expéditeur : ${customerName} (${phone})`,
        `Occasion : ${occasion}`,
        `Livraison : ${country}${recipientCity ? ` - ${recipientCity}` : ''}`,
        `Budget : ${budget}`,
        messageCard ? `Mot à joindre : « ${messageCard} »` : null,
      ]
        .filter(Boolean)
        .join('\n');

      setSubmittedUrl(buildWhatsAppUrl(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      <div className="space-y-3 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[#F25C19]">
          Surprise Agency by Chez Modoukpè
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B2E59]">
          <BrushTitle accent="orange">Des surprises livrées avec émotion</BrushTitle>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Que vous soyez sur place ou dans la diaspora, nous préparons et livrons des coffrets
          cadeaux soignés pour vos proches et partenaires au Bénin et au Niger.
        </p>
      </div>

      {/* 3 Signature Packs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACKS.map((pack) => (
          <article
            key={pack.name}
            className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <RoundBrandIcon>
                <Gift className="w-5 h-5" aria-hidden="true" />
              </RoundBrandIcon>
              <h2 className="font-display text-lg font-bold text-[#0B2E59]">{pack.name}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{pack.description}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-base font-bold tabular-nums text-[#0277BD]">
                {pack.price}
              </span>
              <a
                href={buildWhatsAppUrl(`Bonjour Chez Modoukpè, je souhaite commander le ${pack.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#F25C19] hover:underline"
              >
                Commander →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Custom Surprise Request Form */}
      <div className="max-w-3xl">
        <h2 className="font-display text-2xl font-extrabold text-[#0B2E59] mb-4">
          Composer une surprise sur mesure
        </h2>

        {submittedUrl ? (
          <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-bold text-[#0B2E59]">
                  Votre demande Surprise Agency est enregistrée
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Validez l’heure et le lieu de livraison directement avec notre équipe sur WhatsApp.
                </p>
              </div>
            </div>
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>Confirmer la surprise sur WhatsApp</span>
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
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Votre numéro WhatsApp *
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Mariage / Dot">Mariage / Dot</option>
                  <option value="Cadeau d’entreprise">Cadeau d’entreprise</option>
                  <option value="Félicitations / Naissance">Félicitations / Naissance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pays du destinataire
                </label>
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
                  Budget souhaité
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ville &amp; quartier du destinataire
              </label>
              <input
                type="text"
                value={recipientCity}
                onChange={(e) => setRecipientCity(e.target.value)}
                placeholder="Ex. Cotonou Haie Vive / Niamey Plateau"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Message personnalisé à inscrire sur la carte
              </label>
              <textarea
                rows={3}
                value={messageCard}
                onChange={(e) => setMessageCard(e.target.value)}
                placeholder="Votre mot doux ou message de félicitations..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] disabled:opacity-60 rounded-xl transition-colors cursor-pointer"
            >
              <Gift className="w-4 h-4" aria-hidden="true" />
              <span>{submitting ? 'Enregistrement...' : 'Préparer ma surprise'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
