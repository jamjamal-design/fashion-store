import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductBySlug, toLegacyProduct } from "../../../lib/api";
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
    };
  }

  return {
    title: apiProduct.name,
    description: apiProduct.description,
    alternates: {
      canonical: `/products/${apiProduct.slug}`,
    },
    openGraph: {
      title: apiProduct.name,
      description: apiProduct.description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const apiProduct = await fetchProductBySlug(params.slug);

  if (!apiProduct) {
    notFound();
  }

  const product = toLegacyProduct(apiProduct);

  return <ProductDetailClient product={product} />;
}
