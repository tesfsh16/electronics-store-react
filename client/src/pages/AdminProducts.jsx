import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const emptyForm = {
  name: "",
  category: "Laptop",
  price: "",
  stock: "",
  image: "",
  description: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const nextProducts = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setProducts(nextProducts);
        setLoading(false);
      },
      () => {
        setError("Failed to load products.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      category: product.category || "Laptop",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      description: product.description || "",
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));
    } catch {
      setError("Could not delete product.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (!payload.name || !payload.image || !payload.description) {
      setError("Name, image, and description are required.");
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(payload.price) || payload.price < 0) {
      setError("Price must be a valid positive number.");
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(payload.stock) || payload.stock < 0) {
      setError("Stock must be a valid positive number.");
      setSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch {
      setError("Failed to save product. Check Firestore rules.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Product Catalog</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 grid gap-3 md:grid-cols-2"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className="border rounded p-2"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="Laptop">Laptop</option>
          <option value="Phone">Phone</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border rounded p-2"
        />
        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border rounded p-2"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border rounded p-2 md:col-span-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="border rounded p-2 md:col-span-2"
        />

        {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70"
          >
            {submitting ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products yet. Add your first product.</p>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.category} - ${product.price} - Stock: {product.stock}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 rounded bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
