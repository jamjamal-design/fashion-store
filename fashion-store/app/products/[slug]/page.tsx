import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductBySlug, toLegacyProduct, getProductImage } from "../../../lib/api";
import { JsonLd } from "../../components/json-ld";
import { productSchema, breadcrumbSchema } from "@/lib/seo";
import { ProductDetailClient } from "./product-detail-client";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const apiProduct = await fetchProductBySlug(params.slug);

  if (!apiProduct) {
    return {
      title: "Product not found",
      description: "The product you are looking for is not available.",
      robots: { index: false, follow: true },
    };
  }

  const image = getProductImage(apiProduct);
  const canonical = `/products/${apiProduct.slug}`;
  const description = apiProduct.description?.slice(0, 160) || undefined;

  return {
    title: apiProduct.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: apiProduct.name,
      description,
      url: canonical,
      type: "website",
      images: image ? [{ url: image, alt: apiProduct.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: apiProduct.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const apiProduct = await fetchProductBySlug(params.slug);

  if (!apiProduct) {
    notFound();
  }

  const product = toLegacyProduct(apiProduct);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.category, path: "/shop" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[productSchema(product), breadcrumbs]} />
      <ProductDetailClient product={product} />
    </>
  );
}
