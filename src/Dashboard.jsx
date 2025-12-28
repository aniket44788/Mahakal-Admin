import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("MahakalToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/admin/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("MahakalToken");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setAdmin(data.admin);
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6 shadow-lg">
            <span className="text-4xl">🔱</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Mahakal Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Welcome back, <span className="font-semibold text-indigo-700">{admin?.name}</span></p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Admin Profile</h2>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Profile Details */}
              <div className="space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                    👤
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-semibold text-gray-800">{admin?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                    ✉️
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{admin?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                    🏅
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-lg font-semibold text-gray-800 uppercase">{admin?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                    📅
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined On</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(admin?.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                        🛡️
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${admin?.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                          }`}>
                          {admin?.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("MahakalToken");
                    navigate("/login");
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 text-center group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
            <p className="text-lg font-semibold text-gray-800">Manage Orders</p>
            <p className="text-sm text-gray-500 mt-2">View and process customer orders</p>
          </button>

          <button className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 text-center group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <p className="text-lg font-semibold text-gray-800">View Users</p>
            <p className="text-sm text-gray-500 mt-2">Manage registered users</p>
          </button>

          <button className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 text-center group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
            <p className="text-lg font-semibold text-gray-800">Products</p>
            <p className="text-sm text-gray-500 mt-2">Add, edit or remove products</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;