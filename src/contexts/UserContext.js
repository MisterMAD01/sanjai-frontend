// src/context/UserContext.js

import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../components/utils/axiosInstance"; // ✅ Custom Axios with baseURL & withCredentials

const API_URL = process.env.REACT_APP_API || "http://localhost:4000";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  // ✅ Logout ฟังก์ชัน
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

  // ✅ ฟังก์ชันโหลด user
  const loadUserProfile = async (token) => {
    try {
      const res = await axiosInstance.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = res.data.profile;
      if (profile.picture) {
        profile.picture = `${API_URL}/api/user/uploads/${profile.picture}`;
      }
      setUser(profile);
    } catch (err) {
      console.error("Failed to load user:", err.message);
      logout();
    }
  };

  // ✅ ฟังก์ชัน refresh token และโหลด user
  const refreshAccessTokenAndLoadUser = async () => {
    setLoadingUser(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      const token = res.data.token;
      setAccessToken(token);
      localStorage.setItem("token", token);
      await loadUserProfile(token);
    } catch (err) {
      console.error("Refresh failed:", err.message);
      logout();
    } finally {
      setLoadingUser(false);
    }
  };

  // ✅ Interceptor ดัก token หมดอายุ แล้ว refresh
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;
        if (
          err.response?.status === 401 &&
          err.response?.data?.message === "jwt expired" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(
              `${API_URL}/api/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            const newToken = res.data.token;
            setAccessToken(newToken);
            localStorage.setItem("token", newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest); // ✅ retry request เดิม
          } catch (refreshErr) {
            logout();
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ โหลด user ตอน mount
  useEffect(() => {
    refreshAccessTokenAndLoadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ role
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
