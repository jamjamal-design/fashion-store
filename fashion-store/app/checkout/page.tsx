"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { bankDetails, formatCurrency, whatsappUrl } from "../data/store";
import { useCart } from "../components/cart-context";
import { generateOrderReference, isValidOrderReference, loadMeasurements, type SavedMeasurements } from "../../lib/measurements";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, subtotalLabel, clearCart, isHydrated } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [receiptName, setReceiptName] = useState("No receipt uploaded");
  const [submitted, setSubmitted] = useState(false);
  const [savedMeasurements, setSavedMeasurements] = useState<SavedMeasurements | null>(null);

  const shipping = subtotal > 0 ? 18 : 0;
  const total = subtotal + shipping;

  // Guard: block direct access to checkout with an empty cart. Wait for the
  // cart to hydrate from localStorage first so a real cart isn't flagged as
  // empty on first paint. Skip the redirect right after a successful order
  // (clearCart empties the cart on submit).
  useEffect(() => {
    if (!isHydrated || submitted) {
      return;
    }

    if (items.length === 0) {
      toast.info("Your cart is empty. Please add products before checking out.");
      router.replace("/shop");
    }
  }, [isHydrated, submitted, items.length, router]);

  // Load saved measurements so they're available during checkout
  useEffect(() => {
    const measurements = loadMeasurements();
    if (measurements) {
      setSavedMeasurements(measurements);
    }
  }, []);

  // Auto-generate a unique order reference (CV-XXXX) on first load
  useEffect(() => {
    if (!isHydrated || orderReference) {
      return;
    }
    // Only auto-generate once per checkout session
    const existing = orderReference;
    if (!existing) {
      setOrderReference(generateOrderReference());
    }
  }, [isHydrated, orderReference]);

  const summaryItems = useMemo(() => items, [items]);
  const orderSummaryText = summaryItems.length
    ? summaryItems
        .map(
          ({ product, quantity }) =>
            `${product.name} x${quantity} (${formatCurrency(product.price * quantity)})`,
        )
        .join("\n")
    : "No products in cart";

  // Build the measurements text block for the WhatsApp message
  const measurementsText = useMemo(() => {
    if (!savedMeasurements) {
      return "";
    }

    const typeLabel = savedMeasurements.type === "men" ? "Men's" : "Women's";
    const valuesLines = Object.entries(savedMeasurements.values)
      .filter(([, value]) => value && value.trim() !== "")
      .map(([field, value]) => `  ${field}: ${value} in`)
      .join("\n");

    const photoLines = savedMeasurements.photos.length
      ? savedMeasurements.photos.map((p) => `  ${p.name} (${p.size} bytes)`).join("\n")
      : "  None";

    return [
      `${typeLabel} Measurements:`,
      valuesLines || "  Not provided",
      "",
      "Measurement reference photos:",
      photoLines,
    ].join("\n");
  }, [savedMeasurements]);

  const orderMessage = useMemo(() => {
    const lines = [
      "Hello Claireville, I am sending my order details and payment proof.",
      `Customer name: ${customerName || "Not provided"}`,
      `Phone number: ${phoneNumber || "Not provided"}`,
      `Email: ${emailAddress || "Not provided"}`,
      `Order reference: ${orderReference || "Not provided"}`,
      `Delivery address: ${deliveryAddress || "Not provided"}`,
      "Products ordered:",
      orderSummaryText,
      `Subtotal: ${subtotalLabel}`,
      `Shipping: ${formatCurrency(shipping)}`,
      `Total amount: ${formatCurrency(total)}`,
      `Payment proof file: ${receiptName}`,
    ];

    if (measurementsText) {
      lines.push("", measurementsText);
    }

    return lines.join("\n");
  }, [
    customerName,
    deliveryAddress,
    emailAddress,
    measurementsText,
    orderReference,
    orderSummaryText,
    phoneNumber,
    receiptName,
    shipping,
    subtotalLabel,
    total,
  ]);
  const whatsappOrderUrl = useMemo(() => {
    return `https://wa.me/${whatsappUrl.match(/wa\.me\/(\d+)/)?.[1] ?? "2348059000500"}?text=${encodeURIComponent(orderMessage)}`;
  }, [orderMessage]);

  function handleReceiptChange(event: ChangeEvent<HTMLInputElement>) {
    setReceiptName(event.target.files?.[0]?.name ?? "No receipt uploaded");
  }

  function handleReferenceChange(event: ChangeEvent<HTMLInputElement>) {
    // Keep the reference read-only — always auto-generated
    // If user types, only accept CV-XXXX format
    const value = event.target.value.toUpperCase();
    if (value === "" || isValidOrderReference(value)) {
      setOrderReference(value);
    }
  }

  // While the cart hydrates, or when it is empty and about to redirect, show a
  // lightweight placeholder instead of flashing the full (empty) checkout form.
  if (!submitted && (!isHydrated || items.length === 0)) {
    return (
      <div className="section-shell no-hover flex min-h-[60vh] items-center justify-center py-12">
        <div className="glass-surface rounded-[2rem] p-10 text-center">
          <span className="section-badge">Checkout</span>
          <p className="mt-4 text-lg font-bold text-[color:var(--rich-black)]">
            {isHydrated ? "Your cart is empty." : "Preparing your checkout…"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {isHydrated
              ? "Redirecting you to the shop so you can add products."
              : "One moment while we load your order."}
          </p>
        </div>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty. Please add products before checking out.");
      return;
    }

    try {
      // Capture products before the cart is cleared so the "sold" toasts can
      // use the real product names.
      const orderedProducts = items.map(({ product }) => product);

      const opened = window.open(whatsappOrderUrl, "_blank", "noopener,noreferrer");
      if (!opened) {
        throw new Error("Unable to open WhatsApp window.");
      }

      setSubmitted(true);
      clearCart({ silent: true });
      toast.success("Order placed successfully.");

      // One "sold" toast per product, using the actual product name.
      orderedProducts.forEach((product) => {
        toast.success(`${product.name} sold.`);
      });
    } catch {
      toast.error("Unable to place your order.");
    }
  }

  return (
    <div className="section-shell no-hover py-8 md:py-12">
      <div className="space-y-4">
        <span className="section-badge">Checkout</span>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Place your order and upload payment proof</h1>
        <p className="max-w-2xl text-muted">
          Review the order summary, use the bank account details, then attach a receipt for verification.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="glass-surface rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Full name
              <input
                className="input-field"
                placeholder="Your name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Phone number
              <input
                className="input-field"
                placeholder="+1 555 000 000"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Email address
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                required
              />
            </label>
            <div className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              <span>Order reference</span>
              <input
                className="input-field bg-[rgba(201,168,76,0.08)] font-black tracking-wider text-[color:var(--gold)]"
                placeholder="CV-0000"
                value={orderReference}
                onChange={handleReferenceChange}
                readOnly
                aria-readonly="true"
                title="Auto-generated — unique for every order"
              />
              <span className="text-[11px] font-normal text-[color:var(--text-light)]">
                Auto-generated. Unique for every order.
              </span>
            </div>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
            Delivery address
            <textarea
              className="input-field min-h-28 resize-y"
              placeholder="Street, city, state, zip"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              required
            />
          </label>

          {/* Saved measurements summary */}
          {savedMeasurements && (
            <div className="mt-4 rounded-[1.5rem] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                  {savedMeasurements.type === "men" ? "Men's" : "Women's"} Measurements
                </p>
                <span className="rounded-full bg-[rgba(201,168,76,0.12)] px-2.5 py-0.5 text-[10px] font-bold text-[color:var(--gold)]">
                  Saved ✓
                </span>
              </div>
              <div className="mt-3 grid gap-1.5">
                {Object.entries(savedMeasurements.values)
                  .filter(([, value]) => value && value.trim() !== "")
                  .map(([field, value]) => (
                    <div key={field} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{field}</span>
                      <span className="font-bold text-[color:var(--rich-black)]">{value} in</span>
                    </div>
                  ))}
              </div>
              {savedMeasurements.photos.length > 0 && (
                <p className="mt-3 text-xs font-semibold text-[color:var(--text-light)]">
                  📷 {savedMeasurements.photos.length} reference photo{savedMeasurements.photos.length === 1 ? "" : "s"} attached
                </p>
              )}
            </div>
          )}

          <div className="mt-4 rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
              Payment receipt
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <input type="file" className="input-field py-3" onChange={handleReceiptChange} />
              <div className="text-sm text-muted">{receiptName}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="button-primary">
              Send to WhatsApp
            </button>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
              Need help on WhatsApp?
            </a>
          </div>

          {submitted ? (
            <p className="mt-4 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)] p-4 text-sm font-semibold text-[color:var(--gold)]">
              Message prepared with customer details, order reference {orderReference}, measurements, delivery address, products ordered, and total amount.
            </p>
          ) : null}
        </form>

        <aside className="space-y-6">
          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Order summary</h2>
            <div className="mt-4 space-y-3">
              {summaryItems.length === 0 ? (
                <div className="rounded-[1.25rem] border border-dashed border-[rgba(var(--ink-rgb),0.08)] bg-white/70 p-5 text-sm text-muted">
                  Your cart is empty. Add products from the shop or product page before checking out.
                </div>
              ) : (
                summaryItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4 text-sm"
                  >
                    <div>
                      <p className="font-bold text-[color:var(--rich-black)]">{product.name}</p>
                      <p className="text-muted">Qty {quantity}</p>
                    </div>
                    <p className="font-bold text-[color:var(--rich-black)]">{formatCurrency(product.price * quantity)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 grid gap-2 rounded-[1.25rem] bg-[rgba(201,168,76,0.06)] p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-bold text-[color:var(--rich-black)]">{subtotalLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-bold text-[color:var(--rich-black)]">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(var(--ink-rgb),0.06)] pt-3">
                <span className="font-black text-[color:var(--rich-black)]">Total</span>
                <span className="text-lg font-black text-[color:var(--gold)]">{formatCurrency(total)}</span>
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Order reference</h2>
            <div className="mt-4 rounded-[1.25rem] border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] p-5 text-center">
              <p className="text-3xl font-black tracking-[0.1em] text-[color:var(--gold)]">
                {orderReference || "CV-----"}
              </p>
              <p className="mt-2 text-xs text-muted">
                Use this reference when making payment
              </p>
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[color:var(--rich-black)]">Bank details</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
                <p className="text-muted">Bank</p>
                <p className="font-bold text-[color:var(--rich-black)]">{bankDetails.bankName}</p>
              </div>
              <div className="rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
                <p className="text-muted">Account name</p>
                <p className="font-bold text-[color:var(--rich-black)]">{bankDetails.accountName}</p>
              </div>
              <div className="rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4">
                <p className="text-muted">Account number</p>
                <p className="font-bold text-[color:var(--rich-black)]">{bankDetails.accountNumber}</p>
              </div>
              <p className="text-muted">{bankDetails.referenceHint}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}