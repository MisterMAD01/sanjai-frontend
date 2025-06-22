import React from "react";
import PropTypes from "prop-types";
import "./MemberViewModal.css";

function MemberViewModal({ member, onClose, onEdit }) {
  if (!member) return null;

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("th-TH") : "-";

  const formatGPA = (gpa) =>
    gpa !== null && !isNaN(Number(gpa)) ? Number(gpa).toFixed(2) : "-";

  const getInitial = (name) =>
    name ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{member.full_name || "ไม่ระบุชื่อ"}</h2>
          <div className="modal-avatar">{getInitial(member.full_name)}</div>
          <div className="modal-sub-id">
            รหัสสมาชิก: {member.member_id || "-"}
          </div>
        </div>

        {/* Content */}
        <div className="modal-content-grid">
          <div className="modal-section">
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
          </div>

          <div className="modal-section">
            <h4>ข้อมูลสุขภาพ</h4>
            <p>
              <strong>โรคประจำตัว:</strong> {member.medical_conditions || "-"}
            </p>
            <p>
              <strong>ประวัติแพ้ยา:</strong> {member.allergy_history || "-"}
            </p>
          </div>

          <div className="modal-section">
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

          <div className="modal-section">
            <h4>ข้อมูลการศึกษา</h4>
            <p>
              <strong>โรงเรียน:</strong> {member.school || "-"}
            </p>
            <p>
              <strong>ปีที่จบ:</strong> {member.graduation_year || "-"}
            </p>
            <p>
              <strong>GPA:</strong> {member.gpa ? formatGPA(member.gpa) : "-"}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="modal-footer">
          <button
            type="button"
            className="modal-edit-btn"
            onClick={() => onEdit(member)}
          >
            แก้ไขข้อมูล
          </button>
          <button className="modal-close-btn" onClick={onClose}>
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
  onEdit: PropTypes.func.isRequired,
};

export default MemberViewModal;
