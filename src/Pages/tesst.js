// import React, { useMemo, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload, Loader2 } from "lucide-react";

// // Định nghĩa màu chủ đạo: #97b545
// const PRIMARY_COLOR = "#97b545";
// const HOVER_COLOR = "#7d9931";

// const AddProduct = () => {
//     const navigate = useNavigate();

//     const [product, setProduct] = useState({
//         name: "",
//         categoryid: "", // Lưu ID của category
//         content: "",
//         imageFile: null,
//         previewUrl:
//             "https://placehold.co/250x200/4c4c4c/ffffff?text=Ảnh+Sản+Phẩm",
//     });

//     // State để lưu danh sách categories từ API
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState(null);

//     // Lấy danh sách categories từ API khi component mount
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 setError(null);
//                 // API lấy danh sách loại sản phẩm (GET get category)
//                 const response = await fetch(
//                     "http://localhost:3000/api/categories",
//                     {
//                         method: "GET",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 // Kiểm tra cấu trúc dữ liệu trả về
//                 if (Array.isArray(data)) {
//                     setCategories(data);
//                 } else if (data.data && Array.isArray(data.data)) {
//                     setCategories(data.data);
//                 } else {
//                     console.warn("Unexpected API response structure:", data);
//                     setCategories([]);
//                 }
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCategories();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 alert("File ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.");
//                 return;
//             }

//             const url = URL.createObjectURL(file);
//             setProduct((prev) => ({
//                 ...prev,
//                 imageFile: file,
//                 previewUrl: url,
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validate dữ liệu
//         if (!product.name.trim()) {
//             alert("Vui lòng nhập Tên Sản Phẩm");
//             return;
//         }

//         if (!product.categoryid) {
//             alert("Vui lòng chọn Loại Thực Phẩm");
//             return;
//         }

//         if (!product.content.trim()) {
//             alert("Vui lòng nhập Nội dung");
//             return;
//         }

//         if (!product.imageFile) {
//             alert("Vui lòng chọn ảnh sản phẩm.");
//             return;
//         }

//         setSubmitting(true);

//         try {
//             // Tạo FormData để gửi multipart/form-data
//             const formData = new FormData();

//             // GỬI ĐÚNG TÊN BIẾN NHƯ API YÊU CẦU:
//             // name, categoryid, content, image
//             formData.append("name", product.name.trim());
//             formData.append("categoryid", product.categoryid); // Gửi ID của category
//             formData.append("content", product.content.trim());
//             formData.append("image", product.imageFile); // Đúng tên biến là "image"

//             // Nếu API cần thêm id_user (kiểm tra trong hình ảnh)
//             const user = JSON.parse(localStorage.getItem("user") || "{}");
//             if (user.id) {
//                 formData.append("id_user", user.id); // Hoặc "id_user" tùy API
//             }

//             console.log("Sending data to API...");
//             console.log("name:", product.name);
//             console.log("categoryid:", product.categoryid);
//             console.log("content:", product.content);
//             console.log("image:", product.imageFile.name);
//             if (user.id) console.log("id_user:", user.id);

//             // Gửi request đến API postnewshare (POST postnewshare)
//             const response = await fetch(
//                 "http://localhost:3000/api/postnewshare",
//                 {
//                     method: "POST",
//                     body: formData,
//                     // Không cần set Content-Type header khi dùng FormData
//                 }
//             );

//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.message || "Failed to post product");
//             }

//             console.log("Bài đăng đã được tạo:", result);
//             alert("Đã đăng bài chia sẻ thành công!");

//             // Reset form sau khi gửi thành công
//             setProduct({
//                 name: "",
//                 categoryid: "",
//                 content: "",
//                 imageFile: null,
//                 previewUrl:
//                     "https://placehold.co/250x200/4c4c4c/ffffff?text=Ảnh+Sản+Phẩm",
//             });

