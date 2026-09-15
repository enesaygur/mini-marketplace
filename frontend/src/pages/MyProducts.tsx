import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import api from "../api/axios";
import { Link } from "react-router-dom";

function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/mine");
      setProducts(res.data);
    } catch (err: any) {
      setError("Ürünler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    if (!confirm("Bunu silmek istediginizden emin misiniz?")) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: false } : p)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Silme işleminde bir hata olustu");
    }
  };

  const handleReactivate = async (productId: number) => {
    try {
      await api.put(`/products/${productId}`, { isActive: true });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: true } : p)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "İşlem başarısız");
    }
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Ürünlerim</h1>

      {products.length === 0 && <p>Henüz ürün eklemediniz.</p>}
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <p className="font-semibold">
                {product.title}{" "}
                {!product.isActive && (
                  <span className="text-xs text-gray-400">(Pasif)</span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {product.price.toFixed(2)} TL
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/edit-product/${product.id}`}
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                Düzenle
              </Link>
              {product.isActive ? (
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Sil
                </button>
              ) : (
                <button
                  onClick={() => handleReactivate(product.id)}
                  className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                >
                  Tekrar Aktif Et
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProducts;
