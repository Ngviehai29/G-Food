import React from 'react'
import { useEffect, useRef, useState } from "react";
import slide from '../G-Food-Images/slide-04.jpg'
import slogan from '../G-Food-Images/slogan.svg'
export const About = () => {
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

    return (
        <div className='inline w-screen'>
            <div className="slide relative z-[0] overflow-hidden">
                <img src={slide} alt="" className='top-0 object-cover w-[100%] h-screen object-[0%_10%] animate-[animation_slide_1.2s_ease forwards]' />
                {/* <div className="bg-drak w-[100%] h-screen bg-black absolute top-0 opacity-15 z-[1]"></div> */}
                <img src={slogan} alt="" ref={ref} className={`slogan absolute top-[50%] left-[50%] w-[1050px] translate-y-[-42%] translate-x-[-25%] z-[2] brightness-[125%] duration-[1s] transition-all ${visible ? "opacity-100" : "opacity-0"}`} />

                <div
                    ref={ref}
                    className={`transition-all duration-[1.3s] absolute z-[3] top-[50%] left-[50%] translate-x-[-105%] ${visible ? "opacity-100 translate-y-[-50%]" : "opacity-0 translate-y-[-20%]"
                        }`}
                >
                    {/* <div className="content absolute top-[50%] left-[35%] translate-x-[-50%] translate-y-[-50%]"> */}
                    <h1 className='text-[45px] text-white z-10 font-bold'>About Us</h1>
                    {/* <h4 className='text-[#ffffff] text-xl font-nomal tracking-[0px] -mt-2 ml-[98px]'>for green life!</h4> */}
                    <h4 className='text-[#ffffffd4] text-2xl italic font-["Cormorant"] tracking-[0px] mt-4 w-[450px]'><span className='text-main font-bold font-["Dancing_Script"] text-[30px]'>Green</span> food là nền tảng kết nối cộng đồng với mục tiêu chia sẻ thực phẩm sạch, an toàn và bền vững. Chúng tôi tin rằng mỗi bữa ăn xanh không chỉ tốt cho sức khỏe, mà còn góp phần giảm lãng phí và bảo vệ môi trường.!</h4>
                    <button className='bg-main text-[#e6e6e6] px-4 py-2 items-center font-normal text-[18px] rounded-lg mt-8 cursor-pointer animate-bounce'>Read More<i class="fa-solid fa-angle-right text-[16px]"></i></button>
                </div>
            </div>
            {/* <div className=" bg-[#F2F4F7] h-[1000px]">fdfdfdfdf</div> */}
        </div>
    )
}
