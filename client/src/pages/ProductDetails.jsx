import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { fetchProductById } from "../api";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <p className="text-gray-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 grid md:grid-cols-2 gap-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded-lg"
      />

      <div>
        <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-4">
          {product.category}
        </span>

        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <p className="text-gray-600 mb-4">{product.description}</p>

        <p className="text-3xl text-blue-600 font-bold mb-2">
          ETB {product.price.toLocaleString()}
        </p>

        <p className="text-sm mb-6">
          {product.stock > 0 ? (
            <span className="text-green-600">{product.stock} in stock</span>
          ) : (
            <span className="text-red-500">Out of stock</span>
          )}
        </p>

        {product.stock > 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-gray-500 px-6 py-3 rounded cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
