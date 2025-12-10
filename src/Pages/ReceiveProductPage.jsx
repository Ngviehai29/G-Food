import React, { useState, useEffect } from 'react';
import { Loader2, Frown } from 'lucide-react';
import { ReceiveProductCard } from '../Components/ReceiveProductCard';

const PRIMARY_COLOR = "#97b545";

// Giả lập dữ liệu sản phẩm và trạng thái duyệt cho người nhận (recipient)
const MOCK_RECIPIENT_PRODUCTS = [
    // Sản phẩm 1: Đã được duyệt (SẼ ĐƯỢC HIỂN THỊ)
    { id: 1, name: 'Cà Rốt', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', sharerName: 'Nguyễn Văn A', approvalStatus: 'APPROVED',
      sharerContact: { name: "Nguyễn Văn A", phone: "0901234567" }
    },
    // Sản phẩm 2: Chờ duyệt (BỊ LỌC BỎ)
    { id: 2, name: 'Táo', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', sharerName: 'Trần Thị B', approvalStatus: 'PENDING', sharerContact: null },
    // Sản phẩm 3: Đã được duyệt nhưng thiếu thông tin (SẼ BỊ LỌC BỎ trong logic tối ưu)
    { id: 3, name: 'Dưa Hấu', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', sharerName: 'Phạm Văn C', approvalStatus: 'APPROVED', sharerContact: null },
    // Sản phẩm 4: Đã được duyệt (SẼ ĐƯỢC HIỂN THỊ)
    { id: 4, name: 'Bắp Cải', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', sharerName: 'Lê Văn D', approvalStatus: 'APPROVED',
      sharerContact: { name: "Lê Văn D", phone: "0987654321" }
    },
    // Các sản phẩm chờ/mới (BỊ LỌC BỎ)
    { id: 5, name: 'Khoai Tây', productImageUrl: 'https://i.imgur.com/gK9t8gM.jpeg', sharerName: 'Hoàng Văn E', approvalStatus: 'PENDING', sharerContact: null },
];

const ReceiveProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            
            // ✨ LOGIC LỌC TỐI ƯU: Chỉ giữ lại sản phẩm CÓ TRẠNG THÁI 'APPROVED' VÀ CÓ sharerContact
            const finalApprovedProducts = MOCK_RECIPIENT_PRODUCTS.filter(
                product => 
                    product.approvalStatus === 'APPROVED' && 
                    product.sharerContact != null // Đảm bảo không có lỗi dữ liệu liên hệ
            );

            setProducts(finalApprovedProducts);
            setLoading(false);
        }, 800);
    }, []);

    const handleContact = (product) => {
        // Hàm này đảm bảo chỉ được gọi khi đã có thông tin
        if (product.sharerContact) {
            alert(`Sản phẩm ${product.name} đã được duyệt. Vui lòng liên hệ với ${product.sharerContact.name} qua SĐT: ${product.sharerContact.phone}`);
        }
    };

    // Hàm này không còn được sử dụng do ta đã lọc các sản phẩm pending
    const handleDetail = () => {}; 

    if (loading) {
        return (
            <div className="w-full min-h-screen pt-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                <p className="ml-3 text-gray-600">Đang tải danh sách sản phẩm đã duyệt...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pt-20 p-8" style={{ backgroundColor: '#fff' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800 flex-1">NHẬN SẢN PHẨM ĐÃ DUYỆT</h1>
                    <button className="px-4 py-2 rounded-full text-white font-semibold"
                            style={{ backgroundColor: PRIMARY_COLOR }}>Lọc</button>
                </div>

                {/* Grid Sản phẩm */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ReceiveProductCard
                                key={product.id}
                                product={product}
                                onContact={handleContact}
                                // onDetail không cần thiết nhưng giữ lại để tuân thủ props nếu cần
                                onDetail={handleDetail} 
                            />
                        ))
                    ) : (
                        <div className="col-span-4 text-center p-10 text-gray-500 border border-dashed rounded-lg">
                            <Frown className="w-8 h-8 mx-auto mb-3" />
                            <p className="text-lg font-semibold">Tuyệt vời! Hiện chưa có yêu cầu nào của bạn được duyệt.</p>
                            <p className="text-sm mt-1">Hãy chờ đợi thông báo từ người chia sẻ hoặc xem thêm các sản phẩm khác.</p>
                        </div>
                    )}
                </div>

                {/* Phân trang */}
                <div className="flex justify-center mt-8 space-x-2">
                    <button className="w-8 h-8 rounded-full bg-yellow-400 font-bold text-gray-800">1</button>
                    <button className="w-8 h-8 rounded-full bg-yellow-400 font-bold text-gray-800">2</button>
                    <button className="w-8 h-8 rounded-full bg-yellow-400 font-bold text-gray-800">3</button>
                </div>
            </div>
        </div>
    );
};

export default ReceiveProductPage;