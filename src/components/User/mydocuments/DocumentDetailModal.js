import React from "react";
import PropTypes from "prop-types";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  if (!document) return null;

  const { title, description, sender, senderType, uploadDate } = document;

  const senderDisplay = sender
    ? senderType
      ? `${sender} (${senderType})`
      : sender
    : "-";

  return (
    <div className="ddm-modal-overlay">
      <div className="ddm-modal-content">
        <header className="ddm-modal-header">
          <h4 className="ddm-modal-title">รายละเอียดเอกสาร</h4>
        </header>
        <div className="ddm-modal-body">
          <p>
            <strong>ชื่อ:</strong> {title || "-"}
          </p>
          <p>
            <strong>รายละเอียด:</strong> {description || "-"}
          </p>
          <p>
            <strong>ผู้ส่ง:</strong> {senderDisplay}
          </p>
          <p>
            <strong>วันที่ส่ง:</strong>{" "}
            {uploadDate ? new Date(uploadDate).toLocaleString("th-TH") : "-"}
          </p>
        </div>
        <footer className="ddm-modal-footer">
          <button className="ddm-btn-close" onClick={onClose}>
            ปิด
          </button>
        </footer>
      </div>
    </div>
  );
};

DocumentDetailModal.propTypes = {
  document: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default DocumentDetailModal;
