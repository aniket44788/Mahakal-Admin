import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                    setError('Failed to load users.');
                }
            } catch (err) {
                setError('Error fetching users. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleDetails = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleViewOrders = (userId) => {
        navigate(`/api/payment/admin/user/${userId}/orders`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-2xl font-medium text-gray-600">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-xl text-red-600 bg-red-50 px-8 py-6 rounded-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Admin - All Users</h1>
                    <p className="text-xl text-gray-600 mt-2">
                        Total Users: <span className="font-bold text-indigo-600">{users.length}</span>
                    </p>
                </div>
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Verified</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Auth Method</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Orders</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <React.Fragment key={user._id}>
                                        <tr className="bg-white hover:bg-gray-50 transition duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm font-bold text-indigo-700">
                                                    {user._id.slice(-10)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {user.profileImage && (
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.name}
                                                            className="w-8 h-8 rounded-full mr-3 object-cover"
                                                        />
                                                    )}
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isVerified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.isVerified ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-700">
                                                {user.authMethod}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-bold text-indigo-600">{user.orders.length}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleDetails(user._id)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm underline mr-4"
                                                >
                                                    {expandedUserId === user._id ? 'Hide' : 'Details'}
                                                </button>
                                                <button
                                                    onClick={() => handleViewOrders(user._id)}
                                                    className="text-green-600 hover:text-green-800 font-semibold text-sm underline"
                                                >
                                                    View Orders
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Expanded Details Row */}
                                        {expandedUserId === user._id && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 bg-gradient-to-b from-gray-50 to-gray-100">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        {/* Addresses */}
                                                        <div className="bg-white p-6 rounded-xl shadow-md">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-4">Addresses</h3>
                                                            <div className="space-y-4">
                                                                {user.addresses.map((address, idx) => (
                                                                    <div key={address._id || idx} className="border-l-4 border-indigo-500 pl-4">
                                                                        <p className="font-semibold text-gray-900">{address.fullName}</p>
                                                                        <p className="text-gray-700">
                                                                            {address.houseNumber && `${address.houseNumber}, `}
                                                                            {address.street && `${address.street}`}
                                                                            {address.landmark && `, ${address.landmark}`}
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            {address.townCity && `${address.townCity}, `}
                                                                            {address.state} - {address.pincode}
                                                                        </p>
                                                                        <p className="text-gray-700 font-medium mt-1">
                                                                            Phone: {address.phone} {address.alternatePhone && `| Alt: ${address.alternatePhone}`}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">Type: {address.addressType}</p>
                                                                    </div>
                                                                ))}
                                                                {user.addresses.length === 0 && (
                                                                    <p className="text-gray-500 italic">No addresses added.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Additional Info */}
                                                        <div className="bg-white p-6 rounded-xl shadow-md">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-4">Additional Info</h3>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Favorites:</span>
                                                                    <p className="text-sm">{user.favoriteProducts.length} items</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Cart:</span>
                                                                    <p className="text-sm">{user.cart.length} items</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Joined:</span>
                                                                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                                                                </div>
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
                        <div className="text-center py-16 text-gray-500 text-xl">
                            No users found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAllUsers;