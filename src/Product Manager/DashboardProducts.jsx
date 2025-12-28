import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function DashboardProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate()
    // ✅ Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/dashboard/product/get`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch products");
                }

                console.log("Full API Response:", data); // Log full response for debugging
                setProducts(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // ✅ Delete Product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await fetch(`${import.meta.env.VITE_URL}/dashboard/product/delete/${id}`, {
                method: "DELETE",
            });

            setProducts(products.filter((item) => item._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleViewDetails = (id) => {
        console.log(id)
        navigate(`/dashboardproductdetail/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/product/update/${id}`)
    };


    if (loading) return <p>Loading products...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Temple Products</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >
                {products.map((item) => (
                    <div
                        key={item._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            backgroundColor: "#fff"
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: "10px" }}>
                            <img
                                src={item.templeImages[0]?.url}
                                alt={item.templePrasadTitle}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    marginBottom: "10px"
                                }}
                            />
                        </div>
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2em" }}>
                            {item.templePrasadTitle}
                        </h3>
                        <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                            <strong>Address:</strong> {item.templeAddress}
                        </p>
                        <p style={{ margin: "0 0 10px 0", fontSize: "1.1em", fontWeight: "bold" }}>
                            Original: ₹{item.templePrasadPrice}
                        </p>
                        <p style={{ margin: "0 0 10px 0", color: "green", fontSize: "1.1em", fontWeight: "bold" }}>
                            Discount: ₹{item.templePrasadDiscountPrice}
                        </p>
                        <p style={{ margin: "0 0 15px 0", color: "#f39c12" }}>
                            Rating: {item.templePrasadRating} ⭐
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button
                                onClick={() => handleViewDetails(item._id)}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#3498db",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => handleEdit(item._id)}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#f39c12",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default DashboardProducts;