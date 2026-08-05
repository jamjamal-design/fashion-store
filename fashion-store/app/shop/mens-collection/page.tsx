import type { Metadata } from "next";
import { JsonLd } from "@/app/components/json-ld";
import { collectionMetadata, collectionBreadcrumb } from "@/lib/seo";
import Link from "next/link";
import { whatsappUrl } from "../../data/store";
import { ProductCard } from "../../components/product-card";
import { fetchProductsByCategory, toLegacyProducts } from "../../../lib/api";

export const metadata: Metadata = collectionMetadata(
  "Men's Collection",
  "Claireville's men's collection — refined tailoring and contemporary sophistication for the modern gentleman. Premium menswear and accessories.",
  "/shop/mens-collection",
);

export default async function MensCollectionPage() {
  const apiProducts = await fetchProductsByCategory("Men's Collection");
  const collectionProducts = toLegacyProducts(apiProducts);

  return (
    <div className="section-shell py-8 md:py-12">
      <JsonLd data={collectionBreadcrumb("Men's Collection", "/shop/mens-collection")} />
      <section className="glass-surface no-hover rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Men&apos;s Collection</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Men&apos;s Collection</h1>
            <p className="max-w-2xl text-muted">
              Refined tailoring and contemporary sophistication for the modern gentleman.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">Book a fitting</Link>
        </div>
      </section>
      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {collectionProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </section>
      {collectionProducts.length === 0 && (
        <section className="mt-8 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-12 text-center">
          <p className="text-lg text-muted">No products available at the moment. Check back soon.</p>
          <Link href="/shop" className="button-primary mt-4 inline-block px-6 py-2.5">Browse all products</Link>
        </section>
      )}
    </div>
  );
}
