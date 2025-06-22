// src/components/Admin/manageusers/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { toast } from "react-toastify";
import api from "../../../api";
import "./UserFormModal.css";

export default function UserFormModal({ handleSave, handleCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    member_id: "",
  });
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch members not yet linked to a user
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      member_id: option ? option.value : "",
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.warn("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/admin/users", formData);
      toast.success("เพิ่มผู้ใช้ใหม่สำเร็จ");
      handleSave();
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
        member_id: "",
      });
    } catch (err) {
      console.error("Create user error:", err);
      const msg =
        err.response?.data?.message ||
        "ไม่สามารถเพิ่มผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง";
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
          <h2>เพิ่มผู้ใช้ใหม่</h2>

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
            รหัสผ่าน:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
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
            รหัสสมาชิก (ผูกกับสมาชิก):
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
              {submitting ? "กำลังบันทึก..." : "เพิ่มผู้ใช้"}
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

UserFormModal.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
