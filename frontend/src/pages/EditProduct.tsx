import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types/product";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get("/products/mine");
        const product = res.data.find((p: Product) => p.id === Number(id));

        if (!product) {
          setError("Urun bulunamadi");
          return;
        }

        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCurrentImageUrl(product.imageUrl);
      } catch (err: any) {
        setError("Ürün yüklenirken bir hata olustu");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put(`/products/${id}`, {
        title,
        description,
        price: Number(price),
      });

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        await api.post(`/products/${id}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/my-products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ürün oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (error && !title) return <p className="p-6 text-red-600">{error}</p>;
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Ürünü Düzenle</h1>

      {error && <p className="mb-3 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md space-y-3">
        {(image || currentImageUrl) && (
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : `${currentImageUrl}`
            }
            alt={title}
            className="h-32 w-32 rounded object-cover"
          />
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />

        <input
          type="number"
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
          disabled={saving}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
