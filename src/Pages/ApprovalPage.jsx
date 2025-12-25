import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Users, CheckCircle, XCircle, Loader2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const ApprovalPage = () => {
    const [myPosts, setMyPosts] = useState([]); // Danh sách bài viết của tôi
    const [selectedUsers, setSelectedUsers] = useState([]); // Danh sách user chờ duyệt của 1 bài
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    // --- PHẦN THÊM MỚI: STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8; // Số bài viết hiển thị trên 1 trang

    const API_URL = process.env.REACT_APP_API_URL || "https://be-g-food.onrender.com/api";
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => {
        if (currentUserId) fetchMyPosts();
    }, [currentUserId]);

    // 1. Lấy danh sách bài đăng mà tôi đã chia sẻ
    const fetchMyPosts = async () => {
        if (!currentUserId) {
            console.error("Không tìm thấy UserId trong localStorage");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/postnewshare/list-user/${currentUserId}`);
            const posts = res.data.data || [];
            setMyPosts(posts);
        } catch (err) {
            console.error("Lỗi kết nối API:", err.response?.data || err.message);
            setMyPosts([]); 
        } finally {
            setLoading(false);
        }
    };

    // --- PHẦN THÊM MỚI: LOGIC TÍNH TOÁN PHÂN TRANG ---
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = myPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(myPosts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu khi chuyển trang
    };

    // 2. API SỐ 3: Lấy danh sách user muốn nhận bài post này (id = postID)
    const fetchUsersForPost = async (post) => {
        setCurrentPost(post);
        setModalLoading(true);
        setShowModal(true);
        try {
            const res = await axios.get(`${API_URL}/receivepost/list/${post.id}`);
            setSelectedUsers(res.data.data || []);
        } catch (err) {
            toast.error("Không thể lấy danh sách người đăng ký");
        } finally {
            setModalLoading(false);
        }
    };

    // 3. API DUYỆT: PUT AcceptReceived (id1=postID, id2=receivedID)
    const handleApprove = async (receivedID) => {
        try {
            await axios.put(`${API_URL}/receivepost/accept/${currentPost.id}/${receivedID}`);
            toast.success("Đã duyệt thành công cho người dùng này!");

            setSelectedUsers(prev => prev.filter(u => u.id !== receivedID));
            if (selectedUsers.length <= 1) setShowModal(false);
            fetchMyPosts();
        } catch (err) {
            toast.error("Duyệt thất bại, vui lòng kiểm tra lại");
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfaf1] pb-12">
            {/* BOX HEADER MÀU XANH ĐẬM GIỐNG TRANG PROFILE */}
            <div className='w-full h-[78px] bg-[#0f3714] mb-12'></div>

            <div className="max-w-6xl mx-auto px-4 md:px-10">
                <header className="text-center mb-12">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
                        Duyệt Sản Phẩm Cho <span className="text-main">G-Food</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Quản lý những yêu cầu nhận thực phẩm từ cộng đồng</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-main w-10 h-10" /></div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-[32px] border-2 border-green-200 shadow-sm">
                            {currentPosts.length > 0 ? currentPosts.map((post) => (
                                <div key={post.id} className="group bg-green-50/50 rounded-2xl p-3 border border-transparent hover:border-main hover:shadow-md transition-all duration-300">
                                    <div className="relative overflow-hidden rounded-xl h-40 mb-3">
                                        <img
                                            src={post.Post_images?.[0]?.image || "https://via.placeholder.com/300"}
                                            alt={post.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-700 uppercase text-center truncate">{post.name}</h3>
                                    <button
                                        onClick={() => fetchUsersForPost(post)}
                                        className="mt-3 w-full bg-[#ff3b30] hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                                    >
                                        XEM NGƯỜI MUỐN NHẬN <ArrowRight size={14} />
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-20 text-gray-400 font-medium">Bạn chưa có bài đăng chia sẻ nào.</div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-10 gap-2">
                                <button 
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-green-50 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                            currentPage === index + 1 
                                            ? "bg-main text-white shadow-md" 
                                            : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button 
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-green-50 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODAL CHI TIẾT NGƯỜI NHẬN - GIỮ NGUYÊN */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                        {/* Header của Modal */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex-1"></div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase italic flex-1 text-center">
                                CÁC SẢN PHẨM CẦN DUYỆT
                            </h2>
                            <div className="flex-1 text-right">
                                <button onClick={() => setShowModal(false)}>
                                    <XCircle className="text-gray-300 hover:text-red-500 ml-auto" size={30} />
                                </button>
                            </div>
                        </div>

                        {/* Nội dung Modal */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto bg-[#fdfaf1]">
                            {modalLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-main w-12 h-12" /></div>
                            ) : selectedUsers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {selectedUsers.map((userReq) => (
                                        <div key={userReq.id} className="bg-[#9df77d] p-3 rounded-[35px] border-2 border-white shadow-lg flex flex-col items-center">
                                            {/* Phần Ảnh Sản Phẩm */}
                                            <div className="w-full h-32 bg-white rounded-[25px] overflow-hidden mb-2 border-4 border-[#9df77d]">
                                                <img
                                                    src={currentPost?.Post_images?.[0]?.image || "https://via.placeholder.com/150"}
                                                    className="w-full h-full object-cover"
                                                    alt="Product"
                                                />
                                            </div>

                                            {/* Thông tin sản phẩm và người nhận */}
                                            <h3 className="font-black text-lg uppercase italic leading-tight text-center">
                                                {currentPost?.name}
                                            </h3>
                                            <p className="text-gray-700 text-[10px] font-bold mb-3 italic">
                                                {userReq.User?.userName || userReq.User?.username || "Người dùng"}
                                            </p>

                                            <button
                                                onClick={() => handleApprove(userReq.id)}
                                                className="bg-red-600 text-white text-[8px] px-2 py-1.5 rounded-full font-black uppercase hover:bg-black transition-colors"
                                            >
                                                Duyệt
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-20 font-black uppercase italic">
                                    Chưa có ai đăng ký nhận bài này.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalPage;