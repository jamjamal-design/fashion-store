"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  type Product,
  customers,
  formatCurrency,
  receiptReviews,
} from "../data/store";
import {
  createProduct,
  deleteProduct,
  listCategories,
  listOrders,
  listProducts,
  logoutAdmin,
  uploadProductImage,
  updateProduct,
} from "../../lib/admin-api";
import { loadAdminSession } from "../../lib/auth";

type ProductDraft = Omit<Product, "id" | "slug">;

const emptyDraft: ProductDraft = {
  name: "",
  category: "",
  price: 0,
  badge: "New",
  description: "",
  details: [""],
  image: "",
  colors: [""],
  sizes: [""],
  rating: 4.8,
  reviews: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [adminQuery, setAdminQuery] = useState("");
  const [orders, setOrders] = useState(receiptReviews);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const session = loadAdminSession();

    if (!session?.token) {
      router.replace("/admin/login");
      return;
    }

    let active = true;

    async function loadAdminData() {
      try {
        const [productsFromApi, ordersFromApi, categoriesFromApi] = await Promise.all([listProducts(), listOrders(), listCategories()]);

        if (!active) {
          return;
        }

        if (productsFromApi.length > 0) {
          setProductList(productsFromApi);
        }

        if (categoriesFromApi.length > 0) {
          setCategories(categoriesFromApi);
        }

        if (ordersFromApi.length > 0) {
          setOrders(
            ordersFromApi.map((order) => ({
              customer: order.customer.name,
              orderId: order.orderNumber,
              amount: order.total,
              status: `${order.paymentStatus} · ${order.status}`,
            })),
          );
        }
      } catch {
        if (!active) {
          return;
        }

        toast.error("Could not load admin data from the API");
      }
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsCheckingSession(false);
      void loadAdminData();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [router]);

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return [customer.name, customer.email, customer.phone, customer.orderId, customer.status]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [customerQuery]);

  const filteredProducts = useMemo(() => {
    const query = adminQuery.trim().toLowerCase();

    if (!query) {
      return productList;
    }

    return productList.filter((product) => {
      return [product.name, product.category, product.badge, product.description]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [adminQuery, productList]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const productPayload: Product = {
      id: editingId ?? `prd-${String(productList.length + 1).padStart(3, "0")}`,
      slug: editingId ? productList.find((product) => product.id === editingId)?.slug ?? slugify(draft.name) : slugify(draft.name),
      ...draft,
      details: draft.details.filter(Boolean),
      colors: draft.colors.filter(Boolean),
      sizes: draft.sizes.filter(Boolean),
    };

    try {
      const savedProduct = editingId ? await updateProduct(productPayload.id, productPayload) : await createProduct(productPayload);

      setProductList((current) => {
        const exists = current.some((product) => product.id === savedProduct.id);

        if (exists) {
          return current.map((product) => (product.id === savedProduct.id ? savedProduct : product));
        }

        return [savedProduct, ...current];
      });

      toast.success(editingId ? "Product updated" : "Product added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product could not be saved");
      return;
    }

    setEditingId(null);
    setDraft(emptyDraft);
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setDraft(product);
  }

  async function handleDelete(productId: string) {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product could not be deleted");
      return;
    }

    setProductList((current) => current.filter((product) => product.id !== productId));
    if (editingId === productId) {
      setEditingId(null);
      setDraft(emptyDraft);
    }
  }

  async function handleImageUpload(file: File | null) {
    if (!file) {
      return;
    }

    setIsUploadingImage(true);

    try {
      const result = await uploadProductImage(file);
      setDraft((current) => ({ ...current, image: result.url }));
      toast.success("Image uploaded to Cloudinary");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleLogout() {
    logoutAdmin();
    router.replace("/admin/login");
  }

  if (isCheckingSession) {
    return (
      <div className="section-shell py-20 text-center">
        <p className="text-lg font-semibold text-muted">Checking admin session...</p>
      </div>
    );
  }

  return (
    <div className="section-shell py-8 md:py-12">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-4">
            <span className="section-badge">Admin dashboard</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Manage products and customer support</h1>
            <p className="max-w-2xl text-muted">
              Add, edit, and delete products while searching for customers and reviewing uploaded payment receipts.
            </p>
          </div>
          <button type="button" onClick={handleLogout} className="button-secondary">
            Log out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-surface rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Product editor</h2>
              <p className="text-sm text-muted">Use the form below to add or update catalog items.</p>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyDraft);
                }}
                className="button-secondary"
              >
                Cancel edit
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)] md:col-span-2">
              Product name
              <input
                className="input-field"
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Category
              <select
                className="input-field"
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Price
              <input
                type="number"
                className="input-field"
                value={draft.price}
                onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Badge
              <input
                className="input-field"
                value={draft.badge}
                onChange={(event) => setDraft({ ...draft, badge: event.target.value })}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Rating
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={draft.rating}
                onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Reviews
              <input
                type="number"
                className="input-field"
                value={draft.reviews}
                onChange={(event) => setDraft({ ...draft, reviews: Number(event.target.value) })}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)] md:col-span-2">
              Description
              <textarea
                className="input-field min-h-28 resize-y"
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)] md:col-span-2">
              Cloudinary image URL
              <div className="grid gap-3">
                <input
                  className="input-field"
                  value={draft.image}
                  onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                />
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  onChange={(event) => void handleImageUpload(event.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted">
                  {isUploadingImage ? "Uploading to Cloudinary..." : "Upload a file to send it through the server to Cloudinary."}
                </p>
                {draft.image ? (
                  <Image
                    src={draft.image}
                    alt={draft.name || "Selected product"}
                    width={900}
                    height={520}
                    unoptimized
                    className="h-48 w-full rounded-[1.1rem] object-cover shadow-[0_18px_40px_rgba(var(--ink-rgb),0.08)]"
                  />
                ) : null}
              </div>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)] md:col-span-2">
              Details, colors, sizes
              <textarea
                className="input-field min-h-24 resize-y"
                value={draft.details.join(", ")}
                onChange={(event) =>
                  setDraft({ ...draft, details: normalizeCsv(event.target.value) })
                }
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Colors
              <input
                className="input-field"
                value={draft.colors.join(", ")}
                onChange={(event) => setDraft({ ...draft, colors: normalizeCsv(event.target.value) })}
                placeholder="Gold, Silver, Ivory"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Sizes
              <input
                className="input-field"
                value={draft.sizes.join(", ")}
                onChange={(event) => setDraft({ ...draft, sizes: normalizeCsv(event.target.value) })}
                placeholder="S, M, L"
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button type="submit" className="button-primary">
                {editingId ? "Update product" : "Add product"}
              </button>
              <button
                type="button"
                onClick={() => setDraft(emptyDraft)}
                className="button-secondary"
              >
                Reset form
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Customer search</h2>
            <input
              className="input-field mt-4"
              placeholder="Search by name, phone, email, or order ID"
              value={customerQuery}
              onChange={(event) => setCustomerQuery(event.target.value)}
            />
            <div className="mt-4 grid gap-3">
              {filteredCustomers.map((customer) => (
                <div key={customer.orderId} className="rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 text-sm">
                  <p className="font-bold text-[color:var(--rich-black)]">{customer.name}</p>
                  <p className="text-muted">{customer.email}</p>
                  <p className="text-muted">{customer.phone}</p>
                  <p className="mt-2 font-semibold text-[color:var(--gold)]">{customer.orderId} · {customer.status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Payment receipt review</h2>
            <div className="mt-4 grid gap-3">
              {orders.map((receipt) => (
                <div key={receipt.orderId} className="rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[color:var(--rich-black)]">{receipt.customer}</p>
                      <p className="text-muted">{receipt.orderId}</p>
                    </div>
                    <p className="font-black text-[color:var(--gold)]">{formatCurrency(receipt.amount)}</p>
                  </div>
                  <p className="mt-2 text-muted">{receipt.status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Catalog overview</h2>
            <input
              className="input-field mt-4"
              placeholder="Search admin catalog"
              value={adminQuery}
              onChange={(event) => setAdminQuery(event.target.value)}
            />
            <div className="mt-4 grid gap-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-[color:var(--rich-black)]">{product.name}</p>
                      <p className="text-muted">{product.category}</p>
                      <p className="text-muted">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => handleEdit(product)} className="button-secondary px-4 py-2 text-xs">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full border border-[rgba(201,168,76,0.15)] px-4 py-2 text-xs font-semibold text-[color:var(--gold)]">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}