import React, { useState } from 'react'
import image1 from '../G-Food-Images/about-3-ver2-invert.svg'
import image2 from '../G-Food-Images/about-3-ver2-invert.svg'
import leaf from "../G-Food-Images/leaf.svg"
import { Link } from 'react-router-dom'

export const SignUp = () => {
    const [login, setlogin] = useState(true)
    return (

        <div className='relative w-screen h-screen flex overflow-hidden transition-all duration-500'>
            <div className={`signin absolute top-0 left-0 w-screen h-screen transition-all duration-500  ${login ? "flex z-[1]" : "flex translate-x-[0%] opacity-0 z-[-1]"}`}>

                <div className='w-[50%] h-full px-[50px] mt-[90px]'>
                    <div className=' w-[400px] mx-auto h-full'>
                        <h1 className='text-[32px] font-bold text-main '>Đăng Ký</h1>
                        <div className='flex justify-between mt-10'>
                            <div className='flex flex-col gap-8'>
                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>User name</p>
                                    <input type="text" name="" id="" placeholder='Nhập họ và tên' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Email</p>
                                    <input type="text" name="" id="" placeholder='Nhập địa chỉ email' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Phone</p>
                                    <input type="text" name="" id="" placeholder='Số điện thoại liên lạc' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>
                            </div>
                            <div className='flex flex-col gap-8'>
                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Sex</p>
                                    <input type="password" name="" id="" placeholder='Nam, Nữ, Khác...' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Password</p>
                                    <input type="text" name="" id="" placeholder='8 -> 15 ký tự, 1, P, @,...' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>location</p>
                                    <input type="text" name="" id="" placeholder='Vị trí nhận/gửi hàng' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between items-center text-[#00000081] mt-8'>
                            <div className='flex h-full items-center gap-1'>
                                <input type="checkbox" name="" id="" className='accent-black mt-[2px]' />
                                <p className='text-[14px]'>Đồng ý với các điều khoảng của chúng tôi!</p>
                            </div>
                            <a href="#" className='text-[14px] text-main'>Điều khoản?</a>
                        </div>

                        <div className='flex justify-between items-center'>
                            <button className='bg-main text-white font-semibold px-12 py-2 rounded-[20px] mt-12'>Đăng Ký</button>
                            <button onClick={() => setlogin(false)} className='text-[#00000080] font-nomal mt-12 inline-block items-center'>Đăng nhập<i class="fa-solid fa-arrow-right-long text-[10px] pl-1"></i></button>

                        </div>
                        <Link to='/' className="text-[#00000080] text-[14px] font-nomal inline-block text-center w-full mt-8">
                            Tiếp tục với Green Food.
                        </Link>
                    </div>
                </div>
                <div className={`w-[50%] h-full overflow-hidden`}>
                    <img className='w-full h-full object-cover object-[-17%_-60px] scale-[120%] scale-x-[-1.2]' src={image2} alt="" />

                </div>
            </div>

            <div className={`Login absolute w-screen h-screen transition-all duration-500 ${login ? "translate-x-[100%] flex" : "flex"}`}>
                <div className='w-[50%] h-full overflow-hidden'>
                    <img className='w-full h-full object-cover object-[-17%_-60px] scale-[120%]' src={image2} alt="" />
                </div>
                <div className='w-[50%] h-full px-[50px]'>
                    <div className=' w-[300px] mx-auto mt-[120px]'>
                        <h1 className='text-[32px] font-bold text-main'>Đăng Nhập</h1>

                        <div className='mt-10 flex flex-col gap-8'>
                            <div>
                                <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>User name</p>
                                <input type="text" name="" id="" placeholder='Nhập họ và tên' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                            </div>

                            <div>
                                <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Password</p>
                                <input type="text" name="" id="" placeholder='Nhập địa chỉ email' className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                            </div>

                        </div>


                        <div className='flex justify-between items-center text-[#00000081] mt-8'>
                            <div className='flex h-full items-center gap-1'>
                                <input type="checkbox" name="" id="" className='accent-black mt-[2px]' />
                                <p className='text-[14px]'>Lưu mật khẩu!</p>
                            </div>
                            <a href="#" className='text-[14px] text-main'>Quên mật khẩu?</a>
                        </div>

                        <div className='flex justify-between items-center'>
                            <button className='bg-main text-white font-semibold px-10 py-2 rounded-[20px] mt-12'>Đăng Nhập</button>
                            <button onClick={() => setlogin(true)} className='text-[#00000080] font-nomal mt-12 inline-block items-center'>Đăng Ký<i class="fa-solid fa-reply text-[12px] pl-1 scale-y-[-1]"></i></button>
                        </div>
                        <Link to='/' className="text-[#00000080] text-[14px] font-nomal inline-block text-center w-full mt-8">
                            Tiếp tục với Green Food.
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
