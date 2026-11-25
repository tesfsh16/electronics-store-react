const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String, // saved copy of the product name
    price: Number, // saved copy of the price at order time
    quantity: { type: Number, required: true, min: 1 },
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    // Total price in ETB, includes delivery
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 100, // flat fee inside Addis Ababa, simple for now
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["chapa", "cod"], // cod = cash on delivery
      default: "cod",
    },
    // payment status from Chapa
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    // delivery status, controlled by the admin
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    // Chapa transaction reference, used to check payment
    chapaTxRef: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