//             // Redirect về trang chủ hoặc trang danh sách sản phẩm
//             navigate("/");
//         } catch (error) {
//             console.error("Error posting product:", error);
//             alert(`Có lỗi xảy ra: ${error.message}`);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const InputField = useMemo(
//         () =>
//             ({ label, name, value, onChange, placeholder, type = "text" }) =>
//                 (
//                     <div className="mb-6">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             {label}
//                         </label>
//                         <input
//                             type={type}
//                             name={name}
//                             value={value}
//                             onChange={onChange}
//                             placeholder={placeholder}
//                             className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:outline-none transition duration-150"
//                             style={{
//                                 "--tw-ring-color": PRIMARY_COLOR,
//                                 "--tw-focus-ring-color": PRIMARY_COLOR,
//                             }}
//                         />
//                     </div>
//                 ),
//         []
//     );

//     // Hàm render option cho select
//     const renderCategoryOptions = () => {
//         if (loading) {
//             return <option value="">Đang tải danh sách...</option>;
//         }

//         if (error) {
//             return <option value="">Lỗi tải danh sách</option>;
//         }

//         if (categories.length === 0) {
//             return <option value="">Không có loại sản phẩm</option>;
//         }

//         return (
//             <>
//                 <option value="" disabled>
//                     Chọn loại sản phẩm
//                 </option>
//                 {categories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                         {category.name || category.categoryName || "Unnamed"}
//                     </option>
//                 ))}
//             </>
//         );
//     };

//     return (
//         <div
//             className="min-h-screen p-4 sm:p-8 font-sans"
//             style={{
//                 backgroundImage:
//                     "url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundAttachment: "fixed",
//                 backgroundRepeat: "no-repeat",
//             }}
//         >
//             {/* Overlay để làm mờ background */}
//             <div className="absolute inset-0 bg-black bg-opacity-40"></div>

//             {/* Content */}
//             <div className="pt-[80px] relative z-10">
//                 <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto w-full">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4 text-center">
//                         Đăng Bài Sản Phẩm Mới
//                     </h2>

//                     <form onSubmit={handleSubmit}>
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
//                             {/* Text Fields - Cột trái */}
//                             <div className="lg:col-span-1">
//                                 <InputField
//                                     label="Tên Sản Phẩm"
//                                     name="name"
//                                     value={product.name}
//                                     onChange={handleChange}
//                                     placeholder="Ví dụ: Rau cải"
//                                 />

//                                 {/* SELECT FIELD cho Category */}
//                                 <div className="mb-6">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Loại Thực Phẩm
//                                     </label>
//                                     <select
//                                         name="categoryid"
//                                         value={product.categoryid}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:outline-none appearance-none transition duration-150 cursor-pointer"
//                                         style={{
//                                             "--tw-ring-color": PRIMARY_COLOR,
//                                             "--tw-focus-ring-color":
//                                                 PRIMARY_COLOR,
//                                             minHeight: "48px",
//                                         }}
//                                         disabled={loading || submitting}
//                                     >
//                                         {renderCategoryOptions()}
//                                     </select>
//                                     {error && (
//                                         <p className="mt-2 text-sm text-red-500">
//                                             {error}
//                                         </p>
//                                     )}
//                                     <p className="mt-2 text-xs text-gray-500">
//                                         {product.categoryid &&
//                                             `Đã chọn: ${
//                                                 categories.find(
//                                                     (c) =>
//                                                         c.id ===
//                                                         product.categoryid
//                                                 )?.name || ""
//                                             }`}
//                                     </p>
//                                 </div>

//                                 {/* NỘI DUNG FIELD (content) */}
//                                 <div className="mb-6">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Nội dung chia sẻ
//                                     </label>
//                                     <textarea
//                                         name="content"
//                                         value={product.content}
//                                         onChange={handleChange}
//                                         placeholder="Ví dụ: Rau cải nhà trồng, tươi ngon, còn 2kg. Ai có nhu cầu thì liên hệ qua đây..."
//                                         rows="4"
//                                         className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:outline-none transition duration-150 resize-none"
//                                         style={{
//                                             "--tw-ring-color": PRIMARY_COLOR,
//                                             "--tw-focus-ring-color":
//                                                 PRIMARY_COLOR,
//                                         }}
//                                         disabled={submitting}
//                                     ></textarea>
//                                     <p className="mt-2 text-xs text-gray-500">
//                                         Ghi rõ số lượng, chất lượng và thông tin
//                                         liên hệ
//                                     </p>
//                                 </div>

