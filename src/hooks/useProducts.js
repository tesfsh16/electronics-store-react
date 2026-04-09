import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import fallbackProducts from "../data/products";

function useProducts() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        setError("");
        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        if (items.length > 0) {
          setProducts(items);
        } else {
          setProducts(fallbackProducts);
        }

        setLoading(false);
      },
      (firestoreError) => {
        console.error("Products read failed:", firestoreError);
        setError("Could not load products from database.");
        setProducts(fallbackProducts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}

export default useProducts;
