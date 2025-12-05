// AddProductFixed.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../Services/authService";
import bgImage from "../G-Food-Images/AddProduct.jpg";

const API = process.env.REACT_APP_API_URL;

const AddProductFixed = () => {
    const navigate = useNavigate();
    const isMounted = useRef(true); // Sử dụng useRef thay vì useState

    // State cực kỳ đơn giản
    const [form, setForm] = useState({
        name: "",
        categoryid: "",
        content: "",
        image: null,
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // Thêm state cho lỗi

    const userId = getCurrentUserId();

    // Cleanup effect - chỉ set ref
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
                    if (data.data?.length > 0) {
                        setForm((prev) => ({
                            ...prev,
                            categoryid: data.data[0].id,
                        }));
                    }
                }
            } catch (error) {
                console.error("Load categories error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [userId]);

    // Xóa tất cả điều kiện mounted từ các hàm xử lý input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        // Validation với hiển thị lỗi
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

                // Điều hướng đơn giản
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
            {/* Lớp phủ mờ để làm nổi bật form */}
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
                                        value={form.categoryid}
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
                                        accept="image/*"
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
                                    {form.image && (
                                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                            <p className="text-sm font-medium">
                                                📄 {form.image.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Kích thước:{" "}
                                                {(
                                                    form.image.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
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
