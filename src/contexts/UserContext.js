import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API || "http://localhost:4000";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  // ฟังก์ชัน logout
  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err.message);
    }
    localStorage.removeItem("token");
    setAccessToken(null);
    setUser(null);
    navigate("/login");
  };

  // ฟังก์ชัน refresh token และโหลดข้อมูล user
  const refreshAccessTokenAndLoadUser = async () => {
    setLoadingUser(true);
    try {
      // ขอ access token ใหม่จาก refresh token (cookie)
      const res = await axios.post(
        `${API_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const token = res.data.token;
      setAccessToken(token);
      localStorage.setItem("token", token);

      // โหลดข้อมูลโปรไฟล์ user
      const userRes = await axios.get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = userRes.data.profile;

      // หากมีรูปภาพ โปรไฟล์แนบ full URL
      if (profile.picture) {
        profile.picture = `${API_URL}/api/user/uploads/${profile.picture}`;
      }

      setUser(profile);
    } catch (err) {
      console.error("Failed to refresh token or load user:", err.message);
      logout();
    } finally {
      setLoadingUser(false);
    }
  };

  // โหลดข้อมูล user ตอน mount
  useEffect(() => {
    refreshAccessTokenAndLoadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // เช็ค role ผู้ใช้
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        logout,
        loadingUser,
        isAdmin,
        isUser,
        refreshAccessTokenAndLoadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
