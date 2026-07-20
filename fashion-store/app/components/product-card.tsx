"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product, formatCurrency } from "../data/store";
import { QuickViewModal } from "./quick-view-modal";
import { useCart } from "./cart-context";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  return (
    <>
      <article className="glass-surface group overflow-hidden rounded-[1.75rem] p-4 transition hover:-translate-y-1">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="grid-pattern rounded-[1.25rem] p-3">
            <ProductImage
              src={product.image}
              alt={product.name}
              width={560}
              height={560}
              className="h-72 w-full rounded-[1rem] object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                {product.category}
              </p>
              <h2 className="mt-1 text-xl font-black">{product.name}</h2>
            </div>
            <p className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-black uppercase text-[color:var(--accent-strong)]">
              {product.badge}
            </p>
          </div>

          <p className="text-sm leading-7 text-muted">{product.description}</p>

          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-black text-[color:var(--accent-strong)]">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm font-semibold text-muted">
              {product.rating} stars · {product.reviews} reviews
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowQuickView(true)}
              className="button-secondary px-4 py-2 text-sm"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="button-primary px-4 py-2 text-sm"
            >
              Add to cart
            </button>
          </div>
        </div>
      </article>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}