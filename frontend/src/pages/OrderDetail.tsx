import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Order } from "../types/order";
import api from "../api/axios";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get("/orders");
        const found = res.data.find((o: Order) => o.id === Number(id));
        setOrder(found || null);
      } catch (err: any) {
        setError("Sipariş yüklenirken bir hata olustu");
      }
    };

    fetchOrder();
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    setError("");

    try {
      const res = await api.post(`/payments/checkout/${id}`);
      window.location.href = res.data.url;
    } catch (err: any) {
      setError(err.response?.data?.message || "Ödeme başlatılamadı");
      setPaying(false);
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!order) return <p className="p-6">Yükleniyor...</p>;

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Sipariş #{order.id}
      </h1>

      <p className="mb-4">
        Durum:{" "}
        <span
          className={`font-semibold ${
            order.status === "paid" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {order.status === "paid" ? "Ödendi" : "Ödeme Bekleniyor"}
        </span>
      </p>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="rounded border border-gray-200 bg-white p-4"
          >
            <p className="font-semibold">{item.product.title}</p>
            <p className="text-sm text-gray-500">
              {item.quantity} x {item.price.toFixed(2)} TL
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xl font-bold">
        Toplam: {total.toFixed(2)} TL
      </div>

      {order.status === "pending" && (
        <button
          onClick={handlePayment}
          disabled={paying}
          className="mt-4 w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {paying ? "Yönlendiriliyor..." : "Ödeme Yap"}
        </button>
      )}
    </div>
  );
}

export default OrderDetail;
