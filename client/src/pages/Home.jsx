import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";

function Home() {
  const [searchItem, setSearchItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { products, loading, error } = useProducts();

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((item) => item.category)));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchItem.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchItem, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <input
        type="text"
        placeholder="Search products..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        className="w-full md:w-1/2 p-2 border rounded"
      />

      <div className="flex gap-4 mt-4 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6 mt-6">Latest Electronics</h1>
      {error && (
        <p className="mb-4 text-sm text-amber-600">
          Live products are unavailable. Showing fallback products.
        </p>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;