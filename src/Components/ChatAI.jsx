import { useEffect, useRef, useState } from "react";
import axios from "axios";



export default function ChatAI() {

    const [moChat, setMoChat] = useState(false);
    const [tinNhan, setTinNhan] = useState("");
    const [danhSachTinNhan, setDanhSachTinNhan] = useState([]);
    const [dangTraLoi, setDangTraLoi] = useState(false);

    const [viTri, setViTri] = useState({ x: 100, y: 400 });
    const [dangKeo, setDangKeo] = useState(false);
    const [lechChuot, setLechChuot] = useState({ x: 0, y: 0 });

    const refScroll = useRef(null);


    useEffect(() => {
        if (refScroll.current) {
            refScroll.current.scrollTop = refScroll.current.scrollHeight;
        }
    }, [danhSachTinNhan, dangTraLoi]);


    const sendMessageToAI = async (question) => {
        const res = await axios.post(
            "https://be-g-food.onrender.com/api/gemini/AI",
            {
                content: question,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return res.data;
    };


    const guiTinNhan = async () => {
        if (!tinNhan.trim() || dangTraLoi) return;

        setDanhSachTinNhan((prev) => [
            ...prev,
            { role: "user", text: tinNhan },
        ]);

        const cauHoi = tinNhan;
        setTinNhan("");
        setDangTraLoi(true);

        try {
            const data = await sendMessageToAI(cauHoi);
            const traLoi = data.data || "AI không có phản hồi ";

            setDanhSachTinNhan((prev) => [
                ...prev,
                { role: "AI", text: traLoi },
            ]);
        } catch (error) {
            setDanhSachTinNhan((prev) => [
                ...prev,
                { role: "AI", text: "Lỗi kết nối AI " },
            ]);
        }

        setDangTraLoi(false);
    };


    const handleEnter = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            guiTinNhan();
        }
    };


    const startKeo = (e) => {
        setDangKeo(true);
        setLechChuot({
            x: e.clientX - viTri.x,
            y: e.clientY - viTri.y,
        });
    };

    const dangKeoo = (e) => {
        if (!dangKeo) return;
        setViTri({
            x: e.clientX - lechChuot.x,
            y: e.clientY - lechChuot.y,
        });
    };

    const hetKeo = () => setDangKeo(false);

    useEffect(() => {
        window.addEventListener("mousemove", dangKeoo);
        window.addEventListener("mouseup", hetKeo);
        return () => {
            window.removeEventListener("mousemove", dangKeoo);
            window.removeEventListener("mouseup", hetKeo);
        };
    }, [dangKeo, lechChuot]);


    return (
        <div>

            <button
                onMouseDown={startKeo}
                onClick={() => {
                    if (!dangKeo) setMoChat(!moChat);
                }}
                style={{
                    position: "fixed",
                    top: viTri.y,
                    left: viTri.x,
                    zIndex: 999,
                    cursor: "grab",
                }}
                className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
                🤖
            </button>


            <div
                style={{
                    position: "fixed",
                    top: viTri.y - 480,
                    left: viTri.x - 280,
                    zIndex: 999,
                }}
                className={`${moChat
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 pointer-events-none"
                    } transition-all duration-300 w-[350px] h-[450px] bg-white rounded-xl shadow-xl p-4`}
            >
                <h3 className="text-xl font-bold text-center mb-3">
                    AI Chat 🤖
                </h3>

                <div
                    ref={refScroll}
                    className="w-full h-[330px] bg-gray-100 rounded-lg p-3 overflow-y-auto"
                >
                    <p className="text-green-700 italic">
                        Xin chào! Tôi có thể giúp gì được cho bạn!
                    </p>

                    {danhSachTinNhan.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 p-2 rounded-lg text-sm max-w-[80%] ${msg.role === "user"
                                ? "bg-blue-600 text-white ml-auto"
                                : "bg-gray-300 text-black"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}

                    {dangTraLoi && (
                        <p className="text-gray-500 italic">AI đang trả lời...</p>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Nhập câu hỏi..."
                    value={tinNhan}
                    onChange={(e) => setTinNhan(e.target.value)}
                    onKeyDown={handleEnter}
                    className="w-full mt-3 px-3 py-2 rounded-lg border outline-blue-500"
                />
            </div>
        </div>
    );
}