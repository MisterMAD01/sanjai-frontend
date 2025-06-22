// ConfirmDeleteModal.jsx
import React from "react";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ isOpen, title, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h4>ยืนยันการลบ</h4>
        <p>คุณต้องการลบ “{title}” ใช่หรือไม่?</p>
        <div className="confirm-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            ยกเลิก
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            ลบเลย
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
