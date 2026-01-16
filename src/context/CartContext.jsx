import { createContext, useReducer, useEffect } from "react";

export const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "INCREASE_QTY":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case "DECREASE_QTY":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item)=>item.quantity > 0);

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cartItem, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItem));
  }, [cartItem]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const increaseQty = (id) => {
    dispatch({ type: "INCREASE_QTY", payload: id });
  };

  const decreaseQty = (id) => {
    dispatch({ type: "DECREASE_QTY", payload: id });
  };


  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  return (
    <CartContext.Provider value={{ cartItem, addToCart, removeFromCart, increaseQty, decreaseQty }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
