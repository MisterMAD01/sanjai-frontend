// src/pages/user/MemberEditModal.js
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
  school: "โรงเรียน",
  graduation_year: "ปีที่จบ",
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
    title: "ข้อมูลการศึกษา",
    fields: ["school", "graduation_year", "gpa"],
  },
];

const options = {
  gender: ["ชาย", "หญิง", "อื่นๆ"],
  religion: ["พุทธ", "คริสต์", "อิสลาม", "ฮินดู", "อื่นๆ"],
  type: ["กิติมศักดิ์", "สามัญ", "ทั่วไป"],
};

const MemberEditModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState(sections[0].key);

  useEffect(() => {
    if (member) {
      setFormData({ ...member });
    }
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
        <select {...common}>
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
      return <textarea {...common} rows={3} />;
    }
    let type = "text";
    if (field === "birthday") type = "date";
    if (["age", "graduation_year"].includes(field)) type = "number";
    if (field === "gpa") type = "number";
    return <input type={type} {...common} />;
  };

  // avatar initial
  const renderAvatar = () => {
    const initial = formData.full_name?.charAt(0) || "-";
    return <div className="modal-avatar">{initial.toUpperCase()}</div>;
  };

  if (!member) return null;

  // find current section
  const currentSection = sections.find((sec) => sec.key === activeTab);

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2>แก้ไขข้อมูลสมาชิก</h2>

        {/* รหัสสมาชิก */}
        <div className="member-id">รหัสสมาชิก: {member.member_id}</div>

        {/* Avatar */}
        <div className="modal-avatar">
          {formData.full_name?.charAt(0).toUpperCase() || "-"}
        </div>

        {/* ประเภท และ รุ่น */}
        <div className="modal-type">
          ประเภท: {member.type || "-"} ({member.graduation_year || "-"})
        </div>

        {/* อำเภอ */}
        <div className="modal-district">อำเภอ: {member.district || "-"}</div>

        {/* Tabs navigation */}
        <div className="modal-tabs">
          {sections.map((sec) => (
            <button
              key={sec.key}
              type="button"
              className={sec.key === activeTab ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab(sec.key)}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-container">
          <h3 className={`section-title1 section-${activeTab}`}>
            {currentSection.title}
          </h3>

          <div className="fields-grid">
            {currentSection.fields.map((field) => (
              <div key={field} className="field">
                <label htmlFor={field}>{fieldLabels[field]}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-submit">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MemberEditModal.propTypes = {
  member: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default MemberEditModal;
