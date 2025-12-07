import React, { useState, useEffect } from "react";
import map from "../G-Food-Images/google-maps.png";
import data_product from "../Data/Product.json";
import { MapPin, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductDetail } from "./ProductDetail";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";

// API URL của bạn
const API_URL = "https://be-g-food.onrender.com/api";

export const Card_Product = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Thêm state cho API data
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // THÊM STATE CHO PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // 6 items mỗi trang

    // Lấy dữ liệu từ API khi component mount
    useEffect(() => {
        fetchProductsFromAPI();
    }, []);

    // Hàm lấy dữ liệu từ API
    const fetchProductsFromAPI = async () => {
        try {
            setLoading(true);
            setApiError(null);

            // Gọi API với endpoint đúng của bạn
            console.log("Fetching from API:", `${API_URL}/postnewshare/`);

            const response = await fetch(`${API_URL}/postnewshare/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(
                    `API Error: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log("API Response data:", data);

            // Kiểm tra cấu trúc response
            if (data.success && Array.isArray(data.data)) {
                console.log("Found", data.data.length, "products from API");

                // Chuyển đổi dữ liệu API sang format giống với data_product
                const convertedProducts = data.data.map((item, index) => ({
                    id: item.id || `api-product-${index}`,
                    name: item.name || "Sản phẩm không tên",
                    // Xử lý ảnh: Post_images là mảng, lấy ảnh đầu tiên
                    img:
                        item.Post_images && item.Post_images.length > 0
                            ? item.Post_images[0].image
                            : "https://placehold.co/400x300/e5e7eb/6b7280?text=Không+có+ảnh",
                    // Lấy location từ User object
                    location: item.User?.location || "Chưa có địa điểm",
                    // Giữ thêm dữ liệu gốc từ API để dùng trong modal
                    apiData: item,
                    // Thêm category nếu cần
                    category: item.Category?.name,
                }));

                setApiProducts(convertedProducts);
                // Reset về trang 1 khi có dữ liệu mới
                setCurrentPage(1);
            } else {
                console.warn("API structure not as expected:", data);
                setApiError("API trả về dữ liệu không đúng định dạng");
            }
        } catch (error) {
            console.error("Error fetching from API:", error);
            setApiError(`Lỗi kết nối API: ${error.message}`);
            setApiProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Quyết định dùng dữ liệu nào: Ưu tiên API, nếu không có thì dùng data_product
    const displayProducts = apiProducts.length > 0 ? apiProducts : data_product;

    // THÊM: Logic phân trang
    const totalPages = Math.ceil(displayProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = displayProducts.slice(startIndex, endIndex);

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

    // Lấy thông tin chi tiết của sản phẩm - CẬP NHẬT để check cả API data
    const getProductDetail = (product) => {
        // Nếu product có apiData (từ API), lấy thông tin từ đó
        if (product.apiData) {
            const apiData = product.apiData;
            return {
                type: apiData.Category?.name || "Thực phẩm",
                description:
                    apiData.description ||
                    "Sản phẩm được chia sẻ từ cộng đồng G-Food.",
                contact:
                    apiData.User?.contact ||
                    apiData.User?.phone ||
                    "Liên hệ qua ứng dụng",
                userInfo: apiData.User?.name
                    ? `${apiData.User.name} - ${apiData.User.location || ""}`
                    : "Người chia sẻ",
                // Thêm các thông tin khác nếu có
                images: apiData.Post_images || [],
                createdAt: apiData.created_at || apiData.createdAt,
            };
        }

        // Nếu không, dùng productDetails cũ
        // Fallback cho data_product (nếu không có API data)
        return {
            type: "Thực phẩm",
            description: "Sản phẩm chất lượng từ cộng đồng G-Food.",
            contact: "Liên hệ qua ứng dụng",
            userInfo: "Người chia sẻ",
            images: [],
        };
    };

    // Component con cho Product Card
    const ProductCard = ({ product, detail }) => {
        return (
            <div className="group transition-all duration-300 h-[340px] relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col">
                {/* Product Image */}
                <div className="relative h-[180px] overflow-hidden flex-shrink-0">
                    <img
                        className="group-hover:scale-110 transition-transform duration-500 w-full h-full object-cover"
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src =
                                "https://placehold.co/400x300/e5e7eb/6b7280?text=Ảnh+Lỗi";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                        <img className="w-4 h-4" src={map} alt="location" />
                        <p className="pl-1 text-sm font-medium text-gray-700">
                            {product.location}
                        </p>
                    </div>

                    {/* API Indicator */}
                    {/* {apiData && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            API
                        </div>
                    )} */}

                    {/* Detail Button */}
                    <button
                        onClick={() => openModal(product)}
                        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 font-medium text-xs px-4 py-1.5 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:scale-105"
                    >
                        Xem chi tiết
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 line-clamp-1">
                        {product.name}
                    </h3>

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

                    <div className="flex-grow"></div>

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
                            Nhận ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Thông báo trạng thái API và phân trang */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    {loading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-blue-700 text-sm">
                                ⏳ Đang tải dữ liệu từ API...
                            </p>
                        </div>
                    )}

                    {apiError && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-700 text-sm">
                                ⚠️ {apiError}
                            </p>
                            <button
                                onClick={fetchProductsFromAPI}
                                className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {!loading && !apiError && (
                        <div className="text-sm text-gray-600">
                            {apiProducts.length > 0
                                ? `✅ Hiển thị ${currentProducts.length} trên ${displayProducts.length} sản phẩm`
                                : `📂 Hiển thị ${currentProducts.length} trên ${displayProducts.length} sản phẩm mẫu`}
                        </div>
                    )}
                </div>

                {/* Controls phân trang */}
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1 || loading}
                        className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                            currentPage === 1 || loading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg ${
                                            currentPage === pageNum
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}

                        {totalPages > 5 && (
                            <span className="mx-1 text-gray-500">...</span>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages || loading}
                        className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                            currentPage === totalPages || loading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Sau
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <span className="text-sm text-gray-500 ml-2">
                        Trang {currentPage}/{totalPages}
                    </span>
                </div>
            </div>

            {/* CHIA THÀNH 2 HÀNG, MỖI HÀNG 3 SẢN PHẨM */}
            <div className="space-y-8">
                {/* Hàng 1: 3 sản phẩm đầu */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.slice(0, 3).map((product, index) => {
                        const detail = getProductDetail(product);
                        return (
                            <ProductCard
                                key={`${product.id}-${index}`}
                                product={product}
                                detail={detail}
                                apiData={product.apiData}
                            />
                        );
                    })}
                </div>

                {/* Hàng 2: 3 sản phẩm tiếp theo */}
                {currentProducts.length > 3 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.slice(3, 6).map((product, index) => {
                            const detail = getProductDetail(product);
                            return (
                                <ProductCard
                                    key={`${product.id}-${index + 3}`}
                                    product={product}
                                    detail={detail}
                                    apiData={product.apiData}
                                />
                            );
                        })}
                    </div>
                )}
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
