import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getMe } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if a token is saved in localStorage.
  // If it is, ask the backend who this user is.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((user) => setCurrentUser(user))
      .catch(() => {
        // Token is expired or invalid — clear it
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Register a new account, then log in automatically
  async function register(name, email, password) {
    const data = await registerUser(name, email, password);
    localStorage.setItem("token", data.token);
    setCurrentUser(data);
  }

  // Log in with email and password
  async function login(email, password) {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    setCurrentUser(data);
  }

  // Log out: clear the token and user from memory
  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    isAdmin: currentUser?.role === "admin",
    login,
    register,
    logout,
    loading,
  };

  // Don't render the app until we know if the user is logged in
  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
