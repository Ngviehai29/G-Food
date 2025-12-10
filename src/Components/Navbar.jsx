import React, { useRef } from "react";
import leaf from "../G-Food-Images/leaf.svg";
import grass01 from "../G-Food-Images/grass1.svg";
import { useEffect, useState } from "react";
import iconsearch from "../G-Food-Images/icon_search.svg";
import LogoAcc from "../G-Food-Images/Logo_Acc.svg";
import { Link, useLocation } from "react-router-dom";
import { Auth } from "../Utils/auth";
import { useNavigate } from 'react-router-dom';
import { getUserById } from "../Services/authService";
import avt_man from "../G-Food-Images/avata_man.png"
import avt_woman from '../G-Food-Images/woman.png'

export const Navbar = ({ settologin }) => {
    const navigator = useNavigate();
    const handleLogout = async () => {
        Auth.logout();
        navigator("/");
    };

    const [scrolled, setScrolled] = useState(false);
    // Search
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    // Dùng để tham chiếu đến container tìm kiếm
    const searchRef = useRef(null);

    const products = [
        { id: 1, name: "Pizza Hải Sản", category: "Đồ Ăn" },
        { id: 2, name: "Burger Bò Phô Mai", category: "Đồ Ăn" },
        { id: 3, name: "Gà Rán Giòn", category: "Đồ Ăn" },
        { id: 4, name: "Salad Cá Ngừ", category: "Đồ Ăn" },
        { id: 5, name: "Sinh Tố Dâu", category: "Đồ Uống" },
        { id: 6, name: "Cà Phê Latte", category: "Đồ Uống" },
        { id: 7, name: "Trà Sữa Trân Châu", category: "Đồ Uống" },
        { id: 8, name: "Bánh Kem Socola", category: "Tráng Miệng" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const location = useLocation();
    // xử lý tìm kiếm real-time
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            return;
        }
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchTerm]);

    // 🌟 LOGIC MỚI: Xử lý click ra ngoài để đóng form
    useEffect(() => {
        function handleClickOutside(event) {
            // Kiểm tra: form đang mở VÀ click xảy ra bên ngoài searchRef
            // Nếu click vào bất cứ đâu bên trong searchRef (bao gồm input), form sẽ không đóng.
            if (
                searchOpen &&
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setSearchOpen(false);
                setSearchTerm("");
                setSearchResults([]);
            }
        }

        // Thêm event listener khi component mount/searchOpen thay đổi
        document.addEventListener("mousedown", handleClickOutside);

        // Dọn dẹp khi component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchOpen]);

    // 🌟 LOGIC SỬA: handleSearch chỉ đóng form khi CHỌN MỘT KẾT QUẢ TỪ DROPDOWN
    // Nó KHÔNG đóng form khi chỉ nhấn nút search/Enter để tìm kiếm
    const handleSearch = (productName = "") => {
        // Nếu có productName được truyền vào, tức là người dùng đã chọn một sản phẩm từ dropdown.
        if (productName && productName !== searchTerm) {
            console.log("Đã chọn sản phẩm:", productName);
            // Sau khi chọn sản phẩm, chúng ta đóng form và reset trạng thái.
            setSearchOpen(false);
            setSearchTerm("");
            setSearchResults([]);
            // *** TẠI ĐÂY BẠN THỰC HIỆN LOGIC ĐIỀU HƯỚNG/XỬ LÝ SẢN PHẨM ***
        }
        // Nếu không có productName (tức là nhấn nút search trong form), ta không làm gì cả,
        // vì tìm kiếm real-time đã xử lý kết quả, và form vẫn mở nhờ logic click outside.
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            // Khi nhấn Enter, có thể coi là hành động tìm kiếm chốt (nếu không có nhu cầu điều hướng ngay,
            // có thể bỏ qua lệnh này vì kết quả đã được lọc real-time)
            handleSearch(searchTerm); // Giữ nguyên hàm này nếu bạn muốn hành động chốt
        }
    };
    const user = Auth.getUser();
    const fullName = user?.username || "";
    const firstName = fullName ? fullName.split(" ").pop() : "";

    //avata theo sex
    const [userInfor, setUserinfor] = useState(true)
    const id = JSON.parse(localStorage.getItem("user"))?.id;
    useEffect(() => {
        if (!id) return;
        getUserById(id).then((data) => {
            setUserinfor(data.data);
        })
    })
    return (
        <div
            className={`fixed z-[99] w-[100%] transition-all duration-500 ${scrolled ? "h-[70px] bg-[#ffffffec] shadow-[0_6px_20px_rgba(0,0,0,0.15)]" : "h-[85px] bg-[#ffffff00]"
                }`}
        >
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
                        <li>
                            <Link
                                to="/pages"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/pages"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                Pages
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/service"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/service"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                Service
                            </Link>
                        </li>
                        <li>
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
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className={`transition-all duration-300 ${scrolled
                                    ? "text-[#000000db] hover:text-[#0000008b]"
                                    : "hover:text-[#ffffffa6]"
                                    } ${location.pathname === "/contact"
                                        ? "!text-main border-main"
                                        : "border-[#fff0]"
                                    }`}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="w-[30%] search-container justify-end right flex gap-6 items-center">
                    <div className="relative">
                        {searchOpen ? (
                            //  ÁP DỤNG searchRef VÀO DIV CHỨA FORM TÌM KIẾM
                            <div className="relative" ref={searchRef}>
                                <div className="search-box flex items-center bg-white rounded-full shadow-lg px-3 py-2 min-w-[300px]">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        className="w-full bg-transparent border-none outline-none text-sm text-gray-800 px-2"
                                        autoFocus
                                    />
                                    <button
                                        // Khi nhấn nút tìm kiếm, ta dùng hàm handleSearch đã sửa
                                        onClick={() => handleSearch(searchTerm)}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <img
                                            className="size-4"
                                            src={iconsearch}
                                            alt="Search"
                                        />
                                    </button>
                                    <button
                                        // Nút đóng (X) vẫn giữ nguyên logic đóng form
                                        onClick={() => {
                                            setSearchOpen(false);
                                            setSearchTerm("");
                                            setSearchResults([]);
                                        }}
                                        className="ml-1 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Dropdown kết quả tìm kiếm */}
                                {searchResults.length > 0 && (
                                    <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                                        {searchResults.map((product) => (
                                            <div
                                                key={product.id}
                                                // Khi click vào kết quả, gọi handleSearch để CHỌT, ĐÓNG form
                                                onClick={() =>
                                                    handleSearch(product.name)
                                                }
                                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                            >
                                                <div className="font-medium text-gray-800">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {product.category}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Không tìm thấy kết quả */}
                                {searchTerm.trim() !== "" &&
                                    searchResults.length === 0 && (
                                        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                                            <div className="text-gray-500 text-center">
                                                Không tìm thấy sản phẩm "
                                                {searchTerm}"
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ) : (
                            // Nút kính lúp khi form đóng (Giữ nguyên)
                            <div
                                className="Icon_search cursor-pointer"
                                onClick={() => setSearchOpen(true)}
                            >
                                <img
                                    className={`size-5 transition-all duration-[0.5s] ${scrolled ? "" : "grayscale invert"
                                        }`}
                                    src={iconsearch}
                                    alt="Search"
                                />
                            </div>
                        )}
                    </div>

                    <div className="right flex justify-end gap-6 items-center">
                        {user ? (
                            <>
                                <div className="group relative">
                                    <div className="group-hover:opacity-0 transition-all duration-300 relative h-[42px] w-[42px] rounded-full cursor-pointer">
                                        <img
                                            className="absolute w-[100%] h-[100%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            src={userInfor.sex === true ? avt_man : avt_woman}
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
                                                    src={userInfor.sex === true ? avt_man : avt_woman}
                                                    alt=""
                                                />
                                            </div>
                                            <h2 className="font-light text-[18px] font-['Lora'] text-black/50 mt-[5px]">
                                                Hi, {firstName}
                                            </h2>
                                        </div>

                                        {/* Menu */}
                                        <div className="relative px-8 mt-6 flex flex-col gap-2 text-left h-full">

                                            {user?.Roles?.[0]?.rolename === "admin" && (
                                                <Link to="/dashboard">
                                                    <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                        Dashboard
                                                        <i className="fa-solid fa-bars-progress text-[13px] pl-[5px]"></i>
                                                    </button>
                                                </Link>
                                            )}

                                            <Link to="/inforuser">
                                                <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                    Tài khoản
                                                    <i className="fa-solid fa-user text-[13px] pl-[5px]"></i>
                                                </button>
                                            </Link>

                                            <Link to="/add-product">
                                                <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                    Đăng bài viết
                                                    <i className="fa-solid fa-plus text-[13px] pl-[5px]"></i>
                                                </button>
                                            </Link>
                                            {/* DUYỆT SẢN PHẨM */}
                                            <Link to="/manage-requests">
                                                <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                    Duyệt Sản Phẩm
                                                    <i className="fa-solid fa-check-to-slot text-[12px] pl-[5px]"></i>
                                                </button>
                                            </Link>
                                            {/*Lịch Sử Nhận*/}
                                            <Link to="/history-received">
                                                <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                    Lịch sử Nhận
                                                    <i className="fa-solid fa-clock-rotate-left text-[5x] pl-[3px]"></i>
                                                </button>
                                            </Link>
                                            <Link to="/receive-products">
                                                <button className="hover:bg-main hover:text-white transition-all duration-300 rounded-lg w-full p-2 pl-4 flex items-center">
                                                    Đã duyệt 
                                                    <i className="fa-solid fa-box text-[13px] pl-[3px]"></i>
                                                </button>
                                            </Link>
                                            {/* Đăng xuất */}
                                            <button
                                                onClick={handleLogout}
                                                className="absolute bottom-[150px] left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-400 text-white transition-all duration-300 rounded-lg p-2 flex justify-center items-center mt-10 w-[160px] "
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
                                    <Link to="/signup" onClick={() => settologin(true)} className={`${scrolled ? "text-black" : "text-white"} hover:opacity-70`}>
                                        Đăng ký
                                    </Link>
                                    <span className={`${scrolled ? "text-[#00000050]" : "text-white/60"}`}>|</span>
                                    <Link to="/signup" onClick={() => settologin(false)} className={`${scrolled ? "text-black" : "text-white"} hover:opacity-70`}>
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
