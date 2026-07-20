"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const isHydratedRef = useRef(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setItems(readStoredCart());
      isHydratedRef.current = true;
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
      addToCart(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((entry) => entry.product.id === product.id);

          if (existing) {
            return current.map((entry) =>
              entry.product.id === product.id
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            );
          }

          return [...current, { product, quantity }];
        });
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current
            .map((entry) =>
              entry.product.id === productId ? { ...entry, quantity } : entry,
            )
            .filter((entry) => entry.quantity > 0),
        );
      },
      removeFromCart(productId) {
        setItems((current) => current.filter((entry) => entry.product.id !== productId));
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}