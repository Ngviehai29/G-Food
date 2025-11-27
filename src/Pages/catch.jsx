import { useState } from "react";
// import { registerUser } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser(name, email, password);
    alert("Đăng ký thành công!");
    console.log(res);
  };

  return (
    <div className="flex flex-col gap-4 w-[300px] mx-auto mt-20">
      <h2 className="text-xl font-bold text-center">Đăng ký</h2>

      <input
        type="text"
        placeholder="Tên"
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />

      <button
        className="bg-green-600 text-white p-2 rounded"
        onClick={handleSubmit}
      >
        Đăng ký
      </button>
    </div>
  );
}
