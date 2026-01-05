import { useContext } from "react";
import { cartContext } from "../context/CartContext";

function ProductCard({product}){
  const {addToCart} = useContext(cartContext);
return(
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <img 
      src={product.image}
      alt={product.name}
      className="w-full h-40 object-cover rounded-t-lg"
       />
  <div className="p-4">
    <h2 className="font-semibold text-lg">
    {product.name}
    </h2>
    <p className="text-sm text-gray-600">
        {product.description}
    </p>
    <p className="text-accent font-bold mt-2">
        ${product.price}
    </p>
  </div>
    </div>
);
}

export default ProductCard;