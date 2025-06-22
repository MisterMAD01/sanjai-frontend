// src/api.js
import axios from "axios";
import { toast } from "react-toastify";

// สร้าง axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000",
  withCredentials: true, // ส่ง cookie อัตโนมัติ
  headers: { "Content-Type": "application/json" },
});

// แนบ token ใน header อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// จับ errors และแสดง toast แจ้งเตือน
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      toast.error("กรุณาเข้าสู่ระบบก่อน เพื่อใช้งานฟีเจอร์นี้");
    } else if (status === 403) {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้");
    } else {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
    return Promise.reject(error);
  }
);

export default api;
