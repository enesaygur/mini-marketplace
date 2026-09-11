import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import api from "../api/axios";

function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCreateOrder = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/orders", {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      const orderId = res.data.id;
      clearCart();
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Sipariş olusturulurken bir hata olustu",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <p className="p-6">Sepetiniz bos</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Sepetim</h1>
      {error && <p className="mb-3 text-red-600">{error}</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              {item.product.imageUrl && (
                <img
                  src={`http://localhost:3000${item.product.imageUrl}`}
                  alt={item.product.title}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{item.product.title}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} adet x {item.product.price.toFixed(2)} TL
                </p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-red-500 hover:text-red-700"
            >
              Kaldır
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xl font-bold">
        Toplam: {total.toFixed(2)} TL
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={loading}
        className="mt-4 w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Olusturuluyor..." : "Sipariş Olustur"}
      </button>
    </div>
  );
}

export default Cart;
