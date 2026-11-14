import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  createProduct,
  createRequest,
  deleteProduct,
  deleteRequest,
  getAdminConfig,
  getProductBySlug,
  listProducts,
  listRequests,
  setupAdmin,
  updateProduct,
  updateRequestStatus,
  verifyPassword,
} from './server/db.ts';
import { RequestStatus } from './src/types/shop.ts';

const PORT = 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const SITE_URL = (process.env.APP_URL || process.env.VITE_SITE_URL || 'https://chezmodoukpe.com').replace(/\/$/, '');
const rawEnvAdminEmail = process.env.ADMIN_EMAIL?.trim() || '';
const DEFAULT_ADMIN_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEnvAdminEmail)
  ? rawEnvAdminEmail
  : 'modoukpebadjimou6@gmail.com';
const SESSION_SECRET =
  process.env.ADMIN_SECRET ||
  crypto.createHash('sha256').update(process.cwd() + '_modoukpe_session_v1').digest('hex');

const COOKIE_NAME = 'modoukpe_admin_session';
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  const result: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

function signSessionToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): { email: string } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      email: string;
      exp: number;
    };
    if (!decoded.email || decoded.exp < Date.now()) return null;
    return { email: decoded.email };
  } catch {
    return null;
  }
}

function getSessionFromRequest(req: Request): { email: string } | null {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    const bearerSession = verifySessionToken(bearerToken);
    if (bearerSession) return bearerSession;
  }
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[COOKIE_NAME]);
}

