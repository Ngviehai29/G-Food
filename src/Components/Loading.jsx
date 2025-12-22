import React from "react";
import leaf from "../G-Food-Images/leaf.svg"

export const Loading = () => {
  return (
    <div className="fixed z-[100] w-full flex justify-center items-center h-screen bg-[#77777720]">
      <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-main"></div>
      <div to='/' className="absolute Logo text-[#97b545] font-bold text-[16px] font-['Dancing_Script'] pl-[6px]">
        G- <img className='absolute top-0 left-[0px] rotate-[-46deg] inline-block w-[10px]' src={leaf} alt="" /><span className={`transition-all duration-[0.5s]`}>Food</span>
      </div>
    </div>
  );
};
