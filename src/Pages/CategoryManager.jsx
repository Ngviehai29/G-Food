import React, { useEffect, useState } from 'react';
import {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../Services/authService';
import { toast } from 'sonner';

export const CategoryManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // popup state
    const [isOpen, setIsOpen] = useState(false);
    const [newCate, setNewCate] = useState({ name: "", description: "" });

    // edit state
    const [editCate, setEditCate] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // 🔎 tìm kiếm + phân trang
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7; // số item / trang

    const fetchUser = async () => {
        setLoading(true);
        try {
            const data = await getCategory();
            setUsers(data.data);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // tổng số danh mục
    const categoryStats = {
        total: users.length
    };


    // ===============================
    // THÊM DANH MỤC
    // ===============================
    const handleAddCategory = async () => {
        if (!newCate.name.trim()) {
            toast.error("Tên danh mục không được để trống!");
            return;
        }
        setLoading(true);
        try {
            await createCategory(newCate.name, newCate.description);
            toast.success("Thêm danh mục thành công!");
            setNewCate({ name: "", description: "" });
            setIsOpen(false);
            fetchUser();
        } catch {
            toast.error("Thêm không thành công!");
        } finally {
            setLoading(false);
        }
    };

    // mở popup sửa
    const handleEditClick = (category) => {
        setEditCate(category);
        setIsEditOpen(true);
    };

    // cập nhật danh mục
    const handleUpdateCategory = async () => {
        if (!editCate.name.trim()) {
            toast.error("Tên danh mục không được để trống!");
            return;
        }
        setLoading(true);
        try {
            await updateCategory(editCate.id, editCate.name, editCate.description);
            toast.success("Cập nhật thành công!");
            setIsEditOpen(false);
            setEditCate(null);
            fetchUser();
        } catch {
            toast.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // xóa danh mục
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        setLoading(true);
        try {
            await deleteCategory(id);
            toast.success("Xóa danh mục thành công!");
            fetchUser();
        } catch {
            toast.error("Xóa thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // LỌC + PHÂN TRANG
    // =====================================

    const filtered = users.filter((x) =>
        x.name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="">
            <div className="w-full pl-2">
                <div className="w-full bg-gray-50 rounded-[10px] shadow-xl p-4">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                                Quản lý danh mục
                            </h1>
                            <p className="text-gray-600 mb-[14px]">
                                Tất cả danh mục sản phẩm được hiển thị tại đây!
                            </p>
                        </div>

                        {loading && (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-main"></div>
                        )}
                    </div>

                    {/* Thống kê danh mục */}
                    <div className="bg-white text-black p-4 rounded-lg shadow mb-4 w-[300px] items-center">
                        <p className="text-sm">Tổng danh mục: </p>
                        <p className="text-lg font-bold">{categoryStats.total}</p>
                    </div>

                    {/* Nút mở popup thêm */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-main text-white px-3 py-2 rounded"
                    >
                        Thêm danh mục +
                    </button>

                    {/* Ô tìm kiếm */}
                    <div className="mt-4 inline ml-6">

                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            className="border px-3 py-2 rounded-lg w-[260px] focus:outline-none focus:border-[1px] focus:border-main"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}

                        />
                    </div>

                    {/* TABLE */}
                    <table className="w-full border mt-4">
                        <thead>
                            <tr className="bg-[#4C7F31] text-white">
                                <th className="border p-2 w-[180px]">Tên danh mục</th>
                                <th className="border p-2 w-[520px]">Mô tả</th>
                                <th className="border p-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((u) => (
                                    <tr key={u.id}>
                                        <td className="border p-2">{u.name}</td>
                                        <td className="border p-2">{u.description}</td>
                                        <td className="border p-2 text-center flex gap-4 justify-center">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(u.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center p-4 text-gray-500">
                                        Không tìm thấy danh mục
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* PHÂN TRANG */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                className="px-3 py-1 border rounded"
                            >
                                ←
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => changePage(i + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === i + 1
                                        ? "bg-main text-white"
                                        : ""
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => changePage(currentPage + 1)}
                                className="px-3 py-1 border rounded"
                            >
                                →
                            </button>
                        </div>
                    )}

                    {/* Popup Thêm */}
                    {isOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[200]">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                <h2 className="text-xl font-bold mb-4">Thêm danh mục</h2>

                                <label className="block mb-2">Tên danh mục</label>
                                <input
                                    type="text"
                                    className="border px-3 py-2 rounded w-full mb-3"
                                    value={newCate.name}
                                    onChange={(e) =>
                                        setNewCate({ ...newCate, name: e.target.value })
                                    }
                                />

                                <label className="block mb-2">Mô tả</label>
                                <textarea
                                    className="border px-3 py-2 rounded w-full mb-3"
                                    value={newCate.description}
                                    onChange={(e) =>
                                        setNewCate({
                                            ...newCate,
                                            description: e.target.value
                                        })
                                    }
                                />

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-3 py-2 bg-gray-300 rounded"
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        onClick={handleAddCategory}
                                        className="px-3 py-2 bg-main text-white rounded"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Popup Sửa */}
                    {isEditOpen && editCate && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[200]">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                                <h2 className="text-xl font-bold mb-4">Sửa danh mục</h2>

                                <label className="block mb-2">Tên danh mục</label>
                                <input
                                    type="text"
                                    className="border px-3 py-2 rounded w-full mb-3"
                                    value={editCate.name}
                                    onChange={(e) =>
                                        setEditCate({ ...editCate, name: e.target.value })
                                    }
                                />

                                <label className="block mb-2">Mô tả</label>
                                <textarea
                                    className="border px-3 py-2 rounded w-full mb-3"
                                    value={editCate.description}
                                    onChange={(e) =>
                                        setEditCate({
                                            ...editCate,
                                            description: e.target.value
                                        })
                                    }
                                />

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsEditOpen(false)}
                                        className="px-3 py-2 bg-gray-300 rounded"
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        onClick={handleUpdateCategory}
                                        className="px-3 py-2 bg-main text-white rounded"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
