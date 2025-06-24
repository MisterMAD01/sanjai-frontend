import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api"; // ปรับ path ตามจริง
import "react-toastify/dist/ReactToastify.css";
import "./MyProfileuserEditModal.css";

export default function MemberEditModal({ profile, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // โหลดข้อมูลเดิม
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        password: "",
        confirm_password: "",
      });
    }
  }, [profile]);

  // เปลี่ยนฟิลด์ฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // ส่งข้อมูลไปอัปเดต
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) return toast.warn("กรุณากรอกชื่อผู้ใช้");
    if (formData.password && formData.password !== formData.confirm_password) {
      return toast.warn("รหัสผ่านใหม่ไม่ตรงกัน");
    }
    setSubmitting(true);

    try {
      const payload = { username: formData.username, email: formData.email };
      if (formData.password) payload.password = formData.password;

      const res = await api.put("/api/user/me", payload);
      toast.success("อัปเดตโปรไฟล์สำเร็จ");
      onSave(res.data.profile);
    } catch (err) {
      console.error("API Update error:", err.response || err);
      toast.error(err.response?.data?.message || "อัปเดตโปรไฟล์ไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  // แสดงตัวอักษรตัวแรกของชื่อ
  const avatarInitial =
    profile?.full_name?.trim().charAt(0).toUpperCase() || "-";

  return (
    <div className="mem-edit-overlay" onClick={submitting ? null : onClose}>
      <div className="mem-edit-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="mem-edit-close"
          onClick={onClose}
          disabled={submitting}
        >
          <FaTimes />
        </button>
        <h2>แก้ไขโปรไฟล์</h2>

        {/* Avatar Initial พร้อมชื่อใต้ */}
        <div className="mem-avatar-wrapper">
          <div className="mem-avatar-placeholder">{avatarInitial}</div>
          <div className="mem-avatar-name">{profile?.full_name}</div>
        </div>

        <form onSubmit={handleSubmit} className="mem-edit-form">
          <label>
            ชื่อผู้ใช้:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </label>
          <label>
            อีเมล:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </label>
          <label>
            รหัสผ่านใหม่:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="เว้นว่างถ้าไม่เปลี่ยน"
              disabled={submitting}
            />
          </label>
          <label>
            ยืนยันรหัสผ่าน:
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="เว้นว่างถ้าไม่เปลี่ยน"
              disabled={submitting}
            />
          </label>
          <div className="mem-edit-buttons">
            <button
              type="submit"
              className="mem-save-btn"
              disabled={submitting}
            >
              {submitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button
              type="button"
              className="mem-cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

MemberEditModal.propTypes = {
  profile: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
