import React, { useState, useEffect } from "react";
import { Loader2, Frown } from "lucide-react"; 
import { Link, useParams } from "react-router-dom"; 

// --- CẤU HÌNH VÀ DỮ LIỆU MOCK ---
const PRIMARY_COLOR = "#97b545"; 
const getSharerId = () => 789; 

// Thêm PostId vào MOCK_REQUESTS để liên kết với sản phẩm cụ thể
const MOCK_REQUESTS = [
    { id: 1, productId: 10, productName: 'Táo', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', recipientName: 'Nguyễn Văn A', recipientId: 101, createdAt: new Date().toISOString() },
    { id: 2, productId: 10, productName: 'Táo', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', recipientName: 'Trần Thị B', recipientId: 102, createdAt: new Date().toISOString() },
    
    { id: 3, productId: 20, productName: 'Nho', productImageUrl: 'https://i.imgur.com/1j4pY6X.jpeg', recipientName: 'Lê Văn C', recipientId: 103, createdAt: new Date().toISOString() },
    { id: 4, productId: 30, productName: 'Thịt Heo', productImageUrl: 'https://i.imgur.com/1j4pY6X.jpeg', recipientName: 'Phạm Văn D', recipientId: 104, createdAt: new Date().toISOString() },
];

// HÀM MÔ PHỎNG VIỆC TÌM THÔNG TIN NGƯỜI CHIA SẺ
const getSharerInfo = (sharerId) => {
    if (sharerId === 789) {
        return {
            sharerName: "Admin G-Food",
            sharerPhone: "0901234567",
            sharerLocation: "Quận 1, TP.HCM",
        };
    }
    return {};
};


const PageHeader = () => {
    return (
        <div 
            className="w-full pt-20 pb-16 text-center"
            style={{ 
                backgroundColor: '#fef5ec', 
                backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 2px, transparent 2px, transparent 8px)',
                backgroundSize: '16px 16px'
            }}
        >
            <h1 className="text-5xl font-extrabold" style={{ color: '#333' }}>
                Duyệt Yêu Cầu
            </h1>
            
            <div className="text-sm font-medium mt-3 text-gray-500 justify-center flex">
                <Link to="/" className="hover:text-green-600 transition">Home</Link> 
                <span className="mx-2">/</span> 
                <Link to="/manage-requests" className="hover:text-green-600 transition">Quản lý Yêu cầu</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800">Chi tiết Duyệt</span>
            </div>
        </div>
    );
};
// ------------------------------------------------------------------


const Browseproducts = () => {
    const { productId } = useParams(); 
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sharerId = getSharerId(); 
    const sharerInfo = getSharerInfo(sharerId); 

    
    const currentProductName = MOCK_REQUESTS.find(req => req.productId === parseInt(productId))?.productName || "TẤT CẢ";

    const fetchRequests = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let filteredRequests = MOCK_REQUESTS;

            if (productId) {
                const targetId = parseInt(productId);
                filteredRequests = MOCK_REQUESTS.filter(req => req.productId === targetId);
            }

            setRequests(filteredRequests); 
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (sharerId) {
            fetchRequests(sharerId);
        }
    }, [sharerId, productId]); 

    // ✨ CẬP NHẬT LOGIC handleAction: Chỉ xử lý duyệt (approve)
    const handleAction = async (requestId, action) => {
        const requestToUpdate = requests.find(req => req.id === requestId);
        if (!requestToUpdate) return;
        
        if (action === 'approve') {
            const contactInfo = {
                sharerName: sharerInfo.sharerName,
                sharerPhone: sharerInfo.sharerPhone,
            };

            // GIẢ LẬP LƯU VÀ THÔNG BÁO CHO NGƯỜI NHẬN
            // Trong ứng dụng thực tế, API sẽ lưu contactInfo này vào giao dịch của người nhận
            console.log(`[DUYỆT THÀNH CÔNG] Yêu cầu ID ${requestId} đã được duyệt.`);
            console.log(`Thông tin liên hệ được chia sẻ: ${sharerInfo.sharerPhone}`);
            alert(`Đã DUYỆT yêu cầu nhận sản phẩm của ${requestToUpdate.recipientName} cho sản phẩm ${requestToUpdate.productName}. Thông tin liên hệ đã được chia sẻ.`);
            
        } else {
             // Mặc dù nút đã bị loại bỏ, vẫn giữ guard check này
             alert(`Hành động không được hỗ trợ: ${action}`);
        }

        // Xóa yêu cầu khỏi danh sách chờ duyệt (UI)
        setRequests(prev => prev.filter(req => req.id !== requestId));
    };


    return (
        <div className="w-full min-h-screen">
            <PageHeader /> 
            
            <div className="p-8 pb-16" style={{ backgroundColor: '#ffffff' }}>
                <div className="max-w-6xl mx-auto"> 
                    
                    {loading && (
                        <div className="text-center min-h-[40vh] pt-10">
                            <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-3" />
                            <p className="text-gray-600">Đang tải danh sách yêu cầu...</p>
                        </div>
                    )}
                    {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">Lỗi: {error}</div>}

                    {!loading && (
                        <>
                            {/* Thanh tiêu đề CẬP NHẬT HIỂN THỊ TÊN SẢN PHẨM */}
                            <div className="flex justify-between items-center mb-8 pb-3 border-b-2 border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    YÊU CẦU DUYỆT CHO SẢN PHẨM: <span style={{ color: PRIMARY_COLOR }}>{currentProductName.toUpperCase()}</span>
                                </h2>
                                <button 
                                    className="px-4 py-2 rounded-full text-white font-semibold shadow-md active:scale-95 transition duration-150" 
                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                >
                                    Lọc
                                </button>
                            </div>

                            {requests.length === 0 ? (
                                <div className="text-gray-500 p-10 border rounded-xl bg-white shadow-lg text-center">
                                    <Frown className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                                    <p className="text-lg">Không có yêu cầu nhận sản phẩm nào đang chờ duyệt cho sản phẩm này.</p>
                                </div>
                            ) : (
                                // LAYOUT LƯỚI
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> 
                                    {requests.map(request => (
                                        <div key={request.id} 
                                            className="rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.03] transition-transform duration-300"
                                            style={{ 
                                                border: `4px solid ${PRIMARY_COLOR}`, 
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            {/* Phần hình ảnh */}
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={request.productImageUrl || 'placeholder.jpg'} 
                                                    alt={request.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Phần thông tin và nút */}
                                            <div className="p-3 text-center">
                                                <p className="font-bold text-lg mb-1">{request.productName}</p>
                                                {/* Tên người yêu cầu nhận */}
                                                <p className="text-sm text-gray-600 mb-3">Người Yêu Cầu: {request.recipientName}</p> 

                                                {/* ✨ CHỈ GIỮ LẠI NÚT PROFILE VÀ DUYỆT */}
                                                <div className="flex justify-center space-x-2"> 
                                                     {/* Nút Profile */}
                                                     <button 
                                                         className="text-sm font-semibold py-2 px-3 rounded-full text-white bg-gray-500 hover:bg-gray-600 transition flex-1"
                                                         onClick={() => alert(`Xem Profile ${request.recipientName}`)}
                                                     >
                                                         Profile
                                                     </button>
                                                     
                                                     {/* Nút Duyệt (Kéo rộng hơn do đã bỏ nút Từ chối) */}
                                                     <button 
                                                         className="text-sm font-semibold py-2 px-3 rounded-full text-white transition hover:opacity-80 flex-1"
                                                         style={{ backgroundColor: PRIMARY_COLOR }}
                                                         onClick={() => handleAction(request.id, 'approve')}
                                                     >
                                                         Duyệt
                                                     </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Browseproducts;