// src/components/Admin/managedocuments/ManageAllModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "./ManageAllModal.css";

export default function ManageAllModal({
  documents,
  onClose,
  onDeleteSelected,
}) {
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  // รีเซ็ตการเลือกเมื่อ list เปลี่ยน
  useEffect(() => {
    setSelected(new Set());
  }, [documents]);

  const allIds = documents.map((d) => d.id);
  const allSelected = selected.size === documents.length;

  const toggleOne = (id) =>
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });

  const selectAll = () => setSelected(new Set(allIds));
  const clearAll = () => setSelected(new Set());

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`ลบเอกสารที่เลือก (${selected.size} รายการ)?`)) {
      return;
    }

    setSubmitting(true);
    try {
      // เรียก callback ฝั่ง parent
      await onDeleteSelected(Array.from(selected));
      toast.success(`ลบเอกสาร ${selected.size} รายการสำเร็จ`);
      clearAll();
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("ไม่สามารถลบเอกสารได้ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  // ถ้า submitting จะไม่ให้คลิกปิด overlay
  return (
    <div className="modal-overlay" onClick={submitting ? null : onClose}>
      <div
        className="modal-content manage-all"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h4>จัดการเอกสารทั้งหมด</h4>
        </header>

        <div className="modal-body">
          <div className="table-wrapper">
            <table className="manage-all-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => (allSelected ? clearAll() : selectAll())}
                      disabled={submitting}
                    />
                  </th>
                  <th>ชื่อเอกสาร</th>
                  <th>วันที่ส่ง</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(doc.id)}
                          onChange={() => toggleOne(doc.id)}
                          disabled={submitting}
                        />
                      </td>
                      <td>{doc.title}</td>
                      <td>
                        {new Date(doc.uploadDate).toLocaleDateString("th-TH")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-doc">
                      ไม่มีเอกสาร
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="modal-footer">
          <div className="bulk-actions-footer">
            <button
              onClick={selectAll}
              disabled={allSelected || submitting}
              className="bulk-btn"
            >
              เลือกทั้งหมด
            </button>
            <button
              onClick={clearAll}
              disabled={selected.size === 0 || submitting}
              className="bulk-btn"
            >
              ยกเลิกเลือกทั้งหมด
            </button>
            <button
              onClick={handleDelete}
              disabled={selected.size === 0 || submitting}
              className="bulk-btn delete-selected"
            >
              {submitting ? "กำลังลบ..." : `ลบที่เลือก (${selected.size})`}
            </button>
          </div>
          <button className="btn-close" onClick={onClose} disabled={submitting}>
            ปิด
          </button>
        </footer>
      </div>
    </div>
  );
}

ManageAllModal.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      uploadDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  // onDeleteSelected ควรคืนค่า Promise เพื่อ await ใน modal
  onDeleteSelected: PropTypes.func.isRequired,
};
