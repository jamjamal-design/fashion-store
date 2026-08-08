"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchPublicProducts, toLegacyProducts } from "@/lib/api";
import { type Product, formatCurrency } from "../data/store";
import { ProductImage } from "./product-image";

const RECENT_KEY = "claireville-search-history";
const POPULAR_SEARCHES = ["bridal", "bespoke couture", "mens suit", "ready-to-wear", "coral beads", "luxury accessories"];

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

function readRecentSearches() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const stored = window.localStorage.getItem(RECENT_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [] as string[];
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readRecentSearches();
  const next = [term, ...current.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function LuxurySearchModal({ open, onClose }: SearchModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (products.length === 0) {
      setLoading(true);
      fetchPublicProducts()
        .then((apiProducts) => setProducts(toLegacyProducts(apiProducts)))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, products.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) {
      return products.slice(0, 8);
    }

    return products.filter((product) =>
      [product.name, product.description, product.category, product.badge]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [normalized, products]);

  const suggestionChips = [...recentSearches, ...POPULAR_SEARCHES.filter((item) => !recentSearches.includes(item))].slice(0, 8);

  function handleChipClick(term: string) {
    setQuery(term);
    saveRecentSearch(term);
    setRecentSearches(readRecentSearches());
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(var(--scrim-rgb),0.88)] px-4 py-6 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="luxury-search-panel w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[rgba(201,168,76,0.18)] bg-[var(--background)] shadow-[0_40px_120px_rgba(var(--ink-rgb),0.22)]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-[rgba(201,168,76,0.12)] p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="section-badge">Search</span>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-[color:var(--rich-black)] md:text-4xl">
                    Search the collection
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted md:text-base">
                    Discover products instantly, revisit recent searches, and jump to your next look without leaving the page.
                  </p>
                </div>
                <button type="button" onClick={onClose} className="button-secondary px-4 py-2 text-sm">
                  Close
                </button>
              </div>

              <label className="mt-5 block">
                <span className="sr-only">Search products</span>
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by product, badge, category, or mood"
                  className="input-field text-base md:text-lg"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestionChips.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleChipClick(term)}
                    className="rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-white/75 px-3 py-2 text-xs font-semibold text-muted transition hover:border-[rgba(201,168,76,0.24)] hover:text-[color:var(--gold)]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                    Instant results
                  </h3>
                  <span className="text-xs font-semibold text-muted">
                    {loading ? "Loading collection…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {results.length === 0 && !loading ? (
                    <div className="sm:col-span-2 xl:col-span-3 rounded-[1.5rem] border border-dashed border-[rgba(var(--ink-rgb),0.10)] bg-white/70 p-8 text-center">
                      <p className="text-lg font-bold text-[color:var(--rich-black)]">No results yet.</p>
                      <p className="mt-2 text-sm text-muted">Try a different keyword or use one of the suggested search terms.</p>
                      <Link href="/shop" className="button-primary mt-5">
                        Browse all products
                      </Link>
                    </div>
                  ) : (
                    results.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.25, delay: prefersReducedMotion ? 0 : index * 0.04 }}
                        className="card-gold-hover group overflow-hidden rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/80"
                      >
                        <Link href={`/products/${product.slug}`} onClick={onClose} className="block p-3">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[rgba(var(--scrim-rgb),0.12)]">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 50vw, 320px"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                              wrapperClassName="absolute inset-0"
                            />
                          </div>
                          <div className="mt-3 space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                              {product.category}
                            </p>
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="text-sm font-bold leading-6 text-[color:var(--rich-black)]">
                                {product.name}
                              </h4>
                              <span className="shrink-0 text-sm font-black text-[color:var(--gold)]">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                            <p className="text-xs text-muted">{product.badge}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.03)] p-5 md:p-6 lg:border-l lg:border-t-0">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                  Search notes
                </h3>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-[1.4rem] border border-[rgba(var(--ink-rgb),0.08)] bg-white/75 p-4">
                    <p className="text-sm font-bold text-[color:var(--rich-black)]">Recent searches</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recentSearches.length === 0 ? (
                        <p className="text-sm text-muted">Your recent terms will appear here.</p>
                      ) : recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-[rgba(var(--ink-rgb),0.08)] px-3 py-2 text-xs font-semibold text-muted transition hover:border-[rgba(201,168,76,0.24)] hover:text-[color:var(--gold)]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-[rgba(var(--ink-rgb),0.08)] bg-white/75 p-4">
                    <p className="text-sm font-bold text-[color:var(--rich-black)]">Popular searches</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleChipClick(term)}
                          className="flex items-center justify-between rounded-[1rem] border border-[rgba(var(--ink-rgb),0.08)] px-3 py-2.5 text-left text-sm font-medium text-[color:var(--rich-black)] transition hover:border-[rgba(201,168,76,0.24)] hover:bg-[rgba(201,168,76,0.05)]"
                        >
                          <span>{term}</span>
                          <span className="text-[color:var(--gold)]">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-[rgba(var(--ink-rgb),0.08)] bg-white/75 p-4">
                    <p className="text-sm font-bold text-[color:var(--rich-black)]">Need the full catalog?</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Open the shop to filter, compare, and continue from the full collection view.
                    </p>
                    <Link href="/shop" onClick={onClose} className="button-primary mt-4 w-full">
                      Open shop
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}