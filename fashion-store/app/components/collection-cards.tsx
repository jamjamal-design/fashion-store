"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product, type ProductCategory, formatCurrency } from "../data/store";
import { useCart } from "./cart-context";
import { QuickViewModal } from "./quick-view-modal";
import { ProductImage } from "./product-image";

interface CollectionCardsProps {
  categories: (ProductCategory & { products: Product[] })[];
}

export function CollectionCards({ categories }: CollectionCardsProps) {
  const { addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (slug: string) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  return (
    <>
      <div className="space-y-8">
        {categories.map((category) => {
          const isExpanded = expandedCategory === category.slug;

          return (
            <div key={category.slug} className="rounded-2xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.4)] overflow-hidden transition-all duration-500">
              {/* Category header — clickable to toggle */}
              <button
                type="button"
                onClick={() => toggleCategory(category.slug)}
                className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[rgba(212,160,23,0.04)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(212,160,23,0.1)] text-[color:var(--accent-strong)]">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-muted">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[color:var(--accent-strong)]">{category.count} pieces</span>
                  <svg
                    className={`h-5 w-5 text-muted transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Product grid — expandable */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="border-t border-[color:var(--border)] p-5">
                  {category.products.length === 0 ? (
                    <p className="text-sm text-muted text-center py-4">No products available in this collection yet.</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {category.products.map((product) => (
                        <div
                          key={product.id}
                          className="group relative overflow-hidden rounded-xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(212,160,23,0.25)] hover:shadow-[0_16px_40px_rgba(4,10,24,0.3)]"
                        >
                          <div className="relative aspect-square overflow-hidden">
                            <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
                              <ProductImage
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-all duration-500 group-hover:scale-105"
                                wrapperClassName="absolute inset-0"
                              />
                            </Link>
                            {product.badge && (
                              <span className="absolute left-2 top-2 rounded-full bg-[color:var(--accent-strong)] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0a0a0a] shadow-lg">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <Link href={`/products/${product.slug}`}>
                              <h4 className="text-sm font-bold text-white transition-colors hover:text-[color:var(--accent-strong)]">
                                {product.name}
                              </h4>
                            </Link>
                            <p className="mt-1 text-lg font-black text-[color:var(--accent-strong)]">
                              {formatCurrency(product.price)}
                            </p>
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  addToCart(product, 1);
                                }}
                                className="flex-1 rounded-full bg-[rgba(212,160,23,0.12)] py-2 text-xs font-bold text-[color:var(--accent-strong)] transition hover:bg-[rgba(212,160,23,0.22)]"
                              >
                                Add to cart
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuickViewProduct(product)}
                                className="flex-1 rounded-full border border-[color:var(--border)] py-2 text-xs font-bold text-muted transition hover:bg-[rgba(15,25,47,0.88)] hover:text-white"
                              >
                                Full details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}