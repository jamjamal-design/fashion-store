import type { Product } from "../app/data/store";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

export type ProductImage = {
  url: string;
  publicId: string;
};

export type ApiProduct = {
  id: string;
  _id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  badge: string;
  description: string;
  details: string[];
  image: ProductImage[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiCategory = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  isActive: boolean;
};

// ── Server-side fetch helpers ──

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      console.warn(`[api] fetch failed for ${url}: ${response.status} ${response.statusText}`);
      return fallback;
    }
    return response.json();
  } catch (error) {
    console.warn(`[api] fetch error for ${url}:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

export async function fetchPublicProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
}): Promise<ApiProduct[]> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.featured) params.set("featured", "true");
  if (options?.search) params.set("search", options.search);

  const query = params.toString();
  const url = `${API_BASE}/api/public/products${query ? `?${query}` : ""}`;

  return safeFetch<ApiProduct[]>(url, []);
}

export async function fetchFeaturedProducts(limit = 4): Promise<ApiProduct[]> {
  return safeFetch<ApiProduct[]>(
    `${API_BASE}/api/public/products/featured?limit=${limit}`,
    []
  );
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  return safeFetch<ApiProduct | null>(
    `${API_BASE}/api/public/products/slug/${slug}`,
    null
  );
}

export async function fetchProductsByCategory(category: string): Promise<ApiProduct[]> {
  return safeFetch<ApiProduct[]>(
    `${API_BASE}/api/public/products/category/${encodeURIComponent(category)}`,
    []
  );
}

export async function fetchPublicCategories(): Promise<ApiCategory[]> {
  return safeFetch<ApiCategory[]>(
    `${API_BASE}/api/public/categories`,
    []
  );
}

// ── Transform helpers ──

export function getProductImage(product: ApiProduct): string {
  if (Array.isArray(product.image) && product.image.length > 0) {
    return product.image[0].url;
  }
  return product.image as unknown as string || "";
}

// Converts API product format to the legacy Product format expected by components
// (image array → single image string for backward compatibility)
export type UiProduct = Omit<ApiProduct, "image"> & Product;

export function toLegacyProduct(product: ApiProduct): UiProduct {
  const image = getProductImage(product);
  return {
    ...product,
    id: product.id ?? product._id ?? "",
    image,
  };
}

export function toLegacyProducts(products: ApiProduct[]): UiProduct[] {
  return products.map(toLegacyProduct);
}

export function getProductImages(product: ApiProduct): ProductImage[] {
  if (Array.isArray(product.image)) {
    return product.image;
  }
  return [];
}
