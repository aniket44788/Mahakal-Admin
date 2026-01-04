import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    quantity: "",
    unit: "piece",
    material: "",
    size: "",
    weight: "",
    language: "",
    deity: "",
    occasion: "",
    isAvailable: true,
  });

  const token = localStorage.getItem("MahakalToken");

  const categoryOptions = [
    "Prasad",
    "Pooja Samagri",
    "Rudraksha & Malas",
    "Dhup / Shankh",
    "Tulsi Mala",
    "Chandan",
    "Tabeez",
    "Books",
    "Mantra Books",
    "God Idols & Frames",
    "Kanwar Yatra Samagri",
    "Sindoor",
    "Roli",
    "Haldi",
    "Akshat (Chawal)",
    "Festival Kits",
    "Digital Items (Aarti / Video / Pen drive)",
    "Custom Tabeez",
  ];

  const unitOptions = ["piece", "pack", "gm", "kg", "ml", "set"];

  const checkTokenAndGetHeaders = () => {
    if (!token) {
      setError("No token found. Please login again.");
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/products/all`);
      setProducts(res.data.products || []);
      setCount(res.data.count || 0);
      setError("");
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setSelectedImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const buildFormData = () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value !== "" && value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });
    selectedImages.forEach((image) => {
      formDataToSend.append("images", image);
    });
    return formDataToSend;
  };

  const createProduct = async (e) => {
    e.preventDefault();
    const headers = checkTokenAndGetHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      const body = buildFormData();
      await axios.post(
        `${import.meta.env.VITE_URL}/createproduct`,
        body,
        { headers }
      );
      setSuccess("Product created successfully!");
      setShowCreateForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const headers = checkTokenAndGetHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      const body = buildFormData();
      await axios.patch(
        `${import.meta.env.VITE_URL}/products/update/${editingProduct._id}`,
        body,
        { headers }
      );
      setSuccess("Product updated successfully!");
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    if (!token) {
      setError("No token found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_URL}/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewProduct = (productId) => {
    navigate(`/single/${productId}`);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      discountPrice: "",
      quantity: "",
      unit: "piece",
      material: "",
      size: "",
      weight: "",
      language: "",
      deity: "",
      occasion: "",
      isAvailable: true,
    });
    setSelectedImages([]);
    setImagePreview([]);
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      quantity: product.quantity || "",
      unit: product.unit || "piece",
      material: product.material || "",
      size: product.size || "",
      weight: product.weight || "",
      language: product.language || "",
      deity: product.deity || "",
      occasion: product.occasion || "",
      isAvailable:
        product.isAvailable !== undefined ? product.isAvailable : true,
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowCreateForm(false);
    resetForm();
  };

  useEffect(() => {
    fetchProducts();
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center shadow-sm">
          <p className="text-base font-semibold text-amber-800">
            No token found. Please login first.
          </p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
          <p className="text-sm font-medium text-slate-600">
            Loading products dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header + stats */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, update, and manage all temple products from a single view.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Total Products
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {count}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-600/80">
                Available
              </p>
              <p className="mt-1 text-xl font-semibold text-emerald-800">
                {products.filter((p) => p.isAvailable).length}
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-700/90">
                Out of stock
              </p>
              <p className="mt-1 text-xl font-semibold text-indigo-900">
                {products.filter((p) => !p.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {(success || error) && (
          <div className="space-y-2">
            {success && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 shadow-sm">
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 shadow-sm">
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <span className="text-lg leading-none">＋</span>
              {showCreateForm ? "Close form" : "Add new product"}
            </button>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Products are shown with primary image, price, stock, and quick
            actions.
          </p>
        </div>

        {/* Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingProduct ? "Edit product" : "Create new product"}
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in product details and upload up to 5 images.
                </p>
              </div>
              {editingProduct && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs font-medium text-slate-500 underline hover:text-slate-700"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form
              onSubmit={editingProduct ? updateProduct : createProduct}
              className="space-y-5"
            >
              {/* Basic info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Product name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Discount price (₹)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {unitOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Additional details */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Material", name: "material" },
                  { label: "Size", name: "size" },
                  { label: "Weight (grams)", name: "weight", type: "number" },
                  { label: "Language", name: "language" },
                  { label: "Deity", name: "deity" },
                  { label: "Occasion", name: "occasion" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                      {f.label}
                    </label>
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              {/* Availability + images */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <label className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-medium">Product available</span>
                </label>

                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">
                    Product images (max 5)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  {imagePreview.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
                      {imagePreview.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="h-20 w-full rounded-lg border border-slate-200 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Processing…"
                    : editingProduct
                    ? "Update product"
                    : "Create product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Products table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              All products
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {count}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Edit, view, or delete products from the list.
            </p>
          </div>

          {loading && !products.length ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Available</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="bg-white transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-500">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <p className="max-w-xs truncate text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.deity || product.occasion || ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-middle text-sm text-slate-700">
                        {product.category || "N/A"}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="text-sm">
                          <span className="font-semibold text-slate-900">
                            ₹{product.price}
                          </span>
                          {product.discountPrice > 0 && (
                            <div className="text-xs text-emerald-600">
                              Discount: ₹{product.discountPrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle text-sm text-slate-800">
                        {product.quantity || 0}
                      </td>
                      <td className="px-4 py-3 align-middle text-sm text-slate-700">
                        {product.unit || "piece"}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                            product.isAvailable
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center align-middle">
                        <div className="inline-flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => viewProduct(product._id)}
                            className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
