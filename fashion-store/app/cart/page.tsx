"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../components/cart-context";
import { formatCurrency } from "../data/store";

export default function CartPage() {
  const { items, subtotal, subtotalLabel, updateQuantity, removeFromCart, clearCart } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const shipping = subtotal > 0 ? 18 : 0;
  const total = subtotal + shipping;
  const isEmpty = items.length === 0;

  return (
    <div className="section-shell py-8 md:py-12">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
        className="space-y-4"
      >
        <span className="section-badge">Cart</span>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Review your order</h1>
        <p className="max-w-2xl text-muted">
          Update quantities, remove products, and check the subtotal before moving to checkout.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="glass-surface rounded-[2rem] p-5 md:p-6">
          {items.length === 0 ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[1.5rem] border border-dashed border-[rgba(var(--ink-rgb),0.08)] bg-white/70 p-8 text-center"
            >
              <p className="text-lg font-bold text-[color:var(--rich-black)]">Your cart is empty.</p>
              <p className="mt-2 text-sm text-muted">Browse the shop and add products to continue.</p>
              <Link href="/shop" className="button-primary mt-5">
                Shop products
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <motion.article
                    key={product.id}
                    layout
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                    className="grid gap-4 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 md:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="relative overflow-hidden rounded-[1rem]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={280}
                        height={280}
                        className="h-28 w-full rounded-[1rem] object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                        {product.category}
                      </p>
                      <h2 className="mt-1 text-lg font-black text-[color:var(--rich-black)]">{product.name}</h2>
                      <p className="mt-2 text-sm text-muted">{product.description}</p>
                      <p className="mt-3 text-sm font-bold text-[color:var(--gold)]">
                        {formatCurrency(product.price)} each
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-3">
                      <div className="flex items-center rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-white px-2 py-1 shadow-[0_10px_20px_rgba(var(--ink-rgb),0.05)]">
                        <motion.button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
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
                            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                            className="min-w-12 px-3 text-center text-lg font-black text-[color:var(--rich-black)]"
                          >
                            {quantity}
                          </motion.span>
                        </AnimatePresence>
                        <motion.button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-muted transition hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                        >
                          +
                        </motion.button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-sm font-semibold text-[color:var(--gold)] transition hover:opacity-80"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        <motion.aside
          initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: 0.08 }}
          className="space-y-4"
        >
          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Order summary</h2>
            <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <motion.span key={subtotal} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="font-bold text-[color:var(--rich-black)]">
                  {subtotalLabel}
                </motion.span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-bold text-[color:var(--rich-black)]">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(var(--ink-rgb),0.06)] pt-3">
                <span className="font-black text-[color:var(--rich-black)]">Total</span>
                <motion.span key={total} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="text-lg font-black text-[color:var(--gold)]">
                  {formatCurrency(total)}
                </motion.span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {isEmpty ? (
                <button
                  type="button"
                  onClick={() => toast.info("Your cart is empty. Please add products before checking out.")}
                  className="button-primary w-full cursor-not-allowed opacity-50"
                  aria-disabled="true"
                >
                  Proceed to checkout
                </button>
              ) : (
                <Link href="/checkout" className="button-primary w-full">
                  Proceed to checkout
                </Link>
              )}
              <button
                type="button"
                onClick={() => clearCart()}
                disabled={isEmpty}
                className="button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear cart
              </button>
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Trust indicators</p>
            <div className="mt-4 grid gap-3">
              {[
                "Secure payment handoff",
                "Fast order support over WhatsApp",
                "Luxury checkout and delivery flow",
              ].map((item) => (
                <div key={item} className="rounded-[1.2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-4 text-sm text-muted">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </motion.aside>
      </div>
    </div>
  );
}