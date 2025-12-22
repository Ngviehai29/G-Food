// AddProductFixed.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../Services/authService";
import bgImage from "../G-Food-Images/AddProduct.jpg"; // Đường dẫn tương đối

const API = process.env.REACT_APP_API_URL;

const AddProductFixed = () => {
    const navigate = useNavigate();

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

    const userId = getCurrentUserId();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File quá lớn (>5MB)");
            return;
        }

        setForm((prev) => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        // Validation
        if (!form.name || !form.categoryid || !form.content || !form.image) {
            alert("Vui lòng điền đầy đủ thông tin");
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
                // Navigate - sử dụng navigate thay vì window.location
                navigate("/");
            } else {
                alert(result.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Lỗi kết nối: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Sử dụng giao diện đẹp hơn với Tailwind và background hình ảnh
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

                    {/* {userId && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">
                                👤 Đang đăng nhập với ID:{" "}
                                <strong>{userId}</strong>
                            </p>
                        </div>
                    )} */}

                    {/* Categories Info */}
                    {/* {categories.length > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700 mb-2">
                                📋 Có <strong>{categories.length}</strong> loại
                                thực phẩm
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <span
                                        key={cat.id}
                                        className={`px-3 py-1 text-xs rounded-full ${
                                            cat.id === form.categoryid
                                                ? "bg-blue-100 text-blue-700 border border-blue-300"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )} */}

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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        disabled={submitting}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại Thực Phẩm *
                                    </label>
                                    <select
                                        name="categoryid"
                                        value={form.categoryid}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none"
                                        disabled={loading || submitting}
                                        required
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column - Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hình Ảnh Sản Phẩm *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={submitting}
                                        required
                                    />
                                    <label
                                        htmlFor="imageUpload"
                                        className={`inline-flex items-center justify-center px-6 py-3 rounded-lg shadow transition cursor-pointer ${
                                            submitting ? "opacity-50" : ""
                                        }`}
                                        style={{
                                            backgroundColor: submitting
                                                ? "#ccc"
                                                : "#97b545",
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
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-center gap-6 mt-10 pt-6 border-t">
                            <button
                                type="submit"
                                className={`px-10 py-3 text-white text-lg font-bold rounded-full shadow-xl transition flex items-center justify-center gap-2 ${
                                    submitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                style={{
                                    backgroundColor: submitting
                                        ? "#ccc"
                                        : "#97b545",
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
                                className="px-10 py-3 text-gray-700 text-lg font-bold rounded-full border border-gray-300 hover:bg-gray-50 transition"
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
