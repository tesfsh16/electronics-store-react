import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// 1️⃣ Create Context
const AuthContext = createContext();

// 2️⃣ Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  // Listen to Firebase auth state. If init fails, do not block the whole UI.
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
    } catch (error) {
      console.error("Auth listener initialization failed:", error);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // 4️⃣ Logout Function
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    isAdmin:
      !!currentUser?.email &&
      adminEmails.includes(currentUser.email.toLowerCase()),
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 5️⃣ Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}
