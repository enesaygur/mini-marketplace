import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/products", {
        title,
        description,
        price: Number(price),
      });
      const productId = res.data.id;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        await api.post(`/products/${productId}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ürün oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Ürün Ekle</h1>
      {error && <p className="mb-3 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-md space-y-3">
        <input
          type="text"
          placeholder="Ürün Adı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />

        <textarea
          placeholder="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Fiyat"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Oluşturuluyor..." : "Ürün oluştur"}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
