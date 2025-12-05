import React, { useEffect, useState } from 'react'
import avt_man from "../G-Food-Images/avata_man.png"
import avt_woman from '../G-Food-Images/woman.png'
import { getUserById } from '../Services/authService'
import { Auth } from '../Utils/auth'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

export const Dashboard = () => {
    const user = Auth.getUser();
    const fullName = user?.username || "";
    const firstName = fullName ? fullName.split(" ").pop() : "";

    //avata theo sex
    const [userInfor, setUserinfor] = useState(true)
    const id = JSON.parse(localStorage.getItem("user"))?.id;
    useEffect(() => {
        if (!id) return;
        getUserById(id).then((data) => {
            setUserinfor(data.data);
        })
    })
    return (
        <div>
            <div className='w-full h-[78px] bg-[#0f3714]'></div>
            <div className='w-[1150px] mx-auto h-[600px] my-6 flex '>
                <div className='w-[250px] h-full  bg-[#4C7F31] text-black py-[12px] rounded-[10px] shadow-xl'>
                    <div className='w-[226px] h-full bg-white mx-auto rounded-[25px] rounded-tr-[80px] rounded-bl-[80px] px-[20px]'>
                        <h1 className='font-bold text-[#4C7F31] text-[22px] pl-6 pt-8'>Dashboard</h1>
                        <div className='mt-6 flex items bg-main/10 px-2 py-2 rounded-[10px]'>

                            <div className="relative w-[55px] rounded-full]">
                                <img
                                    className="absolute w-[45px]"
                                    src={userInfor.sex === true ? avt_man : avt_woman}
                                    alt=""
                                />
                            </div>
                            <div className='w-[70%]'>
                                <h2 className='font-nomal text-[14px] text-black/20 font-["roboto"]'>Admin</h2>
                                <h2 className="font-nomal text-[16px] font-['roboto'] text-black/70 font-semibold">
                                  {user?.username}
                                </h2>
                            </div>
                        </div>

                        <div className='font-["roboto"] w-full text-center mt-10 flex flex-col gap-3'>

                            <Link to="/dashboard/qluser" className='transition-all duration-300 w-full hover:bg-main/15 text-black/50 hover:text-[#4C7F31] py-2 rounded-[10px]'>
                                <div className=''>
                                    Quản lý người dùng
                                </div>
                            </Link>

                            <div className='w-[80px] mx-auto bg-black/10 h-[.5px]'></div>

                            <Link to="/dashboard/qluser" className='transition-all duration-300 w-full hover:bg-main/15 text-black/50 hover:text-[#4C7F31] py-2 rounded-[10px]'>
                                <div className=''>
                                    Quản lý danh mục
                                </div>
                            </Link>

                            <div className='w-[80px] mx-auto bg-black/10 h-[.5px]'></div>


                            <Link to="/dashboard/qluser" className='transition-all duration-300 w-full hover:bg-main/15 text-black/50 hover:text-[#4C7F31] py-2 rounded-[10px]'>
                                <div className=''>
                                    Quản lý sản phẩm
                                </div>
                            </Link>

                            <div className='w-[80px] mx-auto bg-black/10 h-[.5px]'></div>


                            <Link to="/dashboard/qluser" className='transition-all duration-300 w-full hover:bg-main/15 text-black/50 hover:text-[#4C7F31] py-2 rounded-[10px]'>
                                <div className=''>
                                    Quản lý thống kê
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>
                <div className='w-[900px]'>
                    <Outlet/>
                </div>
                
            </div>

        </div>
    )
}
