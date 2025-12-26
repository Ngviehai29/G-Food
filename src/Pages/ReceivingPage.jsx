import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, X, Phone, MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";

const ReceivingPage = () => {
    const [receivedPosts, setReceivedPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contactData, setContactData] = useState(null);
    const [loadingContact, setLoadingContact] = useState(false);

    // --- LOGIC PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8; // Số lượng bài viết trên mỗi trang

    const API_URL = process.env.REACT_APP_API_URL || "https://be-g-food.onrender.com/api";
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => {
        if (currentUserId) fetchReceivedPosts();
    }, [currentUserId]);

    const fetchReceivedPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/receivepost/list-user/${currentUserId}`);
            setReceivedPosts(res.data.data || []);
        } catch (err) {
            toast.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    // --- TÍNH TOÁN DỮ LIỆU PHÂN TRANG ---
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = receivedPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(receivedPosts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleContact = async (post) => {
        const postID = post.Post_news_share?.id;
        
        if (!postID || !currentUserId) {
            toast.error("Thiếu thông tin người dùng hoặc bài đăng");
            return;
        }

        setLoadingContact(true);
        setIsModalOpen(true);

        try {
            const res = await axios.get(`${API_URL}/receivepost/contact/${postID}`, {
                params: { userid: currentUserId }
            });
            
            if (res.data.success && res.data.data && res.data.data.length > 0) {
                setContactData(res.data.data[0]);
            } else {
                setContactData(null);
                toast.error("Không tìm thấy thông tin liên hệ");
            }
        } catch (err) {
            console.error("Lỗi API:", err.response?.data || err.message);
            toast.error("Lỗi khi lấy thông tin liên hệ");
            setContactData(null);
        } finally {
            setLoadingContact(false);
        }
    };
        
    return (
        <div className="min-h-screen bg-[#fdfaf1] pb-12">
            {/* BOX HEADER MÀU XANH ĐẬM GIỐNG TRANG PROFILE */}
            <div className='w-full h-[78px] bg-[#0f3714] mb-12'></div>

            <div className="px-10">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">
                        NHẬN SẢN PHẨM
                    </h1>
                    <div className="w-24 h-2 bg-main mx-auto mt-2 rounded-full"></div>
                </header>

                {loading ? (
                    <div className="flex justify-center mt-20">
                        <Loader2 className="animate-spin w-12 h-12 text-main" />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {currentPosts.length > 0 ? currentPosts.map((post) => (
                                <div key={post.id} className="bg-[#9df77d] p-4 rounded-[40px] border-2 border-white shadow-xl flex flex-col items-center">
                                    <div className="w-full h-44 bg-white rounded-[30px] overflow-hidden mb-3">
                                        <img
                                            src={post.Post_news_share?.Post_images?.[0]?.image || "https://via.placeholder.com/300"}
                                            className="w-full h-full object-cover"
                                            alt="Product"
                                        />
                                    </div>
                                    <h3 className="font-black text-xl uppercase italic mb-4 text-center truncate w-full px-2">
                                        {post.Post_news_share?.name}
                                    </h3>
                                    <button
                                        onClick={() => handleContact(post)}
                                        className="bg-red-600 text-white px-10 py-2 rounded-full font-black uppercase shadow-md hover:bg-black transition-all active:scale-95"
                                    >
                                        LIÊN HỆ
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-20 text-gray-400 font-bold uppercase italic">
                                    Bạn chưa có yêu cầu nhận nào.
                                </div>
                            )}
                        </div>

                        {/* --- UI ĐIỀU HƯỚNG PHÂN TRANG --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-3">
                                <button 
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl bg-white border-2 border-black disabled:opacity-30 hover:bg-main transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`w-12 h-12 rounded-xl font-black border-2 border-black transition-all ${
                                            currentPage === index + 1 
                                            ? "bg-main text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                                            : "bg-white text-black hover:bg-gray-100"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button 
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl bg-white border-2 border-black disabled:opacity-30 hover:bg-main transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        

            {/* MODAL LIÊN HỆ - GIỮ NGUYÊN TOÀN BỘ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[40px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative p-8 animate-in zoom-in-95">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-black" />
                        </button>

                        <h2 className="text-2xl font-black uppercase italic text-center mb-6">Thông Tin Người Cho</h2>

                        {loadingContact ? (
                            <div className="flex flex-col items-center py-10">
                                <Loader2 className="animate-spin w-10 h-10 text-green-500 mb-2" />
                                <p className="font-bold text-gray-400">Đang tải...</p>
                            </div>
                        ) : contactData ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-black/5">
                                    <div className="bg-blue-100 p-2 rounded-lg"><User className="text-blue-600 w-5 h-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Họ và tên</p>
                                        <p className="font-bold text-black uppercase italic">{contactData.Post_news_share?.User?.username || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-black/5">
                                    <div className="bg-green-100 p-2 rounded-lg"><Phone className="text-green-600 w-5 h-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Số điện thoại</p>
                                        <p className="font-bold text-black">{contactData.Post_news_share?.User?.phone || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-black/5">
                                    <div className="bg-red-100 p-2 rounded-lg"><MapPin className="text-red-600 w-5 h-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Địa chỉ</p>
                                        <p className="font-bold text-black text-sm italic leading-tight">{contactData.Post_news_share?.User?.location || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <a href={`tel:${contactData.Post_news_share?.User?.phone}`} className="flex-1 bg-[#12ff00] py-3 rounded-full font-black text-center uppercase italic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all">GỌI NGAY</a>
                                    <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white py-3 rounded-full font-black uppercase italic border-2 border-black hover:bg-gray-100 transition-all">ĐÓNG</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 font-bold text-red-500 italic">Dữ liệu hiện không khả dụng.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceivingPage;