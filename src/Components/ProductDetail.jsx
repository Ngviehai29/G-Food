import React, { useState, useEffect } from "react";
import { X, MapPin, User, Phone, Package, Info, Loader2 } from "lucide-react";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

export const ProductDetail = ({ product, onClose, getProductDetail }) => {
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            // Nếu API không có endpoint riêng, dùng API list và filter
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
                        // CHÚ Ý: API trả về "Post_image" (không có 's')
                        images: foundProduct.Post_image || [],
                        // Category viết thường "category"
                        type: foundProduct.category?.name || "Thực phẩm",
                        // User viết hoa "User"
                        user: foundProduct.User || {},
                        location:
                            foundProduct.User?.location || "Chưa có địa điểm",
                        description: "Sản phẩm chất lượng từ cộng đồng G-Food",
                        contact:
                            foundProduct.User?.phone || "Liên hệ qua ứng dụng",
                    };

                    setProductDetail(formattedDetail);
                } else {
                    // Fallback nếu không tìm thấy trong API
                    setProductDetail(getProductDetail(product));
                }
            }
        } catch (error) {
            console.error("Error fetching product detail:", error);
            setError("Không thể tải chi tiết sản phẩm");
            // Fallback sử dụng hàm getProductDetail cũ
            setProductDetail(getProductDetail(product));
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    // Sử dụng dữ liệu từ API nếu có, nếu không dùng fallback
    const detail = productDetail || getProductDetail(product);
    const displayImages = productDetail?.images ||
        product.images || [{ image: product.img }];

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

                {/* Loading */}
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
                <div className="p-5 overflow-y-auto max-h-[calc(90vh-12rem)]">
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

                    {/* API Info (chỉ hiển thị khi debug) */}
                    {/* {process.env.NODE_ENV === "development" &&
                        productDetail && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">
                                    API Data:
                                </p>
                                <pre className="text-xs text-gray-600 overflow-auto">
                                    {JSON.stringify(productDetail, null, 2)}
                                </pre>
                            </div>
                        )} */}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-5 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300 flex-1"
                        >
                            Đóng
                        </button>
                        <button
                            className="px-5 py-3 text-white font-bold rounded-lg transition duration-300 shadow-lg flex-1 hover:shadow-xl active:scale-95"
                            style={{
                                backgroundColor: PRIMARY_COLOR,
                                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${HOVER_COLOR})`,
                                boxShadow:
                                    "0 4px 12px rgba(151, 181, 69, 0.25)",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.opacity = "0.9";
                                e.currentTarget.style.transform =
                                    "translateY(-1px)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.opacity = "1";
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >
                            Nhận sản phẩm
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
