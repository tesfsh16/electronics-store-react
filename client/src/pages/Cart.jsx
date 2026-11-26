import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
  const { cartItem, removeFromCart, increaseQty, decreaseQty } =
    useContext(CartContext);

  const totalPrice = useMemo(() => {
    return cartItem.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItem]);

  if (cartItem.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Your Cart Is Empty</h2>
        <Link
          to="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cartItem.map((item) => (
        <div
          key={item.productId}
          className="flex justify-between items-center mb-4 border-b pb-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-blue-600 font-bold">
                ETB {(item.price * item.quantity).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                ETB {item.price.toLocaleString()} each
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => decreaseQty(item.productId)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="font-semibold w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQty(item.productId)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-500 ml-4 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right mt-6 border-t pt-4">
        <p className="text-gray-500 text-sm mb-1">
          + ETB 100 delivery fee will be added at checkout
        </p>
        <h3 className="text-xl font-bold">
          Subtotal: ETB {totalPrice.toLocaleString()}
        </h3>
        <Link
          to="/checkout"
          className="mt-4 inline-block bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
