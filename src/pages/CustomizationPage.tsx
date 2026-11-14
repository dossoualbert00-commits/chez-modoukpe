import { useState } from 'react';
import { CheckCircle2, MessageCircle, Palette, Upload } from 'lucide-react';
import { BrushTitle } from '../components/BrandMotifs';
import { SLOGANS } from '../lib/i18n';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export function CustomizationPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [itemType, setItemType] = useState('Mug céramique');
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [deadline, setDeadline] = useState('');
  const [country, setCountry] = useState<'Bénin' | 'Niger'>('Bénin');
  const [logoName, setLogoName] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          customerName,
          phone,
          country,
          summary: `${itemType} × ${quantity} (${customText || 'Avec logo'})`,
          details: {
            Support: itemType,
            Texte: customText || 'Aucun texte',
            Logo: logoName || 'À envoyer sur WhatsApp',
            Quantité: quantity,
            Délai: deadline || 'Standard (24-48h / 7-15j)',
          },
        }),
      });

      const msg = [
        'Bonjour Chez Modoukpè, demande de personnalisation :',
        `Nom : ${customerName}`,
        `Téléphone : ${phone}`,
        `Article : ${itemType}`,
        `Quantité : ${quantity}`,
        customText ? `Texte souhaité : ${customText}` : null,
        logoName ? `Logo joint (à envoyer ici) : ${logoName}` : null,
        deadline ? `Délai souhaité : ${deadline}` : null,
        `Pays : ${country}`,
      ]
        .filter(Boolean)
        .join('\n');

      setSubmittedUrl(buildWhatsAppUrl(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0277BD]">
          Atelier de marquage &amp; goodies
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B2E59]">
          <BrushTitle accent="orange">Personnalisez vos articles</BrushTitle>
        </h1>
        <p className="font-accent italic text-lg text-[#0277BD]">
          « {SLOGANS.value} »
        </p>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Mugs, casquettes brodées, polos d’équipe, t-shirts événementiels ou stylos d’entreprise :
          préparez votre maquette et recevez un devis clair en FCFA.
        </p>
      </div>

      {submittedUrl ? (
        <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B2E59]">
                Votre demande de personnalisation est prête
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Envoyez le récapitulatif sur WhatsApp (et joignez directement votre logo haute
                définition dans la discussion).
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
            <span>Finaliser sur WhatsApp</span>
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
                Nom / Entreprise *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex. Aminata Traoré"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Numéro WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex. +227 90 00 00 00"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Article à personnaliser *
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white"
              >
                <option value="Mug céramique">Mug céramique</option>
                <option value="Casquette brodée">Casquette brodée</option>
                <option value="Polo ou T-shirt">Polo ou T-shirt</option>
                <option value="Gourde isotherme">Gourde isotherme</option>
                <option value="Pack goodies entreprise">Pack goodies entreprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantité *
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono tabular-nums border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Délai souhaité
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Ex. Pour le 25 novembre"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Texte, prénom ou slogan à imprimer
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex. Joyeux anniversaire Fatou / Équipe 2026"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pays de livraison
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
          </div>

          {/* Logo upload preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Aperçu du logo ou visuel (PNG, JPG, SVG)
            </label>
            <label className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-slate-300 hover:border-[#0277BD] rounded-xl cursor-pointer transition-colors bg-slate-50/70">
              <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Aperçu logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload className="w-5 h-5 text-[#0277BD]" aria-hidden="true" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-[#0B2E59]">
                  {logoName ? logoName : 'Sélectionner un fichier depuis votre téléphone'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vous pourrez également envoyer le fichier original directement dans WhatsApp.
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFile}
                className="sr-only"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] disabled:opacity-60 rounded-xl transition-colors cursor-pointer"
          >
            <Palette className="w-4 h-4" aria-hidden="true" />
            <span>{submitting ? 'Envoi...' : 'Demander mon devis personnalisé'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
