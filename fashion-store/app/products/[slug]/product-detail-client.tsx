"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { type Product, formatCurrency, whatsappUrl } from "../../data/store";
import { useCart } from "../../components/cart-context";
import { ProductImage } from "../../components/product-image";
import { fetchProductsByCategory, toLegacyProducts } from "../../../lib/api";
import { GoldShimmerButton } from "../../components/gold-shimmer-button";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProductsByCategory(product.category)
      .then((apiProducts) => {
        const legacy = toLegacyProducts(apiProducts) as unknown as Product[];
        setRelatedProducts(legacy.filter((p) => p.slug !== product.slug).slice(0, 3));
      })
      .catch(() => {
        // No fallback needed
      });
  }, [product.category, product.slug]);

  return (
    <div className="section-shell py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-surface overflow-hidden rounded-[2rem] p-5">
            <div className="grid-pattern rounded-[1.5rem] p-4">
              <ProductImage
                src={product.image}
                alt={product.name}
                width={900}
                height={900}
                className="h-auto w-full rounded-[1.25rem] object-cover"
                priority
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id || item.slug}
                  href={`/products/${item.slug}`}
                  className="card-gold-hover rounded-3xl border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-3"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    width={240}
                    height={240}
                    className="h-36 w-full rounded-2xl object-cover"
                  />
                <p className="mt-3 text-sm font-bold text-[color:var(--rich-black)]">{item.name}</p>
                <p className="text-xs text-muted">{formatCurrency(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="glass-surface rounded-[2rem] p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
            {product.category}
          </p>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)]">{product.name}</h1>
              <p className="mt-2 text-muted">{product.description}</p>
            </div>
            <p className="text-3xl font-black text-[color:var(--gold)]">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
            <div>
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Colors</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      selectedColor === color
                        ? "bg-[color:var(--gold)] text-white"
                        : "border border-[rgba(var(--ink-rgb),0.08)] bg-white text-muted"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Sizes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      selectedSize === size
                        ? "bg-[color:var(--gold)] text-white"
                        : "border border-[rgba(var(--ink-rgb),0.08)] bg-white text-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Quantity</p>
              <div className="mt-2 flex w-fit items-center rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full px-3 py-1 text-lg font-black text-muted"
                >
                  -
                </button>
                <span className="min-w-10 px-3 text-center font-black text-[color:var(--rich-black)]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full px-3 py-1 text-lg font-black text-muted"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Product details</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {product.details.map((detail) => (
                  <li key={detail}>• {detail}</li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <GoldShimmerButton
                onClick={() => addToCart(product, quantity)}
                className="button-primary w-full"
              >
                Add to cart
              </GoldShimmerButton>
              <Link href="/checkout" className="button-secondary w-full">
                Checkout now
              </Link>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary w-full">
              Ask on WhatsApp about {selectedColor} / {selectedSize}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}