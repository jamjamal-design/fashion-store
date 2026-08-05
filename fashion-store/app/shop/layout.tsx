import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description:
    "Explore the full Claireville catalogue — bespoke couture, ready-to-wear, men's and kids' collections, real coral beads, and luxury accessories.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All Collections | Claireville",
    description:
      "Explore the full Claireville catalogue of luxury fashion and accessories.",
    url: "/shop",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