function setSessionCookie(req: Request, res: Response, token: string) {
  const isHttps =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    String(req.headers.origin || '').startsWith('https://');
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: 'Authentification administrateur requise.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Serve uploaded images safely
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'chez-modoukpe' });
  });

  // Public products API
  app.get('/api/products', (_req, res) => {
    res.json({ products: listProducts(false) });
  });

  app.get('/api/products/:slug', (req, res) => {
    const product = getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ error: 'Produit introuvable.' });
      return;
    }
    res.json({ product });
  });

  // Public customer requests (Import-Export, Personnalisation, Surprise Agency, Contact)
  app.post('/api/requests', (req, res) => {
    const { type, customerName, phone, email, country, city, summary, details } = req.body ?? {};
    if (!type || !customerName || !phone || !country || !summary) {
      res.status(400).json({ error: 'Veuillez renseigner tous les champs obligatoires.' });
      return;
    }
    const created = createRequest({
      type,
      customerName: String(customerName).slice(0, 120),
      phone: String(phone).slice(0, 40),
      email: email ? String(email).slice(0, 120) : undefined,
      country: country === 'Niger' ? 'Niger' : 'Bénin',
      city: city ? String(city).slice(0, 80) : undefined,
      summary: String(summary).slice(0, 300),
      details: typeof details === 'object' && details ? details : {},
    });
    res.status(201).json({ request: created });
  });

  // Admin Auth endpoints
  app.get('/api/auth/status', (req, res) => {
    const admin = getAdminConfig();
    const session = getSessionFromRequest(req);
    res.json({
      needsSetup: !admin,
      authenticated: Boolean(session),
      adminEmail: session?.email ?? (admin ? admin.email : DEFAULT_ADMIN_EMAIL),
      token: session ? signSessionToken(session.email) : undefined,
    });
  });

  app.post('/api/auth/setup', (req, res) => {
    if (getAdminConfig()) {
      res.status(403).json({ error: 'Le compte administrateur est déjà configuré.' });
      return;
    }
    const { email, password } = req.body ?? {};
    if (!email || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'Mot de passe de 8 caractères minimum requis.' });
      return;
    }
    const config = setupAdmin(String(email), password);
    const token = signSessionToken(config.email);
    setSessionCookie(req, res, token);
    res.status(201).json({ authenticated: true, adminEmail: config.email, token });
  });

  app.post('/api/auth/login', (req, res) => {
    const admin = getAdminConfig();
    if (!admin) {
      res.status(400).json({ error: 'Compte administrateur non encore configuré.' });
      return;
    }
    const { email, password } = req.body ?? {};
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim().toLowerCase() !== admin.email ||
      !verifyPassword(password, admin.passwordHash)
    ) {
      res.status(401).json({ error: 'Identifiants incorrects.' });
      return;
    }
    const token = signSessionToken(admin.email);
    setSessionCookie(req, res, token);
    res.json({ authenticated: true, adminEmail: admin.email, token });
  });

  app.post('/api/auth/logout', (req, res) => {
    const isHttps =
      req.secure ||
      req.headers['x-forwarded-proto'] === 'https' ||
      String(req.headers.origin || '').startsWith('https://');
    res.clearCookie(COOKIE_NAME, {
      path: '/',
      sameSite: isHttps ? 'none' : 'lax',
      secure: isHttps,
    });
    res.json({ authenticated: false });
  });

  // Protected Admin CRUD
  app.get('/api/admin/products', requireAdmin, (_req, res) => {
    res.json({ products: listProducts(true) });
  });

  app.post('/api/admin/products', requireAdmin, (req, res) => {
    const body = req.body ?? {};
    if (!body.name || !body.category || !body.description) {
      res.status(400).json({ error: 'Nom, catégorie et description sont obligatoires.' });
      return;
    }
    const isOnQuote = Boolean(body.isOnQuote);
    const created = createProduct({
      name: String(body.name).trim(),
      category: body.category,
      description: String(body.description).trim(),
      priceFcfa: isOnQuote ? null : Math.max(0, Number(body.priceFcfa) || 0),
      isOnQuote,
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ['Standard'],
      colors: Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : ['Standard'],
      imageUrl: String(body.imageUrl || 'asset:importes'),
      featured: Boolean(body.featured),
      available: body.available !== false,
      deliveryEstimate: String(body.deliveryEstimate || '24–48 h (local Bénin / Niger)'),
    });
    res.status(201).json({ product: created });
  });

  app.patch('/api/admin/products/:id', requireAdmin, (req, res) => {
    const updated = updateProduct(req.params.id, req.body ?? {});
    if (!updated) {
      res.status(404).json({ error: 'Produit introuvable.' });
      return;
    }
    res.json({ product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const ok = deleteProduct(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Produit introuvable.' });
      return;
    }
    res.json({ deleted: true });
  });

  app.get('/api/admin/requests', requireAdmin, (_req, res) => {
    res.json({ requests: listRequests() });
  });

  app.patch('/api/admin/requests/:id', requireAdmin, (req, res) => {
    const status = req.body?.status as RequestStatus;
    if (!['nouvelle', 'en_cours', 'traitee'].includes(status)) {
      res.status(400).json({ error: 'Statut invalide.' });
      return;
    }
    const updated = updateRequestStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Demande introuvable.' });
      return;
    }
    res.json({ request: updated });
  });

  app.delete('/api/admin/requests/:id', requireAdmin, (req, res) => {
    const ok = deleteRequest(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Demande introuvable.' });
      return;
    }
    res.json({ deleted: true });
  });

  // Admin image upload (base64 image from browser file picker -> saved to /uploads)
  app.post('/api/admin/upload', requireAdmin, (req, res) => {
    const { dataUrl, filename } = req.body ?? {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      res.status(400).json({ error: 'Format image invalide.' });
      return;
    }
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|avif);base64,(.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Formats acceptés : PNG, JPG, WebP, AVIF.' });
      return;
    }
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 2.5 * 1024 * 1024) {
      res.status(400).json({ error: 'Image trop lourde (max 2,5 Mo).' });
      return;
    }
    const safeName = `${Date.now()}-${String(filename || 'produit')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 32)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, safeName), buffer);
    res.status(201).json({ url: `/uploads/${safeName}` });
  });

  // SEO: robots.txt & sitemap.xml
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    );
  });

  app.get('/sitemap.xml', (_req, res) => {
    const staticRoutes = [
      '/',
      '/catalogue',
      '/import-export',
      '/personnalisation',
      '/surprise-agency',
      '/a-propos',
      '/faq',
      '/contact',
      '/mentions-legales',
      '/cgv',
      '/confidentialite',
    ];
    const products = listProducts(false);
    const urls = [
      ...staticRoutes.map(
        (route) => `  <url><loc>${SITE_URL}${route}</loc><changefreq>weekly</changefreq></url>`
      ),
      ...products.map(
        (p) =>
          `  <url><loc>${SITE_URL}/produit/${p.slug}</loc><lastmod>${p.updatedAt.slice(0, 10)}</lastmod></url>`
      ),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    res.type('application/xml').send(xml);
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { maxAge: '7d' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur Chez Modoukpè actif sur http://localhost:${PORT}`);
  });
}

startServer();
