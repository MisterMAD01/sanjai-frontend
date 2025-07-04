import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaCheckSquare,
  FaSquare,
  FaTrash,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import "./ManageAllModal.css";

export default function ManageAllModal({
  documents,
  onClose,
  onDeleteSelected,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 10;

  useEffect(() => {
    setSelected(new Set());
    setCurrentPage(1);
  }, [documents, searchTerm]);

  // Filter by search term
  const filteredDocs = documents.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.title.toLowerCase().includes(term) ||
      (doc.description || "").toLowerCase().includes(term) ||
      (doc.sender || "").toLowerCase().includes(term) ||
      (doc.recipient || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);
  const startIndex = (currentPage - 1) * docsPerPage;
  const currentDocs = filteredDocs.slice(startIndex, startIndex + docsPerPage);

  const allIds = currentDocs.map((d) => d.id);
  const allSelected = allIds.every((id) => selected.has(id));

  const toggleOne = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const selectAll = () => {
    setSelected((prev) => {
      const copy = new Set(prev);
      allIds.forEach((id) => copy.add(id));
      return copy;
    });
  };

  const clearAll = () => setSelected(new Set());

  const handleDelete = async () => {
    const toDelete = Array.from(selected);
    if (toDelete.length === 0) return;
    if (!window.confirm(`ลบเอกสารที่เลือก (${toDelete.length} รายการ)?`))
      return;

    setSubmitting(true);
    try {
      await onDeleteSelected(toDelete);
      clearAll();
    } catch (err) {
      console.error("Bulk delete error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getPaginationButtons = () => {
    const maxVisible = 5;
    const buttons = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else if (currentPage <= 3) {
      buttons.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      buttons.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      buttons.push(1, "...", currentPage, "...", totalPages);
    }
    return buttons;
  };

  return (
    <div className="mam-modal-overlay" onClick={onClose}>
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
              disabled={allSelected || submitting}
            >
              <FaCheckSquare /> เลือกทั้งหมด
            </button>
            <button
              className="mam-bulk-btn"
              onClick={clearAll}
              disabled={selected.size === 0 || submitting}
            >
              <FaSquare /> ยกเลิกเลือก
            </button>
          </div>
          <div className="mam-search-container">
            <FaSearch className="mam-search-icon" />
            <input
              type="text"
              placeholder="ค้นหา…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mam-search-input"
            />
          </div>
        </header>

        <div className="mam-modal-body">
          <div className="mam-table-wrapper">
            <table className="mam-manage-all-table">
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
                  <th>ลำดับ</th>
                  <th>ชื่อเอกสาร</th>
                  <th>รายละเอียด</th>
                  <th>ผู้ส่ง</th>
                  <th>ผู้รับ</th>
                  <th>วันที่</th>
                </tr>
              </thead>
              <tbody>
                {currentDocs.length > 0 ? (
                  currentDocs.map((doc, idx) => (
                    <tr key={doc.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(doc.id)}
                          onChange={() => toggleOne(doc.id)}
                          disabled={submitting}
                        />
                      </td>
                      <td>{startIndex + idx + 1}</td>
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
                      ไม่พบเอกสารตามเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mam-pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
          {getPaginationButtons().map((b, i) =>
            b === "..." ? (
              <span key={i} className="ellipsis">
                …
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(b)}
                className={currentPage === b ? "active" : ""}
              >
                {b}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
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
