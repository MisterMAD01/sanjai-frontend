// DocumentTable.jsx
import React from "react";
import PropTypes from "prop-types";
import "./DocumentTable.css";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faDownload } from "@fortawesome/free-solid-svg-icons";

const DocumentTable = ({ documents, onDetail, onDownload }) => {
  return (
    <table className="my-documents-table">
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ชื่อเอกสาร</th>
          <th>วันที่ส่ง</th>
          <th>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        {documents.length > 0 ? (
          documents.map((doc, idx) => (
            <tr key={doc.id}>
              <td>{idx + 1}</td>
              <td>{doc.title}</td>
              <td>{new Date(doc.uploadDate).toLocaleDateString("th-TH")}</td>
              <td className="doc-action-group">
                <button
                  className="icon-btn detail"
                  onClick={() => onDetail(doc)}
                  aria-label="ดูรายละเอียด"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="icon-btn download"
                  onClick={() => onDownload(doc)}
                  aria-label="ดาวน์โหลด"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="no-doc">
              ไม่มีเอกสาร
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      uploadDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDetail: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default DocumentTable;
