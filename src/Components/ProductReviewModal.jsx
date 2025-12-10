// ProductReviewModal.jsx (Sửa đổi để khớp giao diện nhập liệu dạng ảnh)

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner'; // Giả định dùng sonner cho thông báo

const PRIMARY_COLOR = "#97b545"; // Xanh lá chủ đạo
const PRODUCT_FRAME_BG = "#eafff7"; // Màu nền sáng cho khung sản phẩm (Nền xanh nhạt)
const PRODUCT_IMAGE_URL = 'https://i.imgur.com/gK9t8gM.jpeg'; // Ảnh Táo mẫu

// --- Component StarRating (Đã bị loại bỏ theo yêu cầu ban đầu, nhưng cần tái tạo cho đầy đủ) ---
// Giữ lại logic của Modal hiện tại, tập trung vào giao diện.

export const ProductReviewModal = ({ 
    productId, 
    productName = "Táo", 
    sharerName = "Nguyễn Văn B", 
    onClose 
}) => {
    
    const [comment, setComment] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (comment.trim() === "") {
            // Hiển thị lỗi ngay dưới textarea
            setError("Vui lòng nhập nhận xét trước khi gửi.");
            return;
        }
        
        setLoading(true);
        setError(null);

        const reviewData = {
            productId: productId,
            comment: comment.trim(),
        };

        try {
            console.log("Submitting review:", reviewData);
            
            // Giả lập thành công sau 1.5 giây
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            toast.success(`Đã gửi nhận xét cho ${productName}!`);
            onClose(true); // Đóng modal và truyền true để báo hiệu đã đánh giá thành công

        } catch (err) {
            // Giả lập lỗi API
            const errorMessage = err.message || "Đã xảy ra lỗi khi gửi nhận xét.";
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" onClick={() => onClose(false)}></div>

            <Toaster position="bottom-center" richColors /> 

            {/* Modal Content - Container chính */}
            <div 
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-4 transform transition-all duration-300 animate-fadeIn"
                style={{ border: `3px solid ${PRIMARY_COLOR}` }} 
            >
                
                {/* Nút Đóng */}
                <button
                    onClick={() => onClose(false)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-gray-100 transition text-gray-400 hover:text-red-600 z-10"
                >
                    <X size={24} />
                </button>

                {/* 1. Khung Sản phẩm và Tên người chia sẻ (Giống hình ảnh) */}
                <div 
                    className="relative w-full rounded-xl overflow-hidden shadow-md mb-4" 
                    style={{ backgroundColor: PRODUCT_FRAME_BG, border: `1px solid ${PRIMARY_COLOR}` }}
                >
                    {/* Hình ảnh sản phẩm */}
                    <div className="w-full h-auto overflow-hidden rounded-t-xl">
                        <img 
                            src={PRODUCT_IMAGE_URL} 
                            alt={productName} 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* Tiêu đề và Tên người chia sẻ */}
                    <div className="text-center p-2">
                        <h2 className="text-2xl font-bold text-gray-800 leading-tight">{productName}</h2>
                        <p className="text-sm text-gray-500 font-normal">
                            <span className="font-medium italic">{sharerName}</span>
                        </p>
                    </div>
                </div>

                {/* 2. Ô Nhập Nhận xét (TextArea) */}
                <div className="mb-4 pt-2">
                    {/* Input field được style lại giống khung chat */}
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setError(null); 
                        }}
                        rows={3} // Ít hàng hơn để khớp với chiều cao trong hình
                        placeholder="Nhận xét của bạn..."
                        className="w-full p-3 border border-gray-400 rounded-lg focus:ring-green-500 focus:border-green-500 transition resize-none shadow-sm text-base"
                        style={{ borderBottom: '3px solid #ccc' }} // Tạo hiệu ứng đường kẻ đậm
                    />
                </div>

                {/* 3. Nút Gửi */}
                {error && (
                    <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded-lg text-center">
                        {error}
                    </div>
                )}
                
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 text-white font-bold rounded-lg transition duration-300 shadow-md active:scale-95 flex items-center justify-center"
                    style={{ 
                        backgroundColor: PRIMARY_COLOR, 
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang gửi...
                        </>
                    ) : (
                        `Gửi Nhận Xét`
                    )}
                </button>
            </div>
        </div>
    );
};