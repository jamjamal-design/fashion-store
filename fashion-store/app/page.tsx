import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type Product, whatsappUrl } from "./data/store";
import { HeroSlider } from "./components/hero-slider";
import { FeaturedProducts } from "./components/featured-products";
import { CollectionCards } from "./components/collection-cards";
import { fetchFeaturedProducts, fetchPublicProducts, fetchPublicCategories, fetchProductsByCategory, toLegacyProducts, type ApiCategory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Claireville — a luxury fashion boutique offering bespoke couture, ready-to-wear, real coral beads, and premium accessories. A style for every story.",
  alternates: {
    canonical: "/",
  },
};

const testimonials = [
  {
    name: "Amina Yusuf",
    role: "Verified Buyer",
    text: "The craftsmanship of my bespoke gown was absolutely impeccable. Every detail was tailored to perfection. Claireville is truly a hidden gem for luxury fashion.",
    rating: 5,
  },
  {
    name: "Jordan Blake",
    role: "Verified Buyer",
    text: "I purchased a custom coral bead set for my wife — the quality and authenticity are unmatched. The attention to detail and customer service were world-class.",
    rating: 5,
  },
  {
    name: "Sofia Khan",
    role: "Verified Buyer",
    text: "From the moment I walked into the boutique, I felt like royalty. The ready-to-wear collection is stunning, and the personal styling consultation was invaluable.",
    rating: 5,
  },
];

