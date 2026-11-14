import { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, Send } from 'lucide-react';
import { BrushTitle, ImportExportGlobe } from '../components/BrandMotifs';
import { SLOGANS } from '../lib/i18n';
import { BRAND_CONTACTS, buildWhatsAppUrl } from '../lib/whatsapp';

export function ImportExportPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [productWanted, setProductWanted] = useState('');
  const [productLink, setProductLink] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [country, setCountry] = useState<'Bénin' | 'Niger'>('Bénin');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const summary = `${productWanted} (Qté: ${quantity}) → ${country}`;
    const details: Record<string, string> = {
      'Produit souhaité': productWanted,
      'Lien / Photo': productLink || 'Non précisé',
      Quantité: quantity,
      Budget: budget ? `${budget} FCFA` : 'À chiffrer',
      Ville: city || 'Non précisée',
    };

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'import_export',
          customerName,
          phone,
          country,
          city,
          summary,
          details,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Impossible d’enregistrer la demande.');
      }

      const msg = [
        'Bonjour Chez Modoukpè, demande Import-Export sur mesure :',
        `Nom : ${customerName}`,
        `Téléphone : ${phone}`,
        `Produit souhaité : ${productWanted}`,
        productLink ? `Lien / Référence : ${productLink}` : null,
        `Quantité : ${quantity}`,
        `Pays / Ville : ${country}${city ? ` (${city})` : ''}`,
        budget ? `Budget indicatif : ${budget} FCFA` : null,
      ]
        .filter(Boolean)
        .join('\n');

      setSubmittedWhatsappUrl(buildWhatsAppUrl(msg));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur réseau.');
    } finally {
      setSubmitting(false);
    }
  }

  const mailtoUrl = `mailto:${BRAND_CONTACTS.email}?subject=${encodeURIComponent(
    `Demande Import-Export — ${productWanted || 'Nouvelle commande'}`
  )}&body=${encodeURIComponent(
    `Nom: ${customerName}\nTéléphone: ${phone}\nProduit: ${productWanted}\nLien: ${productLink}\nQuantité: ${quantity}\nPays: ${country} (${city})\nBudget: ${budget} FCFA`
  )}`;

  return (
    <div>
      {/* Header banner */}
      <section className="bg-[#0B2E59] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F25C19]">
              Service sur mesure
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
              {SLOGANS.importExport}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-xl">
              Partagez-nous l’article, le lien marchand ou les caractéristiques techniques de votre
              commande. Nous gérons l’achat, le transport international et la remise en 7 à 15 jours
              au Bénin et au Niger.
            </p>
          </div>
          <div className="lg:col-span-5">
            <ImportExportGlobe />
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59]">
            <BrushTitle accent="orange">Formulaire de commande sur mesure</BrushTitle>
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enregistrez votre demande et transmettez-la instantanément à notre équipe WhatsApp.
          </p>
        </div>

        {submittedWhatsappUrl ? (
          <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-bold text-[#0B2E59]">
                  Votre demande Import-Export est enregistrée
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Finalisez l’échange sur WhatsApp ou par e-mail pour recevoir votre cotation en FCFA.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={submittedWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Envoyer sur WhatsApp maintenant</span>
              </a>
              <a
                href={mailtoUrl}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 text-sm font-semibold text-[#0B2E59] bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Envoyer aussi par e-mail</span>
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5"
          >
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Votre nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex. Kossi Adégbola"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30 focus:border-[#0277BD]"
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
                  placeholder="Ex. +229 97 00 00 00"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30 focus:border-[#0277BD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Produit souhaité (nom, marque, modèle) *
              </label>
              <input
                type="text"
                required
                value={productWanted}
                onChange={(e) => setProductWanted(e.target.value)}
                placeholder="Ex. Machine à café professionnelle, ordinateur portable, lot cosmétique..."
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30 focus:border-[#0277BD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lien produit ou lien vers une photo (optionnel)
              </label>
              <input
                type="url"
                value={productLink}
                onChange={(e) => setProductLink(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0277BD]/30 focus:border-[#0277BD]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                  Pays de livraison *
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
                  Ville
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={country === 'Bénin' ? 'Cotonou, Parakou...' : 'Niamey, Zinder...'}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Budget indicatif en FCFA (optionnel)
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ex. 150 000 FCFA"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] disabled:opacity-60 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>{submitting ? 'Enregistrement...' : 'Valider et obtenir mon devis'}</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
