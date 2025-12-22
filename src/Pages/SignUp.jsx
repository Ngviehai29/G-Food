import React, { useState } from 'react'
import image2 from '../G-Food-Images/about-3-ver4-invert.svg'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../Services/authService.js'
import { registerUser } from '../Services/authService.js'
import { useScrollAnimation } from '../Components/useScrollAnimation.js'
import { toast } from 'sonner'
import { Loading } from '../Components/Loading.jsx'

export const SignUp = ({ tologin, settologin }) => {
    const [sexPopup, setSexPopup] = useState("");
    const [openSex, setOpenSex] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [sex, setSex] = useState("");

    const [clause, setclause] = useState(false);

    const navigate = useNavigate();
    const anisignin = useScrollAnimation();
    const anilogin = useScrollAnimation();

    const [loading, setLoading] = useState(false);

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        if (email === "" && password === "") {
            return toast.error("Vui lòng nhập email và mật khẩu!");
        }
        if (email === "") {
            return toast.error("Vui lòng nhập email!")
        } else if (!email.endsWith("@gmail.com"))
            return toast.error("Email không hợp lệ!");
        if (password === "") {
            return toast.error("Vui lòng nhập mật khẩu!")
        }

        setLoading(true);
        try {
            const data = await login(email, password);
            toast.success("Đăng nhập thành công!");
            // localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.data));
            // console.log(data)
            navigate("/");
        } catch (err) {
            console.error(err);

            toast.error("Sai email hoặc mật khẩu!");

        } finally {
            setLoading(false);
        }
    }

    const handSubmitRegister = async (e) => {

        e.preventDefault();
        if (username === "") return toast.error("Username không được để trống!");
        if (username.length <= 1) return toast.error("Vui lòng nhập tên đầy đủ!");
        // test email
        if (email === "") {
            toast.error("Email không được để trống!")
        } else if (!email.endsWith("@gmail.com"))
            return toast.error("Email không hợp lệ!");
        //test password
        if (password === "") return toast.error("Mật khẩu không được để trống!");
        if (password.length < 6 || password.length > 18) {
            return toast.error("Mật khẩu phải từ 6 đến 18 ký tự!");
        }
        if (!/[A-Z]/.test(password)) {
            return toast.error("Mật khẩu phải chứa ít nhất 1 chữ hoa (A-Z)!");
        }
        if (!/[a-z]/.test(password)) {
            return toast.error("Mật khẩu phải chứa ít nhất 1 chữ thường (a-z)!");
        }
        if (!/[0-9]/.test(password)) {
            return toast.error("Mật khẩu phải chứa ít nhất 1 chữ số (0-9)!");
        }
        if (!/[@$!%*?&]/.test(password)) {
            return toast.error("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@, $, !, %, *, ?, &)");
        }
        if (password.length <= 5) return toast.error("Mật khẩu của bạn quá non!");
        if (phone === "") return toast.error("Số điện thoại không được để trống!");
        if (location === "") return toast.error("Vị trí không được để trống!");
        if (location.length <= 2) return toast.error("Vui lòng nhập địa chỉ cụ thể!");
        if (sex === "") return toast.error("Giới tính không được để trống!");
        if (!clause) return toast.error("Vui lòng đồng ý điều khoản!");

        setLoading(true);
        try {
            const res = await registerUser(username, email, password, phone, location, sex);
            toast.success("Đăng ký tài khoản thành công!");
            settologin(false);

        } catch (err) {
            toast.error("Email của bạn đã có người đăng ký!");
        } finally {
            setLoading(false);
        }

    }

    return (

        <div className='relative w-screen h-screen flex overflow-hidden transition-all duration-500'>
            {loading ? <Loading /> : ""}
            <div className={`signin absolute top-0 left-0 w-screen h-screen transition-all duration-500  ${tologin ? "flex z-[1]" : "flex translate-x-[0%] opacity-0 z-[-1]"}`}>

                <div ref={anisignin.ref} className={`w-[50%] h-full px-[50px] mt-[90px] transition-all duration-1000 ${anisignin.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20%]"}`}>
                    <div className=' w-[400px] mx-auto h-full'>
                        <h1 className='text-[32px] font-bold text-main '>Đăng Ký</h1>
                        <div className='flex justify-between mt-10'>
                            <div className='flex flex-col gap-8'>
                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>User name</p>
                                    <input type="text" name="" id="" placeholder='Nhập họ và tên'
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${username ? "border-main" : ""}`} />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Email</p>
                                    <input type="text" name="" id="" placeholder='Nhập địa chỉ email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${email ? "border-main" : ""}`} />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Phone</p>
                                    <input type="text" name="" id="" placeholder='Số điện thoại liên lạc'
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${phone ? "border-main" : ""}`} />
                                </div>
                            </div>
                            <div className='flex flex-col gap-8'>
                                <div className='relative'>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Sex</p>


                                    <div
                                        onClick={() => setOpenSex(!openSex)}

                                        className={`cursor-pointer text-[16px] placeholder:text-[14px] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full flex justify-between items-center ${sex ? "border-main" : ""}`}
                                    >
                                        <span className={sexPopup ? "text-black" : "text-[#8e8e8e] text-[14px] mt-[3px]"}>{sexPopup || "Nam / Nữ"}</span>
                                    </div>


                                    {openSex && (
                                        <div className='absolute left-0 right-0 bg-white shadow-lg rounded-md border mt-2 z-50'>
                                            <div onClick={() => { setOpenSex(false); }}
                                                className='fixed top-0 left-0 w-screen h-screen -z-40'></div>

                                            <div
                                                onClick={() => { setSexPopup("Nam"); setSex("true"); setOpenSex(false); }}
                                                className='px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00000062] text-[14px]'
                                            >
                                                Nam
                                            </div>
                                            <div
                                                onClick={() => { setSexPopup("Nữ"); setSex("false"); setOpenSex(false); }}
                                                className='px-3 py-2 hover:bg-gray-100 cursor-pointer text-[#00000062] text-[14px]'
                                            >
                                                Nữ
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Password</p>
                                    <input type="text" name="" id="" placeholder='6 -> 18 ký tự, 1, P, @,...'
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${password ? "border-main" : ""}`} />
                                </div>

                                <div>
                                    <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Location</p>
                                    <input type="text" name="" id="" placeholder='Vị trí nhận/gửi hàng'
                                        onChange={(e) => setLocation(e.target.value)}
                                        className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${location ? "border-main" : ""}`} />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between items-center text-[#00000081] mt-8'>
                            <div className='flex h-full items-center gap-1'>
                                <input onChange={(e) => setclause(e.target.checked)} type="checkbox" name="" id="" className='accent-black mt-[2px]' />
                                <p className='text-[14px]'>Đồng ý với các điều khoảng của chúng tôi!</p>
                            </div>
                            <a href="#" className='text-[14px] text-main'>Điều khoản?</a>
                        </div>

                        <div className='flex justify-between items-center'>
                            <button
                                onClick={handSubmitRegister}
                                className='bg-main text-white font-semibold px-12 py-2 rounded-[20px] mt-12 hover:bg-opacity-80 transition-all duration-300'>Đăng Ký</button>
                            <button onClick={() => settologin(false)} className='text-[#00000080] font-nomal mt-12 inline-block items-center hover:text-black transition-all duration-300'>Đăng nhập<i class="fa-solid fa-arrow-right-long text-[10px] pl-1"></i></button>

                        </div>
                        <Link to='/' className="text-[#00000080] transition-all duration-300 text-[14px] font-nomal inline-block text-center w-full mt-8 hover:text-main">
                            Tiếp tục với Green Food.
                        </Link>
                    </div>
                </div>
                <div ref={anisignin.ref} className={`w-[50%] h-full overflow-hidden transition-all duration-700 ${anisignin.visible ? "opacity-100 translate-x-0" : "translate-x-[30%]"}`}>
                    <img className='w-full h-full object-cover object-[-17%_-60px] scale-[120%] scale-x-[-1.2]' src={image2} alt="" />

                </div>
            </div>

            <div className={`Login absolute w-screen h-screen transition-all duration-500 ${tologin ? "translate-x-[100%] flex" : "flex"}`}>
                <div className='w-[50%] h-full overflow-hidden'>
                    <img className='w-full h-full object-cover object-[-17%_-60px] scale-[120%]' src={image2} alt="" />
                </div>
                <div ref={anilogin.ref} className={`w-[50%] h-full px-[50px] transition-all duration-500 ${anilogin.visible ? "translate-x-[0%] opacity-100" : "translate-x-[40%] opacity-0"}`}>
                    <div className=' w-[300px] mx-auto mt-[120px]'>
                        <h1 className='text-[32px] font-bold text-main'>Đăng Nhập</h1>

                        <div className='mt-10 flex flex-col gap-8'>
                            <div>
                                <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Email</p>
                                <input type="text" name="" id="" placeholder='Nhập địa chỉ email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${email ? "border-main" : ""}`} />
                            </div>

                            <div>
                                <p className='font-["Poppins"] font-semibold text-sm text-[#00000062]'>Password</p>
                                <input type="password" name="" id="" placeholder='Nhập mật khẩu'
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`mt-[0px] text-[16px] focus:outline-none placeholder:text-[14px] focus:placeholder-[#0000] focus:border-main border-b-[1px] border-[#0000002f] py-2 w-full ${password ? "border-main" : ""}`} />
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
                            <button className='bg-main text-white font-semibold px-10 py-2 rounded-[20px] mt-12 hover:bg-opacity-80 transition-all duration-300'
                                onClick={handleSubmitLogin}>Đăng Nhập</button>
                            <button onClick={() => settologin(true)} className='text-[#00000080] font-nomal mt-12 inline-block items-center hover:text-black transition-all duration-300'>Đăng Ký<i class="fa-solid fa-reply text-[12px] pl-1 scale-y-[-1]"></i></button>
                        </div>
                        <Link to='/' className="text-[#00000080] transition-all duration-300 text-[14px] font-nomal inline-block text-center w-full mt-8 hover:text-main">
                            Tiếp tục với Green Food.
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    )
}
