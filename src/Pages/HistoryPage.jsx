import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react"; 

import { getCurrentUserId } from "../Services/authService"; 

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LOGIC PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    const API_URL = process.env.REACT_APP_API_URL || "https://be-g-food.onrender.com/api";
    const currentUserId = getCurrentUserId(); 

    useEffect(() => {
        if (currentUserId) fetchHistory();
    }, [currentUserId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/receivepost/history/${currentUserId}`);
            setHistory(res.data.data || []);
            setCurrentPage(1); // Reset về trang 1 khi load dữ liệu mới
        } catch (err) {
            toast.error("Không thể tải lịch sử nhận sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    // --- TÍNH TOÁN DỮ LIỆU PHÂN TRANG ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(history.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleOpenRating = (item) => {
        setSelectedItem(item);
        setCommentContent("");
        setShowModal(true);
    };

    const handleSubmitRating = async () => {
        if (!commentContent.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        if (!selectedItem || !currentUserId) {
            toast.error("Thông tin không hợp lệ, vui lòng thử lại.");
            return;
        }

        const postId = selectedItem.Post_news_share?.id;
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                `${API_URL}/receivepost/comment/${postId}?userid=${currentUserId}`,
                { content: commentContent }
            );

            if (response.data.success || response.status === 200) {
                toast.success("Gửi đánh giá thành công!");
                setShowModal(false); 
                setCommentContent(""); 
                fetchHistory(); 
            }
        } catch (error) {
            const serverResponse = error.response?.data;
            toast.error(serverResponse?.message || "Không thể gửi đánh giá.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-12">
            
            <div className='w-full h-[78px] bg-[#0f3714] mb-12'></div>

            <div className="px-4 md:px-10">
                <h1 className="text-3xl font-black text-center uppercase mb-10 tracking-tighter italic underline decoration-[#4f772d] underline-offset-8">
                    LỊCH SỬ NHẬN SẢN PHẨM
                </h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin w-12 h-12 text-green-700" />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {/* BẢNG DỮ LIỆU */}
                        <div className="overflow-hidden rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                            <table className="w-full text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-[#4f772d] text-white border-b-2 border-black">
                                        <th className="p-4 font-bold uppercase text-xs border-r border-black/20 text-center">Ngày Nhận</th>
                                        <th className="p-4 font-bold uppercase text-xs border-r border-black/20">Loại Sản Phẩm</th>
                                        <th className="p-4 font-bold uppercase text-xs border-r border-black/20">Tên Sản Phẩm</th>
                                        <th className="p-4 font-bold uppercase text-xs border-r border-black/20">Người Cho</th>
                                        <th className="p-4 font-bold uppercase text-xs text-center">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item) => (
                                            <tr key={item.id} className="border-b border-black/10 hover:bg-green-50 transition-colors italic text-gray-700 text-sm">
                                                <td className="p-4 border-r border-black/10 text-center">
                                                    {new Date(item.createat).toLocaleDateString("vi-VN")}
                                                </td>
                                                <td className="p-4 border-r border-black/10">{item.Post_news_share?.Category?.name}</td>
                                                <td className="p-4 border-r border-black/10 font-bold text-black uppercase">{item.Post_news_share?.name}</td>
                                                <td className="p-4 border-r border-black/10">{item.Post_news_share?.User?.UserNamePost}</td>
                                                <td className="p-4 text-center">
                                                    <button
                                                        onClick={() => handleOpenRating(item)}
                                                        className="bg-red-600 text-white px-4 py-1 rounded-full font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all active:translate-y-0.5"
                                                    >
                                                        Đánh Giá
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-400 italic">Chưa có lịch sử nhận quà</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border-2 border-black rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`w-10 h-10 border-2 border-black rounded-lg font-black transition-all ${
                                            currentPage === index + 1
                                                ? "bg-[#4f772d] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                                                : "bg-white text-black hover:bg-gray-100"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border-2 border-black rounded-lg disabled:opacity-30 hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* MODAL ĐÁNH GIÁ*/}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[40px] border-4 border-[#3ecfef] shadow-2xl relative p-6 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col items-center">
                            <div className="w-full h-44 bg-[#9df77d] rounded-[30px] border-4 border-white shadow-lg overflow-hidden mb-4">
                                <img
                                    src={selectedItem?.Post_news_share?.Post_images?.image || "https://via.placeholder.com/300"}
                                    className="w-full h-full object-cover"
                                    alt="product"
                                />
                            </div>
                            <h2 className="text-xl font-black uppercase italic text-center">{selectedItem?.Post_news_share?.name}</h2>
                            <p className="text-gray-500 text-[10px] font-bold mb-4 italic">Người cho: {selectedItem?.Post_news_share?.User?.UserNamePost}</p>

                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="viết đánh giá..."
                                className="w-full p-4 rounded-xl border-2 border-black bg-gray-50 font-medium text-sm focus:outline-none min-h-[100px] mb-6 shadow-[inner_2px_2px_4px_rgba(0,0,0,0.1)]"
                            />

                            <button
                                onClick={handleSubmitRating}
                                disabled={isSubmitting}
                                className="bg-red-600 text-white px-10 py-2 rounded-full font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;