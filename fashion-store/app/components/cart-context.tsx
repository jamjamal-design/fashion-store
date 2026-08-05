"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { type Product, formatCurrency } from "../data/store";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  subtotalLabel: string;
  isHydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: (options?: { silent?: boolean }) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "luma-atelier-cart";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
}

function cartTotals(items: CartItem[]) {
  const count = items.reduce((total, entry) => total + entry.quantity, 0);
  const subtotal = items.reduce(
    (total, entry) => total + entry.product.price * entry.quantity,
    0,
  );

  return { count, subtotalLabel: formatCurrency(subtotal) };
}

// Luxury cart toast: a bold headline plus a live "N items • Total: …" summary
// so every cart change surfaces the current count and value.
function notifyCart(headline: string, items: CartItem[]) {
  const { count, subtotalLabel } = cartTotals(items);
  const itemLabel = count === 1 ? "item" : "items";

  toast.success(
    <div className="cart-toast">
      <p className="cart-toast__title">{headline}</p>
      <p className="cart-toast__meta">
        {count} {itemLabel} • Total: {subtotalLabel}
      </p>
    </div>,
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const isHydratedRef = useRef(false);
  // Always-current snapshot of items so mutations can compute the next cart
  // (and its toast totals) without relying on stale closure state.
  const itemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const stored = readStoredCart();
      itemsRef.current = stored;
      setItems(stored);
      isHydratedRef.current = true;
      setIsHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!isHydratedRef.current || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, entry) => total + entry.quantity, 0);
    const subtotal = items.reduce(
      (total, entry) => total + entry.product.price * entry.quantity,
      0,
    );

    return {
      items,
      itemCount,
      subtotal,
      subtotalLabel: formatCurrency(subtotal),
      isHydrated,
      addToCart(product, quantity = 1) {
        const current = itemsRef.current;
        const existing = current.find((entry) => entry.product.id === product.id);
        const next = existing
          ? current.map((entry) =>
              entry.product.id === product.id
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            )
          : [...current, { product, quantity }];

        itemsRef.current = next;
        setItems(next);
        notifyCart(`${product.name} added to cart.`, next);
      },
      updateQuantity(productId, quantity) {
        const next = itemsRef.current
          .map((entry) =>
            entry.product.id === productId ? { ...entry, quantity } : entry,
          )
          .filter((entry) => entry.quantity > 0);

        itemsRef.current = next;
        setItems(next);
        notifyCart("Cart updated.", next);
      },
      removeFromCart(productId) {
        const current = itemsRef.current;
        const removed = current.find((entry) => entry.product.id === productId);
        const next = current.filter((entry) => entry.product.id !== productId);

        itemsRef.current = next;
        setItems(next);

        if (removed) {
          notifyCart(`${removed.product.name} removed from cart.`, next);
        }
      },
      clearCart(options) {
        itemsRef.current = [];
        setItems([]);

        if (!options?.silent) {
          toast.info("Your cart is now empty.");
        }
      },
    };
  }, [items, isHydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}