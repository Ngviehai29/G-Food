import React from 'react'
import { useEffect, useState } from 'react'
import { getCategory, lockUser, unlockUser } from '../Services/authService';
import { toast } from 'sonner'

export const CategoryManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const handleToggleStatus = async (id, currentStatus) => {
        setLoading(true);
        try {

            if (currentStatus) {
                await lockUser(id);
            } else {
                await unlockUser(id);
            }

            // cập nhật lại danh sách user
            const updated = users.map(u =>
                u.id === id ? { ...u, status: !u.status } : u
            );
            setUsers(updated);

        } catch (error) {
            toast.error("Cập nhập thất bại");
        } finally {
            setLoading(false);
            toast.success("Cập nhập trạng thái thành công!");

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
                            <p className="text-gray-600">
                                Tất cả người dùng của hệ thống sẽ được hiển thị tại đây
                            </p>
                        </div>
                        {loading &&
                            <div className="absolute z-[100] w-fit h-[100%] flex items-center right-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
                            </div>
                        }
                    </div>
                    <button className="bg-main text-white px-3 py-2 rounded">
                        Thêm danh mục +
                    </button>
                    <table className="w-full border mt-4 ">
                        <thead>
                            <tr className="bg-[#4C7F31] text-white">
                                <th className="border p-2 w-[160px]">Tên danh mục</th>
                                <th className="border p-2 ">Mô tả</th>
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
                                            onClick={() => handleToggleStatus(u.id, true)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(u.id, false)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
