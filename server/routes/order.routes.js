const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders
// Place a new order (logged in customers only)
router.post("/", protect, async (req, res) => {
  const { items, shippingAddress, paymentMethod, deliveryFee } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order" });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  // Calculate the total price from the database, not from the client
  // This is important: never trust prices sent from the browser
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found: ${item.productId}` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Not enough stock for "${product.name}"`,
      });
    }

    subtotal += product.price * item.quantity;

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    });
  }

  const fee = deliveryFee ?? 100;
  const totalPrice = subtotal + fee;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "cod",
    deliveryFee: fee,
    totalPrice,
  });

  res.status(201).json(order);
});

// GET /api/orders/my
// Get the orders of the currently logged in user
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// GET /api/orders/:id
// Get one order by id (the user must own it, or be admin)
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // A customer can only see their own orders
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(order);
});

// --- ADMIN routes ---

// GET /api/orders
// Get all orders (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status
// Update order status (admin only)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  const updated = await order.save();
  res.json(updated);
});

module.exports = router;
