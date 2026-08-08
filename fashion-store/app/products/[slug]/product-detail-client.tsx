"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { type Product, formatCurrency, whatsappUrl } from "../../data/store";
import { useCart } from "../../components/cart-context";
import { ProductImage } from "../../components/product-image";
import { fetchProductsByCategory, toLegacyProducts } from "../../../lib/api";
import { GoldShimmerButton } from "../../components/gold-shimmer-button";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const galleryFrames = [
  { label: "Editorial front", position: "center 22%" },
  { label: "Fabric detail", position: "center 38%" },
  { label: "Silhouette crop", position: "center 52%" },
];

const trustSignals = [
  { label: "Secure checkout", detail: "Verified payment and order tracking guidance." },
  { label: "Styling support", detail: "Quick WhatsApp help for sizing and fabric questions." },
  { label: "Luxury finishing", detail: "Made to feel polished from first view to delivery." },
];

const reviewNotes = [
  "The silhouette reads elegant and tailored.",
  "The fabric feels premium and photographs beautifully.",
  "Customers love the responsive fit guidance and support.",
];

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedFrame, setSelectedFrame] = useState(galleryFrames[0]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProductsByCategory(product.category)
      .then((apiProducts) => {
        const legacy = toLegacyProducts(apiProducts) as unknown as Product[];
        setRelatedProducts(legacy.filter((item) => item.slug !== product.slug).slice(0, 3));
      })
      .catch(() => {
        setRelatedProducts([]);
      });
  }, [product.category, product.slug]);

  const selectedGalleryFrame = useMemo(() => selectedFrame, [selectedFrame]);

  return (
    <div className="section-shell py-8 md:py-12">
      <motion.div
        className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-surface overflow-hidden rounded-[2rem] p-4 md:p-5">
            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(var(--ink-rgb),0.06)] bg-[rgba(var(--scrim-rgb),0.08)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedGalleryFrame.label}
                    className="relative aspect-[4/5]"
                    initial={{ opacity: 0, scale: 1.015 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-cover transition-transform duration-700"
                      style={{ objectPosition: selectedGalleryFrame.position }}
                      wrapperClassName="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--scrim-rgb),0.65)] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,168,76,0.14),transparent_42%,rgba(255,255,255,0.05))]" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">Luxury product details</p>
                        <h1 className="max-w-xl text-3xl font-black tracking-tight text-white md:text-5xl">
                          {product.name}
                        </h1>
                      </div>
                      <p className="text-3xl font-black text-[color:var(--gold)] md:text-4xl">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[color:var(--gold)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_10px_25px_rgba(201,168,76,0.28)]">
                    {product.badge}
                  </span>
                  <span className="rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(var(--scrim-rgb),0.45)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    Made to order
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {galleryFrames.map((frame) => {
                  const active = frame.label === selectedGalleryFrame.label;
                  return (
                    <motion.button
                      key={frame.label}
                      type="button"
                      onClick={() => setSelectedFrame(frame)}
                      whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      className={`rounded-[1.25rem] border p-3 text-left transition ${
                        active
                          ? "border-[rgba(201,168,76,0.30)] bg-[rgba(201,168,76,0.08)]"
                          : "border-[rgba(var(--ink-rgb),0.06)] bg-white/70 hover:border-[rgba(201,168,76,0.18)]"
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-[rgba(var(--scrim-rgb),0.08)]">
                        <ProductImage
                          src={product.image}
                          alt={`${product.name} ${frame.label}`}
                          fill
                          sizes="120px"
                          className="object-cover"
                          style={{ objectPosition: frame.position }}
                          wrapperClassName="absolute inset-0"
                        />
                      </div>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                        {frame.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <div key={signal.label} className="rounded-[1rem] bg-[rgba(201,168,76,0.04)] p-4">
                    <p className="text-sm font-bold text-[color:var(--rich-black)]">{signal.label}</p>
                    <p className="mt-1 text-xs leading-6 text-muted">{signal.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside variants={itemVariants} className="space-y-6">
          <section className="glass-surface rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--gold)]">
                  {product.category}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">{product.description}</p>
              </div>
              <div className="rounded-full border border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.05)] px-4 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Price</p>
                <p className="text-lg font-black text-[color:var(--rich-black)]">{formatCurrency(product.price)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/80 p-4">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[color:var(--rich-black)]">Color</p>
                  <span className="text-xs font-semibold text-muted">{selectedColor}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <motion.button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-[color:var(--gold)] text-white shadow-[0_12px_22px_rgba(201,168,76,0.22)]"
                            : "border border-[rgba(var(--ink-rgb),0.08)] bg-white text-muted hover:border-[rgba(201,168,76,0.24)] hover:text-[color:var(--rich-black)]"
                        }`}
                      >
                        {color}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[color:var(--rich-black)]">Size</p>
                  <span className="text-xs font-semibold text-muted">Selected {selectedSize}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <motion.button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.01 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                        className={`rounded-[1rem] border px-3 py-2 text-sm font-bold transition ${
                          active
                            ? "border-[rgba(201,168,76,0.24)] bg-[rgba(201,168,76,0.10)] text-[color:var(--gold)]"
                            : "border-[rgba(var(--ink-rgb),0.08)] bg-white text-muted hover:border-[rgba(201,168,76,0.18)] hover:text-[color:var(--rich-black)]"
                        }`}
                      >
                        {size}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-[color:var(--rich-black)]">Quantity</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-white px-2 py-1 shadow-[0_10px_24px_rgba(var(--ink-rgb),0.05)]">
                  <motion.button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-muted transition hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                  >
                    -
                  </motion.button>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={quantity}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                      className="min-w-14 px-4 text-center text-lg font-black text-[color:var(--rich-black)]"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                  <motion.button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-muted transition hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <GoldShimmerButton
                onClick={() => addToCart(product, quantity)}
                className="button-primary w-full px-6 py-3 text-sm"
              >
                Add to cart • {formatCurrency(product.price * quantity)}
              </GoldShimmerButton>
              <Link href="/checkout" className="button-secondary w-full px-6 py-3 text-sm">
                Checkout now
              </Link>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary mt-3 w-full px-6 py-3 text-sm">
              Ask on WhatsApp about {selectedColor} / {selectedSize}
            </a>
          </section>

          <section className="glass-surface rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Reviews</p>
                <h2 className="mt-2 text-2xl font-black text-[color:var(--rich-black)]">Loved for fit, finish, and support</h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[color:var(--gold)]">{product.rating.toFixed(1)}</p>
                <p className="text-xs text-muted">{product.reviews} verified reviews</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-4">
                <p className="text-sm font-bold text-[color:var(--rich-black)]">Rating breakdown</p>
                <div className="mt-3 space-y-2.5">
                  {["5-star fit", "Fabric quality", "Delivery care"].map((label, index) => (
                    <div key={label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted">
                        <span>{label}</span>
                        <span>{100 - index * 6}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[rgba(var(--ink-rgb),0.06)]">
                        <motion.div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#C9A84C,#D4AF37)]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${100 - index * 6}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-4">
                <p className="text-sm font-bold text-[color:var(--rich-black)]">What customers mention</p>
                <div className="mt-3 grid gap-3">
                  {reviewNotes.map((note) => (
                    <div key={note} className="rounded-[1rem] border border-[rgba(201,168,76,0.10)] bg-[rgba(201,168,76,0.04)] p-3 text-sm leading-6 text-muted">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Product details</p>
            <ul className="mt-4 grid gap-3 text-sm text-muted">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3 rounded-[1rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-4">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--gold)]" aria-hidden="true" />
                  <span className="leading-7">{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          {relatedProducts.length > 0 && (
            <section className="glass-surface rounded-[2rem] p-6 md:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Complete the look</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id || item.slug}
                    href={`/products/${item.slug}`}
                    className="card-gold-hover rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-3"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      width={260}
                      height={300}
                      className="h-44 w-full rounded-[1rem] object-cover"
                    />
                    <p className="mt-3 text-sm font-bold text-[color:var(--rich-black)]">{item.name}</p>
                    <p className="text-xs text-muted">{formatCurrency(item.price)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </motion.aside>
      </motion.div>
    </div>
  );
}