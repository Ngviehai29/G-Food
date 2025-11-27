import React, { useState } from 'react'
import image1 from '../G-Food-Images/about-3-ver4-invert.svg'
import image2 from '../G-Food-Images/about-3-ver4-invert.svg'
import leaf from "../G-Food-Images/leaf.svg"
import { Link } from 'react-router-dom'
import { login } from '../Services/authService.js'
import { registerUser } from '../Services/authService.js'

export const SignUp = () => {
    const [tologin, settologin] = useState(true);
    const [sexPopup, setSexPopup] = useState("");
    const [openSex, setOpenSex] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [sex, setSex] = useState("");

    const [error, setError] = useState("");

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            alert("đăng nhập thành công");
            localStorage.setItem("token", data.token);
            console.log(data)
        } catch (err) {
            console.error(err);
            setError("Sai email hoặc mật khẩu");
        }
    }

    const handSubmitRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await registerUser(username, email, password, phone, location, sex);
            alert("đăng ký thành công");
            console.log(res);

        } catch (err) {
            setError("Đăng ký thát bại!");
        }
    }

    return (

        <div className='relative w-screen h-screen flex overflow-hidden transition-all duration-500'>
            <div className={`signin absolute top-0 left-0 w-screen h-screen transition-all duration-500  ${tologin ? "flex z-[1]" : "flex translate-x-[0%] opacity-0 z-[-1]"}`}>

                <div className='w-[50%] h-full px-[50px] mt-[90px]'>
                    <div className=' w-[400px] mx-auto h-full'>
                        <h1 className='text-[32px] font-bold text-main '>Đăng Ký</h1>
                        <div className='flex justify-between mt-10'>
                            <div className='flex flex-col gap-8'>
                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>User name</p>
                                    <input type="text" name="" id="" placeholder='Nhập họ và tên'
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Email</p>
                                    <input type="text" name="" id="" placeholder='Nhập địa chỉ email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Phone</p>
                                    <input type="text" name="" id="" placeholder='Số điện thoại liên lạc'
                                        onChange={(e) => setPhone(e.target.value)}
                                        className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>
                            </div>
                            <div className='flex flex-col gap-8'>
                                {/* <div className='relative'>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Sex</p>

                                    
                                    <div
                                        onClick={() => setOpenSex(!openSex)}
                                        
                                        className='mt-[0px] cursor-pointer text-[16px] placeholder:text-[14px] border-b-[1px] border-[#0000002f] py-2 w-full flex justify-between items-center'
                                    >
                                        <span onInput={(e) => setSex(e.target.value)} className={sexPopup ? "text-black" : "text-[#8e8e8e] text-[14px]"}>{sexPopup || "Nam / Nữ"}</span>
                                    </div>

                                    
                                    {openSex && (
                                        <div className='absolute left-0 right-0 bg-white shadow-lg rounded-md border mt-2 z-50'>
                                            <div onClick={() => { setOpenSex(false); }}
                                                className='fixed top-0 left-0 w-screen h-screen -z-40'></div>

                                            <div
                                                onClick={() => { setSexPopup("Nam"); setOpenSex(false); }}
                                                className='px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00000062] text-[14px]'
                                            >
                                                Nam
                                            </div>
                                            <div
                                                onClick={() => { setSexPopup("Nữ"); setOpenSex(false); }}
                                                className='px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00000062] text-[14px]'
                                            >
                                                Nữ
                                            </div>
                                        </div>
                                    )}
                                </div> */}
                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Sex</p>
                                    <input type="text" name="" id="" placeholder='Nam/Nữ'
                                        onChange={(e) => setSex(e.target.value)}
                                        className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>


                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Password</p>
                                    <input type="text" name="" id="" placeholder='8 -> 15 ký tự, 1, P, @,...'
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Location</p>
                                    <input type="text" name="" id="" placeholder='Vị trí nhận/gửi hàng'
                                        onChange={(e) => setLocation(e.target.value)}
                                        className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
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

                        {error && <p className="text-red-500">{error}</p>}
                        <div className='flex justify-between items-center'>
                            <button
                                onClick={handSubmitRegister}
                                className='bg-main text-white font-semibold px-12 py-2 rounded-[20px] mt-12'>Đăng Ký</button>
                            <button onClick={() => settologin(false)} className='text-[#00000080] font-nomal mt-12 inline-block items-center'>Đăng nhập<i class="fa-solid fa-arrow-right-long text-[10px] pl-1"></i></button>

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

            <div className={`Login absolute w-screen h-screen transition-all duration-500 ${tologin ? "translate-x-[100%] flex" : "flex"}`}>
                <div className='w-[50%] h-full overflow-hidden'>
                    <img className='w-full h-full object-cover object-[-17%_-60px] scale-[120%]' src={image2} alt="" />
                </div>
                <div className='w-[50%] h-full px-[50px]'>
                    <div className=' w-[300px] mx-auto mt-[120px]'>
                        <h1 className='text-[32px] font-bold text-main'>Đăng Nhập</h1>

                        <div className='mt-10 flex flex-col gap-8'>
                            <div>
                                <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Email</p>
                                <input type="text" name="" id="" placeholder='Nhập địa chỉ email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                            </div>

                            <div>
                                <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Password</p>
                                <input type="password" name="" id="" placeholder='Nhập mật khẩu'
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full' />
                            </div>

                        </div>


                        <div className='flex justify-between items-center text-[#00000081] mt-8'>
                            <div className='flex h-full items-center gap-1'>
                                <input type="checkbox" name="" id="" className='accent-black mt-[2px]' />
                                <p className='text-[14px]'>Lưu mật khẩu!</p>
                            </div>
                            <a href="#" className='text-[14px] text-main'>Quên mật khẩu?</a>
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <div className='flex justify-between items-center'>
                            <button className='bg-main text-white font-semibold px-10 py-2 rounded-[20px] mt-12'
                                onClick={handleSubmitLogin}>Đăng Nhập</button>
                            <button onClick={() => settologin(true)} className='text-[#00000080] font-nomal mt-12 inline-block items-center'>Đăng Ký<i class="fa-solid fa-reply text-[12px] pl-1 scale-y-[-1]"></i></button>
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
