// MemberViewModal.jsx
import React from "react";
import PropTypes from "prop-types";
import "./MemberViewModal.css";

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("th-TH") : "-";
const formatGPA = (gpa) =>
  gpa != null && !isNaN(Number(gpa)) ? Number(gpa).toFixed(2) : "-";
const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "?");

export default function MemberViewModal({ member, onClose, onEdit }) {
  if (!member) return null;

  return (
    <div className="mv-overlay" onClick={onClose}>
      <div className="mv-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mv-header">
          <div className="mv-avatar">{getInitial(member.full_name)}</div>
          <h2 className="mv-title">{member.full_name || "ไม่ระบุชื่อ"}</h2>
          <div className="mv-sub-id">
            เลขที่สมาชิก: {member.member_id || "-"}
          </div>
        </div>

        {/* Content */}
        <div className="mv-content-grid">
          <div className="mv-section">
            <h4>ข้อมูลทั่วไป</h4>
            <p>
              <strong>คำนำหน้า:</strong> {member.prefix || "-"}
            </p>
            <p>
              <strong>ชื่อเล่น:</strong> {member.nickname || "-"}
            </p>
            <p>
              <strong>บัตรประชาชน:</strong> {member.id_card || "-"}
            </p>
            <p>
              <strong>วันเกิด:</strong> {formatDate(member.birthday)}
            </p>
            <p>
              <strong>อายุ:</strong> {member.age || "-"}
            </p>
            <p>
              <strong>เพศ:</strong> {member.gender || "-"}
            </p>
            <p>
              <strong>ศาสนา:</strong> {member.religion || "-"}
            </p>
            <p>
              <strong>รุ่นที่:</strong> {member.graduation_year || "-"}
            </p>
            <p>
              <strong>ประเภทสมาชิก:</strong> {member.type || "-"}
            </p>
            <p>
              <strong>อำเภอ:</strong> {member.district || "-"}
            </p>
          </div>

          <div className="mv-section">
            <h4>ข้อมูลสุขภาพ</h4>
            <p>
              <strong>โรคประจำตัว:</strong> {member.medical_conditions || "-"}
            </p>
            <p>
              <strong>ประวัติแพ้ยา:</strong> {member.allergy_history || "-"}
            </p>
          </div>

          <div className="mv-section">
            <h4>ข้อมูลติดต่อ</h4>
            <p>
              <strong>ที่อยู่:</strong> {member.address || "-"}
            </p>
            <p>
              <strong>โทรศัพท์:</strong> {member.phone || "-"}
            </p>
            <p>
              <strong>Facebook:</strong> {member.facebook || "-"}
            </p>
            <p>
              <strong>Instagram:</strong> {member.instagram || "-"}
            </p>
            <p>
              <strong>Line ID:</strong> {member.line_id || "-"}
            </p>
          </div>

          <div className="mv-section">
            <h4>ข้อมูลการศึกษา/ที่ทำงาน</h4>
            <p>
              <strong>สถาบัน/ที่ทำงาน:</strong> {member.school || "-"}
            </p>
            <p>
              <strong>GPA:</strong> {formatGPA(member.gpa)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mv-footer">
          <button className="mv-btn mv-close" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

MemberViewModal.propTypes = {
  member: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
