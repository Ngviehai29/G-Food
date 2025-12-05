import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Package,
    MapPin,
    User,
    Calendar,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Plus,
} from "lucide-react";

const PRIMARY_COLOR = "#97b545";
const HOVER_COLOR = "#7d9931";
const API_URL = "https://be-g-food.onrender.com/api";

const ProductManagement = () => {
    // State chính
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho filter và search
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // State cho modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // 6 sản phẩm mỗi trang

    // Fetch products từ API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/postnewshare/`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                // Format dữ liệu từ API
                const formattedProducts = data.data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    images: item.Post_images || item.Post_image || [],
                    category:
                        item.Category?.name ||
                        item.category?.name ||
                        "Không phân loại",
                    location: item.User?.location || "Chưa có địa điểm",
                    user: item.User || { name: "Người dùng" },
                    createdAt:
                        item.created_at ||
                        item.createdAt ||
                        new Date().toISOString(),
                    status: "active", // Mặc định active
                    views: Math.floor(Math.random() * 1000), // Tạm thời random
                    requests: Math.floor(Math.random() * 100), // Tạm thời random
                    originalData: item,
                }));

                setProducts(formattedProducts);
                setFilteredProducts(formattedProducts);
                setCurrentPage(1); // Reset về trang 1
            } else {
                throw new Error("Dữ liệu API không đúng định dạng");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(`Lỗi: ${error.message}`);
            // KHÔNG CÓ DỮ LIỆU MẪU - chỉ set empty array
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter và search
    useEffect(() => {
        let result = products;

        if (searchTerm) {
            result = result.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.category
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(
                (product) => product.category === selectedCategory
            );
        }

        if (selectedStatus !== "all") {
            result = result.filter(
                (product) => product.status === selectedStatus
            );
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
    }, [searchTerm, selectedCategory, selectedStatus, products]);

    // PHÂN TRANG: Tính toán
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Lấy danh sách categories duy nhất
    const categories = [...new Set(products.map((p) => p.category))];

    // Xử lý hiển thị chi tiết
    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    // Xử lý xóa
    const handleDelete = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            // Gọi API xóa sản phẩm
            const response = await fetch(
                `${API_URL}/postnewshare/${productToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                // Cập nhật state local
                setProducts((prev) =>
                    prev.filter((p) => p.id !== productToDelete.id)
                );
                setFilteredProducts((prev) =>
                    prev.filter((p) => p.id !== productToDelete.id)
                );

                alert("Đã xóa sản phẩm thành công!");
            } else {
                throw new Error("Xóa thất bại");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Lỗi khi xóa sản phẩm");
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    // Xử lý cập nhật trạng thái
    const handleStatusChange = async (productId, newStatus) => {
        try {
            // Gọi API update status
            const response = await fetch(
                `${API_URL}/postnewshare/${productId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (response.ok) {
                // Cập nhật state local
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === productId ? { ...p, status: newStatus } : p
                    )
                );

                setFilteredProducts((prev) =>
                    prev.map((p) =>
                        p.id === productId ? { ...p, status: newStatus } : p
                    )
                );

                alert("Cập nhật trạng thái thành công!");
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("Lỗi khi cập nhật trạng thái");
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Thống kê
    const stats = {
        total: products.length,
        active: products.filter((p) => p.status === "active").length,
        inactive: products.filter((p) => p.status === "inactive").length,
        categories: categories.length,
    };

    // Render page numbers
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbers = 5;

        if (totalPages <= maxPageNumbers) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push("...");
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Quản lý sản phẩm
                </h1>
                <p className="text-gray-600">
                    Quản lý và theo dõi tất cả sản phẩm được đăng trên hệ thống
                </p>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Tổng sản phẩm
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {stats.total}
                            </p>
                        </div>
                        <Package className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Đang hoạt động
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.active}
                            </p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500 bg-green-50 p-2 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Đã ẩn</p>
                            <p className="text-2xl font-bold text-red-600">
                                {stats.inactive}
                            </p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-500 bg-red-50 p-2 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Danh mục</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {stats.categories}
                            </p>
                        </div>
                        <Filter className="w-10 h-10 text-purple-500 bg-purple-50 p-2 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl p-5 shadow border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Đã ẩn</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Làm mới
                        </button>
                        <button
                            onClick={() =>
                                (window.location.href = "/add-product")
                            }
                            className="px-4 py-3 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            <Plus className="w-4 h-4" />
                            Thêm mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden mb-6">
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-3"></div>
                        <p className="text-gray-600">
                            Đang tải dữ liệu từ API...
                        </p>
                    </div>
                ) : error ? (
                    <div className="p-10 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Không tìm thấy sản phẩm nào
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Hãy thử thay đổi bộ lọc hoặc đăng sản phẩm mới
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                                            Sản phẩm
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                                            Danh mục
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                                            Địa điểm
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                                            Ngày đăng
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                                            Trạng thái
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            {/* Product Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                                    ?.image ||
                                                                "https://placehold.co/100x100"
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="w-3 h-3" />
                                                                {product.views}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {
                                                                    product.requests
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                                                    <Package className="w-3 h-3" />
                                                    {product.category}
                                                </span>
                                            </td>

                                            {/* Location */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                    <span className="text-sm truncate max-w-[150px]">
                                                        {product.location}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {formatDate(
                                                            product.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            product.id,
                                                            product.status ===
                                                                "active"
                                                                ? "inactive"
                                                                : "active"
                                                        )
                                                    }
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                                                        product.status ===
                                                        "active"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                                    }`}
                                                >
                                                    {product.status === "active"
                                                        ? "Đang hiển thị"
                                                        : "Đã ẩn"}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                product
                                                            )
                                                        }
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                product
                                                            )
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t flex flex-col md:flex-row md:items-center justify-between">
                                <div className="text-sm text-gray-500 mb-3 md:mb-0">
                                    Hiển thị {startIndex + 1}-
                                    {Math.min(
                                        endIndex,
                                        filteredProducts.length
                                    )}{" "}
                                    trên {filteredProducts.length} sản phẩm
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Nút Previous */}
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg ${
                                            currentPage === 1
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {/* Số trang */}
                                    <div className="flex items-center gap-1">
                                        {renderPageNumbers().map(
                                            (pageNum, index) =>
                                                pageNum === "..." ? (
                                                    <span
                                                        key={`ellipsis-${index}`}
                                                        className="px-2 text-gray-400"
                                                    >
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                pageNum
                                                            )
                                                        }
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            currentPage ===
                                                            pageNum
                                                                ? "bg-green-500 text-white"
                                                                : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                        )}
                                    </div>

                                    {/* Nút Next */}
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg ${
                                            currentPage === totalPages
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="text-sm text-gray-500 mt-3 md:mt-0">
                                    Trang {currentPage} / {totalPages}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Product Detail Modal */}
            {showDetailModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Chi tiết sản phẩm
                                </h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image */}
                                <div className="rounded-xl overflow-hidden">
                                    <img
                                        src={
                                            selectedProduct.images[0]?.image ||
                                            "https://placehold.co/600x400"
                                        }
                                        alt={selectedProduct.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Tên sản phẩm
                                        </label>
                                        <p className="font-medium text-lg">
                                            {selectedProduct.name}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Danh mục
                                            </label>
                                            <p className="font-medium">
                                                {selectedProduct.category}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Trạng thái
                                            </label>
                                            <p
                                                className={`font-medium ${
                                                    selectedProduct.status ===
                                                    "active"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {selectedProduct.status ===
                                                "active"
                                                    ? "Đang hiển thị"
                                                    : "Đã ẩn"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Địa điểm
                                        </label>
                                        <p className="font-medium flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {selectedProduct.location}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Người đăng
                                        </label>
                                        <p className="font-medium flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {selectedProduct.user?.name ||
                                                "Không có thông tin"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Lượt xem
                                            </label>
                                            <p className="font-medium">
                                                {selectedProduct.views}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Yêu cầu nhận
                                            </label>
                                            <p className="font-medium">
                                                {selectedProduct.requests}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Ngày đăng
                                        </label>
                                        <p className="font-medium">
                                            {formatDate(
                                                selectedProduct.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="text-center">
                            <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Xác nhận xóa
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có chắc chắn muốn xóa sản phẩm
                                <span className="font-semibold">
                                    {" "}
                                    "{productToDelete.name}"
                                </span>
                                ?
                                <br />
                                Hành động này không thể hoàn tác.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
