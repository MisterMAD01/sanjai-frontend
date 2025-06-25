import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./MemberEditModal.css";

const fieldLabels = {
  full_name: "ชื่อ-นามสกุล",
  nickname: "ชื่อเล่น",
  id_card: "เลขบัตรประชาชน",
  birthday: "วันเกิด",
  age: "อายุ",
  gender: "เพศ",
  religion: "ศาสนา",
  medical_conditions: "โรคประจำตัว",
  allergy_history: "ประวัติแพ้ยา",
  address: "ที่อยู่",
  district: "อำเภอ",
  phone: "โทรศัพท์",
  facebook: "Facebook",
  instagram: "Instagram",
  line_id: "Line ID",
  status: "สถานะปัจจุบัน",
  school: "สถาบัน/ที่ทำงาน",
  department: "ระดับชั้น/ตำแหน่ง",
  gpa: "GPA",
  type: "ประเภทสมาชิก",
};

const sections = [
  {
    key: "general",
    title: "ข้อมูลทั่วไป",
    fields: [
      "full_name",
      "nickname",
      "id_card",
      "birthday",
      "age",
      "gender",
      "religion",
    ],
  },
  {
    key: "health",
    title: "ข้อมูลสุขภาพ",
    fields: ["medical_conditions", "allergy_history"],
  },
  {
    key: "contact",
    title: "ข้อมูลติดต่อ",
    fields: ["address", "phone", "facebook", "instagram", "line_id"],
  },
  {
    key: "education",
    title: "ข้อมูลสถานศึกษา/ที่ทำงาน",
    fields: ["status", "school", "department", "gpa"],
  },
];

const options = {
  gender: ["ชาย", "หญิง", "อื่นๆ"],
  religion: ["พุทธ", "คริสต์", "อิสลาม", "ฮินดู", "อื่นๆ"],
  type: ["กิติมศักดิ์", "สามัญ", "ทั่วไป"],
};

export default function MemberEditModal({ member, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (member) setFormData({ ...member });
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderField = (field) => {
    const value = formData[field] ?? "";
    const common = { id: field, name: field, value, onChange: handleChange };

    if (options[field]) {
      return (
        <select {...common} className="member-edit-select">
          <option value="">– เลือก –</option>
          {options[field].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    if (["medical_conditions", "allergy_history", "address"].includes(field)) {
      return <textarea {...common} rows={3} className="member-edit-textarea" />;
    }
    let type = "text";
    if (field === "birthday") type = "date";
    if (["age", "gpa"].includes(field)) type = "number";
    return <input {...common} type={type} className="member-edit-input" />;
  };

  if (!member) return null;
  const currentSection = sections.find((sec) => sec.key === activeTab);

  return (
    <div className="member-edit-overlay" onClick={onClose}>
      <div className="member-edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="member-edit-title">แก้ไขข้อมูลสมาชิก</h2>

        <div className="member-edit-header-info">
          <div className="member-edit-id">เลขที่สมาชิก: {member.member_id}</div>
          <div className="member-edit-avatar">
            {formData.full_name?.charAt(0).toUpperCase() || "-"}
          </div>
          <div className="member-edit-type">
            ประเภท: {member.type || "-"}
            {/* removed graduation_year display */}
          </div>
          <div className="member-edit-district">
            อำเภอ: {member.district || "-"}
          </div>
        </div>

        <div className="member-edit-tabs">
          {sections.map((sec) => (
            <button
              key={sec.key}
              type="button"
              className={
                sec.key === activeTab
                  ? "member-edit-tab-btn active"
                  : "member-edit-tab-btn"
              }
              onClick={() => setActiveTab(sec.key)}
            >
              {sec.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="member-edit-form-container">
          <h3 className="member-edit-section-title">{currentSection.title}</h3>

          <div className="member-edit-fields-grid">
            {currentSection.fields.map((field) => (
              <div key={field} className="member-edit-field">
                <label htmlFor={field}>{fieldLabels[field]}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="member-edit-form-actions">
            <button
              type="button"
              className="member-edit-btn-cancel"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button type="submit" className="member-edit-btn-submit">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

MemberEditModal.propTypes = {
  member: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
