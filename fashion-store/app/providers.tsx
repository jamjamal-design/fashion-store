"use client";

import { CartProvider } from "./components/cart-context";
import { ToastContainer } from "react-toastify";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2400}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        className="toast-theme"
      />
    </CartProvider>
  );
}