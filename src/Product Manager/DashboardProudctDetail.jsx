import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ChevronLeft,
    Image as ImageIcon,
    Edit3,
    Trash2,
    Star,
    Package,
    MapPin,
    DollarSign,
} from "lucide-react";
import axios from "axios";

function DashboardProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${import.meta.env.VITE_URL}/dashboard/product/get/${id}`
                );

                setProduct(res.data.data);
            } catch (err) {
                setError("Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Loading
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

    // Error
    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <Package className="w-16 h-16 text-slate-400 mb-4" />
                <h2 className="text-xl font-semibold text-slate-800 mb-1">
                    {error || "Product not found"}
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    The product you're looking for doesn't exist or has been removed.
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 py-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                            aria-label="Back"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Package className="h-6 w-6 text-indigo-600" />
                            <h1 className="text-xl font-semibold text-slate-900">
                                {product.templePrasadTitle}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Images */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 lg:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Main Image */}
                                    <div>
                                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50">
                                            {product.templeImages?.length ? (
                                                <img
                                                    src={product.templeImages[activeImage]?.url}
                                                    alt={product.templePrasadTitle}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                                    <ImageIcon className="h-16 w-16 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    <div className="space-y-3">
                                        {product.templeImages?.map((img, i) => (
                                            <div
                                                key={img._id || i}
                                                className="relative aspect-square cursor-pointer overflow-hidden rounded-xl ring-2 ring-slate-100 hover:ring-indigo-200 transition-all"
                                                onClick={() => setActiveImage(i)}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt=""
                                                    className={`h-full w-full object-cover ${activeImage === i
                                                            ? "ring-4 ring-indigo-500/50"
                                                            : ""
                                                        }`}
                                                />
                                                {activeImage === i && (
                                                    <div className="absolute inset-0 bg-indigo-500/20" />
                                                )}
                                            </div>
                                        ))}
                                        {product.templeImages?.length === 0 && (
                                            <div className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
                                                No images
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.templePrasadDescription && (
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-indigo-600" />
                                    Description
                                </h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {product.templePrasadDescription}
                                </p>
                            </div>
                        )}

                        {/* Ingredients */}
                        {product.templePrasadMaterial && (
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-emerald-600" />
                                    Ingredients
                                </h3>
                                {Array.isArray(product.templePrasadMaterial) ? (
                                    <ul className="space-y-2">
                                        {product.templePrasadMaterial.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-700">
                                                <div className="h-2 w-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-600">{product.templePrasadMaterial}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
                        {/* Product Summary */}
                        <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-3xl border border-indigo-100 p-6 shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-2xl">
                                        <Package className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {product.templePrasadTitle}
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            {product.templeAddress}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 p-3 bg-white/50 rounded-2xl">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < (product.templePrasadRating || 0)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-slate-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">
                                        {product.templePrasadRating || 0}/5
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                    <div className="space-y-1">
                                        <div className="flex items-baseline gap-2">
                                            <DollarSign className="h-6 w-6 text-emerald-600" />
                                            <span className="text-2xl font-bold text-slate-900">
                                                ₹{product.templePrasadDiscountPrice || product.templePrasadPrice}
                                            </span>
                                            {product.templePrasadDiscountPrice && product.templePrasadPrice && (
                                                <span className="text-lg text-slate-500 line-through">
                                                    ₹{product.templePrasadPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button className="group flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5">
                                        <Edit3 className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                                        Edit Product
                                    </button>
                                    <button className="group flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-600 hover:shadow-md hover:-translate-y-0.5">
                                        <Trash2 className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Images</span>
                                    <span className="font-semibold text-slate-900">
                                        {product.templeImages?.length || 0}
                                    </span>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Status</span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardProductDetail;
