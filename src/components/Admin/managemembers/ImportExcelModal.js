// src/components/Admin/managemembers/ImportExcelModal.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import api from "../../../api";
import "react-toastify/dist/ReactToastify.css";
import "./ImportExcelModal.css";

export default function ImportExcelModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  // อ่านไฟล์ Excel แล้วแปลงเป็น JSON preview
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xls", "xlsx"].includes(ext)) {
      toast.warn("กรุณาเลือกไฟล์ .xls หรือ .xlsx เท่านั้น");
      setFile(null);
      setPreviewData(null);
      return;
    }

    setFile(f);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        setPreviewData(json);
      } catch (err) {
        console.error(err);
        toast.error("ไม่สามารถอ่านไฟล์ Excel ได้");
        setFile(null);
        setPreviewData(null);
      }
    };
    reader.readAsArrayBuffer(f);
  };

  // อัปโหลดไฟล์ไปยังเซิร์ฟเวอร์
  const handleUpload = async () => {
    if (!file) {
      toast.warn("กรุณาเลือกไฟล์ก่อนนำเข้า");
      return;
    }
    if (!previewData || previewData.length === 0) {
      toast.warn("ไม่มีข้อมูลให้ส่งไปยังเซิร์ฟเวอร์");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const res = await api.post("/api/admin/users/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "นำเข้าข้อมูลสำเร็จ");
      setFile(null);
      setPreviewData(null);
      onSuccess();
    } catch (err) {
      console.error("Import Excel error:", err);
      const msg =
        err.response?.data?.message ||
        "นำเข้าไฟล์ Excel ไม่สำเร็จ กรุณาลองใหม่";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iex-overlay" onClick={loading ? null : onClose}>
      <div className="iex-modal" onClick={(e) => e.stopPropagation()}>
        <button className="iex-close-btn" onClick={onClose} disabled={loading}>
          ×
        </button>
        <h2>นำเข้า Excel</h2>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          disabled={loading}
        />

        <button
          className="iex-upload-btn"
          onClick={handleUpload}
          disabled={loading || !previewData}
        >
          {loading ? "กำลังนำเข้า..." : "นำเข้า Excel"}
        </button>

        {previewData && (
          <>
            <h3 className="iex-preview-title">ตัวอย่างข้อมูล</h3>
            <div className="iex-preview-table-wrapper">
              <table>
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.keys(row).map((col) => (
                        <td key={col}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
