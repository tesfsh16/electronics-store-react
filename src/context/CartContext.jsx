import { useCallback } from "react";
import { createContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

const initialState = [];

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

    case "SET_CART":
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItem, dispatch] = useReducer(cartReducer, initialState);
  const cartKey = currentUser?.uid ? `cart_${currentUser.uid}` : "cart_guest";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    dispatch({ type: "SET_CART", payload: storedCart });
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItem));
  }, [cartItem, cartKey]);

  const addToCart = useCallback((product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  }, []);

  const increaseQty = useCallback((id) => {
    dispatch({ type: "INCREASE_QTY", payload: id });
  },[]);

  const decreaseQty =useCallback((id) => {
    dispatch({ type: "DECREASE_QTY", payload: id });
  },[]);


  const removeFromCart = useCallback((id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  }, []);

  return (
    <CartContext.Provider value={{ cartItem, addToCart, removeFromCart, increaseQty, decreaseQty }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
