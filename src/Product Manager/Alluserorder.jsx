import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("MahakalToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/api/payment/getAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUsers(response.data.users || []);
        } else {
          setError("Failed to load users.");
        }
      } catch (err) {
        setError("Error fetching users. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const toggleDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewOrders = (userId) => {
    navigate(`/api/payment/admin/user/${userId}/orders`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-600">
            Loading users, please wait...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center shadow-sm max-w-md">
          <p className="text-base font-semibold text-red-700">{error}</p>
          <p className="mt-1 text-xs text-red-500">
            Try refreshing the page or checking your network connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              All Users
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage registered users, view their addresses and quick stats.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-right shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Total Users
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {users.length}
              </p>
            </div>
            {/* Reserved for more small stats later (e.g. verified users) */}
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Users List
            </p>
            <p className="text-[11px] text-slate-400">
              Click <span className="font-semibold text-slate-600">Details</span> to see full profile & addresses
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gradient-to-r from-indigo-600 to-violet-600 text-left text-xs font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-5 py-3">User ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-center">Verified</th>
                  <th className="px-5 py-3 text-center">Auth Method</th>
                  <th className="px-5 py-3 text-center">Orders</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr className="transition-colors hover:bg-slate-50/80">
                      {/* User ID */}
                      <td className="whitespace-nowrap px-5 py-4 align-middle">
                        <span className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-mono font-semibold text-slate-800">
                          {user._id?.slice(-10)}
                        </span>
                      </td>

                      {/* Name + avatar */}
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-semibold uppercase text-slate-500">
                                {user.name?.[0] || "U"}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {user.name || "Unnamed user"}
                            </p>
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">
                              {user.authMethod || "Standard"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 align-middle">
                        <p className="max-w-xs truncate text-sm text-slate-700">
                          {user.email}
                        </p>
                      </td>

                      {/* Verified */}
                      <td className="px-5 py-4 text-center align-middle">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                            user.isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>

                      {/* Auth method */}
                      <td className="px-5 py-4 text-center align-middle">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700">
                          {user.authMethod || "email/password"}
                        </span>
                      </td>

                      {/* Orders count */}
                      <td className="px-5 py-4 text-center align-middle">
                        <span className="text-sm font-semibold text-indigo-600">
                          {user.orders?.length || 0}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="whitespace-nowrap px-5 py-4 align-middle text-sm text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center align-middle">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => toggleDetails(user._id)}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            {expandedUserId === user._id ? "Hide details" : "Details"}
                          </button>
                          <button
                            onClick={() => handleViewOrders(user._id)}
                            className="rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                          >
                            View Orders
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expandedUserId === user._id && (
                      <tr>
                        <td
                          colSpan={8}
                          className="bg-slate-50/80 px-5 pb-6 pt-2 align-top"
                        >
                          <div className="mt-3 grid gap-5 md:grid-cols-2">
                            {/* Addresses */}
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                              <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  Addresses
                                </p>
                                <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                  {user.addresses?.length || 0} saved
                                </span>
                              </div>

                              <div className="space-y-4">
                                {user.addresses?.length ? (
                                  user.addresses.map((address, idx) => (
                                    <div
                                      key={address._id || idx}
                                      className="rounded-xl border-l-4 border-indigo-500/80 bg-slate-50 px-4 py-3"
                                    >
                                      <p className="text-sm font-semibold text-slate-900">
                                        {address.fullName}
                                      </p>
                                      <p className="text-xs text-slate-600">
                                        {address.houseNumber && `${address.houseNumber}, `}
                                        {address.street}
                                        {address.landmark && `, ${address.landmark}`}
                                      </p>
                                      <p className="text-xs text-slate-600">
                                        {address.townCity && `${address.townCity}, `}
                                        {address.state} - {address.pincode}
                                      </p>
                                      <p className="mt-1 text-xs font-medium text-slate-700">
                                        Phone: {address.phone}
                                        {address.alternatePhone &&
                                          ` | Alt: ${address.alternatePhone}`}
                                      </p>
                                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                                        {address.addressType || "Other"}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs italic text-slate-500">
                                    No addresses added for this user.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Additional info */}
                            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Profile Snapshot
                              </p>
                              <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500">Favorites</span>
                                  <span className="font-semibold text-slate-900">
                                    {user.favoriteProducts?.length || 0} items
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500">Cart</span>
                                  <span className="font-semibold text-slate-900">
                                    {user.cart?.length || 0} items
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500">Joined</span>
                                  <span className="font-semibold text-slate-900">
                                    {formatDate(user.createdAt)}
                                  </span>
                                </div>
                                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                                <p className="text-[11px] text-slate-500">
                                  Use this panel to quickly understand user behaviour before
                                  managing their orders or profile.
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAllUsers;
