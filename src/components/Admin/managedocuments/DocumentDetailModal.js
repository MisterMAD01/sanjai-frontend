import React, { useState, useEffect } from "react";
import "./DocumentDetailModal.css";

const DocumentDetailModal = ({ document, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!document) return;
    const filePath = document.file_path || document.filePath;
    const url = `${process.env.REACT_APP_API}/uploads/${filePath}`;

    const fetchBlob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        setPreviewUrl(blobUrl);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดเอกสารได้");
      } finally {
        setLoading(false);
      }
    };

    fetchBlob();

    // cleanup blob URL on unmount or document change
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

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
          <strong>ผู้ส่ง:</strong> {document.sender || "-"}
        </p>
        <p>
          <strong>ผู้รับ:</strong> {document.recipient || "-"}
        </p>
        <p>
          <strong>วันที่ส่ง:</strong>{" "}
          {new Date(document.upload_date || document.uploadDate).toLocaleString(
            "th-TH"
          )}
        </p>

        <div className="document-preview">
          เอกสาร : {loading && <p>กำลังโหลดเอกสาร...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && previewUrl && (
            <iframe
              src={previewUrl}
              title="Document Preview"
              className="preview-frame"
            />
          )}
        </div>

        <button className="btn-close" onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
};

export default DocumentDetailModal;
