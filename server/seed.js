/*
  Seed script: fills the database with starter data.
  Run with: npm run seed
*/
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");

const products = [
  // Laptops - prices in ETB
  { name: "MacBook Pro 14", category: "Laptop", price: 165000, stock: 5, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800", description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD storage." },
  { name: "Dell XPS 13", category: "Laptop", price: 115000, stock: 7, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop", description: "Intel Core i7, 16GB RAM, InfinityEdge display." },
  { name: "ASUS ROG Gaming", category: "Laptop", price: 148000, stock: 4, image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800", description: "RTX 3070, 144Hz Display, 1TB SSD." },
  { name: "HP Spectre x360", category: "Laptop", price: 102000, stock: 6, image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?q=80&w=800", description: "2-in-1 Laptop, Touchscreen, Elegant design." },
  { name: "Lenovo ThinkPad X1", category: "Laptop", price: 131000, stock: 3, image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800", description: "Business leader: Durable, great keyboard." },

  // Phones
  { name: "iPhone 15 Pro", category: "Phone", price: 125000, stock: 8, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800", description: "Titanium design, A17 Pro chip, Pro camera system." },
  { name: "Samsung Galaxy S24", category: "Phone", price: 98000, stock: 10, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800", description: "AI Features, S-Pen included, 200MP Camera." },
  { name: "Google Pixel 8 Pro", category: "Phone", price: 82000, stock: 6, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800", description: "Best Android camera, Tensor G3, Smart features." },
  { name: "OnePlus 12 Pro", category: "Phone", price: 68000, stock: 9, image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=800", description: "Fastest charging, Hasselblad camera, 120Hz." },
  { name: "Modern Smartphone", category: "Phone", price: 55000, stock: 12, image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800", description: "Elegant design, OLED display, 5G support." },

  // Accessories
  { name: "Sony Headphones", category: "Accessories", price: 32000, stock: 15, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800", description: "Industry-leading noise cancellation." },
  { name: "Smart Watch Elite", category: "Accessories", price: 24000, stock: 20, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800", description: "Health tracking, GPS, waterproof." },
  { name: "Logitech Pro Mouse", category: "Accessories", price: 8500, stock: 30, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800", description: "Ergonomic design, ultra-fast scrolling." },
  { name: "Wireless Buds", category: "Accessories", price: 16000, stock: 25, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800", description: "Active Noise Cancellation, deep bass." },
  { name: "4K Monitor Pro", category: "Accessories", price: 41000, stock: 8, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800", description: "Crystal clear 4K resolution, HDR10." },
  { name: "iPad Air Pro", category: "Accessories", price: 49000, stock: 7, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800", description: "M2 chip, Liquid Retina display." },
  { name: "PlayStation Controller", category: "Accessories", price: 5800, stock: 18, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800", description: "Next-gen haptic feedback for gaming." },
  { name: "Mechanical Keyboard", category: "Accessories", price: 10500, stock: 22, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800", description: "RGB lighting, tactile feedback." },
  { name: "Action Camera 4K", category: "Accessories", price: 24000, stock: 10, image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800", description: "Waterproof, stabilizes every shot." },
  { name: "Amazon Kindle", category: "Accessories", price: 12000, stock: 14, image: "https://images.unsplash.com/photo-1544822681-39f5bb4a03c5?q=80&w=800", description: "Paper-like display, holds thousands of books." },
];

async function seed() {
  await connectDB();

  // Clear old data
  await Product.deleteMany();
  await User.deleteMany();

  // Insert products
  await Product.insertMany(products);
  console.log(`Inserted ${products.length} products`);

  // Create the admin account
  const admin = await User.create({
    name: "Store Admin",
    email: process.env.ADMIN_EMAIL || "admin@estore.com",
    password: process.env.ADMIN_PASSWORD || "admin1234",
    role: "admin",
  });
  console.log(`Admin account created: ${admin.email}`);
  console.log("Password: admin1234 (change it after first login!)");

  await mongoose.connection.close();
  console.log("Seeding done.");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
