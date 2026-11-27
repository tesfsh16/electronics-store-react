import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder, initializeChapaPayment } from "../api";

const DELIVERY_FEE = 100;

function Checkout() {
  const { cartItem, clearCart } = useContext(CartContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Shipping address form state
  const [form, setForm] = useState({
    fullName: currentUser?.name || "",
    phone: "",
    city: "Addis Ababa",
    address: "",
  });

  // "cod" = Cash on Delivery, "chapa" = pay online
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useMemo(
    () => cartItem.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItem]
  );

  // If the user somehow lands here with an empty cart, send them back
  if (cartItem.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Go Shopping
        </Link>
      </div>
    );
  }

  // If not logged in, ask the user to log in first
  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Please log in to checkout</h2>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Log In
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.phone || !form.address) {
      setError("Phone number and address are required.");
      return;
    }

    setLoading(true);

    try {
      // Build the order items list in the shape the server expects
      const items = cartItem.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // 1. Place the order in our database
      const order = await placeOrder({
        items,
        shippingAddress: form,
        paymentMethod,
        deliveryFee: DELIVERY_FEE,
      });

      // 2a. Cash on Delivery: go straight to confirmation
      if (paymentMethod === "cod") {
        clearCart();
        navigate(`/order/${order._id}`);
        return;
      }

      // 2b. Chapa: ask our server to start the Chapa payment
      // Our server talks to Chapa and returns a checkout URL
      const { checkoutUrl } = await initializeChapaPayment(order._id);
      clearCart();
      // Send the user to Chapa's payment page
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* ── Left: Shipping form ── */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shipping address */}
          <section className="bg-white rounded-lg shadow p-4 space-y-3">
            <h2 className="font-semibold text-lg">Shipping Address</h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="Abebe Girma"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="09xxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option>Addis Ababa</option>
                <option>Dire Dawa</option>
                <option>Hawassa</option>
                <option>Mekelle</option>
                <option>Gondar</option>
                <option>Bahir Dar</option>
                <option>Jimma</option>
                <option>Adama</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="Bole, near Atlas Hotel"
              />
            </div>
          </section>

          {/* Payment method */}
          <section className="bg-white rounded-lg shadow p-4 space-y-3">
            <h2 className="font-semibold text-lg">Payment Method</h2>

            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium">💵 Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when you receive</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="chapa"
                checked={paymentMethod === "chapa"}
                onChange={() => setPaymentMethod("chapa")}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium">📱 Chapa (Telebirr, CBE, Card)</p>
                <p className="text-sm text-gray-500">
                  Pay online via Chapa — supports all Ethiopian banks and
                  Telebirr
                </p>
              </div>
            </label>
          </section>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Placing order..."
              : paymentMethod === "chapa"
              ? "Pay with Chapa →"
              : "Place Order →"}
          </button>
        </form>
      </div>

      {/* ── Right: Order summary ── */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          {cartItem.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.name}{" "}
                <span className="text-gray-400">× {item.quantity}</span>
              </span>
              <span className="font-medium">
                ETB {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>ETB {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery fee</span>
              <span>ETB {DELIVERY_FEE.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>ETB {(subtotal + DELIVERY_FEE).toLocaleString()}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Delivery within 2–5 business days inside Ethiopia
        </p>
      </div>
    </div>
  );
}

export default Checkout;