//                                 {/* Thông tin tự động từ user */}
//                                 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                                     <h3 className="text-sm font-medium text-gray-700 mb-2">
//                                         Thông tin sẽ được tự động thêm:
//                                     </h3>
//                                     <ul className="text-sm text-gray-600 space-y-1">
//                                         <li>
//                                             • ID người dùng: Từ thông tin đăng
//                                             nhập
//                                         </li>
//                                         <li>• Ngày đăng: Tự động cập nhật</li>
//                                         <li>
//                                             • Thông tin liên hệ: Từ profile của
//                                             bạn
//                                         </li>
//                                     </ul>
//                                 </div>
//                             </div>

//                             {/* Image Upload - Cột phải */}
//                             <div className="lg:col-span-1">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Hình Ảnh Sản Phẩm
//                                     </label>
//                                     <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:border-green-300 transition duration-300">
//                                         <img
//                                             src={product.previewUrl}
//                                             alt="Product Preview"
//                                             className="w-full h-48 object-cover rounded-lg mb-6 shadow-md"
//                                         />
//                                         <input
//                                             type="file"
//                                             id="image-upload"
//                                             className="hidden"
//                                             accept="image/*"
//                                             onChange={handleImageChange}
//                                             disabled={submitting}
//                                         />
//                                         <label
//                                             htmlFor="image-upload"
//                                             className={`cursor-pointer px-8 py-3 text-white text-sm font-medium rounded-full transition duration-150 shadow-lg flex items-center gap-2 hover:shadow-xl ${
//                                                 submitting
//                                                     ? "opacity-50 cursor-not-allowed"
//                                                     : ""
//                                             }`}
//                                             style={{
//                                                 backgroundColor: PRIMARY_COLOR,
//                                             }}
//                                             onMouseOver={(e) =>
//                                                 !submitting &&
//                                                 (e.currentTarget.style.backgroundColor =
//                                                     HOVER_COLOR)
//                                             }
//                                             onMouseOut={(e) =>
//                                                 !submitting &&
//                                                 (e.currentTarget.style.backgroundColor =
//                                                     PRIMARY_COLOR)
//                                             }
//                                         >
//                                             <Upload className="w-5 h-5" />
//                                             {submitting
//                                                 ? "Đang xử lý..."
//                                                 : "Chọn Ảnh Sản Phẩm"}
//                                         </label>
//                                         <p className="mt-4 text-xs text-gray-500 text-center">
//                                             {product.imageFile
//                                                 ? `Đã chọn: ${product.imageFile.name}`
//                                                 : "Chưa có ảnh nào được chọn"}
//                                         </p>
//                                         <p className="mt-2 text-xs text-gray-400 text-center">
//                                             Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Submit Button với nút Hủy */}
//                         <div className="flex justify-center gap-6 mt-10 pt-6 border-t">
//                             <button
//                                 type="submit"
//                                 className="px-10 py-3 text-white text-lg font-bold rounded-full transition duration-150 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                 style={{
//                                     backgroundColor: submitting
//                                         ? "#ccc"
//                                         : PRIMARY_COLOR,
//                                     boxShadow: submitting
//                                         ? "none"
//                                         : `0 10px 15px -3px rgba(151, 181, 69, 0.5), 0 4px 6px -2px rgba(151, 181, 69, 0.05)`,
//                                 }}
//                                 onMouseOver={(e) =>
//                                     !submitting &&
//                                     (e.currentTarget.style.backgroundColor =
//                                         HOVER_COLOR)
//                                 }
//                                 onMouseOut={(e) =>
//                                     !submitting &&
//                                     (e.currentTarget.style.backgroundColor =
//                                         PRIMARY_COLOR)
//                                 }
//                                 disabled={submitting}
//                             >
//                                 {submitting && (
//                                     <Loader2 className="w-5 h-5 animate-spin" />
//                                 )}
//                                 {submitting ? "Đang đăng..." : "Đăng Bài"}
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={() => navigate(-1)}
//                                 className="px-10 py-3 text-gray-700 text-lg font-bold rounded-full border border-gray-300 hover:bg-gray-50 transition duration-150 hover:shadow-md disabled:opacity-50"
//                                 disabled={submitting}
//                             >
//                                 Hủy
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddProduct;
