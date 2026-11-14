import { useCallback, useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { initTracking, trackEvent } from './lib/analytics';
import { AdminPage } from './pages/AdminPage';
import { CatalogPage } from './pages/CatalogPage';
import { CustomizationPage } from './pages/CustomizationPage';
import { HomePage } from './pages/HomePage';
import { ImportExportPage } from './pages/ImportExportPage';
import { AboutPage, ContactPage, FaqPage, LegalPage } from './pages/InfoAndLegalPages';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SurpriseAgencyPage } from './pages/SurpriseAgencyPage';
import { CartItem, CategoryName, CurrencyCode, LanguageCode, Product } from './types/shop';

const CART_STORAGE_KEY = 'modoukpe_cart_v1';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'Toutes' | CategoryName>('Toutes');
  const [currency, setCurrency] = useState<CurrencyCode>('FCFA');
  const [lang, setLang] = useState<LanguageCode>('fr');
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      }
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    initTracking();
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(window.location.pathname || '/');
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function notify(msg: string) {
    setToast(msg);
    window.setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2600);
  }

  function navigate(path: string, category?: CategoryName) {
    if (category) {
      setSelectedCategory(category);
    } else if (path === '/catalogue' && !category) {
      // keep current or reset if navigating explicitly without category
    }
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleViewProduct(product: Product) {
    navigate(`/produit/${product.slug}`);
  }

  function handleAddToCart(
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) {
    const size = selectedSize ?? product.sizes[0];
    const color = selectedColor ?? product.colors[0];

    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColor === color
      );
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });

    trackEvent('add_to_cart', { product: product.slug, qty: quantity });
    notify(`« ${product.name} » ajouté au panier`);
  }

  function handleUpdateQty(index: number, delta: number) {
    setCart((prev) => {
      const copy = [...prev];
      const target = copy[index];
      if (!target) return prev;
      const nextQty = target.quantity + delta;
      if (nextQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...target, quantity: nextQty };
      }
      return copy;
    });
  }

  function handleRemoveItem(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Route matching
  const isProductRoute = currentPath.startsWith('/produit/');
  const productSlug = isProductRoute ? currentPath.replace('/produit/', '').split('/')[0] : '';
  const activeProduct = isProductRoute
    ? products.find((p) => p.slug === productSlug) ?? null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        lang={lang}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            products={products}
            loading={loadingProducts}
            currency={currency}
            lang={lang}
            onNavigate={navigate}
            onViewProduct={handleViewProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {currentPath === '/catalogue' && (
          <CatalogPage
            products={products}
            loading={loadingProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            currency={currency}
            onChangeCurrency={setCurrency}
            onViewProduct={handleViewProduct}
            onAddToCart={(p, s, c) => handleAddToCart(p, 1, s, c)}
          />
        )}

        {isProductRoute && (
          <ProductDetailPage
            product={activeProduct}
            currency={currency}
            onBackToCatalog={() => navigate('/catalogue')}
            onAddToCart={(p, q, s, c) => handleAddToCart(p, q, s, c)}
          />
        )}

        {currentPath === '/import-export' && <ImportExportPage />}
        {currentPath === '/personnalisation' && <CustomizationPage />}
        {currentPath === '/surprise-agency' && <SurpriseAgencyPage />}
        {currentPath === '/a-propos' && <AboutPage onNavigate={(p) => navigate(p)} />}
        {currentPath === '/faq' && <FaqPage />}
        {currentPath === '/contact' && <ContactPage />}
        {currentPath === '/mentions-legales' && <LegalPage type="mentions" />}
        {currentPath === '/cgv' && <LegalPage type="cgv" />}
        {currentPath === '/confidentialite' && <LegalPage type="confidentialite" />}

        {currentPath === '/admin' && <AdminPage onCatalogChanged={fetchProducts} />}
      </main>

      <Footer onNavigate={navigate} lang={lang} onChangeLang={setLang} />

      <FloatingWhatsApp currentPath={currentPath} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-5 z-50 px-4 py-2.5 bg-[#0B2E59] text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
