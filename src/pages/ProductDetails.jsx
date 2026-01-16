import { useParams } from "react-router-dom";
import products from "../data/products";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
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
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <p className="text-gray-600 mb-4">{product.description}</p>

        <p className="text-2xl text-blue-500 font-bold mb-6">
          ${product.price}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
