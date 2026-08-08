"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product, formatCurrency } from "../data/store";
import { QuickViewModal } from "./quick-view-modal";
import { useCart } from "./cart-context";
import { ProductImage } from "./product-image";
import { GoldShimmerButton } from "./gold-shimmer-button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <>
      <article className="card-lift group relative overflow-hidden rounded-[1.9rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/78 p-3.5 shadow-[0_18px_48px_rgba(var(--ink-rgb),0.06)] transition-transform duration-500 hover:-translate-y-2">
        <div className="relative">
          <Link href={`/products/${product.slug}`} className="block">
            <div className="grid-pattern relative overflow-hidden rounded-[1.4rem] p-2.5">
            <ProductImage
              src={product.image}
              alt={product.name}
              width={560}
              height={560}
              className="h-[20rem] w-full rounded-[1.05rem] object-cover transition duration-700 ease-out group-hover:scale-[1.08]"
            />
              <div className="pointer-events-none absolute inset-2.5 rounded-[1.05rem] bg-[linear-gradient(180deg,rgba(17,17,17,0.02)_0%,rgba(17,17,17,0.12)_100%)] opacity-80" />
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsFavorited((current) => !current)}
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.18)] bg-white/75 text-[color:var(--gold)] shadow-[0_12px_30px_rgba(var(--ink-rgb),0.08)] backdrop-blur-md transition-all duration-300 ${isFavorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <svg className={`h-5 w-5 transition-transform duration-300 ${isFavorited ? "scale-110" : ""}`} viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
            </svg>
          </button>

          <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,76,0.18)] bg-white/75 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)] backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            Premium
          </div>
        </div>

        <div className="mt-4 space-y-3.5 px-1 pb-1 transition-transform duration-500 group-hover:-translate-y-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--gold)]">
                {product.category}
              </p>
              <h2 className="font-display mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-[color:var(--rich-black)]">
                {product.name}
              </h2>
            </div>
            <p className="rounded-full bg-[rgba(201,168,76,0.10)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
              {product.badge}
            </p>
          </div>

          <p className="text-sm leading-7 text-muted">{product.description}</p>

          <div className="flex items-end justify-between gap-3 border-t border-[rgba(var(--ink-rgb),0.06)] pt-3">
            <p className="font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-[color:var(--gold)]">
              {formatCurrency(product.price)}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              {product.rating} stars · {product.reviews} reviews
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowQuickView(true)}
              className="button-secondary px-4 py-2 text-sm transition-all duration-300 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
            >
              Details
            </button>
            <GoldShimmerButton
              onClick={() => addToCart(product)}
              className="button-primary px-4 py-2 text-sm"
            >
              Add to cart
            </GoldShimmerButton>
          </div>
        </div>
      </article>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}