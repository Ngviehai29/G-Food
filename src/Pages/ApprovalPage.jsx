import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Users, CheckCircle, XCircle, Loader2, ArrowRight, ChevronLeft, ChevronRight, Lock } from "lucide-react";

const ApprovalPage = () => {
    const [myPosts, setMyPosts] = useState([]); 
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8; 

    const API_URL = process.env.REACT_APP_API_URL || "https://be-g-food.onrender.com/api";
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

    useEffect(() => {
        if (currentUserId) fetchMyPosts();
    }, [currentUserId]);

    const fetchMyPosts = async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/postnewshare/list-user/${currentUserId}`);
            setMyPosts(res.data.data || []);
        } catch (err) {
            setMyPosts([]); 
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = myPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(myPosts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    // --- CẬP NHẬT LOGIC DUYỆT DUY NHẤT 1 NGƯỜI ---
    const handleApprove = async (receivedID) => {
        try {
            await axios.put(`${API_URL}/receivepost/accept/${currentPost.id}/${receivedID}`);
            toast.success("Duyệt thành công! Sản phẩm này hiện đã đóng.");
            setSelectedUsers([]);
            setShowModal(false);
            fetchMyPosts();
        } catch (err) {
            toast.error("Duyệt thất bại. Có thể sản phẩm này đã được duyệt trước đó.");
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfaf1] pb-12">
            <div className='w-full h-[78px] bg-[#0f3714] mb-12'></div>

            <div className="max-w-6xl mx-auto px-4 md:px-10">
                <header className="text-center mb-12">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
                        Duyệt Sản Phẩm Cho <span className="text-main">G-Food</span>
                    </h1>
                    
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-main w-10 h-10" /></div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-[32px] border-2 border-green-200 shadow-sm">
                            {currentPosts.length > 0 ? currentPosts.map((post) => {
                               
                                const isFinished = post.status === 1 || post.is_received === true; 

                                return (
                                    <div key={post.id} className={`group rounded-2xl p-3 border transition-all duration-300 ${isFinished ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-green-50/50 border-transparent hover:border-main hover:shadow-md'}`}>
                                        <div className="relative overflow-hidden rounded-xl h-40 mb-3">
                                            <img
                                                src={post.Post_images?.[0]?.image || "https://via.placeholder.com/300"}
                                                alt={post.name}
                                                className={`w-full h-full object-cover transition-transform duration-500 ${!isFinished && 'group-hover:scale-110'}`}
                                            />
                                            {isFinished && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-[10px] font-black uppercase">Đã hoàn thành</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-700 uppercase text-center truncate">{post.name}</h3>
                                        
                                        {isFinished ? (
                                            <button disabled className="mt-3 w-full bg-gray-400 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                                                <CheckCircle size={14} /> ĐÃ DUYỆT XONG
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => fetchUsersForPost(post)}
                                                className="mt-3 w-full bg-[#ff3b30] hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                                            >
                                                XEM NGƯỜI MUỐN NHẬN <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full text-center py-20 text-gray-400 font-medium">Bạn chưa có bài đăng chia sẻ nào.</div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-10 gap-2">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-green-50 transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button key={index + 1} onClick={() => paginate(index + 1)} className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === index + 1 ? "bg-main text-white shadow-md" : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"}`}>
                                        {index + 1}
                                    </button>
                                ))}
                                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-green-50 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex-1"></div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase italic flex-1 text-center">CHỌN NGƯỜI NHẬN</h2>
                            <div className="flex-1 text-right">
                                <button onClick={() => setShowModal(false)}>
                                    <XCircle className="text-gray-300 hover:text-red-500 ml-auto" size={30} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto bg-[#fdfaf1]">
                            {modalLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-main w-12 h-12" /></div>
                            ) : selectedUsers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {selectedUsers.map((userReq) => (
                                        <div key={userReq.id} className="bg-[#9df77d] p-3 rounded-[35px] border-2 border-white shadow-lg flex flex-col items-center">
                                            <div className="w-full h-32 bg-white rounded-[25px] overflow-hidden mb-2 border-4 border-[#9df77d]">
                                                <img src={currentPost?.Post_images?.[0]?.image || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="Product" />
                                            </div>
                                            <h3 className="font-black text-lg uppercase italic leading-tight text-center">{currentPost?.name}</h3>
                                            <p className="text-gray-700 text-[10px] font-bold mb-3 italic">
                                                Người đăng ký: {userReq.User?.userName || userReq.User?.username || "Người dùng"}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    if(window.confirm(`Bạn có chắc chắn muốn tặng sản phẩm này cho ${userReq.User?.userName || 'người này'} không? Thao tác này không thể hoàn tác.`)) {
                                                        handleApprove(userReq.id);
                                                    }
                                                }}
                                                className="bg-red-600 text-white text-[10px] px-6 py-2 rounded-full font-black uppercase hover:bg-black transition-colors"
                                            >
                                                DUYỆT
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-20 font-black uppercase italic">Chưa có ai đăng ký nhận bài này.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalPage;