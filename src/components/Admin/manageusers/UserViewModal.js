import React from "react";
import PropTypes from "prop-types";
import "./UserViewModal.css"; // reusing modal styles

export default function UserViewModal({
  user,
  onClose,
  onApprove,
  onRevoke,
  onEdit,
}) {
  if (!user) return null;

  return (
    <div className="ufm-overlay">
      <div
        className="ufm-modal user-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ufm-close-btn" onClick={onClose}>
          ×
        </button>
        <h2>รายละเอียดผู้ใช้: {user.username}</h2>

        <div className="user-info">
          <p>
            <strong>ชื่อผู้ใช้:</strong> {user.username}
          </p>
          <p>
            <strong>อีเมล:</strong> {user.email || "-"}
          </p>
          <p>
            <strong>สิทธิ์การใช้งาน:</strong> {user.role}
          </p>
          <p>
            <strong>สถานะ:</strong>{" "}
            {user.approved ? (
              <span className="status-approved">อนุมัติแล้ว</span>
            ) : (
              <span className="status-pending">รออนุมัติ</span>
            )}
          </p>
          <p>
            <strong>เลขที่สมาชิกที่เชื่อมโยง:</strong> {user.member_id || "-"}
          </p>
          <p>
            <strong>สร้างเมื่อ:</strong>{" "}
            {new Date(user.created_at).toLocaleString("th-TH")}
          </p>
          <p>
            <strong>อัปเดตเมื่อ:</strong>{" "}
            {new Date(user.updated_at).toLocaleString("th-TH")}
          </p>
        </div>

        <div className="modal-actions">
          {!user.approved ? (
            <button
              type="button"
              className="approve-btn"
              onClick={() => onApprove(user.user_id)}
            >
              อนุมัติบัญชี
            </button>
          ) : (
            <button
              type="button"
              className="revoke-btn"
              onClick={() => onRevoke(user.user_id)}
            >
              ยกเลิกอนุมัติ
            </button>
          )}
          <button
            type="button"
            className="edit-btn"
            onClick={() => onEdit(user)}
          >
            แก้ไขข้อมูล
          </button>
          <button type="button" className="close-btn" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

UserViewModal.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    approved: PropTypes.bool,
    member_id: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
