import React, { useState } from 'react'
import data_blog from '../Data/Blog.json'
import { useScrollAnimation } from '../Components/useScrollAnimation';
import slide from '../G-Food-Images/blog-1.jpg'
import { Card_Blog_Slide } from '../Components/Card_Blog_Slide';


export const Blog = () => {
    const intro = useScrollAnimation();
    const largeItem = data_blog.find(item => item.type === "large");
    const smallItem = data_blog.slice(1, 4);
    const [SelectedBlog, setSelectedBlog] = useState(null);

    return (
        <div>
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
                    <h1 className='text-[48px] text-white font-bold'>Blog & News</h1>

                    {/* <h4 className='text-[#ffffff] text-xl font-nomal tracking-[0px] -mt-2 ml-[98px]'>for green life!</h4> */}
                    <h4 className='text-[#ffffffd4] text-2xl italic font-["Cormorant"] tracking-[0px] mt-4 w-[450px]'>Phổ cập tri thức về quản lý thực phẩm bền vững thông qua các bài phân tích chuyên sâu, từ cơ sở khoa học đến ứng dụng thực tiễn của AI và bản đồ gợi ý vị trí!</h4>
                    <button className='bg-main text-[#ffffff] px-4 py-2 items-center font-normal text-[18px] rounded-lg mt-8 cursor-pointer animate-bounce'>Read More<i class="fa-solid fa-angle-right text-[16px]"></i></button>
                </div>

            </div>
            <div>
                <Card_Blog_Slide/>
            </div>

        </div>
    )
}
