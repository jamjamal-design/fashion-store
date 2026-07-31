"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { bankDetails, formatCurrency, whatsappUrl } from "../data/store";
import { useCart } from "../components/cart-context";

export default function CheckoutPage() {
  const { items, subtotal, subtotalLabel, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [receiptName, setReceiptName] = useState("No receipt uploaded");
  const [submitted, setSubmitted] = useState(false);

  const shipping = subtotal > 0 ? 18 : 0;
  const total = subtotal + shipping;

  const summaryItems = useMemo(() => items, [items]);
  const orderSummaryText = summaryItems.length
    ? summaryItems
        .map(
          ({ product, quantity }) =>
            `${product.name} x${quantity} (${formatCurrency(product.price * quantity)})`,
        )
        .join("\n")
    : "No products in cart";
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

    return lines.join("\n");
  }, [
    customerName,
    deliveryAddress,
    emailAddress,
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    clearCart();
    window.open(whatsappOrderUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="section-shell py-8 md:py-12">
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
            <label className="grid gap-2 text-sm font-semibold text-[color:var(--rich-black)]">
              Order reference
              <input
                className="input-field"
                placeholder="LM-24021"
                value={orderReference}
                onChange={(event) => setOrderReference(event.target.value)}
                required
              />
            </label>
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
              Message prepared with customer details, delivery address, products ordered, and total amount.
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