import React from "react";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>รายละเอียดเอกสาร</h4>
        <p>
          <strong>ชื่อ:</strong> {document.title}
        </p>
        <p>
          <strong>รายละเอียด:</strong> {document.description || "-"}
        </p>
        <p>
          <strong>สมาชิก:</strong> {document.memberName}
        </p>
        <p>
          <strong>วันที่ส่ง:</strong>{" "}
          {new Date(
            document.upload_date || document.uploadDate
          ).toLocaleString()}
        </p>
        <p>
          <strong>ไฟล์:</strong>{" "}
          <a
            href={`${process.env.REACT_APP_API}/uploads/${document.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ดาวน์โหลด
          </a>
        </p>
        <button onClick={onClose}>ปิด</button>
      </div>
    </div>
  );
};

export default DocumentDetailModal;
