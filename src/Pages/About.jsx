import React from 'react'
import { useEffect, useRef, useState } from "react";
import {useScrollAnimation} from '../Components/useScrollAnimation';
import slide from '../G-Food-Images/lua-2.jpg'
import img_problem from '../G-Food-Images/treemvungcao.jpg'
import img_standard from '../G-Food-Images/treemvungcao.webp'
import img_solution from '../G-Food-Images/treemvungcao-3.webp'
// import lua from '../G-Food-Images/treemvungcao.jpg'
export const About = () => {
    const intro = useScrollAnimation();
    const problem = useScrollAnimation();
    const standard = useScrollAnimation();
    const solution = useScrollAnimation();

    return (
        <div className='inline w-screen transition-all duration-1500'>
            <div className="slide relative z-[0] overflow-hidden">
                <img src={slide} alt="" className='top-0 object-cover w-[100%] h-screen object-[0%_40%] animate-[animation_slide_1.2s_ease forwards]' />
                {/* <div className="bg-drak w-[100%] h-screen bg-black absolute top-0 opacity-15 z-[1]"></div> */}
                {/* <img src={slogan} alt="" ref={ref} className={`slogan absolute top-[50%] left-[50%] w-[1050px] translate-y-[-42%] translate-x-[-25%] z-[2] brightness-[125%] duration-[1s] transition-all ${visible ? "opacity-100" : "opacity-0"}`} /> */}

                <div
                    ref={intro.ref}
                    className={`transition-all duration-[1.3s] absolute z-[3] top-[50%] left-[50%] translate-x-[-105%] ${intro.visible ? "opacity-100 translate-y-[-50%]" : "opacity-0 translate-y-[-20%]"
                        }`}
                >
                    {/* <div className="content absolute top-[50%] left-[35%] translate-x-[-50%] translate-y-[-50%]"> */}
                    <h1 className='text-[48px] text-white font-bold'>About Us</h1>

                    {/* <h4 className='text-[#ffffff] text-xl font-nomal tracking-[0px] -mt-2 ml-[98px]'>for green life!</h4> */}
                    <h4 className='text-[#ffffffd4] text-2xl italic font-["Cormorant"] tracking-[0px] mt-4 w-[450px]'><span className=''>Green food</span> là nền tảng kết nối cộng đồng với mục tiêu chia sẻ thực phẩm sạch, an toàn và bền vững. Chúng tôi tin rằng mỗi bữa ăn xanh không chỉ tốt cho sức khỏe, mà còn góp phần giảm lãng phí và bảo vệ môi trường!</h4>
                    <button className='bg-main text-[#ffffff] px-4 py-2 items-center font-normal text-[18px] rounded-lg mt-8 cursor-pointer animate-bounce'>Read More<i class="fa-solid fa-angle-right text-[16px]"></i></button>
                </div>
            </div>
            <div>
                <div className={`w-full mt-16 bg-gradient-to-r from-[#F2F4F7] to-[#F2F4F7] pt-10 pb-16 `}>
                    <div ref={problem.ref} className={`transition-all duration-1000 ${problem.visible ? "opacity-100 translate-y-[0%]" : "opacity-0 translate-y-[20%]"}`}>
                        <h1 className='w-full text-center text-[40px] font-bold font-[roboto] mb-4'>THE PROBLEM</h1>
                        <div className='w-[1150px] mx-auto flex px-20 py-10 border-[1px] border-[#0000003e]'>
                            <img src={img_problem} alt="" className='w-[38%] h-[500px] object-cover object-[45%_0%]' />
                            <div className='pl-20 text-center mt-6'>
                                <h1 className='font-bold text-[45px] text-left font-["Amatic_SC"] leading-[50px]'>Khi Thiếu Thốn <span className='text-[30px]'>&</span><br /> Lãng Phí Cùng Tồn Tại</h1>
                                <p className='text-justify leading-7 text-[18px] text-xamden font-light font-["Roboto"] mt-6'><span className='text-red-600'>30%</span> trẻ em dưới <span className='text-red-600'>5</span> tuổi ở vùng cao Việt Nam bị suy dinh dưỡng, trong khi mỗi ngày tại các thành phố lớn lại có hàng tấn thực phẩm dư thừa bị bỏ đi. Sự chênh lệch ấy không chỉ phản ánh bất bình đẳng trong tiếp cận nguồn dinh dưỡng mà còn tạo nên gánh nặng môi trường khi lượng rác thải thực phẩm ngày càng tăng. Rất nhiều hộ gia đình, bếp ăn, cửa hàng thực phẩm có thể chia sẻ phần dư thừa ấy, nhưng sự thiếu kết nối khiến chúng không đến được với những người thật sự cần. Đây chính là lý do thôi thúc chúng tôi xây dựng một nền tảng chia sẻ thực phẩm xanh – nơi mọi người có thể cùng chung tay giảm lãng phí, hỗ trợ cộng đồng và góp phần tạo nên một tương lai bền vững hơn.</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='mt-16'>
                    <div className={`relative h-[260px] overflow-hidden`}>
                        <img src={img_standard} alt="" className='absolute h-[260px] w-full object-cover object-[0%_90%]' />
                        <div className='absolute w-full h-full bg-[#00000081]'></div>

                        <div className={`w-[1150px] y-full mx-auto absolute flex justify-between left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]`}>

                            <div ref={standard.ref} className={`w-[250px] h-[160px] flex flex-col justify-center border-[2px] border-white text-white text-center font-bold font-["Amatic_SC"] text-[30px] transition-all duration-1000 ${standard.visible ? " opacity-100 translate-y-[0%]" : " opacity-0 translate-y-[30%]"}`}>
                                <h1 className='inline-block'>GIẢM LÃNG PHÍ</h1>
                                <h1 className='inline-block'>TĂNG GIÁ TRỊ</h1>
                            </div>

                            <div ref={standard.ref} className={`w-[250px] h-[160px] flex flex-col justify-center border-[2px] border-white text-white text-center font-bold font-["Amatic_SC"] text-[30px] transition-all duration-1000 delay-100 ${standard.visible ? " opacity-100 translate-y-[0%]" : " opacity-0 translate-y-[30%]"}`}>
                                <h1 className='inline-block'>HỖ TRỢ ĐÚNG NGƯỜI</h1>
                                <h1 className='inline-block'>ĐÚNG THỜI ĐIỂM</h1>
                            </div>

                            <div ref={standard.ref} className={`w-[250px] h-[160px] flex flex-col justify-center border-[2px] border-white text-white text-center font-bold font-["Amatic_SC"] text-[30px] transition-all duration-1000 delay-200 ${standard.visible ? " opacity-100 translate-y-[0%]" : " opacity-0 translate-y-[30%]"}`}>
                                <h1 className='inline-block'>ĐƠN GIẢN</h1>
                                <h1 className='inline-block'>TIỆN LỢI</h1>
                                <h1 className='inline-block'>DỄ SỬ DỤNG</h1>
                            </div>

                            <div ref={standard.ref} className={`w-[250px] h-[160px] flex flex-col justify-center border-[2px] border-white text-white text-center font-bold font-["Amatic_SC"] text-[30px] transition-all duration-1000 delay-300 ${standard.visible ? " opacity-100 translate-y-[0%]" : " opacity-0 translate-y-[30%]"}`}>
                                <h1 className='inline-block'>LAN TỎA YÊU THƯƠNG</h1>
                                <h1 className='inline-block'>XÂY DỰNG CỘNG ĐỒNG XANH</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full mt-16 bg-[#F2F4F7] py-6'>
                    <div className='w-[1150px] mx-auto flex px-20 py-10 justify-between border-[#0000003e]'>
                        {/* <h1 className='absolute w-full text-[50px] font-bold font-[roboto] right-[48%] top-[-22%] tracking-[5px] rotate-[-90deg]'>THE PROBLEM</h1> */}

                        <div ref={solution.ref} className={`w-[60%] text-center relative transition-all duration-1000 ${solution.visible ? "translate-x-[0%] opacity-100" : "translate-x-[-50%] opacity-0"}`}>
                            <h1 className='absolute text-[30px] font-bold font-[roboto] left-[50%] top-[17%] translate-x-[-50%] translate-y-[-50%] tracking-[10px] leading-[82px] rotate-[0deg] text-[#dc26265f]  text-center z-[0]'><span className='text-[50px] text-[#DC2626] tracking-[15px]'>THE</span> <br />SOLUTION</h1>
                            <h1 className='font-bold text-[43px] font-["Amatic_SC"] leading-[50px] text-center mt-14 z-[1] '>Một Thế Giới Không Ai Bị Bỏ Đói</h1>
                            <p className='text-justify leading-7 text-[18px] text-xamden font-light font-["Roboto"] mt-8 '>Giải pháp của chúng tôi là xây dựng một nền tảng kết nối thông minh, nơi thực phẩm dư thừa có thể dễ dàng được chia sẻ đến đúng người đang cần. Ứng dụng Green Food cho phép người dùng đăng tải thực phẩm chỉ với một bức ảnh, sau đó hệ thống AI sẽ tự động nhận diện loại thực phẩm, gợi ý hạn sử dụng và tạo mô tả phù hợp. Công nghệ bản đồ được tích hợp giúp người nhận nhanh chóng tìm thấy nguồn thực phẩm gần nhất, tối ưu quãng đường di chuyển và tiết kiệm thời gian. Chúng tôi thiết kế quy trình trao – nhận đơn giản, minh bạch và an toàn, giúp mọi người có thể đóng góp chỉ trong vài giây. Bằng việc tạo ra mạng lưới chia sẻ xanh, Green Food không chỉ giảm lãng phí thực phẩm mà còn xây dựng cầu nối yêu thương giữa những người dư thừa và những người đang thiếu thốn trong cộng đồng.</p>

                        </div>

                        <img ref={solution.ref} src={img_solution} alt="" className={`w-[35%] h-[460px] object-cover object-[55%_0%] transition-all duration-1000 ${solution.visible ? "translate-x-[0%] opacity-100" : "translate-x-[50%] opacity-0"}`} />
                    </div>
                </div>

            </div>

            {/* <div className=" bg-[#F2F4F7] h-[1000px]">fdfdfdfdf</div> */}
        </div>
    )
}
