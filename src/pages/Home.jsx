import { useState } from 'react';
import products from '../data/products'
import ProductCard from '../components/ProductCard';
function Home(){
    const [searchItem , setSearchItem] = useState("");
    const [selectedCatagory , setSelectedCatgory] = useState("All")

const filteredProducts = products.filter((product)=>{
  const matchsSearch = product.name
  .toLowerCase()
  .includes(searchItem.toLowerCase());
  const machesCategory = selectedCatagory==="All" || product.category === selectedCatagory
  return matchsSearch && machesCategory 
});

    
return (
  <div className="max-w-7x1 mx-auto px-4 py-8">
    <input
      type="text"
      placeholder="Search products..."
      value={searchItem}
      onChange={(e) => setSearchItem(e.target.value)}
      className="w-full md:w-1/2 p-2 border rounded"
    />
    <div className="flex gap-4 mt-4">
      {["All", "Laptop", "Phone", "Accessories"].map((catagory) => (
        <button
          key={catagory}
          onClick={() => setSelectedCatgory(catagory)}
          className={`px-4 py-2 rounded ${
            selectedCatagory === catagory
              ? "bg-accent text-white"
              : "bg-gray-200"
          }`}
        >
          {catagory}
        </button>
      ))}
    </div>

    <h1 className="text-2x1 font-bold mb-6">Latest Electronics</h1>

    <div className="grid grid-cols-1  sm:grid-cols-2 md:gird-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

}
export default Home;