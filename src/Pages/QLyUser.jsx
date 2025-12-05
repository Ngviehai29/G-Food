import React, { useEffect, useState } from 'react'
import { getAllUser, lockUser, unlockUser } from '../Services/authService';
import { toast } from 'sonner'
import leaf from "../G-Food-Images/leaf.svg"

export const QLyUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const data = await getAllUser();
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
                <div className='w-full bg-gray-50 rounded-[10px] border border-gray-100 shadow-xl'>

                    <div className='flex items-center w-full rounded-tl-[10px] bg-gradient-to-r from-[#4C7F31] to-[#4C7F31] rounded-tr-[10px] font-semibold text-[14px] pl-4 p-4 text-white relative'>
                        <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
                        {loading &&
                            <div className="absolute z-[100] w-fit h-[100%] flex items-center right-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
                            </div>
                        }
                    </div>
                    <table className="w-full border mt-0">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 w-[160px]">Họ và tên</th>
                                <th className="border p-2 ">Email</th>
                                <th className="border p-2">Giới tính</th>
                                <th className="border p-2 w-[280px]">Vị trí</th>
                                <th className="border p-2">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="border p-2">{u.username}</td>
                                    <td className="border p-2">{u.email}</td>
                                    <td className="border p-2">{u.sex ? "Nam" : "Nữ"}</td>
                                    <td className="border p-2">{u.location}</td>
                                    <td className="border p-2 text-center">
                                        {u.status ? (
                                            <button
                                                onClick={() => handleToggleStatus(u.id, true)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Khóa
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleStatus(u.id, false)}
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                            >
                                                Mở khóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
