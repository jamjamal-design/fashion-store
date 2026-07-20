import mongoose, { model, models, Schema } from "mongoose";
import type { OrderInput, CustomerSnapshot, OrderItemInput } from "../types";

const customerSchema = new Schema<CustomerSnapshot>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { _id: false },
);

const orderItemSchema = new Schema<OrderItemInput>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    color: { type: String, default: "" },
    size: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderInput>(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    customer: { type: customerSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "packed", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
      required: true,
    },
    paymentProofUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    assignedAdminId: { type: String, default: null },
  },
  { timestamps: true, collection: "orders" },
);

export const OrderModel = models.Order ?? model("Order", orderSchema);
export type OrderDocument = mongoose.InferSchemaType<typeof orderSchema>;
export { customerSchema, orderItemSchema, orderSchema };