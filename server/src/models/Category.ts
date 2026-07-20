import mongoose, { model, models, Schema } from "mongoose";
import type { CategoryInput } from "../types";
import { attachSlugHook } from "../hooks";

const categorySchema = new Schema<CategoryInput>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    count: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "categories" },
);

attachSlugHook(categorySchema);

export const CategoryModel = models.Category ?? model("Category", categorySchema);
export type CategoryDocument = mongoose.InferSchemaType<typeof categorySchema>;
export { categorySchema };