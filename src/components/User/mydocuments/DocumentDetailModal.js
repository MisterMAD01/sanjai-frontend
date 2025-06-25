// src/components/user/DocumentDetailModal.jsx
import React from "react";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  if (!document) return null;
  const { title, description, sender, senderType, uploadDate, fileUrl } =
    document;
  const senderDisplay = sender
    ? senderType
      ? `${sender} (${senderType})`
      : sender
    : "-";

  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ddm-modal-overlay" onClick={onClose}>
      <div className="ddm-modal-content" onClick={(e) => e.stopPropagation()}>
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
          <button
            className="ddm-btn-download"
            onClick={handleDownload}
            disabled={!fileUrl}
          >
            ดาวน์โหลด
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DocumentDetailModal;
