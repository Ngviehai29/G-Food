import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Users, Phone, Package, CheckCircle, Loader2, Clock } from "lucide-react";
import { getCurrentUserId } from "../Services/authService";

export const ReceiveAndApprove = () => {
    const [myPosts, setMyPosts] = useState([]); // Danh sách bài tôi đã đăng để duyệt cho người khác
    const [receivedHistory, setReceivedHistory] = useState([]); // Danh sách món tôi đã được nhận thành công
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const userId = getCurrentUserId();

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Lấy toàn bộ bài đăng để lọc ra bài của mình (Phần Người Cho)
            const postsRes = await axios.get("https://be-g-food.onrender.com/api/postnewshare");
            
            // 2. Lấy lịch sử những món mình đã nhận thành công (Phần Người Nhận)
            const historyRes = await axios.get(`https://be-g-food.onrender.com/api/receivepost/history/${userId}`);

            if (postsRes.data.success) {
                // Phân quyền: Chỉ hiện bài do chính user này đăng
                setMyPosts(postsRes.data.data.filter(p => p.userID === userId));
            }
            if (historyRes.data.success) {
                setReceivedHistory(historyRes.data.data);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC CHO NGƯỜI CHO (DUYỆT) ---
    const handleViewApplicants = async (post) => {
        setSelectedPost(post);
        try {
            // Lấy danh sách người chờ duyệt cho bài đăng này
            const res = await axios.get(`https://be-g-food.onrender.com/api/receivepost/list/${post.id}`);
            setApplicants(res.data.data || []);
            setShowModal(true);
        } catch (err) {
            toast.info("Chưa có ai đăng ký nhận bài này.");
        }
    };

    const handleApprove = async (receivedId) => {
        try {
            // API phê duyệt tặng đồ
            await axios.put(`https://be-g-food.onrender.com/api/receivepost/accept/${selectedPost.id}/${receivedId}`);
            toast.success("Đã duyệt thành công!");
            setShowModal(false);
            fetchData(); // Load lại dữ liệu để cập nhật trạng thái
        } catch (err) {
            toast.error(err.response?.data?.errors || "Không thể duyệt");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-main" /></div>;

    return (
        <div className="bg-[#fffcf4] min-h-screen p-4 md:p-10">
            <h1 className="text-3xl font-black text-center mb-10 uppercase tracking-tighter">Nhận Sản Phẩm And Duyệt Sản Phẩm</h1>

            {/* SECTION 1: DUYỆT SẢN PHẨM CHO (Dành cho vai trò Người Cho) */}
            <div className="bg-white border-2 border-[#97b545] rounded-[2rem] p-6 md:p-8 mb-12 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-bold text-gray-800 border-l-4 border-[#97b545] pl-3">DUYỆT SẢN PHẨM CHO</h2>
                    <button className="bg-green-500 text-white px-5 py-1 rounded-full text-[10px] font-bold uppercase">Lọc</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    {myPosts.length > 0 ? myPosts.map((post) => (
                        <div key={post.id} className="text-center group">
                            <div className="relative border-2 border-green-400 rounded-[2rem] overflow-hidden mb-3 aspect-square">
                                <img src={post.Post_images?.[0]?.image || "placeholder.jpg"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            </div>
                            <h3 className="font-black text-gray-800 text-sm md:text-base">{post.name}</h3>
                            <button 
                                onClick={() => handleViewApplicants(post)}
                                className="mt-2 w-full bg-red-500 text-white text-[9px] py-1.5 rounded-full font-black uppercase hover:bg-red-600 transition shadow-lg shadow-red-100"
                            >
                                Xem người muốn nhận
                            </button>
                        </div>
                    )) : (
                        <p className="col-span-4 text-center text-gray-400 italic py-10">Bạn chưa đăng sản phẩm nào cần duyệt.</p>
                    )}
                </div>
            </div>

            {/* SECTION 2: NHẬN SẢN PHẨM (Dành cho vai trò Người Nhận) */}
            <div className="bg-white border-2 border-[#97b545] rounded-[2rem] p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-bold text-gray-800 border-l-4 border-[#97b545] pl-3 uppercase">Nhận Sản Phẩm</h2>
                    <button className="bg-green-500 text-white px-5 py-1 rounded-full text-[10px] font-bold uppercase">Lọc</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    {receivedHistory.length > 0 ? receivedHistory.map((item) => (
                        <div key={item.id} className="text-center">
                            <div className="border-2 border-green-400 rounded-[2rem] overflow-hidden mb-3 aspect-square">
                                <img src={item.Post_news_share?.Post_images?.[0]?.image || "placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-black text-gray-800 text-sm">{item.Post_news_share?.name}</h3>
                            <p className="text-[9px] text-gray-500 font-bold mb-2 uppercase">Người tặng: {item.Post_news_share?.User?.userName}</p>
                            <button className="w-full bg-red-600 text-white text-[9px] py-1.5 rounded-full font-black uppercase shadow-lg shadow-red-100 hover:bg-red-700">
                                Liên hệ
                            </button>
                        </div>
                    )) : (
                        <p className="col-span-4 text-center text-gray-400 italic py-10">Bạn chưa có sản phẩm nào được duyệt nhận.</p>
                    )}
                </div>
            </div>

            {/* MODAL DANH SÁCH NGƯỜI ĐỢI DUYỆT (Chỉ hiện khi Người Cho bấm Xem) */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
                                <Users className="text-[#97b545]" /> Danh sách chờ duyệt
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-red-500 transition font-bold">✕</button>
                        </div>

                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {applicants.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#97b545] border-2 border-green-100 font-black">
                                            {app.User?.userName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{app.User?.userName}</p>
                                            <p className="text-[10px] text-gray-400">Đã gửi yêu cầu</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleApprove(app.id)}
                                        className="bg-[#97b545] text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-[#7d9931] transition active:scale-90 shadow-md shadow-green-100"
                                    >
                                        Duyệt
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};