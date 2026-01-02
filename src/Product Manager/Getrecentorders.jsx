import React, { useEffect, useState } from "react";
import axios from "axios";

function Getrecentorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/payment/getrecentorders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("MahakalToken")}`,
            },
          }
        );
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // PAYMENT STATUS BADGE
  const getPaymentBadgeClasses = (status) => {
    if (!status) return "bg-slate-50 text-slate-700 border-slate-200";

    const s = status.toLowerCase();
    if (s === "paid" || s === "success" || s === "completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "failed" || s === "cancelled") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (s === "pending" || s === "processing") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  // DELIVERY STATUS BADGE (USING YOUR ENUM)
  // enum: ["pending","processing","shipped","out-for-delivery","delivered","cancelled"]
  const getDeliveryBadgeClasses = (status) => {
    if (!status) return "bg-slate-50 text-slate-700 border-slate-200";

    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "processing":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "out-for-delivery":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading recent orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700">No orders yet</p>
          <p className="text-sm text-slate-500">
            Once customers place orders, you will see them listed here with all details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track latest customer orders, payment status, and delivery details in one place.
          </p>
        </div>

        {/* SIMPLE STATS */}
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Orders
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {orders.map((order) => {
          const paymentStatus = order.paymentStatus || "Unknown";
          const deliveryStatus = order.deliveryStatus || "pending";
          const paymentMode =
            order.paymentMode || order.paymentMethod || "Not specified";

          return (
            <div
              key={order._id}
              className="group rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5"
            >
              {/* TOP ROW: order id + date + amount + statuses */}
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Order ID
                    </span>
                    <span className="rounded-full bg-slate-900/5 px-2.5 py-0.5 text-xs font-mono text-slate-800">
                      {order._id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Placed on{" "}
                    <span className="font-medium text-slate-700">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {/* AMOUNT */}
                  <div className="flex items-baseline gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                      Amount
                    </span>
                    <span className="text-sm font-bold">
                      ₹{order.amount?.toLocaleString?.() || order.amount}
                    </span>
                  </div>

                  {/* PAYMENT STATUS */}
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium " +
                      getPaymentBadgeClasses(paymentStatus)
                    }
                  >
                    <span className="uppercase tracking-wide">
                      {paymentStatus}
                    </span>
                  </span>

                  {/* DELIVERY STATUS */}
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium " +
                      getDeliveryBadgeClasses(deliveryStatus)
                    }
                  >
                    <span className="uppercase tracking-wide">
                      {deliveryStatus}
                    </span>
                  </span>
                </div>
              </div>

              {/* MIDDLE ROW: customer + address + payment mode */}
              <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
                {/* CUSTOMER */}
                <div className="rounded-xl bg-slate-50/80 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Customer
                    </p>
                    {paymentMode && (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
                        {paymentMode}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-slate-500 break-all">
                      {order.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Delivery Address
                    </p>
                  </div>
                  {order.address ? (
                    <div className="mt-2 space-y-0.5 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">
                        {order.address.fullName}
                        {order.address.phone && (
                          <span className="ml-2 text-slate-500">
                            • {order.address.phone}
                          </span>
                        )}
                      </p>
                      <p>
                        {order.address.houseNumber}, {order.address.street}
                      </p>
                      <p>
                        {order.address.townCity}, {order.address.state} -{" "}
                        {order.address.pincode}
                      </p>
                      {order.address.landmark && (
                        <p className="text-slate-500">
                          Landmark: {order.address.landmark}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">
                      No address information available.
                    </p>
                  )}
                </div>
              </div>

              {/* PRODUCTS */}
              {Array.isArray(order.products) && order.products.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Products ({order.products.length})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Qty × Price (per item)
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                          {item.images && item.images[0]?.url ? (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-500">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Category: {item.category || "N/A"}
                          </p>
                          <p className="text-xs text-slate-600">
                            Qty:{" "}
                            <span className="font-semibold">
                              {item.quantity}
                            </span>{" "}
                            ×{" "}
                            <span className="font-semibold">
                              ₹{item.price}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">Total</p>
                          <p className="text-sm font-semibold text-slate-900">
                            ₹{(item.quantity || 0) * (item.price || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Getrecentorders;
