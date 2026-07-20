"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product, currencyFormatter } from "../data/store";
import { QuickViewModal } from "./quick-view-modal";
import { ProductImage } from "./product-image";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[rgba(8,16,32,0.3)]" />
        <div className="section-shell py-16 md:py-24">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="section-badge">Featured</span>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Most <span className="text-[color:var(--accent-strong)]">loved pieces</span>
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              Our best-selling styles, handpicked for those who appreciate timeless quality.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.5)] transition-all duration-500 hover:-translate-y-2 hover:border-[rgba(212,160,23,0.3)] hover:shadow-[0_24px_60px_rgba(4,10,24,0.4)]"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,16,32,0.9)] via-[rgba(8,16,32,0.2)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {product.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-[color:var(--accent-strong)] px-3.5 py-1 text-xs font-extrabold text-[#0a0a0a] shadow-lg">
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
                    className="block w-full rounded-full bg-[rgba(8,16,32,0.9)] py-3 text-center text-sm font-bold text-white backdrop-blur-sm transition hover:bg-[rgba(212,160,23,0.2)]"
                  >
                    Quick view
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[color:var(--accent-strong)]">
                    {product.category}
                  </p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1.5 font-bold text-white transition-colors hover:text-[color:var(--accent-strong)]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-black text-[color:var(--accent-strong)]">
                      {currencyFormatter.format(product.price)}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <svg className="h-3.5 w-3.5 text-[color:var(--accent-strong)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/shop" className="button-primary px-10 py-3.5 text-base">
              View all styles
            </Link>
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