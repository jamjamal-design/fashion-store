import type { Metadata } from "next";

// Transactional page — no SEO value and should never appear in search results.
export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Claireville order.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
