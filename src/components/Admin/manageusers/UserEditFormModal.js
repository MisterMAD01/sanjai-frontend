// src/components/Admin/manageusers/UserEditFormModal.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../../../api";
import "./UserFormModal.css"; // reuse the same styling

export default function UserEditFormModal({ user, handleSave, handleCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    member_id: "",
    approved: 0,
    password: "",
  });
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load user into form when opening
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

  // Fetch available members for linking
  useEffect(() => {
    (async () => {
      setLoadingMembers(true);
      try {
        const res = await api.get("/api/admin/users/available-members");
        setAvailableMembers(res.data);
      } catch (err) {
        console.error("Load available members error:", err);
        toast.error("ไม่สามารถโหลดรายชื่อสมาชิกได้");
      } finally {
        setLoadingMembers(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSelectChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      member_id: option ? option.value : "",
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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

  const memberOptions = availableMembers.map((m) => ({
    value: m.member_id,
    label: `${m.member_id} — ${m.full_name} (${m.graduation_year})`,
  }));

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
          <h2 className="ufm-title">แก้ไขผู้ใช้: {user.username}</h2>

          <label className="ufm-label">
            ชื่อผู้ใช้
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </label>

          <label className="ufm-label">
            อีเมล
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
          </label>

          <label className="ufm-label">
            รหัสผ่าน (เว้นว่างถ้าไม่เปลี่ยน)
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              disabled={submitting}
            />
          </label>

          <label className="ufm-label">
            สิทธิ์การใช้งาน
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

          <label className="ufm-label">
            เลขที่สมาชิกที่เชื่อมโยง
            <Select
              options={memberOptions}
              onChange={handleSelectChange}
              value={memberOptions.find((o) => o.value === formData.member_id)}
              isClearable
              isLoading={loadingMembers}
              placeholder="ค้นหา/เลือกสมาชิก..."
              isDisabled={submitting}
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
  user: PropTypes.shape({
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    member_id: PropTypes.string,
    approved: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
