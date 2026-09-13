import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";
import { useEffect, useState } from "react";
import type { Review } from "../types/review";
import api from "../api/axios";

function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const fetchReviews = async () => {
    const res = await api.get(`/reviews/product/${id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get("/products");
        const found = res.data.find((p: Product) => p.id === Number(id));
        setProduct(found || null);
      } catch (err: any) {
        setError("Ürün yüklenirken bir hata olustu");
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleReviewSumbit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    try {
      await api.post("/reviews", {
        productId: Number(id),
        rating,
        comment,
      });
      setComment("");
      fetchReviews();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || "Yorum eklenemedi");
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!product) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6 rounded border border-gray-200 bg-white p-4">
        {product.imageUrl && (
          <img
            src={`http://localhost:3000${product.imageUrl}`}
            alt={product.title}
            className="mb-3 h-64 w-full rounded object-contain"
          />
        )}
        <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
        <p className="text-gray-500">{product.description}</p>
        <p className="mt-2 text-xl font-bold text-blue-600">
          {product.price.toFixed(2)} TL
        </p>
        <button
          onClick={() => addToCart(product)}
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sepete Ekle
        </button>
      </div>
      <h2 className="mb-3 text-xl font-bold text-gray-800">Yorumlar</h2>
      {token && (
        <form onSubmit={handleReviewSumbit} className="mb-4 max-w-md space-y-2">
          {reviewError && <p className="text-red-600">{reviewError}</p>}
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Yıldız
              </option>
            ))}
          </select>

          <textarea
            placeholder="Yorumunuz"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            required
          />

          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Yorum Ekle
          </button>
        </form>
      )}
      <div className="space-y-3">
        {reviews.length === 0 && <p>Henüz yorum yapılmamış.</p>}
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded border border-gray-200 bg-white p-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {"⭐".repeat(review.rating)} — {review.user.email}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetail;
