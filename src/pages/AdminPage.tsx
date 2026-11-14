import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Inbox,
  Lock,
  LogOut,
  MessageCircle,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { formatPrice } from '../lib/currency';
import { ProductImage } from '../lib/media';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { ALL_CATEGORIES, CategoryName, CustomerRequest, Product, RequestStatus } from '../types/shop';

interface AdminPageProps {
  onCatalogChanged: () => void;
}

const BUILTIN_IMAGE_OPTIONS: { value: string; label: string }[] = [
  { value: 'asset:dermocosmetique', label: 'Visuel Studio · Dermocosmétique' },
  { value: 'asset:electromenager', label: 'Visuel Studio · Électroménager' },
  { value: 'asset:personnalises', label: 'Visuel Studio · Articles personnalisés' },
  { value: 'asset:importes', label: 'Visuel Studio · Articles importés' },
  { value: 'asset:homme', label: 'Visuel Studio · Articles homme' },
  { value: 'asset:femme', label: 'Visuel Studio · Articles femme' },
  { value: 'asset:cadeaux', label: 'Visuel Studio · Surprise Agency' },
];

const ADMIN_TOKEN_KEY = 'modoukpe_admin_token_v1';

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore storage error
  }
}

export function AdminPage({ onCatalogChanged }: AdminPageProps) {
  const [authLoading, setAuthLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('modoukpebadjimou6@gmail.com');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [tab, setTab] = useState<'products' | 'requests'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusBanner, setStatusBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryName>('Dermocosmétique');
  const [description, setDescription] = useState('');
  const [isOnQuote, setIsOnQuote] = useState(false);
  const [priceFcfa, setPriceFcfa] = useState('15000');
  const [sizesStr, setSizesStr] = useState('Standard');
  const [colorsStr, setColorsStr] = useState('Standard');
  const [deliveryEstimate, setDeliveryEstimate] = useState('24–48 h (local Bénin / Niger)');
  const [imageUrl, setImageUrl] = useState('asset:dermocosmetique');
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function adminFetch(url: string, init: RequestInit = {}) {
    const token = getStoredToken();
    const headers = new Headers(init.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const res = await fetch(url, {
      ...init,
      headers,
      credentials: 'include',
    });
    if (res.status === 401) {
      storeToken(null);
      setAuthenticated(false);
      setAuthError('Session expirée. Veuillez vous reconnecter.');
    }
    return res;
  }

  async function checkAuth() {
    setAuthLoading(true);
    try {
      const res = await adminFetch('/api/auth/status');
      const data = await res.json();
      setNeedsSetup(Boolean(data.needsSetup));
      setAuthenticated(Boolean(data.authenticated));
      if (data.token) {
        storeToken(data.token);
      }
      if (data.adminEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.adminEmail)) {
        setEmail(data.adminEmail);
      }
      if (data.authenticated) {
        await fetchAdminData();
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchAdminData() {
    const [prodRes, reqRes] = await Promise.all([
      adminFetch('/api/admin/products'),
      adminFetch('/api/admin/requests'),
    ]);
    if (prodRes.ok) {
      const d = await prodRes.json();
      setProducts(d.products ?? []);
    }
    if (reqRes.ok) {
      const d = await reqRes.json();
      setRequests(d.requests ?? []);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    const endpoint = needsSetup ? '/api/auth/setup' : '/api/auth/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setAuthError(data.error || 'Échec de l’authentification.');
      return;
    }
    if (data.token) {
      storeToken(data.token);
    }
    setNeedsSetup(false);
    setAuthenticated(true);
    setPassword('');
    await fetchAdminData();
  }

  async function handleLogout() {
    storeToken(null);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setAuthenticated(false);
  }

  function openNewProductModal() {
    setModalError(null);
    setEditingProduct(null);
    setName('');
    setCategory('Dermocosmétique');
    setDescription('');
    setIsOnQuote(false);
    setPriceFcfa('15000');
    setSizesStr('Standard');
    setColorsStr('Standard');
    setDeliveryEstimate('24–48 h (local Bénin / Niger)');
    setImageUrl('asset:dermocosmetique');
    setFeatured(false);
    setAvailable(true);
    setModalOpen(true);
  }

  function openEditModal(p: Product) {
    setModalError(null);
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setIsOnQuote(p.isOnQuote);
    setPriceFcfa(p.priceFcfa !== null ? String(p.priceFcfa) : '0');
    setSizesStr(p.sizes.join(', '));
    setColorsStr(p.colors.join(', '));
    setDeliveryEstimate(p.deliveryEstimate);
    setImageUrl(p.imageUrl);
    setFeatured(p.featured);
    setAvailable(p.available);
    setModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setModalError(null);
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        setModalError(data.error || 'Impossible d’importer cette image (max 2,5 Mo).');
      }
    } catch {
      setModalError('Erreur lors de l’envoi de l’image.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        description: description.trim(),
        isOnQuote,
        priceFcfa: isOnQuote ? null : Math.max(0, Number(priceFcfa) || 0),
        sizes: sizesStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        colors: colorsStr
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        deliveryEstimate: deliveryEstimate.trim(),
        imageUrl,
        featured,
        available,
      };

      const res = editingProduct
        ? await adminFetch(`/api/admin/products/${editingProduct.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await adminFetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setModalError(data.error || 'Impossible d’enregistrer le produit.');
        return;
      }

      setModalOpen(false);
      setStatusBanner({
        type: 'ok',
        text: editingProduct
          ? `« ${payload.name} » a bien été mis à jour.`
          : `« ${payload.name} » a bien été ajouté au catalogue.`,
      });
      await fetchAdminData();
      onCatalogChanged();
    } catch {
      setModalError('Erreur réseau lors de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleField(p: Product, field: 'featured' | 'available') {
    const res = await adminFetch(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !p[field] }),
    });
    if (!res.ok) {
      setStatusBanner({ type: 'err', text: 'Impossible de modifier ce produit.' });
      return;
    }
    await fetchAdminData();
    onCatalogChanged();
  }

  async function handleDeleteProduct(id: string) {
    const res = await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setStatusBanner({ type: 'err', text: 'Impossible de supprimer ce produit.' });
      return;
    }
    setStatusBanner({ type: 'ok', text: 'Produit supprimé du catalogue.' });
    await fetchAdminData();
    onCatalogChanged();
  }

  async function handleUpdateRequestStatus(id: string, status: RequestStatus) {
    const res = await adminFetch(`/api/admin/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await fetchAdminData();
  }

  async function handleDeleteRequest(id: string) {
    const res = await adminFetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchAdminData();
  }

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-sm text-slate-600">
        Vérification de la session administrateur...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2E59] text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-[#0B2E59]">
                {needsSetup ? 'Configurer l’accès Admin' : 'Espace Administrateur'}
              </h1>
              <p className="text-xs text-slate-500">
                {needsSetup
                  ? 'Créez votre mot de passe sécurisé pour gérer Chez Modoukpè.'
                  : 'Connectez-vous pour gérer produits, prix et demandes.'}
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail administrateur
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mot de passe {needsSetup ? '(8 caractères min.)' : ''}
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-2.5 text-sm font-bold text-white bg-[#0277BD] hover:bg-[#0B2E59] rounded-xl cursor-pointer"
            >
              {needsSetup ? 'Activer le compte administrateur' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    const q = search.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2E59]">
            Administration Chez Modoukpè
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Connecté en tant que <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openNewProductModal}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm font-bold text-white bg-[#F25C19] hover:bg-[#D9480F] rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Ajouter un produit</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Status feedback banner */}
      {statusBanner && (
        <div
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
            statusBanner.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{statusBanner.text}</span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs underline cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setTab('products')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors ${
            tab === 'products' ? 'bg-white text-[#0B2E59] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" />
          <span>Produits ({products.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('requests')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-colors ${
            tab === 'requests' ? 'bg-white text-[#0B2E59] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Inbox className="w-4 h-4" aria-hidden="true" />
          <span>Demandes clients ({requests.length})</span>
        </button>
      </div>

      {tab === 'products' ? (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full min-h-[42px] pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                    <th className="py-3 pl-5 pr-3">Produit</th>
                    <th className="py-3 px-3">Catégorie</th>
                    <th className="py-3 px-3 text-right">Prix</th>
                    <th className="py-3 px-3 text-center">Vedette</th>
                    <th className="py-3 px-3 text-center">Disponible</th>
                    <th className="py-3 pl-3 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0B2E59] truncate max-w-[240px]">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{p.deliveryEstimate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
                        {p.category}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold whitespace-nowrap">
                        {formatPrice(p.priceFcfa, 'FCFA', p.isOnQuote)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleField(p, 'featured')}
                          aria-label={`Basculer vedette pour ${p.name}`}
                          className={`p-2 rounded-lg cursor-pointer ${
                            p.featured ? 'text-[#F25C19]' : 'text-slate-300 hover:text-slate-500'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleField(p, 'available')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                            p.available
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.available ? 'Oui' : 'Masqué'}
                        </button>
                      </td>
                      <td className="py-3 pl-3 pr-5 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          aria-label={`Modifier ${p.name}`}
                          className="p-2 text-slate-500 hover:text-[#0277BD] cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          aria-label={`Supprimer ${p.name}`}
                          className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Aucune demande client enregistrée pour le moment.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-[#0277BD]">
                    {req.type.replace('_', '-')} · {req.country}
                  </p>
                  <p className="font-semibold text-[#0B2E59]">
                    {req.customerName} — <span className="font-mono text-sm">{req.phone}</span>
                  </p>
                  <p className="text-sm text-slate-700">{req.summary}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {new Date(req.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={req.status}
                    onChange={(e) =>
                      handleUpdateRequestStatus(req.id, e.target.value as RequestStatus)
                    }
                    className="min-h-[38px] px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="nouvelle">Nouvelle</option>
                    <option value="en_cours">En cours</option>
                    <option value="traitee">Traitée</option>
                  </select>

                  <a
                    href={buildWhatsAppUrl(
                      `Bonjour ${req.customerName}, suite à votre demande chez Modoukpè (${req.summary}) :`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-bold text-white bg-[#F25C19] rounded-lg"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Répondre</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteRequest(req.id)}
                    aria-label="Supprimer la demande"
                    className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="font-display text-lg font-bold text-[#0B2E59]">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {modalError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryName)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={isOnQuote}
                      onChange={(e) => setIsOnQuote(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0277BD]"
                    />
                    <span>Prix « Sur devis »</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    disabled={isOnQuote}
                    value={priceFcfa}
                    onChange={(e) => setPriceFcfa(e.target.value)}
                    placeholder="Prix en FCFA"
                    className="w-full min-h-[42px] px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tailles / Formats (virgules)
                  </label>
                  <input
                    type="text"
                    value={sizesStr}
                    onChange={(e) => setSizesStr(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Couleurs (virgules)
                  </label>
                  <input
                    type="text"
                    value={colorsStr}
                    onChange={(e) => setColorsStr(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Délai de livraison affiché
                  </label>
                  <input
                    type="text"
                    value={deliveryEstimate}
                    onChange={(e) => setDeliveryEstimate(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Visuel prédéfini ou URL photo
                  </label>
                  <select
                    value={
                      BUILTIN_IMAGE_OPTIONS.some((o) => o.value === imageUrl) ? imageUrl : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setImageUrl(e.target.value);
                    }}
                    className="w-full min-h-[42px] px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    {BUILTIN_IMAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                    <option value="custom">Photo importée / URL personnalisée</option>
                  </select>
                </div>
              </div>

              {/* Direct photo upload */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <ProductImage
                  src={imageUrl}
                  alt="Aperçu produit"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 w-full space-y-2">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#0277BD] bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100">
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{uploading ? 'Import en cours...' : 'Importer une vraie photo'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Ou coller l'URL d'une image..."
                    className="w-full px-2.5 py-1 text-xs font-mono border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#F25C19]"
                  />
                  <span>Mettre en vedette sur l’accueil</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>Visible dans le catalogue</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0277BD] hover:bg-[#0B2E59] disabled:opacity-60 rounded-xl cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
