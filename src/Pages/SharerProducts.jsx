import React from 'react';
import { Link } from 'react-router-dom';

const PRIMARY_COLOR = "#97b545";

// Dữ liệu giả lập các bài đăng/sản phẩm của người chia sẻ
const MOCK_PRODUCTS_LIST = [
    { id: 10, name: 'Táo', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
    { id: 20, name: 'Nho', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
    { id: 30, name: 'Thịt Heo', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
    { id: 40, name: 'Cá', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
    { id: 50, name: 'Lê', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
    { id: 60, name: 'Ổi', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
    { id: 70, name: 'Mực', imageUrl: 'https://i.imgur.com/gK9t8gM.jpeg' },
];

const SharerProducts = () => {
    return (
        <div className="w-full min-h-screen pt-20" style={{ backgroundColor: '#fff' }}>
            <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-2xl"
                 style={{ border: `5px solid ${PRIMARY_COLOR}` }}>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h1 className="text-3xl font-bold text-gray-800">DUYỆT SẢN PHẨM CHO</h1>
                    <button className="px-4 py-2 rounded-full text-white font-semibold" 
                            style={{ backgroundColor: PRIMARY_COLOR }}>Lọc</button>
                </div>

                {/* Grid Sản phẩm */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {MOCK_PRODUCTS_LIST.map((product) => (
                        <Link 
                            key={product.id} 
                            // ✨ Điều hướng đến trang Browseproducts với productId
                            to={`/manage-requests/${product.id}`}
                            className="block rounded-xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.05]"
                            style={{ border: `2px solid ${PRIMARY_COLOR}`, backgroundColor: '#eafff7' }}
                        >
                            <div className="relative h-40">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-end justify-center">
                                    <span className="text-white font-bold text-xl mb-3">{product.name}</span>
                                </div>
                            </div>
                            
                            <div className="text-center p-2">
                                <div className="bg-red-500 text-white text-xs font-semibold py-1 rounded-full hover:bg-red-600 transition">
                                    XEM NGƯỜI MUỐN NHẬN
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Phân trang giả lập */}
                <div className="flex justify-center mt-8 space-x-2">
                    <button className="w-8 h-8 rounded-full bg-yellow-500 text-white font-bold">1</button>
                    <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">2</button>
                    <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300">3</button>
                </div>

            </div>
        </div>
    );
};

export default SharerProducts;