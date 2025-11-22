import React from 'react'
import map from '../G-Food-Images/google-maps.png'
import data_product from '../Data/Product.json'

export const Card_Product = () => {

  return (
    <div className='grid grid-cols-4'>
      {
        data_product.map(u => (
          <div className='group transition-all w-[260px] h-[395px] relative bg-white overflow-hidden font-["Lora"] rounded-[5px] mt-6 mx-auto'>
            <div className='w-full relative h-[200px] overflow-hidden'>
              <img key={u.id} className='group-hover:scale-110 transition-all duration-500 w-full h-full object-cover cursor-pointer' src={u.img} alt="" />
              <div className='absolute bottom-4 left-[50%] translate-x-[-50%] text-black bg-white font-light text-[14px] px-8 py-2 rounded-[20px] cursor-pointer transition-all duration-500 translate-y-[20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100'>Chi tiết</div>
            </div>
            <div className='flex items-center px-2 py-1 absolute top-[10px] left-[10px] bg-[#ffffff] rounded-[5px] text-[#323232]'>
              <img className='w-4 h-4' src={map} alt="" />
              <p className='pl-1 text-[13px]'> {u.location}</p>
            </div>
            <h2 className='font-semibold text-xl w-full text-center mt-4 cursor-pointer'>{u.name}</h2>
            <div className='absolute bottom-0 w-full flex justify-between border-t'>
              <button className='w-[50%] relative z-[1] py-2 border-r before:bg-yellow-500
                                before:h-full before:contents-[""] before:z-[-1] transition-all duration-500 before:transition-all before:duration-500 before:absolute before:left-[0] before:top-0 before:inline before:w-[0%] hover:before:w-[100%] hover:text-white'>Thêm vào giỏ</button>
              <button className='w-[50%] relative z-[1] h-full py-2 before:bg-main
                                before:h-full before:contents-[""] before:z-[-1] transition-all duration-500 before:transition-all before:duration-500 before:absolute before:left-[0] before:top-0 before:inline before:w-[0%] hover:before:w-[100%] hover:text-white'>Nhận ngay</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
