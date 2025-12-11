import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, CartesianGrid,
    Legend, ResponsiveContainer,
} from "recharts";

import { getAllUser, getCategory, getAllProducts } from "../Services/authService";

export const StatisticsManagement = () => {

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 👉 lưu danh mục đang được chọn
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchData = async () => {
        try {
            const [userRes, categoryRes, productRes] = await Promise.all([
                getAllUser(),
                getCategory(),
                getAllProducts(),
            ]);

            setUsers(userRes.data);
            setCategories(categoryRes.data);
            setProducts(productRes.data);

        } catch (err) {
            console.log("Lỗi load API:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --------------------------
    // THỐNG KÊ USER
    // --------------------------
    const userStats = {
        totalUsers: users.length,
    };

    // --------------------------
    // THỐNG KÊ SẢN PHẨM + DANH MỤC
    // --------------------------
    const productStats = {
        totalProducts: products.length,
    };

    const categoryStats = {
        totalCategories: categories.length,
    };

    // --------------------------
    // ĐẾM + SẮP XẾP SẢN PHẨM THEO DANH MỤC
    // --------------------------
    const categoryData = categories
        .map((c) => {
            const count = products.filter(
                (p) => p.Category?.name?.toLowerCase() === c.name.toLowerCase()
            ).length;

            return { id: c.id, name: c.name, productCount: count };
        })
        .sort((a, b) => b.productCount - a.productCount);   // 🟦 SORT GIẢM DẦN

    // --------------------------
    // CLICK VÀO BIỂU ĐỒ → LẤY DANH SÁCH SẢN PHẨM
    // --------------------------
    const handleBarClick = (data) => {
        const catName = data.name.toLowerCase();
        const list = products.filter(
            (p) => p.Category?.name?.toLowerCase() === catName
        );

        setSelectedCategory({ name: data.name, list });
    };

    // --------------------------
    // SỐ SẢN PHẨM THEO THÁNG
    // --------------------------
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`,
        products: 0,
    }));

    products.forEach((p) => {
        const month = new Date(p.createat).getMonth();
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                Quản lý thống kê
            </h1>

            {/* Tổng quan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Tổng người dùng", value: userStats.totalUsers, color: "bg-blue-500" },

                    // 🟦 THÊM 2 Ô MỚI
                    { label: "Tổng sản phẩm", value: productStats.totalProducts, color: "bg-purple-500" },
                    { label: "Tổng danh mục", value: categoryStats.totalCategories, color: "bg-orange-500" },
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
                            <Bar
                                dataKey="productCount"
                                fill="#4f46e5"
                                onClick={handleBarClick}     // 🟦 CLICK VÀO CỘT
                            />
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

            {/* Modal hiển thị sản phẩm theo danh mục */}
            {selectedCategory && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div onClick={() => setSelectedCategory(null)} className="w-full h-full absolute bg-black bg-opacity-40 z-[-1]"></div>
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[80vh] overflow-y-auto ">
                        <h2 className="text-lg font-bold mb-3">
                            Danh mục: {selectedCategory.name}
                        </h2>

                        {selectedCategory.list.length === 0 ? (
                            <p className="text-gray-500 text-center">Không có sản phẩm nào.</p>
                        ) : (
                            <ul className="space-y-2">
                                {selectedCategory.list.map((item) => (
                                    <li key={item.id} className="p-2 border rounded">
                                        {item.title || item.name || "Sản phẩm không tên"}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Bảng danh mục */}
            <div className="p-4 border rounded-lg shadow-md">
                <h2 className="font-semibold mb-4">Danh sách danh mục</h2>

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
                    <thead className="bg-[#4C7F31] text-white">
                        <tr>
                            <th className="border p-2">Tên danh mục</th>
                            <th className="border p-2">Số sản phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleItems.map((item) => (
                            <tr key={item.id}>
                                <td className="border p-2 w-[50%]">{item.name}</td>
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
