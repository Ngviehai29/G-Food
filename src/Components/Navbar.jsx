import React from 'react'
import leaf from "../G-Food-Images/leaf.svg"
import grass01 from "../G-Food-Images/grass1.svg"
import { useEffect, useState } from "react";
import iconsearch from '../G-Food-Images/icon_search.svg'
import LogoAcc from '../G-Food-Images/Logo_Acc.svg'
import { Link, useLocation } from 'react-router-dom'
import { Auth } from '../Utils/auth';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ settologin }) => {

    const navigator = useNavigate();
    const handleLogout = async () => {
        Auth.logout();
        navigator("/");
    }

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const location = useLocation();

    const user = Auth.getUser();
    const fullName = user?.username || "";
    const firstName = fullName ? fullName.split(" ").pop() : "";

    return (
        <div className={`fixed z-[99] w-[100%] transition-all duration-500 [0_6px_20px_rgba(0,0,0,0.15)] ${scrolled ? "h-[70px] bg-[#ffffffec]" : "h-[85px] bg-[#ffffff00]"}`}>
            <div className='flex absolute top-[-5px] h-[12px] rotate-[-180deg]'>
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
                <img src={grass01} alt="" />
            </div>
            <div className={`items-center flex justify-between mx-auto w-full h-full px-[50px] transition-all duration-500`}>
                <div className="w-[30%]">
                    <Link to='/' className="Logo text-[#97b545] font-bold text-[32px] font-['Dancing_Script'] relative pl-[12px]">
                        G- <img className='absolute top-0 left-[0px] rotate-[-46deg] inline-block w-[20px]' src={leaf} alt="" /><span className={`transition-all duration-[0.5s] ${scrolled ? "text-black" : "text-white"}`}>Food</span>
                    </Link>
                </div>

                <div className="w-[40%]">
                    <ul className={`flex justify-center gap-6 text-[16px] font-bold ${scrolled ? "" : "text-white"}`}>
                        <li><Link to="/" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/' ? "!text-main border-main" : "border-[#fff0]"}`}>Home</Link></li>

                        <li><Link to="/about" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/about' ? "!text-main border-main" : "border-[#fff0]"}`}>About</Link></li>

                        <li><Link to="/pages" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/pages' ? "!text-main border-main" : "border-[#fff0]"}`}>Pages</Link></li>

                        <li><Link to="/service" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/service' ? "!text-main border-main" : "border-[#fff0]"}`}>Service</Link></li>

                        <li><Link to="/blog" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/blog' ? "!text-main border-main" : "border-[#fff0]"}`}>Blog</Link></li>

                        <li><Link to="/contact" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/contact' ? "!text-main border-main" : "border-[#fff0]"}`}>Contact</Link></li>
                    </ul>
                </div>

                <div className="right flex justify-end gap-6 items-center w-[30%]">
                    <img className={`size-5 transition-all duration-[0.5s] ${scrolled ? "" : "grayscale invert"}`} src={iconsearch} alt="" />
                    {user ? (
                        <>
                            <div className='group'>
                                <Link to="#" >
                                    <div className="group-hover:opacity-0 transition-all duration-300 relative Logo_Acc bg-main h-[42px] w-[42px] rounded-[50%] flex items-center cursor-pointer">
                                        <img class='absolute grayscale invert size-5 left-[50%] translate-x-[-50%]' src={LogoAcc} alt="" />
                                    </div>

                                </Link>
                                <div className='fixed transition-all duration-300 translate-x-[100%] group-hover:translate-x-[0] right-0 top-0 w-[220px] bg-[#ffffffec] h-full pt-8 text-center'>
                                    <div className=''>
                                        <div className="transition-all duration-300 relative Logo_Acc bg-main h-[42px] w-[42px] rounded-[50%] flex items-center cursor-pointer mt-2 left-[50%] translate-x-[-50%]">
                                            <img class='absolute grayscale invert size-5 left-[50%] translate-x-[-50%] ml-[.5px]' src={LogoAcc} alt="" />
                                        </div>
                                        <h2 className='font-semibold text-[26px] font-["Dancing_Script"] text-main mt-1'><span className=''>Hello, </span> {firstName}</h2>
                                    </div>

                                    <div className='px-8 flex flex-col gap-1 mt-4'>
                                        {user?.Roles?.[0]?.rolename === "admin" &&
                                            <div>
                                                <div className=''>
                                                    <button className='hover:bg-[#000000c7] hover:text-white transition-all duration-300 rounded-lg text-[#000000c7] w-full flex justify-center items-center p-2'>Dashboard<i class="fa-solid fa-bars-progress text-[13px] pl-[5px] pt-[2px]"></i></button>
                                                </div>
                                            </div>
                                        }

                                        <div className='mt-0'>
                                            <button className='hover:bg-[#000000c7] hover:text-white transition-all duration-300 rounded-lg text-[#000000c7] w-full flex justify-center items-center p-2'>Tài khoản<i class="fa-solid fa-user text-[13px] pl-[5px] pt-[2px]"></i></button>
                                        </div>

                                        <div className='mt-0'>
                                            <button className='hover:bg-[#000000c7] hover:text-white transition-all duration-300 rounded-lg text-[#000000c7] w-full flex justify-center items-center p-2'>Đăng bài viết<i class="fa-solid fa-plus text-[13px] pl-[5px] pt-[2px]"></i></button>
                                        </div>

                                        <div className='mt-0'>
                                            <button onClick={handleLogout} className='hover:bg-red-500 hover:text-white transition-all duration-300 rounded-lg text-red-500 w-full flex justify-center items-center p-2'>Đăng xuất<i class="fa-solid fa-arrow-right-from-bracket text-[13px] pl-[5px] pt-[2px]"></i></button>
                                        </div>
                                    </div>
                                </div>

                            </div>


                        </>
                    ) : (
                        <>
                            <div className={` flex gap-2 font-[roboto] text-[14px]`}>
                                <Link to="/signup" onClick={() => settologin(true)} className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "text-white hover:text-[#ffffffa6]"}`}>Đăng ký</Link>
                                <p className={`transition-all duration-300 ${scrolled ? "text-[#00000050]" : "text-[#ffffff82]"}`}>|</p>
                                <Link to="/signup" onClick={() => settologin(false)} className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "text-white hover:text-[#ffffffa6]"}`}>Đăng nhập</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}