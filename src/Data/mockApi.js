// src/api/MockApi.js

// Mock database - giả lập database
const mockProductsDB = [
    {
        id: 1,
        name: "Gạo GT25",
        type: "Lương thực",
        description:
            "Gạo GT25 thơm ngon, chất lượng cao, gạo mới thu hoạch đảm bảo an toàn vệ sinh thực phẩm. Phù hợp cho các bữa ăn gia đình và hoạt động từ thiện.",
        img: "https://images2.thanhnien.vn/528068263637045248/2025/8/3/02590ea503728a2cd363-17542142562171441795021.jpg",
        location: "Thanh Khê, Đà Nẵng",
        owner: "Nguyễn Văn A",
        phone: "0901 234 567",
        postedDate: "15/12/2023",
        status: "Còn hàng",
        createdAt: "2023-12-15T08:30:00Z",
    },
    {
        id: 2,
        name: "Thịt Heo",
        type: "Thực phẩm tươi",
        description:
            "Thịt heo tươi ngon, đảm bảo chất lượng, nguồn gốc rõ ràng. Đã qua kiểm dịch và chế biến hợp vệ sinh.",
        img: "https://media-cdn-v2.laodong.vn/storage/newsportal/2025/6/2/1517123/Thit-Heo-4.jpg",
        location: "Sơn Trà, Đà Nẵng",
        owner: "Trần Thị B",
        phone: "0902 345 678",
        postedDate: "14/12/2023",
        status: "Còn hàng",
        createdAt: "2023-12-14T10:15:00Z",
    },
    {
        id: 3,
        name: "Mỳ Tôm",
        type: "Đồ khô",
        description:
            "Mỳ tôm các loại, đa dạng hương vị, hạn sử dụng còn dài. Đóng gói nguyên bao bì, phù hợp cho các chương trình từ thiện.",
        img: "https://cf.shopee.vn/file/128356306e041124e072bd49b7017a6c",
        location: "Cẩm lệ, Đà Nẵng",
        owner: "Lê Văn C",
        phone: "0903 456 789",
        postedDate: "13/12/2023",
        status: "Còn hàng",
        createdAt: "2023-12-13T14:20:00Z",
    },
    {
        id: 4,
        name: "Rau Muống",
        type: "Rau xanh",
        description:
            "Rau muống tươi xanh, sạch sẽ, trồng theo phương pháp hữu cơ. Không sử dụng thuốc trừ sâu, thu hoạch trong ngày.",
        img: "https://lh4.googleusercontent.com/WZW-voWbP5fVvkTi-ud1WjykvPdqItJN25Yra4BrZt-r00K_yBfh6L_xCSYJAW8k4hT6MU8kG2hSoUWKSBmPM7Ws-uy3rPnsJPvAkoUuWVSSN4KKTXIwHOu_1uzuUpN48Pl9QIe7MtnZRBK8N7Y5vdNC5065nsI367c6jOKmAdz1veV0mPptfGMJamA8UN-W",
        location: "Hòa Khánh Nam, Đà Nẵng",
        owner: "Phạm Thị D",
        phone: "0904 567 890",
        postedDate: "12/12/2023",
        status: "Còn hàng",
        createdAt: "2023-12-12T09:45:00Z",
    },
];

// Mock API functions - giả lập API calls
const MockApi = {
    // Lấy tất cả sản phẩm
    getAllProducts: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: mockProductsDB,
                    message: "Lấy danh sách sản phẩm thành công",
                });
            }, 800); // Giả lập delay 800ms
        });
    },

    // Lấy sản phẩm theo ID
    getProductById: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = mockProductsDB.find(
                    (item) => item.id === parseInt(id)
                );
                if (product) {
                    resolve({
                        success: true,
                        data: product,
                        message: "Lấy thông tin sản phẩm thành công",
                    });
                } else {
                    reject({
                        success: false,
                        message: "Không tìm thấy sản phẩm",
                    });
                }
            }, 600); // Giả lập delay 600ms
        });
    },

    // Thêm sản phẩm mới (giống form AddProduct)
    addProduct: (productData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProduct = {
                    id: mockProductsDB.length + 1,
                    ...productData,
                    postedDate: new Date().toLocaleDateString("vi-VN"),
                    createdAt: new Date().toISOString(),
                    status: "Còn hàng",
                };

                mockProductsDB.push(newProduct);

                resolve({
                    success: true,
                    data: newProduct,
                    message: "Đăng sản phẩm thành công",
                });
            }, 1000); // Giả lập delay 1 giây
        });
    },

    // Tìm kiếm sản phẩm
    searchProducts: (keyword) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = mockProductsDB.filter(
                    (product) =>
                        product.name
                            .toLowerCase()
                            .includes(keyword.toLowerCase()) ||
                        product.type
                            .toLowerCase()
                            .includes(keyword.toLowerCase()) ||
                        product.location
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                );

                resolve({
                    success: true,
                    data: results,
                    message: `Tìm thấy ${results.length} sản phẩm`,
                });
            }, 500);
        });
    },

    // Lọc sản phẩm theo loại
    filterByType: (type) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = mockProductsDB.filter(
                    (product) => product.type === type
                );

                resolve({
                    success: true,
                    data: results,
                    message: `Tìm thấy ${results.length} sản phẩm loại ${type}`,
                });
            }, 400);
        });
    },

    // Lấy sản phẩm mới nhất
    getLatestProducts: (limit = 4) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sorted = [...mockProductsDB].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                const latest = sorted.slice(0, limit);

                resolve({
                    success: true,
                    data: latest,
                    message: `Lấy ${latest.length} sản phẩm mới nhất`,
                });
            }, 300);
        });
    },
};

export default MockApi;
