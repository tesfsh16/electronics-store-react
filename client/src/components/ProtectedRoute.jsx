import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  ProtectedRoute: wraps pages that require the user to be logged in.
  If not logged in, redirects to /login and remembers where they
  wanted to go (via `state.from`) so we can send them back after login.
*/
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
