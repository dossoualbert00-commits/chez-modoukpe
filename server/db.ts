import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SEED_PRODUCTS } from './seedProducts.ts';
import { CustomerRequest, Product, RequestStatus } from '../src/types/shop.ts';

interface AdminConfig {
  email: string;
  passwordHash: string; // format: salt:scryptHex
}

interface DatabaseSchema {
  products: Product[];
  requests: CustomerRequest[];
  admin: AdminConfig | null;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'modoukpe-db.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      products: SEED_PRODUCTS,
      requests: [],
      admin: null,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    const parsedAdmin = parsed.admin ?? null;
    if (parsedAdmin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsedAdmin.email)) {
      parsedAdmin.email = 'modoukpebadjimou6@gmail.com';
    }
    return {
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : SEED_PRODUCTS,
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      admin: parsedAdmin,
    };
  } catch {
    const fallback: DatabaseSchema = {
      products: SEED_PRODUCTS,
      requests: [],
      admin: null,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

let state: DatabaseSchema = ensureDbFile();

function persist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Password hashing using Node crypto.scryptSync
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

// Admin Auth
export function getAdminConfig(): AdminConfig | null {
  return state.admin;
}

export function setupAdmin(email: string, password: string): AdminConfig {
  const config: AdminConfig = {
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
  };
  state.admin = config;
  persist();
  return config;
}

// Products
export function listProducts(includeUnavailable = false): Product[] {
  const list = includeUnavailable
    ? state.products
    : state.products.filter((p) => p.available);
  return [...list];
}

export function getProductBySlug(slug: string): Product | undefined {
  return state.products.find((p) => p.slug === slug);
}

export function createProduct(input: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Product {
  const now = new Date().toISOString();
  const baseSlug = input.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'produit';

  let slug = baseSlug;
  let counter = 2;
  while (state.products.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const created: Product = {
    ...input,
    id: `prod-${Date.now()}`,
    slug,
    createdAt: now,
    updatedAt: now,
  };
  state.products = [created, ...state.products];
  persist();
  return created;
}

export function updateProduct(id: string, patch: Partial<Product>): Product | null {
  const index = state.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: Product = {
    ...state.products[index],
    ...patch,
    id: state.products[index].id,
    updatedAt: new Date().toISOString(),
  };
  state.products[index] = updated;
  persist();
  return updated;
}

export function deleteProduct(id: string): boolean {
  const before = state.products.length;
  state.products = state.products.filter((p) => p.id !== id);
  if (state.products.length !== before) {
    persist();
    return true;
  }
  return false;
}

// Customer Requests
export function listRequests(): CustomerRequest[] {
  return [...state.requests];
}

export function createRequest(
  input: Omit<CustomerRequest, 'id' | 'status' | 'createdAt'>
): CustomerRequest {
  const created: CustomerRequest = {
    ...input,
    id: `req-${Date.now()}`,
    status: 'nouvelle',
    createdAt: new Date().toISOString(),
  };
  state.requests = [created, ...state.requests];
  persist();
  return created;
}

export function updateRequestStatus(id: string, status: RequestStatus): CustomerRequest | null {
  const index = state.requests.findIndex((r) => r.id === id);
  if (index === -1) return null;
  state.requests[index] = { ...state.requests[index], status };
  persist();
  return state.requests[index];
}

export function deleteRequest(id: string): boolean {
  const before = state.requests.length;
  state.requests = state.requests.filter((r) => r.id !== id);
  if (state.requests.length !== before) {
    persist();
    return true;
  }
  return false;
}
