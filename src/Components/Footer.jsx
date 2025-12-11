import React from 'react'
import flower from '../G-Food-Images/tree-01.svg';
import blog_1 from '../G-Food-Images/treemvungcao.jpg'
import blog_2 from '../G-Food-Images/treemvungcao.webp'
import grass from '../G-Food-Images/grass_footer.svg'
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <div>
            <div className='bg-[#0f3714] '>
                <div className='w-[1150px] mx-auto flex justify-between pt-2 pb-6'>
                    <div className='w-[250px] my-8'>
                        <div className='flex items-center gap-2'>
                            <img src={flower} alt="" className='w-[25px]' />
                            <h1 className='text-[32px] text-white font-bold'>Green Food</h1>
                        </div>
                        <p className='text-white opacity-[70%] font-[roboto] font-extralight text-[14px] leading-[24px] mt-4'>Chia sẻ hôm nay để ngày mai xanh hơn – nơi mỗi phần thực phẩm dư thừa không chỉ được tiếp tục hành trình của nó, mà còn trở thành nguồn hy vọng cho những người đang đối mặt với đói nghèo và thiếu thốn.</p>
                        <div className='flex gap-3 mt-4'>
                            <div className='w-[40px] h-[40px] bg-[#ffffff32] rounded-[50%] flex justify-center text-center items-center hover:bg-main transition-all duration-300 cursor-pointer'>
                                <i class="fa-brands fa-facebook-f text-[14px] text-white"></i>
                            </div>

                            <div className='w-[40px] h-[40px] bg-[#ffffff32] rounded-[50%] flex justify-center text-center items-center hover:bg-main transition-all duration-300 cursor-pointer'>
                                <i class="fa-brands fa-twitter text-[14px] text-white"></i>
                            </div>

                            <div className='w-[40px] h-[40px] bg-[#ffffff32] rounded-[50%] flex justify-center text-center items-center hover:bg-main transition-all duration-300 cursor-pointer'>
                                <i class="fa-brands fa-instagram text-[14px] text-white"></i>
                            </div>

                            <div className='w-[40px] h-[40px] bg-[#ffffff32] rounded-[50%] flex justify-center text-center items-center hover:bg-main transition-all duration-300 cursor-pointer'>
                                <i class="fa-brands fa-tiktok text-[14px] text-white"></i>
                            </div>
                        </div>
                    </div>

                    <div className='w-[250px] my-8'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-[23px] text-white font-bold'>Our Services</h1>
                        </div>
                        <div className='w-8 h-[2px] bg-main my-6'></div>
                        <div className='flex flex-col gap-2 font-light'>
                            <Link to="/add-product" className='flex gap-1 items-center cursor-pointer'>
                                <i class="fa-solid fa-angle-right text-[#DDB01B] inline text-[10px] mt-[2px]"></i>
                                <p className='text-white opacity-90 text-[14px] flex justify-center hover:opacity-60 transition-all duration-300'>Đăng bài viết +</p>
                            </Link>           
                        </div>
                    </div>

                    <div className='w-[250px] my-8'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-[23px] text-white font-bold'>Our Contact</h1>
                        </div>
                        <div className='w-8 h-[2px] bg-main my-6'></div>
                        <div className='flex flex-col gap-4'>
                            <div className='font-light'>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-[35px] h-[35px] bg-[#DDB01B] rounded-[50%] flex justify-center items-center hover:bg-[#ffffff32] transition-all duration-300'>
                                        <i class="fa-solid fa-location-dot text-[14px] text-white"></i>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-col hover:opacity-60 transition-all duration-300'>
                                            <p className='text-white opacity-90 text-[14px] flex justify-center '>122 Hoàng Minh Thảo</p>
                                            <p className='text-white opacity-90 text-[14px] flex justify-left'>Liên Chiểu, Đà Nẵng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='font-light'>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-[35px] h-[35px] bg-[#DDB01B] rounded-[50%] flex justify-center items-center hover:bg-[#ffffff32] transition-all duration-300'>
                                        <i class="fa-regular fa-clock text-[14px] text-white"></i>
                                    </div>
                                    <div className='flex flex-col hover:opacity-60 transition-all duration-300'>
                                        <p className='text-white opacity-90 text-[14px] flex justify-center '>Mon - Fri: 9:00am - 7:00pm</p>
                                        <p className='text-white opacity-90 text-[14px] flex justify-left'>Closed on Weekends</p>
                                    </div>
                                </div>
                            </div>

                            <div className='font-light'>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-[35px] h-[35px] bg-[#DDB01B] rounded-[50%] flex justify-center items-center hover:bg-[#ffffff32] transition-all duration-300'>
                                        <i class="fa-regular fa-envelope text-[14px] text-white"></i>
                                    </div>
                                    <div className='flex flex-col hover:opacity-60 transition-all duration-300'>
                                        <p className='text-white opacity-90 text-[14px] flex justify-center '>gcontact@gmail.com</p>
                                        <p className='text-white opacity-90 text-[14px] flex justify-left'>gsuport@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-[250px] my-8'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-[23px] text-white font-bold'>Latest Blog Posts</h1>
                        </div>
                        <div className='w-8 h-[2px] bg-main my-6'></div>
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center gap-3'>
                                <img src={blog_1} alt="" className='w-[40%] h-[65px] object-cover rounded-[10px]' />
                                <div className='text-white flex flex-col gap-1'>
                                    <h5 className='font-bold leading-[20px]'>Nấu cho em ăn - Đen</h5>
                                    <p className='text-[12px] flex gap-[3px] items-center text-[#ffffff9e]'><i class="fa-solid fa-clock text-[12px] mt-[1px] text-[#DDB01B]"></i>13 tháng 5, 2023</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3'>
                                <img src={blog_2} alt="" className='w-[40%] h-[65px] object-cover rounded-[10px]' />
                                <div className='text-white flex flex-col gap-1'>
                                    <h5 className='font-bold leading-[20px]'>Miền viễn biên Tây Bắc</h5>
                                    <p className='text-[12px] flex gap-[3px] items-center text-[#ffffff9e]'><i class="fa-solid fa-clock text-[12px] mt-[1px] text-[#DDB01B]"></i>1 tháng 7, 2021</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className='relative'>
                    <p className='w-full text-center py-3 bg-[#1d5823] text-[#ffffffd1] text-[12px] font-["roboto"]'>© 2025 Green Food. All rights reserved.</p>
                    <img src={grass} alt="" className='absolute top-[-120%]'/>
                </div>
            </div>
        </div>
    )
}
