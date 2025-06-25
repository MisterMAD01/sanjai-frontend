import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCheckSquare, FaSquare, FaTrash, FaTimes } from "react-icons/fa";
import "./ManageAllModal.css";

export default function ManageAllModal({
  documents,
  onClose,
  onDeleteSelected,
}) {
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelected(new Set());
  }, [documents]);

  const allIds = documents.map((d) => d.id);
  const allSelected = selected.size === documents.length;

  const toggleOne = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const selectAll = () => setSelected(new Set(allIds));
  const clearAll = () => setSelected(new Set());

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`ลบเอกสารที่เลือก (${selected.size} รายการ)?`)) return;

    setSubmitting(true);
    try {
      await onDeleteSelected(Array.from(selected));
      clearAll();
    } catch (err) {
      console.error("Bulk delete error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mam-modal-overlay">
      <div
        className="mam-modal-content mam-manage-all"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mam-modal-header">
          <h4>จัดการเอกสารทั้งหมด</h4>
          <div className="mam-bulk-header-buttons">
            <button
              className="mam-bulk-btn"
              onClick={selectAll}
              disabled={allSelected}
            >
              <FaCheckSquare /> เลือกทั้งหมด
            </button>
            <button
              className="mam-bulk-btn"
              onClick={clearAll}
              disabled={selected.size === 0}
            >
              <FaSquare /> ยกเลิกเลือก
            </button>
          </div>
        </header>

        <div className="mam-modal-body">
          <div className="mam-table-wrapper">
            <table className="mam-manage-all-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ลำดับ</th>
                  <th>ชื่อเอกสาร</th>
                  <th>รายละเอียด</th>
                  <th>ผู้ส่ง</th>
                  <th>ผู้รับ</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc, idx) => (
                    <tr key={doc.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(doc.id)}
                          onChange={() => toggleOne(doc.id)}
                          disabled={submitting}
                        />
                      </td>
                      <td>{idx + 1}</td>
                      <td>{doc.title}</td>
                      <td>{doc.description || "-"}</td>
                      <td>{doc.sender || "-"}</td>
                      <td>{doc.recipient || "-"}</td>
                      <td>
                        {new Date(doc.uploadDate).toLocaleDateString("th-TH")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="mam-no-doc">
                      ไม่มีเอกสาร
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mam-modal-footer">
          <button
            className="mam-bulk-btn mam-delete-selected"
            onClick={handleDelete}
            disabled={selected.size === 0 || submitting}
          >
            <FaTrash /> ลบที่เลือก ({selected.size})
          </button>
          <button
            className="mam-btn-close"
            onClick={onClose}
            disabled={submitting}
          >
            <FaTimes /> ปิด
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
      description: PropTypes.string,
      sender: PropTypes.string,
      recipient: PropTypes.string,
      uploadDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onDeleteSelected: PropTypes.func.isRequired,
};
