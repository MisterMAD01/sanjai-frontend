import React, { useState } from "react";
import PropTypes from "prop-types";
import "./DocumentTable.css";

const DocumentTable = ({ documents, onDetail, onDownload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const docsPerPage = 13;

  const totalPages = Math.ceil(documents.length / docsPerPage);
  const startIndex = (currentPage - 1) * docsPerPage;
  const currentDocs = documents.slice(startIndex, startIndex + docsPerPage);

  return (
    <div className="dt-table-wrapper">
      <table className="dt-table">
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
          {currentDocs.length > 0 ? (
            currentDocs.map((doc, idx) => (
              <tr key={doc.id}>
                <td>{startIndex + idx + 1}</td>
                <td>{doc.title}</td>
                <td>{doc.sender || "-"}</td>
                <td>{new Date(doc.uploadDate).toLocaleDateString("th-TH")}</td>
                <td className="dt-action-group">
                  <button
                    className="dt-action-btn dt-detail-btn"
                    onClick={() => onDetail(doc)}
                    title="ดูรายละเอียด"
                  >
                    ดูรายละเอียด
                  </button>
                  <button
                    className="dt-action-btn dt-download-btn"
                    onClick={() => onDownload(doc)}
                    title="ดาวน์โหลด"
                  >
                    ดาวน์โหลด
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="dt-no-doc">
                ไม่มีเอกสาร
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <div className="dt-pagination">
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
    </div>
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
