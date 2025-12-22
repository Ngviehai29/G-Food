import React, { useRef } from "react";
import leaf from "../G-Food-Images/leaf.svg";
import grass01 from "../G-Food-Images/grass1.svg";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Auth } from "../Utils/auth";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../Services/authService";
import avt_man from "../G-Food-Images/avata_man.png";
import avt_woman from "../G-Food-Images/woman.png";
import SearchBar from "./SearchBar";

export const Navbar = ({ settologin }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        Auth.logout();
        navigate("/");
    };

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const location = useLocation();

    // HÀM TÌM VÀ SCROLL ĐẾN SẢN PHẨM TRONG TRANG HIỆN TẠI
    const findAndScrollToProduct = (productId, productName) => {
        console.log(
            `🔍 Đang tìm sản phẩm ${productId} trong trang ${location.pathname}...`
        );

        // Thử tìm sản phẩm ngay lập tức
        let found = false;

        // Cách 1: Tìm bằng data attribute
        let element = document.querySelector(
            `[data-product-id="${productId}"]`
        );

        // Cách 2: Tìm bằng ID
        if (!element) {
            element = document.getElementById(`product-${productId}`);
        }

        // Cách 3: Tìm bằng class (nếu có)
        if (!element) {
            const allProductElements =
                document.querySelectorAll("[data-product-id]");
            for (const el of allProductElements) {
                if (el.dataset.productId === productId.toString()) {
                    element = el;
                    break;
                }
            }
        }

        if (element) {
            console.log(
                `✅ Tìm thấy sản phẩm "${productName}" trong trang hiện tại!`
            );

            // Scroll đến sản phẩm
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // Highlight sản phẩm
            highlightProduct(element);

            // Hiển thị thông báo nhỏ
            showNotification(
                `Đã tìm thấy "${productName}" trong trang này`,
                "success"
            );

            found = true;
            return { found: true, element };
        }

        return { found: false, element: null };
    };

    // HÀM XỬ LÝ KHI CHỌN SẢN PHẨM TỪ SEARCH
    const handleSearchSelect = (product) => {
        console.log("🎯 Sản phẩm được chọn từ search:", product);
        const productId = product.id || product._id;
        const productName = product.name || "Sản phẩm";

        // Bước 1: Kiểm tra nếu đang ở trang Home
        if (location.pathname === "/") {
            console.log("🏠 Đang ở Home, tìm sản phẩm trực tiếp...");

            // Gửi event đến Card_Product
            window.dispatchEvent(
                new CustomEvent("searchProductInHome", {
                    detail: {
                        productId: productId,
                        productName: productName,
                        timestamp: Date.now(),
                        // THÊM: Force để đảm bảo xử lý
                        force: true,
                    },
                })
            );

            // Không cần lưu vào sessionStorage nữa
            return;
        }

        // Bước 2: Nếu đang ở trang KHÁC Home
        console.log(`📍 Đang ở trang ${location.pathname}, chuyển về Home...`);

        // Lưu vào sessionStorage để Home xử lý khi chuyển trang
        sessionStorage.setItem("scrollToProductId", productId);
        sessionStorage.setItem("scrollTimestamp", Date.now().toString());
        sessionStorage.setItem("searchProductName", productName);

        // Điều hướng về Home
        navigate("/");

        // Hiển thị thông báo
        showNotification(
            `"${productName}" sẽ được tìm kiếm trong trang chủ...`,
            "info"
        );
    };

    // Hàm highlight sản phẩm
    const highlightProduct = (element) => {
        if (!element) return;

        // Thêm class highlight
        element.classList.add("highlight-search-result");

        // Thêm border highlight
        element.style.border = "3px solid #97b545";
        element.style.boxShadow = "0 0 20px rgba(151, 181, 69, 0.5)";

        // Tạo hiệu ứng pulse
        let pulseCount = 0;
        const pulseInterval = setInterval(() => {
            if (pulseCount < 6) {
                // Pulse 6 lần
                element.style.transform =
                    pulseCount % 2 === 0 ? "scale(1.02)" : "scale(1)";
                pulseCount++;
            } else {
                clearInterval(pulseInterval);
                element.style.transform = "";

                // Xóa highlight sau 3 giây
                setTimeout(() => {
                    element.classList.remove("highlight-search-result");
                    element.style.border = "";
                    element.style.boxShadow = "";
                }, 3000);
            }
        }, 300);
    };

    // Hàm hiển thị thông báo
    const showNotification = (message, type = "info") => {
        // Tạo element thông báo
        const notification = document.createElement("div");
        notification.className = `search-notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-lg">${type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️"
            }</span>
                <span>${message}</span>
            </div>
        `;

        // Thêm vào body
        document.body.appendChild(notification);

        // Tự động xóa sau 4 giây
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = "0";
                notification.style.transform = "translateX(100%)";
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    };

    // THÊM: Lắng nghe khi vào Home từ các trang khác
    useEffect(() => {
        // Kiểm tra sessionStorage khi component mount
        const checkSessionStorage = () => {
            const productId = sessionStorage.getItem("scrollToProductId");
            const timestamp = sessionStorage.getItem("scrollTimestamp");
            const productName = sessionStorage.getItem("searchProductName");

            if (productId && timestamp && location.pathname === "/") {
                const timeDiff = Date.now() - parseInt(timestamp);

                // Chỉ xử lý nếu dữ liệu còn mới (trong vòng 10 giây)
                if (timeDiff < 10000) {
                    console.log(
                        `🔄 Phát hiện yêu cầu scroll khi vào Home: ${productId}`
                    );

                    // Đợi một chút để các component khác render xong
                    setTimeout(() => {
                        // Gửi event để Card_Product xử lý
                        window.dispatchEvent(
                            new CustomEvent("searchProductInHome", {
                                detail: {
                                    productId: productId,
                                    productName: productName || "Sản phẩm",
                                },
                            })
                        );

                        // Xóa sessionStorage
                        sessionStorage.removeItem("scrollToProductId");
                        sessionStorage.removeItem("scrollTimestamp");
                        sessionStorage.removeItem("searchProductName");
                    }, 1500);
                } else {
                    // Dữ liệu cũ, xóa đi
                    sessionStorage.removeItem("scrollToProductId");
                    sessionStorage.removeItem("scrollTimestamp");
                    sessionStorage.removeItem("searchProductName");
                }
            }
        };

        // Kiểm tra sau 1 giây
        setTimeout(checkSessionStorage, 1000);

        // Cleanup
        return () => {
            // Xóa tất cả notification khi unmount
            const notifications = document.querySelectorAll(
                ".search-notification"
            );
            notifications.forEach((notification) => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            });
        };
    }, [location.pathname]);

    const user = Auth.getUser();
    const fullName = user?.username || "";
    const firstName = fullName ? fullName.split(" ").pop() : "";

    //avata theo sex
    const [userInfor, setUserinfor] = useState(true);
    const id = JSON.parse(localStorage.getItem("user"))?.id;
    useEffect(() => {
        if (!id) return;
        getUserById(id).then((data) => {
            setUserinfor(data.data);
        });
    }, [id]);

    return (
        <div
            className={`fixed z-[99] w-[100%] transition-all duration-500 ${scrolled
                ? "h-[70px] bg-[#ffffffec] shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                : "h-[85px] bg-[#ffffff00]"
                }`}
        >
            {/* ... phần còn lại giữ nguyên ... */}
            <div className="flex absolute top-[-5px] h-[12px] rotate-[-180deg]">
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
            </div>

            <div
                className={`container flex items-center justify-between mx-auto w-full h-full px-[50px] transition-all duration-500`}
            >
                <div className="w-[30%]">
                    <Link
                        to="/"
                        className="Logo text-[#97b545] font-bold text-[32px] font-['Dancing_Script'] relative pl-[12px]"
                    >
                        G-{" "}
                        <img
                            className="absolute top-0 left-[0px] rotate-[-46deg] inline-block w-[20px]"
                            src={leaf}
                            alt=""
                        />
                        <span
                            className={`transition-all duration-[0.5s] ${scrolled ? "text-black" : "text-white"
                                }`}
                        >
                            Food
                        </span>
                    </Link>
                </div>

                <div className="w-[40%]">
                    <ul
                        className={`flex justify-center gap-6 text-[16px] font-bold ${scrolled ? "" : "text-white"
                            }`}
                    >
                        <li>
                            <Link
                                to="/"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/about"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                About Us
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                to="/pages"
                                className={`transition-all duration-300 ${
                                    scrolled
                                        ? "text-[#000000db] hover:text-[#0000008b]"
                                        : "hover:text-[#ffffffa6]"
                                } ${
                                    location.pathname === "/pages"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                }`}
                            >
                                Pages
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link
                                to="/service"
                                className={`transition-all duration-300 ${
                                    scrolled
                                        ? "text-[#000000db] hover:text-[#0000008b]"
                                        : "hover:text-[#ffffffa6]"
                                } ${
                                    location.pathname === "/service"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                }`}
                            >
                                Service
                            </Link>
                        </li> */}

                        {/* <li>
                            <Link
                                to="/blog"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/blog"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                Blog
                            </Link>
                        </li> */}

                        <li>
                            <Link
                                to="/add-product"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/pages"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                Post +
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                to="/contact"
                                className={`transition-all duration-300 ${
                                    scrolled
                                        ? "text-[#000000db] hover:text-[#0000008b]"
                                        : "hover:text-[#ffffffa6]"
                                } ${
                                    location.pathname === "/contact"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                }`}
                            >
                                Contact
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <div className="w-[30%] search-container justify-end right flex gap-6 items-center">
                    <SearchBar
                        scrolled={scrolled}
                        onSearchSelect={handleSearchSelect}
                    />

                    <div className="right flex justify-end gap-6 items-center">
                        {user ? (
                            <>
                                <div className="group relative">
                                    <div className="group-hover:opacity-0 transition-all duration-300 relative h-[42px] w-[42px] rounded-full cursor-pointer">
                                        <img
                                            className="absolute w-[100%] h-[100%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            src={
                                                userInfor.sex === true
                                                    ? avt_man
                                                    : avt_woman
                                            }
                                            alt=""
                                        />
                                    </div>

                                    {/* MENU TRƯỢT TỪ BÊN PHẢI */}
                                    <div className="fixed transition-all duration-300 translate-x-full group-hover:translate-x-0 right-0 top-0 w-[220px] bg-[#ffffffec] h-full pt-8 text-center shadow-lg">
                                        {/* Avatar + tên */}
                                        <div>
                                            <div className="relative h-[46px] w-[46px] rounded-full mx-auto">
                                                <img
                                                    className="absolute w-[100%] h-[100%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                                    src={
                                                        userInfor.sex === true
                                                            ? avt_man
                                                            : avt_woman
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <h2 className="font-light text-[18px] font-['Lora'] text-black/50 mt-[5px]">
                                                Hi, {firstName}
                                            </h2>
                                        </div>

                                        {/* Menu */}
                                        <div className="relative px-8 mt-6 flex flex-col gap-2 text-left h-full">

                                            {/* ADMIN */}
                                            {user?.Roles?.[0]?.rolename === "admin" && (
                                                <Link to="/dashboard">
                                                    <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                        Dashboard
                                                        <i className="fa-solid fa-bars-progress text-[13px] pl-[5px]"></i>
                                                    </button>
                                                </Link>
                                            )}

                                            {/* TÀI KHOẢN */}
                                            <Link to="/inforuser">
                                                <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                    Tài khoản
                                                    <i className="fa-solid fa-user text-[13px] pl-[5px]"></i>
                                                </button>
                                            </Link>

                                            {/* USER */}
                                            {user?.Roles?.[0]?.rolename === "user" && (

                                                <>
                                                    <Link to="/manage-donations">
                                                        <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                            Nhận/Duyệt
                                                            <i className="fa-solid fa-clipboard-check text-[13px] pl-[5px]"></i>
                                                        </button>
                                                    </Link>
                                                    <Link to="/add-product">
                                                        <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                            Đăng bài viết
                                                            <i className="fa-solid fa-plus text-[13px] pl-[5px]"></i>
                                                        </button>
                                                    </Link>


                                                </>
                                            )}

                                            {/* Đăng xuất */}
                                            <button
                                                onClick={handleLogout}
                                                className="absolute bottom-[150px] left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-400 text-white transition-all duration-300 rounded-lg p-2 flex justify-center items-center mt-10 w-[160px]"
                                            >
                                                Đăng xuất
                                                <i className="fa-solid fa-arrow-right-from-bracket text-[13px] pl-[5px]"></i>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </>
                        ) : (
                            // user = null
                            <>
                                <div className="flex gap-2 text-[14px]">
                                    <Link
                                        to="/signup"
                                        onClick={() => settologin(true)}
                                        className={`${scrolled
                                            ? "text-black"
                                            : "text-white"
                                            } hover:opacity-70`}
                                    >
                                        Đăng ký
                                    </Link>
                                    <span
                                        className={`${scrolled
                                            ? "text-[#00000050]"
                                            : "text-white/60"
                                            }`}
                                    >
                                        |
                                    </span>
                                    <Link
                                        to="/signup"
                                        onClick={() => settologin(false)}
                                        className={`${scrolled
                                            ? "text-black"
                                            : "text-white"
                                            } hover:opacity-70`}
                                    >
                                        Đăng nhập
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
