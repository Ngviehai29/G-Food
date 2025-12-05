import { useEffect, useState } from 'react'
import { getUserById, updateUser } from '../Services/authService'
import { Loading } from '../Components/Loading.jsx'
import { toast } from 'sonner'

export const Infor_User = () => {
    const id = JSON.parse(localStorage.getItem("user")).id;

    const [userinfor, setUserInfor] = useState({});
    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const validateForm = () => {
        if (!form.username.trim())
            return "Tên không được để trống!";

        if (!form.phone.trim())
            return "Số điện thoại không được để trống!";

        if (!form.email.trim())
            return "Email không được để trống!";

        if (!form.location.trim())
            return "Địa chỉ không được để trống!";

        // regex kiểm tra email + phải có @gmail.com
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(form.email))
            return "Email phải đúng định dạng và có đuôi @gmail.com!";

        return null;
    };


    const [form, setForm] = useState({
        username: "",
        sex: "true",
        phone: "",
        email: "",
        location: ""
    });

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUserInfor(data.data);

                // Set dữ liệu cho form update
                setForm({
                    username: data.data.username,
                    sex: data.data.sex,
                    phone: data.data.phone,
                    email: data.data.email,
                    location: data.data.location
                });
            } catch (error) {
                console.error("Lỗi lấy user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {

        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }
        try {
            setLoading(true);
            await updateUser(id, form);
            toast.success("Cập nhập thông tin thành công!");

            // Cập nhật lại thông tin hiển thị
            setUserInfor(form);

            setOpenModal(false);
        } catch (err) {
            // console.log("Lỗi cập nhật:", err);
            toast.error("Cập nhập thông tin thất bại!");
        } finally {
            setLoading(false);
            setOpenModal(false);
        }
    };

    return (
        <div>
            {loading && <Loading />}

            <div className='w-full h-[78px] bg-[#0f3714]'></div>
            <div className='w-[800px] mx-auto bg-zinc-50 rounded-[20px] my-8 shadow-lg shadow-zinc-300 pb-8'>
                <h1 className='text-center font-bold text-xamden text-[24px] py-8'>
                    THÔNG TIN CÁ NHÂN
                </h1>

                <div className='px-32'>
                    <div className='flex flex-col gap-4'>
                        <div className='mt-6 border-b w-[250px]'>
                            <p className='text-main text-[14px]'>Tên:</p>
                            <p className='pt-1 text-[16px] pb-3 font-semibold'>
                                {userinfor?.username}
                            </p>
                        </div>

                        <div className='mt-6 border-b w-[250px]'>
                            <p className='text-main text-[14px]'>Giới tính:</p>
                            <p className='pt-1 text-[16px] pb-3 font-semibold'>
                                {loading ? "" : (userinfor?.sex ? "Nam" : "Nữ")}
                            </p>
                        </div>

                        <div className='mt-6 border-b w-[250px]'>
                            <p className='text-main text-[14px]'>Số điện thoại:</p>
                            <p className='pt-1 text-[16px] pb-3 font-semibold'>
                                {userinfor?.phone}
                            </p>
                        </div>

                        <div className='mt-6 border-b w-[250px]'>
                            <p className='text-main text-[14px]'>Email:</p>
                            <p className='pt-1 text-[16px] pb-3 font-semibold'>
                                {userinfor?.email}
                            </p>
                        </div>

                        <div className='mt-6 border-b w-[250px]'>
                            <p className='text-main text-[14px]'>Địa chỉ:</p>
                            <p className='pt-1 text-[16px] pb-3 font-semibold'>
                                {userinfor?.location}
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenModal(true)}
                            className='text-white bg-main px-3 py-2 rounded-[20px] w-[150px] mx-auto mt-8'
                        >
                            Cập nhập
                        </button>
                    </div>
                </div>
            </div>

            {/* ================== POPUP FORM ================== */}
            {openModal && (
                <div className='fixed inset-0 flex justify-center items-center z-50'>
                    <div onClick={() => setOpenModal(false)} className='w-full h-full bg-black/20 absolute top-0 left-0 z-10'></div>
                    <div className='bg-white w-[400px] p-10 rounded-xl shadow-lg absolute z-20'>
                        <h2 className='text-center font-bold text-[20px] mb-6 text-main'>CẬP NHẬP THÔNG TIN</h2>

                        <div className='flex flex-col gap-4'>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className='border p-2 rounded-[10px] focus:border-main focus:outline-none'
                                placeholder='Tên...'
                            />

                            <select
                                name="sex"
                                value={form.sex ? "true" : "false"}
                                onChange={(e) => setForm({ ...form, sex: e.target.value === "true" })}
                                className='border p-2 rounded-[10px] focus:border-main focus:outline-none'
                            >
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>


                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className='border p-2 rounded-[10px] focus:border-main focus:outline-none'
                                placeholder='Số điện thoại'
                            />

                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className='border p-2 rounded-[10px] focus:border-main focus:outline-none'
                                placeholder='Email'
                            />

                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className='border p-2 rounded-[10px] focus:border-main focus:outline-none'
                                placeholder='Địa chỉ'
                            />
                        </div>

                        <div className='flex justify-center gap-4 mt-8'>
                            <button
                                className='px-4 py-2 bg-zinc-300 rounded-[10px]'
                                onClick={() => setOpenModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className='px-4 py-2 bg-main text-white rounded-[10px]'
                                onClick={handleSubmit}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
