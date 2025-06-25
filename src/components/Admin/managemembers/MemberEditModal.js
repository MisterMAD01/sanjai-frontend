// MemberEditModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../../api";
import "./MemberFormModal.css"; // ใช้ CSS เดียวกับฟอร์มเพิ่มสมาชิก

const PREFIXES = ["กรุณาเลือกคำนำหน้า", "นาย", "นางสาว", "นาง"];
const GENDERS = ["กรุณาเลือกเพศ", "ชาย", "หญิง", "อื่นๆ"];
const RELIGIONS = ["กรุณาเลือกศาสนา", "พุทธ", "คริสต์", "อิสลาม", "อื่นๆ"];
const DISTRICTS = [
  "กรุณาเลือกอำเภอ",
  "เมืองนราธิวาส",
  "ตากใบ",
  "บาเจาะ",
  "ยี่งอ",
  "ระแงะ",
  "รือเสาะ",
  "ศรีสาคร",
  "แว้ง",
  "สุคิริน",
  "สุไหงโก-ลก",
  "สุไหงปาดี",
  "จะแนะ",
  "เจาะไอร้อง",
];
const MEMBER_TYPES = [
  "กรุณาเลือกประเภทสมาชิก",
  "กิติมศักดิ์",
  "สามัญ",
  "ทั่วไป",
];
const STATUS_OPTIONS = ["กรุณาเลือกสถานะ", "ทำงาน", "กำลังศึกษา/นักเรียน"];

export default function MemberEditModal({ member, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    member_id: "",
    prefix: "",
    full_name: "",
    nickname: "",
    id_card: "",
    birthday: "",
    age: "",
    gender: "",
    religion: "",
    medical_conditions: "",
    allergy_history: "",
    address: "",
    phone: "",
    facebook: "",
    instagram: "",
    line_id: "",
    school: "",
    graduation_year: "",
    gpa: "",
    type: "",
    district: "",
    status: "",
    department: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        birthday: member.birthday
          ? new Date(member.birthday).toISOString().slice(0, 10)
          : "",
        type: member.type || "",
        district: member.district || "",
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/members/${formData.member_id}`, formData);
      toast.success("อัปเดตข้อมูลสมาชิกสำเร็จ");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mfm-overlay" onClick={submitting ? null : onClose}>
      <div className="mfm-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="mfm-close-btn"
          onClick={onClose}
          disabled={submitting}
        >
          ×
        </button>
        <h2>แก้ไขข้อมูลสมาชิก</h2>
        <form className="mfm-form" onSubmit={handleSubmit}>
          <fieldset className="mfm-section">
            <legend>ข้อมูลทั่วไป</legend>
            <label>
              รหัสสมาชิก
              <input name="member_id" value={formData.member_id} disabled />
            </label>
            <label>
              คำนำหน้า
              <select
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
                required
              >
                {PREFIXES.map((p) => (
                  <option key={p} value={p === PREFIXES[0] ? "" : p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label>
              ชื่อ–นามสกุล
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              ชื่อเล่น
              <input
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
              />
            </label>
            <label>
              เลขบัตรประชาชน
              <input
                name="id_card"
                value={formData.id_card}
                onChange={handleChange}
                maxLength={13}
              />
            </label>
            <label>
              วันเกิด
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
            </label>
            <label>
              อายุ
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min={0}
              />
            </label>
            <label>
              เพศ
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g === GENDERS[0] ? "" : g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label>
              ศาสนา
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                required
              >
                {RELIGIONS.map((r) => (
                  <option key={r} value={r === RELIGIONS[0] ? "" : r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label>
              รุ่นที่
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
              />
            </label>
            <label>
              ประเภทสมาชิก
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {MEMBER_TYPES.map((t) => (
                  <option key={t} value={t === MEMBER_TYPES[0] ? "" : t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              อำเภอ
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d === DISTRICTS[0] ? "" : d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset className="mfm-section">
            <legend>ข้อมูลสุขภาพ</legend>
            <label>
              โรคประจำตัว
              <textarea
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleChange}
              />
            </label>
            <label>
              ประวัติแพ้ยา
              <textarea
                name="allergy_history"
                value={formData.allergy_history}
                onChange={handleChange}
              />
            </label>
          </fieldset>

          <fieldset className="mfm-section">
            <legend>ข้อมูลติดต่อ</legend>
            <label>
              ที่อยู่
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              โทรศัพท์
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Facebook
              <input
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </label>
            <label>
              Instagram
              <input
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </label>
            <label>
              Line ID
              <input
                name="line_id"
                value={formData.line_id}
                onChange={handleChange}
              />
            </label>
          </fieldset>

          <fieldset className="mfm-section">
            <legend>ข้อมูลสถานศึกษา/ที่ทำงาน</legend>
            <label>
              สถานะปัจจุบัน
              <select
                name="status"
                value={formData.STATUS_OPTIONS}
                onChange={handleChange}
                required
              >
                {STATUS_OPTIONS.map((d) => (
                  <option key={d} value={d === STATUS_OPTIONS[0] ? "" : d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label>
              สถาบัน/ที่ทำงาน
              <input
                name="school"
                value={formData.school}
                onChange={handleChange}
              />
            </label>
            <label>
              ระดับชั้น/ตำแหน่ง
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </label>
            <label>
              GPA
              <input
                type="number"
                step="0.01"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
              />
            </label>
          </fieldset>

          <button type="submit" disabled={submitting}>
            {submitting ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      </div>
    </div>
  );
}

MemberEditModal.propTypes = {
  member: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
