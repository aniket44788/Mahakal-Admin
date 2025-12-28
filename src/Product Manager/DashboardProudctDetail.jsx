import React, { useState, useEffect } from "react";
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

                setProduct(res.data.data); // ✅ FIXED
            } catch (err) {
                setError("Failed to fetch product");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
                Loading product...
            </div>
        );
    }

    /* ================= ERROR ================= */
    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Package className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg">{error || "Product not found"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
            {/* ================= HEADER ================= */}
            <div className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-orange-600" />
                        {product.templePrasadTitle}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* ================= LEFT ================= */}
                <div className="lg:col-span-3 space-y-8">
                    {/* ===== IMAGES ===== */}
                    <div className="bg-white p-8 rounded-3xl shadow">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Main Image */}
                            <div className="lg:w-2/3">
                                <div className="h-96 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                                    {product.templeImages?.length ? (
                                        <img
                                            src={product.templeImages[activeImage]?.url}
                                            alt="product"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="w-20 h-20 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="lg:w-1/3 space-y-3">
                                {product.templeImages?.map((img, i) => (
                                    <img
                                        key={img._id}
                                        src={img.url}
                                        onClick={() => setActiveImage(i)}
                                        className={`h-24 w-full object-cover rounded-xl cursor-pointer border-2 ${activeImage === i
                                            ? "border-orange-500"
                                            : "border-gray-200"
                                            }`}
                                        alt="thumb"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== DESCRIPTION ===== */}
                    <div className="bg-white p-8 rounded-3xl shadow">
                        <h3 className="text-xl font-bold mb-4">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {product.templePrasadDescription}
                        </p>
                    </div>

                    {/* ===== INGREDIENTS ===== */}
                    {product.templePrasadMaterial?.length > 0 && (
                        <div className="bg-white p-8 rounded-3xl shadow">
                            <h3 className="text-xl font-bold mb-4">Ingredients</h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {product.templePrasadMaterial.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT SIDEBAR ================= */}
                <div className="space-y-6">
                    <div className="bg-orange-50 p-8 rounded-3xl shadow sticky top-24">
                        <h2 className="text-2xl font-bold mb-4">
                            {product.templePrasadTitle}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < product.templePrasadRating
                                        ? "text-orange-500 fill-orange-500"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                            <span>{product.templePrasadRating}/5</span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-green-600">
                                    ₹{product.templePrasadDiscountPrice}
                                </span>
                            </div>
                            <span className="line-through text-gray-500">
                                ₹{product.templePrasadPrice}
                            </span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-orange-600" />
                            <span className="font-medium">{product.templeAddress}</span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-orange-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                                <Edit3 size={18} /> Edit
                            </button>
                            <button className="bg-gray-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardProductDetail;
