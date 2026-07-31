"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product, currencyFormatter } from "../data/store";
import { QuickViewModal } from "./quick-view-modal";
import { ProductImage } from "./product-image";
import { BreakingGlassButton } from "./breaking-glass-button";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-white/30" />
        <div className="section-shell py-16 md:py-24">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="section-badge">Featured</span>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Most <span className="text-[color:var(--gold)]">loved pieces</span>
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              Our best-selling styles, handpicked for those who appreciate timeless quality.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="card-gold-hover group relative overflow-hidden rounded-2xl border border-[rgba(var(--ink-rgb),0.06)] bg-white/80 hover:-translate-y-2"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      wrapperClassName="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--scrim-rgb),0.75)] via-[rgba(var(--scrim-rgb),0.20)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {product.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-[color:var(--gold)] px-3.5 py-1 text-xs font-extrabold text-white shadow-lg">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </Link>
                {/* Quick view button — triggers modal */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 z-10">
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(product)}
                    className="block w-full rounded-full bg-white/90 py-3 text-center text-sm font-bold text-[color:var(--rich-black)] backdrop-blur-sm transition hover:bg-[rgba(201,168,76,0.08)]"
                  >
                    Quick view
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[color:var(--gold)]">
                    {product.category}
                  </p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1.5 font-bold text-[color:var(--rich-black)] transition-colors hover:text-[color:var(--gold)]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-black text-[color:var(--gold)]">
                      {currencyFormatter.format(product.price)}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <svg className="h-3.5 w-3.5 text-[color:var(--gold)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <BreakingGlassButton href="/shop" className="button-primary px-10 py-3.5 text-base">
              View all styles
            </BreakingGlassButton>
          </div>
        </div>
      </section>

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