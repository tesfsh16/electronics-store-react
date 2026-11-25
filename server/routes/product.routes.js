const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/products
// Fetch all products (public - anyone can see)
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// GET /api/products/:id
// Get one product by its id (public)
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// POST /api/products
// Add a new product (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  const { name, category, price, stock, image, description } = req.body;

  if (!name || !category || !price) {
    return res
      .status(400)
      .json({ message: "Name, category, and price are required" });
  }

  const product = await Product.create({
    name,
    category,
    price,
    stock: stock ?? 10,
    image: image || "",
    description: description || "",
  });

  res.status(201).json(product);
});

// PUT /api/products/:id
// Update a product (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, category, price, stock, image, description } = req.body;

  product.name = name ?? product.name;
  product.category = category ?? product.category;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.image = image ?? product.image;
  product.description = description ?? product.description;

  const updated = await product.save();
  res.json(updated);
});

// DELETE /api/products/:id
// Delete a product (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted" });
});

module.exports = router;
