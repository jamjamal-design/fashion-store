export type EntityId = string;

export type AdminRole = "owner" | "manager" | "editor";

export type AdminStatus = "active" | "invited" | "disabled";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed";

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  count: number;
  isActive: boolean;
};

export type ProductImage = {
  url: string;
  publicId: string;
};

export type ProductInput = {
  name: string;
  slug: string;
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
  sku?: string;
  stock?: number;
  featured?: boolean;
  isActive?: boolean;
};

export type CustomerSnapshot = {
  name: string;
  email: string;
  phone: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
};

export type OrderItemInput = {
  productId: EntityId;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
};

export type OrderInput = {
  orderNumber: string;
  customer: CustomerSnapshot;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string;
  notes?: string;
  assignedAdminId?: EntityId;
};

export type AdminUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: AdminStatus;
};

export const COLLECTION_NAMES = {
  admins: "admins",
  products: "products",
  categories: "categories",
  orders: "orders",
} as const;