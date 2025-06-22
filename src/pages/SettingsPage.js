// src/pages/user/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { FaLock, FaEnvelope, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api";
import AlertBanner from "../components/common/AlertBanner";
import "react-toastify/dist/ReactToastify.css";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // inline banner (optional)
  const [banner, setBanner] = useState({ type: "", message: "" });

  // ฟัังก์ชันช่วยแสดง AlertBanner
  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner({ type: "", message: "" }), 4000);
  };

  // ดึงข้อมูลโปรไฟล์ + การตั้งค่า notification
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/api/user/me");
        const { profile } = res.data;
        setEmail(profile.email || "");
        if (typeof profile.notifications_enabled === "boolean") {
          setNotificationsEnabled(profile.notifications_enabled);
        }
      } catch (err) {
        console.error(err);
        toast.error("ไม่สามารถโหลดการตั้งค่าได้");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  if (loading) {
    return <div className="sps-loading">กำลังโหลดการตั้งค่า...</div>;
  }

  // เปลี่ยนรหัสผ่าน
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showBanner("error", "รหัสผ่านใหม่ไม่ตรงกัน");
    }
    try {
      const res = await api.put("/api/user/settings/password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || "เปลี่ยนรหัสผ่านสำเร็จ");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "เปลี่ยนรหัสผ่านล้มเหลว");
    }
  };

  // เปลี่ยนอีเมล
  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/user/settings/email", { newEmail });
      toast.success(res.data.message || "เปลี่ยนอีเมลสำเร็จ");
      setEmail(newEmail);
      setNewEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "เปลี่ยนอีเมลล้มเหลว");
    }
  };

  // สลับการแจ้งเตือน
  const handleToggleNotifications = async () => {
    try {
      const res = await api.put("/api/user/settings/notify", {
        enabled: !notificationsEnabled,
      });
      toast.success(res.data.message || "อัปเดตการแจ้งเตือนสำเร็จ");
      setNotificationsEnabled(!notificationsEnabled);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "อัปเดตการแจ้งเตือนล้มเหลว");
    }
  };

  return (
    <div className="sps-page">
      {/* Optional inline banner */}
      {banner.message && (
        <AlertBanner
          type={banner.type}
          message={banner.message}
          onClose={() => setBanner({ type: "", message: "" })}
        />
      )}

      <h1 className="sps-title">การตั้งค่า</h1>
      <div className="sps-card">
        <div className="sps-grid">
          {/* เปลี่ยนรหัสผ่าน */}
          <section className="sps-section">
            <h2 className="sps-heading">
              <FaLock className="sps-icon" /> เปลี่ยนรหัสผ่าน
            </h2>
            <form onSubmit={handlePasswordChange} className="sps-form">
              <div className="sps-field">
                <label>รหัสผ่านเดิม</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="sps-field">
                <label>รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="sps-field">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="sps-btn">
                บันทึก
              </button>
            </form>
          </section>

          {/* เปลี่ยนอีเมล */}
          <section className="sps-section">
            <h2 className="sps-heading">
              <FaEnvelope className="sps-icon" /> เปลี่ยนอีเมล
            </h2>
            <form onSubmit={handleEmailChange} className="sps-form">
              <div className="sps-field-inline">
                <label>อีเมลปัจจุบัน</label>
                <span className="sps-current">{email || "-"}</span>
              </div>
              <div className="sps-field">
                <label>อีเมลใหม่</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="sps-btn">
                เปลี่ยนอีเมล
              </button>
            </form>
          </section>

          {/* การแจ้งเตือน */}
          <section className="sps-section">
            <h2 className="sps-heading">
              <FaBell className="sps-icon" /> การแจ้งเตือน
            </h2>
            <div className="sps-switch-wrapper">
              <label className="sps-switch">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={handleToggleNotifications}
                />
                <span className="sps-slider"></span>
              </label>
              <span className="sps-label-inline">เปิดรับการแจ้งเตือน</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
