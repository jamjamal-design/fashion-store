import type { Metadata } from "next";

// Transactional page — no SEO value and should never appear in search results.
export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your Claireville shopping cart.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/cart",
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
