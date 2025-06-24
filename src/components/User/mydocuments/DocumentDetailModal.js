// src/components/user/DocumentDetailModal.jsx
import React from "react";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  if (!document) return null;

  // สมมติว่า document มีฟิลด์ sender (ชื่อเต็ม) และ senderType (ประเภทผู้ส่ง)
  const { title, description, sender, senderType, uploadDate, fileUrl } =
    document;

  // สร้างข้อความสำหรับแสดงผู้ส่ง
  const senderDisplay = sender
    ? senderType
      ? `${sender} (${senderType})`
      : sender
    : "-";

  // ฟังก์ชันดาวน์โหลดไฟล์
  const handleDownload = () => {
    if (!fileUrl) return;
    const link = window.document.createElement("a");
    link.href = fileUrl;
    // ถ้าต้องการระบุชื่อไฟล์ ช่วยเติมนามสกุล เช่น:
    // link.download = `${title || "document"}.pdf`;
    link.download = "";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h4>รายละเอียดเอกสาร</h4>
        </header>
        <div className="modal-body">
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
        <footer className="modal-footer">
          <button className="btn-close-modal1" onClick={onClose}>
            ปิด
          </button>
          <button
            className="btn-view-document"
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
