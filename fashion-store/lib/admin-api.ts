import type { Product } from "../app/data/store";
import { clearAdminSession, getAdminToken, saveAdminSession, type AdminSession } from "./auth";
import { uploadImageToServerCloudinary } from "./uploads";

type ProductImage = {
  url: string;
  publicId: string;
};

type ApiProduct = Omit<Product, "image"> & {
  id?: string;
  _id?: string;
  image: ProductImage[];
  stock?: number;
  featured?: boolean;
  isActive?: boolean;
};

type ApiOrder = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  total: number;
  paymentStatus: string;
  status: string;
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? "https://fashion-store-g8s0.onrender.com").replace(/\/$/, "");

async function requestJson<T>(path: string, init?: RequestInit, includeAuth = true): Promise<T> {
  const token = includeAuth ? getAdminToken() : null;

  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function getPublicIdFromUrl(url: string) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    const uploadIndex = parsedUrl.pathname.indexOf("/image/upload/");

    if (uploadIndex === -1) {
      return url;
    }

    const pathAfterUpload = parsedUrl.pathname.slice(uploadIndex + "/image/upload/".length);
    return pathAfterUpload.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
  } catch {
    return url;
  }
}

function toMongoProductImage(image: string): ProductImage[] {
  if (!image) {
    return [];
  }

  return [
    {
      url: image,
      publicId: getPublicIdFromUrl(image),
    },
  ];
}

function toUiProduct(product: ApiProduct): Product {
  return {
    ...product,
    id: product.id ?? product._id ?? "",
    image: product.image[0]?.url ?? "",
  };
}

function buildProductPayload(product: Product): Omit<ApiProduct, "id" | "_id"> {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    badge: product.badge,
    description: product.description,
    details: product.details,
    image: toMongoProductImage(product.image),
    colors: product.colors,
    sizes: product.sizes,
    rating: product.rating,
    reviews: product.reviews,
    isActive: true,
  };
}

export async function listProducts() {
  const products = await requestJson<ApiProduct[]>("/products");
  return products.map(toUiProduct);
}

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
};

export async function listCategories() {
  return requestJson<ApiCategory[]>("/categories");
}

export async function createProduct(product: Product) {
  const savedProduct = await requestJson<ApiProduct>("/products", {
    method: "POST",
    body: JSON.stringify(buildProductPayload(product)),
  });

  return toUiProduct(savedProduct);
}

export async function updateProduct(productId: string, product: Product) {
  const savedProduct = await requestJson<ApiProduct>(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(buildProductPayload(product)),
  });

  return toUiProduct(savedProduct);
}

export async function deleteProduct(productId: string) {
  return requestJson<{ id: string }>(`/products/${productId}`, {
    method: "DELETE",
  });
}

export async function listOrders() {
  return requestJson<ApiOrder[]>("/orders");
}

export async function loginAdmin(email: string, password: string) {
  // Try local API route first (reads from .env.local)
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const result = await response.json();
      saveAdminSession({
        adminId: result.admin.id,
        email: result.admin.email,
        role: result.admin.role,
        token: result.token,
      });
      return result;
    }

    // If local API fails, try the remote server as fallback
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  } catch {
    // Fallback: try the remote server API
    const result = await requestJson<{
      token: string;
      admin: { id: string; name: string; email: string; role: AdminSession["role"]; status: string };
    }>(
      "/admin/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      false,
    );

    saveAdminSession({
      adminId: result.admin.id,
      email: result.admin.email,
      role: result.admin.role,
      token: result.token,
    });

    return result;
  }
}

export function logoutAdmin() {
  clearAdminSession();
}

export async function uploadProductImage(file: File) {
  const token = getAdminToken();
  return uploadImageToServerCloudinary(file, "fashion-store/products", token ?? undefined);
}
