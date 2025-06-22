// src/components/Member/ConfirmDeleteModal.jsx
import React from "react";
import PropTypes from "prop-types";
import "./ConfirmDeleteModal.css";

export default function ConfirmDeleteModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
}) {
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
}

ConfirmDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ConfirmDeleteModal.defaultProps = {
  title: "-",
};
