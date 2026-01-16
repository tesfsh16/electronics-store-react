import {Link} from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({product}){
  const {addToCart} = useContext(CartContext);
return (
  <div className="bg-white rounded-lg shadow hover:shadow-lg transition ">
    <Link to={`/product/${product.id}`}>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-lg "
      />
    </Link>
    <div className="p-4">
      <Link to={`/product/${product.id}`}>
        <h2 className="font-semibold text-lg">{product.name}</h2>
      </Link>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-accent font-bold mt-2">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-700"
      >
        Add to cart
      </button>
    </div>
  </div>
);
}

export default ProductCard;