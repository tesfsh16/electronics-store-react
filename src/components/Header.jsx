import { Link } from "react-router-dom";
import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { cartItem } = useContext(CartContext);
  const { currentUser, logout } = useAuth();

  const totalItems = useMemo(() => {
    return cartItem.reduce((total, item) => total + item.quantity, 0);
  }, [cartItem]);

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center sticky top-0">
      <Link to="/" className="text-xl font-bold hover:underline">
        Tesfsh Electronics Store
      </Link>

      <div className="flex items-center gap-4">
        {!currentUser ? (
          <>
            <Link to="/login" className="text-sm hover:text-gray-300">
              Login
            </Link>
            <Link to="/signup" className="text-sm hover:text-gray-300">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="text-sm hover:text-gray-300"
          >
            Logout
          </button>
        )}

        <Link to="/cart" className="relative">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
export default Header;