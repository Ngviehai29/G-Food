import React, { useState, useEffect, useRef } from "react";
import iconsearch from "../G-Food-Images/icon_search.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ scrolled, onSearchSelect }) => {
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // THÊM: Lưu tất cả sản phẩm
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAllOnOpen, setShowAllOnOpen] = useState(false); // THÊM: Flag hiển thị tất cả
    const searchRef = useRef(null);
    const debounceTimer = useRef(null);

    const API_URL = "https://be-g-food.onrender.com/api/postnewshare";

    // Hàm lấy TẤT CẢ sản phẩm
    const fetchAllProducts = async () => {
        try {
            console.log("📦 Đang lấy tất cả sản phẩm...");

            const response = await axios.get(API_URL, {
                timeout: 10000,
            });

            console.log("✅ Tất cả sản phẩm:", response.data);
            return response.data;
        } catch (err) {
            console.error("❌ Lỗi khi lấy tất cả sản phẩm:", err);
            throw err;
        }
    };

    // Hàm gọi API search (giữ nguyên)
    const searchPostsAPI = async (query) => {
        try {
            const response = await axios.get(API_URL, {
                params: { search: query },
                timeout: 10000,
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    // Khi mở search box, lấy tất cả sản phẩm
    const handleOpenSearch = async () => {
        setSearchOpen(true);
        setShowAllOnOpen(true); // Đánh dấu hiển thị tất cả
        setLoading(true);

        try {
            const result = await fetchAllProducts();

            // Xử lý kết quả
            let posts = [];
            if (result && Array.isArray(result.data)) {
                posts = result.data;
            } else if (Array.isArray(result)) {
                posts = result;
            }

            const formattedResults = posts.map((post) => ({
                id: post.id || post._id || Math.random(),
                name: post.name || post.title || "Không có tên",
                category:
                    post.Category?.name || post.category || "Không có danh mục",
                image:
                    post.Post_images?.[0]?.image ||
                    post.image ||
                    post.thumbnail ||
                    null,
                description: post.description || "",
                price: post.price || 0,
            }));

            setAllProducts(formattedResults); // Lưu tất cả sản phẩm
            setSearchResults(formattedResults); // Hiển thị tất cả
            setError(null);
        } catch (err) {
            console.error("Lỗi khi lấy tất cả sản phẩm:", err);
            setError("Không thể tải danh sách sản phẩm");
            setSearchResults([]);
        } finally {
            setLoading(false);
            setShowAllOnOpen(false);
        }
    };

    // Xử lý click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchOpen &&
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setSearchOpen(false);
                setSearchTerm("");
                setSearchResults([]);
                setError(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [searchOpen]);

    // Debounce tìm kiếm
    useEffect(() => {
        if (!searchOpen) return;

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (!searchTerm.trim()) {
            // Nếu ô tìm kiếm rỗng, hiển thị tất cả sản phẩm
            if (allProducts.length > 0) {
                setSearchResults(allProducts);
            } else {
                // Nếu chưa có allProducts, fetch lại
                handleOpenSearch();
            }
            setError(null);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await searchPostsAPI(searchTerm);

                let posts = [];
                if (result && Array.isArray(result.data)) {
                    posts = result.data;
                } else if (Array.isArray(result)) {
                    posts = result;
                }

                const formattedResults = posts.map((post) => ({
                    id: post.id || post._id || Math.random(),
                    name: post.name || post.title || "Không có tên",
                    category:
                        post.Category?.name ||
                        post.category ||
                        "Không có danh mục",
                    image:
                        post.Post_images?.[0]?.image ||
                        post.image ||
                        post.thumbnail ||
                        null,
                    description: post.description || "",
                    price: post.price || 0,
                }));

                setSearchResults(formattedResults);

                if (formattedResults.length === 0) {
                    setError(`Không tìm thấy với từ khóa "${searchTerm}"`);
                }
            } catch (err) {
                console.error("Search failed:", err);

                if (err.code === "ECONNABORTED") {
                    setError(
                        "⏰ Timeout: Server mất quá nhiều thời gian để phản hồi"
                    );
                } else if (err.response) {
                    if (err.response.status === 404) {
                        setError("🔍 Endpoint API không tồn tại");
                    } else if (err.response.status === 500) {
                        setError("⚡ Lỗi server, vui lòng thử lại sau");
                    }
                } else if (err.request) {
                    setError("🌐 Không thể kết nối đến server");
                } else {
                    setError(`Lỗi: ${err.message}`);
                }
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, 600);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchTerm, searchOpen]);

    // Xử lý khi chọn bài viết
    const handleSelectPost = (post) => {
        console.log("✅ Đã chọn bài viết:", post);
        setSearchOpen(false);
        setSearchTerm("");
        setSearchResults([]);
        setError(null);

        if (onSearchSelect) {
            onSearchSelect(post);
        } else {
            console.warn("⚠️ Không có onSearchSelect handler");
            if (post.id) {
                navigate(`/post/${post.id}`);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            const performSearch = async () => {
                setLoading(true);
                try {
                    const result = await searchPostsAPI(searchTerm);
                    let posts = [];
                    if (result && Array.isArray(result.data))
                        posts = result.data;
                    else if (Array.isArray(result)) posts = result;

                    const formattedResults = posts.map((post) => ({
                        id: post.id || post._id,
                        name: post.name || "Không có tên",
                        category: post.Category?.name || "Không có danh mục",
                        image: post.Post_images?.[0]?.image || null,
                    }));

                    setSearchResults(formattedResults);

                    if (formattedResults.length === 0) {
                        setError(`Không tìm thấy với từ khóa "${searchTerm}"`);
                    }
                } catch (err) {
                    setError(`Lỗi khi tìm kiếm: ${err.message}`);
                } finally {
                    setLoading(false);
                }
            };
            performSearch();
        }
    };

    return (
        <div className="relative">
            {searchOpen ? (
                <div className="relative" ref={searchRef}>
                    <div className="search-box flex items-center bg-white rounded-full shadow-lg px-3 py-2 min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết, sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full bg-transparent border-none outline-none text-sm text-gray-800 px-2"
                            autoFocus
                        />

                        <button
                            onClick={() => {
                                if (searchTerm.trim()) {
                                    // Nếu có từ khóa, thực hiện tìm kiếm
                                    if (debounceTimer.current) {
                                        clearTimeout(debounceTimer.current);
                                    }
                                    const performSearch = async () => {
                                        setLoading(true);
                                        try {
                                            const result = await searchPostsAPI(
                                                searchTerm
                                            );
                                            let posts = [];
                                            if (
                                                result &&
                                                Array.isArray(result.data)
                                            )
                                                posts = result.data;
                                            else if (Array.isArray(result))
                                                posts = result;

                                            const formattedResults = posts.map(
                                                (post) => ({
                                                    id: post.id || post._id,
                                                    name:
                                                        post.name ||
                                                        "Không có tên",
                                                    category:
                                                        post.Category?.name ||
                                                        "Không có danh mục",
                                                    image:
                                                        post.Post_images?.[0]
                                                            ?.image || null,
                                                })
                                            );

                                            setSearchResults(formattedResults);
                                        } catch (err) {
                                            setError(`Lỗi: ${err.message}`);
                                        } finally {
                                            setLoading(false);
                                        }
                                    };
                                    performSearch();
                                } else {
                                    // Nếu không có từ khóa, hiển thị tất cả
                                    if (allProducts.length > 0) {
                                        setSearchResults(allProducts);
                                    } else {
                                        handleOpenSearch();
                                    }
                                }
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="size-4 border-2 border-gray-300 border-t-main rounded-full animate-spin"></div>
                            ) : (
                                <img
                                    className="size-4"
                                    src={iconsearch}
                                    alt="Search"
                                />
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setSearchOpen(false);
                                setSearchTerm("");
                                setSearchResults([]);
                                setError(null);
                            }}
                            className="ml-1 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Hiển thị kết quả */}
                    {loading && showAllOnOpen ? (
                        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                            <div className="text-center">
                                <div className="inline-block size-6 border-2 border-gray-300 border-t-main rounded-full animate-spin"></div>
                                <p className="text-gray-500 mt-2">
                                    Đang tải danh sách sản phẩm...
                                </p>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                            <div className="text-center">
                                <div className="inline-block size-6 border-2 border-gray-300 border-t-main rounded-full animate-spin"></div>
                                <p className="text-gray-500 mt-2">
                                    Đang tìm kiếm...
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {!loading && searchResults.length > 0 && (
                        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto z-50">
                            {/* Header hiển thị số lượng */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">
                                        {searchTerm.trim()
                                            ? `Kết quả tìm kiếm (${searchResults.length})`
                                            : `Tất cả sản phẩm (${searchResults.length})`}
                                    </span>
                                    {/* {!searchTerm.trim() && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            Nhập từ khóa để lọc
                                        </span>
                                    )} */}
                                </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            {searchResults.map((post, index) => (
                                <div
                                    key={post.id || index}
                                    onClick={() => handleSelectPost(post)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3"
                                >
                                    {post.image && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={post.image}
                                                alt={post.name}
                                                className="w-10 h-10 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/40x40/97b545/ffffff?text=G";
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-800 truncate">
                                            {post.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                                            <span className="bg-main/10 text-main px-2 py-1 rounded">
                                                {post.category}
                                            </span>
                                            {post.price > 0 && (
                                                <span className="font-semibold text-main">
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    ).format(post.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && !loading && (
                        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                            <div className="text-center">
                                <div className="text-red-500 mb-2">{error}</div>
                                <button
                                    onClick={handleOpenSearch}
                                    className="text-sm text-blue-500 hover:text-blue-700 underline"
                                >
                                    Hiển thị tất cả sản phẩm
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading &&
                        searchTerm.trim() !== "" &&
                        searchResults.length === 0 &&
                        !error && (
                            <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                                <div className="text-gray-500 text-center">
                                    Không tìm thấy kết quả cho "{searchTerm}"
                                    <button
                                        onClick={handleOpenSearch}
                                        className="block mt-2 text-sm text-blue-500 hover:text-blue-700 underline mx-auto"
                                    >
                                        Xem tất cả sản phẩm
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            ) : (
                <div
                    className="Icon_search cursor-pointer"
                    onClick={handleOpenSearch} // THAY ĐỔI: Gọi hàm mới
                >
                    <img
                        className={`size-5 transition-all duration-[0.5s] ${
                            scrolled ? "" : "grayscale invert"
                        }`}
                        src={iconsearch}
                        alt="Search"
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
