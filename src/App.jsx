import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import ProductManager from "./Product Manager/ProductManager";
import Login from "./Admin Auth/Login";
import Dashboard from "./Dashboard";
import DashboardProducts from "./Product Manager/DashboardProducts";
import DashboardProudctDetail from "./Product Manager/DashboardProudctDetail";
import Editdashproduct from "./Product Manager/Editdashproduct";
import Alluserorder from "./Product Manager/Alluserorder";
import Vieworders from "./Product Manager/Vieworders";
import ProductDetail from "./Product Manager/ProductDetail";
import Getrecentorders from "./Product Manager/Getrecentorders.jsx";

function App() {
  const location = useLocation();

  // 👇 Hide sidebar on login page
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="flex h-screen bg-gray-100">
      {!hideSidebar && <Sidebar />}

      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/productmanager" element={<ProductManager />} />
          <Route path="/single/:productId" element={<ProductDetail />} />
          <Route path="/dashboardproducts" element={<DashboardProducts />} />
          <Route
            path="/dashboardproductdetail/:id"
            element={<DashboardProudctDetail />}
          />
          <Route
            path="/dashboard/product/update/:id"
            element={<Editdashproduct />}
          />
          <Route path="/alluserorders" element={<Alluserorder />} />
          <Route
            path="/api/payment/admin/user/:userId/orders"
            element={<Vieworders />}
          />
          <Route path="/getrecentorders" element={<Getrecentorders />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
