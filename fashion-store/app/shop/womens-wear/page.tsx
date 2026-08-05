import type { Metadata } from "next";
import { JsonLd } from "@/app/components/json-ld";
import { collectionMetadata, collectionBreadcrumb } from "@/lib/seo";
import Link from "next/link";
import { whatsappUrl } from "../../data/store";
import { ProductCard } from "../../components/product-card";
import { fetchPublicProducts, toLegacyProducts } from "../../../lib/api";

export const metadata: Metadata = collectionMetadata(
  "Women's Wear Collection",
  "Claireville's women's wear collection — elegant dresses, luxurious coats, and premium ready-to-wear pieces for the modern woman.",
  "/shop/womens-wear",
);

export default async function WomensWearPage() {
  const apiProducts = await fetchPublicProducts();
  const womensProducts = toLegacyProducts(
    apiProducts.filter((p) => p.category === "Ready-to-Wear" || p.category === "Luxury Accessories" || p.category === "Real Coral Beads"),
  );

  return (
    <div className="section-shell py-8 md:py-12">
      <JsonLd data={collectionBreadcrumb("Women's Wear", "/shop/womens-wear")} />
      <section className="glass-surface no-hover rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Women&apos;s Wear</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Women&apos;s Wear Collection</h1>
            <p className="max-w-2xl text-muted">
              Curated luxury pieces designed for effortless elegance — from flowing silk dresses and
              cashmere coats to stunning accessories that complete every look.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
            Style consultation
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {womensProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </section>

      {womensProducts.length === 0 && (
        <section className="mt-8 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-12 text-center">
          <p className="text-lg text-muted">No women&apos;s wear products available at the moment. Check back soon.</p>
          <Link href="/shop" className="button-primary mt-4 inline-block px-6 py-2.5">Browse all products</Link>
        </section>
      )}

      <section className="mt-12 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-8 text-center">
        <span className="section-badge">Personal styling</span>
        <h2 className="mt-4 text-2xl font-black md:text-3xl">Find your signature look</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Let our style consultants curate a personalized wardrobe selection tailored to your taste
          and occasion.
        </p>
        <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-primary mt-6 inline-block px-6 py-2.5">
          Book a styling session
        </Link>
      </section>
    </div>
  );
}
