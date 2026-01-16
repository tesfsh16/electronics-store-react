import { useParams } from "react-router-dom";
import products from "../data/products";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductDetails(){
    const {id} = useParams();
    const {addToCart} = useContext(CartContext);

    const product = product.find((item)=> item,id=== Number(id));

    if(!product){
        return  (
        <div className="p-8 text-center">
            <h2 className="text-x1 font-bold ">
                Product not found
        
            </h2>

        </div>
       );
    }

    return (
<div className="max-w-5x1 mx-auto p-8 grid md:grid-cols-2 gap-8">
    <img 
    src={product.image}
     alt={product.name}
     className="w-full rounded-lg"
     />

     <div>
        <h1 className="text-3x1 font-bold  mb-4">
            {product.name}
              </h1>
              <p className=" text-gray-600 mb-4">

              </p>
              <p className="text-2x1 text-accent font-bold mb-6">

              </p>

              <button onClick={()=> addToCart(product)}
                className="bg-accent text-white px-6 py-3 rounded hover:bg-blue-700">
                Add to Cart
              </button>
     </div>

</div>
    );

}
export default ProductDetails;