import { useCallback } from "react";
import { createContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

const initialState = [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        return state.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "INCREASE_QTY":
      return state.map((item) =>
        item.productId === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case "DECREASE_QTY":
      return state
        .map((item) =>
          item.productId === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.productId !== action.payload);

    case "SET_CART":
      return action.payload;

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItem, dispatch] = useReducer(cartReducer, initialState);
  // Each user has their own cart, guests share one "guest cart"
  const cartKey = currentUser?._id ? `cart_${currentUser._id}` : "cart_guest";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    dispatch({ type: "SET_CART", payload: storedCart });
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItem));
  }, [cartItem, cartKey]);

  const addToCart = useCallback((product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      },
    });
  }, []);

  const increaseQty = useCallback((productId) => {
    dispatch({ type: "INCREASE_QTY", payload: productId });
  }, []);

  const decreaseQty = useCallback((productId) => {
    dispatch({ type: "DECREASE_QTY", payload: productId });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItem, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
