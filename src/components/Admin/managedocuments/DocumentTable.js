import React, { useState } from "react";
import PropTypes from "prop-types";
import DocumentDetailModal from "./DocumentDetailModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "./DocumentTable.css";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DocumentTable = ({ documents, onDelete }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 13;
  const totalPages = Math.ceil(documents.length / docsPerPage);
  const startIndex = (currentPage - 1) * docsPerPage;
  const currentDocs = documents.slice(startIndex, startIndex + docsPerPage);

  const handleDeleteClick = (doc) => {
    setDocToDelete(doc);
  };

  const confirmDelete = () => {
    onDelete(docToDelete.id);
    setDocToDelete(null);
  };

  const cancelDelete = () => {
    setDocToDelete(null);
  };

  return (
    <div className="document-table-container">
      <h3>เอกสารที่เคยส่ง</h3>
      <div className="table-wrapper">
        <table className="document-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อเอกสาร</th>
              <th>ผู้ส่ง</th>
              <th>ผู้รับ</th>
              <th>วันที่ส่ง</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {currentDocs.length > 0 ? (
              currentDocs.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{doc.title}</td>
                  <td>{doc.sender || "-"}</td>
                  <td>{doc.recipient || "-"}</td>
                  <td>
                    {new Date(doc.uploadDate).toLocaleDateString("th-TH")}
                  </td>
                  <td className="doc-action-group">
                    <button
                      className="icon-btn view"
                      onClick={() => setSelectedDoc(doc)}
                      aria-label="ดูรายละเอียด"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDeleteClick(doc)}
                      aria-label="ลบเอกสาร"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-doc">
                  ไม่มีเอกสาร
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>

      {/* ดูรายละเอียด */}
      {selectedDoc && (
        <DocumentDetailModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {/* ยืนยันลบ */}
      <ConfirmDeleteModal
        isOpen={!!docToDelete}
        title={docToDelete?.title}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      sender: PropTypes.string,
      recipient: PropTypes.string,
      uploadDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DocumentTable;
