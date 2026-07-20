"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { whatsappUrl, type Product } from "../data/store";
import { ProductImage } from "./product-image";

interface HeroSliderProps {
  products: Product[];
  heroVideoUrl?: string;
}

type Slide =
  | { type: "product"; product: Product }
  | { type: "video"; videoUrl: string; poster?: string };

export function HeroSlider({ products, heroVideoUrl }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Build slides array: video first, then 2 products
  const slides: Slide[] = [
    ...(heroVideoUrl ? [{ type: "video" as const, videoUrl: heroVideoUrl, poster: products[0]?.image }] : []),
    ...products.slice(0, 2).map((p) => ({ type: "product" as const, product: p })),
  ];

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-rotate: video slides 20s, product slides 7s
  useEffect(() => {
    if (slides.length === 0) return;
    const currentSlide = slides[current];
    const duration = currentSlide.type === "video" ? 20000 : 7000;
    const timer = setTimeout(next, duration);
    return () => clearTimeout(timer);
  }, [next, current, slides]);

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[current];

  return (
    <section className="relative h-screen max-h-[700px] min-h-[500px] overflow-hidden">
      {/* Slide backgrounds with crossfade */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {s.type === "product" ? (
            <ProductImage
              src={s.product.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
              wrapperClassName="absolute inset-0"
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              poster={s.poster}
            >
              <source src={s.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,16,32,0.88)_0%,rgba(8,16,32,0.55)_50%,rgba(8,16,32,0.75)_100%)] z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(8,16,32,0.4)] to-transparent z-10" />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(8,16,32,0.5)] p-2.5 text-white backdrop-blur-sm transition hover:bg-[rgba(212,160,23,0.2)] hover:border-[rgba(212,160,23,0.4)]"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(8,16,32,0.5)] p-2.5 text-white backdrop-blur-sm transition hover:bg-[rgba(212,160,23,0.2)] hover:border-[rgba(212,160,23,0.4)]"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current
                ? "w-8 bg-[color:var(--accent-strong)] shadow-[0_0_8px_rgba(240,200,64,0.4)]"
                : "w-2 bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.5)]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Content — only shown for product slides */}
      {slide.type === "product" && (
        <div className="section-shell relative z-20 flex h-full flex-col items-start justify-center py-20">
          <div
            key={current}
            className="animate-fade-slide-up"
            style={{
              animation: "slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,160,23,0.3)] bg-[rgba(8,16,32,0.6)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--accent-strong)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent-strong)] shadow-[0_0_6px_rgba(240,200,64,0.5)]" />
              {slide.product.badge || "New Collection"}
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
              {slide.product.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[rgba(255,255,255,0.7)] md:text-xl">
              {slide.product.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/products/${slide.product.slug}`}
                className="button-primary px-8 py-3 text-base"
              >
                Shop now — {currencyFormatter(slide.product.price)}
              </Link>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.06)] px-8 py-3 text-base font-bold text-white backdrop-blur-sm transition hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.35)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-[rgba(255,255,255,0.4)]">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[color:var(--accent-strong)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Premium Quality
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[color:var(--accent-strong)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Styling
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[color:var(--accent-strong)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure Shopping
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content for video slide — brand message */}
      {slide.type === "video" && (
        <div className="section-shell relative z-20 flex h-full flex-col items-start justify-center py-20">
          <div
            key={current}
            className="animate-fade-slide-up"
            style={{
              animation: "slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,160,23,0.3)] bg-[rgba(8,16,32,0.6)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--accent-strong)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent-strong)] shadow-[0_0_6px_rgba(240,200,64,0.5)]" />
              Claireville
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
              Where elegance meets
              <br />
              <span className="text-[color:var(--accent-strong)]">individuality</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[rgba(255,255,255,0.7)] md:text-xl">
              Discover our latest collection — curated for those who appreciate the finest craftsmanship.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="button-primary px-8 py-3 text-base"
              >
                Explore the collection
              </Link>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.06)] px-8 py-3 text-base font-bold text-white backdrop-blur-sm transition hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.35)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Book consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function currencyFormatter(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}