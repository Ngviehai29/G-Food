import React, { useState, useEffect } from "react";
import { X, MapPin, User, Phone, Package, Info, Loader2 } from "lucide-react";
// Bỏ import Link nếu không cần chuyển hướng ngay sau khi nhấn
// import { Link } from "react-router-dom"; 

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

export const ProductDetail = ({ product, onClose, getProductDetail }) => {
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // ✨ STATE MỚI: Quản lý trạng thái yêu cầu
    const [requestStatus, setRequestStatus] = useState("default"); // 'default', 'pending', 'success', 'error'

    // Gọi API khi component mount hoặc product thay đổi
    useEffect(() => {
        if (product && product.id) {
            fetchProductDetail(product.id);
        }
    }, [product]);

    const fetchProductDetail = async (productId) => {
        try {
            setLoading(true);
            setError(null);

            // Gọi API chi tiết sản phẩm
            const response = await fetch(
                `https://be-g-food.onrender.com/api/postnewshare/`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                // Tìm sản phẩm theo ID
                const foundProduct = data.data.find(
                    (item) => item.id === productId
                );

                if (foundProduct) {
                    // Format dữ liệu theo API mới
                    const formattedDetail = {
                        id: foundProduct.id,
                        name: foundProduct.name,
                        images: foundProduct.Post_image || [],
                        type: foundProduct.category?.name || "Thực phẩm",
                        user: foundProduct.User || {},
                        location:
                            foundProduct.User?.location || "Chưa có địa điểm",
                        description: "Sản phẩm chất lượng từ cộng đồng G-Food",
                        contact:
                            foundProduct.User?.phone || "Liên hệ qua ứng dụng",
                    };

                    setProductDetail(formattedDetail);
                } else {
                    setProductDetail(getProductDetail(product));
                }
            }
        } catch (error) {
            console.error("Error fetching product detail:", error);
            setError("Không thể tải chi tiết sản phẩm");
            setProductDetail(getProductDetail(product));
        } finally {
            setLoading(false);
        }
    };
    
    // ✨ HÀM XỬ LÝ KHI NHẤN NÚT "NHẬN SẢN PHẨM"
    const handleReceiveProduct = () => {
        // Chuyển trạng thái sang "pending" ngay lập tức
        setRequestStatus("pending");

        // Mô phỏng việc gửi yêu cầu tới API
        // Nếu bạn có API gửi yêu cầu thực tế, hãy đặt nó ở đây
        // Ví dụ: await sendRequestApi(product.id);
        
        // Giả lập thời gian xử lý để nút hiển thị "Chờ duyệt"
        setTimeout(() => {
            // Sau khi API xử lý xong (thành công hoặc thất bại)
            // Bạn có thể chuyển trạng thái (ví dụ: setRequestStatus("success") 
            // và hiển thị thông báo, hoặc giữ nguyên 'pending' nếu yêu cầu cần duyệt thủ công).
            // setRequestStatus("success"); 
        }, 1500);
        
        // Nếu bạn muốn chuyển hướng sang trang nhận sản phẩm sau khi nhấn:
        // window.location.href = "/receiveproduct"; 
    };

    if (!product) return null;

    // Sử dụng dữ liệu từ API nếu có, nếu không dùng fallback
    const detail = productDetail || getProductDetail(product);
    const displayImages = productDetail?.images ||
        product.images || [{ image: product.img }];

    // Định nghĩa styles cho nút "Chờ duyệt"
    const isPending = requestStatus === "pending";
    const pendingBgColor = "#9ca3af"; // Màu xám cho trạng thái chờ

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition shadow-lg"
                    style={{ color: PRIMARY_COLOR }}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Loading API */}
                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-3" />
                            <p className="text-gray-600">
                                Đang tải chi tiết sản phẩm...
                            </p>
                        </div>
                    </div>
                )}

                {/* Product Image */}
                <div className="relative h-48">
                    <img
                        src={displayImages[0]?.image || product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                        <h2 className="text-xl font-bold text-white mb-1">
                            {product.name}
                        </h2>
                        <div className="flex items-center text-white/90 text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span>{detail.location || product.location}</span>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-10 overflow-y-auto max-h-[calc(90vh-12rem)]">
                    {/* Location and Type - Side by side */}
                    <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">
                                    Địa điểm
                                </p>
                                <p className="font-medium text-gray-800">
                                    {detail.location || product.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">Loại</p>
                                <p className="font-medium text-gray-800">
                                    {detail.type || "Thực phẩm"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <Info className="w-5 h-5 mr-2" />
                            Mô tả sản phẩm
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">
                                {detail.description ||
                                    "Sản phẩm chất lượng từ cộng đồng G-Food"}
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Thông tin liên hệ
                        </h3>
                        <div className="space-y-3">
                            {/* Lấy tên user từ API */}
                            <div className="flex items-start text-gray-700">
                                <span className="w-28 text-sm flex-shrink-0 pt-0.5">
                                    Người đăng:
                                </span>
                                <span className="font-medium">
                                    {detail.user?.name || "Người chia sẻ"}
                                </span>
                            </div>

                            {/* Lấy location từ API */}
                            <div className="flex items-start text-gray-700">
                                <span className="w-28 text-sm flex-shrink-0 pt-0.5">
                                    Địa chỉ:
                                </span>
                                <span className="font-medium">
                                    {detail.user?.location ||
                                        detail.location ||
                                        "Chưa cập nhật"}
                                </span>
                            </div>

                            {/* Số điện thoại */}
                            <div className="flex items-start text-gray-700">
                                <span className="w-28 text-sm flex-shrink-0 pt-0.5">
                                    Liên hệ:
                                </span>
                                <div className="flex items-center font-medium">
                                    <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                                    {detail.contact || "Liên hệ qua ứng dụng"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        {/* Nút Đóng */}
                        <button
                            onClick={onClose}
                            className="px-5 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300 flex-1"
                        >
                            Đóng
                        </button>
                        
                        {/* ✨ Nút NHẬN SẢN PHẨM/CHỜ DUYỆT ĐÃ ĐƯỢC CẬP NHẬT */}
                        <button
                            onClick={isPending ? undefined : handleReceiveProduct}
                            disabled={isPending}
                            className={`px-5 py-3 text-white font-bold rounded-lg transition duration-300 shadow-lg flex-1 active:scale-95 flex items-center justify-center
                                ${isPending ? 'cursor-not-allowed' : 'hover:shadow-xl'}`}
                            style={{
                                // Thay đổi màu nền dựa trên trạng thái
                                backgroundColor: isPending ? pendingBgColor : PRIMARY_COLOR,
                                background: isPending 
                                    ? `linear-gradient(135deg, ${pendingBgColor}, #b2b2b2)` 
                                    : `linear-gradient(135deg, ${PRIMARY_COLOR}, ${HOVER_COLOR})`,
                                boxShadow: isPending 
                                    ? "none" 
                                    : "0 4px 12px rgba(151, 181, 69, 0.25)",
                            }}
                            onMouseOver={(e) => {
                                if (!isPending) {
                                    e.currentTarget.style.opacity = "0.9";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isPending) {
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }
                            }}
                        >
                            {isPending ? (
                                
                                    "Chờ duyệt"
                                
                            ) : (
                                "Nhận sản phẩm"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};