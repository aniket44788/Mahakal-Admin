import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) {
      setError("Product ID is required.");
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/products/single/${productId}`
        );
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setError("Failed to load product.");
        }
      } catch (err) {
        setError("Error fetching product. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-center shadow-sm max-w-md">
          <p className="text-base font-semibold text-rose-700">
            {error || "Product not found."}
          </p>
          <p className="mt-1 text-xs text-rose-500">
            Try refreshing or go back to products list.
          </p>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.discountPrice && product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
              <img
                src={product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.name}
                className="h-full w-full object-cover transition hover:scale-[1.02]"
              />
            </div>

            {/* Thumbnail gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-lg ring-1 ring-slate-200">
                    <img
                      src={img.url}
                      alt={`${product.name} ${idx + 2}`}
                      className="h-full w-full cursor-pointer object-cover transition hover:ring-2 hover:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {product.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {product.category}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-emerald-600">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-slate-900">
                    ₹{product.price}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  {discountPercentage}% off
                </span>
              )}
            </div>

            {/* Stock & availability */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <span className="font-semibold">Quantity:</span>
                <span>{product.quantity} {product.unit || "pcs"}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  product.isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {product.isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {product.rating?.average || 0} ({product.rating?.count || 0} reviews)
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.material && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  {product.material}
                </span>
              )}
              {product.deity && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {product.deity}
                </span>
              )}
              {product.occasion && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  {product.occasion}
                </span>
              )}
            </div>

            {/* Specs */}
            {(product.size || product.weight) && (
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                {product.size && (
                  <div>
                    <span className="font-medium text-slate-900">Size:</span>{" "}
                    {product.size}
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="font-medium text-slate-900">Weight:</span>{" "}
                    {product.weight}g
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                Add to Cart
              </button>
              <button className="flex-1 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Buy Now
              </button>
            </div>

            {/* Metadata */}
            <div className="pt-6 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex flex-wrap gap-4">
                <p>Added: {formatDate(product.createdAt)}</p>
                <p>Updated: {formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
