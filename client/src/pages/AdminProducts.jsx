import { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api";

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

  // Load products from our backend on page open
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
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
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      // Remove from local state so the UI updates instantly
      setProducts((prev) => prev.filter((p) => p._id !== id));
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
      category: form.category,
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
        const updated = await updateProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? updated : p))
        );
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin — Product Catalog</h1>

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
          placeholder="Price in ETB"
          className="border rounded p-2"
        />
        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock quantity"
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

        {error && (
          <p className="text-red-500 text-sm md:col-span-2">{error}</p>
        )}

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70"
          >
            {submitting
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Products ({products.length})
        </h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products yet. Add your first product above.</p>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.category} · ETB {product.price.toLocaleString()} ·
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
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
