import React, { useState, useEffect } from "react";
import { X, MapPin, User, Phone, Package, Info, Loader2, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"; // Hoặc thư viện thông báo bạn dùng
import { getCurrentUserId } from "../Services/authService"; // Đường dẫn đến file auth của bạn

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

export const ProductDetail = ({ product, onClose }) => {
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Quản lý trạng thái nút: 'idle' (mặc định), 'loading' (đang gọi API), 'pending' (chờ duyệt)
    const [requestStatus, setRequestStatus] = useState("idle"); 

    const currentUserId = getCurrentUserId();

    useEffect(() => {
        if (product && product.id) {
            fetchProductDetail(product.id);
            checkIfAlreadyRequested(product.id);
        }
    }, [product]);

    // ✨ Kiểm tra xem người dùng đã nhấn nhận sản phẩm này chưa
    const checkIfAlreadyRequested = async (productId) => {
        if (!currentUserId) return;
        try {
            // Gọi API lấy danh sách bài đã gửi yêu cầu của user
            const response = await axios.get(`https://be-g-food.onrender.com/api/receivepost/list-user/${currentUserId}`);
            const isExist = response.data.data.some(req => req.postshareid === productId);
            if (isExist) {
                setRequestStatus("pending");
            }
        } catch (error) {
            console.error("Lỗi check trạng thái yêu cầu:", error);
        }
    };

    const fetchProductDetail = async (productId) => {
        try {
            setLoading(true);
            const response = await fetch(`https://be-g-food.onrender.com/api/postnewshare/`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                const foundProduct = data.data.find((item) => item.id === productId);
                if (foundProduct) {
                    setProductDetail({
                        id: foundProduct.id,
                        name: foundProduct.name,
                        images: foundProduct.Post_images || [],
                        type: foundProduct.Category?.name || "Thực phẩm",
                        user: foundProduct.User || {},
                        location: foundProduct.User?.location || "Chưa có địa điểm",
                        description: foundProduct.content || "Sản phẩm chất lượng từ cộng đồng G-Food",
                        contact: foundProduct.User?.phone || "Liên hệ qua ứng dụng",
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching detail:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✨ HÀM XỬ LÝ KHI NHẤN NÚT "NHẬN SẢN PHẨM"
    const handleReceiveAction = async () => {
        if (!currentUserId) {
            toast.error("Vui lòng đăng nhập để nhận sản phẩm!");
            return;
        }

        setRequestStatus("loading");
        try {
            // Gọi API thực tế bạn đã gửi
            const response = await axios.post(
                `https://be-g-food.onrender.com/api/receivepost/send/${product.id}`, 
                { userid: currentUserId }
            );

            if (response.data.success || response.status === 200) {
                toast.success("Đã gửi yêu cầu thành công!");
                setRequestStatus("pending"); // Chuyển nút sang "Chờ duyệt"
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors;
            // Nếu API báo đã nhận rồi, vẫn hiện Chờ duyệt
            if (errorMsg === "you have received this post") {
                setRequestStatus("pending");
            } else {
                toast.error(errorMsg || "Gửi yêu cầu thất bại.");
                setRequestStatus("idle");
            }
        }
    };

    if (!product) return null;

    const detail = productDetail || {};
    const isPending = requestStatus === "pending";
    const isLoadingAction = requestStatus === "loading";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fadeIn">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg" style={{ color: PRIMARY_COLOR }}>
                    <X className="w-5 h-5" />
                </button>

                {loading && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                    </div>
                )}

                <div className="relative h-48">
                    <img src={detail.images?.[0]?.image || product.img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                        <h2 className="text-xl font-bold text-white">{product.name}</h2>
                        <div className="flex items-center text-white/90 text-sm"><MapPin className="w-3.5 h-3.5 mr-1" />{detail.location}</div>
                    </div>
                </div>

                <div className="p-10 overflow-y-auto max-h-[calc(90vh-12rem)]">
                    <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <div><p className="text-xs text-gray-500">Địa điểm</p><p className="font-medium">{detail.location}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            <div><p className="text-xs text-gray-500">Loại</p><p className="font-medium">{detail.type}</p></div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3 flex items-center"><Info className="w-5 h-5 mr-2" />Mô tả sản phẩm</h3>
                        <div className="bg-blue-50 rounded-xl p-4"><p className="text-gray-700">{detail.description}</p></div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                        <h3 className="text-lg font-bold mb-3 flex items-center"><User className="w-5 h-5 mr-2" />Thông tin liên hệ</h3>
                        <div className="space-y-3">
                            <div className="flex"><span className="w-28 text-sm">Người đăng:</span><span className="font-medium">{detail.user?.userName || "Người chia sẻ"}</span></div>
                            <div className="flex"><span className="w-28 text-sm">Liên hệ:</span><div className="flex items-center font-medium"><Phone className="w-4 h-4 mr-1" />{detail.contact}</div></div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button onClick={onClose} className="px-5 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 flex-1">Đóng</button>

                        <button
                            onClick={handleReceiveAction}
                            disabled={isPending || isLoadingAction}
                            className={`px-5 py-3 text-white font-bold rounded-lg shadow-lg flex-1 flex items-center justify-center transition
                                ${(isPending || isLoadingAction) ? "cursor-not-allowed grayscale" : "active:scale-95"}`}
                            style={{ 
                                backgroundColor: isPending ? "#9ca3af" : PRIMARY_COLOR,
                                background: isPending ? "#9ca3af" : `linear-gradient(135deg, ${PRIMARY_COLOR}, ${HOVER_COLOR})`
                            }}
                        >
                            {isLoadingAction ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isPending ? (
                                <><Clock className="w-5 h-5 mr-2" /> Chờ duyệt</>
                            ) : (
                                "Nhận sản phẩm"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};