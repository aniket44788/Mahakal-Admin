import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/dashboard/product/get`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL}/dashboard/product/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboardproductdetail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/product/update/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-600">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-center shadow-sm max-w-md">
          <p className="text-base font-semibold text-rose-700">{error}</p>
          <p className="mt-1 text-xs text-rose-500">
            Try reloading the page or check your API.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Admin
            </p>
            <h2 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Temple Products
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage all temple prasad and related items listed in the store.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Total Products
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {products.length}
            </p>
          </div>
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-12">
            <p className="text-sm text-slate-500">
              No products found. Start by creating a new temple product.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {item.templeImages && item.templeImages[0]?.url ? (
                    <img
                      src={item.templeImages[0].url}
                      alt={item.templePrasadTitle}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No Image
                    </div>
                  )}
                  {item.templePrasadRating && (
                    <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-amber-300">
                      ⭐ {item.templePrasadRating}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                    {item.templePrasadTitle}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {item.templeAddress}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{item.templePrasadDiscountPrice || item.templePrasadPrice}
                    </span>
                    {item.templePrasadDiscountPrice &&
                      item.templePrasadDiscountPrice < item.templePrasadPrice && (
                        <>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.templePrasadPrice}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Save ₹
                            {item.templePrasadPrice -
                              item.templePrasadDiscountPrice}
                          </span>
                        </>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(item._id)}
                      className="flex-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="flex-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardProducts;
