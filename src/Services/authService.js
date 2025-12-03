import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    return res.data;
    // Lưu thông tin user vào localStorage khi đăng nhập thành công
    if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
};

export const registerUser = async (
    username,
    email,
    password,
    phone,
    location,
    sex
) => {
    const res = await axios.post(`${API}/auth/register`, {
        username,
        email,
        password,
        phone,
        location,
        sex,
    });
    // Lưu thông tin user vào localStorage khi đăng ký thành công
    if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
};

// Hàm lấy thông tin user từ localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

// Hàm lấy userID
export const getCurrentUserId = () => {
    const user = getCurrentUser();
    return user ? user.id : null;
};

// Hàm logout
export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Nếu có token
};

export const getUserById = async (id) => {
  const res = await axios.get(`${API}/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`${API}/users/${id}`, data);
  return res.data;
};




