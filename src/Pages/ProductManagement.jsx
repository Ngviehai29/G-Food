import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Eye,
    Package,
    MapPin,
    User,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Lock,
    LockOpen,
    Image as ImageIcon,
    CheckCircle2,
} from "lucide-react";

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
    const [categories, setCategories] = useState([]);
    const [statsData, setStatsData] = useState({});

    const [apiStats, setApiStats] = useState({
        total: 0,
        active: 0,
        locked: 0,
        categories: 0,
    });

    // State cho modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [productToLock, setProductToLock] = useState(null);
    const [actionType, setActionType] = useState("");
    const [productDetail, setProductDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // State để lưu danh sách sản phẩm bị khóa (đồng bộ với server)
    const [lockedProducts, setLockedProducts] = useState(() => {
        try {
            const saved = localStorage.getItem("lockedProducts");
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error("Error loading lockedProducts:", error);
            return {};
        }
    });

    // Lưu vào localStorage làm cache
    useEffect(() => {
        try {
            localStorage.setItem(
                "lockedProducts",
                JSON.stringify(lockedProducts)
            );
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [lockedProducts]);

    // Fetch products và thống kê từ API
    useEffect(() => {
        fetchProductsAndStats();
    }, []);

    const fetchProductsAndStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            // Gọi 3 API cùng lúc
            const [productsResponse, categoriesResponse, statsResponse] =
                await Promise.all([
                    fetch(`${API_URL}/postnewshare/admin`, {
                        signal: controller.signal,
                    }),
                    fetch(`${API_URL}/categories`, {
                        signal: controller.signal,
                    }),
                    fetch(`${API_URL}/index/count-post`, {
                        signal: controller.signal,
                    }),
                ]);

            clearTimeout(timeoutId);

            if (!productsResponse.ok) {
                throw new Error(
                    `Lỗi API sản phẩm: ${productsResponse.status} ${productsResponse.statusText}`
                );
            }

            // Xử lý dữ liệu sản phẩm
            const productsData = await productsResponse.json();

            // DEBUG: Kiểm tra cấu trúc dữ liệu API
            console.log("=== DEBUG API RESPONSE ===");
            console.log("API URL:", `${API_URL}/postnewshare/admin`);
            console.log("Total items in API:", productsData.data?.length || 0);

            if (productsData.data && productsData.data.length > 0) {
                // Kiểm tra tất cả các field có thể có
                const sampleItem = productsData.data[0];
                console.log("Sample item keys:", Object.keys(sampleItem));
                console.log("Sample item full:", sampleItem);

                // Tìm tất cả các field có thể chứa thông tin locked
                const possibleLockFields = [];
                Object.keys(sampleItem).forEach((key) => {
                    if (key.toLowerCase().includes("lock")) {
                        possibleLockFields.push(key);
                    }
                });
                console.log("Possible lock fields:", possibleLockFields);

                // Kiểm tra các item có status "locked"
                const itemsWithLockedStatus = productsData.data.filter(
                    (item) =>
                        item.status === "locked" ||
                        item.status === "lock" ||
                        (item.status &&
                            item.status.toLowerCase().includes("lock"))
                );
                console.log(
                    "Items with 'locked' status:",
                    itemsWithLockedStatus.length,
                    itemsWithLockedStatus
                );

                // Kiểm tra các item có field locked/isLocked
                const itemsWithLockField = productsData.data.filter(
                    (item) =>
                        item.locked === true ||
                        item.isLocked === true ||
                        item.is_lock === true ||
                        item.lock_status === true ||
                        item.lock_status === "locked"
                );
                console.log(
                    "Items with lock field true:",
                    itemsWithLockField.length
                );
            }

            if (productsData.success && Array.isArray(productsData.data)) {
                const formattedProducts = productsData.data.map((item) => {
                    const categoryName =
                        item.Category?.name ||
                        item.category?.name ||
                        item.category ||
                        "Không phân loại";

                    // DEBUG từng item để tìm trạng thái locked
                    let isLocked = false;
                    let lockSource = "none";

                    // Kiểm tra tất cả các trường có thể chứa trạng thái locked
                    if (item.status === "locked" || item.status === "lock") {
                        isLocked = true;
                        lockSource = "api-status";
                        console.log(
                            `Item ${item.id} locked via status: ${item.status}`
                        );
                    } else if (
                        item.locked === true ||
                        item.locked === 1 ||
                        item.locked === "true"
                    ) {
                        isLocked = true;
                        lockSource = "api-locked";
                        console.log(
                            `Item ${item.id} locked via locked field: ${item.locked}`
                        );
                    } else if (
                        item.isLocked === true ||
                        item.isLocked === 1 ||
                        item.isLocked === "true"
                    ) {
                        isLocked = true;
                        lockSource = "api-isLocked";
                        console.log(
                            `Item ${item.id} locked via isLocked field: ${item.isLocked}`
                        );
                    } else if (
                        item.is_lock === true ||
                        item.is_lock === 1 ||
                        item.is_lock === "true"
                    ) {
                        isLocked = true;
                        lockSource = "api-is_lock";
                        console.log(
                            `Item ${item.id} locked via is_lock field: ${item.is_lock}`
                        );
                    } else if (
                        item.lock_status === true ||
                        item.lock_status === 1 ||
                        item.lock_status === "locked"
                    ) {
                        isLocked = true;
                        lockSource = "api-lock_status";
                        console.log(
                            `Item ${item.id} locked via lock_status field: ${item.lock_status}`
                        );
                    }
                    // Kiểm tra cache localStorage
                    else if (lockedProducts[item.id] === true) {
                        isLocked = true;
                        lockSource = "cache";
                        console.log(`Item ${item.id} locked via cache`);
                    }

                    // Kiểm tra trạng thái received
                    const isReceived = item.status === "received";

                    // Xác định status hiển thị
                    let status = item.status || "active";
                    if (isLocked) {
                        status = "locked";
                    } else if (isReceived) {
                        status = "received";
                    }

                    return {
                        id: item.id,
                        name: item.name || "Không có tên",
                        content: item.content || "",
                        status: status,
                        category: categoryName,
                        location:
                            item.User?.location ||
                            item.location ||
                            "Chưa có địa điểm",
                        user: item.User || { name: "Người dùng" },
                        createdAt:
                            item.createat ||
                            item.createdAt ||
                            new Date().toISOString(),
                        originalData: item,
                        isLocked: isLocked,
                        isReceived: isReceived,
                        lockSource: lockSource,
                        // Debug data
                        debug: {
                            apiStatus: item.status,
                            apiLocked: item.locked,
                            apiIsLocked: item.isLocked,
                            apiIs_lock: item.is_lock,
                            apiLock_status: item.lock_status,
                            cacheLocked: lockedProducts[item.id],
                        },
                    };
                });

                // Đếm số lượng locked sau khi xử lý
                const lockedCount = formattedProducts.filter(
                    (p) => p.isLocked
                ).length;
                console.log(`Final locked count: ${lockedCount}`);
                console.log(
                    "Locked items:",
                    formattedProducts
                        .filter((p) => p.isLocked)
                        .map((p) => ({
                            id: p.id,
                            name: p.name,
                            source: p.lockSource,
                        }))
                );

                setProducts(formattedProducts);
                setFilteredProducts(formattedProducts);
                setCurrentPage(1);
            } else {
                throw new Error("Dữ liệu sản phẩm không đúng định dạng");
            }

            // Xử lý dữ liệu danh mục
            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                if (
                    categoriesData.success &&
                    Array.isArray(categoriesData.data)
                ) {
                    const categoryNames = categoriesData.data
                        .map((cat) => cat.name || cat.title || "Không tên")
                        .filter((name) => name !== "Không tên");
                    setCategories(categoryNames);
                }
            }

            // Xử lý dữ liệu thống kê tổng từ index/count-post
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                console.log("Global Stats API Response:", statsData);
                if (statsData.success && statsData.data) {
                    setStatsData(statsData.data);
                    // Lưu riêng thống kê từ API
                    setApiStats({
                        total: statsData.data.SumPostShare || 0,
                        active: statsData.data.SumPostActive || 0,
                        locked: statsData.data.SumPostLock || 0,
                        categories: statsData.data.SumCategory || 0,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.name === "AbortError") {
                setError("Yêu cầu quá thời gian. Vui lòng thử lại.");
            } else {
                setError(`Lỗi tải dải dữ liệu: ${error.message}`);
            }
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch chi tiết sản phẩm từ API
    const fetchProductDetail = async (productId) => {
        try {
            setLoadingDetail(true);
            setError(null);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(
                `${API_URL}/postnewshare/admin-detail/${productId}`,
                { signal: controller.signal }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(
                    `Lỗi API: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();
            console.log("Product Detail API Response:", result);

            if (result.success && result.data) {
                return result.data;
            } else {
                throw new Error(
                    result.message || "Không lấy được chi tiết sản phẩm"
                );
            }
        } catch (error) {
            console.error("Error fetching product detail:", error);
            throw error;
        } finally {
            setLoadingDetail(false);
        }
    };

    // Filter và search
    useEffect(() => {
        let result = products;

        if (searchTerm) {
            result = result.filter(
                (product) =>
                    product.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.category
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.content
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(
                (product) => product.category === selectedCategory
            );
        }

        if (selectedStatus !== "all") {
            if (selectedStatus === "locked") {
                result = result.filter((product) => product.isLocked === true);
            } else if (selectedStatus === "active") {
                result = result.filter(
                    (product) =>
                        !product.isLocked && product.status !== "received"
                );
            } else if (selectedStatus === "received") {
                result = result.filter(
                    (product) => product.status === "received"
                );
            }
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedStatus, products]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Xử lý hiển thị chi tiết sản phẩm
    const handleViewDetails = async (product) => {
        try {
            setSelectedProduct(product);
            setLoadingDetail(true);
            setShowDetailModal(true);
            const detail = await fetchProductDetail(product.id);
            setProductDetail(detail);
        } catch (error) {
            console.error("Error loading product detail:", error);
            setProductDetail(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Hàm refresh thống kê từ API
    const fetchGlobalStats = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${API_URL}/index/count-post`, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const statsData = await response.json();
                console.log("Refreshed Global Stats:", statsData);
                if (statsData.success && statsData.data) {
                    setApiStats({
                        total: statsData.data.SumPostShare || 0,
                        active: statsData.data.SumPostActive || 0,
                        locked: statsData.data.SumPostLock || 0,
                        categories: statsData.data.SumCategory || 0,
                    });
                }
            }
        } catch (error) {
            console.error("Error refreshing stats:", error);
        }
    };

    // CHỈ SỬ DỤNG 1 HÀM DUY NHẤT CHO KHÓA/MỞ KHÓA
    const handleToggleLock = async (product) => {
        try {
            // GỌI API LOCK/UNLOCK THỰC TẾ - SỬ DỤNG CÙNG 1 ENDPOINT
            const lockUrl = `${API_URL}/postnewshare/lock/${product.id}`;
            console.log(`Calling toggle lock API:`, lockUrl);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(lockUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            const result = await response.json();
            console.log("Lock/Unlock API Response:", result);

            if (response.ok && result.success) {
                // Toggle trạng thái khóa
                const updatedLockedProducts = { ...lockedProducts };

                if (product.isLocked) {
                    // Nếu đang bị khóa -> mở khóa
                    delete updatedLockedProducts[product.id];
                } else {
                    // Nếu đang mở khóa -> khóa
                    updatedLockedProducts[product.id] = true;
                }

                setLockedProducts(updatedLockedProducts);

                // Cập nhật state products
                const newLockStatus = !product.isLocked;
                const newStatus = newLockStatus ? "locked" : "active";

                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === product.id
                            ? {
                                  ...p,
                                  isLocked: newLockStatus,
                                  status: newStatus,
                                  lockSource: newLockStatus ? "cache" : "none",
                              }
                            : p
                    )
                );

                setFilteredProducts((prev) =>
                    prev.map((p) =>
                        p.id === product.id
                            ? {
                                  ...p,
                                  isLocked: newLockStatus,
                                  status: newStatus,
                                  lockSource: newLockStatus ? "cache" : "none",
                              }
                            : p
                    )
                );

                alert(
                    newLockStatus
                        ? "✅ Đã khóa sản phẩm thành công!"
                        : "✅ Đã mở khóa sản phẩm thành công!"
                );

                // Refresh thống kê từ API sau khi lock/unlock
                fetchGlobalStats();
            } else {
                throw new Error(result.message || "Thao tác thất bại");
            }
        } catch (error) {
            console.error("Toggle lock error:", error);
            if (error.name === "AbortError") {
                alert("Yêu cầu quá thời gian. Vui lòng thử lại.");
            } else {
                alert(`❌ Lỗi khi thực hiện thao tác: ${error.message}`);
            }
        }
    };

    // Reset tất cả trạng thái khóa (CHỈ RESET CLIENT, KHÔNG GỌI API)
    const resetAllLocks = () => {
        const confirmReset = window.confirm(
            "⚠️ CẢNH BÁO: Thao tác này chỉ reset trạng thái trên trình duyệt của bạn.\n\n" +
                "Để mở khóa thực sự trên server, bạn cần mở khóa từng sản phẩm hoặc liên hệ backend.\n\n" +
                "Tiếp tục reset trạng thái khóa trên trình duyệt?"
        );

        if (confirmReset) {
            setLockedProducts({});
            setProducts((prev) =>
                prev.map((p) => ({
                    ...p,
                    isLocked: false,
                    status: p.isReceived ? "received" : "active",
                    lockSource: "none",
                }))
            );
            setFilteredProducts((prev) =>
                prev.map((p) => ({
                    ...p,
                    isLocked: false,
                    status: p.isReceived ? "received" : "active",
                    lockSource: "none",
                }))
            );

            // Refresh thống kê (vì đã reset client-side)
            fetchGlobalStats();

            alert("✅ Đã reset trạng thái khóa trên trình duyệt!");
        }
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Không có ngày";
            return date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return "Không có ngày";
        }
    };

    // Format datetime
    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Không có ngày giờ";
            return date.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "Không có ngày giờ";
        }
    };

    // Thống kê
    const stats = {
        total: apiStats.total || products.length,
        active:
            apiStats.active ||
            products.filter((p) => !p.isLocked && p.status !== "received")
                .length,
        locked:
            apiStats.locked ||
            products.filter((p) => p.isLocked === true).length,
        received: products.filter((p) => p.status === "received").length,
        categories: apiStats.categories || categories.length || 0,
    };

    // Tính toán số sản phẩm locked hiển thị thực tế
    const actualLockedCount = products.filter(
        (p) => p.isLocked === true
    ).length;

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

    // Render loading skeleton
    const renderSkeleton = () => (
        <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );

    // Hàm hiển thị trạng thái
    const renderStatus = (product) => {
        if (product.isLocked) {
            return (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Đã khóa
                </span>
            );
        } else if (product.status === "received") {
            return (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Đã nhận
                </span>
            );
        } else {
            return (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đang hoạt động
                </span>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-1 md:p-4 shadow-xl rounded-[10px]">
            {/* Header */}
            <div className="mb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            Quản lý sản phẩm
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và theo dõi tất cả sản phẩm được đăng trên
                            hệ thống
                            <br />
                        </p>
                    </div>
                </div>
            </div>

            {/* Thống kê - Cập nhật với 5 ô */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Tổng sản phẩm
                            </p>
                            <p className="text-lg font-bold text-gray-800">
                                {apiStats.total}
                            </p>
                        </div>
                        <Package className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Đang hoạt động
                            </p>
                            <p className="text-lg font-bold text-green-600">
                                {apiStats.active}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500 bg-green-50 p-1.5 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Đã khóa
                            </p>
                            <p className="text-lg font-bold text-orange-600">
                                {apiStats.locked}
                            </p>
                        </div>
                        <Lock className="w-8 h-8 text-orange-500 bg-orange-50 p-1.5 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Đã nhận
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                                {stats.received}
                            </p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                    </div>
                </div>

                <div className="bg-white rounded-lg p-3 shadow border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                Danh mục
                            </p>
                            <p className="text-lg font-bold text-purple-600">
                                {apiStats.categories}
                            </p>
                        </div>
                        <Filter className="w-8 h-8 text-purple-500 bg-purple-50 p-1.5 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100 mb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="locked">Đã khóa</option>
                            <option value="received">Đã nhận</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden mb-6">
                {loading ? (
                    <div className="p-8">{renderSkeleton()}</div>
                ) : error ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchProductsAndStats}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            ↻ Thử lại
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Không tìm thấy sản phẩm nào
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {searchTerm ||
                            selectedCategory !== "all" ||
                            selectedStatus !== "all"
                                ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                                : "Chưa có sản phẩm nào trong hệ thống"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                            Sản phẩm
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                            Danh mục
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                            Địa điểm
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                            Ngày đăng
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                            Trạng thái
                                        </th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
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
                                            <td className="py-3 px-4">
                                                <div className="min-w-[100px]">
                                                    <p className="font-medium text-gray-800 text-sm mb-1 truncate">
                                                        {product.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                                                    <Package className="w-3 h-3" />
                                                    <span className="truncate max-w-[100px]">
                                                        {product.category}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600 truncate max-w-[120px]">
                                                        {product.location}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm text-gray-600 whitespace-nowrap">
                                                        {formatDate(
                                                            product.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-1 min-w-[100px]">
                                                    {renderStatus(product)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                product
                                                            )
                                                        }
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {/* CHỈ CÒN 1 NÚT DUY NHẤT CHO KHÓA/MỞ KHÓA */}
                                                    {/* Hiển thị cho sản phẩm không ở trạng thái "received" */}
                                                    {product.status !==
                                                        "received" && (
                                                        <button
                                                            onClick={() =>
                                                                handleToggleLock(
                                                                    product
                                                                )
                                                            }
                                                            className={`p-1.5 rounded transition ${
                                                                product.isLocked
                                                                    ? "text-green-600 hover:bg-green-50"
                                                                    : "text-orange-600 hover:bg-orange-50"
                                                            }`}
                                                            title={
                                                                product.isLocked
                                                                    ? "Mở khóa sản phẩm"
                                                                    : "Khóa sản phẩm"
                                                            }
                                                        >
                                                            {product.isLocked ? (
                                                                <LockOpen className="w-4 h-4" />
                                                            ) : (
                                                                <Lock className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t flex flex-col md:flex-row md:items-center justify-between">
                                <div className="text-xs text-gray-500 mb-2 md:mb-0">
                                    Hiển thị {startIndex + 1}-
                                    {Math.min(
                                        endIndex,
                                        filteredProducts.length
                                    )}{" "}
                                    trên {filteredProducts.length} sản phẩm
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className={`p-1.5 rounded ${
                                            currentPage === 1
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-0.5">
                                        {renderPageNumbers().map(
                                            (pageNum, index) =>
                                                pageNum === "..." ? (
                                                    <span
                                                        key={`ellipsis-${index}`}
                                                        className="px-1.5 text-gray-400"
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
                                                        className={`w-7 h-7 rounded text-sm flex items-center justify-center ${
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

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`p-1.5 rounded ${
                                            currentPage === totalPages
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-xs text-gray-500 mt-2 md:mt-0">
                                    Trang {currentPage} / {totalPages}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ========== MODAL CHI TIẾT SẢN PHẨM ========== */}
            {showDetailModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Chi tiết sản phẩm
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        setProductDetail(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {loadingDetail ? (
                                <div className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-3"></div>
                                    <p className="text-gray-600">
                                        Đang tải chi tiết sản phẩm...
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Thông tin cơ bản */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                        {/* Hình ảnh */}
                                        <div className="space-y-4">
                                            <div className="rounded-xl overflow-hidden bg-gray-100">
                                                {productDetail?.Post_images?.[0]
                                                    ?.image ? (
                                                    <img
                                                        src={
                                                            productDetail
                                                                .Post_images[0]
                                                                .image
                                                        }
                                                        alt={
                                                            selectedProduct.name
                                                        }
                                                        className="w-full h-64 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-64 flex flex-col items-center justify-center">
                                                        <ImageIcon className="w-16 h-16 text-gray-300 mb-2" />
                                                        <p className="text-gray-400">
                                                            Không có hình ảnh
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Thông tin chi tiết */}
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
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Package className="w-4 h-4 text-blue-500" />
                                                        <p className="font-medium">
                                                            {
                                                                selectedProduct.category
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm text-gray-500">
                                                        Trạng thái
                                                    </label>
                                                    <div className="mt-1">
                                                        {renderStatus(
                                                            selectedProduct
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-gray-500">
                                                        Địa chỉ người đăng
                                                    </label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <p className="font-medium">
                                                            {productDetail?.User
                                                                ?.location ||
                                                                selectedProduct.location}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm text-gray-500">
                                                        Người đăng
                                                    </label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <p className="font-medium">
                                                            {productDetail?.User
                                                                ?.username ||
                                                                productDetail
                                                                    ?.User
                                                                    ?.name ||
                                                                selectedProduct
                                                                    .user
                                                                    ?.name ||
                                                                "Không có thông tin"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-gray-500">
                                                        Ngày đăng
                                                    </label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <p className="font-medium">
                                                            {formatDateTime(
                                                                productDetail?.createat ||
                                                                    selectedProduct.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nội dung chi tiết */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mô tả chi tiết
                                        </label>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-line">
                                                {productDetail?.content ||
                                                    selectedProduct.content ||
                                                    "Không có mô tả"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Thông tin bổ sung */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                Thông tin danh mục
                                            </h4>
                                            <p className="text-blue-700">
                                                {selectedProduct.category}
                                            </p>
                                        </div>

                                        <div
                                            className={`rounded-lg p-4 ${
                                                selectedProduct.isLocked
                                                    ? "bg-orange-50"
                                                    : selectedProduct.status ===
                                                      "received"
                                                    ? "bg-blue-50"
                                                    : "bg-green-50"
                                            }`}
                                        >
                                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                                {selectedProduct.isLocked ? (
                                                    <>
                                                        <Lock className="w-4 h-4 text-orange-600" />
                                                        <span className="text-orange-800">
                                                            Trạng thái khóa
                                                        </span>
                                                    </>
                                                ) : selectedProduct.status ===
                                                  "received" ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                        <span className="text-blue-800">
                                                            Trạng thái đã nhận
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        <span className="text-green-800">
                                                            Trạng thái hoạt động
                                                        </span>
                                                    </>
                                                )}
                                            </h4>
                                            <p
                                                className={
                                                    selectedProduct.isLocked
                                                        ? "text-orange-700"
                                                        : selectedProduct.status ===
                                                          "received"
                                                        ? "text-blue-700"
                                                        : "text-green-700"
                                                }
                                            >
                                                {selectedProduct.isLocked
                                                    ? "Sản phẩm đang bị khóa, không hiển thị công khai"
                                                    : selectedProduct.status ===
                                                      "received"
                                                    ? "Sản phẩm đã được nhận"
                                                    : "Sản phẩm đang hoạt động bình thường"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t flex justify-end gap-3">
                                        {/* Chỉ hiển thị nút khóa/mở khóa cho sản phẩm không ở trạng thái "received" */}
                                        {selectedProduct.status !==
                                            "received" && (
                                            <button
                                                onClick={() => {
                                                    handleToggleLock(
                                                        selectedProduct
                                                    );
                                                    setShowDetailModal(false);
                                                    setProductDetail(null);
                                                }}
                                                className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition ${
                                                    selectedProduct.isLocked
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : "bg-orange-500 hover:bg-orange-600"
                                                }`}
                                            >
                                                {selectedProduct.isLocked ? (
                                                    <>
                                                        <LockOpen className="w-4 h-4 inline mr-2" />
                                                        Mở khóa
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-4 h-4 inline mr-2" />
                                                        Khóa sản phẩm
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                setProductDetail(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
