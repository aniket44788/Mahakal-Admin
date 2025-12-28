import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // const res = await axios.post(`${import.meta.env.VITE_URL}admin/login`, {
            const res = await axios.post(`${import.meta.env.VITE_URL}/admin/login`, {
                email,
                password,
            });

            // Store token
            localStorage.setItem("MahakalToken", res.data.MahakalToken);
            console.log(res.data.MahakalToken)

            setMessage({ type: "success", text: res.data.message });
            setEmail("");
            setPassword("");

            // ✅ Navigate to dashboard after login
            navigate("/");
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Login failed",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                <h2>email - darkpanda44788@gmail.com</h2>
                <h3> password - AaviDon@000</h3>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded ${message.type === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
