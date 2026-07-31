import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { whatsappUrl, formatCurrency } from "../data/store";
import { fetchPublicProducts, toLegacyProducts } from "../../lib/api";
import { BreakingGlassButton } from "../components/breaking-glass-button";

export const metadata: Metadata = {
  title: "Lookbook",
  description:
    "Explore Claireville's curated lookbook — discover our latest collections, styling inspiration, and signature looks from our atelier.",
  alternates: {
    canonical: "/lookbook",
  },
};

export default async function LookbookPage() {
  const apiProducts = await fetchPublicProducts();
  const products = toLegacyProducts(apiProducts);

  return (
    <div className="section-shell py-8 md:py-12">
      <section className="glass-surface rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Lookbook</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Curated looks from the atelier</h1>
            <p className="max-w-2xl text-muted">
              Explore our seasonal lookbook for styling inspiration, signature pairings, and a glimpse into
              the creative vision behind each collection.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
            Book a styling session
          </Link>
        </div>
      </section>

      {products.length === 0 ? (
        <section className="mt-8 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-12 text-center">
          <p className="text-lg text-muted">Lookbook images coming soon.</p>
        </section>
      ) : (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id || product._id}
              href={`/products/${product.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(var(--ink-rgb),0.06)] bg-white/80 transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.18)] hover:shadow-[0_20px_50px_rgba(var(--ink-rgb),0.06)]"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <Image
                  src={product.image || "/products/velvet-wrap-dress.svg"}
                  alt={product.name}
                  width={600}
                  height={750}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(var(--scrim-rgb),0.85)] via-[rgba(var(--scrim-rgb),0.5)] to-transparent p-5 pt-16">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--gold)]">
                  {product.category}
                </p>
                <h3 className="mt-1.5 text-xl font-black text-[color:var(--rich-black)]">{product.name}</h3>
                <p className="mt-1 text-lg font-black text-[color:var(--gold)]">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="mt-12 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-8 text-center">
        <span className="section-badge">Personal styling</span>
        <h2 className="mt-4 text-2xl font-black text-[color:var(--rich-black)] md:text-3xl">Want a custom look?</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Our style consultants can curate a personalized lookbook based on your preferences, body type, and
          the occasion. Book a free consultation today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <BreakingGlassButton href={whatsappUrl} className="button-primary px-6 py-2.5">
            Book a consultation
          </BreakingGlassButton>
          <Link href="/shop" className="button-secondary px-6 py-2.5">
            Shop all collections
          </Link>
        </div>
      </section>
    </div>
  );
}