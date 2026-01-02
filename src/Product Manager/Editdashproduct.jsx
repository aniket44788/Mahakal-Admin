import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function Editdashproduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    templeAddress: "",
    templePrasadTitle: "",
    templePrasadDescription: "",
    templePrasadPrice: "",
    templePrasadDiscountPrice: "",
    templePrasadMaterial: "",
    templePrasadRating: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/dashboard/product/get/${id}`
        );
        const data = res.data.data;

        setFormData({
          templeAddress: data.templeAddress || "",
          templePrasadTitle: data.templePrasadTitle || "",
          templePrasadDescription: data.templePrasadDescription || "",
          templePrasadPrice: data.templePrasadPrice || "",
          templePrasadDiscountPrice: data.templePrasadDiscountPrice || "",
          templePrasadMaterial: Array.isArray(data.templePrasadMaterial)
            ? data.templePrasadMaterial.join(", ")
            : data.templePrasadMaterial || "",
          templePrasadRating: data.templePrasadRating || "",
        });

        setExistingImages(data.templeImages || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle new images
  const handleNewImages = (e) => {
    setNewImages([...e.target.files]);
  };

  // Toggle remove image
  const toggleRemoveImage = (public_id) => {
    setRemoveImages((prev) =>
      prev.includes(public_id)
        ? prev.filter((id) => id !== public_id)
        : [...prev, public_id]
    );
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      removeImages.forEach((id) => {
        data.append("removeImages[]", id);
      });

      newImages.forEach((img) => {
        data.append("templeImages", img);
      });

      await axios.patch(
        `${import.meta.env.VITE_URL}/dashboard/product/update/${id}`,
        data
      );

      alert("✅ Product updated successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Admin
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Edit Temple Product
          </h2>
          <p className="text-sm text-slate-500">
            Update product details and manage images.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                name="templePrasadTitle"
                value={formData.templePrasadTitle}
                onChange={handleChange}
                placeholder="Product title"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Address
              </label>
              <input
                name="templeAddress"
                value={formData.templeAddress}
                onChange={handleChange}
                placeholder="Temple address"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="templePrasadDescription"
              value={formData.templePrasadDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Product description"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                type="number"
                name="templePrasadPrice"
                value={formData.templePrasadPrice}
                onChange={handleChange}
                placeholder="Original price"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Discount Price
              </label>
              <input
                type="number"
                name="templePrasadDiscountPrice"
                value={formData.templePrasadDiscountPrice}
                onChange={handleChange}
                placeholder="Discounted price"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Material / Ingredients
            </label>
            <textarea
              name="templePrasadMaterial"
              value={formData.templePrasadMaterial}
              onChange={handleChange}
              placeholder="Material or ingredients"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Rating (1-5)
            </label>
            <input
              type="number"
              name="templePrasadRating"
              value={formData.templePrasadRating}
              onChange={handleChange}
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Existing Images */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-slate-700">
              Existing Images
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((img) => (
                <div key={img.public_id} className="relative rounded-lg overflow-hidden">
                  <img
                    src={img.url}
                    alt=""
                    className={`h-24 w-full object-cover border-2 ${
                      removeImages.includes(img.public_id)
                        ? "border-red-500 opacity-50"
                        : "border-slate-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleRemoveImage(img.public_id)}
                    className="absolute bottom-1 right-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white transition hover:bg-black/90"
                  >
                    {removeImages.includes(img.public_id) ? "Undo" : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New Images */}
          <div className="mt-6">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImages}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Editdashproduct;
