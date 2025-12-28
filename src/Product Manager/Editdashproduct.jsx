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

    /* ================= FETCH EXISTING PRODUCT ================= */
    useEffect(() => {
        const fetchProduct = async () => {
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
        };

        fetchProduct();
    }, [id]);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNewImages = (e) => {
        setNewImages([...e.target.files]);
    };

    const toggleRemoveImage = (public_id) => {
        setRemoveImages((prev) =>
            prev.includes(public_id)
                ? prev.filter((id) => id !== public_id)
                : [...prev, public_id]
        );
    };

    /* ================= UPDATE PRODUCT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            // text fields
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== "") {
                    data.append(key, formData[key]);
                }
            });

            // remove images
            removeImages.forEach((id) => {
                data.append("removeImages[]", id);
            });

            // new images
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

    /* ================= UI ================= */
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Temple Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="templePrasadTitle"
                    value={formData.templePrasadTitle}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-3 rounded"
                />

                <input
                    name="templeAddress"
                    value={formData.templeAddress}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full border p-3 rounded"
                />

                <textarea
                    name="templePrasadDescription"
                    value={formData.templePrasadDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Description"
                    className="w-full border p-3 rounded"
                />

                <input
                    type="number"
                    name="templePrasadPrice"
                    value={formData.templePrasadPrice}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full border p-3 rounded"
                />

                <input
                    type="number"
                    name="templePrasadDiscountPrice"
                    value={formData.templePrasadDiscountPrice}
                    onChange={handleChange}
                    placeholder="Discount Price"
                    className="w-full border p-3 rounded"
                />

                <textarea
                    name="templePrasadMaterial"
                    value={formData.templePrasadMaterial}
                    onChange={handleChange}
                    placeholder="Material / Ingredients"
                    className="w-full border p-3 rounded"
                />

                <input
                    type="number"
                    name="templePrasadRating"
                    value={formData.templePrasadRating}
                    onChange={handleChange}
                    placeholder="Rating (1-5)"
                    className="w-full border p-3 rounded"
                />

                {/* EXISTING IMAGES */}
                <div>
                    <h3 className="font-bold mb-2">Existing Images</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {existingImages.map((img) => (
                            <div key={img.public_id} className="relative">
                                <img
                                    src={img.url}
                                    alt=""
                                    className={`h-24 w-full object-cover rounded border-2 ${removeImages.includes(img.public_id)
                                            ? "border-red-500 opacity-40"
                                            : "border-gray-200"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleRemoveImage(img.public_id)}
                                    className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
                                >
                                    {removeImages.includes(img.public_id) ? "UNDO" : "REMOVE"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW IMAGES */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImages}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-600 text-white px-6 py-3 rounded font-semibold"
                >
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
}

export default Editdashproduct;
