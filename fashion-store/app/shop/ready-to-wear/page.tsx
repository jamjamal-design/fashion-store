import type { Metadata } from "next";
import Link from "next/link";
import { whatsappUrl } from "../../data/store";
import { ProductCard } from "../../components/product-card";
import { fetchProductsByCategory, toLegacyProducts } from "../../../lib/api";

export const metadata: Metadata = {
  title: "Ready-to-Wear Collection",
  description:
    "Claireville's ready-to-wear collection — curated luxury pieces designed for effortless elegance, off the rack. Shop premium fashion online.",
  alternates: { canonical: "/shop/ready-to-wear" },
};

export default async function ReadyToWearPage() {
  const apiProducts = await fetchProductsByCategory("Ready-to-Wear");
  const collectionProducts = toLegacyProducts(apiProducts);

  return (
    <div className="section-shell py-8 md:py-12">
      <section className="glass-surface rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Ready-to-Wear</span>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Ready-to-Wear</h1>
            <p className="max-w-2xl text-muted">
              Curated luxury pieces designed for effortless elegance, off the rack. Each piece is thoughtfully selected for quality and timeless style.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
            Style consultation
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {collectionProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </section>

      {collectionProducts.length === 0 && (
        <section className="mt-8 rounded-[2rem] border border-[color:var(--border)] bg-[rgba(10,18,39,0.3)] p-12 text-center">
          <p className="text-lg text-muted">No products available at the moment. Check back soon.</p>
          <Link href="/shop" className="button-primary mt-4 inline-block px-6 py-2.5">Browse all products</Link>
        </section>
      )}
    </div>
  );
}
