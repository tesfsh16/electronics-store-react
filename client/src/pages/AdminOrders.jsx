import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from "../api";

const statuses = ["processing", "shipped", "delivered", "cancelled"];

const statusStyles = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Admin changes a delivery status -> update the server + the local list
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updated : order))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin — Orders</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order info */}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                  <p className="font-semibold mt-1">
                    {order.user?.name || "Unknown customer"}
                    <span className="text-gray-400 font-normal text-sm ml-2">
                      {order.user?.email}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-ET")} ·{" "}
                    {order.items.length} item(s)
                  </p>
                  <p className="font-bold mt-1">
                    ETB {order.totalPrice.toLocaleString()}
                    <span
                      className={`ml-3 text-xs px-2 py-1 rounded-full ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentMethod === "chapa"
                        ? `Chapa (${order.paymentStatus})`
                        : "Cash on Delivery"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    📞 {order.shippingAddress.phone} ·{" "}
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </p>
                </div>

                {/* Status control */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border rounded p-2 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
