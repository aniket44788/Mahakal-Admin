import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col p-5 h-screen">
            <h2 className="text-2xl font-semibold mb-8">Dashboard</h2>

            <nav className="flex flex-col space-y-3">
                <Link
                    to="/"
                    className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    Home
                </Link>
                <Link
                    to="/productmanager"
                    className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    Product Manager
                </Link>
                <Link
                    to="/dashboardproducts"
                    className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    Dashboard Products
                </Link>

                <Link
                    to="/alluserorders"
                    className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    All User Orders
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;
