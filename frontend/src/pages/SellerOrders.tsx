import { useEffect, useState } from "react";
import type { Order } from "../types/order";
import api from "../api/axios";

function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/seller").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (orders.length === 0) return <p className="p-6">Henüz sipariş yok.</p>;
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Aldığım Siparişler
      </h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded border border-gray-200 bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">
                Sipariş #{order.id} — {order.buyer?.email}
              </p>
              <span
                className={`rounded px-2 py-1 text-xs font-semibold ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status === "paid" ? "Ödendi" : "Bekliyor"}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  {item.product.imageUrl && (
                    <img
                      src={`http://localhost:3000${item.product.imageUrl}`}
                      alt={item.product.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <p className="text-sm text-gray-600">
                    {item.product.title} x {item.quantity} adet
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerOrders;
