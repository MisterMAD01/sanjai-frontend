// src/components/User/mydocuments/DocumentTable.jsx
import React from "react";
import PropTypes from "prop-types";
import "./DocumentTable.css";

const DocumentTable = ({ documents, onDetail, onDownload }) => {
  return (
    <table className="my-documents-table">
      <thead>
        <tr>
          <th>ลำดับ</th>
          <th>ชื่อเอกสาร</th>
          <th>ผู้ส่ง</th>
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
              <td>{doc.sender || "-"}</td>
              <td>{new Date(doc.uploadDate).toLocaleDateString("th-TH")}</td>
              <td className="doc-action-group">
                <button
                  className="action-btn detail"
                  onClick={() => onDetail(doc)}
                >
                  ดูรายละเอียด
                </button>
                <button
                  className="action-btn download"
                  onClick={() => onDownload(doc)}
                >
                  ดาวน์โหลด
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="no-doc">
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
      sender: PropTypes.string,
      uploadDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDetail: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default DocumentTable;
