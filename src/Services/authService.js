import axios from "axios";


const API = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (username, email, password, phone, location, sex) => {
  const res = await axios.post(`${API}/auth/register`, {
    username,
    email,
    password,
    phone,
    location,
    sex
  });
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`${API}/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`${API}/users/${id}`, data);
  return res.data;
};




