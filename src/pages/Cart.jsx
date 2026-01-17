import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useMemo } from "react";

function Cart(){
const {cartItem , removeFromCart, increaseQty ,decreaseQty} = useContext(CartContext);

const totalPrice =useMemo(()=>{
  return cartItem.reduce(
  (total, item)=>total + item.price*item.quantity , 0 );
} , [cartItem]);


if(cartItem.length ===0){
return(
    <div className="p-8 text-center">
        <h2 className="text-x1 font-bold">
Your Cart Is Empty 
        </h2>

    </div>
)
}
return (
  <div className="max-w-4x1 mx-auto p-8">
    <h2 className="text-2x1 font-bold mb-6">Shopping cart</h2>
    {cartItem.map((item) => (
      <div
        key={item.id}
        className="flex justify-between items-center mb-4 border-b pb-4"
      >
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p className="text-blue-500 font-bold">
            ${item.price * item.quantity}
          </p>
        </div>
        <div className="flex item-center gap-3">
          <button
            onClick={() => decreaseQty(item.id)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            -
          </button>
          <span>{item.quantity}</span>

          <button
            onClick={() => increaseQty(item.id)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 ml-4"
          >
            Romove
          </button>
        </div>
      </div>
    ))}
    <div className="text-right mt-6">
        <h3 className="text-x1 font-bold">
            total: ${totalPrice.toFixed(2)}
               
        </h3>
    </div>
  </div>
);
}
export default Cart;