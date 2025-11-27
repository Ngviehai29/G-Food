import React from 'react'
import { useEffect, useRef, useState } from "react";
import slide from '../G-Food-Images/slide-04.jpg'
import slogan from '../G-Food-Images/slogan.svg'
import grass01 from "../G-Food-Images/grass1.svg"
import grass02 from "../G-Food-Images/grass02.svg"
import tree from "../G-Food-Images/tree-01.svg"
import { Card_Product } from '../Components/Card_Product';
import { Link } from 'react-router-dom';

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

  return (
    <div className='inline w-screen transition-all duration-1500'>
      <div className="slide relative z-[0] overflow-hidden">
        <img src={slide} alt="" className='top-0 object-cover w-screen h-screen object-[0%_40%]' />
        {/* <div className="bg-drak w-[100%] h-screen bg-black absolute top-0 opacity-15 z-[1]"></div> */}
        <img src={slogan} alt="" ref={ref} className={`slogan absolute top-[50%] left-[50%] w-[1000px] translate-y-[-42%] translate-x-[-25%] z-[2] brightness-[125%] duration-[1s] transition-all ${visible ? "opacity-100" : "opacity-0"}`} />

        <div className='flex absolute bottom-[-1px] h-[12px]'>
          <img src={grass01} alt=""/>
          <img src={grass01} alt=""/>
          <img src={grass01} alt=""/>
          <img src={grass01} alt=""/>
          <img src={grass01} alt=""/>
          <img src={grass01} alt=""/>
          <img src={grass01} alt=""/>
        </div>

        {/* <div className='flex absolute bottom-[-1px] h-[45px] '>
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
          <img src={grass02} alt="" />
        </div> */}


        <div
          ref={ref}
          className={`transition-all duration-[1s] content absolute z-[3] top-[50%] left-[50%] translate-x-[-105%] ${visible ? "opacity-100 translate-y-[-50%]" : "opacity-0 translate-y-[-20%]"
            }`}
        >
          {/* <div className="content absolute top-[50%] left-[35%] translate-x-[-50%] translate-y-[-50%]"> */}
          <h1 className='text-[48px] text-white font-bold'>Green Food</h1>
          <h4 className='text-[#ffffff] text-xl font-nomal tracking-[0px] -mt-2 ml-[140px]'>for green life!</h4>
          <h4 className='text-[#ffffffd4] text-2xl italic font-["Cormorant"] tracking-[3px] mt-4'>Thực phẩm xanh cho cuộc sống xanh!</h4>
          <Link to={'/about'} className={`inline-block bg-main text-[#ffffff] px-4 py-2 items-center font-nomal text-[18px] rounded-lg mt-8 linear cursor-pointer animate-bounce`}>Read More<i class="fa-solid fa-angle-right text-[16px]"></i></Link>
        </div>
      </div>

      {/* Message */}
      <div className='bg-gradient-to-b from-[#e2e7d6] to-bg w-full'>
        <img src={tree} alt="" className='w-[30px] mx-auto pt-[30px]'/>
        <p className='w-[850px] mx-auto font-["Dancing_Script"] text-center text-[22px] text-[#0f3714] pt-[20px] pb-[50px]'><span className='text-main'>Green Food</span> tin rằng mỗi phần lương thực dư thừa đều mang trong mình một cơ hội được sẻ chia — cơ hội để bạn giúp đỡ cộng đồng, giảm lãng phí và góp phần xây dựng một tương lai xanh hơn.</p>
      </div>

      {/* filter */}
      <div>

      </div>

      {/* List Product */}
      <div className='bg-[#F2F4F7]'>
        <div className="bg-[#F2F4F7] m-auto w-[1150px] h-[1000px]">
          <Card_Product />
        </div>
      </div>
    </div>
  )
}
