// Components/ReviewDetailModal.jsx (Kết hợp thiết kế hình ảnh và chức năng Modal)

import React from 'react';
import { X } from 'lucide-react'; // Chỉ cần X cho nút đóng

// Màu sắc và URL được định nghĩa dựa trên hình ảnh
const PRIMARY_COLOR = "#97b545"; // Xanh lá chủ đạo
const PRODUCT_FRAME_BG = "#eafff7"; // Màu nền sáng cho khung sản phẩm (Nền xanh nhạt)
const USER_AVATAR_URL = 'https://i.imgur.com/kS40TfO.png'; // Avatar mẫu của Nguyễn Văn A
const PRODUCT_IMAGE_URL = 'https://i.imgur.com/gK9t8gM.jpeg'; // Ảnh Táo mẫu

export const ReviewDetailModal = ({ 
    productName = "Táo", 
    sharerName = "Nguyễn Văn B", 
    reviewContent, 
    reviewerName = "Nguyễn Văn A", 
    onClose 
}) => {
    
    // Nội dung review lấy từ prop, nếu không có sẽ hiển thị "Đỡ quá"
    const displayReview = reviewContent && typeof reviewContent === 'string' 
        ? reviewContent 
        : "Đỡ quá"; 

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            {/* Modal Content - Container chính màu trắng */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-4 transform transition-all duration-300 scale-100" // Đã thêm p-4
                style={{ border: `3px solid ${PRIMARY_COLOR}` }} 
            >
                
                {/* Nút Đóng - Đặt ở góc trên bên phải */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-gray-100 transition text-gray-500 hover:text-red-600 z-10"
                >
                    <X size={20} />
                </button>

                {/* 1. Khung Sản phẩm và Tên người chia sẻ  */}
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

                {/* 2. Phần Nhận xét/Bình luận của người dùng */}
                <div className="pt-2">
                    <div className="flex items-end">
                        {/* Avatar người đánh giá */}
                        <img 
                            src={USER_AVATAR_URL} 
                            alt={reviewerName}
                            className="w-10 h-10 rounded-full border-2 border-yellow-500 shadow-sm mr-2 flex-shrink-0"
                        />
                        
                        {/* Nội dung Review chính */}
                        <div 
                            className="p-3 rounded-xl rounded-bl-none shadow-sm max-w-[85%] border" // max-w-[85%] để tạo khoảng trống bên phải
                            style={{ backgroundColor: 'white', borderColor: '#e0e0e0' }}
                        >
                            {/* Tên người đánh giá */}
                            <p className="font-bold text-sm text-gray-900 mb-0.5">{reviewerName}</p>
                            
                            {/* Nội dung Review */}
                            <p className="text-gray-800 text-base">
                                {displayReview}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};