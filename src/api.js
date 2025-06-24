// B:\Coding\sanjaithai_web\sanjai-frontend\src\api.js
import axios from "axios";
import { toast } from "react-toastify";

// สร้าง axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true, // ส่ง cookie อัตโนมัติ (สำหรับ refreshToken)
  headers: { "Content-Type": "application/json" },
});

// แนบ token ใน header อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Access Token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ตัวแปรสำหรับป้องกันการเรียก refresh token ซ้ำซ้อน
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// จับ errors และแสดง toast แจ้งเตือน พร้อมจัดการ refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // หากเป็น 401 และยังไม่ใช่คำขอ refresh token และยังไม่เคยลอง retry
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // ตั้งค่า _retry เพื่อป้องกัน loop ไม่รู้จบ

      if (isRefreshing) {
        // ถ้ากำลังรีเฟรชอยู่ ให้เพิ่มคำขอเข้าคิว
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest); // ใช้ 'api' instance
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // เริ่มกระบวนการรีเฟรชโทเค็น
      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          // เรียก API เพื่อขอ Access Token ใหม่โดยใช้ Refresh Token (ที่อยู่ใน cookie)
          // ต้องเรียกผ่าน 'api' instance เพื่อให้ withCredentials ทำงาน
          const refreshRes = await api.post("/api/auth/refresh-token");
          const newAccessToken = refreshRes.data.token;

          // เก็บ Access Token ใหม่ใน localStorage
          localStorage.setItem("token", newAccessToken);

          // อัปเดต Authorization header ในคำขอเดิมที่ล้มเหลว
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

          // ประมวลผลคำขอที่ค้างอยู่ในคิวทั้งหมด
          processQueue(null, newAccessToken);

          // ส่งคำขอเดิมที่ล้มเหลวอีกครั้ง
          resolve(api(originalRequest)); // ใช้ 'api' instance
        } catch (refreshError) {
          console.error(
            "Failed to refresh token:",
            refreshError.response?.data || refreshError
          );
          // หาก refresh token ล้มเหลว (เช่น หมดอายุ)
          // ให้ล้าง token และนำผู้ใช้ไปหน้า login
          localStorage.removeItem("token");
          toast.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          // คุณอาจจะต้อง redirect ผู้ใช้ไปยังหน้า login ที่นี่
          // window.location.href = '/login';
          processQueue(refreshError, null);
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    // สำหรับ errors อื่นๆ (รวมถึง 401 ที่ไม่ใช่ token หมดอายุ หรือ 401 หลังการ retry)
    // หรือ 404 ที่แท้จริงที่ไม่ใช่การหมดอายุของ token
    if (status === 401) {
      toast.error("กรุณาเข้าสู่ระบบก่อน เพื่อใช้งานฟีเจอร์นี้");
    } else if (status === 403) {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้");
    } else if (status === 404) {
      // Explicitly catch 404 for clarity
      toast.error("ไม่พบข้อมูลหรือเส้นทาง API");
    } else {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
    return Promise.reject(error);
  }
);

export default api;
