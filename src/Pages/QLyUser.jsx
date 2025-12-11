import React, { useEffect, useState } from 'react'
import { getAllUser, lockUser, unlockUser } from '../Services/authService';
import { toast } from 'sonner'

export const QLyUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // thêm:
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

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
            currentStatus ? await lockUser(id) : await unlockUser(id);

            const updated = users.map(u =>
                u.id === id ? { ...u, status: !u.status } : u
            );
            setUsers(updated);

            toast.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            toast.error("Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    /** -----------------------------
     *  Tìm kiếm client-side
     ------------------------------ */
    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    /** -----------------------------
     *  Phân trang client-side
     ------------------------------ */
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="">
            <div className='w-full pl-2'>
                <div className='w-full bg-gray-50 rounded-[10px] shadow-xl p-4'>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Quản lý người dùng
                            </h1>
                            <p className="text-gray-600 mb-[16px]">
                            Tất cả người dùng của hệ thống sẽ được hiển thị tại đây!
                            </p>
                        </div>
                        {loading && (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-main"></div>
                        )}
                    </div>

                    {/* 🔍 Ô tìm kiếm */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Tìm người dùng theo tên hoặc email..."
                            className="border rounded-lg p-2 w-[300px] focus:outline-none focus:border-[1px] focus:border-main"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // reset về page 1 khi tìm kiếm
                            }}
                        />
                    </div>

                    <table className="w-full border mt-0">
                        <thead>
                            <tr className="bg-[#4C7F31] text-white">
                                <th className="border p-2 w-[160px]">Họ và tên</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Giới tính</th>
                                <th className="border p-2 w-[270px]">Vị trí</th>
                                <th className="border p-2">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((u) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-gray-500">
                                        Không tìm thấy người dùng
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* 📌 Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                className="px-3 py-1 border rounded"
                            >
                                ←
                            </button>

                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changePage(idx + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === idx + 1
                                        ? "bg-main text-white"
                                        : ""
                                        }`}
                                >
                                    {idx + 1}
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
                </div>
            </div>
        </div>
    );
};
