import React, { useState, useEffect } from "react";
import {
    X,
    MapPin,
    User,
    Phone,
    Package,
    Info,
    Loader2,
    Clock,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { getCurrentUserId } from "../Services/authService";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

export const ProductDetail = ({ product, onClose }) => {
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState("idle");

    const currentUserId = getCurrentUserId();

    useEffect(() => {
        if (product && product.id) {
            fetchProductDetail(product.id);
            if (currentUserId) {
                checkIfAlreadyRequested(product.id);
            }
        }
    }, [product, currentUserId]);

    const checkIfAlreadyRequested = async (productId) => {
        try {
            const response = await axios.get(
                `https://be-g-food.onrender.com/api/receivepost/list-user/${currentUserId}`
            );
            const isExist = response.data?.data?.some(
                (req) => req.postshareid === productId
            );
            if (isExist) {
                setRequestStatus("pending");
            }
        } catch (error) {
            console.error("Lỗi kiểm tra trạng thái yêu cầu:", error);
        }
    };

    const fetchProductDetail = async (productId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://be-g-food.onrender.com/api/postnewshare/`
            );
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const foundProduct = data.data.find(
                    (item) => item.id === productId
                );
                if (foundProduct) {
                    setProductDetail({
                        id: foundProduct.id,
                        name: foundProduct.name,
                        images: foundProduct.Post_images || [],
                        type: foundProduct.Category?.name || "Thực phẩm",
                        user: foundProduct.User || {},
                        location:
                            foundProduct.User?.location || "Chưa có địa điểm",
                        description:
                            foundProduct.content ||
                            "Sản phẩm chất lượng từ cộng đồng G-Food",
                        contact:
                            foundProduct.User?.phone || "Liên hệ qua ứng dụng",
                    });
                }
            }
        } catch (error) {
            console.error("Lỗi lấy chi tiết sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReceiveAction = async () => {
        if (!currentUserId) {
            toast.error("Vui lòng đăng nhập để nhận sản phẩm!");
            return;
        }

        // Kiểm tra xem ID bài đăng có đúng định dạng không
        console.log("🚀 Gửi yêu cầu nhận:", {
            productId: product.id,
            userid: currentUserId,
        });

        setRequestStatus("loading");
        try {
            const response = await axios.post(
                `https://be-g-food.onrender.com/api/receivepost/send/${product.id}?userid=${currentUserId}`
            );

            if (response.data.success || response.status === 200) {
                toast.success("Đã gửi yêu cầu thành công!");
                setRequestStatus("pending");
            }
        } catch (error) {
            // LẤY DỮ LIỆU LỖI TỪ SERVER TRẢ VỀ (Cấu trúc errors từ Hoppscotch)
            const serverResponse = error.response?.data;
            const errorMsg = serverResponse?.errors;
            const status = error.response?.status;

            console.error("❌ Chi tiết lỗi Server:", serverResponse);

            if (errorMsg === "you have received this post" || status === 400) {
                // Nếu đã nhận rồi hoặc lỗi dữ liệu (thường là do trùng lặp)
                toast.info("Bạn đã gửi yêu cầu cho sản phẩm này trước đó.");
                setRequestStatus("pending"); // Chuyển nút sang Chờ duyệt để đồng bộ UI
            } else if (status === 500) {
                // Lỗi 500 thường do Backend crash hoặc ID sai định dạng
                toast.error("Lỗi hệ thống (500). Vui lòng kiểm tra lại sau.");
                setRequestStatus("idle");
            } else {
                toast.error(serverResponse?.message || "Gửi yêu cầu thất bại.");
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
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                    style={{ color: PRIMARY_COLOR }}
                >
                    <X className="w-5 h-5" />
                </button>

                {loading && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                        <Loader2
                            className="w-8 h-8 animate-spin"
                            style={{ color: PRIMARY_COLOR }}
                        />
                    </div>
                )}

                <div className="relative h-48">
                    <img
                        src={detail.images?.[0]?.image || product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                        <h2 className="text-xl font-bold text-white">
                            {product.name}
                        </h2>
                        <div className="flex items-center text-white/90 text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {detail.location}
                        </div>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-[calc(90vh-12rem)]">
                    <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    Địa điểm
                                </p>
                                <p className="font-medium text-gray-800">
                                    {detail.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    Loại
                                </p>
                                <p className="font-medium text-gray-800">
                                    {detail.type}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                            <Info className="w-4 h-4 mr-2" /> Mô tả sản phẩm
                        </h3>
                        <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                            <p className="text-gray-700 leading-relaxed">
                                {detail.description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2" /> Thông tin liên hệ
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="w-28 text-sm text-gray-500">
                                    Người đăng:
                                </span>
                                <span className="font-semibold text-gray-800">
                                    {detail.user?.username ||
                                        detail.user?.userName ||
                                        detail.user?.name ||
                                        "Người chia sẻ"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-28 text-sm text-gray-500">
                                    Số điện thoại:
                                </span>
                                <div className="flex items-center font-semibold text-gray-800">
                                    <Phone className="w-4 h-4 mr-1.5 text-green-600" />
                                    {detail.user?.phone || detail.contact}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex-1"
                        >
                            Đóng
                        </button>

                        <button
                            onClick={handleReceiveAction}
                            disabled={isPending || isLoadingAction}
                            className={`px-6 py-3 text-white font-bold rounded-xl shadow-md flex-1 flex items-center justify-center transition-all
                                ${
                                    isPending || isLoadingAction
                                        ? "cursor-not-allowed grayscale"
                                        : "hover:shadow-lg active:scale-95"
                                }`}
                            style={{
                                backgroundColor: isPending
                                    ? "#9ca3af"
                                    : PRIMARY_COLOR,
                                background: isPending
                                    ? "#9ca3af"
                                    : `linear-gradient(135deg, ${PRIMARY_COLOR}, ${HOVER_COLOR})`,
                            }}
                        >
                            {isLoadingAction ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isPending ? (
                                <>
                                    <Clock className="w-5 h-5 mr-2" /> Chờ duyệt
                                </>
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
