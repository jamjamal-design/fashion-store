import mongoose, { model, models, Schema } from "mongoose";
import type { ProductInput } from "../types";
import { attachSlugHook } from "../hooks";

const productSchema = new Schema<ProductInput>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    badge: { type: String, default: "" },
    description: { type: String, required: true, trim: true },
    details: { type: [String], default: [] },
    image: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "products" },
);

attachSlugHook(productSchema);

export const ProductModel = models.Product ?? model("Product", productSchema);
export type ProductDocument = mongoose.InferSchemaType<typeof productSchema>;
export { productSchema };