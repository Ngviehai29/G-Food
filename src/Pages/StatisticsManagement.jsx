import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts";

export const StatisticsManagement = () => {
    const API = "https://be-g-food.onrender.com/api";

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --------------------------
    // LOAD API THẬT
    // --------------------------
    const fetchData = async () => {
        try {
            const [userRes, categoryRes, productRes] = await Promise.all([
                axios.get(`${API}/user`),        // 🔥 ĐÚNG ROUTE
                axios.get(`${API}/category`),    // 🔥 ĐÚNG ROUTE
                axios.get(`${API}/postnewshare`) // 🔥 ĐÚNG ROUTE
            ]);

            setUsers(userRes.data.data);
            setCategories(categoryRes.data.data);
            setProducts(productRes.data.data);

            setLoading(false);
        } catch (err) {
            console.log("Lỗi tải dữ liệu:", err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --------------------------
    // THỐNG KÊ USER
    // --------------------------
    const userStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === true).length,
        inactiveUsers: users.filter(u => u.status === false).length,
    };

    // --------------------------
    // ĐẾM SẢN PHẨM THEO DANH MỤC
    // --------------------------
    const categoryData = categories.map((c) => {
        const count = products.filter(
            (p) => p.Category?.name?.toLowerCase() === c.name.toLowerCase()
        ).length;

        return { id: c.id, name: c.name, productCount: count };
    });

    // --------------------------
    // SỐ SẢN PHẨM THEO THÁNG
    // --------------------------
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`,
        products: 0,
    }));

    products.forEach((p) => {
        const month = new Date(p.createat).getMonth(); // 🔥 FIX FIELD createat
        monthlyStats[month].products += 1;
    });

    // --------------------------
    // PHÂN TRANG
    // --------------------------
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [page, setPage] = useState(1);

    const totalPage = Math.ceil(categoryData.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const visibleItems = categoryData.slice(start, start + itemsPerPage);

    if (loading)
        return <p className="text-center text-lg font-semibold">Đang tải dữ liệu...</p>;

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-blue-700">📊 Quản lý thống kê</h1>

            {/* Tổng quan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Tổng người dùng", value: userStats.totalUsers, color: "bg-blue-500" },
                    { label: "Đang hoạt động", value: userStats.activeUsers, color: "bg-green-500" },
                    { label: "Không hoạt động", value: userStats.inactiveUsers, color: "bg-red-500" },
                ].map(item => (
                    <div key={item.label} className={`${item.color} text-white p-4 rounded-lg shadow-md`}>
                        <p className="text-sm">{item.label}</p>
                        <p className="text-xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Sản phẩm theo danh mục</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="productCount" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-4 border rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Sản phẩm đăng theo tháng</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="products" stroke="#22c55e" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bảng danh mục */}
            <div className="p-4 border rounded-lg shadow-md">
                <h2 className="font-semibold mb-4">Danh sách danh mục</h2>

                {/* chọn số item */}
                <div className="mb-3 flex items-center gap-2">
                    <p>Hiển thị:</p>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border p-2 rounded"
                    >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                    <p>/ trang</p>
                </div>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Tên danh mục</th>
                            <th className="border p-2">Số sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleItems.map((item) => (
                            <tr key={item.id}>
                                <td className="border p-2 text-center">{item.id}</td>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2 text-center">{item.productCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => page > 1 && setPage(page - 1)}
                        className="px-3 py-1 border rounded"
                        disabled={page === 1}
                    >
                        ← Prev
                    </button>

                    <p>Trang {page} / {totalPage}</p>

                    <button
                        onClick={() => page < totalPage && setPage(page + 1)}
                        className="px-3 py-1 border rounded"
                        disabled={page === totalPage}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatisticsManagement;
