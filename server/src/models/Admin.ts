import mongoose, { model, models, Schema } from "mongoose";
import type { AdminUserInput } from "../types";

const adminSchema = new Schema<AdminUserInput>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "manager", "editor"],
      default: "editor",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "invited", "disabled"],
      default: "invited",
      required: true,
    },
  },
  { timestamps: true, collection: "admins" },
);

export const AdminModel = models.Admin ?? model("Admin", adminSchema);
export type AdminDocument = mongoose.InferSchemaType<typeof adminSchema>;
export { adminSchema };