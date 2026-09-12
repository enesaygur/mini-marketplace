import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import type { Order } from "../types/order";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
      } catch (err: any) {
        setError("Siparişler yüklenirken bir hata olustu");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="p-6">Sipariş bulunamadı</p>;
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Siparişlerim</h1>

      <div className="space-y-3">
        {orders.map((order) => {
          const total = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded border border-gray-200 bg-white p-4 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Sipariş #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {order.items.length} ürün - {total.toFixed(2)} TL
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-sm font-semibold ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status === "paid" ? "Odendi" : "Odeme Bekleniyor"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
