import type { Schema } from "mongoose";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function attachSlugHook(schema: Schema, sourceField = "name", targetField = "slug") {
  schema.pre("validate", function (this: unknown) {
    const document = this as Record<string, unknown>;
    const currentSlug = String(document[targetField] ?? "");

    if (!currentSlug && typeof document[sourceField] === "string") {
      document[targetField] = slugify(document[sourceField] as string);
    }
  });
}