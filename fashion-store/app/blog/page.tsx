import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { whatsappUrl } from "../data/store";

export const metadata: Metadata = {
  title: "Blog & News",
  description:
    "Stay updated with Claireville's latest fashion news, style guides, behind-the-scenes stories, and exclusive collection previews from our atelier.",
  alternates: {
    canonical: "/blog",
  },
};

const blogPosts = [
  {
    title: "The Art of Bespoke Tailoring: A Behind-the-Scenes Look",
    excerpt:
      "Step inside the Claireville atelier and discover the meticulous craftsmanship that goes into every made-to-measure piece — from fabric selection to the final stitch.",
    image: "/products/tailored-overshirt.svg",
    date: "July 8, 2026",
    author: "Claireville Studio",
    category: "Craftsmanship",
    slug: "art-of-bespoke-tailoring",
  },
  {
    title: "5 Essential Pieces Every Luxury Wardrobe Needs",
    excerpt:
      "Building a timeless wardrobe starts with investment pieces that transcend seasons. Our style editors share the five essentials every fashion connoisseur should own.",
    image: "/products/velvet-wrap-dress.svg",
    date: "June 28, 2026",
    author: "Style Desk",
    category: "Style Guide",
    slug: "essential-luxury-wardrobe-pieces",
  },
  {
    title: "Real Coral Beads: Heritage, Craft, and Modern Style",
    excerpt:
      "Explore the rich history of coral bead craftsmanship in West Africa and how Claireville is preserving this tradition with contemporary designs for men and women.",
    image: "/products/goldline-accessory-set.svg",
    date: "June 15, 2026",
    author: "Heritage Editor",
    category: "Heritage",
    slug: "real-coral-beads-heritage",
  },
  {
    title: "Summer 2026: The Season of Effortless Elegance",
    excerpt:
      "From lightweight linens to airy silks, our summer collection is all about moving through the season with grace. Here's what to wear and how to style it.",
    image: "/products/linen-city-set.svg",
    date: "June 5, 2026",
    author: "Fashion Desk",
    category: "Seasonal",
    slug: "summer-2026-effortless-elegance",
  },
  {
    title: "A Guide to Caring for Your Luxury Garments",
    excerpt:
      "Your investment pieces deserve the best care. Learn the dos and don'ts of storing, cleaning, and maintaining your designer wardrobe for years to come.",
    image: "/products/atelier-structured-bag.svg",
    date: "May 20, 2026",
    author: "Care Team",
    category: "Garment Care",
    slug: "luxury-garment-care-guide",
  },
  {
    title: "Claireville x Lagos Fashion Week: A Look Back",
    excerpt:
      "Relive the highlights from our showcase at Lagos Fashion Week, where tradition met contemporary design on the runway.",
    image: "/about%20company.png",
    date: "May 10, 2026",
    author: "Events Team",
    category: "Events",
    slug: "claireville-lagos-fashion-week",
  },
];

export default function BlogPage() {
  return (
    <div className="section-shell py-8 md:py-12">
      <section className="glass-surface no-hover rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Blog & News</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">Stories from the atelier</h1>
            <p className="max-w-2xl text-muted">
              Discover the latest from Claireville — style guides, behind-the-scenes stories, collection
              previews, and everything happening at the intersection of luxury and craftsmanship.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary">
            Subscribe on WhatsApp
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-[1.75rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/80 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.15)] hover:shadow-[0_20px_50px_rgba(var(--ink-rgb),0.06)]"
          >
            <div className="grid-pattern p-3">
              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={400}
                className="h-52 w-full rounded-[1.25rem] object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="rounded-full bg-[rgba(201,168,76,0.08)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--gold)]">
                  {post.category}
                </span>
                <span className="text-muted">{post.date}</span>
              </div>
              <h2 className="mt-3 text-lg font-black text-[color:var(--rich-black)] group-hover:text-[color:var(--gold)] transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[rgba(var(--ink-rgb),0.06)] pt-4">
                <span className="text-xs text-muted">By {post.author}</span>
                <span className="text-xs font-bold text-[color:var(--gold)] group-hover:underline">
                  Read more →
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-8 text-center">
        <span className="section-badge">Stay in the loop</span>
        <h2 className="mt-4 text-2xl font-black text-[color:var(--rich-black)] md:text-3xl">Never miss a story</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Get the latest Claireville news, style tips, and exclusive previews delivered straight to your
          inbox or WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-primary px-6 py-2.5">
            Join our WhatsApp channel
          </Link>
          <Link href="/contact" className="button-secondary px-6 py-2.5">
            Visit our boutique
          </Link>
        </div>
      </section>
    </div>
  );
}