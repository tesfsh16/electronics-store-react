import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrderById } from "../api";

// Badge colors for each order status
const statusStyles = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderById(id)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading order...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Order not found</h2>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-gray-600 mt-1">
          Order ID: <span className="font-mono">{order._id}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          We will contact you on{" "}
          <span className="font-semibold">{order.shippingAddress.phone}</span>{" "}
          to confirm the delivery.
        </p>
      </div>

      {/* Status badges */}
      <div className="flex justify-center gap-3 mb-8">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusStyles[order.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          Delivery: {order.status}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.paymentStatus === "paid"
              ? "bg-green-100 text-green-700"
              : order.paymentStatus === "failed"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Payment:{" "}
          {order.paymentMethod === "chapa" ? "Chapa" : "Cash on Delivery"} (
          {order.paymentStatus})
        </span>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ETB {item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>
            </div>
            <span className="font-semibold">
              ETB {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>
            ETB {(order.totalPrice - order.deliveryFee).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery fee</span>
          <span>ETB {order.deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total</span>
          <span>ETB {order.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Shipping info */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 text-sm">
        <h2 className="font-semibold mb-2">Deliver to</h2>
        <p className="text-gray-600">
          {order.shippingAddress.fullName} · {order.shippingAddress.phone}
        </p>
        <p className="text-gray-600">
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </p>
      </div>

      <div className="text-center">
        <Link
          to="/my-orders"
          className="text-blue-600 hover:underline font-medium"
        >
          View My Orders
        </Link>
        <span className="mx-2 text-gray-300">|</span>
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderDetails;
