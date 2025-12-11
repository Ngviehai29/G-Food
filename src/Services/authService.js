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

export const getAllUser = async () => {
    const res = await axios.get(`${API}/users`);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axios.put(`${API}/users/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    return res.data;
};

// khóa tài khoản
export const lockUser = async (id) => {
    const res = await axios.put(`${API}/users/lock/${id}`);
    return res.data;
};

export const unlockUser = async (id) => {
    const res = await axios.put(`${API}/users/unlock/${id}`);
    return res.data;
};

// get danh mục
export const getCategory = async () => {
    const res = await axios.get(`${API}/categories`);
    return res.data;
};

// tạo danh mục
export const createCategory = async (name, description) => {
  const res = await axios.post(`${API}/categories`, {
    name,
    description
  });
  return res.data;
};

// Cập nhật danh mục
export const updateCategory = async (id, name, description) => {
  const res = await axios.put(`${API}/categories/${id}`, { name, description });
  return res.data;
};

// Xóa danh mục
export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API}/categories/${id}`);
  return res.data;
};

export const getAllProducts = async () => {
    const res = await axios.get(`${API}/postnewshare`);
    return res.data;
};






