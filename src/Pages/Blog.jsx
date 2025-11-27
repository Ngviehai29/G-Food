import React, { useState } from 'react'
import data_blog from '../Data/Blog.json'
import { useScrollAnimation } from '../Components/useScrollAnimation';
import slide from '../G-Food-Images/blog-1.jpg'
import leaf from '../G-Food-Images/leaf.svg'

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
            <div className='w-[1150px] mx-auto bg-gradient-to-b from-[#E2DCD0] to-white rounded-[20px] my-14 py-14 px-[100px]'>
                <img src={leaf} alt="" className='mx-auto w-[20px]' />
                <h4 className='text-[#0f3714] text-center font-["Dancing_Script"] text-[20px]'>Our Blog & News</h4>
                <h1 className='text-center font-bold text-[#0A250E] text-[32px]'>Câu Chuyện Vùng Cao</h1>
                <p className='text-center font-light text-[12px]'>Những khoảnh khắc đời thường mang lại cảm xúc ấm áp và ý nghĩa.</p>
                <div className='mt-10 flex justify-between'>

                    <div className='group bg-white h-[485px] rounded-[20px] w-[48.5%] p-5 shadow-lg'>
                        <div className='relative h-[250px] rounded-[20px] overflow-hidden'>
                            <img onClick={() => setSelectedBlog(largeItem)} src={largeItem.img} alt="" className='group-hover:scale-[110%] transition-all duration-500 w-full h-full object-cover cursor-pointer' />
                            <div className='absolute bottom-0 left-0 flex bg-main text-white px-6 py-2 items-center gap-1 rounded-tr-[20px]'>
                                <i class="fa-solid fa-user text-[12px]"></i>
                                <p className='text-[14px] font-semibold'>By {largeItem.by}</p>
                            </div>

                            <div className='absolute right-5 bottom-5 flex bg-[#ffffff] text-main px-4 py-2 items-center gap-1 rounded-br-[20px] rounded-tl-[20px]'>
                                <p className='text-[12px] font-semibold'>{largeItem.date}</p>
                            </div>
                        </div>
                        <div className='h-[185px] flex flex-col justify-between'>
                            <div>
                                <h2 onClick={() => setSelectedBlog(largeItem)} className='text-[#0A250E] font-bold text-[20px] px-4 mt-4 hover:text-main cursor-pointer transition-all duration-300 line-clamp-2'>{largeItem.title}</h2>
                                <p className='text-[#0F3714] font-light text-[14px] px-4 mt-2 line-clamp-4'>{largeItem.describe}</p>
                            </div>
                            <div className='px-4 flex justify-between mt-4 items-center'>
                                <div className='text-main font-nomal'>-------------------------------------</div>
                                <div className='flex gap-2 items-center'>
                                    <div className='text-[#0A250E] text-[14px]'>Read More</div>
                                    <div onClick={() => setSelectedBlog(largeItem)} className='w-[30px] h-[30px] cursor-pointer bg-main hover:bg-[#0F3714] transition-all duration-300 flex justify-center items-center rounded-[50%]'><i class="fa-solid fa-arrow-right-long text-white text-[10px] pt-[2px] pr-[2px]"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='w-[48.5%] flex flex-col justify-between'>
                        {smallItem.map(item => (
                            <div key={item.id} className='group flex h-[145px] gap-0 items-center relative'>

                                <div className='w-[50%] h-full rounded-l-[20px] overflow-hidden'>
                                    <img onClick={() => setSelectedBlog(item)} src={item.img} alt=""
                                        className='group-hover:scale-[110%] transition-all duration-500 w-full h-full object-cover cursor-pointer'
                                    />
                                </div>

                                <div className='w-[55%] h-full bg-white shadow-lg border-[1px] border-l-0 border-main rounded-r-[20px] p-3 flex flex-col justify-between'>
                                    <p className='text-[12px] flex gap-[3px] items-center text-[#0f3714] opacity-75'>
                                        <i class="fa-solid fa-clock text-[12px] text-main"></i>{item.date}
                                    </p>

                                    <h2 onClick={() => setSelectedBlog(item)} className='font-bold leading-5 line-clamp-3 transition-all duration-300 hover:text-main cursor-pointer'>
                                        {item.title}:
                                        <br />{item.describe}
                                    </h2>

                                    <div className='flex text-[#0f3714] items-center gap-1'>
                                        <i class="fa-solid fa-user text-[12px]"></i>
                                        <p className='text-[14px] font-normal'>By {item.by}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {SelectedBlog && (
                <div
                    className="fixed inset-0 bg-black/50 flex justify-center items-center mt-16 z-50"
                    onClick={() => setSelectedBlog(null)}   // ← Click nền để tắt
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-[90%] max-w-[900px] relative"
                        onClick={(e) => e.stopPropagation()} // ← Chặn sự kiện lan ra ngoài
                    >
                        <button
                            className="absolute top-[10px] right-[10px] text-[12px] text-white bg-main w-[28px] h-[28px] rounded-[50%] items-center flex justify-center"
                            onClick={() => setSelectedBlog(null)}
                        >
                            ✕
                        </button>

                        <div className='flex w-[800px] h-[500px] justify-between'>
                            <img
                                src={SelectedBlog.img}
                                className="rounded-xl w-[48.5%] h-full object-cover"
                            />

                            <div className='w-[48.5%]'>
                                <h2 className="text-2xl font-bold mt-4">{SelectedBlog.title}</h2>
                                <p className="text-gray-600 mt-3">{SelectedBlog.describe}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
