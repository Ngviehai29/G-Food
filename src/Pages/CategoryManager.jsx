import React, { useEffect, useState } from 'react';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../Services/authService';
import { toast } from 'sonner';

export const CategoryManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // popup state
    const [isOpen, setIsOpen] = useState(false);
    const [newCate, setNewCate] = useState({ name: "", description: "" });

    // edit state
    const [editCate, setEditCate] = useState(null); // lưu category đang sửa
    const [isEditOpen, setIsEditOpen] = useState(false);

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

    // Thêm danh mục
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
        } catch (error) {
            toast.error("Thêm không thành công!");
        } finally {
            setLoading(false);
        }
    };

    // Mở popup sửa
    const handleEditClick = (category) => {
        setEditCate(category);
        setIsEditOpen(true);
    };

    // Cập nhật danh mục
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
        } catch (error) {
            toast.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // Xóa danh mục
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        setLoading(true);
        try {
            await deleteCategory(id);
            toast.success("Xóa danh mục thành công!");
            fetchUser();
        } catch (error) {
            toast.error("Xóa thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=''>
            <div className='w-full pl-2'>
                <div className='w-full bg-gray-50 rounded-[10px] shadow-xl p-4'>
                    <div className='flex items-center pt-2'>
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Quản lý danh mục
                            </h1>
                        </div>

                        {loading &&
                            <div className="absolute z-[100] w-fit h-[100%] flex items-center right-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
                            </div>
                        }
                    </div>

                    {/* NÚT MỞ POPUP THÊM */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-main text-white px-3 py-2 rounded"
                    >
                        Thêm danh mục +
                    </button>

                    {/* TABLE */}
                    <table className="w-full border mt-4 ">
                        <thead>
                            <tr className="bg-[#4C7F31] text-white">
                                <th className="border p-2 w-[180px]">Tên danh mục</th>
                                <th className="border p-2 w-[520px]">Mô tả</th>
                                <th className="border p-2 ">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
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
                            ))}
                        </tbody>
                    </table>

                    {/* POPUP THÊM DANH MỤC */}
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
                                        setNewCate({ ...newCate, description: e.target.value })
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

                    {/* POPUP SỬA DANH MỤC */}
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
                                        setEditCate({ ...editCate, description: e.target.value })
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
