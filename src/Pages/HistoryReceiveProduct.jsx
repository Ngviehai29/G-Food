

import React, { useState, useEffect } from "react";
import { Loader2, Frown, MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductReviewModal } from '../Components/ProductReviewModal';
import { ReviewDetailModal } from '../Components/ReviewDetailModal';

// --- CẤU HÌNH VÀ GIẢ LẬP DỮ LIỆU ---
const PRIMARY_COLOR = "#97b545";
const LIGHT_BLUE = "#e0f2ff";
const getUserId = () => 123;

// Giả lập dữ liệu Lịch sử Nhận Sản phẩm 
const MOCK_HISTORY = [
    {
        id: 1,
        date: '20/12/2025',
        type: 'Rau Xanh',
        name: 'Rau Xà Lách',
        sharer: 'Nguyễn Văn A',
        recipient: 'Nguyễn Văn A',
        status: 'received',
        rating: 'Chưa đánh giá'
    },
    {
        id: 2,
        date: '20/12/2025',
        type: 'Rau Xanh',
        name: 'Rau Cải Xoong',
        sharer: 'Nguyễn Văn A',
        recipient: 'Nguyễn Văn A',
        status: 'received',
        rating: 'chưa đánh giá',
        reviewContent: 'Sản phẩm rất tươi ngon, giao hàng nhanh chóng!'
    },
    {
        id: 3,
        date: '15/12/2025',
        type: 'Trái Cây',
        name: 'Táo',
        sharer: 'Trần Thị B',
        recipient: 'Nguyễn Văn A',
        status: 'received',
        rating: 'chưa đánh giá'
    },
];


const PageHeader = () => {
    return (
        <div
            className="w-full pt-20 pb-12 text-center"
            style={{
                backgroundColor: '#fef5ec',
                backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 2px, transparent 2px, transparent 8px)',
                backgroundSize: '16px 16px'
            }}
        >
            <h1 className="text-4xl font-extrabold" style={{ color: '#333' }}>
                LỊCH SỬ NHẬN SẢN PHẨM
            </h1>

            <div className="text-sm font-medium mt-3 text-gray-500 justify-center flex">
                <Link to="/" className="hover:text-green-600 transition">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800">Lịch sử</span>
            </div>
        </div>
    );
};


const HistoryReceiveProduct = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = getUserId();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    //STATE MỚI: Quản lý Modal Chi tiết
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [reviewDetail, setReviewDetail] = useState(null);


    // Dùng useState để lưu và cập nhật history
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setHistory(MOCK_HISTORY);
            setLoading(false);
        }, 800);
    }, [userId]);

    // HÀM XỬ LÝ ĐÓNG MODAL VÀ CẬP NHẬT TRẠNG THÁI
    const handleCloseModal = (reviewSubmitted) => {
        setIsModalOpen(false);

        // Nếu đánh giá được gửi thành công, cập nhật state history
        if (reviewSubmitted && selectedProduct) {
            setHistory(prevHistory =>
                prevHistory.map(item =>
                    item.id === selectedProduct.id
                        ? { ...item, rating: 1, reviewContent: 'Đã đánh giá thành công' }
                        : item
                )
            );
        }
        setSelectedProduct(null);
    };


    const handleRating = (productId) => {
        const productToReview = history.find(item => item.id === productId);
        if (productToReview) {
            setSelectedProduct(productToReview);
            setIsModalOpen(true);
        }
    };

    //CẬP NHẬT: HÀM XEM CHI TIẾT ĐÁNH GIÁ để mở Modal Chi tiết
    const handleViewDetail = (productId) => {
        const productReviewed = history.find(item => item.id === productId);

        if (productReviewed) {
            // Lấy dữ liệu cần thiết từ item
            setReviewDetail({
                productName: productReviewed.name,
                sharerName: productReviewed.sharer,
                reviewContent: productReviewed.reviewContent
            });
            setIsDetailModalOpen(true);
        } else {
            alert(`Không tìm thấy chi tiết sản phẩm.`);
        }
    };


    return (
        <div className="w-full min-h-screen">
            <PageHeader />
            <div className="p-8" style={{ backgroundColor: '#ffffff' }}>
                <div className="max-w-7xl mx-auto min-h-[70vh]">

                    {loading && (
                        <div className="text-center pt-10">
                            <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-3" />
                            <p className="text-gray-600">Đang tải lịch sử nhận sản phẩm...</p>
                        </div>
                    )}
                    {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">Lỗi: {error}</div>}

                    {!loading && !error && (
                        <div className="overflow-x-auto shadow-xl rounded-xl">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead style={{ backgroundColor: PRIMARY_COLOR }}>
                                    <tr>
                                        {['Ngày Nhận', 'Loại Sản Phẩm', 'Tên Sản Phẩm', 'Thông Tin Cho', 'Thông Tin Người Nhận', 'Đánh Giá'].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                Chưa có sản phẩm nào được nhận.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className={index % 2 === 0 ? `bg-white` : ''}
                                                style={index % 2 !== 0 ? { backgroundColor: LIGHT_BLUE } : {}}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.sharer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {item.recipient}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {/* LOGIC KIỂM TRA ĐÁNH GIÁ TỐI ƯU HÓA */}
                                                    {item.status === 'received' && (typeof item.rating !== 'number') ? (
                                                        <button
                                                            onClick={() => handleRating(item.id)}
                                                            className="text-red-500 font-semibold hover:text-red-700 transition flex items-center"
                                                        >
                                                            <Star className="w-4 h-4 mr-1" /> Đánh Giá
                                                        </button>
                                                    ) : item.status === 'received' && (typeof item.rating === 'number') ? (
                                                        <button
                                                            onClick={() => handleViewDetail(item.id)}
                                                            className="text-blue-500 font-semibold hover:text-blue-700 transition flex items-center"
                                                        >
                                                            <MessageSquare className="w-4 h-4 mr-1" /> Chi Tiết
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* HIỂN THỊ MODAL ĐÁNH GIÁ*/}
            {isModalOpen && selectedProduct && (
                <ProductReviewModal
                    productId={selectedProduct.id}
                    productName={selectedProduct.name}
                    sharerName={selectedProduct.sharer}
                    onClose={handleCloseModal}
                />
            )}

            {/*HIỂN THỊ MODAL CHI TIẾT NHẬN XÉT */}
            {isDetailModalOpen && reviewDetail && (
                <ReviewDetailModal
                    productName={reviewDetail.productName}
                    sharerName={reviewDetail.sharerName}
                    reviewContent={reviewDetail.reviewContent}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default HistoryReceiveProduct;