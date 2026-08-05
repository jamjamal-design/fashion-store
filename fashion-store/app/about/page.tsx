import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the CEO behind Claireville and the fashion business built around quality, style, and customer care.",
  alternates: {
    canonical: "/about",
  },
};

const companyHighlights = [
  "Curated fashion for women who want elevated everyday and occasion wear.",
  "A customer-first business model built around fast support, easy ordering, and reliable checkout.",
  "A growing storefront powered by thoughtful presentation, clear product discovery, and admin control.",
];

export default function AboutPage() {
  return (
    <div className="section-shell no-hover py-8 md:py-12">
      <section className="surface-glow grid gap-8 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/80 p-6 shadow-[0_30px_80px_rgba(var(--ink-rgb),0.06)] md:grid-cols-[0.95fr_1.05fr] md:p-10">
        <div className="space-y-6">
          <span className="section-badge">About the business</span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-6xl">
              Meet the CEO and the story behind Claireville.
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted md:text-lg">
              Claireville is a modern fashion business shaped around confidence, convenience, and carefully
              chosen pieces. The brand is guided by its CEO's vision to make premium style feel approachable,
              polished, and personal for every customer.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {companyHighlights.map((highlight) => (
              <div key={highlight} className="glass-surface rounded-3xl p-4">
                <p className="text-sm leading-7 text-muted">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="button-primary">
              Shop the collection
            </Link>
            <Link href="/contact" className="button-secondary">
              Contact the team
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-surface overflow-hidden rounded-[1.75rem] p-4">
            <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.25rem] bg-white/80 p-4">
                <Image
                  src="/logo.png"
                  alt="Claireville logo"
                  width={240}
                  height={240}
                  className="h-auto w-full rounded-[1rem] object-contain"
                  priority
                />
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                    Brand identity
                  </p>
                  <p className="text-sm leading-7 text-muted">
                    The logo represents a clean, elevated fashion label that keeps presentation consistent from
                    storefront to checkout.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <Image
                  src="/about%20img.jpeg"
                  alt="The CEO of Claireville"
                  width={720}
                  height={900}
                  className="h-full w-full rounded-[1.25rem] object-cover"
                />
                <Image
                  src="/about%20company.png"
                  alt="Claireville business presentation"
                  width={720}
                  height={480}
                  className="h-full w-full rounded-[1.25rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">CEO vision</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">Leadership with a clear point of view</h2>
          <p className="mt-3 text-muted leading-7">
            The CEO of Claireville focuses becoming Africa&rsquo;s leading luxury fashion house, recognized globally for creating timeless fashion, unforgettable bridal couture, and premium lifestyle services that inspire generations and also focuses on building a fashion business that feels premium without becoming difficult to shop. Every touch point is designed to support product discovery, trustworthy ordering, and strong customer service.
          </p>
        </div>

        <div className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">OUR story</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">A boutique built for modern shopping</h2>
          <p className="mt-3 text-muted leading-7">
            Claireville is a luxury fashion house dedicated to creating timeless elegance through exceptional craftsmanship and innovative design.
            <br />
            <br />
            We believe fashion is more than clothing&mdash;it&rsquo;s an expression of confidence, beauty, and individuality. Every piece we create is carefully designed with premium fabrics, exquisite detailing, and impeccable finishing.
            <br />
            <br />
            From breathtaking bridal gowns and bespoke couture to ready-to-wear collections, men&rsquo;s fashion, children&rsquo;s wear, authentic coral beads, luxury accessories, and professional garment care, Claireville is your complete destination for style and elegance.
            <br />
            <br />
            Whether it&rsquo;s your wedding day, a special celebration, a corporate event, or everyday sophistication, we are committed to making every client look and feel extraordinary.
          </p>
          <p className="mt-4 text-muted leading-7">
            The business is designed to serve customers who want elegant products, simple navigation, and a clear path from inspiration to purchase.
            Claireville&hellip; Addicted to Style.
          </p>
        </div>

        <div className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">OUR mission</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">To become Africa&rsquo;s leading luxury fashion house</h2>
          <p className="mt-3 text-muted leading-7">
            Claireville is a luxury fashion house creating bespoke fashion, ready-to-wear collections, authentic coral beads, premium accessories, and professional garment care for women, men, and children. The business is designed to serve customers who want elegant products, simple navigation, and a clear path from inspiration to purchase.
            We aim to create world-class fashion and luxury lifestyle experiences through exceptional craftsmanship, creativity, and personalized service, empowering every client to express confidence, elegance, and individuality.
          </p>
        </div>

        <div className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">OUR promise</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">To exceed expectations and create lasting impressions</h2>
          <p className="mt-3 text-muted leading-7">
            Every Claireville creation is thoughtfully crafted to celebrate your unique style and life&rsquo;s most memorable moments. From your dream wedding gown to bespoke couture, luxury accessories, and garment care, we are dedicated to delivering excellence, elegance, and unforgettable experiences.
          </p>
          <p className="mt-4 text-muted font-bold leading-7">
            Made to be Seen. Impossible to Ignore.
          </p>
        </div>
      </section>
    </div>
  );
}