import type { Metadata } from "next";
import type { UiProduct } from "./api";
import { socialLinks, whatsappNumber } from "@/app/data/store";

// Central site constants. Override the domain via NEXT_PUBLIC_SITE_URL in the
// environment; the fallback matches the existing metadataBase.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lumaatelier.com";
export const SITE_NAME = "Claireville";
export const SITE_TAGLINE = "Claireville | Luxury Fashion Store";
export const SITE_DESCRIPTION =
  "Claireville is a luxury fashion house offering bespoke couture, ready-to-wear, men's and kids' collections, real coral beads, and premium accessories.";
export const DEFAULT_OG_IMAGE = "/logo.png";

/** Resolve a path or absolute URL to an absolute URL against SITE_URL. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Metadata for a shop collection / category landing page. Centralises the
 * title + description + canonical + Open Graph + Twitter card so every
 * category page stays consistent with a single source of truth.
 */
export function collectionMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const ogTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/** BreadcrumbList for a collection page: Home → Shop → {label}. */
export function collectionBreadcrumb(label: string, path: string) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: label, path },
  ]);
}

/** Organization schema — describes the brand as a whole. Emitted site-wide. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Claireville Ventures",
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    description: SITE_DESCRIPTION,
    sameAs: [socialLinks.instagram, socialLinks.tiktok, socialLinks.facebook].filter(
      Boolean,
    ),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: whatsappNumber,
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: ["en"],
    },
  };
}

/** WebSite schema — enables sitelinks search box + brand identity. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** BreadcrumbList schema from an ordered list of {name, path}. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Product schema with Offer — the key structured data for product pages. */
export function productSchema(product: UiProduct) {
  const image = product.image ? [absoluteUrl(product.image)] : [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image,
    sku: product.id || product._id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "USD",
      price: product.price,
      availability:
        typeof product.stock === "number" && product.stock <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    ...(product.rating && product.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          },
        }
      : {}),
  };
}
