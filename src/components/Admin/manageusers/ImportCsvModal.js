// src/components/Admin/manageusers/ImportExcelModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api";
import "./ImportExcelModal.css";

export default function ImportExcelModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn("กรุณาเลือกไฟล์ Excel ก่อน");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", file);

    setUploading(true);
    try {
      await api.post("/api/admin/users/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("นำเข้าข้อมูลสำเร็จ");
      onSuccess();
    } catch (error) {
      console.error("Import Excel error:", error);
      toast.error(
        error.response?.data?.message ||
          "นำเข้าไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="iex-overlay" onClick={onClose}>
      <div className="iex-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="iex-close-btn"
          onClick={onClose}
          disabled={uploading}
        >
          ×
        </button>
        <h2>นำเข้าจาก Excel</h2>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className="iex-buttons">
          <button type="button" onClick={onClose} disabled={uploading}>
            ยกเลิก
          </button>
          <button type="button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "กำลังนำเข้า..." : "นำเข้า"}
          </button>
        </div>
      </div>
    </div>
  );
}
