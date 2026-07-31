"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type Product, whatsappUrl } from "../data/store";
import { ProductCard } from "../components/product-card";
import { fetchPublicProducts, fetchPublicCategories, toLegacyProducts } from "@/lib/api";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchPublicProducts(),
          fetchPublicCategories(),
        ]);
        setProducts(toLegacyProducts(fetchedProducts));
        setCategories(["All", ...fetchedCategories.map((c) => c.name)]);
      } catch {
        setCategories(["All"]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        [product.name, product.description, product.category, product.badge]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, products]);

  return (
    <div className="section-shell py-8 md:py-12">
      <section className="glass-surface rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Shop</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Browse the full collection</h1>
            <p className="max-w-2xl text-muted">
              Search products, filter by category, open details, and add items to cart without leaving the page.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
              WhatsApp help
            </Link>
            <Link href="/checkout" className="button-primary">
              Go to checkout
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="input-field"
            placeholder="Search by product, category, or badge"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-[color:var(--gold)] text-white"
                    : "border border-[rgba(var(--ink-rgb),0.08)] bg-white/70 text-muted hover:text-[color:var(--rich-black)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-muted py-12">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-muted py-12">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </section>
    </div>
  );
}