"use client";

import { useEffect, useRef, useState } from "react";
import { type Product, formatCurrency, whatsappUrl } from "../data/store";
import { useCart } from "./cart-context";
import { ProductImage } from "./product-image";
import { GoldShimmerButton } from "./gold-shimmer-button";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  // Escape to close, body-scroll lock, focus management + focus trap
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Trap Tab focus inside the dialog
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    // Move focus into the dialog for keyboard users
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      // Restore focus to the trigger element
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(var(--scrim-rgb),0.85)] backdrop-blur-sm p-3 sm:p-4 md:p-6"
      style={{ animation: "fadeIn 0.2s ease both" }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        tabIndex={-1}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto overscroll-contain rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[var(--background)] shadow-[0_40px_100px_rgba(var(--ink-rgb),0.10)] focus:outline-none sm:max-h-[90vh]"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-[var(--surface)] text-[color:var(--rich-black)] backdrop-blur-sm transition hover:bg-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.20)] sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/11] overflow-hidden rounded-t-2xl sm:aspect-[4/3] md:aspect-[4/5] md:rounded-l-2xl md:rounded-tr-none">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              wrapperClassName="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--scrim-rgb),0.6)] to-transparent" />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-[color:var(--gold)] px-3.5 py-1 text-xs font-extrabold text-white shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Full details panel */}
          <div className="flex flex-col p-5 sm:p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--gold)]">
              {product.category}
            </p>
            <h2 id="quick-view-title" className="mt-2 text-2xl font-black text-[color:var(--rich-black)] md:text-3xl">
              {product.name}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">{product.description}</p>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? "text-[color:var(--gold)]" : "text-[rgba(var(--ink-rgb),0.10)]"}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="mt-5 text-3xl font-black text-[color:var(--gold)]">
              {formatCurrency(product.price)}
            </p>

            {/* Details list */}
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 shrink-0 text-[color:var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>

            {/* Color selector */}
            <div className="mt-5">
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Color: <span className="text-muted font-normal">{selectedColor}</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      selectedColor === color
                        ? "bg-[color:var(--gold)] text-white"
                        : "border border-[rgba(var(--ink-rgb),0.10)] text-muted hover:border-[rgba(201,168,76,0.25)]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-4">
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Size: <span className="text-muted font-normal">{selectedSize}</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      selectedSize === size
                        ? "bg-[color:var(--gold)] text-white"
                        : "border border-[rgba(var(--ink-rgb),0.10)] text-muted hover:border-[rgba(201,168,76,0.25)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-5">
              <p className="text-sm font-bold text-[color:var(--rich-black)]">Quantity</p>
              <div className="mt-2 flex w-fit items-center rounded-full border border-[rgba(var(--ink-rgb),0.08)] bg-[var(--surface)] px-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-muted transition hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
                </button>
                <span className="flex h-8 w-10 items-center justify-center text-sm font-black text-[color:var(--rich-black)]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-muted transition hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <GoldShimmerButton
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                className="button-primary flex-1 px-6 py-2.5 text-sm"
              >
                Add to cart — {formatCurrency(product.price * quantity)}
              </GoldShimmerButton>
            </div>
            <a
              href={`${whatsappUrl}&text=${encodeURIComponent(`Hi Claireville, I'm interested in ${product.name} (${selectedColor}, ${selectedSize})`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(201,168,76,0.15)] px-6 py-2.5 text-sm font-bold text-[color:var(--gold)] transition hover:bg-[rgba(201,168,76,0.06)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ask on WhatsApp about {selectedColor} / {selectedSize}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}