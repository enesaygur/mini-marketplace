import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err: any) {
        setError("Ürünler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Ürünler</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              {product.imageUrl && (
                <img
                  src={`http://localhost:3000${product.imageUrl}`}
                  // src={product.imageUrl}
                  alt={product.title}
                  className="mb-2 h-40 w-auto mx-auto rounded object-cover"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {product.title}
              </h2>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="mt-2 font-bold text-blue-600">
                Fiyat: {product.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                Satıcı: {product.seller.email}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Products;
