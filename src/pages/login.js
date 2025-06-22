import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";
import logo from "../assets/picture/logo.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "../contexts/UserContext";

const API_URL = process.env.REACT_APP_API || "http://localhost:4000";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { refreshAccessTokenAndLoadUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });

      const token = response.data.accessToken;
      localStorage.setItem("token", token);

      const decoded = parseJwt(token);
      localStorage.setItem("role", decoded?.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      await refreshAccessTokenAndLoadUser(); // ✅ โหลด user หลัง login

      navigate("/home");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo-area">
          <img src={logo} alt="Logo" className="login-logo-img" />
          <div className="login-app-name">ระบบสมาชิกสมาคมสานใจไทยสู่ใจใต้</div>
          <div className="login-app-desc">สำหรับเจ้าหน้าที่และผู้ดูแลระบบ</div>
        </div>

        <h2 className="login-title">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin}>
          <div className="login-input-wrapper">
            <span className="login-input-icon">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              className="login-input"
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้ หรือ อีเมล"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-input-wrapper">
            <span className="login-input-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <span
              className="login-input-eye"
              onClick={() => setShowPassword((show) => !show)}
              role="button"
              title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              tabIndex={0}
              aria-label="toggle password visibility"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowPassword((show) => !show);
                }
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {message && <div className="login-message">{message}</div>}
      </div>
    </div>
  );
}

export default Login;
