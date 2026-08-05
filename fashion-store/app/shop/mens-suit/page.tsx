import type { Metadata } from "next";
import { JsonLd } from "@/app/components/json-ld";
import { collectionMetadata, collectionBreadcrumb } from "@/lib/seo";
import Link from "next/link";
import { whatsappUrl } from "../../data/store";
import { ProductCard } from "../../components/product-card";
import { fetchPublicProducts, toLegacyProducts } from "../../../lib/api";

export const metadata: Metadata = collectionMetadata(
  "Men's Suit Collection",
  "Claireville's men's suit collection — bespoke tailoring, premium fabrics, and sharp silhouettes for the modern gentleman.",
  "/shop/mens-suit",
);

export default async function MensSuitPage() {
  const apiProducts = await fetchPublicProducts();
  const mensProducts = toLegacyProducts(
    apiProducts.filter((p) => p.category === "Men's Collection" || p.category === "Bespoke Couture"),
  );

  return (
    <div className="section-shell py-8 md:py-12">
      <JsonLd data={collectionBreadcrumb("Men's Suit", "/shop/mens-suit")} />
      <section className="glass-surface no-hover rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Men&apos;s Suit</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Men&apos;s Suit & Tailoring</h1>
            <p className="max-w-2xl text-muted">
              Refined tailoring and contemporary sophistication for the modern gentleman. From bespoke suits
              to sharp blazers, every piece is crafted with precision and premium fabrics.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">Book a fitting</Link>
        </div>
      </section>
      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {mensProducts.map((product) => <ProductCard key={product.id || product._id} product={product} />)}
      </section>
      {mensProducts.length === 0 && (
        <section className="mt-8 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-12 text-center">
          <p className="text-lg text-muted">No men&apos;s products available at the moment. Check back soon.</p>
          <Link href="/shop" className="button-primary mt-4 inline-block px-6 py-2.5">Browse all products</Link>
        </section>
      )}
      <section className="mt-12 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-8 text-center">
        <span className="section-badge">Bespoke tailoring</span>
        <h2 className="mt-4 text-2xl font-black md:text-3xl">Precision crafted for you</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Book a private consultation for a fully bespoke suit experience — from fabric selection to the final fitting.
        </p>
        <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-primary mt-6 inline-block px-6 py-2.5">Schedule a consultation</Link>
      </section>
    </div>
  );
}
