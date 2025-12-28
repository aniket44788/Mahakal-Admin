import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DELIVERY_STATUSES = [
    "pending",
    "processing",
    "shipped",
    "out-for-delivery",
    "delivered",
    "cancelled"
];

const Vieworders = () => {
    const { userId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("MahakalToken");

    useEffect(() => {
        if (!userId) {
            setError('User ID is required.');
            setLoading(false);
            return;
        }
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_URL}/api/payment/admin/user/${userId}/orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data.success) {
                    setOrders(response.data.orders || []);
                } else {
                    setError('Failed to load orders.');
                }
            } catch (err) {
                setError('Error fetching orders. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!token) {
            setError('Authentication required. Please log in again.');
            return;
        }

        const currentOrder = orders.find(order => order._id === orderId);
        if (newStatus === currentOrder?.deliveryStatus) {
            return;
        }

        setUpdatingOrderId(orderId);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_URL}/api/payment/order/update/${orderId}`,
                {
                    deliveryStatus: newStatus
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                // Update local state
                setOrders(orders.map(order =>
                    order._id === orderId
                        ? { ...order, deliveryStatus: newStatus }
                        : order
                ));
                console.log('Order status updated successfully');
            } else {
                setError('Failed to update order status.');
            }
        } catch (err) {
            setError('Error updating order status. Please try again later.');
            console.error(err);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const toggleDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }) + ' ' + date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-2xl font-medium text-gray-600">Loading orders...</div>
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
                    <h1 className="text-4xl font-bold text-gray-800">Admin - User Orders</h1>
                    <p className="text-xl text-gray-600 mt-2">
                        User ID: <span className="font-bold text-indigo-600">{userId}</span> | Total Orders: <span className="font-bold text-indigo-600">{orders.length}</span>
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Back to Users
                    </button>
                </div>
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Products</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Delivery</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="bg-white hover:bg-gray-50 transition duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm font-bold text-indigo-700">
                                                    {order._id.slice(-10)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="font-semibold text-gray-900">{order.address.fullName}</div>
                                                    <div className="text-gray-500">{order.address.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                                <div>
                                                    <span className="font-medium">{order.products.length} item{order.products.length > 1 ? 's' : ''}</span>
                                                    <div className="mt-1 space-y-1">
                                                        {order.products.map((item, i) => (
                                                            <div key={i} className="text-xs text-gray-600 truncate">
                                                                • {item.name} ({item.quantity} {item.unit})
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xl font-bold text-green-600">₹{order.amount}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-4 py-2 rounded-full text-xs font-bold ${order.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-4 py-2 rounded-full text-xs font-bold ${order.deliveryStatus === 'delivered'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : order.deliveryStatus === 'shipped'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                    {order.deliveryStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleDetails(order._id)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm underline mr-4"
                                                >
                                                    {expandedOrderId === order._id ? 'Hide' : 'View'}
                                                </button>
                                                <select
                                                    value={order.deliveryStatus}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    disabled={updatingOrderId === order._id}
                                                    className="text-indigo-600 font-semibold text-sm border border-indigo-300 rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {DELIVERY_STATUSES.map(status => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        {/* Expanded Details Row */}
                                        {expandedOrderId === order._id && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 bg-gradient-to-b from-gray-50 to-gray-100">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                        {/* Shipping Address */}
                                                        <div className="bg-white p-6 rounded-xl shadow-md">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h3>
                                                            <p className="font-semibold text-gray-900">{order.address.fullName}</p>
                                                            <p className="text-gray-700 mt-2">
                                                                {order.address.houseNumber && `${order.address.houseNumber}, `}
                                                                {order.address.street && `${order.address.street}`}
                                                                {order.address.landmark && `, ${order.address.landmark}`}
                                                            </p>
                                                            <p className="text-gray-700">
                                                                {order.address.townCity && `${order.address.townCity}, `}
                                                                {order.address.state} - {order.address.pincode}
                                                            </p>
                                                            <p className="text-gray-700 font-medium mt-3">Phone: {order.address.phone}</p>
                                                        </div>
                                                        {/* Payment Info */}
                                                        <div className="bg-white p-6 rounded-xl shadow-md">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h3>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Razorpay Order ID:</span>
                                                                    <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 break-all">
                                                                        {order.razorpayOrderId || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-600">Payment ID:</span>
                                                                    <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 break-all">
                                                                        {order.razorpayPaymentId || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                {order.razorpaySignature && (
                                                                    <div>
                                                                        <span className="font-medium text-gray-600">Signature:</span>
                                                                        <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1 break-all truncate">
                                                                            {order.razorpaySignature}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Products List */}
                                                        <div className="bg-white p-6 rounded-xl shadow-md">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-4">Products Ordered</h3>
                                                            <div className="space-y-4">
                                                                {order.products.map((item, idx) => (
                                                                    <div key={idx} className="flex gap-4 items-center">
                                                                        <img
                                                                            src={item.images[0]?.url || 'https://via.placeholder.com/60'}
                                                                            alt={item.name}
                                                                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-800">{item.name}</p>
                                                                            <p className="text-sm text-gray-600">
                                                                                Category: {item.category} | {item.quantity} × ₹{item.price} = <span className="font-bold text-green-600">₹{item.quantity * item.price}</span>
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">Unit: {item.unit}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <div className="pt-4 border-t text-right">
                                                                    <p className="text-lg font-bold text-gray-900">Subtotal: ₹{order.amount}</p>
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
                    {orders.length === 0 && (
                        <div className="text-center py-16 text-gray-500 text-xl">
                            No orders found for this user.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vieworders;