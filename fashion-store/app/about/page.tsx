import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "../components/scroll-reveal";
import { SectionReveal } from "../components/section-reveal";

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

const stats = [
  { value: "12+", label: "Collection families" },
  { value: "24/7", label: "Client support" },
  { value: "100%", label: "Luxury focus" },
];

const timeline = [
  { year: "01", title: "Vision", copy: "Claireville began with a promise to make luxury fashion feel personal, precise, and easy to shop." },
  { year: "02", title: "Craft", copy: "The brand grew around thoughtful tailoring, premium finishing, and styling support for every customer." },
  { year: "03", title: "Presence", copy: "Today the store blends editorial storytelling, a refined product journey, and responsive service." },
];

export default function AboutPage() {
  return (
    <div className="section-shell no-hover py-8 md:py-12">
      <SectionReveal className="surface-glow grid gap-8 rounded-[2rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/80 p-6 shadow-[0_30px_80px_rgba(var(--ink-rgb),0.06)] md:grid-cols-[0.95fr_1.05fr] md:p-10">
        <div className="space-y-6">
          <ScrollReveal>
            <span className="section-badge">About the business</span>
          </ScrollReveal>
          <div className="space-y-4">
            <ScrollReveal delay={0.08}>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-6xl">
                Meet the CEO and the story behind Claireville.
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="max-w-xl text-base leading-8 text-muted md:text-lg">
                Claireville is a modern fashion business shaped around confidence, convenience, and carefully chosen pieces. The brand is guided by a clear vision to make premium style feel approachable, polished, and personal.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item, index) => (
              <ScrollReveal key={item.label} delay={0.1 + index * 0.08} direction="scale">
                <div className="rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-5 text-center">
                  <p className="text-3xl font-black text-[color:var(--gold)]">{item.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{item.label}</p>
                </div>
              </ScrollReveal>
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
          <ScrollReveal direction="right">
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
                      The logo represents a clean, elevated fashion label that keeps presentation consistent from storefront to checkout.
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
          </ScrollReveal>
        </div>
      </SectionReveal>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ScrollReveal direction="left" className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">CEO vision</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">Leadership with a clear point of view</h2>
          <p className="mt-3 text-muted leading-7">
            The CEO of Claireville is focused on building a fashion house recognized for timeless fashion, unforgettable bridal couture, and premium lifestyle services. Every touch point is designed to support product discovery, trustworthy ordering, and strong customer service.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="right" className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">Our story</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">A boutique built for modern shopping</h2>
          <p className="mt-3 text-muted leading-7">
            Claireville is a luxury fashion house dedicated to creating timeless elegance through exceptional craftsmanship and innovative design.
            <br />
            <br />
            We believe fashion is more than clothing&mdash;it&rsquo;s an expression of confidence, beauty, and individuality. Every piece is carefully designed with premium fabrics, exquisite detailing, and impeccable finishing.
            <br />
            <br />
            From bridal gowns and bespoke couture to ready-to-wear, men&rsquo;s fashion, children&rsquo;s wear, coral beads, and luxury accessories, Claireville is a complete destination for style and elegance.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="left" className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">Timeline</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">A brand story in three acts</h2>
          <div className="mt-5 grid gap-4">
            {timeline.map((item) => (
              <div key={item.year} className="grid gap-3 rounded-[1.25rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-4 md:grid-cols-[64px_1fr] md:items-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[rgba(201,168,76,0.08)] text-lg font-black text-[color:var(--gold)]">
                  {item.year}
                </div>
                <div>
                  <p className="text-sm font-bold text-[color:var(--rich-black)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-7 text-muted">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" className="glass-surface rounded-[1.75rem] p-6">
          <span className="section-badge">Promise</span>
          <h2 className="mt-4 text-3xl font-black text-[color:var(--rich-black)]">To exceed expectations and create lasting impressions</h2>
          <p className="mt-3 text-muted leading-7">
            Every Claireville creation is thoughtfully crafted to celebrate your unique style and life&rsquo;s most memorable moments. From your dream wedding gown to bespoke couture, luxury accessories, and garment care, we are dedicated to delivering excellence, elegance, and unforgettable experiences.
          </p>
          <p className="mt-4 text-muted font-bold leading-7">
            Made to be Seen. Impossible to Ignore.
          </p>
        </ScrollReveal>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {companyHighlights.map((highlight, index) => (
          <ScrollReveal key={highlight} delay={0.05 + index * 0.08} direction="up">
            <div className="rounded-[1.5rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/75 p-5 shadow-[0_18px_45px_rgba(var(--ink-rgb),0.04)]">
              <p className="text-sm leading-7 text-muted">{highlight}</p>
            </div>
          </ScrollReveal>
        ))}
      </section>
    </div>
  );
}