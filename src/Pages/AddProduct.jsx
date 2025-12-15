import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../Services/authService";
import bgImage from "../G-Food-Images/AddProduct.jpg";

const API = process.env.REACT_APP_API_URL;

const AddProductFixed = () => {
    const navigate = useNavigate();
    const isMounted = useRef(true);

    const [form, setForm] = useState({
        name: "",
        categoryid: "",
        content: "",
        image: null,
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const userId = getCurrentUserId();

    // Cleanup effect
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Redirect nếu chưa login
    useEffect(() => {
        if (!userId) {
            alert("Vui lòng đăng nhập!");
            navigate("/login");
        }
    }, [userId, navigate]);

    // Load categories
    useEffect(() => {
        if (!userId) return;

        const loadCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API}/categories`);
                const data = await response.json();

                if (data.success) {
                    setCategories(data.data || []);
                }
            } catch (error) {
                console.error("Load categories error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [userId]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File quá lớn (>5MB)");
            return;
        }

        setForm((prev) => ({ ...prev, image: file }));
        if (formErrors.image) {
            setFormErrors((prev) => ({ ...prev, image: "" }));
        }
    };

    // Hàm xóa ảnh đã chọn
    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
        const fileInput = document.getElementById("imageUpload");
        if (fileInput) fileInput.value = "";

        if (formErrors.image) {
            setFormErrors((prev) => ({ ...prev, image: "" }));
        }
    };

    // Validation form
    const validateForm = () => {
        const errors = {};

        if (!form.name.trim()) {
            errors.name = "Vui lòng nhập tên sản phẩm";
        }

        if (!form.categoryid) {
            errors.categoryid = "Vui lòng chọn loại thực phẩm";
        }

        if (!form.content.trim()) {
            errors.content = "Vui lòng nhập nội dung";
        }

        if (!form.image) {
            errors.image = "Vui lòng chọn hình ảnh";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        if (!validateForm()) {
            alert("Vui lòng điền đầy đủ thông tin được đánh dấu *");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("categoryid", form.categoryid);
            formData.append("content", form.content);
            formData.append("image", form.image);

            console.log("Đang gửi dữ liệu...");

            const response = await fetch(`${API}/postnewshare/${userId}`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            console.log("Kết quả:", result);

            if (result.success) {
                alert(result.message || "Thành công!");

                // Reset form
                setForm({
                    name: "",
                    categoryid: categories.length > 0 ? categories[0].id : "",
                    content: "",
                    image: null,
                });
                setFormErrors({});

                navigate("/");
            } else {
                alert(result.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Lỗi kết nối: " + error.message);
        } finally {
            if (isMounted.current) {
                setSubmitting(false);
            }
        }
    };

    return (
        <div
            className="min-h-screen py-8 px-4"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Lớp phủ mờ */}
            <div className="fixed inset-0 bg-black bg-opacity-40"></div>

            <div className="mt-20 max-w-3xl mx-auto relative z-10">
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-sm bg-opacity-95">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Đăng Bài Sản Phẩm Mới
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên Sản Phẩm *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: Rau cải, Chuối, Thịt bò..."
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
                                            formErrors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        disabled={submitting}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại Thực Phẩm *
                                    </label>
                                    <select
                                        name="categoryid"
                                        value={form.categoryid || ""}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none ${
                                            formErrors.categoryid
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        disabled={loading || submitting}
                                    >
                                        {loading ? (
                                            <option value="">
                                                ⏳ Đang tải danh mục...
                                            </option>
                                        ) : categories.length === 0 ? (
                                            <option value="">
                                                📭 Không có danh mục
                                            </option>
                                        ) : (
                                            <>
                                                <option value="" disabled>
                                                    👇 Chọn loại thực phẩm
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    {formErrors.categoryid && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formErrors.categoryid}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung chia sẻ *
                                    </label>
                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        placeholder="Mô tả chi tiết về sản phẩm, số lượng, chất lượng, cách liên hệ..."
                                        rows="5"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none ${
                                            formErrors.content
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        disabled={submitting}
                                    />
                                    {formErrors.content && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {formErrors.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Right Column - Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hình Ảnh Sản Phẩm *
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 bg-gray-50 ${
                                        formErrors.image
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        className="hidden"
                                        accept="image/*,.webp,.jpg,.jpeg,.png,.gif,.bmp"
                                        onChange={handleImageChange}
                                        disabled={submitting}
                                    />
                                    <label
                                        htmlFor="imageUpload"
                                        className={`inline-flex items-center justify-center px-6 py-3 rounded-lg shadow transition ${
                                            submitting
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer hover:opacity-90"
                                        }`}
                                        style={{
                                            backgroundColor: "#97b545",
                                            color: "white",
                                        }}
                                    >
                                        📁 Chọn Ảnh Sản Phẩm
                                    </label>

                                    {/* Hiển thị ảnh đã chọn với nút X */}
                                    {form.image && (
                                        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl max-w-full overflow-hidden relative border border-gray-100 shadow-sm">
                                            {/* Floating close button */}
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 w-8 h-8 bg-white text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg z-10 group"
                                                title="Xóa ảnh"
                                                disabled={submitting}
                                            >
                                                <svg
                                                    className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>

                                            {/* File info */}
                                            <div className="flex items-center gap-3 pr-10">
                                                <div className="flex-shrink-0">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center border border-green-200 shadow-sm">
                                                        <svg
                                                            className="w-7 h-7 text-green-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className="text-sm font-bold text-gray-800 truncate"
                                                        title={form.image.name}
                                                    >
                                                        {form.image.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                            {(
                                                                form.image
                                                                    .size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            •
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {form.image.type
                                                                .split("/")[1]
                                                                ?.toUpperCase() ||
                                                                "ẢNH"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Image preview with frame */}
                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-gray-500">
                                                        XEM TRƯỚC
                                                    </span>
                                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        ✓ ĐÃ CHỌN
                                                    </span>
                                                </div>
                                                <div className="relative w-full h-48 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 group">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            form.image
                                                        )}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <p className="mt-4 text-xs text-gray-500">
                                        {form.image
                                            ? "✅ Đã chọn ảnh"
                                            : "Chưa có ảnh nào được chọn"}
                                    </p>

                                    {formErrors.image && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {formErrors.image}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Submit Buttons */}
                        <div className="flex justify-center gap-6 mt-10 pt-6 border-t">
                            <button
                                type="submit"
                                className={`px-10 py-3 text-white text-lg font-bold rounded-full shadow-xl transition flex items-center justify-center gap-2 min-w-[120px] ${
                                    submitting || !userId
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:opacity-90"
                                }`}
                                style={{
                                    backgroundColor: "#97b545",
                                }}
                                disabled={submitting || !userId}
                            >
                                {submitting ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Đang đăng...
                                    </>
                                ) : (
                                    "Đăng Bài"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-10 py-3 text-gray-700 text-lg font-bold rounded-full border border-gray-300 hover:bg-gray-50 transition min-w-[120px]"
                                disabled={submitting}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductFixed;
