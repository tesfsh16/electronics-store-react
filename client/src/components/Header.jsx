import { Link } from "react-router-dom";
import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { cartItem } = useContext(CartContext);
  const { currentUser, isAdmin, logout } = useAuth();

  const totalItems = useMemo(() => {
    return cartItem.reduce((total, item) => total + item.quantity, 0);
  }, [cartItem]);

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold hover:underline">
        Tesfsh Electronics
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        {!currentUser ? (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/my-orders" className="hover:text-gray-300">
              My Orders
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin/products"
                  className="hover:text-gray-300"
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="hover:text-gray-300"
                >
                  Orders
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={logout}
              className="hover:text-gray-300"
            >
              Logout ({currentUser.name})
            </button>
          </>
        )}

        <Link to="/cart" className="relative ml-2">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
