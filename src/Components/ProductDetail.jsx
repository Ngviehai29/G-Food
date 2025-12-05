import React from "react";
import { X, MapPin, User, Phone, Package, Info } from "lucide-react";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

export const ProductDetail = ({ product, onClose, getProductDetail }) => {
    if (!product) return null;

    const detail = getProductDetail(product.name);

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

                {/* Product Image */}
                <div className="relative h-48">
                    <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                        <h2 className="text-xl font-bold text-white mb-1">
                            {product.name}
                        </h2>
                        <div className="flex items-center text-white/90 text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span>{product.location}</span>
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
                                    {product.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs text-gray-500">Loại</p>
                                <p className="font-medium text-gray-800">
                                    {detail.type}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product Description - CHỈ CÓ TRONG MODAL */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <Info className="w-5 h-5 mr-2" />
                            Mô tả sản phẩm
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">
                                {detail.description}
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
                            <div className="flex items-start text-gray-700">
                                <span className="w-28 text-sm flex-shrink-0 pt-0.5">
                                    Người chia sẻ:
                                </span>
                                <span className="font-medium">
                                    {detail.contact.split(" - ")[0]}
                                </span>
                            </div>
                            <div className="flex items-start text-gray-700">
                                <span className="w-28 text-sm flex-shrink-0 pt-0.5">
                                    Điện thoại:
                                </span>
                                <div className="flex items-center font-medium">
                                    <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                                    {detail.contact.split(" - ")[1]}
                                </div>
                            </div>
                        </div>
                    </div>

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
                            Liên hệ ngay
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
