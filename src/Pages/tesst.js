// Bước 2: Nếu không tìm thấy trong trang hiện tại

        // Kiểm tra xem trang hiện tại có phải là Home không
        if (location.pathname === "/") {
            // Nếu đang ở Home nhưng không tìm thấy, có thể sản phẩm ở trang phân trang khác
            console.log(
                "📍 Đang ở Home nhưng không tìm thấy sản phẩm, có thể ở trang khác..."
            );

            // Lưu vào sessionStorage để Card_Product xử lý
            sessionStorage.setItem("scrollToProductId", productId);
            sessionStorage.setItem("scrollTimestamp", Date.now().toString());
            sessionStorage.setItem("searchProductName", productName);

            // Gửi event để Card_Product tìm và scroll
            window.dispatchEvent(
                new CustomEvent("searchProductInHome", {
                    detail: {
                        productId: productId,
                        productName: productName,
                        timestamp: Date.now(), // THÊM timestamp
                    },
                })
            );

            // Hiển thị thông báo
            showNotification(
                `Đang tìm "${productName}" trong danh sách sản phẩm...`,
                "info"
            );
        } else {
            // Nếu đang ở trang KHÁC Home
            console.log(
                `📍 Sản phẩm không có trong trang ${location.pathname}, chuyển về Home...`
            );

            // Lưu vào sessionStorage
            sessionStorage.setItem("scrollToProductId", productId);
            sessionStorage.setItem("scrollTimestamp", Date.now().toString());
            sessionStorage.setItem("searchProductName", productName);

            // Điều hướng về Home
            navigate("/", {
                state: {
                    fromSearch: true,
                    productId: productId,
                    productName: productName,
                },
            });

            // Hiển thị thông báo
            showNotification(
                `"${productName}" không có trong trang này. Đang chuyển về trang chủ...`,
                "warning"
            );
        }











        useEffect(() => {
                fetchProductsFromAPI();
        
                // Lắng nghe event từ Navbar khi ở bất kỳ trang nào
                const handleScrollRequest = (event) => {
                    const { productId, productName, timestamp } = event.detail;
                    console.log("📡 Card_Product nhận scroll request:", productId);
                    setScrollRequest({
                        productId,
                        productName: productName || "Sản phẩm",
                        timestamp,
                        attempts: 0,
                    });
                };
        
                // THÊM: Lắng nghe sự kiện từ Navbar khi ở Home
                const handleSearchInHome = (event) => {
                    const { productId, productName } = event.detail;
                    console.log(
                        `🏠 Card_Product nhận yêu cầu tìm sản phẩm từ Navbar: ${productId}`
                    );
        
                    // Tạo scroll request tương tự
                    setScrollRequest({
                        productId,
                        productName: productName || "Sản phẩm",
                        timestamp: Date.now(),
                        attempts: 0,
                    });
                };
        
                window.addEventListener(
                    "scrollToProductFromSearch",
                    handleScrollRequest
                );
        
                // THÊM: Lắng nghe sự kiện này
                window.addEventListener("searchProductInHome", handleSearchInHome);
        
                return () => {
                    window.removeEventListener(
                        "scrollToProductFromSearch",
                        handleScrollRequest
                    );
                    // THÊM: Cleanup
                    window.removeEventListener(
                        "searchProductInHome",
                        handleSearchInHome
                    );
                };
            }, []);