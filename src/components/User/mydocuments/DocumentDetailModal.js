// src/components/User/mydocuments/DocumentDetailModal.jsx

import React from "react";
import PropTypes from "prop-types";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ doc, accessToken, onClose }) => {
  if (!doc) return null;

  const {
    title,
    description,
    sender,
    senderType,
    uploadDate,
    fileUrl,
    filePath,
  } = doc;

  const senderDisplay = sender
    ? senderType
      ? `${sender} (${senderType})`
      : sender
    : "-";

  const fetchBlob = async () => {
    const res = await fetch(fileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.blob();
  };

  const handleView = async () => {
    try {
      const blob = await fetchBlob();
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.error("Error loading document for view:", err);
      alert("ไม่สามารถเปิดเอกสารได้");
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await fetchBlob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      // ดึง extension จาก filePath ที่ส่งมาด้วย
      const ext = filePath.split(".").pop();
      a.download = `${title || "document"}.${ext}`;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("ไม่สามารถดาวน์โหลดเอกสารได้");
    }
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
          {fileUrl && (
            <>
              <button className="ddm-btn-view" onClick={handleView}>
                ดูเอกสาร
              </button>
              <button className="ddm-btn-download" onClick={handleDownload}>
                ดาวน์โหลดเอกสาร
              </button>
            </>
          )}
          <button className="ddm-btn-close" onClick={onClose}>
            ปิด
          </button>
        </footer>
      </div>
    </div>
  );
};

DocumentDetailModal.propTypes = {
  doc: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    sender: PropTypes.string,
    senderType: PropTypes.string,
    uploadDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    fileUrl: PropTypes.string,
    filePath: PropTypes.string.isRequired,
  }).isRequired,
  accessToken: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DocumentDetailModal;