const luxuryFeatures = [
  {
    title: "Bespoke Tailoring",
    copy: "Every stitch tells your story. Our master tailors craft made-to-measure pieces that celebrate your individuality with precision and artistry.",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    title: "Authentic Coral Beads",
    copy: "Sourced from the finest artisans, our real coral bead collection bridges heritage and haute couture — available for both men and women.",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    title: "Personal Styling",
    copy: "Our style consultants offer one-on-one consultations to curate looks that reflect your personality, from boardroom to ballroom.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

async function getHomePageData() {
  try {
    const [featuredProducts, allProducts, categories] = await Promise.all([
      fetchFeaturedProducts(4),
      fetchPublicProducts(),
      fetchPublicCategories(),
    ]);

    return { featuredProducts: toLegacyProducts(featuredProducts), allProducts: toLegacyProducts(allProducts), categories };
  } catch {
    return {
      featuredProducts: [] as Product[],
      allProducts: [] as Product[],
      categories: [] as ApiCategory[],
    };
  }
}

export default async function Home() {
  const { featuredProducts, allProducts } = await getHomePageData();

  const featuredForSlider = allProducts.slice(0, 3);

  // Hero video from Cloudinary (auto-playing, muted, looping background video)
  const heroVideoUrl = `https://res.cloudinary.com/djl9dxnrj/video/upload/v1783891852/video-output-76B9714B-F092-4101-B357-9912D3943A22-1_m9i1nz.mp4`;

  return (
    <>
      {/* ═══════════════════════════════════════
         HERO — Full-screen luxury slider with video background
         ═══════════════════════════════════════ */}
      <HeroSlider products={featuredForSlider} heroVideoUrl={heroVideoUrl} />

      {/* ═══════════════════════════════════════
         BOUTIQUE STORY
         ═══════════════════════════════════════ */}
      <section className="section-shell py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/about%20company.png"
                alt="Claireville Luxury Boutique"
                width={720}
                height={520}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,16,32,0.5)] to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 flex items-center gap-3 rounded-xl border border-[rgba(212,160,23,0.25)] bg-[rgba(8,16,32,0.95)] px-5 py-3 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:-bottom-6 md:-right-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(212,160,23,0.15)]">
                <span className="text-2xl font-black text-[color:var(--accent-strong)]">6+</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Exclusive</p>
                <p className="text-xs text-muted">Collections</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <span className="section-badge">Luxury boutique</span>
            <h2 className="text-3xl font-black md:text-5xl">
              Where elegance meets
              <br />
              <span className="text-[color:var(--accent-strong)]">individuality</span>
            </h2>
            <p className="leading-8 text-muted">
              Claireville is a luxury fashion house built on the belief that true style is deeply personal. 
              From bespoke couture to ready-to-wear elegance, every piece in our collection is selected 
              and crafted to celebrate your unique story.
            </p>
            <p className="leading-8 text-muted">
              Our master artisans blend classical techniques with contemporary vision, creating pieces 
              that transcend trends — from custom-tailored ensembles to authentic coral bead heirlooms 
              that carry generations of heritage.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/about" className="button-primary px-6 py-2.5">
                Our heritage
              </Link>
              <Link href="/shop" className="button-secondary px-6 py-2.5">
                Explore collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         COLLECTIONS — Interactive cards with products
         ═══════════════════════════════════════ */}
      <CollectionsSection />

      {/* ═══════════════════════════════════════
         FEATURED PIECES
         ═══════════════════════════════════════ */}
      <FeaturedProducts products={featuredProducts} />

      {/* ═══════════════════════════════════════
         THE BOUTIQUE EXPERIENCE
         ═══════════════════════════════════════ */}
      <section className="section-shell py-16 md:py-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-badge">The Claireville experience</span>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            Craftsmanship that <span className="text-[color:var(--accent-strong)]">endures</span>
          </h2>
          <p className="mt-3 max-w-lg text-muted">
            More than fashion — a tradition of excellence, personally tailored to you.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {luxuryFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.4)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(212,160,23,0.2)] hover:shadow-[0_20px_50px_rgba(4,10,24,0.3)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(212,160,23,0.08)] text-[color:var(--accent-strong)] transition-all duration-300 group-hover:bg-[rgba(212,160,23,0.18)] group-hover:scale-110">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={feature.icon} />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
         TESTIMONIALS
         ═══════════════════════════════════════ */}
      <section className="relative border-t border-[color:var(--border)] bg-[rgba(8,16,32,0.2)]">
        <div className="section-shell py-16 md:py-24">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="section-badge">Kind words</span>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              What our <span className="text-[color:var(--accent-strong)]">patrons say</span>
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              Real stories from those who trust Claireville for their most treasured pieces.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.5)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(212,160,23,0.25)] hover:shadow-[0_20px_50px_rgba(4,10,24,0.3)]"
              >
                <div className="absolute -right-4 -top-4 text-7xl font-black leading-none text-[rgba(212,160,23,0.06)]">
                  &ldquo;
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-[color:var(--accent-strong)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-[color:var(--border)] pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(212,160,23,0.12)] text-sm font-bold text-[color:var(--accent-strong)]">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         SERVICES / VALUE PROPS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Bespoke Consultations",
              copy: "Book a one-on-one session with our style architects for a completely personalized experience — from fabric selection to final fitting.",
              icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
            },
            {
              title: "Secure Payments",
              copy: "Bank transfers, secure checkout, and receipt uploads — all handled with the discretion and professionalism befitting a luxury boutique.",
              icon: "M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17",
            },
            {
              title: "Dedicated Support",
              copy: "From your first inquiry to post-purchase care, our team provides white-glove service through WhatsApp and direct contact.",
              icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[color:var(--border)] bg-[rgba(10,18,39,0.3)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(212,160,23,0.2)] hover:shadow-[0_20px_50px_rgba(4,10,24,0.3)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(212,160,23,0.08)] text-[color:var(--accent-strong)] transition-all duration-300 group-hover:bg-[rgba(212,160,23,0.18)] group-hover:scale-110">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={feature.icon} />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
         CTA — Book a consultation
         ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,16,32,0.95)_0%,rgba(58,46,10,0.5)_50%,rgba(8,16,32,0.9)_100%)]" />
          <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,160,23,0.08),transparent_70%)]" />
          <div className="absolute left-1/4 top-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(240,200,64,0.05),transparent_70%)]" />
        </div>
        <div className="section-shell flex flex-col items-center py-20 text-center md:py-28">
          <span className="section-badge">Get started</span>
          <h2 className="mt-4 max-w-2xl text-3xl font-black md:text-5xl">
            Ready to experience
            <br />
            <span className="text-[color:var(--accent-strong)]">true luxury?</span>
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Browse our collections, book a personal styling consultation, or visit our boutique 
            for a bespoke experience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="button-primary px-10 py-3.5 text-base">
              Explore the collection
            </Link>
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary px-10 py-3.5 text-base"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Book consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         STAY CONNECTED
         ═══════════════════════════════════════ */}
      <section className="border-t border-[color:var(--border)]">
        <div className="section-shell flex flex-col items-center py-12 text-center md:py-16">
          <span className="section-badge">Stay connected</span>
          <h2 className="mt-4 max-w-2xl text-2xl font-black md:text-4xl">
            Follow <span className="text-[color:var(--accent-strong)]">Claireville</span>
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Be the first to experience new collections, exclusive previews, and behind-the-scenes 
            content from our atelier.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,160,23,0.2)] bg-[rgba(212,160,23,0.06)] px-5 py-2.5 text-sm font-bold text-[color:var(--accent-strong)] transition hover:bg-[rgba(212,160,23,0.12)] hover:border-[rgba(212,160,23,0.4)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[rgba(10,18,39,0.5)] px-5 py-2.5 text-sm font-bold text-muted transition hover:bg-[rgba(10,18,39,0.8)] hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Visit our boutique
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Claireville",
            description:
              "Luxury fashion boutique offering bespoke couture, ready-to-wear, real coral beads, menswear, kids fashion, and premium accessories.",
            url: "https://lumaatelier.com",
          }),
        }}
      />
    </>
  );
}

// Separate async component for Collections
async function CollectionsSection() {
  const categoriesData = await fetchPublicCategories();

  // Get products for each category and transform image array to string
  const categoriesWithProducts = await Promise.all(
    categoriesData.map(async (cat) => {
      try {
        const products = await fetchProductsByCategory(cat.name);
        const transformed = toLegacyProducts(products);
        return { ...cat, products: transformed };
      } catch {
        return { ...cat, products: [] as Product[] };
      }
    })
  );

  return (
    <section className="relative border-t border-[color:var(--border)] bg-[rgba(8,16,32,0.2)]">
      <div className="section-shell py-16 md:py-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-badge">Our collections</span>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            Luxury <span className="text-[color:var(--accent-strong)]">curated for you</span>
          </h2>
          <p className="mt-3 max-w-lg text-muted">
            Click on any collection to browse its pieces. Add to cart or view full details — all from one place.
          </p>
        </div>
        <CollectionCards categories={categoriesWithProducts} />
      </div>
    </section>
  );
}
