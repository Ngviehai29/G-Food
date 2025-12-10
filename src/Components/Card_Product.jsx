import React, { useState, useEffect } from "react";
import map from "../G-Food-Images/google-maps.png";
import data_product from "../Data/Product.json";
import { MapPin, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductDetail } from "./ProductDetail";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";
const API_URL = "https://be-g-food.onrender.com/api";

export const Card_Product = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // THÊM: State cho scroll
    const [scrollRequest, setScrollRequest] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Lấy dữ liệu từ API
    

    // Trong Card_Product.js - sửa useEffect đầu tiên
useEffect(() => {
    fetchProductsFromAPI();

    // Lắng nghe event từ Navbar khi ở bất kỳ trang nào
    const handleScrollRequest = (event) => {
        const { productId, productName, timestamp } = event.detail;
        console.log("📡 Card_Product nhận scroll request:", productId);
        
        // Tạo scroll request ngay lập tức
        setScrollRequest({
            productId,
            productName: productName || "Sản phẩm",
            timestamp,
            attempts: 0,
            // THÊM: đánh dấu từ search
            fromSearch: true
        });
    };

    // THÊM: Lắng nghe sự kiện từ Navbar khi ở Home
    const handleSearchInHome = (event) => {
        const { productId, productName, force } = event.detail;
        console.log(
            `🏠 Card_Product nhận yêu cầu tìm sản phẩm từ Navbar: ${productId}`
        );

        // Tạo scroll request tương tự
        setScrollRequest({
            productId,
            productName: productName || "Sản phẩm",
            timestamp: Date.now(),
            attempts: 0,
            fromSearch: true,
            force: force || false
        });
    };

    window.addEventListener("scrollToProductFromSearch", handleScrollRequest);
    window.addEventListener("searchProductInHome", handleSearchInHome);

    return () => {
        window.removeEventListener("scrollToProductFromSearch", handleScrollRequest);
        window.removeEventListener("searchProductInHome", handleSearchInHome);
    };
}, []);

    // Đánh dấu dữ liệu đã load xong
    useEffect(() => {
        if (apiProducts.length > 0 || data_product.length > 0) {
            setIsDataLoaded(true);
            console.log("✅ Dữ liệu sản phẩm đã sẵn sàng");
        }
    }, [apiProducts, data_product]);

    // Xử lý scroll request khi dữ liệu đã sẵn sàng
    useEffect(() => {
        if (scrollRequest && isDataLoaded) {
            console.log(
                "🚀 Xử lý scroll request cho:",
                scrollRequest.productId
            );

            // Đợi một chút để DOM render xong
            setTimeout(() => {
                handleScrollToProduct(
                    scrollRequest.productId,
                    scrollRequest.productName
                );
                // Reset sau khi xử lý
                setScrollRequest(null);
            }, 800);
        } else if (scrollRequest && !isDataLoaded) {
            // Nếu chưa có dữ liệu, đợi thêm
            console.log("⏳ Đang chờ dữ liệu để scroll...");

            if (scrollRequest.attempts < 5) {
                // Thử lại sau 1 giây
                setTimeout(() => {
                    setScrollRequest((prev) => ({
                        ...prev,
                        attempts: prev.attempts + 1,
                    }));
                }, 1000);
            } else {
                console.warn("❌ Không thể scroll sau nhiều lần thử");
                setScrollRequest(null);
            }
        }
    }, [scrollRequest, isDataLoaded]);

    // Hàm scroll đến sản phẩm (THÊM productName parameter)
    const handleScrollToProduct = (productId, productName = null) => {
        console.log("🔍 Tìm sản phẩm với ID:", productId, "Tên:", productName);

        const allProducts = apiProducts.length > 0 ? apiProducts : data_product;

        // Tìm sản phẩm
        let targetIndex = -1;
        for (let i = 0; i < allProducts.length; i++) {
            const p = allProducts[i];
            const currentId = p.id || p.apiData?.id;
            if (currentId && currentId.toString() === productId.toString()) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex !== -1) {
            // Tính trang
            const targetPage = Math.floor(targetIndex / itemsPerPage) + 1;

            if (targetPage !== currentPage) {
                console.log(`🔄 Chuyển đến trang ${targetPage}`);
                setCurrentPage(targetPage);

                // Đợi trang mới render
                setTimeout(() => {
                    performScroll(productId, productName);
                }, 1000);
            } else {
                performScroll(productId, productName);
            }
        } else {
            console.warn("❌ Không tìm thấy sản phẩm với ID:", productId);

            // Hiển thị thông báo nếu có productName
            if (productName) {
                showNotification(
                    `"${productName}" không có trong danh sách sản phẩm`,
                    "warning"
                );
            }
        }
    };

    // Thực hiện scroll (THÊM productName parameter và cải thiện logic)
    const performScroll = (productId, productName = null) => {
        setTimeout(() => {
            // TÌM BẰNG NHIỀU CÁCH
            let element = document.getElementById(`product-${productId}`);

            if (!element) {
                element = document.querySelector(
                    `[data-product-id="${productId}"]`
                );
            }

            if (!element) {
                const allProductElements =
                    document.querySelectorAll("[data-product-id]");
                for (const el of allProductElements) {
                    if (el.dataset.productId === productId.toString()) {
                        element = el;
                        break;
                    }
                }
            }

            if (element) {
                console.log(`✅ Tìm thấy element, đang scroll...`);

                // Cuộn đến sản phẩm
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                // Highlight
                element.classList.add("highlight-search-result");
                setTimeout(() => {
                    element.classList.remove("highlight-search-result");
                }, 3000);

                console.log("🎉 Đã scroll đến sản phẩm thành công!");

                // Hiển thị thông báo
                if (productName) {
                    showNotification(`Đã tìm thấy "${productName}"`, "success");
                }
            } else {
                console.warn(
                    "⚠️ Không tìm thấy element với ID:",
                    `product-${productId}`
                );

                // Thử tìm lại sau 1 giây
                setTimeout(() => {
                    const retryElement =
                        document.getElementById(`product-${productId}`) ||
                        document.querySelector(
                            `[data-product-id="${productId}"]`
                        );
                    if (retryElement) {
                        console.log("🔄 Tìm thấy sau retry");
                        retryElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                        retryElement.classList.add("highlight-search-result");
                        setTimeout(() => {
                            retryElement.classList.remove(
                                "highlight-search-result"
                            );
                        }, 3000);

                        if (productName) {
                            showNotification(
                                `Đã tìm thấy "${productName}"`,
                                "success"
                            );
                        }
                    } else {
                        console.error("❌ Vẫn không tìm thấy sau retry");
                        if (productName) {
                            showNotification(
                                `Không thể tìm thấy "${productName}"`,
                                "warning"
                            );
                        }
                    }
                }, 1000);
            }
        }, 300);
    };

    // Hàm hiển thị thông báo (THÊM vào component)
    const showNotification = (message, type = "info") => {
        // Xóa notification cũ
        const existingNotifications = document.querySelectorAll(
            ".search-notification"
        );
        existingNotifications.forEach((notification) => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });

        // Tạo element thông báo
        const notification = document.createElement("div");
        notification.className = `search-notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-lg">${
                    type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️"
                }</span>
                <span>${message}</span>
            </div>
        `;

        // Thêm vào body
        document.body.appendChild(notification);

        // Tự động xóa sau 4 giây
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    };

    // Hàm lấy dữ liệu từ API (giữ nguyên)
    const fetchProductsFromAPI = async () => {
        try {
            setLoading(true);
            setApiError(null);

            const response = await fetch(`${API_URL}/postnewshare/`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const convertedProducts = data.data.map((item) => ({
                    id: item.id,
                    name: item.name || "Sản phẩm không tên",
                    img:
                        item.Post_images?.[0]?.image ||
                        "https://placehold.co/400x300/e5e7eb/6b7280?text=Không+có+ảnh",
                    location: item.User?.location || "Chưa có địa điểm",
                    apiData: item,
                    category: item.Category?.name,
                }));

                setApiProducts(convertedProducts);
            } else {
                setApiError("API trả về dữ liệu không đúng định dạng");
            }
        } catch (error) {
            console.error("Error fetching from API:", error);
            setApiError(`Lỗi kết nối API: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Các hàm và biến khác giữ nguyên...
    const displayProducts = apiProducts.length > 0 ? apiProducts : data_product;
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

    const getProductDetail = (product) => {
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
                images: apiData.Post_images || [],
                createdAt: apiData.created_at || apiData.createdAt,
            };
        }

        return {
            type: "Thực phẩm",
            description: "Sản phẩm chất lượng từ cộng đồng G-Food.",
            contact: "Liên hệ qua ứng dụng",
            userInfo: "Người chia sẻ",
            images: [],
        };
    };

    // Component ProductCard (THÊM toString() cho data-product-id)
    const ProductCard = ({ product, detail }) => {
        const productId = product.id || product.apiData?.id;
        const elementId = `product-${productId}`;

        return (
            <div
                id={elementId}
                data-product-id={productId ? productId.toString() : ""}
                className="group transition-all duration-300 h-[340px] relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col"
            >
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
            {/* Hiển thị thông báo nếu có scroll request */}
            {scrollRequest && (
                <div className="fixed top-20 right-4 z-50 bg-blue-500 text-white p-3 rounded-lg shadow-lg animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                        <span className="text-sm">Đang tìm sản phẩm...</span>
                    </div>
                </div>
            )}

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
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2)
                                    pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;

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

            {/* Sản phẩm */}
            <div className="space-y-8">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.slice(0, 3).map((product, index) => {
                        const detail = getProductDetail(product);
                        return (
                            <ProductCard
                                key={`${product.id}-${index}`}
                                product={product}
                                detail={detail}
                            />
                        );
                    })}
                </div>

                {currentProducts.length > 3 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.slice(3, 6).map((product, index) => {
                            const detail = getProductDetail(product);
                            return (
                                <ProductCard
                                    key={`${product.id}-${index + 3}`}
                                    product={product}
                                    detail={detail}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
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
