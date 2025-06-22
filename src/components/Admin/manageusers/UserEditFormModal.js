// src/components/Admin/manageusers/UserEditFormModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../../api";
import "./UserFormModal.css";

export default function UserEditFormModal({ user, handleSave, handleCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    member_id: "",
    approved: 0,
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "user",
        member_id: user.member_id || "",
        approved: user.approved ? 1 : 0,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Prepare payload
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await api.put(`/api/admin/users/${user.user_id}`, payload);
      toast.success("แก้ไขข้อมูลสำเร็จ");
      handleSave();
    } catch (err) {
      console.error("Update user error:", err);
      const msg =
        err.response?.data?.message ||
        "แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ufm-overlay" onClick={submitting ? null : handleCancel}>
      <div className="ufm-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="ufm-close-btn"
          onClick={handleCancel}
          disabled={submitting}
        >
          ×
        </button>
        <form className="ufm-form" onSubmit={onSubmit}>
          <h2>แก้ไขผู้ใช้: {user.username}</h2>

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
              disabled={submitting}
            />
          </label>

          <label>
            รหัสผ่าน (เว้นว่างถ้าไม่เปลี่ยน):
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              disabled={submitting}
            />
          </label>

          <label>
            สิทธิ์การใช้งาน:
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </label>

          <label>
            รหัสสมาชิกที่เชื่อมโยง:
            <input
              type="text"
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              disabled={submitting}
            />
          </label>

          <label className="ufm-checkbox">
            อนุมัติบัญชี:
            <input
              type="checkbox"
              name="approved"
              checked={formData.approved === 1}
              onChange={handleChange}
              disabled={submitting}
            />
          </label>

          <div className="ufm-buttons">
            <button
              type="submit"
              className="ufm-save-btn"
              disabled={submitting}
            >
              {submitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button
              type="button"
              className="ufm-cancel-btn"
              onClick={handleCancel}
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

UserEditFormModal.propTypes = {
  user: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
