import React from 'react';

const PRIMARY_COLOR = "#97b545"; // Màu xanh lá chủ đạo
const CARD_BG = '#eafff7'; // Màu nền xanh nhạt cho thẻ

export const ReceiveProductCard = ({ 
    product, 
    onContact
}) => {
    // Do trang ReceiveProductPage đã lọc nghiêm ngặt, ta mặc định card này là ĐÃ DUYỆT.
    const sharerDisplay = product.sharerContact?.name || product.sharerName || "Người chia sẻ";
    
    return (
        <div 
            className="rounded-xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
            style={{ border: `4px solid ${PRIMARY_COLOR}`, backgroundColor: CARD_BG }}
        >
            {/* Hình ảnh sản phẩm */}
            <div className="h-40 overflow-hidden">
                <img 
                    src={product.productImageUrl || 'https://i.imgur.com/gK9t8gM.jpeg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                />
            </div>
            
            {/* Thông tin sản phẩm */}
            <div className="p-3 text-center">
                <p className="font-bold text-lg mb-0.5">{product.name}</p>
                <p className="text-sm text-gray-700 mb-2">
                    {/* Hiển thị tên người liên hệ trực tiếp */}
                    {sharerDisplay}
                </p>

                {/* NÚT LIÊN HỆ: Luôn hiển thị vì sản phẩm đã được lọc */}
                <button 
                    // Chắc chắn gọi onContact, vì dữ liệu liên hệ đã được kiểm tra ở bước lọc
                    onClick={() => onContact(product)}
                    className="w-full py-2 rounded-full text-white font-bold transition duration-150 active:scale-95 shadow-md"
                    style={{ backgroundColor: '#ff5c5c' }} // Màu đỏ cho nút Liên Hệ
                >
                    Liên Hệ
                </button>
            </div>
        </div>
    );
};