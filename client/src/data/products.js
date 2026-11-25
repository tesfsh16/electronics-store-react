const products = [
  // Laptops (1-5)
  {
    id: 1,
    name: "MacBook Pro 14",
    category: "Laptop",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
    description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD storage.",
  },
  {
    id: 2,
    name: "Dell XPS 13",
    category: "Laptop",
    price: 1399,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
    description: "Intel Core i7, 16GB RAM, InfinityEdge display.",
  },
  {
    id: 3,
    name: "ASUS ROG Gaming",
    category: "Laptop",
    price: 1799,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop",
    description: "RTX 3070, 144Hz Display, 1TB SSD.",
  },
  {
    id: 4,
    name: "HP Spectre x360",
    category: "Laptop",
    price: 1249,
    image:
      "https://images.unsplash.com/photo-1544731612-de7f96afe55f?q=80&w=800&auto=format&fit=crop",
    description: "2-in-1 Laptop, Touchscreen, Elegant design.",
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1",
    category: "Laptop",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
    description: "Business leader: Durable, great keyboard.",
  },

  // Phones (6-10)
  {
    id: 6,
    name: "iPhone 15 Pro",
    category: "Phone",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    description: "Titanium design, A17 Pro chip, Pro camera system.",
  },
  {
    id: 7,
    name: "Samsung Galaxy S24",
    category: "Phone",
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
    description: "AI Features, S-Pen included, 200MP Camera.",
  },
  {
    id: 8,
    name: "Google Pixel 8 Pro",
    category: "Phone",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
    description: "Best Android camera, Tensor G3, Smart features.",
  },
  {
    id: 9,
    name: "OnePlus 12 Pro",
    category: "Phone",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=800&auto=format&fit=crop",
    description: "Fastest charging, Hasselblad camera, 120Hz.",
  },
  {
    id: 10,
    name: "Modern Smartphone",
    category: "Phone",
    price: 649,
    image:
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop",
    description: "Elegant design, OLED display, 5G support.",
  },

  // Accessories (11-20)
  {
    id: 11,
    name: "Sony Headphones",
    category: "Accessories",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    description: "Industry-leading noise cancellation.",
  },
  {
    id: 12,
    name: "Smart Watch Elite",
    category: "Accessories",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    description: "Health tracking, GPS, waterproof.",
  },
  {
    id: 13,
    name: "Logitech Pro Mouse",
    category: "Accessories",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    description: "Ergonomic design, ultra-fast scrolling.",
  },
  {
    id: 14,
    name: "Wireless Buds",
    category: "Accessories",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
    description: "Active Noise Cancellation, deep bass.",
  },
  {
    id: 15,
    name: "4K Monitor Pro",
    category: "Accessories",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    description: "Crystal clear 4K resolution, HDR10.",
  },
  {
    id: 16,
    name: "iPad Air Pro",
    category: "Accessories",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
    description: "M2 chip, Liquid Retina display.",
  },
  {
    id: 17,
    name: "PlayStation Controller",
    category: "Accessories",
    price: 69,
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
    description: "Next-gen haptic feedback for gaming.",
  },
  {
    id: 18,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop",
    description: "RGB lighting, tactile feedback.",
  },
  {
    id: 19,
    name: "Action Camera 4K",
    category: "Accessories",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800&auto=format&fit=crop",
    description: "Waterproof, stabilizes every shot.",
  },
  {
    id: 20,
    name: "Amazon Kindle",
    category: "Accessories",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1544822681-39f5bb4a03c5?q=80&w=800&auto=format&fit=crop",
    description: "Paper-like display, holds thousands of books.",
  },
];

export default products;
