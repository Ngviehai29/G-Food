import React from 'react'
import leaf from "../G-Food-Images/leaf.svg"
import grass01 from "../G-Food-Images/grass1.svg"
import { useEffect, useState } from "react";
import iconsearch from '../G-Food-Images/icon_search.svg'
import LogoAcc from '../G-Food-Images/Logo_Acc.svg'
import { Link, useLocation } from 'react-router-dom'
export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const location = useLocation();

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
            <div className={`container flex items-center justify-between mx-auto w-full h-full px-[50px] transition-all duration-500`}>
                <div className="left">
                    <Link to='/' className="Logo text-[#97b545] font-bold text-[32px] font-['Dancing_Script'] relative pl-[12px]">
                        G- <img className='absolute top-0 left-[0px] rotate-[-46deg] inline-block w-[20px]' src={leaf} alt="" /><span className={`transition-all duration-[0.5s] ${scrolled ? "text-black" : "text-white"}`}>Food</span>
                    </Link>
                </div>

                <div className="center">
                    <ul className={`flex gap-6 text-[16px] font-bold ${scrolled ? "" : "text-white"}`}>
                        <li><Link to="/" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/' ? "!text-main border-main" : "border-[#fff0]"}`}>Home</Link></li>

                        <li><Link to="/about" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/about' ? "!text-main border-main" : "border-[#fff0]"}`}>About Us</Link></li>

                        <li><a href="/pages" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/pages' ? "!text-main border-main" : "border-[#fff0]"}`}>Pages</a></li>

                        <li><a href="/service" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/service' ? "!text-main border-main" : "border-[#fff0]"}`}>Service</a></li>

                        <li><a href="/blog" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/blog' ? "!text-main border-main" : "border-[#fff0]"}`}>Blog</a></li>

                        <li><a href="/contact" className={`transition-all duration-300 ${scrolled ? "text-[#000000db] hover:text-[#0000008b]" : "hover:text-[#ffffffa6]"}
                            ${location.pathname === '/contact' ? "!text-main border-main" : "border-[#fff0]"}`}>Contact</a></li>
                    </ul>
                </div>

                <div className="right flex gap-6 items-center">
                    <div className="Icon_search cursor-pointer">
                        <img className={`size-5 transition-all duration-[0.5s] ${scrolled ? "" : "grayscale invert"}`} src={iconsearch} alt="" />
                    </div>
                    <div className="relative Logo_Acc bg-main h-[42px] w-[42px] rounded-[50%] flex items-center cursor-pointer">
                        <img class='absolute grayscale invert size-5 left-[50%] translate-x-[-50%]' src={LogoAcc} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}