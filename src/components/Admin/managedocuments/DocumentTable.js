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
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
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
