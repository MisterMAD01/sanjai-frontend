// DocumentDetailModal.jsx
import React from "react";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  if (!document) return null;

  const { title, description, sender, uploadDate, fileUrl } = document;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h4>รายละเอียดเอกสาร</h4>
        </header>
        <div className="modal-body">
          <p>
            <strong>ชื่อ:</strong> {title}
          </p>
          <p>
            <strong>รายละเอียด:</strong> {description || "-"}
          </p>
          <p>
            <strong>ผู้ส่ง:</strong> {sender}
          </p>
          <p>
            <strong>วันที่ส่ง:</strong>{" "}
            {new Date(uploadDate).toLocaleString("th-TH")}
          </p>
        </div>
        <footer className="modal-footer">
          {/* ปุ่มปิด อยู่ซ้าย และเป็นสีเทา */}
          <button className="btn-close-modal1" onClick={onClose}>
            ปิด
          </button>
          {/* ปุ่มดูเอกสาร อยู่ขวา และเป็นสีแดง */}
          <button
            className="btn-view-document"
            onClick={() => window.open(fileUrl, "_blank")}
          >
            ดูเอกสาร
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DocumentDetailModal;
