import type { Metadata } from "next";
import Link from "next/link";
import { whatsappUrl } from "../../data/store";
import { ProductCard } from "../../components/product-card";
import { fetchPublicProducts, toLegacyProducts } from "../../../lib/api";

export const metadata: Metadata = {
  title: "Bridal Collection",
  description:
    "Claireville's exclusive bridal collection — bespoke wedding gowns, bridal party attire, and custom-made pieces for your special day.",
  alternates: { canonical: "/shop/bridal" },
};

export default async function BridalPage() {
  const apiProducts = await fetchPublicProducts();
  const bridalProducts = toLegacyProducts(
    apiProducts.filter((p) => p.category === "Bespoke Couture" || p.category === "Ready-to-Wear"),
  );

  return (
    <div className="section-shell py-8 md:py-12">
      <section className="glass-surface rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Bridal</span>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">Bridal & Wedding Collection</h1>
            <p className="max-w-2xl text-muted">
              From bespoke wedding gowns to bridal party ensembles, every piece is crafted to make your
              special day unforgettable. Each design is a celebration of love, elegance, and individuality.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
            Book a bridal consultation
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {bridalProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </section>

      {bridalProducts.length === 0 && (
        <section className="mt-8 rounded-[2rem] border border-[color:var(--border)] bg-[rgba(10,18,39,0.3)] p-12 text-center">
          <p className="text-lg text-muted">No bridal products available at the moment. Check back soon.</p>
          <Link href="/shop" className="button-primary mt-4 inline-block px-6 py-2.5">Browse all products</Link>
        </section>
      )}

      <section className="mt-12 rounded-[2rem] border border-[color:var(--border)] bg-[rgba(10,18,39,0.3)] p-8 text-center">
        <span className="section-badge">Bespoke bridal</span>
        <h2 className="mt-4 text-2xl font-black md:text-3xl">Made for your dream day</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Book a private consultation with our master tailors to create a custom wedding piece that reflects
          your unique vision.
        </p>
        <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-primary mt-6 inline-block px-6 py-2.5">
          Schedule a consultation
        </Link>
      </section>
    </div>
  );
}
