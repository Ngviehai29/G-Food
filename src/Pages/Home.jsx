import React from "react";
import { useEffect, useRef, useState } from "react";
import slide from "../G-Food-Images/slide-04.jpg";
import slogan from "../G-Food-Images/slogan.svg";
import grass01 from "../G-Food-Images/grass1.svg";
import grass02 from "../G-Food-Images/grass02.svg";
import tree from "../G-Food-Images/tree-01.svg";
import { Card_Product } from "../Components/Card_Product";
import { Link } from "react-router-dom";
import { Card_Blog_Slide } from "../Components/Card_Blog_Slide";

export const Home = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.2 } // 20% element xuất hiện thì kích hoạt
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // THÊM: Xử lý khi vào Home từ search
    useEffect(() => {
        // Kiểm tra nếu có productId trong sessionStorage
        const scrollProductId = sessionStorage.getItem("scrollToProductId");
        const scrollTimestamp = sessionStorage.getItem("scrollTimestamp");
        const productName = sessionStorage.getItem("searchProductName");
        if (scrollProductId && scrollTimestamp) {
            const timeDiff = Date.now() - parseInt(scrollTimestamp);

            // Nếu dữ liệu còn mới (trong vòng 5 giây)
            if (timeDiff < 5000) {
                console.log(
                    "🏠 Home page detected search product, triggering scroll..."
                );
                // Đợi một chút rồi gửi event
                setTimeout(() => {
                    window.dispatchEvent(
                        new CustomEvent("scrollToProductFromSearch", {
                            detail: {
                                productId: scrollProductId,
                                productName: productName || "Sản phẩm", // THÊM productName
                                timestamp: Date.now(),
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
    }, []);

    return (
        <div className="inline w-screen transition-all duration-1500">
            <div className="slide relative z-[0] overflow-hidden">
                <img
                    src={slide}
                    alt=""
                    className="top-0 object-cover w-screen h-screen object-[0%_40%]"
                />
                {/* <div className="bg-drak w-[100%] h-screen bg-black absolute top-0 opacity-15 z-[1]"></div> */}
                <img
                    src={slogan}
                    alt=""
                    ref={ref}
                    className={`slogan absolute top-[50%] left-[50%] w-[1000px] translate-y-[-42%] translate-x-[-25%] z-[2] brightness-[125%] duration-[1s] transition-all ${visible ? "opacity-100" : "opacity-0"
                        }`}
                />

                <div className="flex absolute bottom-[-1px] h-[12px]">
                    <img src={grass01} alt="" />
                    <img src={grass01} alt="" />
                    <img src={grass01} alt="" />
                    <img src={grass01} alt="" />
                    <img src={grass01} alt="" />
                    <img src={grass01} alt="" />
                    <img src={grass01} alt="" />
                </div>
                <div
                    ref={ref}
                    className={`transition-all duration-[1s] content absolute z-[3] top-[50%] left-[50%] translate-x-[-105%] ${visible
                        ? "opacity-100 translate-y-[-50%]"
                        : "opacity-0 translate-y-[-20%]"
                        }`}
                >
                    {/* <div className="content absolute top-[50%] left-[35%] translate-x-[-50%] translate-y-[-50%]"> */}
                    <h1 className="text-[48px] text-white font-bold">
                        Green Food
                    </h1>
                    <h4 className="text-[#ffffff] text-xl font-nomal tracking-[0px] -mt-2 ml-[140px]">
                        for green life!
                    </h4>
                    <h4 className='text-[#ffffffd4] text-2xl italic font-["Cormorant"] tracking-[3px] mt-4'>
                        Thực phẩm xanh cho cuộc sống xanh!
                    </h4>
                    <Link
                        to={"/about"}
                        className={`inline-block bg-main text-[#ffffff] px-4 py-2 items-center font-nomal text-[18px] rounded-lg mt-8 linear cursor-pointer animate-bounce`}
                    >
                        Read More
                        <i class="fa-solid fa-angle-right text-[16px]"></i>
                    </Link>
                </div>
            </div>

            {/* Message */}
            <div className="bg-gradient-to-b from-[#e2e7d6] to-white w-full">
                <img src={tree} alt="" className="w-[30px] mx-auto pt-[30px]" />
                <p className='w-[850px] mx-auto font-["Dancing_Script"] text-center text-[22px] text-[#0f3714] pt-[20px] pb-[50px]'>
                    <span className="text-main">Green Food</span> tin rằng mỗi
                    phần lương thực dư thừa đều mang trong mình một cơ hội được
                    sẻ chia — cơ hội để bạn giúp đỡ cộng đồng, giảm lãng phí và
                    góp phần xây dựng một tương lai xanh hơn.
                </p>
            </div>

            {/* filter */}
            <div></div>

            {/* List Product */}
            <div className="bg-white">
                <h1 className="text-center text-[40px] font-[roboto] font-bold pt-8">
                    <span className="text-main">Our</span> Products
                </h1>
                <div className="w-14 bg-main h-[2px] mx-auto my-2"></div>
                <p className="mx-auto text-center text-[16px] font-[roboto] font-light max-w-[500px] text-xamden py-4 mb-6">
                    Chia sẻ sản phẩm để cùng lan tỏa những giá trị nhỏ bé nhưng
                    đầy ý nghĩa cho cộng đồng.
                </p>
                <div className="bg-white m-auto w-[1150px] h-[800px]">
                    <Card_Product />
                </div>
            </div>

            {/* Blog */}
            <div className="mt-8 bg-[#F2F4F7] py-1">
                <Card_Blog_Slide />
            </div>

            {/* Map */}
            <div className="w-full h-[350px] border-t-2 border-[#0F3714]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30673.68967742132!2d108.16083767438057!3d16.054525970061682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421938d61a3ce5%3A0x29d80f3ebbdcb44a!2zxJDhuqFpIEjhu41jIER1eSBUw6JuIEjDsmEgS2jDoW5oIE5hbQ!5e0!3m2!1svi!2s!4v1765554961910!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

        </div>
    );
};
