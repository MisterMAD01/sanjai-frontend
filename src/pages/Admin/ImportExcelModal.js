// src/components/ImportExcelModal.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import api from "../../api";
import "react-toastify/dist/ReactToastify.css";
import "./ImportExcelModal.css";

export default function ImportExcelModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [dataType, setDataType] = useState("members");
  const [loading, setLoading] = useState(false);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    // Read a preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        if (json.length > 0) {
          setPreviewHeaders(json[0]);
          setPreviewData(json.slice(1));
        }
      } catch (err) {
        console.error(err);
        toast.error("ไม่สามารถอ่านตัวอย่างไฟล์ได้");
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warn("กรุณาเลือกไฟล์ Excel ก่อนนำเข้า");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const res = await api.post(
        `/api/data/import?type=${encodeURIComponent(dataType)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { count, message } = res.data;
      toast.success(message || `นำเข้า ${dataType} สำเร็จ (${count} รายการ)`);
      onSuccess(dataType, count);
    } catch (err) {
      console.error("Import error:", err);
      const msg =
        err.response?.data?.message ||
        "เกิดข้อผิดพลาดในการนำเข้า กรุณาลองใหม่อีกครั้ง";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-modal-overlay" onClick={loading ? null : onClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()}>
        <h3>นำเข้า Excel</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dataType">ประเภทข้อมูล:</label>
            <select
              id="dataType"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              disabled={loading}
            >
              <option value="members">สมาชิก</option>
              <option value="users">ผู้ใช้</option>
              <option value="both">สมาชิก + ผู้ใช้</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="excelFile">เลือกไฟล์ Excel:</label>
            <input
              id="excelFile"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {previewData.length > 0 && (
            <div className="preview-section">
              <h4>ตัวอย่างข้อมูล (Preview)</h4>
              <div className="preview-table-wrapper">
                <table className="preview-table">
                  <thead>
                    <tr>
                      {previewHeaders.map((hdr, idx) => (
                        <th key={idx}>{hdr}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {previewHeaders.map((_, cIdx) => (
                          <td key={cIdx}>{row[cIdx] ?? ""}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="modal-buttons">
            <button
              type="submit"
              className="data-btn import"
              disabled={loading}
            >
              {loading ? "กำลังนำเข้า..." : "นำเข้า"}
            </button>
            <button
              type="button"
              className="data-btn"
              onClick={onClose}
              disabled={loading}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
