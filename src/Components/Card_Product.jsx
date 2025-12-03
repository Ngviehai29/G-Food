import React, { useState } from "react";
import map from "../G-Food-Images/google-maps.png";
import data_product from "../Data/Product.json";
import { MapPin, Package } from "lucide-react";
import { ProductDetail } from "./ProductDetail";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

export const Card_Product = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Thông tin chi tiết cho từng sản phẩm
    const productDetails = {
        "Gạo GT25": {
            type: "Lương thực",
            description:
                "Gạo GT25 thơm ngon, chất lượng cao, gạo mới thu hoạch đảm bảo an toàn vệ sinh thực phẩm. Phù hợp cho các bữa ăn gia đình và hoạt động từ thiện.",
            contact: "Nguyễn Văn A - 0901 234 567",
        },
        "Thịt Heo": {
            type: "Thực phẩm tươi",
            description:
                "Thịt heo tươi ngon, đảm bảo chất lượng, nguồn gốc rõ ràng. Đã qua kiểm dịch và chế biến hợp vệ sinh. Thịt được bảo quản lạnh đúng tiêu chuẩn.",
            contact: "Trần Thị B - 0902 345 678",
        },
        "Mỳ Tôm": {
            type: "Đồ khô",
            description:
                "Mỳ tôm các loại, đa dạng hương vị, hạn sử dụng còn dài. Đóng gói nguyên bao bì, phù hợp cho các chương trình từ thiện và dự trữ.",
            contact: "Lê Văn C - 0903 456 789",
        },
        "Rau Muống": {
            type: "Rau xanh",
            description:
                "Rau muống tươi xanh, sạch sẽ, trồng theo phương pháp hữu cơ. Không sử dụng thuốc trừ sâu, thu hoạch trong ngày, đảm bảo tươi ngon.",
            contact: "Phạm Thị D - 0904 567 890",
        },
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        document.body.style.overflow = "auto";
    };

    // Lấy thông tin chi tiết của sản phẩm
    const getProductDetail = (productName) => {
        return (
            productDetails[productName] || {
                type: "Thực phẩm",
                description:
                    "Sản phẩm chất lượng, đảm bảo vệ sinh an toàn thực phẩm. Phù hợp cho mọi đối tượng sử dụng.",
                contact: "Thành viên G-Food - 1800 1234",
            }
        );
    };

    return (
        <>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data_product.map((product, index) => {
                    const detail = getProductDetail(product.name);
                    return (
                        <div
                            key={`${product.id}-${index}`}
                            className="group transition-all duration-300 h-[340px] relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col"
                        >
                            {/* Product Image */}
                            <div className="relative h-[180px] overflow-hidden flex-shrink-0">
                                <img
                                    className="group-hover:scale-110 transition-transform duration-500 w-full h-full object-cover"
                                    src={product.img}
                                    alt={product.name}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                                {/* Location Badge */}
                                <div className="absolute top-3 left-3 flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                                    <img
                                        className="w-4 h-4"
                                        src={map}
                                        alt="location"
                                    />
                                    <p className="pl-1 text-sm font-medium text-gray-700">
                                        {product.location}
                                    </p>
                                </div>

                                {/* Detail Button */}
                                <button
                                    onClick={() => openModal(product)}
                                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 font-medium text-xs px-4 py-1.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:scale-105"
                                >
                                    Xem chi tiết
                                </button>
                            </div>

                            {/* Product Info - KHÔNG CÓ MÔ TẢ */}
                            <div className="p-4 flex flex-col flex-grow">
                                {/* Product Name */}
                                <h3 className="font-bold text-lg text-gray-800 mb-4 line-clamp-1">
                                    {product.name}
                                </h3>

                                {/* Location and Type - Side by side */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 truncate max-w-[120px]">
                                            {product.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 truncate max-w-[100px]">
                                            {detail.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Empty space để button ở dưới cùng */}
                                <div className="flex-grow"></div>

                                {/* Action Button */}
                                <div className="mt-auto pt-1">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="w-full py-3 text-white font-bold rounded-lg transition duration-300 hover:shadow-md active:scale-95 text-base"
                                        style={{
                                            backgroundColor: PRIMARY_COLOR,
                                            background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${HOVER_COLOR})`,
                                            boxShadow:
                                                "0 4px 12px rgba(151, 181, 69, 0.25)",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.opacity =
                                                "0.9";
                                            e.currentTarget.style.transform =
                                                "translateY(-1px)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.transform =
                                                "translateY(0)";
                                        }}
                                    >
                                        Nhận ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hiển thị modal chi tiết */}
            {showModal && selectedProduct && (
                <ProductDetail
                    product={selectedProduct}
                    onClose={closeModal}
                    getProductDetail={getProductDetail}
                />
            )}
        </>
    );
};
