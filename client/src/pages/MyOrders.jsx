import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../api";

const statusStyles = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You have no orders yet.</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Order info */}
                <div>
                  <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-ET", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="font-bold mt-1">
                    ETB {order.totalPrice.toLocaleString()}
                  </p>
                </div>

                {/* Status + link */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyles[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View details →
                  </Link>
                </div>
              </div>

              {/* Item thumbnails */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {order.items.map((item, index) => (
                  <img
                    key={index}
                    src={item.image}
                    alt={item.name}
                    title={item.name}
                    className="w-12 h-12 object-cover rounded border flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
